import { MobileNavbar } from "./MobileNavbar"
import { MobileHero } from "./MobileHero"
import { MobileFeatures } from "./MobileFeatures"
import { MobileChaos } from "./MobileChaos"
import { MobileTools } from "./MobileTools"
import { MobileEcosystem } from "./MobileEcosystem"
import { MobileWhy } from "./MobileWhy"
import { MobilePricing } from "./MobilePricing"
import { MobileTestimonials } from "./MobileTestimonials"
import { MobileFaq } from "./MobileFaq"
import { MobileCta } from "./MobileCta"
import { MobileFooter } from "./MobileFooter"

/**
 * Mobile (<768px) flow-responsive landing — a from-scratch adaptive built on
 * the desktop content, mirroring DesktopLanding's section order. No fixed
 * canvas, no transform scaling: fluid widths, stacked sections, snap
 * carousels, 44px+ touch targets.
 */
export function MobileLanding() {
  return (
    <div className="bg-gray-800 text-dark-text">
      <MobileNavbar />
      <main>
        <MobileHero />
        <MobileFeatures />
        <MobileChaos />
        <MobileTools />
        <MobileEcosystem />
        <MobileWhy />
        <MobilePricing />
        <MobileTestimonials />
        <MobileFaq />
        <MobileCta />
      </main>
      <MobileFooter />
    </div>
  )
}
