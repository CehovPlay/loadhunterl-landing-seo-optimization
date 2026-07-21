/**
 * The plan comparison matrix (Figma 1247:10 "Compare Table — 1920"), shared by
 * the desktop compare table (Pricing.tsx) and the flow-layout plan selector
 * (mobile/MobilePricing.tsx). Cell values per plan, in PLAN_DEFS order:
 * `true` = check, `null` = not included, `"soon"` = coming-soon spinner,
 * any other string renders literally ("10 / day", "Unlimited", "2+", …).
 */

export type CellValue = true | null | "soon" | string

export type MatrixRow = {
  label: string
  values: [CellValue, CellValue, CellValue, CellValue, CellValue]
}

export type MatrixGroup = { title: string; rows: MatrixRow[] }

export type PlanDef = {
  name: string
  icon: string
  /** base monthly price per dispatcher (loadhunter.io logic); absent → static price */
  base?: number
  /** static price label for unpriced plans ("$0", "Let's talk") */
  price?: string
  unit?: string
  /** static note under the price (replaced by the live billing line on priced plans) */
  note: string
  cta: string
  recommended?: boolean
  /** card accent wash used by the flow-layout plan panel */
  accent?: "pro" | "ai"
}

export const PLAN_DEFS: PlanDef[] = [
  {
    name: "Freemium",
    icon: "/figma/pricing/icon-freemium.png",
    price: "$0",
    unit: "/forever",
    note: "No credit card required.",
    cta: "Start for free",
  },
  {
    name: "Basic",
    icon: "/figma/pricing/icon-basic.png",
    base: 9.99,
    note: "Save 20% with team rate.",
    cta: "Start 14-day free trial",
  },
  {
    name: "Standard",
    icon: "/figma/pricing/icon-standard.png",
    base: 14.99,
    note: "Save 20% with team rate.",
    cta: "Start 14-day free trial",
  },
  {
    name: "Pro",
    icon: "/figma/pricing/icon-pro.png",
    base: 29.99,
    note: "Best value for 10+ dispatchers.",
    cta: "Start 14-day free trial",
    recommended: true,
    accent: "pro",
  },
  {
    name: "AI subscription",
    icon: "/figma/pricing/icon-ai.png",
    price: "Let's talk",
    note: "Best value for 20+ dispatchers.",
    cta: "Add to wishlist",
    accent: "ai",
  },
]

const row = (label: string, ...values: MatrixRow["values"]): MatrixRow => ({ label, values })
const check = true
const no = null

export const MATRIX: MatrixGroup[] = [
  {
    title: "Core dispatch tools",
    rows: [
      row("Unlimited Emails", "10 / day", check, check, check, check),
      row("Connected Email Accounts", "1", "1", "Unlimited", "Unlimited", "Unlimited"),
      row("Email Templates", no, "1", "Unlimited", "Unlimited", "Unlimited"),
      row("Google Maps Integration", no, check, check, check, check),
      row("Load Filters", check, check, check, check, check),
      row("RPM+", check, check, check, check, check),
      row("Click to Call", no, check, check, check, check),
      row("Copy Load Info", no, check, check, check, check),
      row("Weather Integration", no, check, check, check, check),
      row("Profit Calculator", no, "Basic", "Advanced", "Advanced", "Advanced"),
    ],
  },
  {
    title: "Automation & workflow",
    rows: [
      row("Email Signature", no, no, check, check, check),
      row("VoIP Integration", no, no, check, check, check),
      row("Tolls Integration", no, no, check, check, check),
      row("Integrated TMS", no, no, check, check, check),
      row("Integrated Trucking Map", no, no, check, check, check),
      row("Saved Loads", no, no, check, check, check),
      row("Load Notes", no, no, check, check, check),
      row("Community Reviews", no, no, check, check, check),
      row("Market Conditions", no, no, check, check, check),
      row("Ignore Brokers/States", no, no, check, check, check),
      row("Hide Cancelled Loads", no, no, check, check, check),
      row("Hide CA/MX Loads", no, no, check, check, check),
      row("Telegram Load Notifications", no, no, check, check, check),
      row("Dark Mode", no, no, check, check, check),
      row("Factoring Connections", no, no, "1", "2+", "2+"),
    ],
  },
  {
    title: "Pro power features",
    rows: [
      row("SmartBoard View", no, no, no, check, check),
      row("Full LoadBoard Customization", no, no, no, check, check),
      row("Redesigned LoadBoard", no, no, no, check, check),
      row("Auto-Refresh Button", no, no, no, check, check),
      row("Pin to Top", no, no, no, check, check),
      row("Performance Boost", no, no, no, check, check),
      row("Search Tabs Reorder", no, no, no, check, check),
      row("Advanced Filtering Modes", no, no, no, check, check),
      row("FMCSA Broker Lookup", no, no, no, check, check),
      row("Team Management", no, no, no, check, check),
      row("Driver Profile Setup", no, no, no, check, check),
    ],
  },
  {
    title: "Coming soon",
    rows: [
      row("CC Support for Emails", no, no, no, "soon", "soon"),
      row("Dispatcher Analytics", no, no, no, "soon", "soon"),
      row("Idle Driver Email Alerts", no, no, no, "soon", "soon"),
      row("Email Read Notifications", no, no, no, "soon", "soon"),
    ],
  },
]

/** The three cell glyphs shared by both layouts (12px scale). */
export function CellCheck() {
  return (
    <div className="relative h-[6px] w-[9px] shrink-0">
      <img
        loading="lazy"
        decoding="async"
        src="/figma/pricing/check.svg"
        alt=""
        className="absolute max-w-none"
        style={{ left: -1, top: -1, width: 11, height: 7.21 }}
      />
    </div>
  )
}

/** Coming-soon loader. Desktop (scaled canvas) spins via GSAP data-spin —
 * CSS keyframe transforms don't render inside the scaled canvas in Chrome.
 * The flow layout passes `css` instead: its clocks re-mount on plan switch,
 * after initMicro's one-time [data-spin] scan, so they self-animate in CSS. */
export function CellClock({ css = false }: { css?: boolean }) {
  return (
    <div className="relative size-[10px] shrink-0 opacity-50">
      <img
        loading="lazy"
        decoding="async"
        src="/figma/pricing/clock.svg"
        alt="Coming soon"
        data-spin={css ? undefined : ""}
        data-no-reveal
        className={`absolute max-w-none ${css ? "animate-spin motion-reduce:animate-none" : ""}`}
        style={{ left: -1, top: -1, width: 12, height: 12, animationDuration: css ? "1.6s" : undefined }}
      />
    </div>
  )
}

export function CellDash() {
  // -top-px: optical centring — Inter sits low in its line box next to the icons
  return (
    <span className="relative -top-px text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-3 opacity-50">
      —
    </span>
  )
}
