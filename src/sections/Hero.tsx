import heroDashboard from "/figma/hero-dashboard.png"
import heroGlow from "/figma/hero-glow.png"
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
    <section className="relative h-[1080px] w-full overflow-hidden bg-gray-800">
      {/* beem glow */}
      <img
        src={heroGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-22px] top-[-22px] w-[1138px] max-w-none"
      />

      {/* Right — product mockup; the wrapper 3D-tilts after the mouse while
          the images keep their own parallax channel (yPercent) */}
      <div
        data-tilt="4"
        className="absolute left-[897px] top-[80px] h-[960px] w-[1023px]"
      >
        <img
          src={heroDashboard}
          alt="LoadHunter dashboard"
          data-parallax="0.05"
          className="absolute left-0 top-[48px] w-[1023px] max-w-none"
        />

        {/* extension settings popup — 1:1 crop from the Figma render (region 1200,80–1920,760) */}
        <img
          src="/figma/hero-settings-popup.png"
          alt=""
          aria-hidden
          data-parallax="0.05"
          className="absolute left-[303px] top-0 w-[720px] max-w-none"
        />
      </div>

      {/* Left — copy */}
      <div className="absolute left-0 top-[203px] flex w-[938px] flex-col items-start gap-[70px] px-[120px]">
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
          {/* H1 gradient */}
          {/* px/py + negative margins widen the paint box so bg-clip-text doesn't crop glyph edges */}
          <h1
            className="-mx-[10px] -my-[12px] whitespace-nowrap bg-clip-text px-[10px] py-[12px] text-[83px] font-medium leading-[80px] tracking-[-3.32px] text-transparent"
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
            <img src={diamondIcon} alt="" className="size-[25px]" />
            Start booking in minutes
          </button>
        </div>
      </div>
    </section>
  )
}
