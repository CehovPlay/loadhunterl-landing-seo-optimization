import { Img } from "@/components/site/Img"
import { useCallback, useRef, useState } from "react"
import type { CSSProperties } from "react"

type Feature = {
  text: string
  clock?: boolean
  twoLine?: boolean
}

type Plan = {
  name: string
  icon: string
  blurb: string
  /** static price label (AI card); priced plans use `base` instead */
  price?: string
  /** base monthly price per dispatcher (loadhunter.io logic) */
  base?: number
  unit?: string
  note: string
  cols: [Feature[], Feature[]]
  cta: string
  head: "border" | "pro" | "ai"
  recommended?: boolean
  listX: number
  listY: number
  colGap: number
}

const f = (text: string, twoLine = false): Feature => ({ text, twoLine })
const clock = (text: string): Feature => ({ text, clock: true, twoLine: true })

const PRO_COLS: [Feature[], Feature[]] = [
  [
    f("Smart-board view"),
    f("Full load board customization", true),
    f("Auto-Refresh Button"),
    f("Pin to Top"),
    f("Performance Boost"),
    f("Redesigned load board"),
    f("Search Tabs Reorder"),
    f("Up to 2 Factoring Connections", true),
    f("FMCSA Broker Lookup"),
  ],
  [
    f("Team Management"),
    f("Advanced Filtering Modes", true),
    f("Driver Profile Setup"),
    clock("CC Support for Emails (Coming soon)"),
    clock("Dispatcher Analytics (Coming soon)"),
    clock("Idle Driver Email Alerts (Coming soon)"),
    clock("Email Read Notifications (Coming soon)"),
  ],
]

const PLANS: Plan[] = [
  {
    name: "Basic",
    icon: "/figma/pricing/icon-basic.svg",
    blurb: "A streamlined plan to get you moving fast with essential tools.",
    base: 9.99,
    unit: "/per month",
    note: "Save 20% with team rate.",
    cols: [
      [f("Unlimited Emails"), f("1 Connected Email"), f("1 Email Template"), f("Google Maps Integration"), f("Load Filters")],
      [f("RPM+"), f("Click to Call"), f("Copy Load Info"), f("Weather Integration"), f("Profit Calculator")],
    ],
    cta: "Start 14-day free trial",
    head: "border",
    listX: 28,
    listY: 260,
    colGap: 22,
  },
  {
    name: "Standard",
    icon: "/figma/pricing/icon-standard.svg",
    blurb: "Perfect for fast-paced teams looking to automate and organize.",
    base: 14.99,
    unit: "/per month",
    note: "Save 20% with team rate.",
    cols: [
      [
        f("Unlimited Email Accounts", true),
        f("Unlimited Templates"),
        f("Email Signature"),
        f("VoIP Integration"),
        f("Tolls Integration"),
        f("Integrated TMS"),
        f("Saved Loads"),
        f("Dark Mode"),
        f("Integrated\nTrucking Map", true),
      ],
      [
        f("Advanced Profit Calculator", true),
        f("1 Factoring Connection"),
        f("Community Reviews"),
        f("Market Conditions"),
        f("Load Notes"),
        f("Ignore Brokers/States"),
        f("Hide cancelled loads"),
        f("Hide CA/MX loads"),
        f("Advanced Profit Calculator", true),
      ],
    ],
    cta: "Start 14-day free trial",
    head: "border",
    listX: 32,
    listY: 250,
    colGap: 51,
  },
  {
    name: "Pro",
    icon: "/figma/pricing/icon-pro.svg",
    blurb: "Unlock the full LoadHunter experience with automation, insights, and control.",
    base: 29.99,
    unit: "/per month",
    note: "Best value for 10+ dispatchers.",
    cols: PRO_COLS,
    cta: "Start 14-day free trial",
    head: "pro",
    recommended: true,
    listX: 32,
    listY: 250,
    colGap: 51,
  },
  {
    name: "AI subscription",
    icon: "/figma/pricing/icon-ai.png",
    blurb: "Our comprehensive enterprise solution comes fully equipped with all the professional features.",
    price: "Let's talk",
    note: "Best value for 20+ dispatchers.",
    cols: PRO_COLS,
    cta: "Add to wishlist",
    head: "ai",
    listX: 32,
    listY: 250,
    colGap: 51,
  },
]

const PILL_SHADOW =
  "0px 1px 0px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05), 0px 10px 10px rgba(0,0,0,0.1)"

function DiscountBadge({ text, shadow = true }: { text: string; shadow?: boolean }) {
  return (
    <div
      className="flex items-center rounded-[99px] border border-[rgba(232,232,232,0.75)] px-[6px] py-[1px]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
        boxShadow: shadow ? PILL_SHADOW : undefined,
      }}
    >
      <span className="text-[12px] leading-[14px] tracking-[-0.48px] text-white">{text}</span>
    </div>
  )
}

function CheckIcon() {
  return (
    <div className="relative h-[6px] w-[9px] shrink-0">
      <img loading="lazy" decoding="async"
        src="/figma/pricing/check.svg"
        alt=""
        className="absolute max-w-none"
        style={{ left: -1, top: -1, width: 11, height: 7.21 }}
      />
    </div>
  )
}

function ClockIcon() {
  return (
    <div className="relative size-[10px] shrink-0">
      {/* coming-soon marker spins like a loader — GSAP data-spin (micro.ts):
          CSS keyframe animations on the transform don't render inside the
          scaled canvas in Chrome, so it's driven from the shared ticker.
          data-no-reveal: the reveal cascade tweens with overwrite:true and
          would kill the spin the moment the row fades in. */}
      <img loading="lazy" decoding="async"
        src="/figma/pricing/clock.svg"
        alt=""
        data-spin
        data-no-reveal
        className="absolute max-w-none"
        style={{ left: -1, top: -1, width: 12, height: 12 }}
      />
    </div>
  )
}

function FeatureItem({ item }: { item: Feature }) {
  if (item.clock) {
    return (
      <div className="flex w-full items-start gap-[12px] opacity-50">
        <ClockIcon />
        <p className="min-w-px flex-1 whitespace-pre-line text-[12px] leading-[14px] tracking-[-0.48px] text-gray-50">{item.text}</p>
      </div>
    )
  }
  return (
    <div className={`flex w-full items-center gap-[12px] ${item.twoLine ? "h-[28px]" : "h-[14px]"}`}>
      <CheckIcon />
      <p className="min-w-px flex-1 whitespace-pre-line text-[12px] leading-[14px] tracking-[-0.48px] text-gray-50">{item.text}</p>
    </div>
  )
}

function PlanCard({
  plan,
  left,
  priceText,
}: {
  plan: Plan
  left: number
  priceText: string
}) {
  const headStyle: CSSProperties =
    plan.head === "pro"
      ? { backgroundImage: "radial-gradient(ellipse 433px 487px at 6px 7px, rgba(53,50,70,1) 0%, rgba(53,50,70,0) 100%)" }
      : plan.head === "ai"
        ? { backgroundImage: "radial-gradient(250px 290px at 205px 237px, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)" }
        : {}

  return (
    <div
      className="absolute top-[544px] h-[690px] w-[417px] overflow-hidden rounded-[16px] border border-[rgba(229,229,229,0.1)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      style={{ left, backgroundImage: "linear-gradient(to bottom, #181a1f, rgba(24,26,31,0))" }}
    >
      {/* head panel */}
      <div className="absolute left-[3px] top-[3px] h-[218px] w-[409px] rounded-[12px]" style={headStyle}>
        {plan.head === "border" && (
          <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(229,229,229,0.2)]" />
        )}
        {/* icon — the AI png carries a baked dark square, crop it to the plate */}
        <div
          className={`absolute left-[24px] top-[24px] size-[64px] ${
            plan.icon.endsWith(".png") ? "overflow-hidden rounded-[14px]" : ""
          }`}
        >
          <Img src={plan.icon} alt="" loading="lazy" decoding="async" className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none" />
        </div>
        {/* name + badge */}
        <div className="absolute left-[112px] top-[24px] h-[32px] w-[273px]">
          <span className="whitespace-nowrap text-[20px] leading-[32px] tracking-[-0.8px] text-gray-50">{plan.name}</span>
          {plan.recommended && (
            <div className="absolute left-[41px] top-[4px] flex h-[24px] items-center gap-[10px] rounded-[200px] bg-[rgba(232,232,232,0.1)] px-[10px]">
              <img loading="lazy" decoding="async" src="/figma/pricing/crown.svg" alt="" className="h-[14px] w-[12.24px] max-w-none" />
              <span className="whitespace-nowrap text-[12px] leading-[14px] tracking-[-0.48px] text-gray-50">Recommended</span>
            </div>
          )}
        </div>
        {/* description */}
        <p className="absolute left-[112px] top-[60px] w-[273px] text-[12px] leading-[14px] tracking-[-0.48px] text-gray-50">
          {plan.blurb}
        </p>
        {/* separator */}
        <div className="absolute left-[24px] top-[112px] h-px w-[361px] bg-[rgba(229,229,229,0.1)]" />
        {/* price */}
        <div className="absolute left-[24px] top-[136px] w-[361px]">
          <div className="flex items-center gap-[12px]">
            <span className="whitespace-nowrap text-[30px] leading-[40px] tracking-[-1.2px] text-gray-50">{priceText}</span>
            {plan.unit && (
              <span className="whitespace-nowrap text-[12px] leading-[14px] tracking-[-0.48px] text-[#a2a2a2]">{plan.unit}</span>
            )}
          </div>
          <p className="mt-[4px] whitespace-nowrap text-[12px] leading-[14px] tracking-[-0.48px] text-[#a2a2a2]">{plan.note}</p>
        </div>
      </div>

      {/* feature list */}
      <div
        className="absolute flex w-[353px] items-start"
        style={{ left: plan.listX - 1, top: plan.listY - 1, columnGap: plan.colGap }}
      >
        {plan.cols.map((col, ci) => (
          <div key={ci} className="flex min-w-px flex-1 flex-col gap-[22px]">
            {col.map((item, i) => (
              <FeatureItem key={i} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* button — violet glow floods up from the bottom on hover */}
      <button
        className="group absolute bottom-[3px] left-[3px] flex h-[42px] w-[409px] items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(232,232,232,0.2)] shadow-[0px_6px_10px_0px_rgba(80,50,15,0.1)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(232,232,232,0.45)] hover:shadow-[0px_10px_28px_-6px_rgba(111,81,151,0.5)]"
        type="button"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[11px] bg-[rgba(0,0,0,0.1)]" />
        <span
          className="pointer-events-none absolute inset-0 rounded-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(70% 160% at 50% 115%, rgba(111,81,151,0.95) 0%, rgba(111,81,151,0) 100%)",
          }}
        />
        <span className="relative text-[14px] leading-[16px] tracking-[-0.56px] text-gray-50 transition-transform duration-300 group-hover:-translate-y-[1px]">
          {plan.cta}
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-[11px] shadow-[inset_0px_0px_24px_0px_rgba(255,255,255,0.25)]" />
      </button>
    </div>
  )
}

/* --- loadhunter.io pricing logic ---------------------------------------
 * team discount: n === 3 → -10%, n >= 4 → -20%;
 * annual billing → extra -10%;
 * per-dispatcher price truncated to cents, then multiplied by n.
 */
function planTotal(base: number, n: number, annual: boolean): number {
  const teamMult = n >= 4 ? 0.8 : n === 3 ? 0.9 : 1
  const annualMult = annual ? 0.9 : 1
  const per = Math.floor(base * teamMult * annualMult * 100) / 100
  return Math.round(per * n * 100) / 100
}

/* Slider zones anchored to the design's badge positions (track 848px wide,
 * knob center at 271px = 3 dispatchers, -20% badge center at 499px = 4). */
const KNOB_MIN = 11
const KNOB_10 = 271
const KNOB_20 = 499
const KNOB_MAX = 837

function knobToCount(px: number): number {
  if (px <= KNOB_10) return Math.round(1 + ((px - KNOB_MIN) / (KNOB_10 - KNOB_MIN)) * 2)
  if (px <= KNOB_20) return px < (KNOB_10 + KNOB_20) / 2 ? 3 : 4
  return Math.round(4 + ((px - KNOB_20) / (KNOB_MAX - KNOB_20)) * 46)
}

export function Pricing() {
  // defaults: annual billing + 1 dispatcher — the lowest price we can show
  const [annual, setAnnual] = useState(true)
  const [knob, setKnob] = useState(KNOB_MIN)
  const trackRef = useRef<HTMLDivElement>(null)
  const n = knobToCount(knob)

  const moveTo = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width))
    setKnob(Math.min(KNOB_MAX, Math.max(KNOB_MIN, frac * 848)))
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
      moveTo(e.clientX)
      const onMove = (ev: PointerEvent) => moveTo(ev.clientX)
      const onUp = () => {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
      }
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup", onUp)
    },
    [moveTo],
  )

  const priceFor = (plan: Plan) =>
    plan.base != null
      ? `From $${planTotal(plan.base, n, annual).toFixed(2)}`
      : (plan.price ?? "")

  return (
    <section id="pricing" className="relative h-[1462px] bg-gray-800 [content-visibility:auto] [contain-intrinsic-size:1920px_1462px]">
      {/* header icon */}
      <div data-float className="absolute left-[928px] top-0 size-[64px]">
        <img loading="lazy" decoding="async" src="/figma/pricing/header-icon.svg" alt="" className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none" />
      </div>

      {/* heading */}
      <h2 className="absolute left-[442px] top-[124px] w-[1036px] text-center text-[48px] leading-[58px] tracking-[-1.92px] text-white">
        Choose the plan that&rsquo;s perfect for your business
      </h2>
      <p className="absolute left-[632px] top-[202px] w-[656px] whitespace-nowrap text-center text-[14px] leading-[16px] tracking-[-0.56px] text-ink-2">
        Enjoy a 10% annual discount, plus save an extra 10% with 3 users — and unlock 20% off starting at 4 users!
      </p>

      {/* billing toggle — Figma 1206:100899: container p-6/gap-12 on a
          rgba(231,231,231,0.1) pill with inset shadow; buttons h-28 px-12;
          the active pill gets a white border + bottom violet radial, and
          Annually carries the "save up -10%" badge inside (pr-4, gap-8);
          excluded from the scroll-reveal cascade */}
      <div
        data-no-reveal
        className="absolute left-[832.5px] top-[278px] flex h-[40px] items-center gap-[12px] rounded-[2000px] bg-[rgba(231,231,231,0.1)] p-[6px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
      >
        {(["Monthly", "Annually"] as const).map((label) => {
          const active = (label === "Annually") === annual
          const isAnnually = label === "Annually"
          return (
            <button
              key={label}
              type="button"
              onClick={() => setAnnual(isAnnually)}
              className={
                "flex h-[28px] items-center justify-center gap-[8px] rounded-[99px] py-[4px] transition-all " +
                (isAnnually ? "pl-[12px] pr-[4px] " : "px-[12px] ") +
                (active ? "border border-white backdrop-blur-[10px]" : "")
              }
              style={
                active
                  ? {
                      backgroundImage:
                        "radial-gradient(110px 38px at 50% 110%, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)",
                      boxShadow: PILL_SHADOW,
                    }
                  : undefined
              }
            >
              <span className="text-[14px] leading-[16px] tracking-[-0.56px] text-white">{label}</span>
              {/* the discount badge lives INSIDE the Annually pill */}
              {isAnnually && (
                <span
                  className="flex items-center rounded-[99px] border border-white px-[6px] py-[2px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
                    boxShadow: PILL_SHADOW,
                  }}
                >
                  <span className="whitespace-nowrap text-[12px] leading-[14px] tracking-[-0.48px] text-white">
                    save up to 10%
                  </span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* dispatchers slider */}
      <div className="absolute left-[536px] top-[342px] w-[848px] select-none">
        <p
          className="w-[120px] whitespace-nowrap text-center text-[16px] leading-[20px] tracking-[-0.64px] text-white"
          style={{ marginLeft: knob - 68 }}
        >
          {n} {n === 1 ? "dispatcher" : "dispatchers"}
        </p>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          role="slider"
          aria-label="Number of dispatchers"
          aria-valuemin={1}
          aria-valuemax={10}
          aria-valuenow={n}
          className="relative mt-[14px] h-[16px] w-full cursor-pointer rounded-[200px] bg-[rgba(231,231,231,0.1)]"
        >
          <div
            className="absolute left-[2px] top-[2px] h-[12px] rounded-[8px] bg-[#6f5197] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_0px_rgba(255,255,255,0.35)]"
            style={{ width: Math.max(12, knob - 2) }}
          />
          <div
            className="absolute top-[-3px] size-[22px] cursor-grab active:cursor-grabbing"
            style={{ left: knob - 11 }}
          >
            <img loading="lazy" decoding="async"
              src="/figma/pricing/knob.svg"
              alt=""
              draggable={false}
              className="absolute max-w-none"
              style={{ left: -9.43, top: -4.71, width: 40.86, height: 40.86 }}
            />
          </div>
        </div>
        <div className="relative mt-[14px] h-[18px]">
          <div
            className={`absolute left-[239px] top-0 transition-opacity duration-300 ${n >= 3 ? "opacity-100" : "opacity-50"}`}
          >
            <DiscountBadge text="-10% OFF" shadow={n >= 3} />
          </div>
          <div
            className={`absolute left-[466px] top-0 transition-opacity duration-300 ${n >= 4 ? "opacity-100" : "opacity-50"}`}
          >
            <DiscountBadge text="-20% OFF" shadow={n >= 4} />
          </div>
        </div>
      </div>

      {/* plan cards */}
      {PLANS.map((plan, i) => (
        <PlanCard
          key={plan.name}
          plan={plan}
          left={[120, 541, 962, 1383][i]}
          priceText={priceFor(plan)}
        />
      ))}
    </section>
  )
}
