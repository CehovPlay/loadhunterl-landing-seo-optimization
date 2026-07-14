/**
 * Figma: Group 2085665218 (926:101886) — 1920x867 @ page y=17689.
 * Card row @ y=240: violet gradient card 531x627 @ x=120 (HTML) + decorative
 * automation panel 1129x627 @ x=671 (exported cta-right.png @2x, which also
 * carries the "image 61" blurred glow spanning the full 867px height).
 */
import { CtaAutomation } from "@/components/site/CtaAutomation"

export function Cta() {
  return (
    <section id="start" className="relative h-[867px] overflow-hidden bg-gray-800">
      {/* right panel + glow — exported as one bitmap, full section height */}
      <img loading="lazy" decoding="async"
        src="/figma/tail/cta-right.png"
        alt=""
        aria-hidden
        className="absolute left-[671px] top-0 h-[867px] w-[1129px] max-w-none"
      />

      {/* fully vector "One click automation" panel with looping beams —
          covers the baked panel region of the bitmap above */}
      <CtaAutomation />

      {/* left — violet gradient card */}
      <div
        className="absolute left-[120px] top-[240px] h-[627px] w-[531px] rounded-[12px]"
        style={{
          background:
            "linear-gradient(40.26deg, #6f5197 0%, rgba(111, 81, 151, 0) 100%)",
        }}
      >
        {/* logo */}
        <div className="absolute left-[40px] top-[40px] h-[24px] w-[151px]">
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-icon-white.svg"
            alt=""
            className="absolute left-0 top-0 size-[24px] max-w-none"
          />
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-text-white.svg"
            alt="loadhunter"
            className="absolute left-[34px] top-[2.56px] h-[18.88px] w-[116.44px] max-w-none"
          />
        </div>

        <h2 className="absolute left-[41px] top-[401px] w-[451px] text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-white">
          Start your experience
          <br />
          with LoadHunter
        </h2>

        <p className="absolute left-[40px] top-[473px] w-[451px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
          Search loads with efficiency and speed you never had before.
          LoadHunter: Ai-powered tool.
        </p>

        <button
          data-lift
          data-magnetic
          className="absolute left-[40px] top-[545px] inline-flex h-[42px] items-center gap-[8px] rounded-full border border-white bg-white px-[24px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
        >
          <img loading="lazy" decoding="async"
            src="/figma/tail/cta-chrome.svg"
            alt=""
            className="size-[16px] max-w-none"
          />
          <span
            className="bg-clip-text text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(149.61deg, #6f5197 0%, #9779bf 100%)",
            }}
          >
            Add to Chrome
          </span>
        </button>
      </div>
    </section>
  )
}
