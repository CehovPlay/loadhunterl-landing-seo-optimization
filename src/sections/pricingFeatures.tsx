/**
 * Per-plan feature lists + the 12px check/clock list item, shared by the
 * tablet and phone pricing accordions (Figma 921:88128 / 942:110506). The
 * desktop deck keeps its own larger-scale markup in Pricing.tsx.
 */

export type Feature = { text: string; clock?: boolean; twoLine?: boolean }

const f = (text: string, twoLine = false): Feature => ({ text, twoLine })
const clock = (text: string): Feature => ({ text, clock: true, twoLine: true })

export type FeatureCols = [Feature[], Feature[]]

export const BASIC_COLS: FeatureCols = [
  [
    f("Unlimited Emails"),
    f("1 Connected Email"),
    f("1 Email Template"),
    f("Google Maps Integration", true),
    f("Load Filters"),
  ],
  [
    f("RPM+"),
    f("Click to Call"),
    f("Copy Load Info"),
    f("Weather Integration"),
    f("Profit Calculator"),
  ],
]

export const STANDARD_COLS: FeatureCols = [
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
    f("Hide CA/MX Loads"),
    f("Advanced Profit Calculator", true),
  ],
]

export const PRO_COLS: FeatureCols = [
  [
    f("SmartBoard View"),
    f("Full LoadBoard Customization", true),
    f("Auto-Refresh Button"),
    f("Pin to Top"),
    f("Performance Boost"),
    f("Redesigned LoadBoard"),
    f("Search Tabs Reorder"),
    f("Up to 2 Factoring Connections", true),
    f("FMCSA Broker Lookup"),
  ],
  [
    f("Team Management"),
    f("Advanced Filtering Modes", true),
    f("Driver Profile Setup"),
    clock("CC Support for Emails (Coming Soon)"),
    clock("Dispatcher Analytics (Coming Soon)"),
    clock("Idle Driver Email Alerts (Coming Soon)"),
    clock("Email Read Notifications (Coming Soon)"),
  ],
]

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

export function FeatureItem({ item }: { item: Feature }) {
  if (item.clock) {
    return (
      <div className="flex w-full items-start gap-[12px] opacity-50">
        <div className="relative size-[10px] shrink-0">
          <img loading="lazy" decoding="async"
            src="/figma/pricing/clock.svg"
            alt=""
            className="absolute max-w-none"
            style={{ left: -1, top: -1, width: 12, height: 12 }}
          />
        </div>
        <p className="min-w-px flex-1 whitespace-pre-line text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
          {item.text}
        </p>
      </div>
    )
  }
  return (
    <div
      className={`flex w-full items-center gap-[12px] ${item.twoLine ? "h-[28px]" : "h-[14px]"}`}
    >
      <CheckIcon />
      <p className="min-w-px flex-1 whitespace-pre-line text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-gray-50">
        {item.text}
      </p>
    </div>
  )
}
