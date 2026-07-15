import { Img } from "@/components/site/Img"
import { RotatingHeadline } from "@/components/site/RotatingHeadline"
import { ShaderBand } from "@/components/site/ShaderBand"
import diamondIcon from "/figma/icon-diamond.svg"

/**
 * Experiment: mockup removed; the copy block is horizontally centered on the
 * canvas (was the left column of the original Figma hero, x0 y203).
 */
export function Hero() {
  return (
    <section className="relative h-[1080px] w-full">
      {/* animated shader background (experiment) — portalled full-bleed behind
          the page; also paints the hero's #EFEFEF base into the side gutters */}
      <ShaderBand baseColor="#EFEFEF" />

      {/* copy — centered */}
      <div className="absolute inset-x-0 top-[203px] z-20 flex flex-col items-center gap-[70px] px-[120px] text-center">
        {/* eyebrow pill */}
        <span
          className="inline-flex w-fit items-center rounded-[99px] px-[20px] py-[4px] text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-[#454545]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
          }}
        >
          The AI copilot for smarter dispatching.
        </span>

        <div className="flex flex-col items-center gap-[60px]">
          {/* rotating typed H1 + matching sub-headline badge */}
          <RotatingHeadline />

          {/* trust line: 6K+ users + weighted rating across Google (4.6/28) and
              Trustpilot (3.8/9) = 4.4 */}
          <p className="flex items-center gap-[10px] text-[17px] font-medium leading-[24px] tracking-[-0.68px] text-[#454545] opacity-60">
            Trusted by 6K+ users
            <span aria-hidden className="text-[#b8b8b8]">·</span>
            <span
              className="relative inline-flex text-[15px] leading-none tracking-[2px]"
              role="img"
              aria-label="Rated 4.4 out of 5 on Google and Trustpilot"
            >
              <span className="text-[#c9c9c9]">★★★★★</span>
              <span
                className="absolute inset-0 overflow-hidden whitespace-nowrap text-[#6f5197]"
                style={{ width: `${(4.4 / 5) * 100}%` }}
              >
                ★★★★★
              </span>
            </span>
            4.4 on Google &amp; Trustpilot
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-[12px]">
          <button
            data-lift
            className="flex h-[42px] w-[228px] items-center justify-center rounded-[99px] border border-white text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#454545] backdrop-blur-[10px]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5))",
              boxShadow:
                "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
            }}
          >
            Start free trial 14 days
          </button>
          <button
            data-lift
            className="flex h-[42px] w-[228px] items-center justify-center gap-[8px] overflow-hidden rounded-[99px] border border-white py-[4px] pl-[9px] pr-[12px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white"
            style={{
              backgroundImage:
                "radial-gradient(60% 140% at 50% 110%, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)",
              boxShadow: "0px 34px 74px -20px rgba(111,81,151,0.5)",
            }}
          >
            <Img src={diamondIcon} alt="" decoding="async" className="size-[25px]" />
            Start booking in minutes
          </button>
        </div>
      </div>
    </section>
  )
}
