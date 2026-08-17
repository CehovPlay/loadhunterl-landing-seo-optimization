import { BleedBg } from "@/components/site/BleedBg"
import { Navbar } from "@/sections/Navbar"
import { Hero } from "@/sections/Hero"
import { Compatibility } from "@/sections/Compatibility"
import { Features } from "@/sections/Features"
import { Tools } from "@/sections/Tools"
import { Orbit } from "@/sections/Orbit"
import { Ecosystem } from "@/sections/Ecosystem"
import { ChaosZoom } from "@/sections/ChaosZoom"
import { Pricing } from "@/sections/Pricing"
import { Testimonials } from "@/sections/Testimonials"
import { Faq } from "@/sections/Faq"
import { Cta } from "@/sections/Cta"
import { Footer } from "@/sections/Footer"
import {
  BlogTeaser,
  Differentiation,
  HowItWorks,
  ProductDemo,
  RegionalProof,
  UseCases,
} from "@/components/site/sections"

/** Desktop 1920 canvas. Extracted into its own module so App can code-split it
 *  (React.lazy) — a phone/tablet visitor never downloads this tree. */
export function DesktopLanding() {
  return (
    // no root bg: the hero band must stay transparent so the full-bleed
    // shader portal (z -1) shows through; body is gray-800 for the rest
    <div className="relative text-dark-text">
      <Navbar />
      <main>
        {/* hero's full-bleed light bg + shader come from HeroShaderBg's portal */}
        <Hero />
        {/* Light sections: bleed their bg into the >1920 side gutters */}
        <BleedBg color="var(--color-bg-light)">
          {/* Approved information architecture (LH-057 heading map):
              Compatibility → Why → How It Works → Differentiation → Use cases
              → Demo → Regional, all inside the light zone that ends at the
              ChaosZoom transition. */}
          <Compatibility />
          <Features />
          <HowItWorks />
          <Differentiation />
          <UseCases />
          <ProductDemo />
          <RegionalProof />
        </BleedBg>
        {/* zoom-through transition: dive into the hyphen, land in dark Tools */}
        <ChaosZoom />
        <Tools />
        {/* Orbit's full-bleed white bg + shader come from its own ShaderBand */}
        <Orbit />
        <Ecosystem />
        <Pricing />
        <Testimonials />
        <Faq />
        <BlogTeaser />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
