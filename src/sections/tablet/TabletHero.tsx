/**
 * Figma: Tablet (768) hero — section y 0..1324.
 * Frame 2147238673 (916:70029, 768x1166 @ y=118):
 *   copy block 768x376 @ y118 (flex col, gap 40, centered, px 40)
 *   dashboard render "dsrgheh 1" 768x750 @ y534 (exported 2x)
 * Glow Group 2085665144 896x882 @ y=-205 — reuse of desktop hero-glow.png
 * (desktop layout 1095x1078 → render 1138 wide @ -21/-22): scale 896/1095.
 */
export function TabletHero() {
  return (
    <section className="relative overflow-hidden bg-gray-800" style={{ height: 1324 }}>
      {/* beem glow (clipped at section top) */}
      <img
        src="/figma/hero-glow.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-111px] top-[-238px] w-[1112px] max-w-none"
      />

      {/* copy */}
      <div className="absolute left-0 top-[118px] flex w-full flex-col items-center gap-[40px] px-[40px]">
        {/* eyebrow pill */}
        <span
          className="inline-flex w-fit items-center rounded-[99px] px-[20px] py-[4px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white"
          style={{
            transform: "translateX(-1px)",
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
          }}
        >
          The AI-powered browser extension for smarter dispatching
        </span>

        <div
          className="flex flex-col items-center gap-[20px]"
          style={{ transform: "translateX(-1px)" }}
        >
          {/* H1 gradient — padding trick widens the paint box for bg-clip-text */}
          <h1
            className="-mx-[10px] -my-[8px] whitespace-nowrap bg-clip-text px-[10px] py-[8px] text-center text-[48px] font-medium leading-[47px] tracking-[-1.92px] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(98.816deg, rgb(255,255,255) 1.9565%, rgb(63,63,63) 100%)",
            }}
          >
            See loads before
            <br />
            competitors
          </h1>

          {/* badge pill */}
          <div
            className="flex w-fit items-center justify-center rounded-[200px] px-[20px] py-[10px]"
            style={{
              backgroundImage:
                "linear-gradient(102.291deg, rgba(73,73,73,0.4) 1.9565%, rgba(43,43,43,0.4) 100%)",
            }}
          >
            <span
              data-countup
              className="whitespace-nowrap bg-clip-text text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(105.965deg, rgb(255,255,255) 1.9565%, rgb(63,63,63) 100%)",
              }}
            >
              do 47 seconds faster
            </span>
          </div>
        </div>

        {/* paragraph */}
        <p className="text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
          One dashboard. All boards. One click. Done
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-[12px]">
          <button
            className="flex h-[42px] w-[160px] items-center justify-center rounded-[99px] border border-white text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#454545] backdrop-blur-[10px]"
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
            className="relative flex h-[42px] items-center justify-center gap-[8px] rounded-[99px] bg-[#6f5197] py-[4px] pl-[9px] pr-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white backdrop-blur-[10px]"
            style={{
              boxShadow:
                "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src="/figma/tablet/chrome-icon.svg"
              alt=""
              className="size-[24.811px]"
            />
            Add to Chrome
            {/* base rim */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[99px] border border-white/10"
            />
            {/* gradient overlay rim */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[99px] mix-blend-overlay"
              style={{
                padding: 1,
                background:
                  "linear-gradient(to top, rgba(255,255,255,0), #ffffff)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
          </button>
        </div>
      </div>

      {/* dashboard render (browser mockup + settings popup, blur baked in) */}
      <img
        src="/figma/tablet/hero-dashboard.png"
        alt="LoadHunter dashboard"
        className="absolute left-0 top-[534px] w-[768px] max-w-none"
      />
    </section>
  )
}
