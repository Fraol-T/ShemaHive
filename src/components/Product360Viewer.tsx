"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Rotate3D } from "lucide-react";

/* prefers-reduced-motion is external state, so it is subscribed to rather than
   mirrored into an effect. The server snapshot is false: no motion assumed
   until the client tells us otherwise. */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

interface Product360ViewerProps {
  /** Directory holding 000.webp … {frameCount-1}.webp */
  frames: string;
  frameCount?: number;
  alt: string;
  /** Shown while loading, on failure, and under reduced-motion. */
  poster: string;
  className?: string;
}

type Phase = "idle" | "loading" | "ready" | "failed";

const src = (dir: string, i: number) => `${dir}/${String(i).padStart(3, "0")}.webp`;
const wrap = (i: number, n: number) => ((i % n) + n) % n;

export default function Product360Viewer({
  frames,
  frameCount = 36,
  alt,
  poster,
  className = "",
}: Product360ViewerProps) {
  /* Only the async outcome is stored. Whether we are loading at all is derived
     from `shouldLoad`, which keeps the effect free of synchronous setState.
     The parent keys this component by frame directory, so switching colourway
     remounts and resets these naturally. */
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [loaded, setLoaded] = useState(0);
  const [index, setIndex] = useState(0);
  const [touched, setTouched] = useState(false);
  const [optedIn, setOptedIn] = useState(false);

  const hostRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; startIndex: number } | null>(null);
  const spin = useRef<number | null>(null);

  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  const shouldLoad = !reduced || optedIn;
  const phase: Phase = shouldLoad ? status : "idle";

  /* Preload every frame before the viewer becomes interactive. Half-loaded
     frames stuttering under the first drag is worse than no viewer at all.

     Mounting is the laziness boundary: this component only exists once Quick
     View is open, so the catalog never pays for 36 frames. An extra
     IntersectionObserver on top bought nothing and added a failure mode where
     the viewer could sit idle forever if the callback never ran. */
  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;
    let done = 0;

    /* Readiness waits on `load`, not `decode()`. decode() does not settle
       while the document is hidden, so gating on it would strand the viewer
       at 0% for anyone who opens Quick View and switches tabs. decode is
       still called, best-effort, so the first frame swap does not jank. */
    Promise.all(
      Array.from({ length: frameCount }, (_, i) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          const finish = (ok: boolean) => {
            if (!cancelled) setLoaded(++done);
            resolve(ok);
          };
          img.onload = () => {
            void img.decode?.().catch(() => undefined);
            finish(true);
          };
          img.onerror = () => finish(false);
          img.src = src(frames, i);
        })
      )
    ).then((results) => {
      if (cancelled) return;
      // A missing frame would leave a hole in the rotation, so it is all or
      // nothing — the poster is a better experience than a broken spin.
      setStatus(results.every(Boolean) ? "ready" : "failed");
    });

    return () => { cancelled = true; };
  }, [shouldLoad, frames, frameCount]);

  /* A short auto-rotate advertises that the image is draggable. It stops the
     moment the user touches it, and never runs under reduced motion. */
  useEffect(() => {
    if (phase !== "ready" || touched || reduced) return;
    let n = 0;
    spin.current = window.setInterval(() => {
      setIndex((i) => wrap(i + 1, frameCount));
      if (++n >= frameCount) {
        if (spin.current) window.clearInterval(spin.current);
        spin.current = null;
      }
    }, 70);
    return () => {
      if (spin.current) window.clearInterval(spin.current);
      spin.current = null;
    };
  }, [phase, touched, reduced, frameCount]);

  const stopSpin = useCallback(() => {
    if (spin.current) {
      window.clearInterval(spin.current);
      spin.current = null;
    }
    setTouched(true);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (phase !== "ready") return;
    stopSpin();
    drag.current = { id: e.pointerId, x: e.clientX, startIndex: index };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const width = hostRef.current?.clientWidth ?? 1;
    // One full drag across the viewer turns the product roughly once.
    const perFrame = (width * 1.15) / frameCount;
    const steps = Math.round((e.clientX - d.x) / perFrame);
    setIndex(wrap(d.startIndex - steps, frameCount));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (phase !== "ready") return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      stopSpin();
      setIndex((i) => wrap(i + (e.key === "ArrowRight" ? 1 : -1), frameCount));
    }
  };

  const showPoster = phase !== "ready";
  const pct = Math.round((loaded / frameCount) * 100);

  return (
    <div
      ref={hostRef}
      className={`relative select-none overflow-hidden bg-surface-sunken ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={showPoster ? poster : src(frames, index)}
        alt={
          phase === "ready"
            ? `${alt}, rotated ${Math.round((index / frameCount) * 360)} degrees`
            : alt
        }
        draggable={false}
        className="w-full h-full object-contain object-center pointer-events-none"
      />

      {/* Drag surface. touch-action pan-y lets vertical swipes scroll the page
          while horizontal ones rotate — no preventDefault gymnastics, and no
          way for a mobile user to get trapped on the product. */}
      {phase === "ready" && (
        <div
          role="slider"
          tabIndex={0}
          aria-label={`${alt} — drag to rotate`}
          aria-valuemin={0}
          aria-valuemax={359}
          aria-valuenow={Math.round((index / frameCount) * 360)}
          aria-valuetext={`${Math.round((index / frameCount) * 360)} degrees`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          className="absolute inset-0 cursor-ew-resize touch-pan-y focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        />
      )}

      {/* Loading */}
      {phase === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-sunken/85 backdrop-blur-sm">
          <Rotate3D className="w-6 h-6 text-ink animate-spin-slow" />
          <div className="w-32 h-1 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-gold transition-[width] duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
            Loading 360° view {pct}%
          </span>
        </div>
      )}

      {/* Reduced motion: static by default, 360 available on request. */}
      {phase === "idle" && reduced && !optedIn && (
        <button
          onClick={() => setOptedIn(true)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-navy text-on-navy text-[11px] font-semibold rounded-xs shadow-md hover:bg-ink transition-colors"
        >
          <Rotate3D className="w-3.5 h-3.5 text-gold" />
          View in 360°
        </button>
      )}

      {/* Discoverability hint, fades out once the user has interacted. */}
      {phase === "ready" && (
        <div
          className={`pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-navy/90 text-on-navy text-[11px] font-semibold rounded-xs shadow-md transition-opacity duration-500 ${
            touched ? "opacity-0" : "opacity-100"
          }`}
        >
          <Rotate3D className="w-3.5 h-3.5 text-gold" />
          Drag to rotate
        </div>
      )}

      {/* The product must always be visible, so failure just leaves the poster. */}
      {phase === "failed" && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-surface-raised border border-line text-ink-muted text-[11px] font-semibold rounded-xs">
          360° view unavailable
        </span>
      )}
    </div>
  );
}
