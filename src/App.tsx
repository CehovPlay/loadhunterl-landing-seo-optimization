import { lazy, Suspense, useLayoutEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { initReveal } from "@/lib/reveal"
import { initMicro } from "@/lib/micro"
import { initEcosystemPin } from "@/lib/ecosystemPin"
import { DesignFrame } from "@/components/site/DesignFrame"
import { useIsMobile } from "@/components/site/useIsMobile"
import { isCoarsePointer, prefersReducedMotion } from "@/lib/inview"

// Code-split the two experiences: a phone visitor never downloads the desktop
// tree (with its WebGPU shader engine), and vice versa.
const DesktopLanding = lazy(() =>
  import("@/sections/DesktopLanding").then((m) => ({ default: m.DesktopLanding })),
)
const MobileLanding = lazy(() =>
  import("@/sections/mobile/MobileLanding").then((m) => ({ default: m.MobileLanding })),
)

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
function useLenis(mobile: boolean) {
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
  }, [mobile])
}

/**
 * Runs the scroll-reveal cascade + micro-animation layer + ecosystem pin.
 * Rendered as the last child INSIDE the Suspense boundary so its layout effect
 * fires only after the lazy landing tree has committed to the DOM (React runs
 * sibling layout effects in order, and the boundary keeps this unmounted until
 * the chunk resolves) — initReveal must hide elements before first paint, so
 * the DOM must exist first. initEcosystemPin no-ops when the desktop ecosystem
 * DOM is absent (mobile).
 */
function CanvasEffects({ mobile }: { mobile: boolean }) {
  useLayoutEffect(() => {
    const teardownReveal = initReveal()
    const teardownMicro = initMicro()
    const teardownEcoPin = initEcosystemPin()
    return () => {
      teardownEcoPin()
      teardownMicro()
      teardownReveal()
    }
  }, [mobile])
  return null
}

/**
 * Two experiences:
 *  - < 768px — MobileLanding: a real flow-responsive layout (fluid widths,
 *    stacked sections, 44px+ touch targets), built from scratch on top of the
 *    desktop content. No DesignFrame, no scaling.
 *  - ≥ 768px — the fixed 1920 desktop canvas: below 1920 it scales down
 *    (vw/1920), above 1920 maxScale={1} holds it at pixel size and centers it.
 */
function App() {
  const mobile = useIsMobile()
  useLenis(mobile)

  if (mobile) {
    return (
      <Suspense fallback={null}>
        <MobileLanding />
        <CanvasEffects mobile={mobile} />
      </Suspense>
    )
  }

  return (
    <DesignFrame width={1920} maxScale={1}>
      <Suspense fallback={null}>
        <DesktopLanding />
        <CanvasEffects mobile={mobile} />
      </Suspense>
    </DesignFrame>
  )
}

export default App
