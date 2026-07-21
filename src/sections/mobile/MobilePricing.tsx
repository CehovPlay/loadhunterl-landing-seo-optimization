import { useCallback, useLayoutEffect, useRef, useState } from "react"
import { Img } from "@/components/site/Img"
import {
  CellCheck,
  CellClock,
  CellDash,
  MATRIX,
  PLAN_DEFS,
  type CellValue,
  type PlanDef,
} from "@/sections/planMatrix"
import { countToKnob, knobToCount, planTotal } from "@/sections/pricingLogic"
import { Container, PILL_SHADOW, SectionHeader } from "./ui"

type Price = { main: string; unit?: string; note: string }

/* full-card background: the plan accent gradient layered over the shared
   dark card gradient, so pro/ai washes reach under the CTA too */
function cardStyle(plan: PlanDef): React.CSSProperties {
  const base = "linear-gradient(to bottom, var(--color-gray-800), rgba(24,26,31,0))"
  const accent =
    plan.accent === "pro"
      ? "radial-gradient(ellipse 420px 500px at 6px 7px, rgba(53,50,70,1) 0%, rgba(53,50,70,0) 100%), "
      : plan.accent === "ai"
        ? "radial-gradient(130% 100% at 85% 80%, rgba(111,81,151,0.95) 0%, rgba(111,81,151,0) 100%), "
        : ""
  return { backgroundImage: accent + base }
}

function PlanIdentity({ plan }: { plan: PlanDef }) {
  // icon-ai is a PNG with a baked dark square around the rounded plate — the
  // SVG icons are transparent. Crop the PNG to the plate so no bg shows.
  const cropped = plan.icon.endsWith(".png")
  return (
    <div className="flex items-center gap-3">
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
              ? "absolute left-[-7.5px] top-[-3px] h-[63px] w-[63px] max-w-none"
              : "h-[62px] w-[62px] max-w-none -translate-x-2 -translate-y-1"
          }
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="whitespace-nowrap text-[18px] font-medium leading-[24px] tracking-[-0.72px] text-gray-50">
          {plan.name}
        </h3>
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
    </div>
  )
}

function PlanPrice({ price }: { price: Price }) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span
          key={price.main}
          className="lh-pop whitespace-nowrap text-[26px] font-medium leading-[32px] tracking-[-1.04px] text-gray-50"
        >
          {price.main}
        </span>
        {price.unit && (
          <span className="whitespace-nowrap text-[12px] text-ink-3">{price.unit}</span>
        )}
      </div>
      <p className="mt-1 text-[12px] text-ink-3">{price.note}</p>
    </div>
  )
}

function PlanCta({ plan }: { plan: PlanDef }) {
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

function ValueCell({ value }: { value: CellValue }) {
  if (value === true) return <CellCheck />
  if (value === null) return <CellDash />
  // css spin: these cells re-mount on plan switch, after initMicro's scan
  if (value === "soon") return <CellClock css />
  return (
    <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
      {value}
    </span>
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
 * Flow-layout Pricing — the desktop compare table (Figma 1247:10) reflowed as
 * a plan selector: swipeable plan tabs on top, then the selected plan's
 * header (identity → price → CTA) and its full grouped feature column from
 * the shared MATRIX. Prices stay live from the billing toggle + dispatcher
 * slider above; Pro is preselected as the recommended plan.
 */
export function MobilePricing() {
  const [annual, setAnnual] = useState(true)
  const [selected, setSelected] = useState(
    PLAN_DEFS.findIndex((p) => p.recommended),
  )
  const plan = PLAN_DEFS[selected]

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

  // keyboard support for the slider: arrows ±1, PageUp/Down ±10, Home/End clamp
  const stepTo = useCallback(
    (count: number) => {
      if (!trackW) return
      setFrac(countToKnob(count, zones) / trackW)
    },
    [trackW, zones],
  )
  const onSliderKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const k = e.key
      let next: number | null = null
      if (k === "ArrowLeft" || k === "ArrowDown") next = n - 1
      else if (k === "ArrowRight" || k === "ArrowUp") next = n + 1
      else if (k === "PageDown") next = n - 10
      else if (k === "PageUp") next = n + 10
      else if (k === "Home") next = 1
      else if (k === "End") next = 50
      if (next != null) {
        e.preventDefault()
        stepTo(Math.min(50, Math.max(1, next)))
      }
    },
    [n, stepTo],
  )

  /* Same presentation as the desktop table, mirroring PROD loadhunter.io:
   * the big figure is the monthly TEAM TOTAL, "/ month, billed yearly" on
   * annual, with the static plan note underneath. */
  const priceFor = (p: PlanDef): Price => {
    if (p.base == null) return { main: p.price ?? "", unit: p.unit, note: p.note }
    return {
      main: `$${planTotal(p.base, n, annual).toFixed(2)}`,
      unit: `/ month${annual ? ", billed yearly" : ""}`,
      note: p.note,
    }
  }

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
                    className="flex h-[28px] items-center whitespace-nowrap rounded-full border border-[rgba(232,232,232,0.75)] px-2.5 text-[12px] leading-[13px] text-white"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
                    }}
                  >
                    {/* full label wraps to two lines inside the pill at 320 */}
                    <span className="hidden min-[360px]:inline">save up to 10%</span>
                    <span className="min-[360px]:hidden">−10%</span>
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
            onKeyDown={onSliderKeyDown}
            role="slider"
            tabIndex={0}
            aria-label="Number of dispatchers"
            aria-valuemin={1}
            aria-valuemax={50}
            aria-valuenow={n}
            aria-valuetext={`${n} ${n === 1 ? "dispatcher" : "dispatchers"}`}
            className="relative mt-3.5 h-4 w-full cursor-pointer touch-none rounded-full bg-[rgba(231,231,231,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-violet-400)]"
          >
            <div
              className="absolute left-[2px] top-[2px] h-3 rounded-lg bg-violet shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_0px_rgba(255,255,255,0.35)]"
              style={{ width: `max(12px, calc(${frac * 100}% - 2px))` }}
            />
            {/* plain white knob per the mobile Figma (no glow art) */}
            <div
              className="absolute top-[-3px] size-[22px] cursor-grab rounded-full bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.35)] active:cursor-grabbing"
              style={{ left: `calc(${frac * 100}% - 11px)` }}
            />
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

        {/* plan selector tabs — swipeable row, active tab mirrors the billing
            toggle's active pill */}
        <div data-no-reveal className="lh-snap -mx-5 mt-10 flex gap-2 overflow-x-auto px-5">
          {PLAN_DEFS.map((p, i) => {
            const active = selected === i
            return (
              <button
                key={p.name}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(i)}
                className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 transition-all ${
                  active
                    ? "border-white backdrop-blur-[10px]"
                    : "border-[rgba(232,232,232,0.2)]"
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
                {p.recommended && (
                  <img
                    src="/figma/pricing/crown.svg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-[13px] w-[11px]"
                  />
                )}
                <span className="whitespace-nowrap text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
                  {p.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* selected plan panel — head (identity → price → CTA) + the plan's
            column of the shared feature matrix, grouped like the desktop table */}
        <article
          data-no-reveal
          className="mt-4 overflow-hidden rounded-2xl border border-[rgba(229,229,229,0.1)] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
          style={cardStyle(plan)}
        >
          <div className="p-5">
            <PlanIdentity plan={plan} />
            <div className="my-4 h-px bg-[rgba(229,229,229,0.1)]" />
            <PlanPrice price={priceFor(plan)} />
          </div>
          <div className="px-3">
            <PlanCta plan={plan} />
          </div>

          <div className="px-5 pb-5">
            {MATRIX.map((group) => (
              <div key={group.title}>
                <p className="pb-2 pt-6 text-[11px] font-medium uppercase leading-[14px] tracking-[-0.44px] text-ink-3">
                  {group.title}
                </p>
                {/* tablet: rows flow into two columns */}
                <div className="">
                  {group.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex min-h-10 items-center justify-between gap-4 border-b border-[rgba(229,229,229,0.07)]"
                    >
                      <span className="text-[13px] font-medium leading-[16px] tracking-[-0.52px] text-gray-50">
                        {r.label}
                      </span>
                      <ValueCell value={r.values[selected]} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </Container>
    </section>
  )
}
