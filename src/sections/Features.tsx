import { useEffect, useRef } from "react"
import gsap from "gsap"
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
const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    svg: orbitSvg,
    imgBox: { top: 89, height: 350 },
    viewBox: "112 586 587 376",
    par: "xMidYMid slice",
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most— booking the best loads.",
    svg: gaugeSvg,
    imgBox: { top: 97, height: 342 },
    viewBox: "140 116 523 342",
    par: "xMidYMin slice",
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    svg: aiSvg,
    imgBox: { top: 83, height: 356 },
    viewBox: "183 152 524 342",
    par: "xMidYMid slice",
  },
]

/** Rewrite the exported <svg> tag to a given viewBox/alignment and cover the window. */
function svgHtml(raw: string, viewBox: string, par: string) {
  return raw.replace(
    /<svg\b[^>]*>/,
    `<svg viewBox="${viewBox}" preserveAspectRatio="${par}" fill="none" ` +
      `xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">`,
  )
}

/* Partners marquee row — Figma PartnersBlock: logos 112x56 @ y40, step 302px */
const PARTNER_SEQ = [
  { src: "/figma/partner-123loadboard.svg", cls: "mt-[18px] h-[19.029px] w-[112px]" },
  { src: "/figma/partner-trucksmarter.svg", cls: "mt-[14px] h-[27.07px] w-[112px]" },
  { src: "/figma/partner-truckstop.svg", cls: "mt-[18px] h-[19.911px] w-[112px]" },
  { src: "/figma/partner-dat.svg", cls: "mt-[16px] h-[24.17px] w-[112px]" },
]

function PartnerLogo({ x, idx }: { x: number; idx: number }) {
  const p = PARTNER_SEQ[idx % 4]
  return (
    <div className="absolute top-[40px] h-[56px] w-[112px]" style={{ left: x }}>
      <img src={p.src} alt="" className={p.cls} />
    </div>
  )
}

export function Features() {
  // Figma x positions: step 302, pattern of 4 logos (period 1208). The track
  // drifts left→right by one period and wraps, so we pre-extend one period
  // to the left of the design's -20..2094 range.
  const xs: number[] = []
  for (let x = -20 - 1208; x <= 2094; x += 302) xs.push(x)

  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tween = gsap.to(track, {
      x: 1208, // one full pattern period → seamless wrap
      duration: 50,
      ease: "none",
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section id="why" className="relative w-full bg-bg-light">
      {/* Partners block, 136px — slow left→right marquee */}
      <div className="relative h-[136px] w-full overflow-hidden">
        <div ref={trackRef} data-marquee-track className="absolute inset-0 will-change-transform">
          {xs.map((x) => {
            const idx = (((x + 20) / 302) % 4 + 4) % 4
            return <PartnerLogo key={x} x={x} idx={idx} />
          })}
        </div>
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-[136px] w-[189px] bg-gradient-to-r from-[#fafafa] to-[rgba(250,250,250,0)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[136px] w-[189px] bg-gradient-to-l from-[#fafafa] to-[rgba(250,250,250,0)]" />
      </div>

      <div className="flex w-full flex-col items-center gap-[120px] pb-[120px] pt-[80px]">
        {/* header */}
        <div className="flex w-full flex-col items-center gap-[20px] px-[120px]">
          <div className="flex w-full flex-col items-center gap-[60px]">
            {/* feature icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
            <div data-float className="relative size-[64px]">
              <img
                src="/figma/feat-icon-2x.png"
                alt=""
                className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
              />
            </div>
            <h2 className="w-full text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-ink">
              Everything you need to book faster — nothing extra
            </h2>
          </div>
          <p className="w-full text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            New loads appear instantly — no refresh, no delay. Email or text
            brokers in seconds, not minutes.
          </p>
        </div>

        {/* cards */}
        <div className="flex items-start gap-[20px]">
          {CARDS.map((c) => (
            <div
              key={c.title}
              data-lift
              className="relative h-[440px] w-[546px] overflow-hidden rounded-[12px] border border-border-light bg-[#f0f0f0]"
            >
              <div className="absolute left-[-1px] top-[-1px] flex w-[546px] items-center px-[14px] py-[20px]">
                <div className="flex w-[518px] flex-col items-start gap-[12px]">
                  <p className="w-full text-center text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-ink">
                    {c.title}
                  </p>
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
