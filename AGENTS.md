# AGENTS.md — Web Store Rebrand + 360° Drag Viewer

## Project context
- **Base project:** existing Next.js clothing store (currently deployed at `clothe-shope.vercel.app`) — reuse the codebase, rebrand it for a new client
- **Client:** [name] — [what they sell, who they sell to]
- **Scope:** rebrand (colors, logo, imagery, contact info) + one new feature (drag-controlled 360° product view)

**Suggested autonomy profile:** Review-driven development. The 360 viewer has an asset problem that needs a decision from Fraol before it can be built properly — see Part B, Step 0.

## Role
Two separate workstreams. Do Part A first; it's low-risk and makes the store demoable. Part B is the actual engineering work.

---

# PART A — Rebrand

## Design tokens
Replace the existing palette with these three colors. Put them in the Tailwind theme config as named tokens — don't scatter hex values through components.

```js
// tailwind.config — extend.colors
navy:  '#1F2A44',   // primary / text / dark surfaces
beige: '#E8DCC8',   // background / light surfaces
gold:  '#C6A75E',   // accent / CTA / highlights
```

**Contrast constraints — these are measured, not guesses. Follow them:**

| Combination | Ratio | Verdict |
|---|---|---|
| Navy on Beige | 10.53:1 | Safe everywhere (AAA) |
| White on Navy | 14.26:1 | Safe everywhere (AAA) |
| Gold on Navy | 6.17:1 | Passes AA — fine for buttons and headings |
| Navy on Gold | 6.17:1 | Passes AA — fine for CTA buttons |
| **Gold on Beige** | **1.71:1** | **Fails badly — never use for text** |
| **White on Gold** | **2.31:1** | **Fails — never use for text** |

Gold-on-beige is the combination that will feel most "luxury" and is the one to avoid for anything readable. Use gold on beige only for non-text decoration — hairline borders, dividers, icon strokes, underline accents. Body and label text on beige backgrounds must be navy.

Default mapping to start from: beige as page background, navy as primary text and header/footer surfaces, gold reserved for CTAs, price highlights, sale badges, and hover accents. Gold is the scarcest color in the palette — using it everywhere kills the effect.

## Everything else to swap
- **Logo** — replace the "Shoping" wordmark in header and footer with the client's logo (needs light and dark variants, since the header may sit on navy and the footer on beige)
- **Site name and metadata** — page `<title>`, meta description, OG tags, footer copyright all still say "Shoping"
- **Product imagery** — several catalog items currently pull from Unsplash URLs, and the rest are placeholder JPGs in `/public/images/`. Every one of these needs replacing with the client's real product photography before this goes live; Unsplash stock on a real commercial storefront is a placeholder, not a shipping asset
- **Product data** — names, descriptions, prices, categories, and badge labels (`50% OFF`, `BESTSELLER`, `FEATURED`) are placeholder content
- **Contact info** — the footer's Customer Care links (Order Tracking, Shipping Policy, Returns & Exchange, Size Guide, FAQ & Contact) all currently point to `#`. Get real destinations or real content for each; a premium store with five dead footer links reads as unfinished
- **Currency and pricing** — currently USD. Confirm whether this client prices in ETB, and whether the number formatting needs to change with it

## Part A verification
- Grep the codebase for leftover hardcoded hex values from the old palette — the rebrand isn't done while old colors survive in one-off components
- Run an automated contrast check across the rendered pages, not just a spot check
- Confirm no remaining references to "Shoping" or the old brand anywhere, including metadata and alt text

---

# PART B — 360° Drag-to-Rotate Viewer

## Step 0 — Read this before building: the source asset has problems

The supplied clip (`Role_You_are_a_luxury_product.mp4`) was analyzed frame by frame. It is **not directly usable** as a 360 viewer source as-is. Four findings, all measured:

**1. The rotation speed is not constant.** The clip eases in and eases out like a video animation. Frame-to-frame motion ramps up across roughly the first 20 frames, runs at full speed through the middle, then decelerates across the last ~50. Even mid-clip, speed varies nearly 2× between the fastest and slowest stretches. A drag viewer maps drag distance to rotation angle — it assumes every frame is an equal angular step. Feed it eased frames and the product spins fast in some places and crawls in others, and dragging back doesn't return you where you started.

**2. It contains about two revolutions, not one.** Angle-matching against the first frame puts one full turn ending around frame 107 and a second around frame 214, with the remaining ~25 frames overshooting and settling. A 360 viewer needs exactly one clean revolution that loops seamlessly end to start.

**3. The transparent-background checkerboard is baked into the pixels.** The gray checker pattern is literal opaque pixels (alternating ~#B3B3B3 and ~#DBDBDB), not real transparency — H.264 can't carry an alpha channel. Dropped onto a product page as-is, the garment appears on a gray checkerboard. This has to be removed or replaced before anything ships.

**4. Resolution is limited.** 720×1280 portrait, with the product occupying roughly 700×1000 of that. That's below what a premium store wants if shoppers can zoom, and portrait 9:16 is an awkward aspect for a product viewer frame.

## Step 0b — Decide the path before writing code

Present these two options to Fraol and wait for a decision:

**Option 1 — Regenerate the source (recommended).** Produce a new clip with constant-speed rotation, exactly one revolution, on a solid background (white or a flat color), ideally at higher resolution and in a squarer aspect. Everything downstream becomes straightforward, and the result is genuinely premium. If the clip came from an AI video tool, the prompt needs to specify constant rotation speed with no ease-in/ease-out and a single full turn.

**Option 2 — Salvage the existing clip.** Workable, with caveats. Extract the second revolution (roughly frames 107–214), resample to even angular steps rather than taking every Nth frame (uniform sampling of eased footage preserves the speed problem), then run per-frame background removal. Flag the risk honestly: per-frame AI background removal produces slightly different edges on each frame, which shows up as visible flicker around the garment's outline once the frames are cycled — the fringe and open front on this particular product are exactly the kind of fine detail that flickers worst.

Don't start Part B implementation until this is decided. Everything below assumes a clean single-revolution source, however it's obtained.

## Step 1 — Frame sequence, not video scrubbing

Build the viewer from a numbered image sequence, not by seeking a `<video>` element's `currentTime`. This is the established ecommerce approach and it's the right one: scrubbing video on drag depends on frame-accurate seeking, which is unreliable across browsers and especially rough on mobile Safari, where seek latency makes the rotation feel disconnected from your finger. A preloaded image sequence swaps instantly and behaves identically everywhere.

**Frame count: 36.** Industry practice runs 24 / 36 / 72; 24 is serviceable, 36 reads as smooth and premium, 72 is heavy for the quality gain. At 36 frames, each is a 10° step.

```bash
# extract one revolution, resampled to 36 even frames
ffmpeg -i source.mp4 -vf "select='between(n,START,END)',scale=1000:-1" -vsync 0 frames/%03d.png
# then resample the extracted range to 36 evenly-spaced angles
```

Export as WebP for the final assets — meaningfully smaller than PNG at equivalent quality, and 36 frames per product adds up fast.

## Step 2 — Viewer component

Build it as a self-contained client component:

- **Drag/swipe:** pointer events (`pointerdown` / `pointermove` / `pointerup`) — one code path covers mouse, touch, and pen. Map horizontal drag distance to frame index, wrapping modulo 36 so it spins continuously in both directions.
- **Preloading:** load all 36 frames before the viewer becomes interactive; show a loading state until ready. A viewer that stutters through half-loaded frames on first drag is worse than no viewer.
- **Touch behavior:** call `preventDefault` on horizontal drags so the page doesn't scroll while rotating, but let vertical gestures pass through — otherwise mobile users get trapped and can't scroll past the product.
- **Discoverability:** users don't know a product image is draggable. Add a drag-affordance cue — a subtle auto-rotate on first view that stops on interaction, or a small "drag to rotate" hint that fades after the first interaction.
- **Fallback:** if the sequence fails to load, or on reduced-motion preferences, fall back to a single static frame. The product must always be visible.
- **Not every product has this.** Only some SKUs will have 360 assets. The product data model needs a field for the frame-sequence path, and the product page needs to render the standard image gallery when it's absent.

## Step 3 — Integration
- Place the viewer in the product detail / Quick View area where the main product image currently sits
- Keep it consistent with the rebrand: loading states, hint text, and any controls use the palette tokens from Part A
- Lazy-load the frame sequence — don't pull 36 images on a catalog page where the viewer isn't visible yet

## What Antigravity needs from Fraol
Compile and present before building:
- Client logo files (light + dark variants), brand name, real contact details
- Real product photography and product data (names, descriptions, prices)
- Decision on Part B Option 1 vs Option 2
- Which products get 360 views — all of them, or a selected few?
- Currency: USD or ETB?
- Destinations or content for the five dead Customer Care footer links

## Verification
- Drag the viewer through a full rotation in both directions; confirm it loops seamlessly with no jump at the wrap point and no flicker at the product's edges
- Confirm dragging back returns the product to the same angle it started from
- Test on an actual touch device: rotation should not hijack vertical page scroll
- Confirm products *without* 360 assets still render their normal gallery correctly
- Responsive check at 375 / 768 / 1280 / 1920px
- Lighthouse on a product page with the viewer active — watch the image payload; 36 frames is real weight
- Contrast audit across the rebranded pages

## Out of scope
- Don't ship the checkerboard background under any circumstances, even in a demo build
- Don't fabricate the client's contact details, policies, or pricing — placeholders must be visibly marked as such
- Don't build a full 3D model viewer; this is a frame-sequence spin, and scope shouldn't drift there

## Definition of done
- [ ] Palette applied as Tailwind tokens; no old hex values remain in the codebase
- [ ] Gold never used as text on beige or white anywhere in the build
- [ ] Logo, site name, metadata, and footer branding all updated
- [ ] Every Unsplash and placeholder image replaced
- [ ] Footer Customer Care links resolve to real destinations
- [ ] 360 source resolved to a clean single revolution with constant angular steps and no checkerboard
- [ ] Viewer built as a preloaded 36-frame sequence with pointer-event drag, not video scrubbing
- [ ] Seamless loop confirmed in both directions, no edge flicker
- [ ] Vertical page scroll still works on touch devices over the viewer
- [ ] Graceful fallback for products without 360 assets and for reduced-motion users
- [ ] Responsive at all four breakpoints; Lighthouse checked with the viewer loaded
