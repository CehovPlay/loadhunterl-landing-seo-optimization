import { lazy, Suspense, useLayoutEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { initReveal } from "@/lib/reveal"
import { initMicro } from "@/lib/micro"
import { initEcosystemPin } from "@/lib/ecosystemPin"
import { DesignFrame } from "@/components/site/DesignFrame"
import { useBreakpoint } from "@/components/site/useBreakpoint"

// Each breakpoint renders exactly one of these trees, so they load as separate
// chunks — a phone visitor never downloads the desktop sections and vice versa.
const DesktopLanding = lazy(() =>
  import("@/sections/DesktopLanding").then((m) => ({ default: m.DesktopLanding })),
)
const TabletLanding = lazy(() =>
  import("@/sections/tablet/TabletLanding").then((m) => ({ default: m.TabletLanding })),
)
const PhoneLanding = lazy(() =>
  import("@/sections/phone/PhoneLanding").then((m) => ({ default: m.PhoneLanding })),
)

/**
 * Scroll/animation bootstrap. Rendered as the landing's next sibling inside the
 * same Suspense boundary: layout effects run bottom-up in tree order, so this
 * initialises only after the (lazily loaded) section DOM is mounted — and still
 * before first paint, which reveal needs to hide in-view elements flash-free.
 */
function Fx({ breakpoint }: { breakpoint: string }) {
  useLayoutEffect(() => {
    const lenis = new Lenis()

    // drive Lenis from GSAP's ticker so both share one rAF loop
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // cascade scroll-reveal for text blocks and visuals
    const teardownReveal = initReveal()
    // micro-animations: float/pulse/parallax/lift/press/countup
    const teardownMicro = initMicro()
    // pin the ecosystem section and scroll its product list on the way through
    const teardownEcoPin = initEcosystemPin()

    // smooth-scroll anchor navigation through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute("href")!
      if (hash.length < 2) return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el as HTMLElement)
    }
    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      teardownEcoPin()
      teardownMicro()
      teardownReveal()
      gsap.ticker.remove(update)
      lenis.destroy()
    }
    // re-init on canvas switch: the whole section tree is remounted
  }, [breakpoint])
  return null
}

function App() {
  const bp = useBreakpoint()
  if (bp === "phone") {
    return (
      <DesignFrame width={390}>
        <Suspense>
          <PhoneLanding />
          <Fx breakpoint={bp} />
        </Suspense>
      </DesignFrame>
    )
  }
  if (bp === "tablet") {
    return (
      <DesignFrame width={768}>
        <Suspense>
          <TabletLanding />
          <Fx breakpoint={bp} />
        </Suspense>
      </DesignFrame>
    )
  }
  // Above the 1920 desktop artboard the Figma adaptive frames center the same
  // pixel-sized content with side gutters rather than scaling up — so cap the
  // desktop canvas at 1× and let DesignFrame center it. Phone/tablet keep their
  // fill-to-viewport scaling (they scale up within their own breakpoint bands).
  return (
    <DesignFrame width={1920} maxScale={1}>
      <Suspense>
        <DesktopLanding />
        <Fx breakpoint={bp} />
      </Suspense>
    </DesignFrame>
  )
}

export default App
