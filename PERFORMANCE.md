# Performance — scroll-jank fixes & optimization

Scroll on this landing froze/stuttered. The page renders on a single ~19,000px-tall
canvas scaled with one `transform: scale()`, over Lenis smooth-scroll, with GSAP
animations and ~26 MB of PNGs. Root causes and fixes below. All fixes preserve the
pixel-perfect Figma design (verified with before/after screenshots at every breakpoint).

## Measured impact (idle at top of page, 4 s, headless Chrome)

| Main-thread metric        | Before  | After   |   Δ    |
|---------------------------|---------|---------|--------|
| Total task time           | 327 ms  | 182 ms  | −44 %  |
| Style recalc              | 73 ms   | 8 ms    | −89 %  |
| Scripting                 | 54 ms   | 18 ms   | −68 %  |

Before, ~8 % of the main thread was permanently consumed by off-screen animations
that never stop. GPU savings (backdrop-filter) stack on top on real devices.

JS bundle: **444 KB single chunk → code-split** per device (a phone visitor no longer
downloads the desktop+tablet trees) + cache-stable `vendor-react` / `vendor-anim`.

Images: **23.5 MB PNG → 1.87 MB AVIF (−92 %)** / 3.12 MB WebP (−87 %). Every raster now
has AVIF + WebP siblings served via `<picture>` (PNG kept as universal fallback); modern
browsers download AVIF. Decorative glow PNGs were additionally downscaled (blur is
resolution-invariant) before transcode. Verified: browser loads AVIF, 0 broken images,
mockup text stays crisp.

## What was fixed (done)

1. **Per-frame forced reflow (the #1 main-thread jank).** `micro.ts` parallax ran
   `getBoundingClientRect()` on every element every scroll frame (after Lenis wrote the
   scroll) → synchronous relayout of the whole tree each frame. Now caches resting
   geometry once (+ on resize/load) and computes from `scrollY` only — zero layout reads.
2. **~50 infinite `repeat:-1` loops now pause off-screen.** Testimonials/Features/Tablet/
   Phone marquees, Orbit's 18 rotations, ChaosBeams (28 filtered strokes), CtaAutomation
   beams, and `data-float`/`data-pulse` are gated by `IntersectionObserver`
   (`src/lib/inview.ts`), started paused, resumed only near the viewport. All now honor
   `prefers-reduced-motion` (marquees/Orbit previously ignored it).
3. **Killed no-op `backdrop-filter`s.** 15 review cards each animated a `backdrop-blur-[100px]`
   over a flat background (visually identical without it) — removed on desktop/tablet/phone.
   Also Orbit's 15 rotating `blur-[10px]` pills, 3 inner navbar pills, opaque-bg pills,
   Pricing `blur-[17px]`, the hidden comparison-panel `blur-[100px]`. `backdrop-filter` is
   one of the most expensive effects, worst on mobile GPUs and scaled up by `transform:scale`.
4. **`content-visibility: auto`** + `contain-intrinsic-size` on the tall sections (Tools
   6978px, TabletMain 9507px, TabletBottom 6822px, all phone sections, …) so off-screen
   sections skip layout/paint/decode. `src/lib/reveal.ts` was made robust to the collapsed
   rects this produces so the reveal cascade still fires.
5. **Images:** `loading="lazy"` + `decoding="async"` on all below-fold `<img>` (was 0/124);
   hero stays eager with `fetchPriority="high"`. Stops synchronous PNG decode hitches on scroll-in.
6. **Smooth scroll off on touch / reduced-motion** — Lenis + its rAF only run for a
   fine-pointer mouse; touch uses native momentum + `scrollIntoView` for anchors.
7. **Hover effects (`lift`/`magnetic`/`tilt`) only register for `pointer: fine`** — dead weight
   (and synthetic-mouse reflow) removed on touch.
8. **Navbar:** replaced a forever-running `requestAnimationFrame` scroll poll with a passive
   threshold-guarded listener; the fixed compact pill is `visibility:hidden` + `isolation:isolate`
   while parked at the top so its `backdrop-filter` isn't composited.
9. **`will-change: transform` toggled in-view** on marquee tracks (was permanent → held a large
   composited texture off-screen).
10. **Build:** `React.lazy` code-split of the three device canvases + `manualChunks` vendor split;
    `lagSmoothing(0)` → `(500, 33)` so a heavy frame catches up smoothly instead of teleporting.
11. **AVIF/WebP transcode.** `scripts/transcode-images.mjs` (run via `npm run transcode`, and
    automatically on `prebuild`) generates AVIF + WebP siblings for every `public/figma/**`
    raster; the `<Img>` component (`src/components/site/Img.tsx`) serves them via `<picture>`
    with the original PNG as the universal fallback. 124 `<img>` were migrated to `<Img>`.
    23.5 MB → 1.87 MB AVIF.

## Remaining / recommended next steps

Not blocking; ordered by value.

- **Debounce the breakpoint switch** (`useBreakpoint`): crossing 640/1024 tears down and rebuilds
  the whole tree + Lenis + reveal; dragging a window across the boundary churns. Debounce ~150 ms.
- **Fix `useBreakpoint` init mismatch**: initial state reads `innerWidth`, resize reads
  `clientWidth` — near 640/1024 with a scrollbar the first paint can pick the wrong tree and remount.
- **`CtaAutomation` glass balls**: add `isolation:isolate`; on coarse-pointer/mobile replace the
  live `backdrop-blur` with a static semi-opaque fill.
- **Move the always-on 74px box-shadow off the animated tablet/phone featured review cards**
  (repaints each frame as the card translates) → static sibling behind the track.
- **Add intrinsic `width`/`height` to every `<img>`** (removes the intrinsic-size layout pass;
  reserves space for lazy placeholders).
- **Preload the LCP hero image** for tablet/phone (their heroes are public paths); trim Fontsource
  to latin-only to drop unused `@font-face` rules from `dist`.
- **`content-visibility` on the small non-overflow desktop sections** (DispatchIntro, Ecosystem,
  WhyLoadHunter, ChaosDiagram, Pricing) — skipped here because their glows/beams bleed past the
  section box and paint-containment would clip them; safe only after confining that bleed.

## Per-breakpoint / per-device checklist

**Desktop (mouse, ≥1024):** Lenis kept (only after every scroll frame was made cheap) · content-visibility on tall sections · off-screen loops gated · no-op blurs gone · parallax from cached offsets · navbar single blur + hidden at top.

**Tablet & Phone (touch):** native scroll (no Lenis rAF) · hover effects not registered · marquees gated + reduced-motion · no-op `blur-[100px]`/`blur-[10px]` removed (radii land full-size at phone scale, worst on mobile GPUs) · content-visibility per section · lazy images.

**High-DPR / large monitors:** removing the no-op blurs matters most here (`backdrop-filter` cost grows ~radius², and `transform:scale` enlarges the kernel). **Guardrail:** never add `will-change`/`translateZ` to the DesignFrame inner — at high DPR it promotes the whole ~1920×19,624 canvas into one GPU texture (hundreds of MB). Isolation is achieved via `content-visibility` instead.

**Reduced-motion / touch:** every infinite loop now bails to its static frame; smooth-scroll and parallax are skipped; only tap/press feedback remains.
