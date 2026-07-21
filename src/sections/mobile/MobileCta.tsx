import { Img } from "@/components/site/Img"
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
          <h2 className="mt-16 text-[clamp(24px,6.6vw,30px)] font-medium leading-[1.2] tracking-[-0.04em] text-white md:mt-12 md:text-[24px] md:leading-[32px]">
            Start your experience with LoadHunter
          </h2>
          <p className="mt-4 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-white">
            Search loads with efficiency and speed you never had before. LoadHunter: AI-powered
            tool.
          </p>
          <a
            href="#start"
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white bg-white shadow-pill transition-transform active:scale-[0.98] md:w-[220px]"
          >
            <img
              src="/figma/tail/cta-chrome.svg"
              alt=""
              loading="lazy"
              decoding="async"
              className="size-4"
            />
            <span
              className="bg-clip-text text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-transparent"
              style={{
                backgroundImage: "linear-gradient(149.61deg, var(--color-violet) 0%, var(--color-violet-cta) 100%)",
              }}
            >
              Add to Chrome
            </span>
          </a>
        </div>
      </Container>
    </section>
  )
}
