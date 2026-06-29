/**
 * Hero product mockup — two layered windows approximating the LoadHunter app:
 *  (back) a loadboard table inside browser chrome
 *  (front) the in-app settings / extensions panel with toggle rows
 * Built as JSX so it stays crisp and themeable. Tokens are exact (Figma).
 */

function Toggle({ on = false }: { on?: boolean }) {
  return (
    <span
      className={`relative inline-block h-3.5 w-6 shrink-0 rounded-full transition-colors ${
        on ? "bg-violet-600" : "bg-white/12"
      }`}
    >
      <span
        className={`absolute top-0.5 size-2.5 rounded-full bg-white transition-all ${
          on ? "left-3" : "left-0.5"
        }`}
      />
    </span>
  )
}

function Row({ label, on }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between py-[7px]">
      <span className="text-subtle text-gray-200">{label}</span>
      <Toggle on={on} />
    </div>
  )
}

const LOADS = [
  { d: "03/06", from: "Columbus, OH", to: "St. Louis, MO", mi: "277", rate: "$1,840" },
  { d: "03/06", from: "Columbus, OH", to: "Dallas, TX", mi: "812", rate: "$2,310" },
  { d: "03/07", from: "Dallas, TX", to: "Detroit, MI", mi: "448", rate: "$1,560" },
  { d: "03/07", from: "St. Louis, MO", to: "Grand Prairie", mi: "131", rate: "$980" },
  { d: "03/08", from: "Detroit, MI", to: "Lancaster, FL", mi: "920", rate: "$2,640" },
]

export function DispatchDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-[760px]">
      {/* BACK WINDOW — loadboard */}
      <div className="overflow-hidden rounded-lg border border-line bg-gray-900 shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-2 flex h-6 flex-1 items-center gap-2 rounded-md border border-line bg-black/30 px-2.5 text-[10px] text-gray-300">
            <span className="size-2.5 rounded-full border border-gray-400" />
            https://loadhunter.tx
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          {["Origin", "Anywhere", "Default eq.", "Filters"].map((f, i) => (
            <span
              key={f}
              className={`rounded-md border px-2 py-1 text-[9px] ${
                i === 3
                  ? "border-violet-600/40 bg-violet-600/15 text-violet-300"
                  : "border-line bg-white/[0.03] text-gray-300"
              }`}
            >
              {f}
            </span>
          ))}
          <span className="ml-auto text-[9px] text-gray-300">73 matches</span>
        </div>

        <div className="grid grid-cols-[48px_1fr_1fr_44px_56px] gap-2 border-b border-line px-3 py-2 text-[9px] uppercase tracking-wide text-gray-300">
          <span>Date</span>
          <span>Origin</span>
          <span>Destination</span>
          <span>Mi</span>
          <span className="text-right">Rate</span>
        </div>

        <div className="divide-y divide-line">
          {LOADS.map((l, i) => (
            <div
              key={i}
              className="grid grid-cols-[48px_1fr_1fr_44px_56px] items-center gap-2 px-3 py-2.5 text-[10px]"
            >
              <span className="text-gray-300">{l.d}</span>
              <span className="text-gray-200">{l.from}</span>
              <span className="text-gray-200">{l.to}</span>
              <span className="text-gray-300">{l.mi}</span>
              <span className="text-right font-medium text-dark-text">{l.rate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FRONT WINDOW — settings / extensions panel */}
      <div className="absolute -right-2 top-10 w-[330px] overflow-hidden rounded-lg border border-line-strong bg-gray-800 shadow-2xl shadow-black/70 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
          <div className="flex items-center gap-1.5 text-subtle font-medium text-dark-text">
            <svg viewBox="0 0 24 24" className="size-3.5 text-dark-text" fill="none">
              <path d="M12 2 3 7.2v9.6L12 22l9-5.2V7.2L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            loadhunter
          </div>
          <span className="flex items-center gap-1.5 text-[9px] text-gray-300">
            <span className="size-4 rounded-full bg-violet-600/30" />
            Alexand…
          </span>
        </div>

        <div className="flex gap-1 border-b border-line px-3 py-2 text-[9px]">
          {["Emails", "Templates", "VoIP", "Settings"].map((t) => (
            <span
              key={t}
              className={`rounded-md px-2 py-1 ${
                t === "Settings"
                  ? "bg-violet-600/20 text-violet-300"
                  : "text-gray-300"
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 px-3.5 py-2">
          <div>
            <Row label="Factoring score" on />
            <Row label="Send email" />
            <Row label="Copy phone" on />
            <Row label="Weather" />
            <Row label="RPM calculator" on />
            <Row label="Open by destination" />
            <Row label="Market conditions" />
          </div>
          <div>
            <Row label="Enable filters" on />
            <Row label="Google map" />
            <Row label="Loadhunter map" on />
            <Row label="Connect telegram" on />
            <Row label="Auto-emailing" />
            <Row label="Average rate" on />
            <Row label="Community Inbox" />
          </div>
        </div>

        <div className="m-3 rounded-md border border-line bg-black/30 p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-dark-text">IronGate Logistics</span>
            <span className="rounded bg-violet-600/20 px-1.5 py-0.5 text-[8px] text-violet-300">87%</span>
          </div>
          <p className="mt-1 text-[8px] text-gray-300">MC #1109347 · (904) 435-9603</p>
        </div>
      </div>
    </div>
  )
}
