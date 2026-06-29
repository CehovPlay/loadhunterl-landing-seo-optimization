import { Settings } from "lucide-react"

export function DispatchIntro() {
  return (
    <section className="relative flex h-[1146px] flex-col items-center bg-[#18191f] pt-[400px]">
      {/* icon badge */}
      <span
        className="flex size-12 items-center justify-center rounded-[14px] border border-[#ffffff1a] bg-[#1d1f24] text-violet-300"
        style={{
          boxShadow:
            "0px 6px 16px -6px rgba(111,81,151,0.45), inset 0px 0px 1px 0px #6f5197, inset 0px 0px 12px 0px rgba(111,81,151,0.12)",
        }}
      >
        <Settings className="size-5" />
      </span>

      {/* heading */}
      <h2 className="mt-[52px] max-w-[1320px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-[#e8e8e8]">
        Book better loads faster — without missing opportunities with
        game-changing tools for dispatchers
      </h2>

      {/* subtext */}
      <p className="mt-[14px] max-w-[1520px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#686b6f]">
        LoadHunter finds high-RPM loads in real-time, filters the noise, and lets
        you contact brokers instantly — all in one place. Real-time load
        scanning, smart filters, and instant outreach — built for dispatchers who
        want results, not dashboards.
      </p>
    </section>
  )
}
