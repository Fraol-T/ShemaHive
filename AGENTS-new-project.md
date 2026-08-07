# AGENTS.md — New Project from Reference Image

## Project context

_(fill in before running)_

- **Reference image:** ![](C:/Users/Fnotay/AppData/Roaming/marktext/images/2026-08-07-05-26-58-image.png)![](https://cdn.dribbble.com/userupload/4007401/file/original-5d3783ff4a7c4b648c4074aef4338396.png?resize=752x&vertical=center)

The first image is for the website view, and the second one is more mobile and tablet view.

- **What it's for:** online clothing store
- **Type:** web store

## Role

There is no existing code. The only input is a reference image of a web app, marketing website, or online store. Your job:

1. Analyze the image and produce a full written spec — don't start coding from a glance.
2. Apply the best practices below by default; don't wait to be asked.
3. Compile a list of anything you need from Fraol that the image can't tell you, present it, and wait on anything build-changing before proceeding.
4. Build a production-grade result — "high-end" means it performs and adapts to every screen and holds up to scrutiny, not just that it matches one screenshot.

**Suggested autonomy profile:** Review-driven development. Checkpoint after the spec, after the design system, and after the first full page — a wrong assumption made early compounds across everything built on top of it.

**Default stack** (override in Project Context above if you want something else): Next.js (App Router) + TypeScript + Tailwind CSS, deployed to Vercel.

## Step 0 — Classify before analyzing

Decide: web app (interactive tool/dashboard), marketing website (informational, conversion-focused), or web store (products, cart, checkout)? State this explicitly — it changes which requirements below apply.

## Step 1 — Reverse-engineer the spec from the image

Write this up as a reviewable artifact before touching code:

- **Layout:** header/nav pattern, section order, footer, grid structure
- **Design tokens:** color palette (real approximate hex values pulled from the image, not generic guesses), type scale and font pairing, spacing rhythm, corner-radius/shadow language, icon style
- **Components implied:** buttons, cards, forms, nav, modals, carousels — whatever's visible
- **Content types implied:** headline/body copy slots, media slots, testimonials, pricing tables, product grids, etc.
- **Breakpoint the image represents** — a screenshot is one viewport; say which one, since every other breakpoint still needs designing, not just inferring
- **Interactive elements implied but not shown working:** search, filters, cart icon, forms, sliders — these need real behavior, not just a static look

## Step 2 — What to ask Fraol

An image can't carry everything. Compile open questions, grouped, and present them before moving past the spec stage:

- **Content:** real copy, brand name/logo, product data, pricing, real media vs. placeholders
- **Functionality:** what each button/form should actually do (contact form → email? auth needed? search → real or stubbed?)
- **Data:** static content only, or a backend/database? Any existing data source?
- **Scope:** one page or several? Which pages beyond what the image shows?
- **Store-specific, if applicable:** payment processor (default to Stripe unless told otherwise), shipping/tax handling, inventory source

For anything cosmetic and reasonable to default (placeholder copy, stock-style placeholder images), note the assumption and proceed — save actual questions for decisions that would require rework to undo.

## Step 3 — Best practices (the "high-end" bar)

- **Responsive:** mobile-first, tested at 375 / 768 / 1280 / 1920px
- **Performance:** `next/image`, `next/font`, code splitting — target Lighthouse 90+ across the board
- **Accessibility:** semantic HTML, correct heading hierarchy, alt text, full keyboard navigation, WCAG AA contrast, `prefers-reduced-motion`
- **Animation:** GSAP + ScrollTrigger (via `@gsap/react`'s `useGSAP()`) for scroll-driven reveals/parallax; Motion (`motion/react` — renamed from Framer Motion) for hover/entrance micro-interactions. Animate `transform`/`opacity` only; micro-interactions 150–300ms, reveals 400–800ms
- **SEO:** meta tags, Open Graph, sitemap, semantic structure
- **Code quality:** design tokens centralized in the Tailwind theme config, no magic numbers scattered through components
- **If it's a web store:** never handle raw card data client-side — use Stripe Checkout/Elements; settle the product data structure before building the catalog UI

## Step 4 — Build order

1. Scaffold the project with the agreed stack
2. Build the design system/tokens first — everything downstream should reference these, not one-off values
3. Build bottom-up: shared components → sections → full pages
4. Use the built-in browser continuously to compare against the reference image, not just at the end

## Verification

- Side-by-side: reference image vs. built result, at the breakpoint the image represents
- Full responsive check at all four widths
- Lighthouse run (performance / accessibility / best practices / SEO)
- Console clean; every interactive element functional or clearly stubbed with a TODO for Fraol

## Out of scope

- Don't fabricate real business details (pricing, contact info, testimonials) — clearly marked placeholders only
- Don't skip straight to code because the image "looks simple" — the spec step is what catches missing states (empty, error, loading) that a static image never shows

## Definition of done

- [ ] Spec artifact written and reviewed before the build started
- [ ] Open-questions list presented and resolved
- [ ] Visual match to the reference image confirmed at its implied breakpoint
- [ ] Fully responsive at 375 / 768 / 1280 / 1920px
- [ ] Lighthouse 90+, or documented reasons for any score that falls short
- [ ] Animations respect `prefers-reduced-motion`, use transform/opacity only
- [ ] No console errors; every button/form/link works or is explicitly flagged as a stub
