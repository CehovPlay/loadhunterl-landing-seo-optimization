# LoadHunter corporate site (loadhunt.ai)

Homepage of the ecosystem site specified in `LoadHunter_TOR_корпоративный_сайт`. This is a separate
product from the extension landing that lives at the repo root: different domain, different stack,
47 pages to come. It sits in a subfolder so the two can share the repo without sharing a build.

```bash
npm run dev        # http://localhost:4311
npm run build      # static prerender of every route
npm run typecheck
```

Screenshot the running app the way the root project does, and use CDP device emulation for mobile
widths since headless Chrome clamps `--window-size` to about 500px.

## What is built

First pass covers TZ §27.4 (first screen), §27.5 (the operating cycle) and §27.7 (stop 01,
LoadHunter), plus the global header (§5.3) and footer (§5.4 / §26.4). Stops 02 to 05, the
assembled-ecosystem block, role selection, proof and the final conversion block (§27.8 to §27.16) are
not built.

## Decisions this branch is standing on

**Light, not dark.** §11.1 makes the light surface the primary variant and §12.1 keeps dark theme out
of P0. The colour, radius and type values are the Figma brand tokens the extension landing already
ships; what changed is polarity, not palette. The landing's dark greys became ink, its light greys
became ground.

**Master spec wins on copy.** Where the master and the per-page tab disagree, the master is canon.
That decision covers the hero (§6.1/§27.4 rather than tab 01), the header CTA (§27.3 rather than the
generic §5.3 "Start Free") and stop 01's button. The block body copy in stop 01 comes from tab 01
because it is the only approved English for it. Full conflict list: `~/loadhunter-tz/README.md`.

**Next.js, per §14.1.** App Router, every route static-prerendered, no client-side routing shell. The
homepage HTML contains all indexable copy with nothing hidden behind hydration.

**One accent.** Violet carries every action. The only other colours on the page are the three status
tones, and they only ever appear next to a capability, which is what §3.6 and §42.2 require.

**Header and footer come from the extension landing.** Same floating white pill nav with the compact
scrolled variant, same dark footer band with brand, contacts, newsletter, link columns, disclaimer,
divider and bottom bar. Three deliberate differences:

- The landing portals the compact pill to `document.body` and re-applies the 1920-canvas scale, because
  `position: fixed` cannot escape a scaled ancestor there. This site is a flow layout, so the pill is
  just `fixed` and the portal and scale factor are gone.
- Both pills gain a hairline and the pill shadow. On the landing's dark page plain white is enough
  separation; on paper it is not.
- The newsletter form does not fake success. Without `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` it says it is
  not connected, rather than telling a visitor they are subscribed when nothing was sent (§42.1).

The footer keeps its dark surface deliberately. That is not a theme switch: the page is one road
(§25.1) and the band is where it ends, which is why the rail and the padded container stop above it.

## The idea the page is built on

One rail. A hairline runs the full height of the page at the left edge of the content column, and a
violet segment grows down it with scroll: that is how far the load has travelled. Sections are stops
on it, the nodes fill as you reach them, and hovering a product lights that segment. §25.1 asks for
one road rather than a stack of blocks, and the only way that reads is if the geometry is literally
continuous, so every section shares the container and the same left edge.

The load is one object. The card in the hero and the card in stop 01 are the same component with the
same figures; stop 01 adds the decision layer to it. §7.2 is explicit that showing two different
loads lets the visitor credit the product for the load instead of for the analysis.

## The hero band

The first screen is full height and the surface behind it moves: `ShaderBand` + `ShaderStack`, both
ported from the landing. A white-to-`#f0f0f0` pearl drift goes through `FlutedGlass` and `FilmGrain`,
with the brand violet fenced to the top of the band by a luminance mask so it can never reach the H1
or the CTAs. The band dissolves into the page ground before the section ends, so the seam into the
cycle has no edge.

It is the only moving surface on the site, and that is the rule: everything below the hero is
figures, statuses and routes, and those need a still ground to be read against.

Three things it must keep doing:

- **Paint in order.** Flat base colour first (identical to the shader's idle background), then the
  static fallback gradients, then the WebGPU stack at browser idle. The first screen is complete
  before any of it arrives — §43.1 and §46.3 do not allow otherwise.
- **Portal to `<body>` at `z-index: -1`.** The canvas has to span the viewport, not the centred 1400
  column, and it carries the base colour itself so the side gutters are covered. The host section
  stays transparent.
- **Go quiet on narrow viewports.** The fluted bands are a fixed count across the canvas, so at 390px
  each is four times wider than at 1440 and the aberration that reads as soft refraction on desktop
  reads as holographic rainbow stripes on a phone. `compact` raises the frequency and cuts the
  aberration to a third.

`?noshader` renders only the base colour and the fallback — for headless screenshots and for
bisecting jank. `prefers-reduced-motion` takes the same path permanently, and so does anything
without working WebGPU, which today includes Safari.

## Motion

GSAP with ScrollTrigger, and Lenis driven from GSAP's ticker so smoothing and every trigger advance
on the same frame. Lenis is created only for fine-pointer visitors with motion enabled; touch keeps
native momentum and reduced-motion keeps the plain scrollbar.

Five animations, each with a job:

| What | Job |
|---|---|
| Hero stagger | Hierarchy. Walks the eye down promise, explanation, action once on arrival. |
| Rail progress | State. Shows how far along the route the visitor is. Scrubbed, never eased. |
| Layer rows in stop 01 | Storytelling. The decision layer arrives on the card in reading order. |
| Rail segment on row hover | Feedback. Says which stop is under the pointer. |
| Hero shader drift | Atmosphere. The only autonomous motion on the site, on the only screen with no data on it. |

Entry animations set their from-state in an effect, never in the markup, so §43.1 and §46.3 hold: a
visitor without JavaScript gets the finished page rather than an empty stage.

## Open, and blocking the rest of the page

- **Analytics contract.** The TZ specifies five incompatible event-parameter schemas. Nothing is
  wired until one is chosen.
- **Product screenshots.** §27.14 allows an honest process demonstration where approved proof does
  not exist yet, which is what the load card is. Real approved product frames should replace it.
- **Brand Registry (§14.3).** Legal entity, contacts and social profiles are missing, so the JSON-LD
  carries only name, URL and logo.
- **Destinations.** Every `href` here points at a route that does not exist on this branch yet.
- **Legal entity.** §5.4 wants the copyright line to carry the entity from the Brand Registry. Until
  that registry exists the line carries the trading name only.
- **Newsletter endpoint.** Backend-owned. Set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` to a URL accepting
  `{ email }` as JSON; double opt-in has to be enforced server side.
- **Status page host.** The footer links `/status`; §2.7 prefers `status.loadhunt.ai` once real
  monitoring is connected.
