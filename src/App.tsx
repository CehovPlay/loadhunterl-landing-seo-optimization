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

function App() {
  return (
    <DesignFrame width={1920}>
      <div className="relative bg-[#18191f] text-dark-text">
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
