import { Img } from "@/components/site/Img"
import { Container, SectionHeader } from "./ui"

const ROWS: { label: string; cells: [boolean, boolean, boolean] }[] = [
  { label: "Smart-board view", cells: [true, false, false] },
  { label: "Telegram alerts", cells: [true, false, false] },
  { label: "Integrated TMS", cells: [true, false, false] },
  { label: "Auto-emailing", cells: [true, false, true] },
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

function GlowBg() {
  return (
    <Img
      src="/figma/why-glow.png"
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className="pointer-events-none absolute left-[-3.8%] top-[-48%] h-[157%] w-auto max-w-none"
    />
  )
}

/**
 * "Why LoadHunter" comparison.
 *
 * Phone: the 4-column table reads overloaded at 390px, so each feature gets
 * its own block — the feature name on a full-width line, the three compare
 * cells beneath it under a single shared column header. Tablet (md:) has the
 * room for the desktop-style 4-column grid and sits on the desktop glow;
 * the phone cards go without the beam.
 */
export function MobileWhy() {
  return (
    <section className="relative overflow-hidden bg-gray-800 py-16">
      <Container className="relative">
        <SectionHeader
          icon="/figma/why-icon.png"
          title="Why LoadHunter"
          sub="Measured across real bookings. Based on real dispatcher workflows."
        />

        {/* ---- phone: LoadHunter-focused list as CARDS — no glow beam here,
            the cards read cleaner on their own ---- */}
        <div className="relative mt-10 md:hidden">
          <div className="relative flex flex-col gap-3">
            {ROWS.map((r) => (
              <div
                key={r.label}
                className="flex items-start gap-4 rounded-lg border border-[rgba(229,229,229,0.1)] bg-[rgba(29,31,36,0.75)] px-5 py-5"
              >
                <img
                  src="/figma/table-check.svg"
                  alt="Included in LoadHunter"
                  loading="lazy"
                  decoding="async"
                  className="mt-[-2px] h-[24px] w-7 shrink-0"
                />
                <div>
                  <p className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                    {r.label}
                  </p>
                  <p className="mt-2.5 flex items-center gap-3 text-[13px] font-medium leading-[16px] tracking-[-0.52px] text-ink-2">
                    <span className="flex items-center gap-2.5">
                      Manual{" "}
                      <span aria-hidden className={r.cells[1] ? "text-violet-300" : "text-ink-3"}>
                        {r.cells[1] ? "✓" : "✕"}
                      </span>
                    </span>
                    <span aria-hidden className="text-gray-550">·</span>
                    <span className="flex items-center gap-2.5">
                      Others{" "}
                      <span aria-hidden className={r.cells[2] ? "text-violet-300" : "text-ink-3"}>
                        {r.cells[2] ? "✓" : "✕"}
                      </span>
                    </span>
                  </p>
                </div>
              </div>
            ))}

            <div className="rounded-lg border border-[rgba(229,229,229,0.1)] bg-[rgba(29,31,36,0.75)] px-5 py-5">
              <p className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                {SPEED_ROW[0]}
              </p>
              <p
                data-countup
                className="mt-2 text-[26px] font-medium leading-[32px] tracking-[-1.04px] text-white [text-shadow:0_0_20px_rgba(156,102,229,0.55)]"
              >
                {SPEED_ROW[1]}
              </p>
              <p className="mt-2.5 flex items-center gap-3 text-[13px] font-medium leading-[16px] tracking-[-0.52px] text-ink-2">
                <span>Manual {SPEED_ROW[2]}</span>
                <span aria-hidden className="text-gray-550">·</span>
                <span>Others {SPEED_ROW[3]}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ---- tablet + laptop: desktop-style 4-column table (capped width so
            it never stretches thin on wide laptops) ---- */}
        <div className="relative mt-10 hidden md:block lg:mx-auto lg:mt-16 lg:max-w-[1040px]">
          <GlowBg />
          <div className="relative">
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-3.5">
              <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
                Feature
              </span>
              <Img
                src="/figma/table-logo.svg"
                alt="LoadHunter"
                loading="lazy"
                decoding="async"
                className="mx-auto h-[14px] w-[69px]"
              />
              <span className="text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
                Manual
              </span>
              <span className="text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
                Others
              </span>
            </div>

            {ROWS.map((r) => (
              <div key={r.label}>
                <div className="h-px w-full" style={DASH} />
                <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-4">
                  <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                    {r.label}
                  </span>
                  {r.cells.map((ok, i) => (
                    <Cell key={i} ok={ok} />
                  ))}
                </div>
              </div>
            ))}

            <div className="h-px w-full" style={DASH} />
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr] items-center gap-2 py-4">
              <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                {SPEED_ROW[0]}
              </span>
              <span
                data-countup
                className="text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white [text-shadow:0_0_18px_rgba(156,102,229,0.55)]"
              >
                {SPEED_ROW[1]}
              </span>
              <span className="text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
                {SPEED_ROW[2]}
              </span>
              <span className="text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
                {SPEED_ROW[3]}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
