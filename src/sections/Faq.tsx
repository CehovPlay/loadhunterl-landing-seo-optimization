import { Img } from "@/components/site/Img"
import { FaqAccordion } from "@/components/site/FaqAccordion"
import { FAQ_INTRO } from "@/content/copy"

/**
 * FAQ, rebuilt for LH-044 / LH-045 / SEO-021.
 *
 * The old five-question support list is gone: the homepage now carries exactly
 * the eight approved entity-first Q&A (FAQ-001..008) as a compact accordion
 * with permanent per-question anchors, the first one open. The support-flavoured
 * questions that used to live here (installation, factoring connection, VoIP,
 * detailed cancellation) move to the dedicated /faq/ page.
 *
 * Height is content-driven now (LH-015): the old fixed h-[1046px] could not
 * hold eight questions. [content-visibility] is dropped with it, because the
 * answers must stay renderable/greppable for crawlers at any scroll position.
 */
export function Faq() {
  return (
    <section id="faq" className="relative w-full bg-gray-800" aria-labelledby="faq-title">
      <div className="flex flex-col items-center px-[120px] pb-[120px] pt-[120px]">
        {/* icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
        <div data-float className="relative size-[64px]">
          <Img
            src="/figma/tail/faq-icon.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
          />
        </div>

        <h2
          id="faq-title"
          className="mt-[48px] text-center text-[44px] font-medium leading-[52px] tracking-[-0.03em] text-white"
        >
          {FAQ_INTRO.h2}
        </h2>

        <p className="mt-[20px] max-w-[900px] text-center text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[rgba(255,255,255,0.65)]">
          {FAQ_INTRO.lead}
        </p>

        <div className="mt-[56px] w-full max-w-[1080px]">
          <FaqAccordion />
        </div>
      </div>
    </section>
  )
}
