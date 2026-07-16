import { useLayoutEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { initReveal } from "@/lib/reveal"
import { initMicro } from "@/lib/micro"
import { initEcosystemPin } from "@/lib/ecosystemPin"
import { DesignFrame } from "@/components/site/DesignFrame"
import { DesktopLanding } from "@/sections/DesktopLanding"
import { isCoarsePointer, prefersReducedMotion } from "@/lib/inview"

/**
 * Smooth scroll + anchor navigation.
 *
 * Lenis is created only for a fine-pointer (mouse) visitor with motion enabled.
 * On touch it fights native momentum and adds a permanent rAF loop for no gain,
 * and under prefers-reduced-motion we want plain native scrolling — in both
 * cases we skip Lenis entirely and route anchor clicks through native
 * scrollIntoView. lagSmoothing is relaxed (was 0) so a single heavy frame is
 * caught up smoothly instead of teleporting (the "freeze-then-jump" symptom).
 */
function useLenis() {
  useLayoutEffect(() => {
    const nativeOnly = isCoarsePointer() || prefersReducedMotion()

    let lenis: Lenis | null = null
    let update: ((time: number) => void) | null = null
    if (!nativeOnly) {
      lenis = new Lenis()
      update = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(500, 33)
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute("href")!
      if (hash.length < 2) return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(el as HTMLElement)
      else (el as HTMLElement).scrollIntoView({ behavior: "smooth" })
    }
    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      if (update) gsap.ticker.remove(update)
      if (lenis) lenis.destroy()
    }
  }, [])
}

/**
 * Runs the scroll-reveal cascade + micro-animation layer + ecosystem pin.
 * Rendered as the last child inside DesignFrame so its layout effect fires
 * after the landing tree has committed to the DOM (React runs sibling layout
 * effects in order) — initReveal must hide elements before first paint, so
 * the DOM must exist first.
 */
function CanvasEffects() {
  useLayoutEffect(() => {
    const teardownReveal = initReveal()
    const teardownMicro = initMicro()
    // pin the ecosystem section and scroll its product list on the way through
    const teardownEcoPin = initEcosystemPin()
    return () => {
      teardownEcoPin()
      teardownMicro()
      teardownReveal()
    }
  }, [])
  return null
}

/**
 * Single 1920 desktop canvas. The old phone/tablet/HD adaptive trees were
 * removed 2026-07-16 — a new adaptive will be built from scratch on top of
 * this desktop version. Until then every viewport gets the desktop canvas:
 * below 1920 it scales down (vw/1920), above 1920 maxScale={1} holds it at
 * pixel size and centers it with side gutters.
 */
function App() {
  useLenis()

  return (
    <DesignFrame width={1920} maxScale={1}>
      <DesktopLanding />
      <CanvasEffects />
    </DesignFrame>
  )
}

export default App
