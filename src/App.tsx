import { useLayoutEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { initReveal } from "@/lib/reveal"
import { initMicro } from "@/lib/micro"
import { DesignFrame } from "@/components/site/DesignFrame"
import { useBreakpoint } from "@/components/site/useBreakpoint"
import { Navbar } from "@/sections/Navbar"
import { Hero } from "@/sections/Hero"
import { Features } from "@/sections/Features"
import { DispatchIntro } from "@/sections/DispatchIntro"
import { Tools } from "@/sections/Tools"
import { Orbit } from "@/sections/Orbit"
import { Ecosystem } from "@/sections/Ecosystem"
import { WhyLoadHunter } from "@/sections/WhyLoadHunter"
import { ChaosDiagram } from "@/sections/ChaosDiagram"
import { Pricing } from "@/sections/Pricing"
import { Testimonials } from "@/sections/Testimonials"
import { Faq } from "@/sections/Faq"
import { Cta } from "@/sections/Cta"
import { Footer } from "@/sections/Footer"
import { PhoneLanding } from "@/sections/phone/PhoneLanding"
import { TabletLanding } from "@/sections/tablet/TabletLanding"

function useLenis(breakpoint: string) {
  // layout effect: reveal must hide elements BEFORE the first paint,
  // otherwise in-view text flashes and then disappears into the cascade
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
      teardownMicro()
      teardownReveal()
      gsap.ticker.remove(update)
      lenis.destroy()
    }
    // re-init on canvas switch: the whole section tree is remounted
  }, [breakpoint])
}

function DesktopLanding() {
  return (
    <div className="relative bg-gray-800 text-dark-text">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <DispatchIntro />
        <Tools />
        <Orbit />
        <Ecosystem />
        <WhyLoadHunter />
        <ChaosDiagram />
        <Pricing />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  const bp = useBreakpoint()
  useLenis(bp)
  if (bp === "phone") {
    return (
      <DesignFrame width={390}>
        <PhoneLanding />
      </DesignFrame>
    )
  }
  if (bp === "tablet") {
    return (
      <DesignFrame width={768}>
        <TabletLanding />
      </DesignFrame>
    )
  }
  return (
    <DesignFrame width={1920}>
      <DesktopLanding />
    </DesignFrame>
  )
}

export default App
