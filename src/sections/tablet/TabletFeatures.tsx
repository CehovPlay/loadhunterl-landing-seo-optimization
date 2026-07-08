import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Figma: Tablet (768) features — Frame 2147238647 (916:70049, 768x1363 @ y=1324),
 * section owns y 1324..2703 (h 1379): last 16px is the dark head of the next block.
 *   partners strip: logo group export (768x59 visible crop) @ y20; fades 120/156 over h96.
 *   The export tiles seamlessly with period 728 (verified pixel-exact), so the
 *   marquee lays three copies 728 apart and drifts one period left→right.
 *   header @ y136: icon 64, +40 title 30/40, +20 subtitle 14/16
 *   cards @ y356, x40: 3x 688x309, gap 20 — image 362(361)x309 flush right (exported 2x)
 */
const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    img: "/figma/tablet/feat-card1-img.png",
    imgLeft: 326,
    imgWidth: 362,
    textLeft: 24,
    textWidth: 293,
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most— booking the best loads.",
    img: "/figma/tablet/feat-card2-img.png",
    imgLeft: 327,
    imgWidth: 361,
    textLeft: 14,
    textWidth: 299,
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    img: "/figma/tablet/feat-card3-img.png",
    imgLeft: 327,
    imgWidth: 361,
    textLeft: 14,
    textWidth: 299,
  },
]

const STRIP_PERIOD = 728

export function TabletFeatures() {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tween = gsap.to(track, {
      x: STRIP_PERIOD, // one tile period → seamless wrap
      duration: 30, // ≈ desktop marquee speed (24 px/s)
      ease: "none",
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section id="why" className="relative overflow-hidden bg-bg-light" style={{ height: 1379 }}>
      {/* partners strip — marquee of the tiling export */}
      <div className="absolute left-0 top-0 h-[96px] w-[768px] overflow-hidden">
        <div ref={trackRef} data-marquee-track className="absolute inset-0 will-change-transform">
          {[-STRIP_PERIOD, 0, STRIP_PERIOD].map((x) => (
            <img
              key={x}
              src="/figma/tablet/partners-strip.png"
              alt=""
              className="absolute top-[20px] h-[59px] w-[768px] max-w-none"
              style={{ left: x }}
            />
          ))}
        </div>
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 h-[96px] w-[120px] bg-gradient-to-r from-[#fafafa] to-[rgba(250,250,250,0)]" />
      <div className="pointer-events-none absolute right-0 top-0 h-[96px] w-[156px] bg-gradient-to-l from-[#fafafa] to-[rgba(250,250,250,0)]" />

      {/* header */}
      <div className="absolute inset-x-0 top-[136px] flex flex-col items-center px-[40px]">
        {/* feature icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
        <div className="relative size-[64px]">
          <img
            src="/figma/feat-icon-2x.png"
            alt=""
            className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
          />
        </div>
        <h2
          className="mt-[40px] w-full text-center text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-ink"
          style={{ transform: "translateX(-1px)" }}
        >
          Everything you need to book faster — nothing extra
        </h2>
        <p className="mt-[20px] w-full text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
          New loads appear instantly — no refresh, no delay. Email or text
          brokers in seconds, not minutes.
        </p>
      </div>

      {/* cards */}
      <div className="absolute left-[40px] top-[356px] flex w-[688px] flex-col gap-[20px]">
        {CARDS.map((c) => (
          <div
            key={c.title}
            className="relative h-[309px] w-full overflow-hidden rounded-[12px] bg-[#f0f0f0]"
          >
            <img
              src={c.img}
              alt=""
              className="absolute top-0 h-[309px] max-w-none"
              style={{ left: c.imgLeft, width: c.imgWidth }}
            />
            <div
              className="absolute top-[calc(50%-0.5px)] flex -translate-y-1/2 flex-col gap-[4px]"
              style={{ left: c.textLeft, width: c.textWidth }}
            >
              <p className="text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-ink">
                {c.title}
              </p>
              <p className="text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
                {c.body}
              </p>
            </div>
            {/* border above content, like Figma inside stroke */}
            <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-border-light" />
          </div>
        ))}
      </div>

      {/* dark head of the next block (section spans 16px past the Figma frame) */}
      <div className="absolute bottom-0 left-0 h-[16px] w-full bg-gray-800" />
    </section>
  )
}
