# LoadHunter — Landing Page

Marketing site for **LoadHunter**, an AI copilot for freight dispatchers (browser extension for DAT, Truckstop and other load boards).

A pixel-perfect implementation of the Figma design — the full 1920px artboard is reproduced 1:1 (whole-page mean pixel deviation from the design render: **~1.1/255**, i.e. font antialiasing level), enriched with scroll choreography and an interactive pricing calculator.

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
npm run dev        # dev server (Vite, HMR)
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run lint       # oxlint
npm run typecheck  # tsc only
```

## How it's built

### Fixed design canvases (desktop / tablet / phone)

The page renders on a fixed-width canvas that scales uniformly to the viewport (`src/components/site/DesignFrame.tsx`), so hand-built HTML and exported Figma imagery stay pixel-identical at every screen size. Three canvases match the Figma adaptive frames and switch by viewport width (`useBreakpoint`):

| Canvas | Viewport | Sections |
|---|---|---|
| Desktop 1920 | ≥ 1024px | `src/sections/*` |
| Tablet 768 | 640–1023px | `src/sections/tablet/*` |
| Phone 390 | < 640px | `src/sections/phone/*` |

Sections are absolutely pixel-positioned; page heights match the artboards exactly. Above 1920px the desktop canvas does **not** scale up — it locks at 1× and centers with side gutters, exactly like the Figma 2K adaptive frame. Decorative content (orbit rings, the testimonials marquee, the fullscreen-expanding ecosystem panel, footer dividers) deliberately bleeds past the canvas into those gutters; light sections paint their gutters via `BleedBg`. Each breakpoint ships as its own lazy chunk, so a phone visitor never downloads the desktop sections.

### Sections

| Component | Content |
|---|---|
| `Navbar` | pill navigation with anchor links (smooth-scrolled through Lenis) |
| `Hero` | gradient headline, product mockup, extension settings popup |
| `Features` | partners logo strip + three feature cards |
| `DispatchIntro`, `Tools` | seven alternating feature blocks (Smart-board, Auto-emailing, Telegram, TMS, Map, Broker reviews, Profit calculator) |
| `Orbit` | 15 live badge pills orbiting the centre mark on canvas-drawn dotted rings |
| `Ecosystem` | scroll-pinned products panel — see below |
| `WhyLoadHunter` | comparison table (HTML) over a glow backdrop, vector check/cross icons |
| `ChaosDiagram` | "From chaos to AI-powered dispatch" diagram with looping violet beams |
| `Pricing` | interactive plan cards + calculator — see below |
| `Testimonials` | live full-bleed marquee of review cards |
| `Faq`, `Cta`, `Footer` | FAQ list, "Add to Chrome" card, footer with vector orbit rings |

Text, tables, buttons and lists are real HTML with exact Figma geometry; purely decorative visuals (product mockups, glows) are 2x PNG/SVG exports under `public/figma/`.

### Ecosystem scroll-pin

`src/lib/ecosystemPin.ts` pins the "Our ecosystem products" panel at the viewport centre and drives two reversible, scroll-linked phases: the card expands in all directions until it covers the whole viewport (corners flattening to zero), then the six-product list scrolls through it before the pin releases flush with the next section. It reads live `getBoundingClientRect()` every ticker frame instead of using ScrollTrigger, so it is immune to the scaled canvas and Lenis smoothing. Geometry is per-breakpoint via a JSON `data-eco-pin` attribute — the same engine runs the desktop, tablet and phone variants.

### Interactive pricing

The production loadhunter.io calculator, on all three breakpoints (`pricingLogic.ts` is shared):

- 1–50 dispatchers on a draggable slider (non-linear zones anchored to the discount badges)
- team discount: 3 dispatchers → −10%, 4+ → −20%; annual billing → extra ×0.9
- per-dispatcher price is truncated to cents, then multiplied by headcount — card prices update live
- tablet and phone render the plans as accordions (Figma "Tablet case" / "Plan mobile case"): Basic is open by default, selecting a plan collapses the open one — column widths animate on tablet, card heights on phone

### Animations

- `src/lib/reveal.ts` — cascading scroll-reveal driven by IntersectionObserver: elements entering together are merged and revealed in *visual* order (row by row, left to right), falling like a staircase; respects `prefers-reduced-motion`
- `src/lib/micro.ts` — data-attribute micro-animation layer: `data-float`, `data-pulse`, `data-spin`, `data-parallax`, `data-lift`, `data-magnetic`, `data-tilt`, `data-countup`, button press feedback
- Testimonials marquee drifts right-to-left; hovering a card eases the drift to a stop and lights the card with the design's violet hover state
- Orbit badges revolve clockwise (~3–4 min per ring), counter-rotating to stay upright; the rotation runs on compositor layers and pauses whenever the section is offscreen

## Project layout

```
public/figma/        2x asset exports from the Figma file
                     (per-section subfolders + phone/ and tablet/ variants)
src/
  components/site/   DesignFrame (canvas scaler), BleedBg, useBreakpoint
  lib/               reveal.ts, micro.ts, ecosystemPin.ts (scroll systems)
  sections/          desktop sections (1920 canvas), pixel-positioned
  sections/tablet/   tablet sections (768 canvas)
  sections/phone/    phone sections (390 canvas)
  sections/pricingFeatures.tsx, pricingLogic.ts   shared pricing data/logic
  index.css          Tailwind 4 theme: Figma color/typography/radius/shadow tokens
```
