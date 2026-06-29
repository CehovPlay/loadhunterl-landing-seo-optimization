import { Container } from "@/components/site/Container"
import { IconBadge } from "@/components/site/IconBadge"
import { LogoMark } from "@/components/site/Logo"
import { Check, X, Sparkles } from "lucide-react"

type Cell = boolean | string

const ROWS: { feature: string; lh: Cell; manual: Cell; others: Cell }[] = [
  { feature: "Smart - board view", lh: true, manual: false, others: false },
  { feature: "Telegram alerts", lh: true, manual: false, others: false },
  { feature: "Integrated TMS", lh: true, manual: false, others: false },
  { feature: "Auto - emailing", lh: true, manual: false, others: true },
  { feature: "Booking speed", lh: "47 seconds", manual: "~ 2-3 minutes", others: "~1 minute" },
]

function Mark({ value, accent }: { value: Cell; accent?: boolean }) {
  if (typeof value === "string")
    return <span className="text-small text-gray-200">{value}</span>
  return value ? (
    <Check
      className={accent ? "mx-auto size-5 text-violet-300" : "mx-auto size-5 text-gray-200"}
      strokeWidth={2.4}
    />
  ) : (
    <X className="mx-auto size-5 text-gray-500" strokeWidth={2.4} />
  )
}

export function WhyLoadHunter() {
  return (
    <section id="why-lh" className="bg-gray-900 py-24">
      <Container className="text-center">
        <IconBadge>
          <Sparkles className="size-5" />
        </IconBadge>
        <h2 className="mx-auto mt-8 text-h2 font-medium tracking-[-0.02em] text-dark-text">
          Why LoadHunter
        </h2>
        <p className="mt-3 text-small text-gray-300">
          Measured across real bookings. Based on real dispatcher workflows.
        </p>

        <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-gray-800/60 to-gray-900">
          {/* header */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center border-b border-line px-6 py-4 text-small">
            <span className="text-left text-gray-400">Feature</span>
            <span className="flex items-center justify-center gap-1.5 font-medium text-dark-text">
              <LogoMark className="size-4" /> loadhunter
            </span>
            <span className="text-gray-400">Manual</span>
            <span className="text-gray-400">Others</span>
          </div>

          {/* rows */}
          <div className="divide-y divide-line">
            {ROWS.map((r) => (
              <div
                key={r.feature}
                className="grid grid-cols-[1.6fr_1fr_1fr_1fr] items-center px-6 py-5"
              >
                <span className="text-left text-small text-gray-200">
                  {r.feature}
                </span>
                <span className="text-center">
                  <Mark value={r.lh} accent />
                </span>
                <span className="text-center">
                  <Mark value={r.manual} />
                </span>
                <span className="text-center">
                  <Mark value={r.others} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
