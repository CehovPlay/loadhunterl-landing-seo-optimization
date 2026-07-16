import { Img } from "@/components/site/Img"
import { Container, SectionHeader } from "./ui"

const ROWS: { label: string; cells: [boolean, boolean, boolean] }[] = [
  { label: "Smart - board view", cells: [true, false, false] },
  { label: "Telegram alerts", cells: [true, false, false] },
  { label: "Integrated TMS", cells: [true, false, false] },
  { label: "Auto - emailing", cells: [true, false, true] },
]

const SPEED_ROW = ["Booking speed", "47 seconds", "~ 2-3 minutes", "~1 minute"] as const

/* desktop hairline: repeating 4px dash of white/12 */
const DASH = {
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 4px, transparent 4px 8px)",
}

function Cell({ ok }: { ok: boolean }) {
  return ok ? (
    <img
      src="/figma/table-check.svg"
      alt="Included"
      loading="lazy"
      decoding="async"
      className="mx-auto h-[28px] w-8"
    />
  ) : (
    <img
      src="/figma/table-cross.svg"
      alt="Not included"
      loading="lazy"
      decoding="async"
      className="mx-auto h-3 w-3.5"
    />
  )
}

/**
 * Mobile "Why LoadHunter": the desktop comparison table compacted — same
 * why-glow.png panel behind it and the same dashed hairlines between rows
 * (no extra card chrome), 4 columns: feature | loadhunter | Manual | Others.
 */
export function MobileWhy() {
  return (
    <section className="relative overflow-hidden bg-gray-800 py-16">
      <Container className="relative">
        {/* the desktop glow panel, centered behind the table */}
        <Img
          src="/figma/why-glow.png"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute left-1/2 top-[150px] w-[560px] max-w-none -translate-x-1/2"
        />

        <SectionHeader
          icon="/figma/why-icon.png"
          title="Why LoadHunter"
          sub="Measured across real bookings. Based on real dispatcher workflows."
        />

        <div className="relative mt-10">
          {/* header row */}
          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-3.5">
            <span className="text-[13px] font-medium tracking-[-0.01em] text-ink-2">Feature</span>
            <Img
              src="/figma/table-logo.svg"
              alt="loadhunter"
              loading="lazy"
              decoding="async"
              className="mx-auto h-[14px] w-[69px]"
            />
            <span className="text-center text-[13px] font-medium text-ink-2">Manual</span>
            <span className="text-center text-[13px] font-medium text-ink-2">Others</span>
          </div>

          {ROWS.map((r) => (
            <div key={r.label}>
              <div className="h-px w-full" style={DASH} />
              <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-4">
                <span className="text-[14px] font-medium leading-[19px] tracking-[-0.02em] text-white">
                  {r.label}
                </span>
                {r.cells.map((ok, i) => (
                  <Cell key={i} ok={ok} />
                ))}
              </div>
            </div>
          ))}

          {/* speed row */}
          <div className="h-px w-full" style={DASH} />
          <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-4">
            <span className="text-[14px] font-medium leading-[19px] tracking-[-0.02em] text-white">
              {SPEED_ROW[0]}
            </span>
            <span
              data-countup
              className="text-center text-[13px] font-medium leading-[16px] text-white"
            >
              {SPEED_ROW[1]}
            </span>
            <span className="text-center text-[12px] leading-[15px] text-ink-2">{SPEED_ROW[2]}</span>
            <span className="text-center text-[12px] leading-[15px] text-ink-2">{SPEED_ROW[3]}</span>
          </div>
        </div>
      </Container>
    </section>
  )
}
