import { useState } from "react"
import { Check, Send, Settings2, Crown, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  icon: React.ReactNode
  blurb: string
  price?: string
  unit?: string
  priceLabel?: string
  note: string
  cols: [string[], string[]]
  cta: string
  featured?: boolean
  enterprise?: boolean
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    icon: <Send className="size-[18px]" />,
    blurb: "A streamlined plan to get you moving fast with essential tools.",
    price: "From $26.97",
    unit: "per month",
    note: "Save 20% with team rate.",
    cols: [
      ["Unlimited Emails", "1 Connected Email", "1 Email Template", "Google Maps Integration", "Load Filters"],
      ["RPM+", "Click to Call", "Copy Load Info", "Weather Integration", "Profit Calculator"],
    ],
    cta: "Start 14 days trial",
  },
  {
    name: "Standard",
    icon: <Settings2 className="size-[18px]" />,
    blurb: "Perfect for fast-paced teams looking to automate and organize.",
    price: "From $40.47",
    unit: "per month",
    note: "Save 20% with team rate.",
    cols: [
      ["Unlimited Email Accounts", "Unlimited Templates", "1 Email Signature", "VoIP Integration", "Tolls Integration", "Integrated TMS", "Saved Loads", "Dark Mode", "Integrated Trucking Map"],
      ["Advanced Profit Calculator", "1 Factoring Connection", "Community Reviews", "Market Conditions", "Ignore Brokers/States", "Hide cancelled loads", "Hide CA/MX Loads", "Advanced Profit Calculator"],
    ],
    cta: "Start 14 days trial",
  },
  {
    name: "Pro",
    icon: <Crown className="size-[18px]" />,
    blurb: "Unlock the full LoadHunter experience with automation, insights, and control.",
    price: "From $80.97",
    unit: "per dispatcher",
    note: "Best value for 30+ dispatchers.",
    cols: [
      ["SmartBoard View", "Full LoadBoard Customization", "Auto-Refresh Button", "Pin to Top", "Performance Boost", "Redesigned LoadBoard", "Search Tabs Reorder", "Up to 2 Factoring Connections", "FMCSA Broker Lookup"],
      ["Team Management", "Advanced Filtering Modes", "Driver Profile Setup", "CC Support for Emails", "Dispatcher Analytics", "Idle Driver Email Alerts", "Email Sequit Notifications"],
    ],
    cta: "Start 14 days trial",
    featured: true,
  },
  {
    name: "AI subscription",
    icon: <Crown className="size-[18px]" />,
    blurb: "Our comprehensive enterprise solution comes fully equipped with all the professional features.",
    priceLabel: "Let's talk",
    note: "Best value for 30+ dispatchers.",
    cols: [
      ["SmartBoard View", "Full LoadBoard Customization", "Auto-Refresh Button", "Pin to Top", "Performance Boost", "Redesigned LoadBoard", "Search Tabs Reorder", "Up to 2 Factoring Connections", "FMCSA Broker Lookup"],
      ["Team Management", "Advanced Filtering Modes", "Driver Profile Setup", "CC Support for Emails", "Dispatcher Analytics", "Idle Driver Email Alerts", "Email Sequit Notifications"],
    ],
    cta: "Add to wishlist",
    enterprise: true,
  },
]

function PlanCard({ plan }: { plan: Plan }) {
  const violet = plan.featured || plan.enterprise
  return (
    <div
      className={cn(
        "flex flex-col rounded-[16px] border p-6",
        violet
          ? "border-violet-600/40 bg-gradient-to-b from-violet-600/[0.18] to-[#1b1722]"
          : "border-[#ffffff14] bg-[#1d1f24]",
      )}
    >
      {/* header */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-[10px] border text-violet-300",
            violet ? "border-violet-600/40 bg-violet-600/20" : "border-[#ffffff14] bg-[#26282e]",
          )}
        >
          {plan.icon}
        </span>
        <span className="text-[16px] font-medium tracking-[-0.64px] text-[#e8e8e8]">{plan.name}</span>
        {plan.featured && (
          <span className="ml-auto rounded-full bg-violet-600/25 px-2.5 py-1 text-[11px] text-violet-300">
            Recommended
          </span>
        )}
      </div>

      <p className="mt-3 min-h-[48px] text-[12px] leading-[16px] tracking-[-0.48px] text-[#8c8d8f]">
        {plan.blurb}
      </p>

      {/* price */}
      <div className="mt-4 border-b border-[#ffffff14] pb-4">
        {plan.price ? (
          <p className="flex items-end gap-1.5">
            <span className="text-[30px] font-medium tracking-[-1.2px] text-[#e8e8e8]">{plan.price}</span>
            <span className="mb-1 text-[12px] text-[#686b6f]">/{plan.unit}</span>
          </p>
        ) : (
          <p className="text-[30px] font-medium tracking-[-1.2px] text-[#e8e8e8]">{plan.priceLabel}</p>
        )}
        <p className="mt-1 text-[12px] tracking-[-0.48px] text-[#686b6f]">{plan.note}</p>
      </div>

      {/* features */}
      <div className="mt-4 grid flex-1 grid-cols-2 gap-x-3 gap-y-2.5">
        {plan.cols.map((col, ci) => (
          <ul key={ci} className="space-y-2.5">
            {col.map((f, i) => (
              <li key={`${f}-${i}`} className="flex items-start gap-1.5 text-[12px] leading-[14px] tracking-[-0.48px] text-[#a3a4a6]">
                <Check className="mt-px size-3 shrink-0 text-violet-300" strokeWidth={2.6} />
                {f}
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* cta */}
      <button
        className={cn(
          "mt-6 w-full rounded-full border py-3 text-[14px] font-medium tracking-[-0.56px] transition-colors",
          plan.featured
            ? "border-transparent bg-white text-[#454545] hover:opacity-90"
            : "border-[#ffffff1f] bg-[#26282e] text-[#e8e8e8] hover:bg-[#2f3136]",
        )}
      >
        {plan.cta}
      </button>
    </div>
  )
}

export function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [count, setCount] = useState(3)

  return (
    <section id="pricing" className="flex flex-col items-center bg-[#18191f] px-[120px] pb-[120px] pt-[110px]">
      {/* icon */}
      <span
        className="flex size-12 items-center justify-center rounded-[14px] border border-violet-600/40 bg-gradient-to-br from-violet-600/40 to-[#1d1f24] text-violet-300"
        style={{ boxShadow: "0px 6px 16px -6px rgba(111,81,151,0.5)" }}
      >
        <Tag className="size-5" />
      </span>

      <h2 className="mt-8 whitespace-nowrap text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-[#e8e8e8]">
        Choose the plans that's perfect for your business
      </h2>
      <p className="mt-3 text-[14px] font-medium tracking-[-0.56px] text-[#686b6f]">
        Enjoy a 10% annual discount, plus save an extra 10% with 3 users — and unlock 20% off starting at 4 users!
      </p>

      {/* toggle */}
      <div className="mt-7 inline-flex items-center gap-1 rounded-full border border-[#ffffff14] bg-[#1d1f24] p-1 text-[13px]">
        <button
          onClick={() => setAnnual(false)}
          className={cn("rounded-full px-4 py-1.5 transition-colors", !annual ? "bg-violet-600/25 text-violet-300" : "text-[#8c8d8f]")}
        >
          Monthly
        </button>
        <button
          onClick={() => setAnnual(true)}
          className={cn("rounded-full px-4 py-1.5 transition-colors", annual ? "bg-violet-600/25 text-violet-300" : "text-[#8c8d8f]")}
        >
          Annually
        </button>
        <span className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[12px] text-[#686b6f]">save up -10%</span>
      </div>

      {/* slider */}
      <div className="mt-8 w-[520px]">
        <p className="mb-2 text-center text-[14px] text-[#a3a4a6]">{count} dispatchers</p>
        <input
          type="range"
          min={1}
          max={10}
          value={count}
          aria-label="Number of dispatchers"
          onChange={(e) => setCount(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          style={{ background: `linear-gradient(90deg, #9c66e5 ${(count / 10) * 100}%, #2f3136 ${(count / 10) * 100}%)` }}
        />
        <div className="mt-2 flex justify-between text-[12px] text-[#686b6f]">
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5">-10% OFF</span>
          <span className="rounded-full bg-white/[0.04] px-2 py-0.5">-20% OFF</span>
        </div>
      </div>

      {/* cards */}
      <div className="mt-12 grid w-full max-w-[1680px] grid-cols-4 gap-5 text-left">
        {PLANS.map((p) => (
          <PlanCard key={p.name} plan={p} />
        ))}
      </div>
    </section>
  )
}
