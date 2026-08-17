import { Img } from "@/components/site/Img"
import { FEATURES_INTRO, TOOL_BLOCKS } from "@/content/copy"
import { Container, useMdUp } from "./ui"

/* Mobile mockups are dedicated exports (public/figma/mobile/tools-*.png,
   724px = 2x the 362px slot) — NOT the desktop compositions. They're drawn
   for the phone frame, so they render 1:1 with no cropping or masks.
   Copy comes from the shared TOOL_BLOCKS so desktop and mobile cannot drift
   (QA-005 content parity). */
const BLOCKS = TOOL_BLOCKS.map((b) => ({
  key: b.key,
  title: b.h3,
  desc: b.body,
  mockup: `/figma/mobile/tools-${b.key}.png`,
  items: b.items,
}))

/**
 * Mobile Tools — the user's own mobile structure (Figma 1263:87697):
 * everything centre-aligned, NO spine line / nodes. Per block: full-width
 * mockup → title → description → two items (icon, title, sub), all centred.
 */
export function MobileTools() {
  // tablet uses the bigger "desk" exports, scaled to the padded content width
  const mdUp = useMdUp()
  return (
    <section id="features" className="bg-gray-800 py-16">
      <Container>
        {/* intro — centred: gear icon plate, heading, dimmed sub */}
        <div className="flex flex-col items-center text-center">
          <div data-float className="w-[72px]">
            <Img src="/figma/tools/intro-icon.png" alt="" loading="lazy" decoding="async" className="w-full" />
          </div>
          <h2 className="mt-8 max-w-[900px] text-[clamp(26px,6.6vw,32px)] font-medium leading-[1.2] tracking-[-0.03em] text-white md:text-[40px] md:leading-[48px]">
            {FEATURES_INTRO.h2}
          </h2>
          <p className="mt-4 max-w-[600px] text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-[rgba(255,255,255,0.65)]">
            {FEATURES_INTRO.lead}
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:gap-24">
          {BLOCKS.map((b) => (
            <article key={b.key} data-card className="flex flex-col items-center">
              <Img
                src={mdUp ? b.mockup.replace("/mobile/", "/desk/") : b.mockup}
                alt={`${b.title} interface`}
                loading="lazy"
                decoding="async"
                className="block w-full max-w-[560px] md:max-w-none"
              />
              <h3 className="mt-8 text-center text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-white">
                {b.title}
              </h3>
              <p className="mt-3 max-w-[560px] text-center text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
                {b.desc}
              </p>
              <div className="mt-10 flex flex-col gap-10">
                {b.items.map((it) => (
                  <div key={it.title} className="flex flex-col items-center text-center">
                    <div className="size-12">
                      <Img src={it.icon} alt="" loading="lazy" decoding="async" className="w-full" />
                    </div>
                    <h4 className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                      {it.title}
                      {/* LH-032 — every signal names its source */}
                      {"source" in it && it.source && (
                        <span className="rounded-full border border-gray-650 px-2 py-px text-[11px] font-medium leading-4 tracking-normal text-[rgba(255,255,255,0.55)]">
                          Source: {it.source}
                        </span>
                      )}
                    </h4>
                    <p className="mt-2.5 max-w-[420px] text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
                      {it.sub}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
