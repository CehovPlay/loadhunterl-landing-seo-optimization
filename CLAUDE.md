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

There are TWO experiences, switched by `useFlowLayout` (`src/components/site/useFlowLayout.ts`,
matchMedia `max-width: 1023px`) and code-split in `App.tsx`:

- **≥ 1024px — the fixed 1920 desktop canvas** (`src/sections/*`): NOT responsive in the usual flow
  sense. Each section is **absolutely pixel-positioned** against the 1920px canvas, and `DesignFrame`
  (`src/components/site/DesignFrame.tsx`) uniformly `transform: scale()`s it to the viewport. This is
  why every element there uses exact `px` values.
- **< 1024px — the flow layout** (`src/sections/mobile/*`): a real responsive layout built from
  scratch on the desktop content (2026-07-16) — no canvas, no scaling. It is mobile-first with the
  TABLET refinements expressed as `md:` (≥768px) Tailwind modifiers in the SAME components — there is
  deliberately no third section tree. Conventions: content column `px-5 max-w-[440px]`, tablet
  `md:px-8 md:max-w-[768px]`; sections `py-16`; touch targets ≥44px (buttons/pill rows are 48-56px);
  type via `clamp()` + `md:` bumps (section h2 → 40/48 on tablet); horizontal snap carousels
  (`.lh-snap` in index.css) for ecosystem/testimonials; accordion FAQ; stepper instead of the drag
  slider in Pricing. Tablet-specific layout: features 2-col grid (3rd card spans), tools items 2-col,
  pricing cards 2×2, hero CTAs side by side, CTA card + automation panel side by side, footer in one
  row. Shared content modules: `pricingFeatures.tsx`, `pricingLogic.ts`, `LINKS` from `Navbar.tsx`,
  `RotatingHeadline` (type scale via `h1ClassName`/`subClassName` props), `Stars`
  (`src/components/site/Stars.tsx`). The old Figma adaptive frames are NOT the source of truth — the
  desktop version is.

**Mobile gotcha — SVGs without intrinsic size:** most `/figma/*.svg` exports carry only a viewBox, so
`w-auto`/`h-auto` on an `<img>` falls back to the 300×150 replaced-element default and blows up the
layout. Always give such images explicit width AND height (ratio from the viewBox).

**Mobile gotcha — opaque glow PNGs paint over static text:** `why-glow.png` (and likely other
baked-on-dark exports) is FULLY OPAQUE (alpha=1 everywhere; invisible on the dark canvas). Any
absolutely-positioned decor that comes later in the DOM paints ABOVE plain static text — and reveal
CLEARS its transforms when done, dropping text back into the static layer. Symptom: heading visible
mid-animation, gone at rest. That's why `SectionHeader` (mobile ui.tsx) carries `relative z-10`; give
any text that decorative absolutes can overlap the same treatment. Diagnose with
`document.elementFromPoint` at the text's center AFTER animations settle, not with opacity checks.

**Hero shader on the flow layout:** `MobileHeroShader` progressively enables the autonomous `drift`
variant of `ShaderStack` (no cursor) — gated on `navigator.gpu` adapter probe at browser idle, skipped
for reduced motion and `?noshader`. Static CSS gradients in `MobileHero` are the instant paint and the
permanent fallback. The `shaders` engine self-throttles (DPR ≤1.5 on mobile GPUs, pauses offscreen via
its own IntersectionObserver). NOTE: CDP screenshots that emulate reduced-motion will show the static
fallback — that's the gate working, not a bug; screenshot without the emulation to see the shader.

**Verifying mobile:** headless Chrome clamps windows to ≥~500px, so `--window-size=390,...` silently
lays out at 500 and crops — do NOT use it for mobile shots. Use CDP device emulation instead
(`Emulation.setDeviceMetricsOverride`); full-page captures taller than ~8000 CSS px must be taken in
clips (Chrome's 16384px surface limit wraps/tiles beyond it, which looks like duplicated sections).

**Scaling contract (critical, easy to get wrong):** `scale = Math.min(viewportWidth / canvasWidth, maxScale)`.
`App.tsx` passes `maxScale={1}` so that **above 1920px the canvas stops growing and centers** with side
gutters (body bg + BleedBg cover them). Without the cap the whole page balloons (×1.33 at 2560, ×2 at
4K) — that was tried and rejected as too large on 2K. Any future viewport-relative scaling MUST apply
the same cap.

**Gotcha — elements outside the canvas transform.** `position: fixed` does not escape a scaled
ancestor, so the scroll-shrunk compact navbar pill in `Navbar.tsx` is rendered through a
`createPortal` to `document.body` and re-applies the canvas scale itself — and therefore carries its
own copy of the same `Math.min(vw/1920, 1)` cap. If you add any other fixed/portalled overlay that
must visually track the canvas, replicate that pattern.

`DesignFrame` measures with `document.documentElement.clientWidth` (scrollbar-excluded, consistent
across first paint and resize).

## Animation system (data-attribute driven)

Two init functions run once per canvas mount, from `CanvasEffects` rendered after the landing tree in
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
  `public/figma/**` (per-section folders). Text, tables, buttons and
  lists are real HTML with exact geometry.
- Use the `<Img>` component (`src/components/site/Img.tsx`), not bare `<img>`, for `/figma/**` rasters:
  it serves AVIF→WebP→PNG via `<picture class="contents">` (layout-transparent) and reserves box size
  from `src/generated/img-dimensions.ts` to avoid CLS. That manifest and the AVIF/WebP siblings are
  generated by `scripts/transcode-images.mjs` (auto-run on `prebuild`) — after adding a new raster to
  `public/figma/`, run `npm run transcode`.
- Vite `manualChunks` splits `vendor-react` and `vendor-anim` (gsap/lenis) for cache stability.

## Product context — Obsidian vault

Deep product/domain knowledge (features, billing/seats logic, pricing rules, personas, roadmap,
competitors, referral program, supported load boards) lives in an Obsidian vault at
`~/Documents/loadhunter-base/` (start at `00 — Индекс (MOC).md`). Prefer reading the relevant note
there over re-deriving product behavior from scratch — e.g. the pricing calculator's discount tiers
map to `02 — Фичи/RPM и Profit-калькулятор.md` and `04 — Биллинг/Биллинг, trial и seats.md`. A
related vault for the TMS product exists at `~/Documents/Hunt TMS Base/`.
