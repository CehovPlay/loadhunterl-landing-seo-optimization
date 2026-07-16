import { Img } from "@/components/site/Img"

/**
 * Shared primitives for the mobile flow layout.
 *
 * Conventions (mobile design system):
 *  - content column: px-5 gutters, capped at 440px and centered
 *  - section rhythm: py-16 (64px) between major bands
 *  - touch targets: ≥48px for buttons and rows (Apple HIG 44pt minimum)
 *  - type ramp: h2 28/34, body 15/22, small 13/18 — fluid via clamp where
 *    the copy length varies
 */

export function Container({
  className = "",
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={`mx-auto w-full max-w-[440px] px-5 ${className}`}>{children}</div>
}

/** Centered section header: floating icon plate → h2 → sub copy. */
export function SectionHeader({
  icon,
  title,
  sub,
  dark = true,
}: {
  icon?: string
  title: React.ReactNode
  sub?: string
  dark?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {icon && (
        <div data-float className="mb-5 w-[72px]">
          <Img src={icon} alt="" loading="lazy" decoding="async" className="w-full" />
        </div>
      )}
      <h2
        className={`text-[clamp(26px,7.2vw,32px)] font-medium leading-[1.18] tracking-[-0.035em] ${
          dark ? "text-white" : "text-[#1a1a1a]"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-3 text-[15px] leading-[22px] tracking-[-0.01em] ${
            dark ? "text-ink-2" : "text-ink-2"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  )
}

const PILL_SHADOW =
  "0px 1px 0px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05), 0px 10px 10px rgba(0,0,0,0.1)"

/** 48px-tall full-width pill button. `variant`: light outline vs violet. */
export function PillButton({
  href,
  variant,
  children,
  className = "",
}: {
  href: string
  variant: "light" | "violet"
  children: React.ReactNode
  className?: string
}) {
  const skin =
    variant === "violet"
      ? "bg-[#6f5197] text-white"
      : "border border-[#ececec] bg-white text-[#454545]"
  return (
    <a
      href={href}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-medium tracking-[-0.01em] transition-transform active:scale-[0.98] ${skin} ${className}`}
      style={{ boxShadow: PILL_SHADOW }}
    >
      {children}
    </a>
  )
}

export { PILL_SHADOW }
