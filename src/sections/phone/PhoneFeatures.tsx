import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Figma: Frame 2147238647 (916:71594) — 390x1479 @ y1061, light section.
 * Partners logos 112x56 @ y20 (step 182); header icon @ (163,110);
 * H2 @ y214, lorem @ y286; cards 362 wide @ x14: y374 h403, y791 h330,
 * y1135 h330. Card art reuses the desktop 1092x700 exports (546x350 @1x),
 * placed per the Figma fill transforms.
 */
/**
 * The partner SVGs draw sibling logos outside their viewBox (overflow
 * visible) and each file's viewBox actually frames its NEIGHBOUR's art:
 * trucksmarter.svg → 123loadboard art, truckstop.svg → truckSmarter art,
 * dat.svg → truckstop art. Wrappers clip the bleed to the natural box.
 * Figma places the triplet at x −26/156/338 (step 182); the marquee cycles
 * that pattern with period 546 and drifts left→right like the desktop strip.
 */
const PARTNERS = [
  { src: "/figma/partner-trucksmarter.svg", mt: 14, h: 27.07 },
  { src: "/figma/partner-truckstop.svg", mt: 18, h: 19.911 },
  { src: "/figma/partner-dat.svg", mt: 16, h: 24.17 },
]
const PARTNER_PERIOD = 546 // 3 logos x 182px step

const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    img: "/figma/feat-card1-img.png",
    top: 374,
    height: 403,
    // fill: w 150.83%, h 86.85%, left −25.41%, top 17.9% (−1 for card border)
    imgRect: { left: -93, top: 71, width: 546 },
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most— booking the best loads.",
    img: "/figma/feat-card2-img.png",
    top: 791,
    height: 330,
    // fill: w 100%, h 70.32%, left 0, top 29.69% (−1 for card border)
    imgRect: { left: -1, top: 97, width: 362 },
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    img: "/figma/feat-card3-img.png",
    top: 1135,
    height: 330,
    // fill: w 105.9%, h 74.53%, left −2.81%, top 25.47% (−1 for card border)
    imgRect: { left: -11.2, top: 83, width: 383.4 },
  },
]

export function PhoneFeatures() {
  // pre-extend one period to the left: the track drifts right and wraps
  const xs: number[] = []
  for (let x = -26 - PARTNER_PERIOD; x <= 390; x += 182) xs.push(x)

  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tween = gsap.to(track, {
      x: PARTNER_PERIOD, // one full pattern period → seamless wrap
      duration: 23, // ≈ desktop marquee speed (24 px/s)
      ease: "none",
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-bg-light"
      style={{ height: 1479 }}
    >
      {/* partners marquee row */}
      <div className="absolute inset-x-0 top-0 h-[96px] overflow-hidden">
        <div ref={trackRef} data-marquee-track className="absolute inset-0 will-change-transform">
          {xs.map((x) => {
            const p = PARTNERS[((((x + 26) / 182) % 3) + 3) % 3]
            return (
              <div
                key={x}
                className="absolute w-[112px] overflow-hidden"
                style={{ left: x, top: 20 + p.mt, height: p.h }}
              >
                <img
                  src={p.src}
                  alt=""
                  className="max-w-none"
                  style={{ width: 112, height: p.h }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* header icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
      <div data-float className="absolute left-[163px] top-[110px] size-[64px]">
        <img
          src="/figma/feat-icon-2x.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <h2 className="absolute left-[14px] top-[214px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-ink">
        Why thousands of dispatchers
        <br />
        choose LoadHunter
      </h2>
      <p className="absolute left-[14px] top-[286px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>

      {/* cards */}
      {CARDS.map((c) => (
        <div
          key={c.title}
          data-card
          className="absolute left-[14px] w-[362px] overflow-hidden rounded-[12px] border border-border-light bg-[#f0f0f0]"
          style={{ top: c.top, height: c.height }}
        >
          <img
            src={c.img}
            alt=""
            className="absolute max-w-none"
            style={c.imgRect}
          />
          <div className="absolute left-[-2px] top-[-2px] flex w-[362px] flex-col gap-[4px] p-[14px]">
            <p className="w-full text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-ink">
              {c.title}
            </p>
            <p className="w-full text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
              {c.body}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
