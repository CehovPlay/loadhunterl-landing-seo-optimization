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
  // 2026-07-21, user's animation policy: the shader, the hero entrance and
  // the partner marquee are the only "alive" zones — everything below renders
  // STATIC, no appear/reveal animations. The whole cascade is disabled; the
  // machinery below is kept for easy re-enabling.
  const REVEAL_DISABLED = true
  if (REVEAL_DISABLED) return () => {}
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
    // content-visibility:auto skips off-screen subtrees during this init pass
    // (it runs in a layout-effect, before paint), collapsing descendant rects to
    // ~0×0. Those can't be clip-analysed — and unlike a genuinely off-strip
    // marquee copy (which keeps a real size) a collapsed element simply hasn't
    // laid out yet. So skip the clip walk, hide + rise it, and let the runtime
    // IntersectionObserver reveal it once its section renders on approach.
    const degenerate = r.width < 1 && r.height < 1
    // rects are in viewport (scaled) px; the gsap rise is in layout px
    const rise = RISE * (el.offsetHeight ? r.height / el.offsetHeight : 1)
    let riseSafe = true
    if (!degenerate) {
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
    }
    ;(riseSafe ? items : fadeOnly).push(el)
  })

  if (items.length) gsap.set(items, { autoAlpha: 0, y: RISE })
  if (fadeOnly.length) gsap.set(fadeOnly, { autoAlpha: 0 })
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

  // Pending elements are merged over a short window and cascaded in VISUAL
  // order — by row (quantized top), then left to right. Document order made
  // side-by-side columns (the pricing feature lists) reveal column-by-column,
  // which read as random; spatial order falls like a staircase instead.
  let pending: HTMLElement[] = []
  let flushTimer: ReturnType<typeof setTimeout> | null = null
  const flush = () => {
    flushTimer = null
    const batch = pending
    pending = []
    if (!batch.length) return
    const pos = new Map(
      batch.map((el) => {
        const r = el.getBoundingClientRect()
        return [el, { row: Math.round(r.top / 24), left: r.left }] as const
      }),
    )
    batch.sort((a, b) => {
      const pa = pos.get(a)!
      const pb = pos.get(b)!
      return pa.row - pb.row || pa.left - pb.left
    })
    show(batch)
  }

  const remaining = new Set(all)

  const io = new IntersectionObserver(
    (entries) => {
      const fresh = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
      if (!fresh.length) return
      fresh.forEach((el) => {
        io.unobserve(el)
        remaining.delete(el)
      })
      pending.push(...fresh)
      // merge entries landing within a couple of frames into one cascade
      flushTimer ??= setTimeout(flush, 80)
    },
    // fire slightly before the element fully enters (≈ "top 94%")
    { rootMargin: "0px 0px -6% 0px", threshold: 0 },
  )
  all.forEach((el) => io.observe(el))

  // A fast flick or an anchor jump can carry an element across the WHOLE
  // viewport between IntersectionObserver updates — no transition is ever
  // reported and the element would stay invisible forever. Sweep on scroll:
  // anything already scrolled past gets shown instantly (it is off-screen at
  // that moment, so no animation is missed).
  let sweepRaf = 0
  const sweep = () => {
    sweepRaf = 0
    if (!remaining.size) return
    const skipped: HTMLElement[] = []
    remaining.forEach((el) => {
      if (el.getBoundingClientRect().bottom < 0) skipped.push(el)
    })
    if (!skipped.length) return
    skipped.forEach((el) => {
      remaining.delete(el)
      io.unobserve(el)
    })
    gsap.set(skipped, { autoAlpha: 1, y: 0 })
  }
  const onScroll = () => {
    if (!sweepRaf && remaining.size) sweepRaf = requestAnimationFrame(sweep)
  }
  window.addEventListener("scroll", onScroll, { passive: true })

  return () => {
    window.removeEventListener("scroll", onScroll)
    if (sweepRaf) cancelAnimationFrame(sweepRaf)
    io.disconnect()
    if (flushTimer) clearTimeout(flushTimer)
    // clear ONLY what the reveal set — never React-managed inline styles
    if (all.length) gsap.set(all, { clearProps: "transform,opacity,visibility" })
  }
}
