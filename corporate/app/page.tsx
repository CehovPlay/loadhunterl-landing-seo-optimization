import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { Cycle } from "@/components/Cycle"
import { StopOne } from "@/components/StopOne"
import { Footer } from "@/components/Footer"
import { Rail } from "@/components/Rail"

/**
 * Homepage.
 *
 * Everything sits inside one padded container so the rail, the nodes and every
 * section share a single left edge. That shared edge is the page: TZ §25.1 asks
 * for one road the load travels rather than a stack of unrelated blocks, and
 * the only way that reads is if the geometry is literally continuous.
 *
 * The header floats over the page rather than sitting in the flow, and the
 * footer is a full-bleed dark band, so both live outside the padded container:
 * the rail is the paper's spine and it ends where the paper does.
 *
 * Scope of this pass: first screen, the operating cycle and stop 01. Stops 02
 * to 05, the assembled-ecosystem block, role selection, proof and the final
 * conversion block (§27.8 to §27.16) are not built yet.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[1400px] px-5 md:px-10">
        <Rail />
        <main id="main">
          <Hero />
          <Cycle />
          <StopOne />
        </main>
      </div>
      <Footer />
    </>
  )
}
