/**
 * Figma: Group 2085665217 (926:101885) — heading block @ y=12138 (1084 @ x=418),
 * glow "image 60" 1084x758 @ (418,12258), comparison table "Timeline container"
 * 1084x540 @ (416,12476). Section spans page y 12018–13136 (h=1118).
 * The rounded panel of the table is painted by the glow image; the HTML table
 * renders only text, icons and hairlines on top.
 */

type CellIcon = "check" | "cross"

const ROWS: { label: string; cells: CellIcon[] }[] = [
  { label: "Smart - board view", cells: ["check", "cross", "cross"] },
  { label: "Telegram alerts", cells: ["check", "cross", "cross"] },
  { label: "Integrated TMS", cells: ["check", "cross", "cross"] },
  { label: "Auto - emailing", cells: ["check", "cross", "check"] },
]

const SPEED_ROW = ["Booking speed", "47 seconds", "~ 2-3 minutes", "~1 minute"]

export function WhyLoadHunter() {
  return (
    <section className="relative h-[1118px] bg-gray-800">
      {/* panel glow + rounded panel background — FIRST in DOM: the export is
          fully opaque (baked #181A1F bg) and would cover the heading otherwise */}
      <img loading="lazy" decoding="async"
        src="/figma/why-glow.png"
        alt=""
        aria-hidden
        className="absolute left-[375px] top-[198px] w-[1172px] max-w-none"
      />

      {/* heading */}
      <div data-float className="absolute left-[928px] top-[120px] size-[64px]">
        <img loading="lazy" decoding="async"
          src="/figma/tools/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2 className="absolute left-[418px] top-[244px] w-[1084px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        Why LoadHunter
      </h2>
      <p className="absolute left-[418px] top-[322px] w-[1084px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Measured across real bookings. Based on real dispatcher workflows.
      </p>

      {/* comparison table */}
      <div className="absolute left-[416px] top-[458px] h-[540px] w-[1084px]">
        {/* header */}
        <div className="absolute left-[40px] top-[40px] flex h-[40px] w-[1004px]">
          <div className="w-[251px] pt-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            Feature
          </div>
          <div className="flex w-[251px] justify-center pt-[7px]">
            <img loading="lazy" decoding="async"
              src="/figma/table-logo.svg"
              alt="loadhunter"
              className="h-[26.17px] w-[132.71px]"
            />
          </div>
          <div className="w-[251px] pt-[12px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            Manual
          </div>
          <div className="w-[251px] pt-[12px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            Others
          </div>
        </div>

        {ROWS.map((row, i) => (
          <div key={row.label}>
            {/* hairline above each row */}
            <div
              className="absolute left-[40px] h-px w-[1004px]"
              style={{ top: 100 + i * 84, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 4px, transparent 4px 8px)" }}
            />
            <div
              className="absolute left-[40px] flex h-[44px] w-[1004px]"
              style={{ top: 120 + i * 84 }}
            >
              <div className="w-[251px] pt-[12px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                {row.label}
              </div>
              {row.cells.map((c, j) => (
                <div key={j} className="relative w-[251px]">
                  {c === "check" ? (
                    // vector check with its glow filter — replaces the old PNG
                    // whose baked panel background leaked through blend modes
                    <img loading="lazy" decoding="async"
                      src="/figma/table-check.svg"
                      alt="yes"
                      className="absolute left-[99px] top-[-0.6px] w-[53px] max-w-none"
                    />
                  ) : (
                    <img loading="lazy" decoding="async"
                      src="/figma/table-cross.svg"
                      alt="no"
                      className="absolute left-[116.2px] top-[14px] h-[16px] w-[18.57px]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* speed row */}
        <div
          className="absolute left-[40px] top-[436px] h-px w-[1004px]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0 4px, transparent 4px 8px)",
          }}
        />
        <div className="absolute left-[40px] top-[456px] flex h-[44px] w-[1004px]">
          {SPEED_ROW.map((t, j) => (
            <div
              key={t}
              data-countup={j === 1 ? "" : undefined}
              className={
                "w-[251px] pt-[12px] text-[16px] font-medium leading-[20px] tracking-[-0.64px]" +
                (j === 0 ? " text-white" : " text-center text-gray-100")
              }
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
