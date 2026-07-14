/**
 * Tablet (768) — bottom region. Figma: Group 2085665211 (921:86998),
 * page y 12210–19032 (h=6822). Stacked sub-blocks (section-relative y):
 *   0     Why LoadHunter comparison table   (916:70726)
 *   822   From chaos to AI-Powered dispatch (916:70847, diagram baked @2x)
 *   1607  Pricing (heading / toggle / slider / 4-card deck)   (921:85509)
 *   2825  Testimonials (static cards + cursor)                (916:71269)
 *   3843  FAQ                                                 (916:71343)
 *   5067  CTA card + automation panel                         (916:71405)
 *   5825  Footer                                              (916:71485)
 * All positions absolute at Figma coordinates; heading scale is the tablet
 * "30 H2" token (30/40, tracking −1.2).
 */

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import gsap from "gsap"
import {
  BASIC_COLS,
  STANDARD_COLS,
  PRO_COLS,
  FeatureItem,
  type FeatureCols,
} from "@/sections/pricingFeatures"

const PILL_SHADOW =
  "0px 1px 0px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05), 0px 10px 10px rgba(0,0,0,0.1)"

/** Figma radial fill with gradientTransform, reproduced exactly via SVG (CSS
 *  radial-gradient cannot express rotated/skewed ellipses). */
function figmaRadial(
  w: number,
  h: number,
  matrix: string,
  color: string,
  opacity = 1,
): string {
  return (
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' preserveAspectRatio='none'>` +
    `<rect width='100%' height='100%' fill='url(%23g)' opacity='${opacity}'/>` +
    `<defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(${matrix})'>` +
    `<stop stop-color='${color}' offset='0'/><stop stop-color='${color.replace(",1)", ",0)")}' offset='1'/>` +
    `</radialGradient></defs></svg>")`
  )
}

/* ---------------------------------------------------------------- heading */

function Heading({
  top,
  icon,
  title,
  sub,
  iconStyle,
}: {
  top: number
  icon: string
  title: string
  sub: string
  /** png render box: width + offset around the 64px icon box */
  iconStyle?: { w: number; l: number; t: number }
}) {
  const is = iconStyle ?? { w: 84, l: -10, t: -4 }
  return (
    <>
      <div data-float className="absolute left-[352px] size-[64px]" style={{ top }}>
        <img loading="lazy" decoding="async"
          src={icon}
          alt=""
          aria-hidden
          className="absolute max-w-none"
          style={{ left: is.l, top: is.t, width: is.w }}
        />
      </div>
      <h2
        className="absolute left-[40px] w-[688px] text-center text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-white"
        style={{ top: top + 124 }}
      >
        {title}
      </h2>
      <p
        className="absolute left-[40px] w-[688px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2"
        style={{ top: top + 176 }}
      >
        {sub}
      </p>
    </>
  )
}

/* --------------------------------------------------- why loadhunter table */

const TABLE_ROWS: { label: string; cells: ("check" | "cross")[] }[] = [
  { label: "Smart - board view", cells: ["check", "cross", "cross"] },
  { label: "Telegram alerts", cells: ["check", "cross", "cross"] },
  { label: "Integrated TMS", cells: ["check", "cross", "cross"] },
  { label: "Auto - emailing", cells: ["check", "cross", "check"] },
]

const SPEED_ROW = ["Booking speed", "47 seconds", "~ 2-3 minutes", "~1 minute"]

const DASH =
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 4px, transparent 4px 8px)"

function WhySection() {
  return (
    <>
      {/* ambient glow (image 60, render bounds cropped to section top) */}
      <img loading="lazy" decoding="async"
        src="/figma/tablet/why-glow.png"
        alt=""
        aria-hidden
        className="absolute left-0 top-0 w-[478px] max-w-none"
      />
      <div data-float className="absolute left-[352px] top-0 size-[64px]">
        <img loading="lazy" decoding="async"
          src="/figma/tablet/heading-icon.png"
          alt=""
          aria-hidden
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2 className="absolute left-[40px] top-[124px] w-[688px] text-center text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-white">
        Why LoadHunter
      </h2>
      <p className="absolute left-[40px] top-[184px] w-[688px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Measured across real bookings. Based on real dispatcher workflows.
      </p>

      {/* comparison table */}
      <div
        className="absolute left-[50px] top-[274px] h-[428px] w-[668px] rounded-[12px] backdrop-blur-[100px]"
        style={{
          backgroundImage: figmaRadial(
            668,
            428,
            "32.664 34.399 13.433 63.386 102.98 0",
            "rgba(53,50,70,1)",
            0.6,
          ),
        }}
      >
        {/* header */}
        <div className="absolute left-[24px] top-[24px] flex h-[40px] w-[620px]">
          <div className="w-[155px] pt-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            Feature
          </div>
          <div className="flex w-[155px] justify-center pt-[6.9px]">
            <img loading="lazy" decoding="async"
              src="/figma/tablet/table-logo.svg"
              alt="loadhunter"
              className="h-[26.17px] w-[132.71px] max-w-none"
            />
          </div>
          <div className="w-[155px] pt-[12px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white opacity-50">
            Manual
          </div>
          <div className="w-[155px] pt-[12px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white opacity-50">
            Others
          </div>
        </div>

        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute left-[24px] h-px w-[620px]"
            style={{ top: 76 + i * 68, backgroundImage: DASH }}
          />
        ))}

        {TABLE_ROWS.map((row, i) => (
          <div
            key={row.label}
            className="absolute left-[24px] flex h-[44px] w-[620px]"
            style={{ top: 88 + i * 68 }}
          >
            <div className="w-[155px] pt-[12px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
              {row.label}
            </div>
            {row.cells.map((c, j) => (
              <div key={j} className="relative w-[155px]">
                {c === "check" ? (
                  <img loading="lazy" decoding="async"
                    src="/figma/tablet/check.png"
                    alt="yes"
                    className="absolute left-[51px] top-[-0.75px] h-[45.5px] w-[53px] max-w-none"
                  />
                ) : (
                  <img loading="lazy" decoding="async"
                    src="/figma/tablet/table-cross.svg"
                    alt="no"
                    className="absolute left-[67.2px] top-[13px] h-[18px] w-[20.57px] max-w-none opacity-50"
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        {/* speed row */}
        <div className="absolute left-[24px] top-[360px] flex h-[44px] w-[620px]">
          {SPEED_ROW.map((t, j) => (
            <div
              key={t}
              data-countup={j === 1 ? "" : undefined}
              className={
                "w-[155px] pt-[12px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white" +
                (j === 0 ? "" : " text-center")
              }
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ---------------------------------------------------------------- pricing */

type Plan = {
  name: string
  icon: string
  blurb: string
  price: string
  unit?: string
  note: string
  cols: FeatureCols
  cta: string
  head: "border" | "pro" | "ai"
  recommended?: boolean
  /** AI card: taller blurb pushes separator/price down 14px */
  headShift: number
  listX: number
  colW: number
  colGap: number
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    icon: "/figma/pricing/icon-basic.png",
    blurb: "A streamlined plan to get you moving fast with essential tools.",
    price: "From $26.97",
    unit: "/per month",
    note: "Save 20% with team rate.",
    cols: BASIC_COLS,
    cta: "Start 14 days trial",
    head: "border",
    headShift: 0,
    listX: 10,
    colW: 149.5,
    colGap: 22,
  },
  {
    name: "Standard",
    icon: "/figma/pricing/icon-standard.png",
    blurb: "Perfect for fast-paced teams looking to automate and organize.",
    price: "From $40.47",
    unit: "/per month",
    note: "Save 20% with team rate.",
    cols: STANDARD_COLS,
    cta: "Start 14 days trial",
    head: "border",
    headShift: 0,
    listX: 12,
    colW: 153.5,
    colGap: 14,
  },
  {
    name: "Pro",
    icon: "/figma/pricing/icon-pro.png",
    blurb:
      "Unlock the full LoadHunter experience with automation, insights, and control.",
    price: "From $80.97",
    unit: "/per month",
    note: "Best value for 10+ dispatchers.",
    cols: PRO_COLS,
    cta: "Start 14 days trial",
    head: "pro",
    recommended: true,
    headShift: 0,
    listX: 18,
    colW: 145.5,
    colGap: 14,
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
    headShift: 14,
    listX: 18,
    colW: 145.5,
    colGap: 14,
  },
]

function DiscountBadge({ text, shadow = true }: { text: string; shadow?: boolean }) {
  return (
    <div
      className="flex items-center rounded-[99px] border border-[rgba(232,232,232,0.75)] px-[6px] py-[1px]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.1))",
        boxShadow: shadow ? PILL_SHADOW : undefined,
      }}
    >
      <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-white">
        {text}
      </span>
    </div>
  )
}

function PlanCard({
  plan,
  expanded,
  onSelect,
}: {
  plan: Plan
  expanded: boolean
  onSelect: () => void
}) {
  const s = plan.headShift
  const headStyle: CSSProperties =
    plan.head === "pro"
      ? {
          backgroundImage: figmaRadial(
            333,
            232,
            "32.811 16.906 -11.154 49.732 4.8851 7.4043",
            "rgba(53,50,70,1)",
          ),
        }
      : plan.head === "ai"
        ? {
            backgroundImage: figmaRadial(
              333,
              232,
              "-14.411 -21.843 14.411 -21.843 166.91 252.36",
              "rgba(111,81,151,1)",
            ),
          }
        : {}

  return (
    // Accordion column (Figma 921:88128): the frame width animates between
    // 341 (open) and 111.67 (collapsed) while the 333px content stays pinned
    // left and gets clipped — exactly how the design's four states differ.
    <div
      onClick={onSelect}
      className={`relative h-[660px] shrink-0 overflow-hidden rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-[width] duration-500 ease-out ${
        expanded ? "" : "cursor-pointer"
      }`}
      style={{
        width: expanded ? 341 : 111.67,
        backgroundImage: "linear-gradient(to bottom, #181a1f, rgba(24,26,31,0))",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[16px] border border-[rgba(229,229,229,0.1)]" />
      {/* head panel */}
      <div className="absolute left-[4px] top-[4px] h-[232px] w-[333px] rounded-[12px]" style={headStyle}>
        {plan.head === "border" && (
          <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(229,229,229,0.2)]" />
        )}
        {/* icon (40px box; png render carries the glow) */}
        <div className="absolute left-[24px] top-[24px] size-[40px]">
          <img loading="lazy" decoding="async"
            src={plan.icon}
            alt=""
            className="absolute left-[-6.25px] top-[-2.5px] w-[52.5px] max-w-none"
          />
        </div>
        {/* name + badge */}
        <div className="absolute left-[76px] top-[24px] h-[32px] w-[233px]">
          <span className="whitespace-nowrap text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-gray-50">
            {plan.name}
          </span>
          {plan.recommended && (
            <div className="absolute left-[41px] top-[4px] flex h-[24px] items-center gap-[10px] rounded-[200px] bg-[rgba(232,232,232,0.1)] px-[10px]">
              <img loading="lazy" decoding="async" src="/figma/pricing/crown.svg" alt="" className="h-[14px] w-[12.24px] max-w-none" />
              <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
                Recommended
              </span>
            </div>
          )}
        </div>
        {/* description */}
        <p className="absolute left-[76px] top-[60px] w-[233px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
          {plan.blurb}
        </p>
        {/* separator */}
        <div className="absolute left-[24px] h-px w-[285px] bg-[rgba(229,229,229,0.1)]" style={{ top: 112 + s }} />
        {/* price */}
        <div className="absolute left-[24px] w-[285px]" style={{ top: 136 + s }}>
          <div className="flex items-center gap-[12px]">
            <span className="whitespace-nowrap text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-gray-50">
              {plan.price}
            </span>
            {plan.unit && (
              <span className="whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#a2a2a2]">
                {plan.unit}
              </span>
            )}
          </div>
          <p className="mt-[4px] whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#a2a2a2]">
            {plan.note}
          </p>
        </div>
      </div>

      {/* feature list */}
      <div
        className="absolute top-[260px] flex items-start"
        style={{ left: plan.listX, columnGap: plan.colGap }}
      >
        {plan.cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[22px]" style={{ width: plan.colW }}>
            {col.map((item, i) => (
              <FeatureItem key={i} item={item} />
            ))}
          </div>
        ))}
      </div>

      {/* button */}
      <button
        className="absolute left-[4px] top-[614px] flex h-[42px] w-[333px] items-center justify-center rounded-[12px] border border-[rgba(232,232,232,0.2)] shadow-[0px_6px_10px_0px_rgba(80,50,15,0.1)]"
        type="button"
      >
        <span className="pointer-events-none absolute inset-0 rounded-[11px] bg-[rgba(0,0,0,0.1)] backdrop-blur-[17px]" />
        <span className="relative text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-gray-50">
          {plan.cta}
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-[11px] shadow-[inset_0px_0px_24px_0px_rgba(255,255,255,0.25)]" />
      </button>
    </div>
  )
}

function PricingSection({ top }: { top: number }) {
  // horizontal accordion: Basic open by default; clicking a collapsed plan
  // closes the open one and expands the clicked one (Figma 921:88128 states)
  const [open, setOpen] = useState(0)
  return (
    <>
      <div className="absolute left-[352px] size-[64px]" style={{ top }}>
        <img loading="lazy" decoding="async"
          src="/figma/tablet/heading-icon.png"
          alt=""
          aria-hidden
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2
        className="absolute left-[40px] w-[688px] text-center text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-white"
        style={{ top: top + 84 }}
      >
        Choose the plans that&rsquo;s perfect for your business
      </h2>
      <p
        className="absolute left-[40px] w-[688px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2"
        style={{ top: top + 136 }}
      >
        Enjoy a 10% annual discount, plus save an extra 10% with 3 users — and
        unlock 20% off starting at 4 users!
      </p>

      {/* billing toggle (static: Monthly) */}
      <div
        className="absolute flex h-[40px] items-center gap-[12px] rounded-full bg-[rgba(231,231,231,0.1)] py-[6px] pl-[6px] pr-[11px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
        style={{ left: 256.5, top: top + 212 }}
      >
        <div
          className="flex h-[28px] items-center justify-center rounded-[99px] border border-[rgba(232,232,232,0.75)] px-[12px] backdrop-blur-[10px]"
          style={{
            backgroundImage:
              "radial-gradient(42px 38px at 50% 109%, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)",
            boxShadow: PILL_SHADOW,
          }}
        >
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
            Monthly
          </span>
        </div>
        <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
          Annually
        </span>
        <DiscountBadge text="save up -10%" />
      </div>

      {/* dispatchers slider (static: 3 dispatchers) */}
      <p
        className="absolute left-[254px] w-[98px] whitespace-nowrap text-center text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white"
        style={{ top: top + 276 }}
      >
        3 dispatchers
      </p>
      <div
        className="absolute left-[40px] h-[16px] w-[688px] rounded-[200px] bg-[rgba(231,231,231,0.1)]"
        style={{ top: top + 310 }}
      >
        <div className="absolute left-[2px] top-[2px] h-[12px] w-[269px] rounded-[8px] bg-[#6f5197] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25),inset_0px_1px_2px_0px_rgba(255,255,255,0.35)]" />
        <div className="absolute left-[260px] top-[-3px] size-[22px]">
          <img loading="lazy" decoding="async"
            src="/figma/pricing/knob.svg"
            alt=""
            className="absolute max-w-none"
            style={{ left: -9.43, top: -4.71, width: 40.86, height: 40.86 }}
          />
        </div>
      </div>
      <div className="absolute left-[279px]" style={{ top: top + 340 }}>
        <DiscountBadge text="-10% OFF" />
      </div>
      <div className="absolute left-[506px] opacity-50" style={{ top: top + 340 }}>
        <DiscountBadge text="-20% OFF" shadow={false} />
      </div>

      {/* plan-card accordion row (40px margins, 4px gaps) */}
      <div
        className="absolute left-[40px] flex w-[688px] gap-[4px]"
        style={{ top: top + 438 }}
      >
        {PLANS.map((plan, i) => (
          <PlanCard
            key={plan.name}
            plan={plan}
            expanded={open === i}
            onSelect={() => setOpen(i)}
          />
        ))}
      </div>
    </>
  )
}

/* ----------------------------------------------------------- testimonials */

type Review = {
  quote: string
  initials: string
  name: string
  left: number
  top: number
  violet?: boolean
}

const REVIEWS: Review[] = [
  {
    quote:
      "Ugh, It Seems To Be A Powerful and helpful Tool for booking loads ,makes everything so easier. Recommend To Taste It, And keep quality of the loads as high is possible with this tool",
    initials: "NC",
    name: "Nicolae Cojocari",
    left: -218,
    top: 202,
  },
  {
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
    initials: "AC",
    name: "AJ Cargo",
    left: 197.5,
    top: 0,
    violet: true,
  },
  {
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
    initials: "FL",
    name: "FleetMax LLC",
    left: 612,
    top: 282,
  },
]

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      data-card
      className={
        "absolute w-[375px] overflow-hidden rounded-[12px] p-[40px] " +
        (r.violet ? "shadow-[0px_34px_74px_-20px_rgba(111,81,151,0.5)]" : "")
      }
      style={{ left: r.left, top: r.top }}
    >
      <div
        className={
          "pointer-events-none absolute inset-0 z-10 rounded-[12px] border " +
          (r.violet ? "border-[rgba(111,81,151,0.8)]" : "border-[rgba(229,229,229,0.1)]")
        }
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] backdrop-blur-[100px]"
        style={{
          backgroundImage: r.violet
            ? figmaRadial(375, 262, "-16.229 -24.667 16.229 -24.667 187.96 284.99", "rgba(111,81,151,1)")
            : "radial-gradient(453px circle at 375px 6px, rgba(53,50,70,1), rgba(53,50,70,0))",
        }}
      />
      <p className="relative w-full text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-gray-50">
        {r.quote}
      </p>
      <div className="relative mt-[40px] flex w-full items-center gap-[12px]">
        <div
          className="flex size-[42px] items-center justify-center rounded-[12px] border border-white backdrop-blur-[10px]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
            boxShadow: PILL_SHADOW,
          }}
        >
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            {r.initials}
          </span>
        </div>
        <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          {r.name}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[12px] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  )
}

const REVIEW_PERIOD = 1245 // collage width 1205 (x −218..987) + 40 gap

function TestimonialsSection({ top }: { top: number }) {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tween = gsap.to(track, {
      x: -REVIEW_PERIOD, // one collage period → seamless wrap
      duration: 36, // ≈ desktop testimonials speed (34.6 px/s)
      ease: "none",
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <>
      <Heading
        top={top}
        icon="/figma/tablet/heading-icon.png"
        title="What client says"
        sub="Our clients appreciate our attention to their needs and professionalism. Here are some of their testimonials"
      />
      {/* trust strip: 5,000+ users, 4.7 rating, Google / Trustpilot / G2 */}
      <img loading="lazy" decoding="async"
        src="/figma/reviews-strip.png"
        alt="5,000+ trusted users, 4.7 from 100+ reviews on Google, Trustpilot and G2"
        className="absolute left-[62.5px] w-[643.5px] max-w-none"
        style={{ top: top + 252 }}
      />
      {/* card marquee band (initial frame matches the design) */}
      <div
        className="absolute left-0 h-[524px] w-[768px] overflow-hidden"
        style={{ top: top + 374 }}
      >
        <div
          ref={trackRef}
          data-marquee-track
          className="absolute inset-0 will-change-transform"
        >
          {[0, 1, 2].map((copy) => (
            <div
              key={copy}
              className="absolute top-0 h-full"
              style={{ left: (copy - 1) * REVIEW_PERIOD }}
            >
              {REVIEWS.map((r) => (
                <ReviewCard key={r.name} r={r} />
              ))}
              <img loading="lazy" decoding="async"
                src="/figma/tablet/cursor.svg"
                alt=""
                aria-hidden
                className="absolute left-[421.5px] top-[195px] h-[32px] w-[27px] max-w-none"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* -------------------------------------------------------------------- faq */

/** line arrays follow the exact wraps of the Figma render (Chrome fits a
 *  word more per line at this size, so wrapping is made explicit) */
type FaqRow = {
  top: number
  /** y offset of the detail paragraph within the row */
  dy: number
  q: string[]
  a: string[]
  d: string[]
}

const FAQ_ROWS: FaqRow[] = [
  {
    top: 0,
    dy: 108,
    q: ["How do I install and set up LoadHunter?"],
    a: [
      "The installation process is simple! Just go to the",
      'Chrome Web Store, find "LoadHunter" and',
      'click "Add to Chrome".',
    ],
    d: [
      "Once installed, click on the puzzle icon in the top-right",
      "corner and pin LoadHunter.",
      "Log in with your email, visit your Load Board, and you’ll",
      "immediately see all the LoadHunter features!",
    ],
  },
  {
    top: 196,
    dy: 88,
    q: ["Do you offer a free trial?"],
    a: ["Yes! Try an unlimited version of LoadHunter with", "a 14-day free trial."],
    d: [
      "You can explore all the features and see how it can",
      "optimize your dispatching work — no credit card",
      "required. Enjoy full access without any obligations!",
    ],
  },
  {
    top: 356,
    dy: 108,
    q: ["Can I connect my factoring company", "account to LoadHunter?"],
    a: [
      "Yes! With LoadHunter, you can integrate your",
      "Factoring Company account directly into the",
      "dashboard.",
    ],
    d: [
      "This allows you to see factoring ratings right on your",
      "LoadBoard, making it easier to evaluate brokers and",
      "streamline decision-making.",
    ],
  },
  {
    top: 536,
    dy: 68,
    q: ["Does LoadHunter work with VOIP for", "SMS and calls?"],
    a: ["Absolutely!"],
    d: [
      "You can connect your VOIP service and use LoadHunter",
      "to send pre-built SMS templates and make calls directly",
      "from the extension.",
    ],
  },
  {
    top: 676,
    dy: 88,
    q: ["Can I cancel my LoadHunter", "subscription anytime?"],
    a: ["Yes, you can cancel your LoadHunter subscription", "at any time."],
    d: [
      "Even after cancellation, the extension will continue to",
      "work until the end of your current",
      "subscription period.",
    ],
  },
]

function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className="block whitespace-nowrap">
          {l}
        </span>
      ))}
    </>
  )
}

function FaqSection({ top }: { top: number }) {
  const list = top + 268
  return (
    <>
      <Heading
        top={top}
        icon="/figma/tablet/heading-icon.png"
        title="Frequently Asked Questions"
        sub="Access a wealth of information and resources to ensure you find the solutions you need quickly and effectively, empowering you to make informed decisions Contact us."
      />
      {FAQ_ROWS.map((r) => (
        <div key={r.q[0]} className="absolute left-[40px] w-[688px]" style={{ top: list + r.top }}>
          <h3 className="absolute left-0 top-[24px] w-[280px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#e8e8e8]">
            <Lines lines={r.q} />
          </h3>
          <p className="absolute left-[328px] top-[24px] w-[360px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#e8e8e8]">
            <Lines lines={r.a} />
          </p>
          <p
            className="absolute left-[328px] w-[360px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2"
            style={{ top: r.dy }}
          >
            <Lines lines={r.d} />
          </p>
        </div>
      ))}
      {[196, 356, 536, 676].map((y) => (
        <img loading="lazy" decoding="async"
          key={y}
          src="/figma/tail/faq-line.svg"
          alt=""
          aria-hidden
          className="absolute left-[88px] h-px w-[640px] max-w-none"
          style={{ top: list + y - 0.5 }}
        />
      ))}
    </>
  )
}

/* -------------------------------------------------------------------- cta */

function CtaSection({ top }: { top: number }) {
  return (
    <div className="absolute left-0 h-[638px] w-[768px] overflow-hidden" style={{ top }}>
      {/* violet gradient card */}
      <div
        className="absolute left-[50px] top-0 h-[306px] w-[668px] rounded-[12px]"
        style={{
          backgroundImage: "linear-gradient(122.08deg, #6f5197 0%, #9779bf 100%)",
        }}
      >
        <div className="absolute left-[40px] top-[40px] h-[24px] w-[151px]">
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-icon-white.svg"
            alt=""
            className="absolute left-0 top-0 size-[24px] max-w-none"
          />
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-text-white.svg"
            alt="loadhunter"
            className="absolute left-[34px] top-[2.56px] h-[18.88px] w-[116.44px] max-w-none"
          />
        </div>
        <h2 className="absolute left-[40px] top-[124px] whitespace-nowrap text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-white">
          Start your experience with LoadHunter
        </h2>
        <p className="absolute left-[40px] top-[168px] w-[565px] whitespace-nowrap text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
          Search loads with efficiency and speed you never had before.
          LoadHunter: Ai-powered tool.
        </p>
        <button
          className="absolute left-[40px] top-[224px] inline-flex h-[42px] items-center gap-[8px] rounded-full border border-white bg-white px-[24px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90"
          type="button"
        >
          <img loading="lazy" decoding="async" src="/figma/tail/cta-chrome.svg" alt="" className="size-[16px] max-w-none" />
          <span
            className="bg-clip-text text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-transparent"
            style={{
              backgroundImage: "linear-gradient(149.61deg, #6f5197 0%, #9779bf 100%)",
            }}
          >
            Add to Chrome
          </span>
        </button>
      </div>

      {/* "One click automation" panel — baked 2x export */}
      <img loading="lazy" decoding="async"
        src="/figma/tablet/cta-panel.png"
        alt=""
        aria-hidden
        className="absolute left-[50px] top-[326px] h-[300px] w-[668px] max-w-none"
      />
      {/* diffuse light haze over the panel (present only in the full-frame
          figma composite; reconstructed as an additive overlay) */}
      <img loading="lazy" decoding="async"
        src="/figma/tablet/cta-haze.png"
        alt=""
        aria-hidden
        className="absolute left-[50px] top-[306px] h-[332px] w-[668px] max-w-none"
        style={{ mixBlendMode: "plus-lighter" }}
      />
      {/* right-edge glow (image 61; blur margins baked, left bleed cropped) */}
      <img loading="lazy" decoding="async"
        src="/figma/tablet/cta-glow.png"
        alt=""
        aria-hidden
        className="absolute left-[718px] top-[242px] h-[440px] w-[712px] max-w-none"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ footer */

const SOCIALS = [
  "/figma/tail/social-1.png",
  "/figma/tail/social-2.png",
  "/figma/tail/social-3.png",
]

function FooterSection({ top }: { top: number }) {
  return (
    // pointer-events-none: this wrapper spans the WHOLE TabletBottom section
    // (it only exists to inherit section coordinates) and would otherwise
    // swallow every click on the sections underneath (pricing accordion,
    // FAQ). Interactive children opt back in.
    <footer className="pointer-events-none absolute left-0 top-0 h-full w-full">
      {/* logo + subscribe row */}
      <div className="absolute left-[40px] h-[24px] w-[151px]" style={{ top: top + 8 }}>
        <img loading="lazy" decoding="async"
          src="/figma/tail/logo-icon-white.svg"
          alt=""
          className="absolute left-0 top-0 size-[24px] max-w-none"
        />
        <img loading="lazy" decoding="async"
          src="/figma/tail/logo-text-white.svg"
          alt="loadhunter"
          className="absolute left-[34px] top-[2.56px] h-[18.88px] w-[116.44px] max-w-none"
        />
      </div>
      <form
        className="pointer-events-auto absolute left-[380px] h-[40px] w-[348px] rounded-full bg-[rgba(54,56,61,0.5)] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
        style={{ top }}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="Enter your e-mail address"
          className="absolute left-[8px] top-[8px] h-[24px] w-[241px] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.05)] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] placeholder:text-ink-2 focus:outline-none"
        />
        <button className="absolute left-[255px] top-[6px] flex h-[28px] items-center justify-center rounded-full border border-white bg-[#6f5197] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90">
          Subscribe
        </button>
      </form>

      {/* full-bleed separator */}
      <div className="absolute left-0 h-px w-[768px] bg-[#33353a]" style={{ top: top + 72 }} />

      {/* links + socials */}
      <div
        className="pointer-events-auto absolute left-[40px] flex h-[14px] items-center gap-[32px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2"
        style={{ top: top + 106 }}
      >
        <a href="#" className="hover:text-gray-100">Privacy Policy</a>
        <a href="#" className="hover:text-gray-100">Terms of Service</a>
      </div>
      <div className="pointer-events-auto absolute left-[666px] flex gap-[4px]" style={{ top: top + 104 }}>
        {SOCIALS.map((src) => (
          <a key={src} href="#" className="block size-[18px]">
            <img loading="lazy" decoding="async" src={src} alt="" className="size-[18px] max-w-none" />
          </a>
        ))}
      </div>

      {/* orbit rings graphic (© caption + hairline baked in) */}
      <img loading="lazy" decoding="async"
        src="/figma/tablet/footer-orbit.png"
        alt="© 2026 loadhunt Corp. All rights reserved."
        className="absolute left-0 h-[875px] w-[768px] max-w-none"
        style={{ top: top + 122 }}
      />
    </footer>
  )
}

/* ------------------------------------------------------------------- root */

export function TabletBottom() {
  return (
    <section className="relative bg-gray-800" style={{ height: 6822 }}>
      <WhySection />

      {/* from chaos to AI-powered dispatch */}
      <h2 className="absolute left-[40px] top-[822px] w-[688px] text-center text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-white">
        From chaos to AI-Powered dispatch
      </h2>
      <p className="absolute left-[40px] top-[882px] w-[688px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Stop refreshing load boards, rewriting emails, and calculating profits
        by hand. LoadHunter automates the busywork so your team can find better
        loads, respond faster, and book with confidence.
      </p>
      {/* diagram export is cropped above its baked caption pill; the pill is
          live text below so it matches the desktop wording */}
      <img loading="lazy" decoding="async"
        src="/figma/tablet/chaos.png"
        alt=""
        aria-hidden
        data-parallax="0.04"
        className="absolute left-0 top-[932px] h-[500px] w-[768px] max-w-none"
      />
      <div className="absolute left-1/2 top-[1438px] flex -translate-x-1/2 items-center justify-center rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-[24px] py-[12px] backdrop-blur-[20px]">
        <span className="whitespace-nowrap text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-gray-300">
          Logistics is moving to AI. Don&rsquo;t get left behind.
        </span>
      </div>

      <PricingSection top={1607} />
      <TestimonialsSection top={2825} />
      <FaqSection top={3843} />
      <CtaSection top={5067} />
      <FooterSection top={5825} />
    </section>
  )
}
