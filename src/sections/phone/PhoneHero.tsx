/**
 * Figma: Phone (390) hero — y 0..1061.
 * Copy block (Frame 2147238673 / "left"): eyebrow @118, H1 @180, badge @280,
 * paragraph @360, buttons @416/@480 (362x52 @ x14).
 * Mockup group 924:96902: 390x502 @ y572 (export 780x1004 @2x, exact box).
 * Top glow Group 2085665144: export 780x1232 @2x — 390 wide (frame-clipped),
 * 616 tall with blur margins → placed at top −22.
 */
export function PhoneHero() {
  return (
    <section
      className="relative overflow-hidden bg-gray-800"
      style={{ height: 1061 }}
    >
      {/* top glow */}
      <img
        src="/figma/phone/hero-glow.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-0 top-[-22px] w-[390px] max-w-none"
      />

      {/* eyebrow pill */}
      <div
        className="absolute left-1/2 top-[118px] flex h-[22px] -translate-x-1/2 items-center justify-center whitespace-nowrap rounded-[99px] px-[14px] py-[4px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-white"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
        }}
      >
        The AI-powered browser extension for smarter dispatching
      </div>

      {/* H1 gradient */}
      <h1
        className="absolute left-0 top-[180px] w-full bg-clip-text text-center text-[40px] font-medium leading-[40px] tracking-[-1.6px] text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(98.63deg, rgb(255,255,255) 1.96%, rgb(63,63,63) 100%)",
        }}
      >
        See loads before
        <br />
        competitors
      </h1>

      {/* badge pill */}
      <div
        className="absolute left-1/2 top-[280px] flex h-[40px] -translate-x-1/2 items-center justify-center rounded-[200px] border border-[rgba(255,255,255,0.18)] px-[20px]"
        style={{
          backgroundImage:
            "linear-gradient(105.1deg, rgba(73,73,73,0.4) 1.96%, rgba(43,43,43,0.4) 100%)",
        }}
      >
        <span
          className="whitespace-nowrap bg-clip-text text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(105.98deg, rgb(255,255,255) 1.96%, rgb(63,63,63) 100%)",
          }}
        >
          do 47 seconds faster
        </span>
      </div>

      {/* paragraph */}
      <p className="absolute left-[14px] top-[360px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
        One dashboard. All boards. One click. Done
      </p>

      {/* CTAs */}
      <button
        className="absolute left-[14px] top-[416px] flex h-[52px] w-[362px] items-center justify-center rounded-[99px] border border-transparent text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink backdrop-blur-[10px]"
        style={{
          // gradient spans the border-box: white top edge, faded bottom edge
          backgroundImage:
            "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5))",
          backgroundOrigin: "border-box",
          backgroundClip: "border-box",
          boxShadow:
            "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        Start free trial 14 days
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-1px] rounded-[99px] p-px"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.1))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </button>
      <button
        className="absolute left-[14px] top-[480px] flex h-[52px] w-[362px] items-center justify-center gap-[8px] rounded-[99px] border border-transparent bg-violet bg-origin-border py-[4px] pl-[9px] pr-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white backdrop-blur-[10px]"
        style={{
          backgroundClip: "border-box",
          boxShadow:
            "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-1px] rounded-[99px] p-px"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.08))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <img
          src="/figma/phone/hero-btn-icon.svg"
          alt=""
          className="size-[23px]"
        />
        Add to Chrome
      </button>

      {/* product mockup (browser + settings popup) */}
      <img
        src="/figma/phone/hero-mockup.png"
        alt="LoadHunter dashboard"
        className="absolute left-0 top-[572px] w-[390px] max-w-none"
      />
    </section>
  )
}
