# LoadHunter — Landing Page

Marketing site for **LoadHunter**, an AI copilot for freight dispatchers (browser extension for DAT, Truckstop and other load boards).

On the desktop it's a pixel-perfect reproduction of the Figma 1920px artboard (whole-page mean pixel deviation from the design render: **~1.1/255**, i.e. font-antialiasing level); below 1024px it switches to a hand-built responsive flow layout. Both are enriched with GSAP scroll choreography, a WebGPU shader hero and an interactive pricing table.

![Preview](docs/preview.png)

## Stack

- [React 19](https://react.dev) + TypeScript, built with [Vite](https://vite.dev)
- [Tailwind CSS 4](https://tailwindcss.com) — design tokens from Figma live in `src/index.css` (`@theme`)
- [GSAP](https://gsap.com) — scroll choreography (spine draw, dive, ecosystem pin), marquees, micro-animations
- [Lenis](https://lenis.darkroom.engineering) — smooth scrolling, synced with GSAP's ticker (mouse visitors only; touch scrolls natively)
- [shaders](https://www.npmjs.com/package/shaders) — WebGPU hero/orbit bands, autonomous drift (no cursor tracking), with static CSS/SVG fallbacks where WebGPU is unavailable (Safari today)
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
headless-browser screenshot workflow). **Judge scroll performance on `npm run preview`, not the dev
server** — dev-mode React is several times slower.

## Handover / integration points (backend)

The site is fully static — `npm run build` → deploy `dist/` to any static host. It is currently
served from Vercel (project `loadhunter-extension-landing`, deployed via `npx vercel --prod`); moving
to the `loadhunter.io` domain is just pointing the host at the same build.

**Full handoff doc for the backend team: [`docs/BACKEND.md`](docs/BACKEND.md)** (in Russian —
what's wired, the exact Klaviyo call for the subscribe form, GA4, domain move checklist).

Already wired (external URLs are centralized as constants in `src/sections/Navbar.tsx`):

- **"Add to Chrome"** (navbar, hero "Start booking in seconds", CTA card, mobile menu) → the Chrome
  Web Store listing (`CHROME_STORE_URL`).
- **"Get Demo"** → Calendly `loadhunterdev/30min` (`CALENDLY_URL` — the same event PROD embeds
  on `/demo`); **"Contact"** → `https://t.me/loadhunterextension`
- **Trial CTAs** — hero "Start 14-day free trial" + pricing-table CTAs → `https://app.loadhunter.io`
  (`APP_URL`, per-plan `ctaHref` in `planMatrix.tsx`); AI plan "Add to wishlist" → Telegram.
- Footer socials → Telegram / Instagram / YouTube / X; **$LHUNT** → `https://coin.loadhunt.ai`
- **Privacy / Terms** → static `public/privacy.html` + `public/terms.html` (dark, responsive,
  PROD copy), linked from both footers and listed in `sitemap.xml`.

Still stubs, to be wired before launch:

- **Subscribe forms** (both footers) — `preventDefault` stubs; needs only a Klaviyo `list_id`
  (frontend-only wiring, see `docs/BACKEND.md`).
- **Analytics** — GA4 loads only when the build gets `VITE_GA_ID` (`src/lib/analytics.ts`);
  PROD uses `G-VXPXV4HPCV`.
- SEO meta, `robots.txt`, `sitemap.xml` and the OG image already assume `https://loadhunter.io`.

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
accordion FAQ, and plan-selector tabs (not the desktop compare table) in Pricing.

### Sections (desktop)

| Component | Content |
|---|---|
| `Navbar` | pill navigation; compact portalled pill after scrolling |
| `Hero` | rotating typed headline over the WebGPU shader band (autonomous violet drift; static tints on Safari) |
| `Features` | partners logo marquee + three feature cards with inline-SVG scenes |
| `ChaosZoom` | "From chaos to AI-Powered dispatch" — scroll-scrubbed dive into the hyphen; the headline is a **pre-generated SVG outline** (see `scripts/gen-chaos-headline.mjs`), not live text |
| `Tools` | seven alternating feature blocks along a glowing spine (Smart-board, Auto-emailing, Telegram, TMS, Map, Broker reviews, Profit calculator) |
| `Orbit` | concentric-ring shader band around the centre mark (dotted-ring SVG fallback on Safari) |
| `Ecosystem` | scroll-pinned products panel — expands to fullscreen, then the list scrolls; see below |
| `Pricing` | live-priced compare table (5 plans × 40 feature rows) + dispatcher slider and billing toggle |
| `Testimonials` | full-bleed review marquee (native snap carousel on touch) |
| `Faq`, `Cta`, `Footer` | FAQ list, "Add to Chrome" card, compact footer with socials |

The `src/sections/mobile/*` tree mirrors these as flow-layout components (`MobileHero`, `MobileTools`,
`MobilePricing`, `MobileTestimonials`, …), sharing the content/logic modules (`planMatrix.tsx`,
`pricingLogic.ts`, `RotatingHeadline`, `Stars`, `LINKS`/`CHROME_STORE_URL`).

Text, tables, buttons and lists are real HTML with exact Figma geometry; purely decorative visuals
(product mockups, glows) are 2× PNG exports under `public/figma/`, served as AVIF→WebP→PNG through
the `<Img>` component (`npm run transcode` generates the AVIF/WebP siblings and a size manifest in
`src/generated/img-dimensions.ts` to avoid layout shift). The heaviest below-fold mockups are
prefetched and decoded on first idle (`useImageWarmup` in `App.tsx`) so they never decode mid-scroll.

### Preloader

An inline (pre-bundle) preloader in `index.html` owns the screen during hydration: the LH mark
self-assembles, the wordmark wipes out of it, then two dark panels split apart to reveal the site.
It locks scrolling while visible; `App.tsx` re-applies `location.hash` deep links on unlock.

### Ecosystem scroll-pin

`src/lib/ecosystemPin.ts` pins the "Our ecosystem products" panel at the viewport centre and drives
two reversible, scroll-linked phases: the card expands in all directions until it covers the whole
viewport (with overscan past the edges — page-zoom rounding must never expose the background), then
the product list scrolls through it before the pin releases flush with the next section. It reads
live `getBoundingClientRect()` per ticker frame instead of ScrollTrigger (immune to the scaled canvas
and Lenis smoothing), is IntersectionObserver-gated and skips frames where nothing changed.

### ChaosZoom dive

The section zooms the SVG viewBox ~×430 into the headline's hyphen. At that depth GPU Chrome's font
rasterisation falls apart, so the headline ships as **vector outlines** generated from the designer's
Figma export: `assets/chaos-headline.svg` → `node scripts/gen-chaos-headline.mjs` →
`src/generated/chaosHeadline.ts`. To change the headline, replace the SVG export and re-run the
script — no code changes needed.

### Interactive pricing

`src/sections/pricingLogic.ts` mirrors the production loadhunter.io calculator and is shared between
desktop and mobile: team rate (3 dispatchers → −10%, 4+ → −20%), annual billing → extra ×0.9 applied
without re-rounding, displayed figure = monthly **team total**. `src/sections/planMatrix.tsx` holds
the plan definitions and the 40-row feature matrix both layouts render.

### Animations

Current animation policy (2026-07-21): the shader bands, the hero headline entrance and the partner
marquee are the only "alive" zones — everything below is static (the scroll-reveal cascade in
`src/lib/reveal.ts` is disabled via `REVEAL_DISABLED`; the machinery is kept). Desktop keeps its
scroll choreography: the Tools spine draw, the ChaosZoom dive, the ecosystem pin and the testimonials
marquee. `src/lib/micro.ts` provides the data-attribute micro-layer (`data-float`, `data-parallax`,
`data-magnetic`, `data-countup`, press feedback…). Every loop is IntersectionObserver-gated to cost
nothing off-screen, and every scroll ticker skips frames where nothing changed.

## Project layout

```
assets/              designer source exports (chaos-headline.svg)
public/figma/        2x asset exports from the Figma file (per-section subfolders)
scripts/             transcode-images.mjs, gen-chaos-headline.mjs
src/
  components/site/   DesignFrame (canvas scaler), ShaderBand/ShaderStack, BleedBg, Img, …
  lib/               reveal.ts, micro.ts, ecosystemPin.ts, inview.ts (scroll systems)
  sections/          desktop sections (1920 canvas), pixel-positioned
  sections/mobile/   flow-layout sections (< 1024px), mobile-first + md: tablet
  sections/planMatrix.tsx, pricingLogic.ts   shared pricing data/logic
  generated/         img-dimensions.ts, chaosHeadline.ts (generated — do not edit)
  index.css          Tailwind 4 theme: Figma color/typography/radius/shadow tokens
```

## More docs

- [`PERFORMANCE.md`](PERFORMANCE.md) — scroll-jank fixes and the measured main-thread / bundle wins
- [`CLAUDE.md`](CLAUDE.md) — deep architecture notes, mobile gotchas, and the visual-verification (headless browser) workflow
