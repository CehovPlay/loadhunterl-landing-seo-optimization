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
 */
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
      "footer p",
      "footer button",
      "footer img",
      "footer a",
    ].join(", "),
  )

  const items: HTMLElement[] = []
  candidates.forEach((el) => {
    if (el.closest("[data-no-reveal]")) return
    // inside a testimonial card: reveal the card as one block
    const card = el.closest<HTMLElement>("[data-card]")
    if (card && card !== el) return
    // inside the marquee track but not a card (spacers)
    if (!card && el.closest("[data-marquee-track]")) return
    // already ABOVE the viewport (e.g. browser restored a mid-page scroll
    // position on reload): it will never intersect — leave it visible
    if (el.getBoundingClientRect().bottom < 0) return
    items.push(el)
  })

  gsap.set(items, { autoAlpha: 0, y: 28 })

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
  items.forEach((el) => io.observe(el))

  return () => {
    io.disconnect()
    // clear ONLY what the reveal set — never React-managed inline styles
    gsap.set(items, { clearProps: "transform,opacity,visibility" })
  }
}
