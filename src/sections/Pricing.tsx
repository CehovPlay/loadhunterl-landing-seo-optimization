import { Img } from "@/components/site/Img"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  CellCheck,
  CellClock,
  CellDash,
  MATRIX,
  PLAN_DEFS,
  type CellValue,
  type PlanDef,
} from "@/sections/planMatrix"
import { planTotal } from "@/sections/pricingLogic"
import { PRICING_COPY } from "@/content/copy"
import { track } from "@/lib/analytics"

const PILL_SHADOW = "var(--shadow-pill)"

type Price = { main: string; unit?: string; note: string }

function DiscountBadge({ text, shadow = true }: { text: string; shadow?: boolean }) {
  return (
    <div
      className="flex items-center rounded-full border border-[rgba(232,232,232,0.75)] px-[6px] py-[1px]"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
        boxShadow: shadow ? PILL_SHADOW : undefined,
      }}
    >
      <span className="text-[12px] leading-[14px] tracking-[-0.48px] text-white">{text}</span>
    </div>
  )
}

function Cell({ value }: { value: CellValue }) {
  if (value === true) return <CellCheck />
  if (value === null) return <CellDash />
  if (value === "soon") return <CellClock />
  return (
    <span className="relative -top-px whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
      {value}
    </span>
  )
}

/* Compare-table header cell (Figma 1248:2): icon → name → price → note.
 * Prices stay live from the toggle + slider above; per prod loadhunter.io the
 * figure is the TEAM TOTAL per month. CTAs live in the table's footer row. */
function HeaderCell({ plan, price }: { plan: PlanDef; price: Price }) {
  const cropped = plan.icon.includes("icon-ai")
  return (
    <div className="flex h-full w-[260px] flex-col items-center gap-[12px] px-[20px] pb-[20px] pt-[20px]">
      {/* icon — the 64px plate art scaled to the table's 40px plate; the AI png
          carries a baked dark square, crop it to the rounded plate */}
      <div className={`relative size-[40px] shrink-0 ${cropped ? "overflow-hidden rounded-[10px]" : ""}`}>
        <Img
          src={plan.icon}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute max-w-none"
          style={{ left: -6.25, top: -2.5, width: 52.5, height: 52.5 }}
        />
      </div>
      {/* name + badge */}
      <div className="flex items-center gap-[8px]">
        <span className="whitespace-nowrap text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-gray-50">
          {plan.name}
        </span>
        {plan.recommended && (
          <span className="flex items-center rounded-full bg-[rgba(232,232,232,0.1)] px-[10px] py-[2px]">
            <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
              Recommended
            </span>
          </span>
        )}
      </div>
      {/* price — team total per month, prod-style */}
      <div className="flex items-baseline gap-[6px]">
        <span
          key={price.main}
          className="lh-pop whitespace-nowrap text-[20px] font-medium leading-[28px] tracking-[-0.8px] text-gray-50"
        >
          {price.main}
        </span>
        {price.unit && (
          <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-3">
            {price.unit}
          </span>
        )}
      </div>
      <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-3">
        {price.note}
      </span>
      {/* LH-038 — who each plan is for, so the difference is readable without
          scanning the whole matrix */}
      <span className="text-center text-[12px] font-medium leading-[16px] tracking-[-0.02em] text-violet-300">
        {plan.bestFit}
      </span>
    </div>
  )
}

/* Footer CTA — the plan deck's original 42px button, one per column at the
 * very bottom of the table; violet glow floods up from the bottom on hover */
function FooterCta({ plan }: { plan: PlanDef }) {
  return (
    <a
      href={plan.ctaHref}
      target="_blank"
      rel="noopener"
      onClick={() => track("plan_trial_click", { plan: plan.name })}
      className="group relative flex h-[42px] w-full items-center justify-center overflow-hidden rounded-lg border border-[rgba(232,232,232,0.2)] shadow-[0px_6px_10px_0px_rgba(80,50,15,0.1)] transition-[border-color,box-shadow] duration-300 hover:border-[rgba(232,232,232,0.45)] hover:shadow-[0px_10px_28px_-6px_rgba(111,81,151,0.5)]"
    >
      <span className="pointer-events-none absolute inset-0 rounded-[11px] bg-[rgba(0,0,0,0.1)]" />
      <span
        className="pointer-events-none absolute inset-0 rounded-[11px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(70% 160% at 50% 115%, rgba(111,81,151,0.95) 0%, rgba(111,81,151,0) 100%)",
        }}
      />
      <span className="relative whitespace-nowrap text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-gray-50 transition-transform duration-300 group-hover:-translate-y-[1px]">
        {plan.cta}
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-[11px] shadow-[inset_0px_0px_24px_0px_rgba(255,255,255,0.25)]" />
    </a>
  )
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

  // LH-066 — one debounced event per settled dispatcher count, not per frame
  const lastN = useRef(n)
  useEffect(() => {
    if (lastN.current === n) return
    const t = setTimeout(() => {
      lastN.current = n
      track("dispatcher_count_change", { count: n })
    }, 500)
    return () => clearTimeout(t)
  }, [n])


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

  /* Price presentation mirrors PROD loadhunter.io: the big figure is the
   * monthly TEAM TOTAL from planTotal(), "/ month, billed yearly" on annual;
   * the static plan note stays underneath (Figma 1247:10). */
  const priceFor = (plan: PlanDef): Price => {
    if (plan.base == null) return { main: plan.price ?? "", unit: plan.unit, note: plan.note }
    return {
      main: `$${planTotal(plan.base, n, annual).toFixed(2)}`,
      unit: `/ month${annual ? ", billed yearly" : ""}`,
      note: plan.note,
    }
  }

  return (
    <section id="pricing" className="relative h-[2652px] bg-gray-800 [content-visibility:auto] [contain-intrinsic-size:1920px_2652px]">
      {/* header icon */}
      <div data-float className="absolute left-[928px] top-[120px] size-[64px]">
        <img loading="lazy" decoding="async" src="/figma/pricing/header-icon.png" alt="" className="absolute left-[-10px] top-[-4px] h-[84px] w-[84px] max-w-none" />
      </div>

      {/* heading */}
      {/* LH-036 / SEO-019 */}
      <h2 className="absolute left-[442px] top-[244px] w-[1036px] text-center text-[44px] font-medium leading-[52px] tracking-[-0.03em] text-white">
        {PRICING_COPY.h2}
      </h2>
      <p className="absolute left-[510px] top-[314px] w-[900px] text-center text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[rgba(255,255,255,0.65)]">
        {PRICING_COPY.lead}
      </p>
      {/* LH-037 / COPYQA-020 — the discount rules in plain language */}
      <p className="absolute left-[510px] top-[360px] w-[900px] text-center text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[rgba(255,255,255,0.5)]">
        {PRICING_COPY.discountNote}
      </p>

      {/* billing toggle — Figma 1206:100899: container p-6/gap-12 on a
          rgba(231,231,231,0.1) pill with inset shadow; buttons h-28 px-12;
          the active pill gets a white border + bottom violet radial, and
          Annually carries the "save up -10%" badge inside (pr-4, gap-8);
          excluded from the scroll-reveal cascade */}
      <div
        data-no-reveal
        className="absolute left-[832.5px] top-[398px] flex h-[40px] items-center gap-[12px] rounded-full bg-[rgba(231,231,231,0.1)] p-[6px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
      >
        {(["Monthly", "Annually"] as const).map((label) => {
          const active = (label === "Annually") === annual
          const isAnnually = label === "Annually"
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setAnnual(isAnnually)
                track("pricing_toggle", { billing: isAnnually ? "annual" : "monthly" })
              }}
              className={
                "flex h-[28px] items-center justify-center gap-[8px] rounded-full py-[4px] transition-all " +
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
                  className="flex items-center rounded-full border border-[rgba(232,232,232,0.75)] px-[6px] py-[1px]"
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
      <div className="absolute left-[536px] top-[462px] w-[848px] select-none">
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
          aria-valuemax={50}
          aria-valuenow={n}
          className="relative mt-[14px] h-[16px] w-full cursor-pointer rounded-full bg-[rgba(231,231,231,0.1)]"
        >
          <div
            className="absolute left-[2px] top-[2px] h-[12px] rounded-md bg-violet shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_0px_rgba(255,255,255,0.35)]"
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

      {/* compare table (Figma 1247:10) — one 1680px table replaces the old
          freemium strip + plan deck: label column 372px + five 260px plan
          columns; header row 240px, group headers 54px, feature rows 24px.
          data-card → the reveal cascade fades the table in as ONE block
          instead of tweening ~250 cells individually.

          The padding is 3px, NOT 4: the 1680px box is border-box and carries a
          1px border, so the row grid (372 + 5×260 = 1672) only fits with 3px of
          padding. With 4px it overflowed by 2px, and since flex items shrink by
          default every column silently became 259.69px wide — the columns then
          drifted up to 2px off the Pro highlight, which is absolutely positioned
          and does NOT shrink (its CTA sat 6.6/9.4px off-centre). Keep these five
          numbers adding up if any of them ever changes. */}
      <div
        data-card
        className="absolute left-[120px] top-[664px] w-[1680px] rounded-2xl border border-[rgba(229,229,229,0.1)] p-[3px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        style={{ backgroundImage: "linear-gradient(to bottom, var(--color-gray-800), rgba(24,26,31,0))" }}
      >
        {/* Pro column highlight — full-height violet wash under the column.
            left = padding (3) + label column (372) + three 260px columns; the
            1px overhang top/bottom into the padding is intentional. */}
        <div className="pointer-events-none absolute bottom-[2px] left-[1155px] top-[2px] w-[260px] rounded-xl border border-[rgba(111,81,151,0.35)] bg-[rgba(111,81,151,0.06)]" />

        {/* header row */}
        <div className="relative flex h-[192px] items-end border-b border-[rgba(229,229,229,0.1)]">
          <div className="w-[372px] pb-[20px] pl-[20px]">
            <span className="text-[11px] font-medium uppercase leading-[14px] tracking-[-0.44px] text-ink-3">
              Features
            </span>
          </div>
          {PLAN_DEFS.map((plan) => (
            <HeaderCell key={plan.name} plan={plan} price={priceFor(plan)} />
          ))}
        </div>

        {/* feature groups */}
        {MATRIX.map((group) => (
          <div key={group.title} className="relative">
            <div className="border-b border-[rgba(229,229,229,0.1)] py-[20px] pl-[20px]">
              <span className="text-[11px] font-medium uppercase leading-[14px] tracking-[-0.44px] text-ink-3">
                {group.title}
              </span>
            </div>
            {group.rows.map((r) => (
              <div
                key={r.label}
                className="flex h-[32px] items-center border-b border-[rgba(229,229,229,0.07)] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
              >
                {/* -top-px: Inter's glyphs sit low in their line box — without
                    the nudge every row label reads slightly below the row's
                    optical centre next to the centred check marks */}
                <div className="w-[372px] pl-[20px]">
                  <span className="relative -top-px whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
                    {r.label}
                  </span>
                </div>
                {r.values.map((v, i) => (
                  <div key={i} className="flex w-[260px] items-center justify-center">
                    <Cell value={v} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* footer CTA row — one 42px button per plan column */}
        <div className="relative flex items-center py-[8px]">
          <div className="w-[372px]" />
          {PLAN_DEFS.map((plan) => (
            <div key={plan.name} className="w-[260px] px-[8px]">
              <FooterCta plan={plan} />
            </div>
          ))}
        </div>
      </div>

      {/* LH-041 — one legal-safe trial/cancellation note for the whole section,
          not repeated inside every card */}
      <p className="absolute left-[510px] top-[2560px] w-[900px] text-center text-[13px] font-medium leading-[19px] tracking-[-0.01em] text-[rgba(255,255,255,0.5)]">
        {PRICING_COPY.riskReversal}
      </p>
    </section>
  )
}
