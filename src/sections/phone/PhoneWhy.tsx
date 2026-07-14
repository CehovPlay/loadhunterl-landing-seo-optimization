/**
 * Figma: section spans phone-frame y 8206..9095 (h=889).
 * Glow "image 60" (916:72375) @2x export renders 255x708; aligned at (0,-44).
 * Heading + comparison table = Frame 2147238684 (916:72273) @ (-2,8307):
 * icon 64 @ (161,101), title @ y205, subtitle @ y253, Timeline container
 * (916:72296) @ (12,365) 362x404 — rounded-12 panel, p-12, gap-12, radial
 * tint (rgba(53,50,70) @ 0.6) from top-left, dashed hairlines between rows.
 */

const PANEL_BG = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 362 404' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='0.6'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(17.701 32.47 7.2794 59.832 55.808 0)'><stop stop-color='rgba(53,50,70,1)' offset='0'/><stop stop-color='rgba(53,50,70,0)' offset='1'/></radialGradient></defs></svg>")`

type Cell = "check" | "check-wide" | "cross"

const ROWS: { label: string; cells: Cell[] }[] = [
  { label: "Smart - board view", cells: ["check", "cross", "cross"] },
  { label: "Telegram alerts", cells: ["check", "cross", "cross"] },
  { label: "Integrated TMS", cells: ["check", "cross", "cross"] },
  { label: "Auto - emailing", cells: ["check", "cross", "check-wide"] },
]

const SPEED = [
  ["47", "seconds"],
  ["~ 2-3", "minutes"],
  ["~1", "minute"],
]

function CellIcon({ kind }: { kind: Cell }) {
  if (kind === "cross") {
    return (
      <div className="relative h-[12px] w-[13.93px] opacity-50">
        <img loading="lazy" decoding="async"
          src="/figma/phone/why-cross.svg"
          alt="no"
          className="absolute left-[-0.75px] top-[-0.75px] h-[13.5px] w-[15.43px] max-w-none"
        />
      </div>
    )
  }
  const wide = kind === "check-wide"
  return (
    <div className="relative h-[12px]" style={{ width: wide ? 18 : 17 }}>
      <img loading="lazy" decoding="async"
        src={wide ? "/figma/phone/why-check2.svg" : "/figma/phone/why-check.svg"}
        alt="yes"
        className="absolute left-[-14px] top-[-14px] h-[40px] max-w-none"
        style={{ width: wide ? 46 : 45 }}
      />
    </div>
  )
}

function Hairline() {
  return (
    <div className="relative h-0 w-full">
      <img loading="lazy" decoding="async"
        src="/figma/phone/line-456.svg"
        alt=""
        aria-hidden
        className="absolute left-0 top-[-1px] h-px w-full max-w-none"
      />
    </div>
  )
}

export function PhoneWhy() {
  return (
    <section className="relative overflow-hidden bg-gray-800" style={{ height: 889 }}>
      {/* violet glow behind icon + panel — 2x export of image 60 */}
      <img loading="lazy" decoding="async"
        src="/figma/phone/why-glow.png"
        alt=""
        aria-hidden
        className="absolute left-0 top-[-44px] w-[255px] max-w-none"
      />

      {/* figma icon */}
      <div data-float className="absolute left-[161px] top-[101px] size-[64px]">
        <img loading="lazy" decoding="async"
          src="/figma/tools/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <h2 className="absolute left-[12px] top-[205px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-white">
        Why LoadHunter
      </h2>
      <p className="absolute left-[12px] top-[253px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Measured across real bookings. Based on real dispatcher workflows.
      </p>

      {/* comparison table */}
      <div
        className="absolute left-[12px] top-[365px] flex h-[404px] w-[362px] flex-col gap-[12px] overflow-hidden rounded-[12px] p-[12px] backdrop-blur-[100px]"
        style={{ backgroundImage: PANEL_BG }}
      >
        {/* header */}
        <div className="flex h-[40px] w-full items-center">
          <p className="w-[120px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
            Feature
          </p>
          <div className="flex min-w-px flex-1 items-center justify-center">
            <img loading="lazy" decoding="async"
              src="/figma/phone/why-table-icon.svg"
              alt="loadhunter"
              className="h-[16px] w-[16.92px] max-w-none"
            />
          </div>
          <p className="min-w-px flex-1 text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-white opacity-50">
            Manual
          </p>
          <p className="min-w-px flex-1 text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-white opacity-50">
            Others
          </p>
        </div>

        {ROWS.map((row) => (
          <div key={row.label} className="contents">
            <Hairline />
            <div className="flex h-[44px] w-full items-center">
              <p className="w-[120px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
                {row.label}
              </p>
              {row.cells.map((c, j) => (
                <div key={j} className="flex min-w-px flex-1 items-center justify-center">
                  <CellIcon kind={c} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <Hairline />
        <div className="flex h-[44px] w-full items-center">
          <p className="w-[120px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
            Booking speed
          </p>
          {SPEED.map(([a, b]) => (
            <div
              key={b}
              className="min-w-px flex-1 text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white"
            >
              {a}
              <br />
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
