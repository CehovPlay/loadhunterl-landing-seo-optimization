# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing landing page for **LoadHunter** — an AI copilot (browser extension) for freight dispatchers. It is a pixel-perfect reproduction of a Figma 1920px artboard (whole-page mean deviation ~1.1/255), enriched with GSAP scroll animations, Lenis smooth scroll, and an interactive pricing calculator. React 19 + TypeScript + Vite 8 + Tailwind CSS 4.

## Commands

```bash
npm run dev        # Vite dev server + HMR (http://localhost:5173)
npm run build      # tsc -b (typecheck) then vite build → dist/  (runs prebuild transcode)
npm run typecheck  # tsc -b --noEmit only
npm run lint       # oxlint (config in .oxlintrc.json)
npm run preview    # serve the production build
npm run transcode  # regenerate AVIF/WebP siblings for public/figma/** (add -- --force to rebuild all)
```

There is no test suite. "Verifying a change" means visual verification. Chrome is at
`/Applications/Google Chrome.app` — drive it headless to screenshot the running dev server at a
target width, e.g.:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-sandbox \
  --hide-scrollbars --window-size=2560,1440 --virtual-time-budget=9000 \
  --screenshot=out.png "http://localhost:5173/"
```

`--virtual-time-budget` is required — the SPA needs time to render before Chrome exits. Crop tall
screenshots with `sharp` (a devDependency) since full-page captures are ~19 000px tall.

## Architecture — the fixed-canvas scaling model (read this first)

The entire page is NOT responsive in the usual flow sense. Each section is **absolutely
pixel-positioned** against a fixed-width design canvas that exactly matches a Figma adaptive frame,
and `DesignFrame` (`src/components/site/DesignFrame.tsx`) uniformly `transform: scale()`s that canvas
to the viewport. This is why every element uses exact `px` values from Figma.

Three canvases are chosen by viewport width via `useBreakpoint` (`src/components/site/useBreakpoint.ts`)
and code-split with `React.lazy` in `App.tsx` (a phone visitor never downloads the desktop tree):

| Breakpoint | Viewport   | Canvas width | Sections dir              |
|------------|------------|--------------|---------------------------|
| desktop    | ≥ 1024px   | 1920         | `src/sections/*`          |
| tablet     | 640–1023px | 768          | `src/sections/tablet/*`   |
| phone      | < 640px    | 390          | `src/sections/phone/*`    |

**Scaling contract (critical, easy to get wrong):** `scale = Math.min(viewportWidth / canvasWidth, maxScale)`.
`App.tsx` passes `maxScale={1}` for the desktop canvas so that **above 1920px the canvas stops growing
and centers** (`margin: 0 auto`) with side gutters — matching the Figma 2K (2560) / Full HD (1920)
frames, which keep content at identical pixel sizes and only add gutters. Without the cap the whole
page balloons (×1.33 at 2560, ×2 at 4K). Any future viewport-relative scaling MUST apply the same cap.

**Gotcha — elements outside the canvas transform.** `position: fixed` does not escape a scaled
ancestor, so the scroll-shrunk compact navbar pill in `Navbar.tsx` is rendered through a
`createPortal` to `document.body` and re-applies the canvas scale itself — and therefore carries its
own copy of the same `Math.min(vw/1920, 1)` cap. If you add any other fixed/portalled overlay that
must visually track the canvas, replicate that pattern.

Crossing 640/1024 tears down and rebuilds the whole section tree + Lenis + reveal, so `useBreakpoint`
debounces resize (150ms) and `DesignFrame` measures with `document.documentElement.clientWidth`
(scrollbar-excluded, consistent across first paint and resize).

## Animation system (data-attribute driven)

Two init functions run once per canvas mount, from `CanvasEffects` inside the Suspense boundary in
`App.tsx` (so the DOM exists before they hide elements for reveal):

- `src/lib/reveal.ts` (`initReveal`) — GSAP `ScrollTrigger.batch` cascading fade/rise as elements
  enter the viewport, once per element, respecting `prefers-reduced-motion`. Opt out with
  `[data-no-reveal]`; `[data-marquee-track]` children are skipped but `[data-card]` items reveal as
  whole blocks. It only clears the inline styles it set — never React-managed ones.
- `src/lib/micro.ts` (`initMicro`) — hover/scroll micro-animations wired purely via data-attributes:
  `data-float`, `data-pulse`, `data-parallax="k"`, `data-lift`, `data-magnetic`, `data-tilt="deg"`,
  `data-countup`. To add one, put the attribute on the element — no per-element JS.

`src/lib/inview.ts` exposes `isCoarsePointer()` / `prefersReducedMotion()`. Lenis is created only for
fine-pointer + motion-enabled visitors (`useLenis` in `App.tsx`); touch and reduced-motion fall back
to native scroll + `scrollIntoView` for anchor links.

## Design tokens & images

- **Tokens** live in `src/index.css` under Tailwind 4's `@theme` — exact Figma color / type-scale /
  radius values. Use these tokens (and Figma `px`), not ad-hoc values, to preserve pixel parity.
- **Images:** decorative visuals (mockups, glows, orbit rings) are 2× PNG/SVG exports in
  `public/figma/**` (per-section folders, plus `phone/` and `tablet/`). Text, tables, buttons and
  lists are real HTML with exact geometry.
- Use the `<Img>` component (`src/components/site/Img.tsx`), not bare `<img>`, for `/figma/**` rasters:
  it serves AVIF→WebP→PNG via `<picture class="contents">` (layout-transparent) and reserves box size
  from `src/generated/img-dimensions.ts` to avoid CLS. That manifest and the AVIF/WebP siblings are
  generated by `scripts/transcode-images.mjs` (auto-run on `prebuild`) — after adding a new raster to
  `public/figma/`, run `npm run transcode`.
- Vite `manualChunks` splits `vendor-react` and `vendor-anim` (gsap/lenis) for cache stability; the
  three canvases are already `React.lazy` code-split.

## Product context — Obsidian vault

Deep product/domain knowledge (features, billing/seats logic, pricing rules, personas, roadmap,
competitors, referral program, supported load boards) lives in an Obsidian vault at
`~/Documents/loadhunter-base/` (start at `00 — Индекс (MOC).md`). Prefer reading the relevant note
there over re-deriving product behavior from scratch — e.g. the pricing calculator's discount tiers
map to `02 — Фичи/RPM и Profit-калькулятор.md` and `04 — Биллинг/Биллинг, trial и seats.md`. A
related vault for the TMS product exists at `~/Documents/Hunt TMS Base/`.
