import { Img } from "@/components/site/Img"
import heroDashboard from "/figma/hero-dashboard.png"
import heroGlow from "/figma/hero-glow.png"
import diamondIcon from "/figma/icon-diamond.svg"

/**
 * Figma: HD (1440) hero, y 0–1024 (frame 916:73794).
 * Horizontal reflow of the 1920 Hero — heights/assets reused; only the copy
 * block width/padding, H1 font size, and the beem/mockup x-offsets change.
 * copy block "left" 916:73845: x0 y161, 797 wide, pl-32 pr-120 (content 645)
 * beem 916:73843: layout x-241 y0 (1095 wide) → render offset -21/-22
 * mockup group: layout x752 y167.75 (Δ-185 vs 1920's x937), asset byte-identical
 */
export function HdHero() {
  return (
    <section className="relative h-[1024px] w-full overflow-hidden bg-gray-800">
      {/* beem glow */}
      <Img
        src={heroGlow}
        alt=""
        aria-hidden
        decoding="async"
        className="pointer-events-none absolute left-[-262px] top-[-22px] w-[1138px] max-w-none"
      />

      {/* Right — product mockup. Parallax + 3D tilt live on the WRAPPER so the
          dashboard and its settings popup move as one composited unit. */}
      <div
        data-tilt="4"
        data-parallax="0.05"
        className="absolute left-[712px] top-[80px] h-[960px] w-[1023px]"
      >
        <Img
          src={heroDashboard}
          alt="LoadHunter dashboard"
          decoding="async"
          fetchPriority="high"
          className="absolute left-0 top-[48px] w-[1023px] max-w-none"
        />

        {/* extension settings popup — 1:1 crop from the Figma render */}
        <Img
          src="/figma/hero-settings-popup.png"
          alt=""
          aria-hidden
          decoding="async"
          className="absolute left-[303px] top-0 w-[720px] max-w-none"
        />
      </div>

      {/* Left — copy (797 wide, pl-32 pr-120) */}
      <div className="absolute left-0 top-[161px] flex w-[797px] flex-col items-start gap-[70px] pl-[32px] pr-[120px]">
        {/* eyebrow pill */}
        <span
          className="inline-flex w-fit items-center rounded-[99px] px-[20px] py-[4px] text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-white"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
          }}
        >
          The AI copilot for smarter dispatching.
        </span>

        <div className="flex flex-col items-start gap-[60px]">
          {/* H1 gradient (1440: 74px / -2.96px) */}
          <h1
            className="-mx-[10px] -my-[12px] whitespace-nowrap bg-clip-text px-[10px] py-[12px] text-[74px] font-medium leading-[80px] tracking-[-2.96px] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgb(255,255,255) 2%, rgb(63,63,63) 100%)",
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
                "linear-gradient(104deg, rgba(73,73,73,0.4) 2%, rgba(43,43,43,0.4) 100%)",
            }}
          >
            <span
              data-countup
              className="whitespace-nowrap bg-clip-text text-[60px] font-medium leading-[105px] tracking-[-2.4px] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(102deg, rgb(255,255,255) 2%, rgb(63,63,63) 100%)",
              }}
            >
              In under 30 seconds
            </span>
          </div>

          {/* paragraph */}
          <p className="w-full text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-white">
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
