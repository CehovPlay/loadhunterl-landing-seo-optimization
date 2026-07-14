import { lazy, Suspense, useLayoutEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { initReveal } from "@/lib/reveal"
import { initMicro } from "@/lib/micro"
import { initEcosystemPin } from "@/lib/ecosystemPin"
import { DesignFrame } from "@/components/site/DesignFrame"
import { useBreakpoint } from "@/components/site/useBreakpoint"
import { isCoarsePointer, prefersReducedMotion } from "@/lib/inview"

// Code-split the four device canvases: each visitor downloads/parses only the
// section tree their breakpoint renders (a phone user no longer ships the
// desktop + tablet trees). Named exports wrapped to lazy's default contract.
const DesktopLanding = lazy(() =>
  import("@/sections/DesktopLanding").then((m) => ({ default: m.DesktopLanding })),
)
const HdLanding = lazy(() =>
  import("@/sections/hd/HdLanding").then((m) => ({ default: m.HdLanding })),
)
const TabletLanding = lazy(() =>
  import("@/sections/tablet/TabletLanding").then((m) => ({ default: m.TabletLanding })),
)
const PhoneLanding = lazy(() =>
  import("@/sections/phone/PhoneLanding").then((m) => ({ default: m.PhoneLanding })),
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
function useLenis(breakpoint: string) {
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
  }, [breakpoint])
}

/**
 * Runs the scroll-reveal cascade + micro-animation layer + ecosystem pin.
 * Rendered as the last child INSIDE the Suspense boundary so its layout effect
 * fires only after the lazy landing tree has committed to the DOM (React runs
 * sibling layout effects in order, and the boundary keeps this unmounted until
 * the chunk resolves) — initReveal must hide elements before first paint, so
 * the DOM must exist first.
 */
function CanvasEffects({ breakpoint }: { breakpoint: string }) {
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
  }, [breakpoint])
  return null
}

function App() {
  let bp = useBreakpoint()
  // The HD (1440) canvas is built only through Features so far — until it's
  // complete, the 1024–1919 band falls back to the scaled 1920 desktop canvas.
  // Opt into the HD work-in-progress with ?hd in the URL.
  if (bp === "hd" && !new URLSearchParams(window.location.search).has("hd")) {
    bp = "desktop"
  }
  useLenis(bp)

  const width = bp === "phone" ? 390 : bp === "tablet" ? 768 : bp === "hd" ? 1440 : 1920
  const Landing =
    bp === "phone"
      ? PhoneLanding
      : bp === "tablet"
        ? TabletLanding
        : bp === "hd"
          ? HdLanding
          : DesktopLanding

  // Above the 1920 desktop artboard the Figma adaptive frames center the same
  // pixel-sized content with side gutters rather than scaling up — so cap the
  // desktop canvas at 1× and let DesignFrame center it. Phone/tablet/HD keep
  // their fill-to-viewport scaling (they scale up within their own bands).
  const maxScale = bp === "desktop" ? 1 : undefined

  return (
    <DesignFrame width={width} maxScale={maxScale}>
      <Suspense fallback={null}>
        <Landing />
        <CanvasEffects breakpoint={bp} />
      </Suspense>
    </DesignFrame>
  )
}

export default App
