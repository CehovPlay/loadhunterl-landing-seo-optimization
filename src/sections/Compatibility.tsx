import { COMPATIBILITY } from "@/content/copy"
import { track } from "@/lib/analytics"

/**
 * LH-071 — compatibility block, placed directly after the hero.
 *
 * Replaces the old partner marquee: LH-016 bans infinite marquees and LH-071
 * bans duplicated logos, so this is a static row of equal-weight platform
 * cards. Each platform that has its own SEO landing page links to it (internal
 * linking, LH-048); TruckSmarter has no page yet, so it renders as a plain
 * badge.
 *
 * The logo files are third-party marks; the independence disclaimer required
 * by LH-050 lives in the footer.
 */
export function Compatibility() {
  return (
    <section
      id="compatibility"
      className="relative w-full bg-bg-light"
      aria-labelledby="compatibility-title"
    >
      <div className="flex w-full flex-col items-center gap-[48px] px-[120px] pb-[96px] pt-[96px]">
        <div className="flex w-full max-w-[900px] flex-col items-center gap-[16px]">
          <h2
            id="compatibility-title"
            className="w-full text-center text-[44px] font-medium leading-[52px] tracking-[-0.03em] text-ink"
          >
            {COMPATIBILITY.h2}
          </h2>
          <p className="w-full text-center text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-ink/70">
            {COMPATIBILITY.note}
          </p>
        </div>

        <ul className="flex items-stretch justify-center gap-[20px]">
          {COMPATIBILITY.platforms.map((p) => {
            const inner = (
              <>
                <img
                  src={p.logo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ width: p.w * 1.35, height: p.h * 1.35 }}
                  className="opacity-80"
                />
                <span className="text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-ink">
                  {p.name}
                </span>
              </>
            )
            const cls =
              "flex h-[132px] w-[300px] flex-col items-center justify-center gap-[16px] rounded-lg border border-border-light bg-white"
            return (
              <li key={p.name}>
                {p.href ? (
                  <a
                    href={p.href}
                    data-lift
                    onClick={() => track("compatibility_click", { platform: p.name })}
                    className={cls + " transition-colors hover:border-violet/40"}
                  >
                    {inner}
                  </a>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
