import { Img } from "@/components/site/Img"
import { CARDS, svgHtml } from "@/sections/Features"
import { Container } from "./ui"

/**
 * Mobile Features: the desktop cards reflowed full-width — same #f0f0f0
 * card, same border/radius, same inlined Figma SVG scene covering the lower
 * window (identical viewBox crop + preserveAspectRatio), text block on top.
 */
export function MobileFeatures() {
  return (
    <section id="why" className="bg-bg-light py-16">
      <Container>
        {/* header — desktop composition: floating icon → h2 → sub */}
        <div className="flex flex-col items-center text-center">
          <div data-float className="relative mb-8 size-[56px]">
            <Img
              src="/figma/feat-icon-2x.png"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute left-[-9px] top-[-3px] w-[74px] max-w-none"
            />
          </div>
          <h2 className="text-[clamp(28px,7.7vw,34px)] font-medium leading-[1.2] tracking-[-0.04em] text-ink">
            Everything you need to book faster — nothing extra
          </h2>
          <p className="mt-4 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
            New loads appear instantly — no refresh, no delay. Email or text brokers in seconds,
            not minutes.
          </p>
        </div>

        {/* cards — desktop card skin, stacked */}
        <div className="mt-12 flex flex-col gap-5">
          {CARDS.map((c) => (
            <div
              key={c.title}
              data-card
              className="overflow-hidden rounded-[12px] border border-border-light bg-[#f0f0f0]"
            >
              <div className="flex flex-col items-center gap-3 px-4 pt-5 text-center">
                <p className="text-[20px] font-medium leading-[28px] tracking-[-0.8px] text-ink">
                  {c.title}
                </p>
                <p className="text-[14px] font-medium leading-[18px] tracking-[-0.56px] text-ink-2">
                  {c.body}
                </p>
              </div>
              {/* the Figma vector scene, covering the card window like desktop */}
              <div className="relative mt-2 h-[250px] w-full overflow-hidden">
                <div
                  data-no-reveal
                  className="absolute inset-0"
                  dangerouslySetInnerHTML={{ __html: svgHtml(c.svg, c.viewBox, c.par) }}
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
