import { COMPATIBILITY } from "@/content/copy"
import { track } from "@/lib/analytics"
import { Container } from "./ui"

/**
 * LH-071 on the flow layout — same content as the desktop Compatibility
 * section, reflowed. Static cards, no marquee (LH-016), no duplicated logos.
 */
export function MobileCompatibility() {
  return (
    <section
      id="compatibility"
      className="relative bg-bg-light py-16"
      aria-labelledby="m-compatibility-title"
    >
      <Container className="flex flex-col items-center">
        <h2
          id="m-compatibility-title"
          className="text-center text-[clamp(26px,6.6vw,32px)] font-medium leading-[1.2] tracking-[-0.03em] text-ink md:text-[40px] md:leading-[48px]"
        >
          {COMPATIBILITY.h2}
        </h2>
        <p className="mt-4 text-center text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink/70">
          {COMPATIBILITY.note}
        </p>

        <ul className="mt-8 grid w-full grid-cols-1 gap-3 md:grid-cols-3">
          {COMPATIBILITY.platforms.map((p) => {
            const inner = (
              <>
                <img
                  src={p.logo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ width: p.w, height: p.h }}
                  className="opacity-80"
                />
                <span className="text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink">
                  {p.name}
                </span>
              </>
            )
            const cls =
              "flex min-h-[88px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-border-light bg-white px-4 py-5"
            return (
              <li key={p.name}>
                {p.href ? (
                  <a
                    href={p.href}
                    onClick={() => track("compatibility_click", { platform: p.name })}
                    className={cls}
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
      </Container>
    </section>
  )
}
