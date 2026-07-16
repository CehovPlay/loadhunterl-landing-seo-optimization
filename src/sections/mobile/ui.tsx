/**
 * Shared primitives for the mobile flow layout.
 *
 * Conventions (mobile design system, aligned to the desktop ramp):
 *  - content column: px-5 gutters, capped at 440px and centered
 *  - section rhythm: py-16 (64px) between major bands
 *  - touch targets: ≥48px for buttons and rows (Apple HIG 44pt minimum)
 *  - type: Inter Medium only (like desktop) with the desktop's uniform −4%
 *    letter-spacing — tracking-[-0.04em] / the px equivalents (-0.56px @14,
 *    -0.64px @16) everywhere; multiline body copy gets +2px leading over the
 *    desktop pairs for small-screen readability
 */

export const PILL_SHADOW =
  "0px 1px 0px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05), 0px 10px 10px rgba(0,0,0,0.1)"

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
          <img src={icon} alt="" loading="lazy" decoding="async" className="w-full" />
        </div>
      )}
      <h2
        className={`text-[clamp(28px,7.7vw,34px)] font-medium leading-[1.2] tracking-[-0.04em] ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-3 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
          {sub}
        </p>
      )}
    </div>
  )
}

type PillVariant = "glass" | "violet-radial" | "white" | "violet"

/**
 * 48px-tall full-width pill button with the EXACT desktop skins:
 *  - glass         — hero "Start free trial": white→50% gradient, white border,
 *                    backdrop blur, pill shadow
 *  - violet-radial — hero "Start booking": bottom violet radial, white border,
 *                    violet drop glow
 *  - white         — navbar "Get Demo": solid white, #ececec border
 *  - violet        — navbar "Add to Chrome": solid #6f5197
 */
export function PillButton({
  href,
  variant,
  children,
  className = "",
}: {
  href: string
  variant: PillVariant
  children: React.ReactNode
  className?: string
}) {
  const base =
    "flex h-12 w-full items-center justify-center gap-2 rounded-[99px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] transition-transform active:scale-[0.98]"
  const skin: Record<PillVariant, { cls: string; style: React.CSSProperties }> = {
    glass: {
      cls: "border border-white text-[#454545] backdrop-blur-[10px]",
      style: {
        backgroundImage: "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5))",
        boxShadow: PILL_SHADOW,
      },
    },
    "violet-radial": {
      cls: "border border-white text-white",
      style: {
        backgroundImage:
          "radial-gradient(60% 140% at 50% 110%, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)",
        boxShadow: "0px 34px 74px -20px rgba(111,81,151,0.5)",
      },
    },
    white: {
      cls: "border border-[#ececec] bg-white text-[#454545]",
      style: { boxShadow: PILL_SHADOW },
    },
    violet: {
      cls: "bg-[#6f5197] text-white",
      style: { boxShadow: PILL_SHADOW },
    },
  }
  const s = skin[variant]
  return (
    <a href={href} className={`${base} ${s.cls} ${className}`} style={s.style}>
      {children}
    </a>
  )
}

/** Desktop hero star rating: gray track, violet fill clipped to the score. */
export function Stars({ score, className = "" }: { score: number; className?: string }) {
  return (
    <span
      className={`relative inline-flex leading-none tracking-[2px] ${className}`}
      role="img"
      aria-label={`Rated ${score} out of 5`}
    >
      <span className="text-[#c9c9c9]">★★★★★</span>
      <span
        aria-hidden
        className="absolute inset-0 overflow-hidden whitespace-nowrap text-[#6f5197]"
        style={{ width: `${(score / 5) * 100}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}
