#!/usr/bin/env python3
"""
Build a 36-frame 360 spin from one of the supplied product clips.

WHY THIS IS NOT JUST "TAKE EVERY NTH FRAME"
-------------------------------------------
The source clips are 240-frame renders whose rotation is badly non-uniform.
Measured on the black colourway:

  * frames 0-20    the garment is essentially stationary (ease-in)
  * frames 90-114  the rotation STALLS mid-clip; the cloth only sways
  * frames 185-239 rotation has stopped; the cloth settles

and the clip contains two revolutions, not one:

  rev 1:  f14 front(0deg) -> f44 edge(90) -> f60 back(180) -> f79 edge(270) -> f94 front(360)
  rev 2:  f94 -> f131 -> f146 -> f164 -> f183      (this one contains the stall)

Revolution 1 is the one we extract: every other revolution in the clip
contains the stall.

Sampling every Nth frame preserves all of that, so the product would spin fast
in places and crawl in others and dragging back would not return you to the
same angle. Instead we measure the angle of every frame and resample on even
angular steps.

HOW THE ANGLE IS MEASURED
-------------------------
Silhouette width is widest facing front/back and narrowest edge-on, so for a
garment on a turntable it follows

    w(theta) = sqrt(L^2 cos^2(theta) + T^2 sin^2(theta))

with L the full width and T the edge-on width. Inverting that inside each
quarter turn (whose ends are the measured landmarks above) gives a continuous,
monotonic angle track. Output frames are then picked at 10 degree steps.

HOW THE BACKGROUND IS REMOVED
-----------------------------
The clips carry a baked-in "transparency" checkerboard, which must never ship.
It is static across all 240 frames, so the board is recovered empirically:
at each pixel, the frames where the garment is elsewhere reveal the true board
value. Pixels the garment never uncovers lie inside every silhouette and are
therefore always foreground, so no board estimate is needed for them.

A colour-distance key alone speckles the cream band, whose luma sits near the
board's so it keys differently over light and dark cells. Filling interior
holes closes that, and a local-density test drops isolated codec speckle
without touching the fringe (thin, but clustered).

The soft drop shadow overlaps the fringe vertically at edge-on angles, so it
cannot simply be cropped off. It is separated by tone instead: the shadow is a
light neutral wash over the board while the fringe is very dark or strongly
coloured.

USAGE
    python tools/build360.py --clip main --out public/products/360/ruana-charcoal
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np

try:
    import imageio_ffmpeg
except ImportError:
    sys.exit("pip install imageio-ffmpeg")
from PIL import Image

# --------------------------------------------------------------------------
# Per-clip configuration.
#
# `landmarks` are (frame, degrees) for the revolution we extract. They were
# measured from the silhouette width curve and confirmed visually; re-derive
# them with --analyse if a clip is replaced.
# --------------------------------------------------------------------------
#
# The three clips are NOT identically timed — verified with --analyse. main and
# rust run close together but olive's second half is noticeably slower, so each
# clip carries its own landmarks. Front/back identity of each maximum was
# confirmed by eye (the front has the open V, the back is a closed panel).
#
CLIPS = {
    "main": dict(   # charcoal / SH-232
        file="Role_You_are_a_luxury_product.mp4",
        board=(178.0, 221.0),
        landmarks=[(14, 0), (44, 90), (60, 180), (79, 270), (94, 360)],
    ),
    "olive": dict(  # olive / SH-233
        file="Role_You_are_a_luxury_product (1).mp4",
        board=(154.0, 199.0),
        landmarks=[(12, 0), (44, 90), (60, 180), (85, 270), (110, 360)],
    ),
    "rust": dict(   # rust / SH-221
        file="Role_You_are_a_luxury_product (2).mp4",
        board=(166.0, 214.0),
        landmarks=[(14, 0), (43, 90), (59, 180), (78, 270), (95, 360)],
    ),
}

SHADOW_TOP = 1245      # below this is board only; the shadow ellipse ends ~1227
SHADOW_ZONE = 1040     # from here down, fringe and drop shadow overlap
# The shadow only ever darkens the board to a fraction of its own level, so the
# cut is expressed relative to that rather than as an absolute value — the
# three clips are graded differently (board darks of 178, 154 and 166).
SHADOW_FLOOR = 0.45
KEY_HI = 34.0          # colour distance above which a pixel is solid garment
KEY_LO = 12.0          # ...and below which it is solid board
FRAMES = 36            # 10 degrees per step


# ---------------------------------------------------------------- utilities
def boxmean(a: np.ndarray, r: int) -> np.ndarray:
    a = np.pad(a.astype(np.float64), r, mode="edge")
    ii = np.pad(a.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
    H, W = a.shape[0] - 2 * r, a.shape[1] - 2 * r
    y0 = np.arange(H)[:, None]; x0 = np.arange(W)[None, :]
    y1, x1 = y0 + 2 * r + 1, x0 + 2 * r + 1
    return (ii[y1, x1] - ii[y0, x1] - ii[y1, x0] + ii[y0, x0]) / (2 * r + 1) ** 2


def _grow(mask: np.ndarray, k: int) -> np.ndarray:
    out = mask.copy()
    for _ in range(k):
        n = out.copy()
        n[1:, :] |= out[:-1, :]; n[:-1, :] |= out[1:, :]
        n[:, 1:] |= out[:, :-1]; n[:, :-1] |= out[:, 1:]
        out = n
    return out


def dilate(m, k): return _grow(m, k)
def erode(m, k):  return ~_grow(~m, k)


def fill_holes(mask: np.ndarray) -> np.ndarray:
    """Flood background in from the border; unreached background is interior."""
    bg = ~mask
    reach = np.zeros_like(bg)
    reach[0, :] = bg[0, :]; reach[-1, :] = bg[-1, :]
    reach[:, 0] = bg[:, 0]; reach[:, -1] = bg[:, -1]
    while True:
        nxt = _grow(reach, 1) & bg
        if np.array_equal(nxt, reach):
            return ~reach
        reach = nxt


def read_frames(path: Path) -> np.ndarray:
    gen = imageio_ffmpeg.read_frames(str(path), pix_fmt="rgb24")
    meta = next(gen)
    w, h = meta["size"]
    return np.stack([np.frombuffer(b, np.uint8).reshape(h, w, 3) for b in gen])


# ------------------------------------------------------------------- board
def recover_board(A: np.ndarray, dark: float, light: float):
    """The board is static, so frames where the garment is elsewhere reveal it."""
    lum = A.astype(np.float32).mean(axis=3)
    sat = A.max(axis=3).astype(np.int16) - A.min(axis=3).astype(np.int16)
    boardish = (sat < 20) & (lum > dark - 14) & (lum < light + 14)
    cover = boardish.mean(axis=0)
    with np.errstate(all="ignore"):
        med = np.nanmedian(np.where(boardish, lum, np.nan), axis=0)
    board = np.where(np.abs(med - dark) < np.abs(med - light), dark, light)
    board = np.nan_to_num(board, nan=light)
    return board.astype(np.float32), cover


def matte(frame: np.ndarray, board: np.ndarray, dark: float) -> np.ndarray:
    F = frame[:SHADOW_TOP].astype(np.float32)
    B = board[:SHADOW_TOP]
    d = np.abs(F - B[:, :, None]).max(axis=2)
    # Deliberately no board-correlation veto. It rejected the shadow but also
    # punched holes in the cream band, whose weave locally resembles the
    # board's checks. The shadow is handled by tone below instead, and
    # isolated codec speckle by local density: fringe strands are thin but
    # clustered, stray specks are not.
    raw = d > KEY_HI

    # Where the fringe hangs into the drop shadow they overlap vertically, so
    # a horizontal crop would slice the fringe off at edge-on angles. They
    # separate on tone instead: the shadow is a light neutral wash over the
    # board, the fringe is very dark (or, on the olive/rust colourways,
    # strongly coloured). Anything light-and-neutral down here is shadow.
    lum = F.mean(axis=2)
    sat = F.max(axis=2) - F.min(axis=2)
    shadow = np.zeros_like(raw)
    shadow[SHADOW_ZONE:] = (lum[SHADOW_ZONE:] > SHADOW_FLOOR * dark) & (sat[SHADOW_ZONE:] < 22)
    raw &= ~shadow

    raw &= boxmean(raw.astype(np.float32), 15) > 0.15
    solid = fill_holes(raw)
    solid = erode(dilate(solid, 1), 1)
    soft = np.clip((d - KEY_LO) / (KEY_HI - KEY_LO), 0.0, 1.0)
    edge = dilate(solid, 3) & ~erode(solid, 3)
    a = solid.astype(np.float32)
    a[edge] = soft[edge]
    a[~dilate(solid, 3)] = 0.0
    return a


# ------------------------------------------------------------------- angle
def silhouette_widths(A: np.ndarray, board: np.ndarray, dark: float, lo: int, hi: int):
    widths = np.zeros(hi - lo + 1)
    alphas = {}
    for k, i in enumerate(range(lo, hi + 1)):
        a = matte(A[i], board, dark)
        alphas[i] = a
        cols = np.flatnonzero((a > 0.5).sum(axis=0) > 8)
        widths[k] = cols.max() - cols.min() + 1 if len(cols) else 0
    return widths, alphas


def angle_track(widths: np.ndarray, lo: int, landmarks) -> np.ndarray:
    """Continuous degrees per source frame, from the ellipse width model.

    Each quarter turn uses its OWN endpoint widths. The garment is not
    symmetric — the open front measures ~667px across while the closed back
    measures ~720 — so a single global L would mis-place every front-side
    angle and, worse, make the pinned 0 degree landmark disagree with its own
    measured width.
    """
    th = np.zeros_like(widths)
    for (f0, a0), (f1, a1) in zip(landmarks, landmarks[1:]):
        w0, w1 = widths[f0 - lo], widths[f1 - lo]
        Lq, Tq = max(w0, w1), min(w0, w1)
        denom = max(Lq * Lq - Tq * Tq, 1e-6)
        for i in range(f0, f1 + 1):
            w = float(np.clip(widths[i - lo], Tq, Lq))
            base = np.degrees(np.arccos(np.sqrt(np.clip((w * w - Tq * Tq) / denom, 0.0, 1.0))))
            # base is 0 at the wide end of this quarter and 90 at the narrow end
            th[i - lo] = a0 + base if w0 >= w1 else a1 - base
        th[f0 - lo], th[f1 - lo] = a0, a1
    return np.maximum.accumulate(th)                       # rotation is one-way


def find_landmarks(widths: np.ndarray, lo: int):
    """Locate quarter-turn landmarks from the width curve.

    Only *prominent* extrema count. The curve carries small wobbles from cloth
    sway that are not turning points, so a candidate must sit near the global
    extremes to qualify: facing views are near the widest, edge-on near the
    narrowest.
    """
    k = 5
    p = k // 2
    s = np.convolve(np.pad(widths, p, mode="edge"), np.ones(k) / k, mode="valid")[:len(widths)]
    lo_w, hi_w = s.min(), s.max()
    span = hi_w - lo_w
    wide_gate, narrow_gate = lo_w + 0.72 * span, lo_w + 0.28 * span

    out = []
    for i in range(3, len(s) - 3):
        win = s[i - 3:i + 4]
        if s[i] == win.max() and s[i] >= wide_gate:
            out.append((i + lo, "max", float(s[i])))
        elif s[i] == win.min() and s[i] <= narrow_gate:
            out.append((i + lo, "min", float(s[i])))
    # collapse neighbours of the same kind
    merged = []
    for f, kind, v in out:
        if merged and merged[-1][1] == kind and f - merged[-1][0] < 12:
            if (kind == "max" and v > merged[-1][2]) or (kind == "min" and v < merged[-1][2]):
                merged[-1] = (f, kind, v)
        else:
            merged.append((f, kind, v))
    return merged, s


def pick_frames(theta: np.ndarray, lo: int, n: int):
    """Source frame index for each of n evenly spaced angles."""
    targets = np.arange(n) * (360.0 / n)
    return [int(lo + np.argmin(np.abs(theta - t))) for t in targets], targets


# -------------------------------------------------------------------- main
def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--clip", default="main", choices=list(CLIPS))
    ap.add_argument("--videos", default="videos")
    ap.add_argument("--out")
    ap.add_argument("--analyse", action="store_true",
                    help="print the width curve and detected landmarks, write nothing")
    ap.add_argument("--scan", default="0:200",
                    help="frame range to analyse, e.g. 0:200")
    ap.add_argument("--size", type=int, default=1000)
    ap.add_argument("--quality", type=int, default=82)
    args = ap.parse_args()

    cfg = CLIPS[args.clip]
    src = Path(args.videos) / cfg["file"]
    if not src.exists():
        sys.exit(f"missing {src}")
    if not args.analyse and not args.out:
        sys.exit("--out is required unless --analyse is given")

    print(f"reading {src.name}")
    A = read_frames(src)
    print(f"  {len(A)} frames @ {A.shape[2]}x{A.shape[1]}")

    dark, light = cfg["board"]
    board, cover = recover_board(A, dark, light)
    print(f"  board recovered; {(cover > 0).mean() * 100:.1f}% of pixels saw it directly")

    if args.analyse:
        a, b = (int(v) for v in args.scan.split(":"))
        w, _ = silhouette_widths(A, board, dark, a, b)
        marks, sm = find_landmarks(w, a)
        print(f"\nwidth curve f{a}-{b} (smoothed):")
        loW, hiW = sm.min(), sm.max()
        lut = {f: k for f, k, _ in marks}
        for i in range(a, b + 1):
            tag = f"   <== {lut[i].upper()}" if i in lut else ""
            bar = "#" * int((sm[i - a] - loW) / max(hiW - loW, 1) * 46)
            print(f"  f{i:3d} {sm[i-a]:5.0f} {bar}{tag}")
        print("\nprominent landmarks:")
        for f, k, v in marks:
            print(f"  f{f:3d}  {k}  w={v:.0f}")
        print("\nuse these to set `landmarks` for this clip in CLIPS above,")
        print("labelling each maximum front(0/360) or back(180) by eye.")
        return

    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    lms = cfg["landmarks"]
    lo, hi = lms[0][0], lms[-1][0]
    print(f"  extracting revolution f{lo}-f{hi} ({hi - lo + 1} source frames)")

    widths, alphas = silhouette_widths(A, board, dark, lo, hi)
    theta = angle_track(widths, lo, lms)
    picks, targets = pick_frames(theta, lo, FRAMES)

    err = [abs(theta[p - lo] - t) for p, t in zip(picks, targets)]
    print(f"  angle error: mean {np.mean(err):.2f}deg  max {np.max(err):.2f}deg")
    print(f"  distinct source frames: {len(set(picks))}/{FRAMES}")

    # union bounding box across the chosen frames, so nothing crops mid-spin
    ys0 = ys1 = xs0 = xs1 = None
    for p in picks:
        m = alphas[p] > 0.5
        ys, xs = np.where(m)
        ys0 = ys.min() if ys0 is None else min(ys0, ys.min())
        ys1 = ys.max() if ys1 is None else max(ys1, ys.max())
        xs0 = xs.min() if xs0 is None else min(xs0, xs.min())
        xs1 = xs.max() if xs1 is None else max(xs1, xs.max())
    pad = 12
    ys0, xs0 = max(0, ys0 - pad), max(0, xs0 - pad)
    ys1, xs1 = min(SHADOW_TOP - 1, ys1 + pad), min(A.shape[2] - 1, xs1 + pad)
    bw, bh = xs1 - xs0 + 1, ys1 - ys0 + 1
    side = max(bw, bh)
    print(f"  crop {bw}x{bh} -> square {side} -> {args.size}px")

    manifest = []
    for k, p in enumerate(picks):
        a = alphas[p][ys0:ys1 + 1, xs0:xs1 + 1]
        rgb = A[p][:SHADOW_TOP][ys0:ys1 + 1, xs0:xs1 + 1]
        rgba = np.dstack([rgb, (a * 255).astype(np.uint8)])
        sq = np.zeros((side, side, 4), np.uint8)
        oy, ox = (side - bh) // 2, (side - bw) // 2
        sq[oy:oy + bh, ox:ox + bw] = rgba
        img = Image.fromarray(sq, "RGBA").resize((args.size, args.size), Image.LANCZOS)
        name = f"{k:03d}.webp"
        img.save(out / name, "WEBP", quality=args.quality, method=6)
        manifest.append(dict(index=k, angle=round(float(targets[k]), 1),
                             source_frame=int(p)))

    total = sum((out / f"{k:03d}.webp").stat().st_size for k in range(FRAMES))
    print(f"  wrote {FRAMES} frames, {total/1024:.0f} KB total "
          f"({total/FRAMES/1024:.1f} KB avg)")
    (out / "manifest.json").write_text(json.dumps(
        dict(frames=FRAMES, size=args.size, clip=args.clip,
             source=cfg["file"], revolution=[lo, hi], steps=manifest), indent=2))


if __name__ == "__main__":
    main()
