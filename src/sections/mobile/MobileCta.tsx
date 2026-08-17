import { Img } from "@/components/site/Img"
import { CHROME_STORE_URL } from "@/sections/Navbar"
import { FINAL_CTA } from "@/content/copy"
import { track } from "@/lib/analytics"
import { Container } from "./ui"

/**
 * CTA — the violet card with the Add-to-Chrome action. The "One click
 * automation" panel was removed on mobile (user, 2026-07-21).
 */
export function MobileCta() {
  return (
    <section id="start" className="bg-gray-800 pb-10 pt-16">
      <Container>
        <div
          data-card
          className="rounded-lg p-6 md:p-10"
          style={{
            background: "linear-gradient(40.26deg, var(--color-violet) 0%, rgba(111, 81, 151, 0) 100%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <Img src="/figma/tail/logo-icon-white.svg" alt="" className="h-6 w-6" />
            <Img src="/figma/tail/logo-text-white.svg" alt="LoadHunter" className="h-[19px] w-[116px]" />
          </div>
          {/* LH-046 / SEO-022 */}
          <h2 className="mt-16 text-[clamp(24px,6.6vw,30px)] font-medium leading-[1.2] tracking-[-0.03em] text-white md:mt-12 md:text-[28px] md:leading-[36px]">
            {FINAL_CTA.h2}
          </h2>
          <p className="mt-4 text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-white/90">
            {FINAL_CTA.body}
          </p>
          {/* the hero's CTA hierarchy repeated */}
          <a
            href={FINAL_CTA.primaryHref}
            target="_blank"
            rel="noopener"
            onClick={() => track("final_trial_click")}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-full border border-white bg-white shadow-pill transition-transform active:scale-[0.98]"
          >
            <span
              className="bg-clip-text text-[16px] font-medium leading-[20px] tracking-[-0.02em] text-transparent"
              style={{
                backgroundImage: "linear-gradient(149.61deg, var(--color-violet) 0%, var(--color-violet-cta) 100%)",
              }}
            >
              {FINAL_CTA.primary}
            </span>
          </a>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            onClick={() => track("final_chrome_click")}
            className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/70 text-[16px] font-medium leading-[20px] tracking-[-0.02em] text-white transition-transform active:scale-[0.98]"
          >
            <img
              src="/figma/tail/cta-chrome.svg"
              alt=""
              loading="lazy"
              decoding="async"
              className="size-4"
            />
            Add to Chrome
          </a>
        </div>
      </Container>
    </section>
  )
}
