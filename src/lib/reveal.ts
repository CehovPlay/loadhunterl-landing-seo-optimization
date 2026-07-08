import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Scroll-reveal: text blocks and visual elements fade/rise in a cascade as
 * they enter the viewport. Elements entering in the same frame are staggered
 * (ScrollTrigger.batch), so columns/cards appear one after another.
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
  gsap.registerPlugin(ScrollTrigger)

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
    // position on reload): it will never "enter" — leave it visible
    if (el.getBoundingClientRect().bottom < 0) return
    items.push(el)
  })

  gsap.set(items, { autoAlpha: 0, y: 28 })

  const show = (batch: Element[]) =>
    gsap.to(batch, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: { amount: Math.min(0.6, batch.length * 0.09), from: "start" },
      overwrite: true,
    })

  // fixed cascade window: many elements => tighter steps, so even the
  // densest section (pricing, ~90 nodes) settles in ~1.5s
  ScrollTrigger.batch(items, {
    start: "top 92%",
    once: true,
    onEnter: show,
    onEnterBack: show,
  })

  // safety: reveal anything ScrollTrigger might have missed (e.g. after
  // late layout shifts) when the page fully loads
  const refresh = () => ScrollTrigger.refresh()
  window.addEventListener("load", refresh)
  return () => {
    window.removeEventListener("load", refresh)
    ScrollTrigger.getAll().forEach((t) => t.kill())
    // clear ONLY what the reveal set — never React-managed inline styles
    gsap.set(items, { clearProps: "transform,opacity,visibility" })
  }
}
