import { useEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { initReveal } from "@/lib/reveal"
import { DesignFrame } from "@/components/site/DesignFrame"
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

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis()

    // drive Lenis from GSAP's ticker so both share one rAF loop
    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // keep ScrollTrigger in sync with Lenis' smoothed scroll
    lenis.on("scroll", ScrollTrigger.update)

    // cascade scroll-reveal for text blocks and visuals
    const teardownReveal = initReveal()

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
      teardownReveal()
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [])
}

function App() {
  useLenis()
  return (
    <DesignFrame width={1920}>
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
    </DesignFrame>
  )
}

export default App
