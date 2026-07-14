import { BleedBg } from "@/components/site/BleedBg"
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

export function DesktopLanding() {
  return (
    <div className="relative bg-gray-800 text-dark-text">
      <Navbar />
      <main>
        <Hero />
        {/* Light sections: bleed their bg into the >1920 side gutters */}
        <BleedBg color="#fafafa">
          <Features />
        </BleedBg>
        <DispatchIntro />
        <Tools />
        <BleedBg color="#ffffff">
          <Orbit />
        </BleedBg>
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
