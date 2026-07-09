import gsap from "gsap"

/**
 * Scroll-pin for the "Our ecosystem products" section.
 *
 * When the floating card reaches the vertical centre of the viewport it stays
 * put ("pinned") while scrolling drives two reversible, scroll-linked phases:
 *   1. EXPAND — the card widens from its resting 1680px panel to the full
 *      1920px canvas (full viewport width), corners flattening to 0; scrolling
 *      back shrinks it again. The content is counter-translated so it never
 *      shifts left/right — the panel grows symmetrically around it.
 *   2. LIST   — the internal product list scrolls from the first card to the
 *      last.
 * Once the last card is reached the pin releases and the page scrolls on.
 *
 * Background lock: the card floats up over the Orbit section and is shorter
 * than tall viewports, so without help the Orbit content above it would scroll
 * while the card is pinned. A `data-eco-cover` backdrop is sized to the
 * viewport every frame (so it stays visually fixed) and faded in with the
 * expansion, hiding that motion — only the card's own transform animates.
 *
 * Like reveal.ts / the parallax layer, this reads getBoundingClientRect every
 * ticker frame and works purely from the section's live rect, so it is immune
 * to the scaled design canvas and Lenis smoothing — no ScrollTrigger (which
 * mis-measures inside the scale() transform).
 *
 * Geometry (design px, must match Ecosystem.tsx):
 *  - SECTION_W   full-canvas width, used to recover the live scale
 *  - CARD_H      card height (the pinned box)
 *  - CARD_TOP    card's absolute top within the section (it hangs up into Orbit)
 *  - CARD_LEFT0/W0  resting card left / width (panel with 120px side margins)
 *  - CARD_LEFT1/W1  expanded card left / width (full-bleed canvas)
 *  - EXPAND      scroll runway (px) that maps to the full width expansion
 *  - LIST_SCROLL inner list overflow = content height − window height
 *                (6×320 rows + 5×20 gaps + 2×40 padding = 2100, window 1000)
 *  - RELEASE_FADE scroll window over which the backdrop fades back out before
 *                the pin releases, so the next section is never covered
 *  - TOTAL       EXPAND + LIST_SCROLL — the whole pinned runway
 */
const SECTION_W = 1920
const CARD_H = 1000
const CARD_TOP = -623
const CARD_LEFT0 = 120
const CARD_W0 = 1680
const CARD_LEFT1 = 0
const CARD_W1 = 1920
const RADIUS0 = 12
const EXPAND = 600
const LIST_SCROLL = 1100
const TOTAL = EXPAND + LIST_SCROLL

export function initEcosystemPin() {
  const section = document.querySelector<HTMLElement>("[data-eco-pin]")
  const stage = document.querySelector<HTMLElement>("[data-eco-stage]")
  const list = document.querySelector<HTMLElement>("[data-eco-list]")
  if (!section || !stage || !list) return () => {}
  const inner = document.querySelector<HTMLElement>("[data-eco-inner]")
  const cover = document.querySelector<HTMLElement>("[data-eco-cover]")

  // Reduced motion: skip the scroll-jack and let the list scroll natively so
  // every card stays reachable.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const win = list.parentElement
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
  const setLeft = gsap.quickSetter(stage, "left", "px")
  const setRadius = gsap.quickSetter(stage, "borderRadius", "px")
  const setInnerX = inner ? gsap.quickSetter(inner, "x", "px") : noop
  const setCoverTop = cover ? gsap.quickSetter(cover, "top", "px") : noop
  const setCoverH = cover ? gsap.quickSetter(cover, "height", "px") : noop

  const tick = () => {
    const r = section.getBoundingClientRect()
    if (!r.width) return
    const s = r.width / SECTION_W // live canvas scale
    const vh = window.innerHeight
    // viewport Y at which the card top must sit to be vertically centred
    const centeredTop = (vh - CARD_H * s) / 2
    // section.top at the instant the card (resting at CARD_TOP) reaches centre
    const pinStartTop = centeredTop - CARD_TOP * s
    // progress into the pin, in design px (rawT unclamped; t clamped to runway)
    const rawT = (pinStartTop - r.top) / s
    const t = clamp(0, TOTAL, rawT)

    // phase 1: width expansion (0 → 1 over the first EXPAND px)
    const p = clamp(0, 1, t / EXPAND)
    // phase 2: list scroll (starts once fully expanded)
    const listT = clamp(0, LIST_SCROLL, t - EXPAND)

    setStageY(t) // hold the card centred (compensates the page scrolling it up)
    setWidth(interpolate(CARD_W0, CARD_W1, p))
    setLeft(interpolate(CARD_LEFT0, CARD_LEFT1, p))
    setRadius(interpolate(RADIUS0, 0, p))
    // cancel the panel's leftward growth so the content stays put
    setInnerX(interpolate(0, CARD_LEFT0 - CARD_LEFT1, p))
    setList(-listT) // scroll the product list first → last card in step

    // backdrop: a solid (never faded) box whose HEIGHT is driven by the scroll
    // so the section fills in smoothly instead of snapping. It grows from 0 up
    // to the full viewport over the expand phase, centred behind the card, so
    // the panel appears to enlarge with the page. After the pin ends its centre
    // freezes at the release point (max()), so at full height it simply scrolls
    // away with the section — never snapping off.
    const grow = clamp(0, 1, rawT / EXPAND)
    const coverH = grow * (vh / s)
    const refTop = Math.max(r.top, pinStartTop - TOTAL * s)
    setCoverH(coverH)
    setCoverTop((vh / 2 - refTop) / s - coverH / 2)
  }

  gsap.ticker.add(tick)
  tick()

  return () => {
    gsap.ticker.remove(tick)
    gsap.set([stage, list], {
      clearProps: "transform,width,left,borderRadius",
    })
    if (inner) gsap.set(inner, { clearProps: "transform" })
    if (cover) gsap.set(cover, { clearProps: "top,height" })
  }
}
