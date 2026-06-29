import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/**
 * Reusable loadboard app window used across the "tools" feature blocks.
 * Compact, faithful representation of the LoadHunter board UI.
 */

const ROWS = [
  { age: "26m", date: "03/06", trip: "175 mi", from: "Romeoville, IL", dh: "208", to: "Northstar Logistics", st: "V2", ph: "(773) 808-9981" },
  { age: "34m", date: "03/06", trip: "412 mi", from: "Columbus, GA", dh: "33", to: "Fine Ridge Freight", st: "33", ph: "(773) 808-9981" },
  { age: "41m", date: "03/06", trip: "603 mi", from: "Grand Prairie, TX", dh: "208", to: "BlueRiver Transport", st: "V2", ph: "(773) 808-9981" },
  { age: "58m", date: "03/07", trip: "448 mi", from: "Hamptn, TX", dh: "76", to: "Summit Lane Brokers", st: "33", ph: "(773) 808-9981" },
  { age: "1h", date: "03/07", trip: "131 mi", from: "Detroit, MI", dh: "208", to: "IronGate Logistics", st: "V2", ph: "(773) 808-9981" },
  { age: "1h", date: "03/08", trip: "920 mi", from: "St. Louis, MO", dh: "44", to: "Pioneer Freight", st: "33", ph: "(773) 808-9981" },
]

const COLS = ["Age ↓", "Pick up", "Trip", "Origin", "DH-O", "Destination", "Track", "Contact"]

export function LoadboardWindow({
  className,
  overlay,
}: {
  className?: string
  overlay?: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-line bg-gray-900 shadow-2xl shadow-black/60",
        className,
      )}
    >
      {/* top filter dropdowns */}
      <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
        <span className="flex items-center gap-1.5 rounded-md border border-line bg-gray-800 px-2.5 py-1.5 text-[10px] text-gray-200">
          <span className="size-3 rounded bg-violet-600/40" />
          email.logistics@…
        </span>
        <span className="rounded-md border border-line bg-gray-800 px-2.5 py-1.5 text-[10px] text-gray-300">
          Template email…
        </span>
        <span className="ml-auto rounded-md border border-line bg-gray-800 px-2 py-1.5 text-[10px] text-gray-300">
          ⋯
        </span>
      </div>

      {/* origin / destination / equipment row */}
      <div className="grid grid-cols-4 gap-2 border-b border-line px-3 py-2.5">
        {[
          ["Origin", "Columbus, OH"],
          ["Destination", "Anywhere"],
          ["Equipment Type", "Vans (Standard)"],
          ["Load Size", "Full & Partial"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md border border-line bg-black/20 px-2 py-1.5">
            <p className="text-[8px] text-gray-400">{k}</p>
            <p className="mt-0.5 text-[10px] text-gray-200">{v}</p>
          </div>
        ))}
      </div>

      {/* toolbar */}
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2 text-[9px]">
        {["Filters", "Hide", "States", "Brokers"].map((t) => (
          <span key={t} className="rounded border border-line bg-white/[0.03] px-2 py-1 text-gray-300">
            {t}
          </span>
        ))}
        <span className="rounded border border-violet-600/40 bg-violet-600/15 px-2 py-1 text-violet-300">
          Auto Emailing
        </span>
        <span className="ml-auto rounded border border-line bg-white/[0.03] px-2 py-1 text-gray-300">
          ⟳ Refresh
        </span>
      </div>

      {/* table header */}
      <div className="grid grid-cols-[40px_44px_44px_1fr_36px_1fr_40px_84px] gap-2 border-b border-line px-3 py-2 text-[8px] uppercase tracking-wide text-gray-400">
        {COLS.map((c) => (
          <span key={c} className="truncate">
            {c}
          </span>
        ))}
      </div>

      {/* rows */}
      <div className="divide-y divide-line">
        {ROWS.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-[40px_44px_44px_1fr_36px_1fr_40px_84px] items-center gap-2 px-3 py-2.5 text-[9px]"
          >
            <span className="text-gray-300">{r.age}</span>
            <span className="text-gray-300">{r.date}</span>
            <span className="text-gray-300">{r.trip}</span>
            <span className="flex items-center gap-1 text-gray-200">
              <span className="size-1 rounded-full bg-emerald" />
              {r.from}
            </span>
            <span className="text-gray-400">{r.dh}</span>
            <span className="truncate text-gray-200">{r.to}</span>
            <span className="rounded bg-white/[0.04] px-1 py-0.5 text-center text-[8px] text-gray-300">
              {r.st}
            </span>
            <span className="text-right text-gray-300">{r.ph}</span>
          </div>
        ))}
      </div>

      {overlay}
    </div>
  )
}
