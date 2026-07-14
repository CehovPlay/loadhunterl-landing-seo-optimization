import { Img } from "@/components/site/Img"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { gateLoops, prefersReducedMotion, willChangeInView } from "@/lib/inview"

/**
 * HD (1440) Features — Figma 916:73796. Reflow of the 1920 Features:
 *  - header padding px-120 → px-40; container pb-120 → pb-40
 *  - 3 cards become flex-1 inside a px-32 row (≈445px each) vs fixed 546
 *  - card body text 14/16 → 12/14 (tracking -0.48); per-card image crops differ
 * Partners marquee (step 302, period 1208) reused unchanged.
 */
const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    img: "/figma/feat-card1-img.png",
    imgCls: "absolute h-[79.55%] left-[-11.24%] top-[26.62%] w-[122.7%] max-w-none",
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most— booking the best loads.",
    img: "/figma/feat-card2-img.png",
    imgCls: "absolute h-[79.55%] left-[-11.21%] top-[22.27%] w-[122.42%] max-w-none",
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    img: "/figma/feat-card3-img.png",
    imgCls: "absolute h-[85.45%] left-[-15.81%] top-[19.09%] w-[131.81%] max-w-none",
  },
]

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
      <Img src={p.src} alt="" loading="lazy" decoding="async" className={p.cls} />
    </div>
  )
}

export function HdFeatures() {
  const xs: number[] = []
  for (let x = -20 - 1208; x <= 2094; x += 302) xs.push(x)

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (prefersReducedMotion()) return
    const tween = gsap.to(track, { x: 1208, duration: 50, ease: "none", repeat: -1 })
    const stopGate = gateLoops(sectionRef.current, tween)
    const stopWC = willChangeInView(track, sectionRef.current)
    return () => {
      stopWC()
      stopGate()
      tween.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} id="why" className="relative w-full bg-bg-light">
      {/* Partners block, 136px — slow left→right marquee */}
      <div className="relative h-[136px] w-full overflow-hidden">
        <div ref={trackRef} data-marquee-track className="absolute inset-0">
          {xs.map((x) => {
            const idx = (((x + 20) / 302) % 4 + 4) % 4
            return <PartnerLogo key={x} x={x} idx={idx} />
          })}
        </div>
        <div className="pointer-events-none absolute left-0 top-0 h-[136px] w-[189px] bg-gradient-to-r from-[#fafafa] to-[rgba(250,250,250,0)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[136px] w-[189px] bg-gradient-to-l from-[#fafafa] to-[rgba(250,250,250,0)]" />
      </div>

      <div className="flex w-full flex-col items-center gap-[120px] pb-[40px] pt-[80px]">
        {/* header (px-40) */}
        <div className="flex w-full flex-col items-center gap-[20px] px-[40px]">
          <div className="flex w-full flex-col items-center gap-[60px]">
            <div data-float className="relative size-[64px]">
              <Img
                src="/figma/feat-icon-2x.png"
                alt=""
                loading="lazy"
                decoding="async"
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

        {/* cards (px-32, flex-1 → ≈445 each) */}
        <div className="flex w-full items-start gap-[20px] px-[32px]">
          {CARDS.map((c) => (
            <div
              key={c.title}
              data-lift
              className="relative h-[440px] flex-1 overflow-hidden rounded-[12px] border border-border-light bg-[#f0f0f0]"
            >
              <div className="absolute left-0 top-[33px] flex h-[64px] w-full items-center px-[14px]">
                <div className="flex flex-1 flex-col items-start gap-[4px]">
                  <p className="w-full text-center text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-ink">
                    {c.title}
                  </p>
                  <p className="w-full text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
                    {c.body}
                  </p>
                </div>
              </div>
              <div className="absolute left-1/2 top-[-1px] h-[440px] w-[445px] -translate-x-1/2 overflow-hidden">
                <Img src={c.img} alt="" loading="lazy" decoding="async" className={c.imgCls} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
