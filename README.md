# Shema Hive

**For the bold and proud.** A showcase storefront for handwoven Ethiopian ruanas, scarves and outerwear — every piece woven on a traditional loom.

| | |
|---|---|
| **Design & art direction** | Fraol Tamrat |
| **Development** | Claude (Anthropic), working through Claude Code |
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion |

Fraol set the visual direction — the reference layouts, the navy / beige / gold palette, the logo, the product photography, the 360° product clips — and wrote the briefs that defined what "done" meant. Claude turned those briefs into code, measured the things that could be measured, and reported back where the source material needed a decision. This document is the record of how that went.

---

## Contents

- [What the site is](#what-the-site-is)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [How it was crafted](#how-it-was-crafted)
  - [1. From reference image to first release](#1-from-reference-image-to-first-release)
  - [2. The rebrand: a three-colour palette, solved rather than picked](#2-the-rebrand-a-three-colour-palette-solved-rather-than-picked)
  - [3. From shop to showcase](#3-from-shop-to-showcase)
  - [4. The 360° frame pipeline](#4-the-360-frame-pipeline)
  - [5. The drag-to-rotate viewer](#5-the-drag-to-rotate-viewer)
  - [6. Verification](#6-verification)
- [Working with the content](#working-with-the-content)
- [Open items](#open-items)
- [How the collaboration worked](#how-the-collaboration-worked)

---

## What the site is

A single-page catalog, not a checkout. Visitors browse 11 pieces across four categories (Ruanas, Scarves, Coats & Dusters, Shawls & Vests), open a Quick View for any of them, and order by messaging the seller on Telegram or Instagram with the product code.

- **Hero** built around the client's own photography, with a rotating "Handwoven in Ethiopia" seal
- **Filterable catalog** with category tabs, a New Arrivals view and full-text search
- **Quick View** with colourway swatches and order buttons
- **360° drag-to-rotate viewer** on the signature ruana, in three colourways
- **Mobile bottom navigation** and a layout checked at 375 / 768 / 1280 / 1920 px
- **No cart, no accounts, no prices** — by design (see [section 3](#3-from-shop-to-showcase))

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

One optional environment variable: `NEXT_PUBLIC_SITE_URL` sets the base URL used for Open Graph and Twitter card images. It falls back to `http://localhost:3000`, so set it to the production domain when deploying.

## Project structure

```
src/
  app/
    globals.css          Design tokens (@theme), keyframes, utilities
    layout.tsx           Fonts, metadata, Open Graph
    page.tsx             The single page — composes everything below
  components/
    Navbar.tsx           Header on navy, category links, search trigger
    HeroSection.tsx      Editorial hero; separate mobile and desktop compositions
    ProductCatalog.tsx   Filter tabs and product grid
    ProductQuickViewModal.tsx   Detail overlay; swatches, 360 viewer or photo
    Product360Viewer.tsx Preloaded 36-frame drag-to-rotate viewer
    OrderButtons.tsx     Telegram / Instagram order CTAs with product code
    SearchModal.tsx      Catalog search overlay
    BottomNav.tsx        Mobile tab bar
    Footer.tsx           Brand channels and copyright
    Logo.tsx             Light / dark logo variants
    PlaceholderNotice.tsx   Draft banner and per-card "Draft copy" chip
    Toast.tsx, icons.tsx
  context/StoreContext.tsx   Overlay and toast state (no cart)
  data/
    brand.ts             Name, tagline, contact links, PLACEHOLDER_COPY flag
    products.ts          The catalog
  types/product.ts       Product, Colorway, has360()
public/
  brand/                 Logo on light, logo on dark, favicon mark
  products/              Client product photography
  products/360/<set>/    000.webp … 035.webp + manifest.json per colourway
tools/build360.py        Turns a source clip into a 36-frame spin
videos/                  The three source clips for the 360 sets
AGENTS.md                The rebrand + 360 viewer brief
AGENTS-new-project.md    The original build-from-reference brief
```

---

## How it was crafted

### 1. From reference image to first release

The project began with no code at all — only two reference images from Fraol (one desktop composition, one mobile/tablet) and a brief (`AGENTS-new-project.md`) asking for a production-grade clothing store rather than a pixel copy of a screenshot. That brief set the default stack — Next.js App Router, TypeScript, Tailwind, deployed to Vercel — and a review-driven rhythm: written spec first, then design system, then the first full page, with a checkpoint after each so an early wrong assumption could not compound.

The result was the first release: a conventional storefront with a cart drawer, account modal, prices, ratings, and a placeholder catalog partly backed by Unsplash stock.

### 2. The rebrand: a three-colour palette, solved rather than picked

The second brief (`AGENTS.md`) repurposed that storefront for Shema Hive. Fraol's palette is three colours:

| Token | Hex | Role |
|---|---|---|
| `navy` | `#1F2A44` | Primary text, header and dark surfaces |
| `beige` | `#E8DCC8` | Page background |
| `gold` | `#C6A75E` | CTAs, badges, accents — used sparingly |

The brief came with measured contrast ratios and one hard rule: **gold is never text on a light surface.** Gold on beige is 1.71:1 and white on gold is 2.31:1 — the combination that feels most "luxury" is the one that cannot be read. Gold therefore appears only as filled buttons and badges with navy text on top (6.17:1), and as decoration: hairlines, icon strokes, the seal.

Three brand colours do not cover every job a UI needs. There is no secondary text colour, no border colour, no raised or sunken surface. Rather than choosing those by eye, each neutral was **derived by blending navy into beige (or beige into navy) and solved against a WCAG target**:

| Token | Hex | Contrast | Used for |
|---|---|---|---|
| `ink` | `#1F2A44` | 10.53:1 on beige | Primary text |
| `ink-muted` | `#565B68` | 5.01:1 on beige | Secondary text |
| `ink-subtle` | `#74767C` | 3.35:1 on beige | Large text only |
| `line-strong` | `#7C7D81` | 3.04:1 | Input borders, focus rings |
| `line` | `#C4BCB0` | 1.39:1 | Decorative hairlines |
| `surface-raised` | `#F5EFE6` | — | Cards, panels, modals |
| `surface-sunken` | `#DCD1C0` | — | Wells, inputs, hover fills |
| `on-navy` | `#F7F3EC` | 12.89:1 on navy | Text on navy |
| `on-navy-muted` | `#969BA7` | 4.52:1 (see below) | Secondary text on navy |
| `gold-hover` | `#B59A5B` | navy on it 5.25:1 | CTA hover |

One of those is worth a note. The header and mobile tab bar render navy at 95% opacity over beige, which composites to `#29334B` — lighter than the token. Muted text that measured a passing 4.53:1 against pure navy measured **3.99:1 on screen**. The token was re-solved against what actually renders.

All of this lives in one place: the `@theme` block in `src/app/globals.css` (Tailwind 4 defines theme tokens in CSS rather than a config file). The rebrand removed **215 hardcoded hex literals** from components; they reference tokens only. The single remaining literal is the browser `theme-color`, which cannot read a CSS variable and is sourced from `BRAND_COLORS` in `src/data/brand.ts`.

**Typography** — Cormorant Garamond for display headings, Plus Jakarta Sans for interface text, Caveat for script accents, all loaded through `next/font`.

**Logo** — the supplied logo files had baked-in backgrounds. They were keyed out into transparent assets and tinted into two variants: cream ink for the navy header (`logo-on-dark.png`), navy ink for the beige footer (`logo-on-light.png`), plus a mark for the favicon.

### 3. From shop to showcase

The first release was a shop. Shema Hive sells through conversation, and there was no confirmed pricing — so a cart that led to no checkout and a sign-in with nothing behind it would have been set dressing. They were removed rather than left as props:

- `CartDrawer`, `AccountModal` and `CartContext` were deleted. `StoreContext` now holds only which overlay is open and the toast.
- **Ordering moved to Telegram and Instagram.** Neither platform accepts a prefilled message, so every product carries a short code (`SH-232`) displayed beside the order buttons for the shopper to quote.
- **Two sets of links, deliberately separate.** `ORDER_CONTACT` is a person — where you go to buy a piece. `FOLLOW_LINKS` are the brand channels — where you go to keep up. They are not interchangeable and live side by side in `src/data/brand.ts`.
- **The catalog was rebuilt from the client's own photography** — 11 products replacing the 8 placeholders. Every Unsplash URL is gone, and the Unsplash remote pattern was removed from `next.config.ts` with it.
- **Ratings and review counts were dropped rather than fabricated.**
- **The footer's five dead Customer Care links were removed**, not pointed at invented policy pages.

Product names and descriptions are still placeholder copy awaiting the client's text. The brief's rule was that placeholders must be visibly marked, so a single flag — `PLACEHOLDER_COPY` in `src/data/brand.ts` — drives a "Draft build" banner at the top of the page and a "Draft copy" chip on each product. Flip it to `false` and both disappear.

### 4. The 360° frame pipeline

Fraol supplied three product clips of the signature ruana (charcoal, olive, rust). The brief had already flagged, from frame-by-frame analysis, that they could not be used as-is: rotation eased in and out, each clip held about two revolutions, the "transparent" checkerboard background was baked into the pixels, and the resolution was 720×1280. The clips were salvaged rather than regenerated, which meant solving each of those problems in `tools/build360.py`.

**The speed problem was worse than the brief described.** Beyond easing at each end, the rotation *stalls* mid-clip — around frames 90–114 the garment stops turning and only the cloth sways. Taking every Nth frame would preserve all of it: the product would spin fast in places, crawl in others, and dragging back would not return to the same angle. So the pipeline measures the angle of every frame and resamples on even 10° steps.

**Measuring the angle.** A garment on a turntable is widest facing front or back and narrowest edge-on, so its silhouette width follows

```
w(θ) = √(L² cos²θ + T² sin²θ)
```

with *L* the full width and *T* the edge-on width. Inverting that inside each quarter turn, between measured landmarks (front, edge, back, edge, front), gives a continuous monotonic angle for every frame. Two details mattered:

- The garment is asymmetric — the open front measures about 667 px across and the closed back about 720 — so each quarter turn uses its own endpoint widths. One global width misplaces every front-side angle.
- The three clips are not identically timed. Olive's second half runs noticeably slower, so each clip carries its own landmarks.

Only the first revolution is extracted; every later one contains the stall.

**Removing the checkerboard.** The obvious approach — fit the checker lattice analytically and subtract it — failed, because the board is not a constant-period lattice; its cell runs are irregular. But it is *static* across all 240 frames. So for each pixel, the frames where the garment is somewhere else reveal the true board value directly; this recovers 96% of pixels. The rest are pixels the garment never uncovers — which means they sit inside every silhouette and are always foreground, needing no estimate at all.

Two traps on the way to a clean matte:

- A colour-distance key alone punches holes in the garment's cream band, whose brightness sits close to the board's. Interior hole-filling closes them, and a local-density test removes isolated codec speckle without eating the fringe (thin, but clustered).
- The soft drop shadow overlaps the fringe at edge-on angles, so it cannot be cropped off without slicing the fringe. It is separated by tone instead — the shadow is a light neutral wash, the fringe is dark or strongly coloured — measured relative to each clip's own board level, since the three are graded differently.

**Output.** 36 WebP frames at 1000 px per colourway, plus a `manifest.json` recording which source frame was chosen for each angle. Each set weighs about 2.5 MB.

Measured on the charcoal set: silhouette minima land on 90° and 270° and maxima on 0° and 180°; mean angle error 1.3°, maximum 5.0°; all 36 output frames come from distinct source frames; the step across the 350° → 0° wrap is 1.01× the median step, so the loop closes without a jump.

To rebuild a set (needs Python 3 with `numpy`, `pillow` and `imageio-ffmpeg`):

```bash
python tools/build360.py --clip main --out public/products/360/ruana-charcoal
```

If a clip is replaced, re-derive its landmarks first:

```bash
python tools/build360.py --clip main --analyse
```

### 5. The drag-to-rotate viewer

`src/components/Product360Viewer.tsx` is a self-contained client component. It swaps preloaded images rather than scrubbing a `<video>`, because frame-accurate video seeking is unreliable across browsers and particularly laggy on mobile Safari.

| Behaviour | How |
|---|---|
| **Drag** | Pointer events, so mouse, touch and pen share one code path. Horizontal distance maps to frame index, wrapping modulo 36 in both directions. One drag across the viewer is roughly one turn. |
| **Preloading** | All 36 frames load before the viewer becomes interactive, behind the poster frame with a progress readout. |
| **Vertical scroll** | `touch-action: pan-y` on the drag surface. The browser routes vertical pans to the page and hands over the horizontal ones — a mobile visitor cannot get trapped on the product. |
| **Discoverability** | One slow automatic revolution on first view, plus a "drag to rotate" chip. Both stop at the first interaction. |
| **Keyboard & assistive tech** | Arrow keys rotate; the drag surface is an ARIA slider reporting the current angle. |
| **Reduced motion** | Static poster by default, with an explicit "View in 360°" button — the feature stays reachable without auto-playing or silently downloading the frames. |
| **Failure** | If any frame fails to load, the viewer falls back to the poster. A hole in the rotation is worse than no rotation. |
| **Lazy loading** | The component only mounts when Quick View opens, so the catalog page downloads zero bytes of 360 frames. |

Three things were found by testing rather than assumed:

- **Readiness waits on `load`, not `decode()`.** `decode()` never settles while the document is hidden, so gating on it stranded the viewer at "Loading 0%" for anyone who opened Quick View and switched tabs.
- **An `IntersectionObserver` was added, then removed.** Mounting is already the laziness boundary; the observer bought nothing and introduced a path where the viewer could sit idle forever.
- **A zero-width host produced a `NaN` frame index.** A drag arriving before layout settled divided by zero, and the resulting `Infinity` poisoned the modulo wrap. The pixels-per-frame value is now floored and non-finite steps are dropped.

**Not every product has a spin.** `Colorway.frames360` in the data model is optional. The signature ruana has it for charcoal, olive and rust but not for mustard — so the standard-photo fallback is exercised by real catalog content sitting right beside its 360-enabled siblings.

### 6. Verification

What was checked, and what was found:

- **Contrast** — an automated audit of the rendered pages at 375, 768, 1280 and 1920 px, including the Quick View and search overlays and with the 360 viewer open: 0 contrast failures, 0 instances of gold text on a light surface.
- **Layout** — no horizontal overflow at any of the four breakpoints. Two real overflows were caught and fixed on the way: the catalog filter row overran the viewport by 185 px at 768 px, and the footer CTAs by 3 px, both from a flex child missing `min-w-0`.
- **Viewer** — dragging away and back returns to the exact starting angle (330° → 180° → 330°); rotation wraps through 0° in both directions; switching colourway loads the right frame set; the mustard colourway shows its photo with no slider; the modal still scrolls vertically on mobile-sized viewports.
- **Modals** — exit animations were silently never completing because the direct child of `AnimatePresence` was a plain `div`; modal roots are now keyed motion elements.
- **Build** — `npm run build` and `npm run lint` clean; no console errors or failed requests.

---

## Working with the content

**Add or edit a product** — `src/data/products.ts`. Each product needs an `id`, a `code`, a `category` from the list in `src/types/product.ts`, and an `image` under `public/products/`.

**Give a colourway a 360° view** — build a frame set with `tools/build360.py`, then set `frames360` on the colourway to its directory:

```ts
{
  name: "Charcoal",
  hex: "#2B2B2E",
  image: "/products/232_0.jpg",
  frames360: "/products/360/ruana-charcoal",
}
```

**Change contact links, name or tagline** — `src/data/brand.ts`.

**Change a colour** — the `@theme` block in `src/app/globals.css`, and nowhere else. The derived neutrals were solved against contrast targets; re-check them if navy or beige moves. If navy changes, update `BRAND_COLORS.navy` in `src/data/brand.ts` to match.

## Open items

Things this build does not yet have, stated plainly:

- **Product names and descriptions are placeholder copy.** The site says so on screen until `PLACEHOLDER_COPY` is set to `false`.
- **No pricing or currency.** USD versus ETB was never confirmed, so no prices are shown.
- **No policy pages** (shipping, returns, size guide). They were removed from the footer rather than invented.
- **The 360 sets have not been through a Lighthouse pass or a physical touch-device test.** Scroll and drag behaviour was verified in emulated viewports. At roughly 2.5 MB per colourway, frame size and quality are the first thing to revisit if the payload proves heavy.
- **The 360 source is salvaged footage.** Mean angle error is 1.3°, but the clips are 720 px wide and AI-generated; a regenerated constant-speed, single-revolution, higher-resolution clip on a flat background would be a straight upgrade and would simplify the pipeline considerably.
- **`NEXT_PUBLIC_SITE_URL`** needs setting to the production domain for social-card images to resolve.

## How the collaboration worked

The division of labour was consistent throughout. Fraol owned every decision about how the brand looks and what belongs on the page: the reference compositions, the palette, the logo, the photography, the product clips, and the constraints in the briefs. Claude owned implementation and measurement — and the briefs were written so that the two could be checked against each other. They specified outcomes that could be verified ("gold never used as text on beige", "dragging back returns the product to the same angle") rather than outcomes that could only be admired.

Where the source material and the brief disagreed, the code followed the evidence and the difference was reported: the mid-clip rotation stall the brief had not seen, the checkerboard that turned out not to be a regular lattice, the header whose real on-screen colour was not the token's. Where information was missing — prices, policies, final copy — the gap was left visible instead of being filled with something plausible.

---

© Shema Hive. Design by Fraol Tamrat. Built with Claude Code.
