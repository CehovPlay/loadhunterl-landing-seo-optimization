"use client"

import { useEffect } from "react"
import { isCoarsePointer, prefersReducedMotion } from "@/lib/motion"

/**
 * Smooth scrolling, loaded after the page is readable rather than before it.
 *
 * Lenis and GSAP together are 111 KB of the shared bundle, and this component
 * sits in the root layout, so every page - /privacy included - used to pay for
 * scroll smoothing it does not use. TZ §14.1 asks for heavy interactive work to
 * be isolated and fetched only when it is actually needed, and §17.1 makes the
 * JavaScript budget a build-time gate. Importing both inside the effect moves
 * them out of the first load and into a chunk fetched after hydration.
 *
 * Nothing here changes what the visitor gets. §10.4 and §14.1 already require
 * the page to read without any of this running, and the two visitors who never
 * load it at all - reduced motion, coarse pointer - now also never download it.
 *
 * Lenis is driven from GSAP's ticker rather than its own rAF loop, so smoothing
 * and every ScrollTrigger on the page advance on the same frame. Two loops means
 * the pinned rail lags the content by a frame and the seam is visible.
 *
 * §11.3 forbids blocking the scroll or adding artificial inertia, so lerp stays
 * high enough that the page still tracks the wheel closely.
 */
export function SmoothScroll() {
  useEffect(() => {
    /* Touch devices keep native momentum, which beats anything we emulate, and
       reduced-motion visitors keep the plain scrollbar. Neither needs the
       libraries, so the import never happens for them. */
    if (prefersReducedMotion() || isCoarsePointer()) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      })

      lenis.on("scroll", ScrollTrigger.update)

      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      /* The triggers other components registered were measured against a page
         that was not yet smooth-scrolling; refresh once the driver exists. */
      ScrollTrigger.refresh()

      cleanup = () => {
        gsap.ticker.remove(tick)
        gsap.ticker.lagSmoothing(500, 33)
        lenis.destroy()
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return null
}
