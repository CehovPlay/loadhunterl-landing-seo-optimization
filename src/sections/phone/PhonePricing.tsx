/**
 * Figma: Frame 2147238566 (942:107755) — 390x1662 @ phone-frame y=9785.
 * "Monthly" active, 3 dispatchers (knob @ 50px), -10% badge lit; the plan
 * cards are a vertical accordion (Figma "Plan mobile case" 942:110506):
 * stacked with 14px gaps at (14,490), Basic open by default. A collapsed
 * card is head panel + CTA (286 tall, AI 272); opening a card grows it to
 * its expanded height, revealing the two-column feature list between the
 * head panel and the bottom-pinned CTA. The section height follows the
 * stack (plus the 490px header above and 120px dark strip below).
 */
import { useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import {
  BASIC_COLS,
  STANDARD_COLS,
  PRO_COLS,
  FeatureItem,
  type FeatureCols,
} from "@/sections/pricingFeatures"

const PILL_SHADOW =
  "0px 1px 0px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05), 0px 10px 10px rgba(0,0,0,0.1)"

const PRO_BG = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 354 232' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(34.881 16.906 -11.858 49.732 5.1932 7.4043)'><stop stop-color='rgba(53,50,70,1)' offset='0'/><stop stop-color='rgba(53,50,70,0)' offset='1'/></radialGradient></defs></svg>")`

const AI_BG = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 354 218' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-15.32 -20.524 15.32 -20.524 177.43 237.13)'><stop stop-color='rgba(111,81,151,1)' offset='0'/><stop stop-color='rgba(111,81,151,0)' offset='1'/></radialGradient></defs></svg>")`

function Badge({
  text,
  shadow = true,
  className = "",
}: {
  text: string
  shadow?: boolean
  className?: string
}) {
  return (
    <div
      className={`flex h-[18px] items-center justify-center rounded-[99px] border border-[rgba(232,232,232,0.75)] bg-gradient-to-b from-[rgba(255,255,255,0.12)] to-[rgba(255,255,255,0.1)] px-[6px] ${className}`}
      style={shadow ? { boxShadow: PILL_SHADOW } : undefined}
    >
      <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-white">
        {text}
      </span>
    </div>
  )
}

type Plan = {
  name: string
  icon: string
  blurb: string
  price: string
  unit?: string
  note: string
  cta: string
  head: "border" | "border-inset" | "pro" | "ai"
  panelH: number
  recommended?: boolean
  cols: FeatureCols
  /** expanded card height (Figma 942:110506 states 2–5) */
  openH: number
  /** feature-list left offset / column width (columns gap is always 20) */
  listX: number
  colW: number
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    icon: "/figma/pricing/icon-basic.png",
    blurb: "A streamlined plan to get you moving fast with essential tools.",
    price: "From $26.97",
    unit: "/per month",
    note: "Save 20% with team rate.",
    cta: "Start 14 days trial",
    head: "border-inset",
    panelH: 232,
    cols: BASIC_COLS,
    openH: 502,
    listX: 20.5,
    colW: 149.5,
  },
  {
    name: "Standard",
    icon: "/figma/pricing/icon-standard.png",
    blurb: "Perfect for fast-paced teams looking to automate and organize.",
    price: "From $40.47",
    unit: "/per month",
    note: "Save 20% with team rate.",
    cta: "Start 14 days trial",
    head: "border",
    panelH: 232,
    cols: STANDARD_COLS,
    openH: 660,
    listX: 20.5,
    colW: 150.5,
  },
  {
    name: "Pro",
    icon: "/figma/pricing/icon-pro.png",
    blurb: "Unlock the full LoadHunter experience with automation, insights, and control.",
    price: "From $80.97",
    unit: "/per month",
    note: "Best value for 10+ dispatchers.",
    cta: "Start 14 days trial",
    head: "pro",
    panelH: 232,
    recommended: true,
    cols: PRO_COLS,
    openH: 674,
    listX: 28.5,
    colW: 142.5,
  },
  {
    name: "AI subscription",
    icon: "/figma/pricing/icon-ai.png",
    blurb: "Our comprehensive enterprise solution comes fully equipped with all the professional features.",
    price: "Let's talk",
    note: "Best value for 20+ dispatchers.",
    cta: "Contact us",
    head: "ai",
    panelH: 218,
    cols: PRO_COLS,
    openH: 660,
    listX: 28.5,
    colW: 142.5,
  },
]

const closedH = (plan: Plan) => plan.panelH + 54

function PlanCard({
  plan,
  expanded,
  onSelect,
}: {
  plan: Plan
  expanded: boolean
  onSelect: () => void
}) {
  const bordered = plan.head === "border" || plan.head === "border-inset"
  const panelStyle: CSSProperties =
    plan.head === "pro"
      ? { backgroundColor: "#181a1f", backgroundImage: PRO_BG }
      : plan.head === "ai"
        ? { backgroundColor: "#181a1f", backgroundImage: AI_BG }
        : { backgroundColor: "#181a1f" }

  return (
    // Vertical accordion card (Figma 942:110506): the height animates between
    // the closed head+CTA footprint and the expanded state, revealing the
    // feature list between the head panel and the bottom-pinned CTA.
    <div
      onClick={onSelect}
      className={`relative w-full overflow-hidden rounded-[16px] transition-[height] duration-500 ease-out ${
        expanded ? "" : "cursor-pointer"
      }`}
      style={{
        height: expanded ? plan.openH : closedH(plan),
        backgroundImage: "linear-gradient(to bottom, #181a1f, rgba(24,26,31,0))",
        boxShadow: plan.head === "pro" ? undefined : "0px 4px 4px 0px rgba(0,0,0,0.25)",
      }}
    >
      {/* hairline border (drawn inside, no layout impact) */}
      <span className="pointer-events-none absolute inset-0 rounded-[16px] border border-[rgba(229,229,229,0.1)]" />

      {/* head panel */}
      <div
        className="absolute left-[4px] top-[4px] w-[354px] overflow-hidden rounded-[12px]"
        style={{ height: plan.panelH, ...panelStyle }}
      >
        {bordered && (
          <span className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(229,229,229,0.2)]" />
        )}
        {/* plan icon — 40x40 box, desktop 84px render scaled to 52.5 */}
        <div className="absolute left-[24px] top-[24px] size-[40px]">
          <img loading="lazy" decoding="async"
            src={plan.icon}
            alt=""
            className="absolute left-[-6.25px] top-[-2.5px] w-[52.5px] max-w-none"
          />
        </div>

        <div className="absolute left-[76px] top-[24px] flex h-[32px] items-center gap-[4px]">
          <span className="whitespace-nowrap text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-[#e8e8e8]">
            {plan.name}
          </span>
          {plan.recommended && (
            <div className="flex h-[24px] items-center gap-[10px] rounded-[200px] bg-[rgba(232,232,232,0.1)] px-[10px]">
              <img loading="lazy" decoding="async"
                src="/figma/pricing/crown.svg"
                alt=""
                className="h-[14px] w-[12.24px] max-w-none"
              />
              <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#e8e8e8]">
                Recommended
              </span>
            </div>
          )}
        </div>
        <p className="absolute left-[76px] top-[60px] w-[254px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#e8e8e8]">
          {plan.blurb}
        </p>

        {/* separator */}
        <div className="absolute left-[24px] top-[112px] h-px w-[306px] bg-[rgba(229,229,229,0.1)]" />

        {/* price */}
        <div className="absolute left-[24px] top-[136px] flex h-[40px] items-center gap-[12px]">
          <span className="whitespace-nowrap text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-[#e8e8e8]">
            {plan.price}
          </span>
          {plan.unit && (
            <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#a2a2a2]">
              {plan.unit}
            </span>
          )}
        </div>
        <p className="absolute left-[24px] top-[180px] whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#a2a2a2]">
          {plan.note}
        </p>

        {plan.head === "border-inset" && (
          <div className="pointer-events-none absolute inset-0 rounded-[12px] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
        )}
      </div>

      {/* feature list — sits between the head panel and the CTA; while
          collapsed it would show through the translucent CTA overlapping the
          same rows, so it also fades out with the card */}
      <div
        className={`absolute flex gap-[20px] pt-[20px] transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
        style={{ left: plan.listX, top: plan.panelH + 8 }}
      >
        {plan.cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[22px]" style={{ width: plan.colW }}>
            {col.map((item, i) => (
              <FeatureItem key={i} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* CTA button */}
      <button
        type="button"
        className="absolute bottom-[4px] left-[4px] flex h-[42px] w-[354px] items-center justify-center rounded-[12px] shadow-[0px_6px_10px_0px_rgba(80,50,15,0.1)]"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[12px] bg-[rgba(0,0,0,0.1)] backdrop-blur-[17px]" />
        <span className="relative text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#e8e8e8]">
          {plan.cta}
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(232,232,232,0.2)] shadow-[inset_0px_0px_24px_0px_rgba(255,255,255,0.25)]" />
      </button>
    </div>
  )
}

function Controls(): ReactNode {
  return (
    <>
      {/* billing toggle */}
      <div className="absolute left-[14px] top-[288px] flex h-[40px] w-[362px] items-center gap-[12px] rounded-full py-[6px] pl-[6px] pr-[11px]">
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[rgba(231,231,231,0.1)] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]" />
        <button
          type="button"
          className="relative flex h-[28px] min-w-px flex-1 items-center justify-center rounded-[99px] border border-white/65 bg-violet backdrop-blur-[10px]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
            Monthly
          </span>
        </button>
        <div className="relative flex min-w-px flex-1 items-center gap-[12px]">
          <button
            type="button"
            className="min-w-px flex-1 text-left text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white"
          >
            Annually
          </button>
          <Badge text="save up -10%" />
        </div>
      </div>

      {/* dispatchers slider (static: 3 dispatchers) */}
      <div className="absolute left-[14px] top-[368px] w-[362px] select-none">
        <p className="ml-[12px] w-[98px] text-center text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          3 dispatchers
        </p>
        <div className="relative mt-[14px] h-[16px] w-full rounded-[200px] bg-[rgba(231,231,231,0.1)]">
          <div className="absolute left-[2px] top-[2px] h-[12px] w-[61px] rounded-[8px] bg-violet shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_0px_rgba(255,255,255,0.35)]" />
          <div className="absolute left-[50px] top-[-3px] size-[22px]">
            <img loading="lazy" decoding="async"
              src="/figma/pricing/knob.svg"
              alt=""
              draggable={false}
              className="absolute left-[-9.43px] top-[-4.71px] h-[40.86px] w-[40.86px] max-w-none"
            />
          </div>
        </div>
        <div className="relative mt-[14px] h-[18px]">
          <Badge text="-10% OFF" className="absolute left-[28px] top-0 h-[18px]" />
          <Badge
            text="-20% OFF"
            shadow={false}
            className="absolute left-[173px] top-0 h-[18px] opacity-50"
          />
        </div>
      </div>
    </>
  )
}

export function PhonePricing() {
  // vertical accordion: Basic open by default; clicking a collapsed plan
  // closes the open one and expands the clicked one (Figma 942:110506)
  const [open, setOpen] = useState(0)
  // cards top (490) + animated stack (3 gaps of 14) + 120px dark strip below
  const stackH =
    PLANS.reduce((h, plan, i) => h + (open === i ? plan.openH : closedH(plan)), 0) + 3 * 14

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-gray-800 transition-[height] duration-500 ease-out"
      style={{ height: 490 + stackH + 120 }}
    >
      {/* figma icon */}
      <div data-float className="absolute left-[163px] top-0 size-[64px]">
        <img loading="lazy" decoding="async"
          src="/figma/phone/icon-figma.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <h2 className="absolute left-[14px] top-[104px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-white">
        Choose the plans that&rsquo;s perfect
        <br />
        for your business
      </h2>
      <p className="absolute left-[14px] top-[176px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        <span className="block whitespace-nowrap">
          Enjoy a 10% annual discount, plus save an extra 10% with 3
        </span>
        <span className="block whitespace-nowrap">
          users — and unlock 20% off starting at 4 users!
        </span>
      </p>

      <Controls />

      {/* plan cards */}
      <div className="absolute left-[14px] top-[490px] flex w-[362px] flex-col gap-[14px]">
        {PLANS.map((plan, i) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            expanded={open === i}
            onSelect={() => setOpen(i)}
          />
        ))}
      </div>
    </section>
  )
}
