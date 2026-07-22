import { Img } from "@/components/site/Img"
/**
 * Figma: Group 2085665218 (926:101886) — 1920x867 @ page y=17689.
 * Card row @ y=240: violet gradient card 531x627 @ x=120 (HTML) + the fully
 * vector automation panel 1129x627 @ x=671. The old baked cta-right.png
 * (panel + diagonal light streak) was removed at the user's request — the
 * streak read as a stray PNG edge on the flat section bg.
 */
import { CtaAutomation } from "@/components/site/CtaAutomation"
import { CHROME_STORE_URL } from "@/sections/Navbar"

export function Cta() {
  return (
    <section id="start" className="relative h-[867px] overflow-hidden bg-gray-800 [content-visibility:auto] [contain-intrinsic-size:1920px_867px]">
      {/* fully vector "One click automation" panel with looping beams */}
      <CtaAutomation />

      {/* left — violet gradient card */}
      <div
        className="absolute left-[120px] top-[240px] h-[627px] w-[531px] rounded-lg"
        style={{
          background:
            "linear-gradient(40.26deg, var(--color-violet) 0%, rgba(111, 81, 151, 0) 100%)",
        }}
      >
        {/* logo */}
        <div className="absolute left-[40px] top-[40px] h-[24px] w-[151px]">
          <Img
            src="/figma/tail/logo-icon-white.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-0 size-[24px] max-w-none"
          />
          <Img
            src="/figma/tail/logo-text-white.svg"
            alt="LoadHunter"
            loading="lazy"
            decoding="async"
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
          LoadHunter: AI-powered tool.
        </p>

        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noopener"
          data-lift
          className="absolute left-[40px] top-[545px] inline-flex h-[42px] items-center gap-[8px] rounded-full border border-white bg-white px-[24px] shadow-pill"
        >
          <Img
            src="/figma/tail/cta-chrome.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-[16px] max-w-none"
          />
          <span
            className="bg-clip-text text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(149.61deg, var(--color-violet) 0%, var(--color-violet-cta) 100%)",
            }}
          >
            Add to Chrome
          </span>
        </a>
      </div>
    </section>
  )
}
