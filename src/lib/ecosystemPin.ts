import gsap from "gsap"

/**
 * Scroll-pin for the "Our ecosystem products" section.
 *
 * When the floating card reaches the vertical centre of the viewport it stays
 * put ("pinned") while scrolling drives two reversible, scroll-linked phases:
 *   1. EXPAND — the card grows in ALL directions from its resting panel until
 *      it covers the full viewport (width AND height), corners flattening
 *      to 0; scrolling back shrinks it again. The content is
 *      counter-translated on both axes so it never shifts — the panel grows
 *      symmetrically around it. Above the canvas width the card escapes the
 *      centered canvas into the side gutters (the canvas doesn't clip; see
 *      DesignFrame). There is NO separate backdrop/cover layer — the card
 *      itself is the fullscreen surface, and the page behind it stays visible
 *      at its edges until the card swallows the viewport.
 *   2. LIST   — the internal product list scrolls from the first card to the
 *      last inside the now-fullscreen window.
 * Once the last card is reached the pin releases and the page scrolls on.
 *
 * Like reveal.ts / the parallax layer, this reads getBoundingClientRect every
 * ticker frame and works purely from the section's live rect, so it is immune
 * to the scaled design canvas and Lenis smoothing — no ScrollTrigger (which
 * mis-measures inside the scale() transform).
 *
 * Geometry is per-breakpoint: the desktop values below are the defaults, and
 * a section can override any of them with JSON in its data-eco-pin attribute
 * (see Ecosystem.tsx / TabletMain.tsx / PhoneOrbitEco.tsx):
 *  - sectionW   full-canvas width, used to recover the live scale
 *  - cardH      resting card height
 *  - cardTop    card's absolute top within the section (may be negative when
 *               the card hangs up into the previous section)
 *  - cardLeft/cardW  resting card left / width
 *  - radius     resting corner radius (flattens to 0 while expanding)
 *  - windowTop  the list window's top offset inside the card (0 when the
 *               window spans the whole card, as on desktop)
 *  - expand     scroll runway (px) that maps to the fullscreen expansion
 *  - listContent  product list height (rows + gaps + paddings)
 *  - listScroll layout scroll runway reserved for the list phase; the actual
 *               list travel is rescaled to the live window height each frame
 * The section's own height must equal its static footprint plus
 * (expand + listScroll) — the whole pinned runway.
 */
const DESKTOP = {
  sectionW: 1920,
  cardH: 1000,
  cardTop: -623,
  cardLeft: 120,
  cardW: 1680,
  radius: 12,
  windowTop: 0,
  expand: 600,
  // 5 rows × 320 + 4 gaps × 20 + 2 × 40 padding (fleetHUNT + huntONE merged
  // into the single huntOS row, 2026-07-21)
  listContent: 1760,
  listScroll: 1100,
}

type PinConfig = typeof DESKTOP

export function initEcosystemPin() {
  const section = document.querySelector<HTMLElement>("[data-eco-pin]")
  const stage = document.querySelector<HTMLElement>("[data-eco-stage]")
  const list = document.querySelector<HTMLElement>("[data-eco-list]")
  if (!section || !stage || !list) return () => {}
  const inner = document.querySelector<HTMLElement>("[data-eco-inner]")
  const win = document.querySelector<HTMLElement>("[data-eco-window]")

  const cfg: PinConfig = {
    ...DESKTOP,
    ...(JSON.parse(section.dataset.ecoPin || "{}") as Partial<PinConfig>),
  }
  const TOTAL = cfg.expand + cfg.listScroll

  // Reduced motion: skip the scroll-jack and let the list scroll natively so
  // every card stays reachable.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const prev = win?.style.overflowY
    if (win) {
      win.style.overflowY = "auto"
      win.setAttribute("data-lenis-prevent", "")
    }
    return () => {
      if (win) {
        win.style.overflowY = prev ?? ""
        win.removeAttribute("data-lenis-prevent")
      }
    }
  }

  const { clamp, interpolate } = gsap.utils
  const noop = () => {}
  const setStageY = gsap.quickSetter(stage, "y", "px")
  const setList = gsap.quickSetter(list, "y", "px")
  const setWidth = gsap.quickSetter(stage, "width", "px")
  const setHeight = gsap.quickSetter(stage, "height", "px")
  const setLeft = gsap.quickSetter(stage, "left", "px")
  const setRadius = gsap.quickSetter(stage, "borderRadius", "px")
  const setInnerX = inner ? gsap.quickSetter(inner, "x", "px") : noop
  const setInnerY = inner ? gsap.quickSetter(inner, "y", "px") : noop
  const setWinY = win ? gsap.quickSetter(win, "y", "px") : noop
  const setWinH = win ? gsap.quickSetter(win, "height", "px") : noop

  const tick = () => {
    const r = section.getBoundingClientRect()
    if (!r.width) return
    const s = r.width / cfg.sectionW // live canvas scale
    const vh = window.innerHeight
    // viewport size in design px — the card's fullscreen target. Above the
    // canvas width it exceeds the canvas (the card spills into the gutters);
    // short viewports never shrink the card below its resting size.
    const vwD = Math.max(cfg.cardW, document.documentElement.clientWidth / s)
    const vhD = Math.max(cfg.cardH, vh / s)
    // viewport Y at which the card top must sit to be vertically centred
    const centeredTop = (vh - cfg.cardH * s) / 2
    // section.top at the instant the card (resting at cardTop) reaches centre
    const pinStartTop = centeredTop - cfg.cardTop * s
    // progress into the pin, in design px (clamped to the runway)
    const t = clamp(0, TOTAL, (pinStartTop - r.top) / s)

    // phase 1: fullscreen expansion (0 → 1 over the first `expand` px)
    const p = clamp(0, 1, t / cfg.expand)

    const w = interpolate(cfg.cardW, vwD, p)
    const h = interpolate(cfg.cardH, vhD, p)
    const left = interpolate(cfg.cardLeft, (cfg.sectionW - vwD) / 2, p)
    // vertical growth is symmetric: the top edge rises by half the added height
    const dy = (h - cfg.cardH) / 2
    const dyFull = (vhD - cfg.cardH) / 2

    // The grown panel is dyFull taller below its resting bottom, but the
    // section's static height only reserves the resting footprint — held for
    // the whole runway, the fullscreen panel would trail past the section's
    // bottom edge and its sides would stick out beside the (canvas-wide) next
    // section in the gutters. So the hold ends dyFull early: the panel's
    // bottom lines up exactly with the section bottom at release and the two
    // scroll away as one seam. The remaining runway scrolls the pinned-no-more
    // panel naturally.
    const hold = Math.min(t, TOTAL - dyFull)

    setStageY(hold - dy) // hold the card centred while it grows upward too
    setWidth(w)
    setHeight(h)
    setLeft(left)
    setRadius(interpolate(cfg.radius, 0, p))
    // cancel the panel's leftward/upward growth so the content stays put
    setInnerX(cfg.cardLeft - left)
    setInnerY(dy)
    // the list window stretches with the stage as it grows (its overflow past
    // the card bottom is clipped by the stage itself)
    setWinY(-dy)
    setWinH(h)

    // phase 2: list scroll (starts once fully expanded, ends when the hold
    // ends). The live window is (vhD - windowTop) tall, so the actual overflow
    // differs from the reserved layout runway — rescale the progress to always
    // land exactly on the last card at the moment the pin releases.
    const listMax = Math.max(0, cfg.listContent - (vhD - cfg.windowTop))
    const listRunway = Math.max(1, TOTAL - dyFull - cfg.expand)
    const listT = clamp(0, listMax, ((hold - cfg.expand) / listRunway) * listMax)
    setList(-listT)
  }

  gsap.ticker.add(tick)
  tick()

  return () => {
    gsap.ticker.remove(tick)
    gsap.set([stage, list], {
      clearProps: "transform,width,height,left,borderRadius",
    })
    if (inner) gsap.set(inner, { clearProps: "transform" })
    if (win) gsap.set(win, { clearProps: "transform,height" })
  }
}
