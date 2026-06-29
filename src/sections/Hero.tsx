import heroDashboard from "/figma/hero-dashboard.png"
import heroGlow from "/figma/hero-glow.png"
import diamondIcon from "/figma/icon-diamond.svg"

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0e0f13]">
      {/* beem glow */}
      <img
        src={heroGlow}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 w-[1100px] max-w-none opacity-90"
      />

      <div className="relative mx-auto grid max-w-[1920px] grid-cols-1 items-center gap-12 py-[150px] lg:grid-cols-[minmax(0,820px)_minmax(0,1fr)]">
        {/* Left — copy */}
        <div className="flex flex-col gap-[60px] pl-6 lg:pl-[120px]">
          {/* eyebrow pill */}
          <span
            className="inline-flex w-fit items-center rounded-[99px] px-5 py-1 text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-white"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
            }}
          >
            The AI copilot for smarter dispatching.
          </span>

          <div className="flex flex-col gap-[44px]">
            {/* H1 gradient */}
            <h1
              className="bg-clip-text text-[64px] font-medium leading-[0.96] tracking-[-2.56px] text-transparent xl:text-[83px] xl:leading-[80px] xl:tracking-[-3.32px]"
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
                className="bg-clip-text py-1 text-[44px] font-medium leading-[85px] tracking-[-1.76px] text-transparent xl:text-[60px] xl:leading-[105px] xl:tracking-[-2.4px]"
                style={{
                  backgroundImage:
                    "linear-gradient(102deg, rgb(255,255,255) 2%, rgb(63,63,63) 100%)",
                }}
              >
                In under 30 seconds
              </span>
            </div>

            {/* paragraph */}
            <p className="max-w-[640px] text-[20px] font-medium leading-[28px] tracking-[-0.8px] text-white xl:text-[24px] xl:leading-[32px] xl:tracking-[-0.96px]">
              LoadHunter scans loadboard in real-time, filters high-RPM loads,
              and lets you contact brokers instantly — email, SMS, or call.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex h-[42px] w-[228px] items-center justify-center rounded-[99px] border border-white text-[16px] font-medium tracking-[-0.64px] text-[#454545] backdrop-blur-[10px]"
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
              className="flex h-[42px] w-[228px] items-center justify-center gap-2 overflow-hidden rounded-[99px] border border-white pl-[9px] pr-3 text-[16px] font-medium tracking-[-0.64px] text-white"
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

        {/* Right — real product mockup */}
        <div className="relative lg:-mr-10">
          <img
            src={heroDashboard}
            alt="LoadHunter dashboard"
            className="w-full max-w-none drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
