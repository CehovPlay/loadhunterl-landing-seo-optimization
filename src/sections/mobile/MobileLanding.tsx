import { useEffect, useState } from "react"
import { MobileNavbar } from "./MobileNavbar"
import { MobileHero } from "./MobileHero"
import { MobileCompatibility } from "./MobileCompatibility"
import { MobileFeatures } from "./MobileFeatures"
import { MobileTools } from "./MobileTools"
import { MobileEcosystem } from "./MobileEcosystem"
import { MobilePricing } from "./MobilePricing"
import { MobileTestimonials } from "./MobileTestimonials"
import { MobileFaq } from "./MobileFaq"
import { MobileCta } from "./MobileCta"
import { MobileFooter } from "./MobileFooter"
import {
  BlogTeaser,
  Differentiation,
  HowItWorks,
  ProductDemo,
  RegionalProof,
  StickyMobileCta,
  UseCases,
} from "@/components/site/sections"

/**
 * Mobile (<1024px) flow-responsive landing — a from-scratch adaptive built on
 * the desktop content, mirroring DesktopLanding's section order. No fixed
 * canvas, no transform scaling: fluid widths, stacked sections, 44px+ touch
 * targets. The sections added by the brief come from the shared
 * components/site/sections.tsx with `flow`, so their copy is identical to
 * desktop (QA-005).
 */

/**
 * LH-067 — show the sticky trial CTA once the hero has scrolled away, and hide
 * it again while the pricing or final CTA blocks are on screen so it never
 * covers the real conversion points.
 */
function useStickyCtaVisible() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const past = window.scrollY > window.innerHeight
      const clash = ["pricing", "start"].some((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight && r.bottom > 0
      })
      setVisible(past && !clash)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return visible
}

export function MobileLanding() {
  const stickyVisible = useStickyCtaVisible()

  return (
    <div className="bg-gray-800 text-dark-text">
      <MobileNavbar />
      <main>
        <MobileHero />
        {/* LH-071 — compatibility right after the hero, then Why LoadHunter */}
        <MobileCompatibility />
        <MobileFeatures />
        <HowItWorks flow />
        <Differentiation flow />
        <UseCases flow />
        <ProductDemo flow />
        <RegionalProof flow />
        <MobileTools />
        <MobileEcosystem />
        <MobilePricing />
        <MobileTestimonials />
        <MobileFaq />
        <BlogTeaser flow />
        <MobileCta />
      </main>
      <MobileFooter />
      <StickyMobileCta visible={stickyVisible} />
    </div>
  )
}
