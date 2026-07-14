import { Img } from "@/components/site/Img"
import { HeroShaderBg } from "@/components/site/HeroShaderBg"
import heroDashboard from "/figma/hero-dashboard.png"
import diamondIcon from "/figma/icon-diamond.svg"

/**
 * Figma: Full HD (1920) hero, y 0–1080.
 * left copy block: x0 y203, 938x671 (px-120)
 * mockup group: layout x937 y167.75 (1301x912), rendered PNG covers
 *   x897–1920 / y128–1120 (render bounds incl. shadows, clipped at right edge)
 * beem glow: layout x-1 y0 (1095x1078), PNG render 1138x1122 → offset -22/-22
 */
export function Hero() {
  return (
    <section className="relative h-[1080px] w-full overflow-hidden bg-[#EFEFEF]">
      {/* animated shader background (experiment) */}
      <HeroShaderBg />

      {/* Right — product mockup. Parallax + 3D tilt live on the WRAPPER so the
          dashboard and its settings popup move as one composited unit (giving
          them independent parallax drifts them apart — the popup detaches). */}
      <div
        data-tilt="4"
        data-parallax="0.05"
        className="absolute left-[897px] top-[80px] z-20 h-[960px] w-[1023px]"
      >
        <Img
          src={heroDashboard}
          alt="LoadHunter dashboard"
          decoding="async"
          fetchPriority="high"
          className="absolute left-0 top-[48px] w-[1023px] max-w-none"
        />

        {/* extension settings popup — 1:1 crop from the Figma render (region 1200,80–1920,760) */}
        <Img
          src="/figma/hero-settings-popup.png"
          alt=""
          aria-hidden
          decoding="async"
          className="absolute left-[303px] top-0 w-[720px] max-w-none"
        />
      </div>

      {/* Left — copy */}
      <div className="absolute left-0 top-[203px] z-20 flex w-[938px] flex-col items-start gap-[70px] px-[120px]">
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

        <div className="flex flex-col items-start gap-[60px]">
          {/* H1 gradient */}
          {/* px/py + negative margins widen the paint box so bg-clip-text doesn't crop glyph edges */}
          <h1
            className="-mx-[10px] -my-[12px] whitespace-nowrap bg-clip-text px-[10px] py-[12px] text-[83px] font-medium leading-[80px] tracking-[-3.32px] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgb(26,26,26) 2%, rgb(120,120,120) 100%)",
            }}
          >
            Book better loads
            <br />
            before anyone else
          </h1>

          {/* badge pill */}
          <div
            className="flex w-fit items-center justify-center rounded-[200px] px-[50px]"
            style={{
              backgroundImage:
                "linear-gradient(104deg, rgba(255,255,255,0.7) 2%, rgba(255,255,255,0.45) 100%)",
            }}
          >
            <span
              data-countup
              className="whitespace-nowrap bg-clip-text text-[60px] font-medium leading-[105px] tracking-[-2.4px] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(102deg, rgb(26,26,26) 2%, rgb(120,120,120) 100%)",
              }}
            >
              In under 30 seconds
            </span>
          </div>

          {/* paragraph */}
          <p className="w-full text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-[#454545]">
            LoadHunter scans loadboard in real-time, filters high-RPM loads,
            and lets you contact brokers instantly — email, SMS, or call.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-[12px]">
          <button
            data-lift
            data-magnetic
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
            data-magnetic
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
