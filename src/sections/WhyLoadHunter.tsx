import { Sparkles, Check, X } from "lucide-react"
import { LogoMark } from "@/components/site/Logo"

type Cell = boolean | string
const ROWS: { f: string; lh: Cell; manual: Cell; others: Cell }[] = [
  { f: "Smart - board view", lh: true, manual: false, others: false },
  { f: "Telegram alerts", lh: true, manual: false, others: false },
  { f: "Integrated TMS", lh: true, manual: false, others: false },
  { f: "Auto - emailing", lh: true, manual: false, others: true },
  { f: "Booking speed", lh: "47 seconds", manual: "~ 2-3 minutes", others: "~1 minute" },
]

function Mark({ v }: { v: Cell }) {
  if (typeof v === "string")
    return <span className="text-[16px] tracking-[-0.64px] text-[#a3a4a6]">{v}</span>
  return v ? (
    <Check className="mx-auto size-6 text-[#e8e8e8]" strokeWidth={2.2} />
  ) : (
    <X className="mx-auto size-6 text-[#5e5f62]" strokeWidth={2.2} />
  )
}

export function WhyLoadHunter() {
  return (
    <section id="why" className="relative flex flex-col items-center overflow-hidden bg-[#18191f] pb-[170px] pt-[120px]">
      {/* icon */}
      <span
        className="flex size-12 items-center justify-center rounded-[14px] border border-[#ffffff1a] bg-[#1d1f24] text-violet-300"
        style={{ boxShadow: "0px 6px 16px -6px rgba(111,81,151,0.45), inset 0px 0px 12px 0px rgba(111,81,151,0.12)" }}
      >
        <Sparkles className="size-5" />
      </span>

      <h2 className="mt-[66px] text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-[#e8e8e8]">
        Why LoadHunter
      </h2>
      <p className="mt-[18px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#686b6f]">
        Measured across real bookings. Based on real dispatcher workflows.
      </p>

      {/* table */}
      <div className="relative mt-[60px] w-[920px]">
        {/* left glow */}
        <div aria-hidden className="pointer-events-none absolute -left-20 top-1/2 h-[420px] w-[520px] -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="relative rounded-[16px] bg-gradient-to-b from-white/[0.03] to-transparent">
          {/* header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center px-6 py-5 text-[14px] tracking-[-0.56px]">
            <span className="text-[#686b6f]">Feature</span>
            <span className="flex items-center justify-center gap-1.5 font-medium text-[#e8e8e8]">
              <LogoMark className="size-4" /> loadhunter
            </span>
            <span className="text-center text-[#686b6f]">Manual</span>
            <span className="text-center text-[#686b6f]">Others</span>
          </div>
          {/* rows */}
          {ROWS.map((r) => (
            <div
              key={r.f}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center border-t border-dotted border-[#ffffff1f] px-6 py-[18px]"
            >
              <span className="text-[16px] tracking-[-0.64px] text-[#a3a4a6]">{r.f}</span>
              <span className="text-center"><Mark v={r.lh} /></span>
              <span className="text-center"><Mark v={r.manual} /></span>
              <span className="text-center"><Mark v={r.others} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
