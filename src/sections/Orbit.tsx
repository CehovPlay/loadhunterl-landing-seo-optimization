import { LogoMark } from "@/components/site/Logo"

const LABELS: { t: string; x: number; y: number }[] = [
  { t: "Maximize your RPM", x: 7.9, y: 3.5 },
  { t: "No more spreadsheets", x: 27.6, y: 2.2 },
  { t: "Live data stream", x: 50, y: 6.7 },
  { t: "Verified brokers only", x: 71.8, y: 2.2 },
  { t: "Start booking now", x: 94.5, y: 12 },
  { t: "Get your first load today", x: 20.8, y: 36 },
  { t: "One-click booking", x: 32.9, y: 46 },
  { t: "Instant notifications", x: 68.2, y: 46 },
  { t: "Upgrade your dispatching", x: 78.8, y: 33 },
  { t: "Scalable fleet growth", x: 3.6, y: 56.5 },
  { t: "Zero wasted miles", x: 95.9, y: 62 },
  { t: "Book faster in 30 seconds", x: 23, y: 79 },
  { t: "Stop missing loads", x: 39.7, y: 83 },
  { t: "Fast calculations", x: 62, y: 76.5 },
  { t: "Higher RPM only", x: 76.6, y: 82 },
]

export function Orbit() {
  return (
    <section className="relative h-[778px] overflow-hidden bg-[#fafafa]">
      {/* concentric rings centered on the mark */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[180, 360, 560, 780, 1020, 1280].map((d) => (
          <div
            key={d}
            style={{ width: d, height: d }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0000000d]"
          />
        ))}
      </div>

      {/* center mark */}
      <div className="absolute left-1/2 top-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8e8e8] bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.15)]">
        <LogoMark className="size-8 text-[#454545]" />
      </div>

      {/* labels */}
      {LABELS.map((l) => (
        <span
          key={l.t}
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[#e8e8e8] bg-white px-3.5 py-2 text-[13px] font-medium tracking-[-0.52px] text-[#686b6f] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)]"
        >
          {l.t}
        </span>
      ))}
    </section>
  )
}
