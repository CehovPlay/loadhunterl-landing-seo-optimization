import gsap from "gsap"

/**
 * Scroll-reveal: text blocks and visual elements fade/rise in a cascade as
 * they enter the viewport. Driven by IntersectionObserver (not scroll
 * positions), so it is immune to the scaled design canvas, Lenis smoothing
 * and cached-layout drift. Elements revealed in the same frame are staggered.
 *
 * Opt-outs:
 *  - [data-no-reveal] on an element or ancestor — skip entirely
 *  - [data-marquee-track] — children skipped (the track has its own tween);
 *    individual [data-card] items are still revealed as whole cards.
 *
 * Clip awareness (IntersectionObserver clips the target by every
 * overflow-hidden ancestor, so a hidden element that never overlaps its clip
 * box never intersects and would stay invisible forever):
 *  - fully clipped at rest (marquee copies waiting off-strip, inner-scroll
 *    rows below their container fold) — left untouched; they become visible
 *    the moment the track/scroll brings them in
 *  - elements the 28px rise would push fully out of a tight clip box
 *    (e.g. logo wrappers that clip SVG bleed) — fade only, no rise
 */
const RISE = 28

export function initReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {}
  }

  const candidates = document.querySelectorAll<HTMLElement>(
    [
      "main h1",
      "main h2",
      "main h3",
      "main h4",
      "main p",
      "main button",
      "main img",
      "main [data-card]",
      "footer h2",
      "footer h3",
      "footer p",
      "footer button",
      "footer img",
      "footer a",
      "footer [data-card]",
    ].join(", "),
  )

  const clipRects = (el: HTMLElement): DOMRect[] => {
    const out: DOMRect[] = []
    let a = el.parentElement
    while (a && a !== document.body) {
      const cs = getComputedStyle(a)
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible")
        out.push(a.getBoundingClientRect())
      a = a.parentElement
    }
    return out
  }

  const items: HTMLElement[] = [] // rise + fade
  const fadeOnly: HTMLElement[] = []
  candidates.forEach((el) => {
    if (el.closest("[data-no-reveal]")) return
    // inside a testimonial card: reveal the card as one block
    const card = el.closest<HTMLElement>("[data-card]")
    if (card && card !== el) return
    // inside the marquee track but not a card (spacers, logos)
    if (!card && el.closest("[data-marquee-track]")) return
    const r = el.getBoundingClientRect()
    // already ABOVE the viewport (e.g. browser restored a mid-page scroll
    // position on reload): it will never intersect — leave it visible
    if (r.bottom < 0) return
    // rects are in viewport (scaled) px; the gsap rise is in layout px
    const rise = RISE * (el.offsetHeight ? r.height / el.offsetHeight : 1)
    let riseSafe = true
    for (const c of clipRects(el)) {
      // degenerate box: DesignFrame's outer div is height-0 during this same
      // layout-effect pass (its measured height commits right after) — ignore
      if (c.width < 1 || c.height < 1) continue
      // fully clipped at rest — IO can never fire; leave untouched
      if (r.bottom <= c.top || r.top >= c.bottom || r.right <= c.left || r.left >= c.right)
        return
      // the rise would push it fully below this clip box — deadlock
      if (r.top + rise >= c.bottom) riseSafe = false
    }
    ;(riseSafe ? items : fadeOnly).push(el)
  })

  gsap.set(items, { autoAlpha: 0, y: RISE })
  gsap.set(fadeOnly, { autoAlpha: 0 })
  const all = [...items, ...fadeOnly]

  const show = (batch: HTMLElement[]) =>
    gsap.to(batch, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      // fixed cascade window: many elements => tighter steps, so even the
      // densest section (pricing, ~90 nodes) settles in ~1.5s
      stagger: { amount: Math.min(0.6, batch.length * 0.09), from: "start" },
      overwrite: true,
    })

  const io = new IntersectionObserver(
    (entries) => {
      const batch = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
      if (!batch.length) return
      batch.forEach((el) => io.unobserve(el))
      // cascade in document order
      batch.sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      )
      show(batch)
    },
    // fire slightly before the element fully enters (≈ "top 94%")
    { rootMargin: "0px 0px -6% 0px", threshold: 0 },
  )
  all.forEach((el) => io.observe(el))

  return () => {
    io.disconnect()
    // clear ONLY what the reveal set — never React-managed inline styles
    gsap.set(all, { clearProps: "transform,opacity,visibility" })
  }
}
