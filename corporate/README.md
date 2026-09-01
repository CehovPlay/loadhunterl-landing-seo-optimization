# LoadHunter corporate site (loadhunt.ai)

The ecosystem site specified in `LoadHunter_TOR_корпоративный_сайт` — 47 spec tabs, 161 built
routes. A separate product from the extension landing at the repo root: different domain, different
stack, its own build. It sits in a subfolder so the two share the repo without sharing a build.

```bash
npm run dev          # http://localhost:4311
npm run build        # static prerender of every route; postbuild prints the real transfer budget
npm run typecheck
npm run check        # typecheck + links + redirects + sweep + overflow
npm run publishable  # what the owner still has to decide before this can go live
```

**Desktop only for now.** The owner suspended responsive work; verify at 1280 / 1440 / 1920. The
mobile paths that already exist still work, they are simply not maintained.

Deeper background — the spec, its conflicts, the copy, the decision log — lives in the Obsidian vault
`~/Documents/LoadHunter Corporate Base/`, starting at `00 — Индекс (MOC).md`. Developer decisions
belong there as well as in code; a markdown file in the repo alone does not count as delivered.

## Verification runs over CDP

There is no test suite. "Verifying a change" means driving headless Chrome from `scripts/`:

```bash
node scripts/shot.mjs "http://localhost:4311/" 1440 900 out.png    # screenshot; SCROLL=, DSF=, WAIT=
node scripts/eval.mjs <url> 1440 900 'document.title'              # measure inside the page
node scripts/console.mjs <url> 1280 800                            # console + uncaught exceptions
node scripts/sweep.mjs      # every route: one H1, title, description, no untranslated Russian
node scripts/links.mjs      # every href and #anchor resolves
node scripts/redirects.mjs  # the 17 §5.2 redirect rules actually fire
node scripts/overflow.mjs   # ROUTES=/a,/b to scope
node scripts/budget.mjs     # real transfer, split by interaction
```

Long pages are read as a series of viewport shots at `SCROLL` positions — Chrome caps a full-page
capture at 7800 px.

## Architecture

**Content is data, not components.** `content/tz/pages.json` holds all 47 tabs as parsed by
`scripts/parse-tz.mjs`; `PageSkeleton` renders any of them through 13 block archetypes. A page is a
row of data plus an override where the spec asked for something specific.

**Six registries, per §14.3, in `content/registry/`.** They replaced a 626-line `content/home.ts`
that mixed governance with homepage copy. The dependency rule is one-way and load-bearing:
**registries never import components.**

| File | Holds | Gate it enforces |
|---|---|---|
| `brand.ts` | name, domain, logos, social image, disclaimer | legal entity is `null` until the owner supplies one |
| `status.ts` | the §3.6 Status Ledger — 9 claims, each with owner/source/verifiedAt | `unpublishable()`; `statusAnswerText()` renders FAQ availability from the ledger itself |
| `products.ts` | the five products; external destinations are `confirmed` or `pending` | §15.3 — LoadHunter and huntDRIVE have no confirmed URL yet |
| `commercial.ts` | pricing mode, forbidden patterns, 7 §18.3 approval gates | **no dollar amounts exist anywhere**; tab 19 forbids placeholders |
| `integrations.ts` | only Telegram and Stripe — the sole vendors the spec names | indexability of filter pages |
| `schema.ts` | JSON-LD conditions per type | `Offer`/`Product` need an approved price *and* `offerVisible`; `filterGraph` drops the rest loudly |
| `redirects.ts` | 17 rules for §5.2-forbidden URL shapes | all `verified: true`, proven by `scripts/redirects.mjs` |

`index.ts` exports `publicationBlockers()`, which returns `{registry, item, reason}[]`. It is a
**deploy-time check, deliberately not a build error** — the site must stay buildable while the owner
decides. `npm run publishable` currently lists 22.

**`content/ia.ts`** is the single source for navbar, footer and sitemap. `assertIndexCovers` proves
every spec route appears somewhere. Two subtleties: `hidden?: boolean` marks bar entries that are
also listed inside a footer group (Home and About), so the duplicate check discounts one occurrence
per hidden section; and `OFF_SPEC` holds routes that exist in the product but not in the 47 tabs
(`/trucking-directory`).

**`content/directory/`** is the trucking directory, 115 routes from Figma `zt7S0UIB6gvsBEl7L4xNBt`.
`source.ts` is the seam — `listCities`, `getCompany`, `searchCompanies`, all async, plus
`SOURCE.kind`, today `"sample"`. `mock.ts` generates 97 records from a deterministic LCG seeded
`20260820` so the pages are stable across builds. **Swap `source.ts` when the FMCSA import lands;
nothing else should need to change.** Every page says out loud that the data is sample data.

## The homepage: a pinned road

The current art direction, after four iterations. Do not redesign it without reading
`03 — Главная/Главная — арт-дирекшн дороги.md` in the vault first.

The page is one road with five stops, each a verb from §27.7–27.11. The scene is a full-bleed
isometric three.js stage; the copy sits in the free band beside it; scroll drives everything.

- **One number drives it all.** `progress` moves the load along a curve, picks the active stop, and
  feeds each station's `tick(near, time)`. Stations play their own meaning — a board scanning, four
  bay doors rolling up, a trailer reversing onto a dock, invoice plates lifting, four lines
  converging.
- **Full bleed.** `.freight-canvas` is `left: 50%; width: 100vw; transform: translateX(-50%)`.
  `.road-frame` must **not** have `overflow: hidden` — it clips the canvas back to the container.
- **The camera yields to the copy.** `FreightRoute.tsx` measures how much of the frame the active
  stop's columns occupy and calls `setBand()`; the scene converts that into `camera.setViewOffset`,
  capped at half the frame so the tallest stop cannot push the station off-screen. Measure the
  **columns**, not the grid — the grid is `h-full` and never resizes — and re-measure on settle
  timers, because the load-board proof plays itself open 900 ms after becoming visible.
- **Anchors live on markers inside the runway**, at `top: i/(n-1)*100%`, not on the stops. Stops are
  absolutely positioned inside one sticky frame, so an id on a stop resolves to the frame.
- **Progressive enhancement.** `data-scene="on"` switches the CSS. Without WebGL, or with
  `prefers-reduced-motion`, all five stops render as an ordinary scrolling document — verified.

Three.js is plain, no react-three-fiber. `OrthographicCamera` at 35.264°/45°, `RoomEnvironment` +
`PMREMGenerator` for IBL, clay `MeshStandardMaterial`, ACES tone mapping, `EffectComposer` +
`GTAOPass`. Tune AO against `?ao=debug`.

Two gotchas that cost real time: `Object3D.position` is read-only and must be mutated, never
replaced (`Object.assign` onto it throws and silently kills the whole scene — check the console, not
just `data-scene`); and coplanar faces z-fight into a dashed black speckle that looks exactly like AO
noise, so give parts 2 cm of air.

## Scene geometry is authored in Blender

`scripts/scene/` builds station geometry with headless Blender and exports glTF. Full write-up in
`04 — Код/Сцена — пайплайн Blender.md`.

```bash
brew install --cask blender     # 5.2.0 LTS
npm run scene:build -- --station board --out public/scene --preview
```

The web scene built every shape from one `BoxGeometry` — 31 boxes, no bevels. It read flat not for
lack of polygons but for **lack of edges**. Blender is used as a script, not through MCP: the scene
is procedural and belongs in version control, and a preview PNG gives the same feedback loop as a
viewport screenshot while staying reproducible.

**The naming contract is load-bearing.** The runtime does not re-create geometry; it looks parts up
by name and drives them exactly as it does now (38 per-frame mutations in `freight-scene.ts`). Export
a named hierarchy; never merge meshes. Blender is Z-up and three.js is Y-up, so `to_blender()`
converts and `export_yup=True` unwinds it, letting both files quote the same numbers. The animated
parts, whose name, size and centre must not drift, are listed at the top of `build.py`.

**Previews render the arrived pose, not the resting one.** A station at rest is a trailer parked
inside a building and doors that never opened, so `POSES` reproduces near=1 for the render only —
`one()` exports first, then poses. Judge form from these; judge colour from three.js, which is where
ACES, IBL and GTAO actually live.

All five stations are ported: 78 KB gzipped for the set, 16 600 triangles. Modelling them surfaced
two things the box version had hidden. The dock's trailer floor sat at y=0.3 while its lip sat at
1.14, so the lip dropped onto thin air — with boxes for wheels nobody could see it, with round ones
it is the first thing you notice; the trailer now stands at dock height. And the source scene is
self-contradictory about which way the trailer arrives (see below).

**Draco is off, and that is a measurement.** One station, 1 944 triangles: 74.6 KB plain → **12.0 KB
gzipped**, versus 30.8 KB Draco → 8.7 KB. Draco saves 3.3 KB per station while its decoder costs
286 KB of wasm. It pays off at hundreds of thousands of triangles, not thousands. Ship plain GLB and
let the CDN compress. Five stations ≈ 60 KB, in the scroll bucket, so the §17.1 initial target is
unaffected.

## Performance

`scripts/budget.mjs` drives headless Chrome, records **real network transfer**, and splits by
**interaction** — `initial` versus `scrolled` — not by the load event.

It was wrong three times before that, and each failure is worth remembering: reading `<script>` tags
from prerendered HTML misses chunks imported from other chunks (the homepage measured 300 KB while
the browser fetched ~1 MB); walking the chunk graph by filename over-counts, billing lazily-imported
three.js to first load; and splitting on `Page.loadEventFired` is unstable, because a page with more
DOM fires `load` later. **Measure the network, not the manifest.**

That instrument found a decorative WebGPU hero shader pulling **688 KB of TypeGPU** at idle on every
homepage visit. It was removed; the homepage went 967 → 277 KB.

Today: `/` is **278.3 KB initial + 143.3 KB on scroll**. §17.1 wants 240 KB at launch; the remaining
38 KB is Phosphor, gsap and React, and needs targeted work.

Three.js is fetched lazily inside an `IntersectionObserver` with `rootMargin: "0px"`. It was `"100%
0px"`, which defeated the lazy import entirely — the road sits directly under the hero.

## Standing conventions

- **UI text is sentence case.** No caps except genuine abbreviations.
- **No lossy image recompression.** Vectors or structural optimisations only.
- **Nothing fakes success.** The newsletter form says it is not connected rather than claiming a
  subscription; unpublished capabilities say so on the page.
- **From-states are set in effects, never in markup**, and JS-only states live behind
  `html[data-js="on"]`, stamped inline before first paint. §43.1 and §46.3 require the full meaning
  and a working CTA without scripting.

## Open

Run `npm run publishable` for the live list. As of this commit, 22 items, all owner decisions:

- Legal entity for the §5.4 copyright line and the Brand Registry.
- Owners for all 9 Status Ledger claims.
- Chrome Web Store URL and the huntDRIVE Telegram link (§15.3).
- The 7 §18.3 approval gates.
- Data owners for the Telegram and Stripe integrations.
- **"LoadConnect"** appears in directory FAQ answer 4 and is not in the Product Registry; §10.2
  requires exactly five products of one system.

Also open:

- **34 blocks across 7 tabs** still carry Russian builder instructions instead of English visitor
  copy: `/`, `/products`, `/platform`, `/broker-intelligence`, `/accessibility`, `/support`,
  `/login`.
- **Directory hub figures** print "Pending the FMCSA import" until the backend lands.
- **Analytics vendor and consent gate.** Events are emitted to `dataLayer` and a DOM event under tab
  01's schema (template group A); the spec carries five incompatible schemas and no vendor is wired.
- **Hero copy conflict.** Tab 01 and master §27.4 carry two different first screens; this branch
  ships tab 01's. One has to be retired.
- **Newsletter endpoint.** Set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` to a URL accepting `{ email }`;
  double opt-in must be enforced server side.
- **Real product frames.** §27.14 allows the honest process demonstration currently shipped.
- **Wiring the GLBs into the runtime.** The stations are authored and exported but
  `freight-scene.ts` still builds boxes; nothing loads them yet. This is the next real step, and it
  needs `GLTFLoader` (~30 KB) plus a lookup that replaces each `slab()` with `getObjectByName`.
- **The dock's approach axis, to be settled at wiring time.** `dock.lip` is modelled on the +z face
  and `rotation.x` tips its outer edge down, which is correct leveller behaviour only for a trailer
  arriving from +z — but the runtime lerps `trailer.position.x`. Either the runtime moves the trailer
  in z, or the lip needs a different axis. Today the trailer is offset to park alongside, clear of
  the shed, which looks right but is not the sentence the block is making.
- **The board reads thin.** Its panel carries three rows on a lot of empty face. Composition, not
  geometry — worth an art-direction pass rather than another blind iteration.
- **Baked AO** — an open call to bake occlusion into vertex colours at build time and drop
  `GTAOPass` from the runtime.
