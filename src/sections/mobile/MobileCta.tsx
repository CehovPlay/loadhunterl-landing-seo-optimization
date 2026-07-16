import { Img } from "@/components/site/Img"
import { Container } from "./ui"

/**
 * Mobile CTA: the desktop violet card (same 40° gradient, radius, white
 * button with gradient-clipped label) with the automation-panel export
 * underneath, full-width — its glow blends into the gray-800 section.
 */
export function MobileCta() {
  return (
    <section id="start" className="bg-gray-800 pb-6 pt-16">
      <Container>
        <div
          data-card
          className="rounded-[12px] p-6"
          style={{
            background: "linear-gradient(40.26deg, #6f5197 0%, rgba(111, 81, 151, 0) 100%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <Img src="/figma/tail/logo-icon-white.svg" alt="" className="h-6 w-6" />
            <Img src="/figma/tail/logo-text-white.svg" alt="loadhunter" className="h-[19px] w-[116px]" />
          </div>
          <h2 className="mt-24 text-[clamp(24px,6.6vw,30px)] font-medium leading-[1.2] tracking-[-0.03em] text-white">
            Start your experience with LoadHunter
          </h2>
          <p className="mt-4 text-[14px] font-medium leading-[19px] tracking-[-0.02em] text-white">
            Search loads with efficiency and speed you never had before. LoadHunter: Ai-powered
            tool.
          </p>
          <a
            href="#start"
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white bg-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98]"
          >
            <img
              src="/figma/tail/cta-chrome.svg"
              alt=""
              loading="lazy"
              decoding="async"
              className="size-4"
            />
            <span
              className="bg-clip-text text-[15px] font-medium tracking-[-0.01em] text-transparent"
              style={{
                backgroundImage: "linear-gradient(149.61deg, #6f5197 0%, #9779bf 100%)",
              }}
            >
              Add to Chrome
            </span>
          </a>
        </div>
      </Container>

      {/* the desktop automation panel export — glow blends into gray-800 */}
      <Img
        src="/figma/tail/cta-right.png"
        alt="One click automation"
        loading="lazy"
        decoding="async"
        className="mx-auto mt-4 block w-full max-w-[560px]"
      />
    </section>
  )
}
