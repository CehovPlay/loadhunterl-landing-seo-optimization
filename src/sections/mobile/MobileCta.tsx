import { Img } from "@/components/site/Img"
import { ScaledAutomation } from "./ScaledAutomation"
import { Container } from "./ui"

/**
 * CTA — the Figma tablet structure (916:71405): the violet card full-width
 * with left-aligned content, and the "One click automation" panel stacked
 * BELOW it, cropped tight to its content (the desktop export cta-right.png
 * is mostly empty page background — the bright content lives in the
 * x 17–80% / y 49–78% region, so the wrapper crops to that window).
 */
export function MobileCta() {
  return (
    <section id="start" className="bg-gray-800 pb-10 pt-16">
      <Container>
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
        <div
          data-card
          className="rounded-[12px] p-6 md:p-10 lg:h-full lg:p-12"
          style={{
            background: "linear-gradient(40.26deg, #6f5197 0%, rgba(111, 81, 151, 0) 100%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <Img src="/figma/tail/logo-icon-white.svg" alt="" className="h-6 w-6" />
            <Img src="/figma/tail/logo-text-white.svg" alt="LoadHunter" className="h-[19px] w-[116px]" />
          </div>
          <h2 className="mt-16 text-[clamp(24px,6.6vw,30px)] font-medium leading-[1.2] tracking-[-0.04em] text-white md:mt-12 md:text-[24px] md:leading-[32px] lg:text-[40px] lg:leading-[48px]">
            Start your experience with LoadHunter
          </h2>
          <p className="mt-4 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-white lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
            Search loads with efficiency and speed you never had before. LoadHunter: AI-powered
            tool.
          </p>
          <a
            href="#start"
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white bg-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98] md:w-[220px] lg:mt-10 lg:h-14"
          >
            <img
              src="/figma/tail/cta-chrome.svg"
              alt=""
              loading="lazy"
              decoding="async"
              className="size-4"
            />
            <span
              className="bg-clip-text text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-transparent"
              style={{
                backgroundImage: "linear-gradient(149.61deg, #6f5197 0%, #9779bf 100%)",
              }}
            >
              Add to Chrome
            </span>
          </a>
        </div>

        {/* automation panel — the actual desktop CtaAutomation, scaled to fit */}
        <div className="mt-5 lg:mt-0">
          <ScaledAutomation />
        </div>
        </div>
      </Container>
    </section>
  )
}
