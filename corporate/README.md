# LoadHunter corporate site (loadhunt.ai)

Homepage of the ecosystem site specified in `LoadHunter_TOR_корпоративный_сайт`. This is a separate
product from the extension landing that lives at the repo root: different domain, different stack,
47 pages to come. It sits in a subfolder so the two can share the repo without sharing a build.

```bash
npm run dev        # http://localhost:4311
npm run build      # static prerender of every route
npm run typecheck
```

Verification runs over CDP, from `scripts/`:

```bash
node scripts/shot.mjs "http://localhost:4311/?noshader" 1440 900 out.png   # screenshot
SCROLL=2000 DSF=1 node scripts/shot.mjs <url> 390 844 m.png                # scrolled, cheap
node scripts/eval.mjs <url> 390 844 'document.documentElement.scrollWidth' # measure in page
node scripts/console.mjs <url> 1280 800                                    # console + exceptions
```

Mobile widths have to come from device emulation: headless Chrome clamps `--window-size` to about
500px. Long pages are read as a series of viewport shots at `SCROLL` positions, because Chrome caps
a full-page capture at 7800px. `?noshader` renders base colour and fallback only.

Deeper background - the spec, its conflicts, the copy, the decision log - lives in the Obsidian vault
`~/Documents/LoadHunter Corporate Base/`.

## What is built

The whole homepage, in the order tab 01 specifies: hero, then blocks 1 to 8, then the FAQ, plus the
global header (§5.3) and footer (§5.4 / §26.4).

| Block | Section | Proof |
|---|---|---|
| Hero | Run freight as one connected operation. | Sample load passport, with the load followed through the five products |
| 01 | The road starts with the next load | Board result and the same result with the LoadHunter layer |
| 02 | Turn the booked load into an operating plan | The load arriving on the dispatch board, with owner, next step, timing and exception |
| 03 | Keep the driver and office on the same mile | Driver action on the phone, consequence on the office panel - the visitor drives it |
| 04 | Close the load without opening a new process | Proof of delivery becoming an invoice timeline |
| 05 | See the exceptions before they become calls | Four lanes converging, then what the command layer puts first |
| 06 | Choose your entry point | Route selector (role, urgent job, team size) and the five cards |
| 07 | Proof before promise | Pinned proof rail: what is published, what is not, and the status matrix |
| 08 | The operating system is the destination | The data trail, ending on the CTA the visitor's answers earned |
| FAQ | Five questions, verbatim | Availability answer rendered from the ledger |

Every block obeys the rule the tab repeats under all eight: the CTA opens after the visitor has seen
half the block or touched its proof, never as a pop-up. Analytics events are emitted for all seven
names the tab lists (`lib/analytics.ts`), to `dataLayer` and a DOM event; no vendor is wired and no
PII enters a payload.

## Decisions this branch is standing on

**Light, not dark.** §11.1 makes the light surface the primary variant and §12.1 keeps dark theme out
of P0. The colour, radius and type values are the Figma brand tokens the extension landing already
ships; what changed is polarity, not palette. The landing's dark greys became ink, its light greys
became ground.

**The page tab wins on copy.** Where tab 01 and master §27 disagree, tab 01 is canon for this page,
and every string it prints as "точный контент" or "Точный текст" is reproduced verbatim. That
reverses an earlier call and changes the hero (H1, supporting copy, both CTAs, microcopy), the block
sequence, the CTA labels, the FAQ and the metadata. Nothing is merged between the two: the master's
variants are still the owner's to choose, and they are logged as conflict 1 in
`~/loadhunter-tz/README.md`.

Where a block's exact text is an instruction to the builder rather than visitor copy - blocks 6, 7
and 8, and FAQ answer 2 - the instruction is carried out with governed material instead of being
paraphrased into marketing prose. The job line on each product card is that product page's own H1,
the user line is its audience, the selector's questions offer the page passport's audiences, the JTBD
sentences from master §2.3 and the priority segments from §2.2, and the availability answer is the
status ledger itself.

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

The load is one object. Load LH-4471 - Dallas to Atlanta, dry van, $2,180, 762 miles - is the same
load in the hero, on the board, on the dispatch row, in the driver's hand, on the invoice timeline
and in the exception list. §7.2 is explicit that showing two different loads lets the visitor credit
the product for the load instead of for the analysis, and §27.6 wants the handover of context to be
something you can watch.

Nothing on the page fakes a screenshot. Every panel is the real field set of the shipped workflow
filled with clearly labeled sample data, which is the honest process demonstration §27.14 allows
while approved customer proof does not exist. Two of the four cards in block 7 say out loud that they
are not published yet.

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
| The load arriving on the board (02) | Storytelling. The handover is the claim, so it is the thing that moves. |
| Invoice steps and exception rows (04, 05) | Reading order. The trail runs one way and is finished before the CTA. |
| Lanes converging (05) | Relationship. Four signal sources, one layer. Opacity, not a dash draw - the viewBox is stretched horizontally and a dash pattern comes out of that unevenly. |
| Staged CTA reveal | The tab's own rule, made visible: the action arrives once the block has been read. |
| Hero shader drift | Atmosphere. The only autonomous motion on the site, on the only screen with no figures on it. |

The driver lane in block 3 runs no timers at all: it moves only when the visitor moves it, which is
what a demonstration of "one action at a time" should do anyway, and it means reduced motion needs no
separate path through it.

Entry animations set their from-state in an effect, never in the markup, so §43.1 and §46.3 hold: a
visitor without JavaScript gets the finished page rather than an empty stage. The same applies to the
two states that are closed by default - the staged CTAs and the disclosures inside the proofs. Both
are expressed in CSS behind `html[data-js="on"]`, stamped by an inline script before first paint, so
the server HTML ships them open: the acceptance criteria require the full meaning and an available
CTA without scripting, and an inline `opacity: 0` would take exactly that away from the people who
cannot open it again.

## Open, and blocking the rest of the page

- **Analytics contract.** The TZ specifies five incompatible event-parameter schemas. The page emits
  tab 01's set (template group A) to `dataLayer`; the vendor, the consent gate in front of it and the
  final schema are still open.
- **Hero copy conflict.** Tab 01 and master §27.4 carry two different first screens. This branch
  ships tab 01's. One of them has to be retired.
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
