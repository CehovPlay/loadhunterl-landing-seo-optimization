import { useState } from "react"
import { Img } from "@/components/site/Img"
import { BASIC_COLS, PRO_COLS, STANDARD_COLS, type FeatureCols } from "@/sections/pricingFeatures"
import { planTotal } from "@/sections/pricingLogic"
import { Container, PILL_SHADOW, SectionHeader } from "./ui"

type Plan = {
  name: string
  icon: string
  blurb: string
  price?: string
  base?: number
  unit?: string
  note: string
  cols: FeatureCols
  cta: string
  head: "border" | "pro" | "ai"
  recommended?: boolean
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    icon: "/figma/pricing/icon-basic.svg",
    blurb: "A streamlined plan to get you moving fast with essential tools.",
    base: 9.99,
    unit: "/per month",
    note: "Save 20% with team rate.",
    cols: BASIC_COLS,
    cta: "Start 14 days trial",
    head: "border",
  },
  {
    name: "Standard",
    icon: "/figma/pricing/icon-standard.svg",
    blurb: "Perfect for fast-paced teams looking to automate and organize.",
    base: 14.99,
    unit: "/per month",
    note: "Save 20% with team rate.",
    cols: STANDARD_COLS,
    cta: "Start 14 days trial",
    head: "border",
  },
  {
    name: "Pro",
    icon: "/figma/pricing/icon-pro.svg",
    blurb: "Unlock the full LoadHunter experience with automation, insights, and control.",
    base: 29.99,
    unit: "/per month",
    note: "Best value for 10+ dispatchers.",
    cols: PRO_COLS,
    cta: "Start 14 days trial",
    head: "pro",
    recommended: true,
  },
  {
    name: "AI subscription",
    icon: "/figma/pricing/icon-ai.png",
    blurb:
      "Our comprehensive enterprise solution comes fully equipped with all the professional features.",
    price: "Let's talk",
    note: "Best value for 20+ dispatchers.",
    cols: PRO_COLS,
    cta: "Add to wishlist",
    head: "ai",
  },
]

function FeatureRow({ text, clock }: { text: string; clock?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 ${clock ? "opacity-50" : ""}`}>
      <img
        src={clock ? "/figma/pricing/clock.svg" : "/figma/pricing/check.svg"}
        alt=""
        loading="lazy"
        decoding="async"
        data-spin={clock ? "" : undefined}
        data-no-reveal={clock ? "" : undefined}
        className={clock ? "mt-[2px] h-3 w-3" : "mt-[5px] h-2 w-3"}
      />
      <span className="whitespace-pre-line text-[12px] leading-[16px] tracking-[-0.02em] text-gray-50">
        {text}
      </span>
    </div>
  )
}

function PlanCard({ plan, priceText }: { plan: Plan; priceText: string }) {
  const headStyle =
    plan.head === "pro"
      ? {
          backgroundImage:
            "radial-gradient(ellipse 320px 360px at 6px 7px, rgba(53,50,70,1) 0%, rgba(53,50,70,0) 100%)",
        }
      : plan.head === "ai"
        ? {
            backgroundImage:
              "radial-gradient(220px 260px at 80% 90%, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)",
          }
        : {}

  return (
    <article
      data-card
      className="overflow-hidden rounded-2xl border border-[rgba(229,229,229,0.1)] p-[3px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
      style={{ backgroundImage: "linear-gradient(to bottom, #181a1f, rgba(24,26,31,0))" }}
    >
      {/* head panel */}
      <div className="relative rounded-xl p-5" style={headStyle}>
        {plan.head === "border" && (
          <div className="pointer-events-none absolute inset-0 rounded-xl border border-[rgba(229,229,229,0.2)]" />
        )}
        <div className="flex items-start gap-4">
          <div className="size-14 shrink-0">
            <Img src={plan.icon} alt="" loading="lazy" decoding="async" className="w-[72px] max-w-none -translate-x-2 -translate-y-1" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[19px] font-medium leading-[26px] tracking-[-0.03em] text-gray-50">
                {plan.name}
              </span>
              {plan.recommended && (
                <span className="flex h-6 items-center gap-1.5 rounded-full bg-[rgba(232,232,232,0.1)] px-2.5">
                  <img
                    src="/figma/pricing/crown.svg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-[13px] w-[11px]"
                  />
                  <span className="text-[11px] leading-[13px] text-gray-50">Recommended</span>
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[12px] leading-[16px] tracking-[-0.02em] text-gray-50/90">
              {plan.blurb}
            </p>
          </div>
        </div>
        <div className="my-4 h-px bg-[rgba(229,229,229,0.1)]" />
        <div className="flex items-baseline gap-2.5">
          <span className="text-[28px] font-medium leading-[36px] tracking-[-0.04em] text-gray-50">
            {priceText}
          </span>
          {plan.unit && <span className="text-[12px] text-[#a2a2a2]">{plan.unit}</span>}
        </div>
        <p className="mt-1 text-[12px] text-[#a2a2a2]">{plan.note}</p>
      </div>

      {/* feature list — two compact columns, same as the desktop card */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-5">
        {plan.cols.map((col, ci) => (
          <div key={ci} className="flex min-w-0 flex-col gap-3">
            {col.map((item, i) => (
              <FeatureRow key={i} text={item.text} clock={item.clock} />
            ))}
          </div>
        ))}
      </div>

      {/* CTA — 48px touch target */}
      <button
        type="button"
        className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl border border-[rgba(232,232,232,0.2)] transition-transform active:scale-[0.99]"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[11px] bg-[rgba(0,0,0,0.1)]" />
        <span
          className="pointer-events-none absolute inset-0 rounded-[11px]"
          style={{
            backgroundImage:
              "radial-gradient(70% 160% at 50% 115%, rgba(111,81,151,0.55) 0%, rgba(111,81,151,0) 100%)",
          }}
        />
        <span className="relative text-[14px] font-medium tracking-[-0.01em] text-gray-50">
          {plan.cta}
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-[11px] shadow-[inset_0px_0px_24px_0px_rgba(255,255,255,0.18)]" />
      </button>
    </article>
  )
}

function DiscountBadge({ text, active }: { text: string; active: boolean }) {
  return (
    <span
      className={`flex items-center rounded-full border border-[rgba(232,232,232,0.75)] px-2 py-0.5 text-[12px] text-white transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-50"
      }`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
        boxShadow: active ? PILL_SHADOW : undefined,
      }}
    >
      {text}
    </span>
  )
}

/**
 * Mobile Pricing: same loadhunter.io price logic as desktop, with the drag
 * slider replaced by a stepper (48px − / + buttons — the touch-canonical
 * control for a discrete count) and the billing toggle at 44px height.
 * Cards stack vertically.
 */
export function MobilePricing() {
  const [annual, setAnnual] = useState(true)
  const [n, setN] = useState(1)

  const priceFor = (plan: Plan) =>
    plan.base != null ? `From $${planTotal(plan.base, n, annual).toFixed(2)}` : (plan.price ?? "")

  return (
    <section id="pricing" className="bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/pricing/header-icon.svg"
          title={<>Choose the plans that&rsquo;s perfect for your business</>}
          sub="Enjoy a 10% annual discount, plus save an extra 10% with 3 users — and unlock 20% off starting at 4 users!"
        />

        {/* billing toggle */}
        <div
          data-no-reveal
          className="mx-auto mt-8 flex h-[52px] w-fit items-center gap-2 rounded-full bg-[rgba(231,231,231,0.1)] p-1.5 shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
        >
          {(["Monthly", "Annually"] as const).map((label) => {
            const isAnnually = label === "Annually"
            const active = isAnnually === annual
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setAnnual(isAnnually)}
                className={`flex h-11 items-center justify-center gap-2 rounded-full px-4 transition-all ${
                  active ? "border border-white backdrop-blur-[10px]" : ""
                }`}
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
                <span className="text-[14px] font-medium tracking-[-0.01em] text-white">
                  {label}
                </span>
                {isAnnually && (
                  <span
                    className="flex items-center rounded-full border border-white px-1.5 py-0.5 text-[11px] leading-[13px] text-white"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
                    }}
                  >
                    save up -10%
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* dispatcher stepper */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Fewer dispatchers"
              onClick={() => setN((v) => Math.max(1, v - 1))}
              disabled={n <= 1}
              className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-[rgba(231,231,231,0.1)] text-[22px] leading-none text-white transition-opacity disabled:opacity-35"
            >
              −
            </button>
            <span
              aria-live="polite"
              className="min-w-[130px] text-center text-[16px] font-medium tracking-[-0.01em] text-white"
            >
              {n} {n === 1 ? "dispatcher" : "dispatchers"}
            </span>
            <button
              type="button"
              aria-label="More dispatchers"
              onClick={() => setN((v) => Math.min(50, v + 1))}
              disabled={n >= 50}
              className="flex size-12 items-center justify-center rounded-full border border-line-strong bg-[rgba(231,231,231,0.1)] text-[22px] leading-none text-white transition-opacity disabled:opacity-35"
            >
              +
            </button>
          </div>
          <div className="flex items-center gap-3">
            <DiscountBadge text="-10% OFF" active={n >= 3} />
            <DiscountBadge text="-20% OFF" active={n >= 4} />
          </div>
        </div>

        {/* plan cards */}
        <div className="mt-10 flex flex-col gap-5">
          {PLANS.map((plan) => (
            <PlanCard key={plan.name} plan={plan} priceText={priceFor(plan)} />
          ))}
        </div>
      </Container>
    </section>
  )
}
