import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Img } from "@/components/site/Img"
import { BASIC_COLS, PRO_COLS, STANDARD_COLS, type FeatureCols } from "@/sections/pricingFeatures"
import { knobToCount, planTotal } from "@/sections/pricingLogic"
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
    cta: "Start 14-day free trial",
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
    cta: "Start 14-day free trial",
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
    cta: "Start 14-day free trial",
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
      <span className="whitespace-pre-line text-[12px] font-medium leading-[15px] tracking-[-0.48px] text-gray-50">
        {text}
      </span>
    </div>
  )
}

/* full-card background: the plan accent gradient layered over the shared
   dark card gradient, so pro/ai washes reach under the CTA too */
function cardStyle(plan: Plan): React.CSSProperties {
  const base = "linear-gradient(to bottom, #181a1f, rgba(24,26,31,0))"
  const accent =
    plan.head === "pro"
      ? "radial-gradient(ellipse 420px 500px at 6px 7px, rgba(53,50,70,1) 0%, rgba(53,50,70,0) 100%), "
      : plan.head === "ai"
        ? "radial-gradient(130% 100% at 85% 80%, rgba(111,81,151,0.95) 0%, rgba(111,81,151,0) 100%), "
        : ""
  return { backgroundImage: accent + base }
}

function PlanIdentity({ plan, stacked = false }: { plan: Plan; stacked?: boolean }) {
  // icon-ai is a PNG with a baked dark square around the rounded plate — the
  // SVG icons are transparent. Crop the PNG to the plate so no bg shows.
  const cropped = plan.icon.endsWith(".png")
  return (
    <div className={stacked ? "flex flex-col items-start gap-3" : "flex items-start gap-3"}>
      <div
        className={`relative size-12 shrink-0 ${cropped ? "overflow-hidden rounded-[11px]" : ""}`}
      >
        <Img
          src={plan.icon}
          alt=""
          loading="lazy"
          decoding="async"
          className={
            cropped
              ? "absolute left-[-7.5px] top-[-3px] w-[63px] max-w-none"
              : "w-[62px] max-w-none -translate-x-2 -translate-y-1"
          }
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="whitespace-nowrap text-[18px] font-medium leading-[24px] tracking-[-0.72px] text-gray-50">
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
              <span className="whitespace-nowrap text-[11px] leading-[13px] text-gray-50">
                Recommended
              </span>
            </span>
          )}
        </div>
        <p className="mt-1 text-[12px] font-medium leading-[15px] tracking-[-0.48px] text-gray-50/90">
          {plan.blurb}
        </p>
      </div>
    </div>
  )
}

function PlanPrice({ plan, priceText }: { plan: Plan; priceText: string }) {
  return (
    <div>
      <div className="flex items-baseline gap-2.5">
        <span
          key={priceText}
          className="lh-pop whitespace-nowrap text-[26px] font-medium leading-[32px] tracking-[-1.04px] text-gray-50"
        >
          {priceText}
        </span>
        {plan.unit && (
          <span className="whitespace-nowrap text-[12px] text-[#a2a2a2]">{plan.unit}</span>
        )}
      </div>
      <p className="mt-1 whitespace-nowrap text-[12px] text-[#a2a2a2]">{plan.note}</p>
    </div>
  )
}

function PlanFeatures({ plan }: { plan: Plan }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      {plan.cols.map((col, ci) => (
        <div key={ci} className="flex min-w-0 flex-col gap-3">
          {col.map((item, i) => (
            <FeatureRow key={i} text={item.text} clock={item.clock} />
          ))}
        </div>
      ))}
    </div>
  )
}

function PlanCta({ plan }: { plan: Plan }) {
  return (
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
      <span className="relative whitespace-nowrap text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-gray-50">
        {plan.cta}
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-[11px] shadow-[inset_0px_0px_24px_0px_rgba(255,255,255,0.18)]" />
    </button>
  )
}

const cardShell =
  "overflow-hidden rounded-2xl border border-[rgba(229,229,229,0.1)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"

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
 * Mobile/tablet Pricing — the Figma accordion structure (921:88128 tablet /
 * 942:110506 phone): the first plan is open by default; opening another plan
 * closes the previous one.
 *  - phone: vertical accordion — every card keeps its head (identity, price)
 *    and CTA visible; the feature grid expands in between
 *  - tablet: horizontal accordion — the open plan takes the row, the others
 *    collapse into narrow clipped strips
 * Prices stay live from the billing toggle + dispatcher stepper above.
 */
export function MobilePricing() {
  const [annual, setAnnual] = useState(true)
  const [open, setOpen] = useState(0)

  /* phone: the accordion is scroll-driven, no tap needed — the card entering
     the viewport opens its features, and since the accordion is exclusive the
     card scrolling out above closes. Active = the LAST card whose top has
     crossed the gate line; height changes from open/close only ever push the
     other cards further past their side of the gate, so it can't oscillate. */
  const phoneListRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const list = phoneListRef.current
    if (!list) return
    const phone = window.matchMedia("(max-width: 767px)")
    let raf = 0
    const pick = () => {
      raf = 0
      if (!phone.matches) return
      const gate = window.innerHeight * 0.8
      let active = 0
      Array.from(list.children).forEach((card, i) => {
        if (card.getBoundingClientRect().top < gate) active = i
      })
      setOpen(active)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* dispatcher slider — desktop logic (pricingLogic.knobToCount) with the
     desktop zones expressed as fractions of the responsive track */
  const trackRef = useRef<HTMLDivElement>(null)
  const [trackW, setTrackW] = useState(0)
  const [frac, setFrac] = useState(0.013) // knob at min → 1 dispatcher

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => setTrackW(track.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    return () => ro.disconnect()
  }, [])

  const zones = {
    min: 0.013 * trackW,
    at3: 0.32 * trackW,
    at4: 0.588 * trackW,
    max: 0.987 * trackW,
  }
  const n = trackW ? knobToCount(frac * trackW, zones) : 1

  const moveTo = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const r = track.getBoundingClientRect()
    const f = Math.min(0.987, Math.max(0.013, (clientX - r.left) / r.width))
    setFrac(f)
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
    plan.base != null ? `From $${planTotal(plan.base, n, annual).toFixed(2)}` : (plan.price ?? "")

  return (
    <section id="pricing" className="bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/pricing/header-icon.svg"
          title={<>Choose the plan that&rsquo;s perfect for your business</>}
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
                className={`flex h-11 items-center justify-center gap-2 rounded-full transition-all ${
                  isAnnually ? "pl-4 pr-[7px]" : "px-4"
                } ${active ? "border border-white backdrop-blur-[10px]" : ""}`}
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
                <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
                  {label}
                </span>
                {isAnnually && (
                  <span
                    className="flex h-[28px] items-center rounded-full border border-white px-2.5 text-[11px] leading-[13px] text-white"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
                    }}
                  >
                    save up to 10%
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* dispatcher slider — same control as desktop */}
        <div className="mt-8 w-full select-none">
          <p
            className="w-[130px] whitespace-nowrap text-center text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white"
            aria-live="polite"
            style={{
              marginLeft: `clamp(0px, calc(${frac * 100}% - 65px), calc(100% - 130px))`,
            }}
          >
            {n} {n === 1 ? "dispatcher" : "dispatchers"}
          </p>
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            role="slider"
            aria-label="Number of dispatchers"
            aria-valuemin={1}
            aria-valuemax={50}
            aria-valuenow={n}
            className="relative mt-3.5 h-4 w-full cursor-pointer touch-none rounded-[200px] bg-[rgba(231,231,231,0.1)]"
          >
            <div
              className="absolute left-[2px] top-[2px] h-3 rounded-lg bg-[#6f5197] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_0px_rgba(255,255,255,0.35)]"
              style={{ width: `max(12px, calc(${frac * 100}% - 2px))` }}
            />
            <div
              className="absolute top-[-3px] size-[22px] cursor-grab active:cursor-grabbing"
              style={{ left: `calc(${frac * 100}% - 11px)` }}
            >
              <img
                loading="lazy"
                decoding="async"
                src="/figma/pricing/knob.svg"
                alt=""
                draggable={false}
                className="absolute max-w-none"
                style={{ left: -9.43, top: -4.71, width: 40.86, height: 40.86 }}
              />
            </div>
          </div>
          <div className="relative mt-3.5 h-[26px]">
            <div className="absolute left-[28%] -translate-x-1/2">
              <DiscountBadge text="-10% OFF" active={n >= 3} />
            </div>
            <div className="absolute left-[55%] -translate-x-1/2">
              <DiscountBadge text="-20% OFF" active={n >= 4} />
            </div>
          </div>
        </div>

        {/* phone: vertical exclusive accordion, scroll-driven (see effect above) */}
        <div ref={phoneListRef} className="mt-10 flex flex-col gap-4 md:hidden">
          {PLANS.map((plan, i) => {
            const expanded = open === i
            return (
              <article
                key={plan.name}
                data-no-reveal
                onClick={() => setOpen(i)}
                className={`${cardShell} cursor-pointer`}
                style={cardStyle(plan)}
              >
                {/* head — identity + price (Figma 942:110506: the whole card
                    toggles, no chevron; head content is always visible) */}
                <button
                  type="button"
                  aria-expanded={expanded}
                  className="relative w-full p-5 pb-0 text-left"
                >
                  <PlanIdentity plan={plan} stacked />
                  <div className="my-4 h-px bg-[rgba(229,229,229,0.1)]" />
                  <PlanPrice plan={plan} priceText={priceFor(plan)} />
                </button>
                {/* features expand between the price and the CTA */}
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pt-5">
                      <PlanFeatures plan={plan} />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <PlanCta plan={plan} />
                </div>
              </article>
            )
          })}
        </div>

        {/* tablet: horizontal exclusive accordion — open plan takes the row,
            the rest collapse to clipped strips */}
        <div className="mt-10 hidden gap-3 md:flex lg:hidden">
          {PLANS.map((plan, i) => {
            const expanded = open === i
            return (
              <article
                key={plan.name}
                data-no-reveal
                onClick={() => setOpen(i)}
                aria-expanded={expanded}
                className={`${cardShell} relative min-w-0 cursor-pointer transition-[flex-grow] duration-500 ease-out`}
                style={{
                  ...cardStyle(plan),
                  flexBasis: expanded ? 0 : 76,
                  flexGrow: expanded ? 1 : 0,
                  flexShrink: 0,
                }}
              >
                {/* inner spans the card when open; keeps min width so the
                    collapsed strip clips instead of squishing */}
                <div className="flex h-full w-full min-w-[416px] flex-col">
                  <div className="relative m-[3px] rounded-xl p-5">
                    <PlanIdentity plan={plan} />
                    <div className="my-4 h-px bg-[rgba(229,229,229,0.1)]" />
                    <PlanPrice plan={plan} priceText={priceFor(plan)} />
                  </div>
                  <div
                    className={`flex-1 px-6 py-4 transition-opacity duration-300 ${
                      expanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <PlanFeatures plan={plan} />
                  </div>
                  <div className="p-[3px]">
                    <PlanCta plan={plan} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* laptop: all four plans expanded side by side, like desktop */}
        <div className="mt-12 hidden gap-5 lg:grid lg:grid-cols-4">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              data-card
              className={`${cardShell} flex flex-col`}
              style={cardStyle(plan)}
            >
              <div className="p-5">
                <PlanIdentity plan={plan} stacked />
                <div className="my-4 h-px bg-[rgba(229,229,229,0.1)]" />
                <PlanPrice plan={plan} priceText={priceFor(plan)} />
              </div>
              <div className="flex-1 px-5 pb-2">
                <PlanFeatures plan={plan} />
              </div>
              <div className="p-3">
                <PlanCta plan={plan} />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
