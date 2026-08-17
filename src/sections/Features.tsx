import { Img } from "@/components/site/Img"
import { useRef } from "react"
import { WHY } from "@/content/copy"
import orbitSvg from "@/assets/features/orbit.svg?raw"
import gaugeSvg from "@/assets/features/gauge.svg?raw"
import aiSvg from "@/assets/features/ai.svg?raw"

/**
 * The three feature visuals are Figma vector exports (src/assets/features/*.svg),
 * inlined so their layers can be animated (each shape keeps its Figma id/name).
 * Each sits in the same card window the PNG used; `viewBox` crops the
 * illustration to the original PNG composition (derived from the SVG geometry
 * bboxes + the PNG's imgCls transform) and `par` (preserveAspectRatio) covers
 * the window, aligned to match how the PNG was placed (top-anchored for the
 * gauge, centred for the others).
 */
/**
 * "Why LoadHunter" (LH-017..021). The section keeps its original file name for
 * churn reasons, but in the approved information architecture it is the WHY
 * block: H2 + lead + three benefit cards, anchored at #why-loadhunter. The
 * product feature list lives in Tools.tsx (#features).
 */
export const CARDS = [
  {
    title: WHY.cards[0].h3,
    body: WHY.cards[0].body,
    svg: orbitSvg,
    imgBox: { top: 89, height: 350 },
    viewBox: "112 586 587 376",
    par: "xMidYMid slice",
  },
  {
    title: WHY.cards[1].h3,
    body: WHY.cards[1].body,
    svg: gaugeSvg,
    imgBox: { top: 97, height: 342 },
    viewBox: "140 116 523 342",
    par: "xMidYMin slice",
  },
  {
    title: WHY.cards[2].h3,
    body: WHY.cards[2].body,
    svg: aiSvg,
    imgBox: { top: 83, height: 356 },
    viewBox: "183 152 524 342",
    par: "xMidYMid slice",
  },
]

/** Rewrite the exported <svg> tag to a given viewBox/alignment and cover the window. */
export function svgHtml(raw: string, viewBox: string, par: string) {
  return raw.replace(
    /<svg\b[^>]*>/,
    `<svg viewBox="${viewBox}" preserveAspectRatio="${par}" fill="none" ` +
      `xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">`,
  )
}

export function Features() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} id="why-loadhunter" className="relative w-full bg-bg-light">
      {/* The partner marquee that used to open this section is gone: LH-016
          bans infinite marquees and LH-071 replaces it with the static
          Compatibility section placed right after the hero. */}
      <div className="flex w-full flex-col items-center gap-[120px] pb-[120px] pt-[40px]">
        {/* header */}
        <div className="flex w-full flex-col items-center gap-[20px] px-[120px]">
          <div className="flex w-full flex-col items-center gap-[60px]">
            {/* feature icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
            <div data-float className="relative size-[64px]">
              <Img
                src="/figma/feat-icon-2x.png"
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
              />
            </div>
            {/* LH-017 / SEO-006 / COPYQA-004 */}
            <h2 className="w-full max-w-[1200px] text-center text-[44px] font-medium leading-[52px] tracking-[-0.03em] text-ink">
              {WHY.h2}
            </h2>
          </div>
          {/* LH-018 / SEO-007 / COPYQA-005 */}
          <p className="w-full max-w-[900px] text-center text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-ink/80">
            {WHY.lead}
          </p>
        </div>

        {/* cards */}
        <div className="flex items-start gap-[20px]">
          {CARDS.map((c) => (
            <div
              key={c.title}
              data-lift
              className="relative h-[440px] w-[546px] overflow-hidden rounded-lg border border-border-light bg-gray-75"
            >
              <div className="absolute left-[-1px] top-[-1px] flex w-[546px] items-center px-[14px] py-[20px]">
                <div className="flex w-[518px] flex-col items-start gap-[12px]">
                  <h3 className="w-full text-center text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-ink">
                    {c.title}
                  </h3>
                  <p className="w-full text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
                    {c.body}
                  </p>
                </div>
              </div>
              <div
                className="absolute left-[-1px] w-[546px] overflow-hidden"
                style={{ top: c.imgBox.top, height: c.imgBox.height }}
              >
                <div
                  data-feat-visual
                  data-no-reveal
                  className="absolute inset-0"
                  dangerouslySetInnerHTML={{ __html: svgHtml(c.svg, c.viewBox, c.par) }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
