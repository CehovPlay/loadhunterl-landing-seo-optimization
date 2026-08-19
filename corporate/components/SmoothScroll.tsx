"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { isCoarsePointer, prefersReducedMotion } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis is driven from GSAP's ticker rather than its own rAF loop, so smoothing
 * and every ScrollTrigger on the page advance on the same frame. Two loops means
 * the pinned rail lags the content by a frame and the seam is visible.
 *
 * It is created only for fine-pointer visitors with motion enabled. Touch
 * devices keep native momentum, which is better than anything we can emulate,
 * and reduced-motion visitors keep the plain scrollbar. TZ §11.3 forbids
 * blocking the scroll or adding artificial inertia, so lerp stays high enough
 * that the page still tracks the wheel closely.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion() || isCoarsePointer()) {
      ScrollTrigger.refresh()
      return
    }

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

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
    }
  }, [])

  return null
}
