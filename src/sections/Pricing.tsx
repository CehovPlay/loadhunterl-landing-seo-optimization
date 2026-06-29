import { useState } from "react"
import { Container } from "@/components/site/Container"
import { IconBadge } from "@/components/site/IconBadge"
import { Check, Send, Settings2, Crown, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

type Plan = {
  name: string
  icon: React.ReactNode
  blurb: string
  price?: string
  unit?: string
  note: string
  cols: [string[], string[]]
  cta: string
  featured?: boolean
  enterprise?: boolean
}

const PLANS: Plan[] = [
  {
    name: "Basic",
    icon: <Send className="size-5" />,
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
    icon: <Settings2 className="size-5" />,
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
    icon: <Crown className="size-5" />,
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
    name: "Let's talk",
    icon: <Crown className="size-5" />,
    blurb: "Our comprehensive enterprise solution comes fully equipped with all the professional features.",
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
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6",
        plan.featured
          ? "border-violet-600/50 bg-gradient-to-b from-violet-600/15 to-gray-900"
          : "border-line bg-gray-800/40",
      )}
    >
      {/* header */}
      <div
        className={cn(
          "-m-6 mb-0 rounded-t-2xl p-6",
          plan.enterprise &&
            "bg-gradient-to-br from-violet-600/40 via-violet-600/20 to-transparent",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md border border-line bg-gray-800 text-violet-300">
            {plan.icon}
          </span>
          <span className="text-body font-medium text-dark-text">{plan.name}</span>
          {plan.featured && (
            <span className="ml-auto rounded-full bg-violet-600/20 px-2.5 py-1 text-subtle text-violet-300">
              Recommended
            </span>
          )}
        </div>
        <p className="mt-3 text-subtle leading-relaxed text-gray-300">
          {plan.blurb}
        </p>
      </div>

      {/* price */}
      <div className="mt-6 border-b border-line pb-5">
        {plan.price ? (
          <p className="flex items-end gap-1.5">
            <span className="text-h2 font-medium tracking-tight text-dark-text">
              {plan.price}
            </span>
            <span className="mb-1 text-subtle text-gray-400">{plan.unit}</span>
          </p>
        ) : (
          <p className="text-h2 font-medium tracking-tight text-dark-text">
            Let's talk
          </p>
        )}
        <p className="mt-1 text-subtle text-gray-400">{plan.note}</p>
      </div>

      {/* features */}
      <div className="mt-5 grid flex-1 grid-cols-2 gap-x-4 gap-y-2.5">
        {plan.cols.map((col, ci) => (
          <ul key={ci} className="space-y-2.5">
            {col.map((f) => (
              <li key={f} className="flex items-start gap-2 text-subtle text-gray-200">
                <Check className="mt-0.5 size-3.5 shrink-0 text-violet-300" strokeWidth={2.6} />
                {f}
              </li>
            ))}
          </ul>
        ))}
      </div>

      {/* cta */}
      <button
        className={cn(
          "mt-6 w-full rounded-full border py-3 text-small font-medium transition-colors",
          plan.featured
            ? "border-transparent bg-white text-ink hover:opacity-90"
            : "border-line bg-gray-800 text-dark-text hover:bg-gray-750",
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
    <section id="pricing" className="bg-gray-900 py-24">
      <Container className="text-center">
        <IconBadge className="bg-gradient-to-br from-violet-600/40 to-gray-800 text-violet-300">
          <Tag className="size-5" />
        </IconBadge>
        <h2 className="mx-auto mt-8 max-w-2xl text-h1 font-medium leading-[1.06] tracking-[-0.02em] text-dark-text">
          Choose the plans that's perfect for your business
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-small text-gray-300">
          Enjoy a 10% annual discount, plus save an extra 10% with 3 users — and
          unlock 20% off starting at 4 users!
        </p>

        {/* billing toggle */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-line bg-gray-800 p-1 text-small">
          <button
            onClick={() => setAnnual(false)}
            className={cn(
              "rounded-full px-4 py-1.5 transition-colors",
              !annual ? "bg-violet-600/25 text-violet-300" : "text-gray-300",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={cn(
              "rounded-full px-4 py-1.5 transition-colors",
              annual ? "bg-violet-600/25 text-violet-300" : "text-gray-300",
            )}
          >
            Annually
          </button>
          <span className="rounded-full bg-white/5 px-3 py-1.5 text-subtle text-gray-400">
            save up -10%
          </span>
        </div>

        {/* dispatcher slider */}
        <div className="mx-auto mt-8 max-w-xl">
          <p className="mb-2 text-small text-gray-200">{count} dispatchers</p>
          <input
            type="range"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-700 accent-violet-600"
            style={{
              background: `linear-gradient(90deg, #9c66e5 ${(count / 10) * 100}%, #2f3136 ${(count / 10) * 100}%)`,
            }}
          />
          <div className="mt-2 flex justify-between text-subtle text-gray-400">
            <span className="rounded-full bg-white/5 px-2 py-0.5">-10% OFF</span>
            <span className="rounded-full bg-white/5 px-2 py-0.5">-20% OFF</span>
          </div>
        </div>

        {/* cards */}
        <div className="mt-14 grid gap-5 text-left lg:grid-cols-4">
          {PLANS.map((p) => (
            <PlanCard key={p.name} plan={p} />
          ))}
        </div>
      </Container>
    </section>
  )
}
