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
import { FINAL_CTA } from "@/content/copy"
import { track } from "@/lib/analytics"

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

        {/* LH-046 / SEO-022 */}
        <h2 className="absolute left-[40px] top-[352px] w-[451px] text-[28px] font-medium leading-[34px] tracking-[-0.03em] text-white">
          {FINAL_CTA.h2}
        </h2>

        <p className="absolute left-[40px] top-[470px] w-[451px] text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-white/90">
          {FINAL_CTA.body}
        </p>

        {/* LH-046 — the hero's CTA hierarchy repeated: one dominant primary
            plus the same secondary */}
        <div className="absolute left-[40px] top-[540px] flex flex-wrap items-center gap-[12px]">
          <a
            href={FINAL_CTA.primaryHref}
            target="_blank"
            rel="noopener"
            data-lift
            onClick={() => track("final_trial_click")}
            className="inline-flex h-[48px] items-center rounded-full bg-white px-[24px] shadow-pill"
          >
            <span
              className="bg-clip-text text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(149.61deg, var(--color-violet) 0%, var(--color-violet-cta) 100%)",
              }}
            >
              {FINAL_CTA.primary}
            </span>
          </a>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            data-lift
            onClick={() => track("final_chrome_click")}
            className="inline-flex h-[48px] items-center gap-[8px] rounded-full border border-white/70 px-[20px] text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-white"
          >
            <Img
              src="/figma/tail/cta-chrome.svg"
              alt=""
              loading="lazy"
              decoding="async"
              className="size-[16px] max-w-none"
            />
            Add to Chrome
          </a>
        </div>
      </div>
    </section>
  )
}
