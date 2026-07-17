# LoadHunter — Landing Page

Marketing site for **LoadHunter**, an AI copilot for freight dispatchers (browser extension for DAT, Truckstop and other load boards).

On the desktop it's a pixel-perfect reproduction of the Figma 1920px artboard (whole-page mean pixel deviation from the design render: **~1.1/255**, i.e. font-antialiasing level); below 1024px it switches to a hand-built responsive flow layout. Both are enriched with GSAP scroll choreography and an interactive pricing calculator.

![Preview](docs/preview.png)

## Stack

- [React 19](https://react.dev) + TypeScript, built with [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) — design tokens from Figma live in `src/index.css` (`@theme`)
- [GSAP](https://gsap.com) — scroll-reveal cascades, the ecosystem scroll-pin, marquees, micro-animations
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling, synced with GSAP's ticker
- Static [Inter](https://rsms.me/inter/) via Fontsource (weight 500 — the only weight the design uses)

## Getting started

```bash
npm install
npm run dev        # dev server (Vite + HMR) → http://localhost:5173
npm run build      # typecheck + production build to dist/ (runs transcode first)
npm run preview    # serve the production build
npm run lint       # oxlint
npm run typecheck  # tsc only
npm run transcode  # regenerate AVIF/WebP siblings for public/figma/** (append -- --force to rebuild all)
```

Requires Node 20+. There is no test suite — a change is verified visually (see `CLAUDE.md` for the
headless-Chrome screenshot workflow).

## How it's built

### Two experiences, one breakpoint

The layout switches at 1024px via `useFlowLayout` (`src/components/site/useFlowLayout.ts`, a
`max-width: 1023px` matchMedia), and the two trees are `React.lazy` code-split in `App.tsx` so a phone
visitor never downloads the desktop tree:

| Viewport   | Tree                  | Model |
|------------|-----------------------|-------|
| ≥ 1024px   | `src/sections/*`      | fixed 1920 desktop canvas, uniformly scaled |
| < 1024px   | `src/sections/mobile/*` | real responsive flow layout (mobile-first, `md:` = tablet) |

**Desktop (≥ 1024px)** is *not* responsive in the usual flow sense: each section is absolutely
pixel-positioned against the 1920px canvas, and `DesignFrame` (`src/components/site/DesignFrame.tsx`)
uniformly `transform: scale()`s that canvas to the viewport — which is why every element uses exact
Figma `px` values. `App.tsx` passes `maxScale={1}`, so above 1920px the canvas stops growing and
centers with side gutters (body background + `BleedBg` cover them); below 1920px it scales down.

**Mobile (< 1024px)** is a single mobile-first flow layout built from scratch on the desktop content
— no canvas, no scaling. The tablet refinements are expressed as `md:` (≥768px) Tailwind modifiers in
the *same* components; there is deliberately no third section tree. Conventions: content column
`px-5 max-w-[440px]` → `md:px-8 md:max-w-[768px]`, `py-16` sections, touch targets ≥44px, type via
`clamp()` with `md:` bumps, horizontal snap carousels (`.lh-snap`) for ecosystem/testimonials, an
accordion FAQ, and a stepper (not the desktop drag slider) in Pricing.

### Sections (desktop)

| Component | Content |
|---|---|
| `Navbar` | pill navigation with anchor links (smooth-scrolled through Lenis) |
| `Hero` | gradient headline, product mockup, extension settings popup |
| `Features` | partners logo strip + three feature cards |
| `Tools` | seven alternating feature blocks (Smart-board, Auto-emailing, Telegram, TMS, Map, Broker reviews, Profit calculator) |
| `Orbit` | live badge pills orbiting the centre mark on canvas-drawn dotted rings |
| `Ecosystem` | scroll-pinned products panel — see below |
| `WhyLoadHunter` | comparison table (HTML) over a glow backdrop, vector check/cross icons |
| `ChaosZoom` | "From chaos to AI-powered dispatch" deep-zoom transition |
| `Pricing` | interactive plan cards + calculator — see below |
| `Testimonials` | live full-bleed marquee of review cards |
| `Faq`, `Cta`, `Footer` | FAQ list, "Add to Chrome" card, footer with vector orbit rings |

The `src/sections/mobile/*` tree mirrors these as flow-layout components (`MobileHero`, `MobileTools`,
`MobilePricing`, `MobileTestimonials`, …), sharing the content/logic modules below.

Text, tables, buttons and lists are real HTML with exact Figma geometry; purely decorative visuals
(product mockups, glows) are 2× PNG/SVG exports under `public/figma/`, served as AVIF→WebP→PNG through
the `<Img>` component (`npm run transcode` generates the AVIF/WebP siblings and a size manifest in
`src/generated/img-dimensions.ts` to avoid layout shift).

### Ecosystem scroll-pin

`src/lib/ecosystemPin.ts` pins the "Our ecosystem products" panel at the viewport centre and drives
two reversible, scroll-linked phases: the card expands in all directions until it covers the whole
viewport (corners flattening to zero), then the product list scrolls through it before the pin
releases flush with the next section. It reads live `getBoundingClientRect()` every ticker frame
instead of using ScrollTrigger, so it is immune to the scaled canvas and Lenis smoothing.

### Interactive pricing

The production loadhunter.io calculator (`src/sections/pricingLogic.ts` is shared between desktop and
mobile):

- 1–50 dispatchers on a draggable slider (desktop) / stepper (mobile), non-linear zones anchored to the discount badges
- team discount: 3 dispatchers → −10%, 4+ → −20%; annual billing → extra ×0.9
- per-dispatcher price is truncated to cents, then multiplied by headcount — card prices update live

### Animations

- `src/lib/reveal.ts` — GSAP `ScrollTrigger.batch` cascading fade/rise as elements enter the viewport, once per element; respects `prefers-reduced-motion`. Opt out with `[data-no-reveal]`.
- `src/lib/micro.ts` — data-attribute micro-animation layer: `data-float`, `data-pulse`, `data-parallax`, `data-lift`, `data-magnetic`, `data-tilt`, `data-countup`, button press feedback
- Testimonials marquee drifts right-to-left; hovering a card eases the drift to a stop and lights the card with the design's violet hover state
- Orbit badges revolve clockwise, counter-rotating to stay upright; the rotation runs on compositor layers and pauses whenever the section is offscreen

## Project layout

```
public/figma/        2x asset exports from the Figma file (per-section subfolders)
src/
  components/site/   DesignFrame (canvas scaler), BleedBg, Img, useFlowLayout
  lib/               reveal.ts, micro.ts, ecosystemPin.ts (scroll systems)
  sections/          desktop sections (1920 canvas), pixel-positioned
  sections/mobile/   flow-layout sections (< 1024px), mobile-first + md: tablet
  sections/pricingFeatures.tsx, pricingLogic.ts   shared pricing data/logic
  generated/         img-dimensions.ts (generated by npm run transcode)
  index.css          Tailwind 4 theme: Figma color/typography/radius/shadow tokens
```

## More docs

- [`PERFORMANCE.md`](PERFORMANCE.md) — scroll-jank fixes and the measured main-thread / bundle wins
- [`CLAUDE.md`](CLAUDE.md) — deep architecture notes, mobile gotchas, and the visual-verification (headless Chrome) workflow
