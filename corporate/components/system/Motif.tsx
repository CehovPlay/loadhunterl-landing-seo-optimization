import type { PageArt } from "@/content/art"

/**
 * The recurring object.
 *
 * cosmoq anchors every second section with the same gradient sphere, and that
 * repetition is what stops a long page from feeling like a list. One object,
 * many contexts, always lit the same way.
 *
 * Repeating a single sphere across 47 pages would do the opposite, though - it
 * would flatten five distinct products into one brand texture. So the sphere
 * stays the house motif and six siblings share its light: same warm-to-cool
 * axis, same contact shadow, different geometry. A visitor who lands on
 * /huntpay from search should see a different object than on /huntdrive, and
 * still recognise both as this site.
 *
 * Everything here is CSS and inline SVG - no images. These render behind copy
 * at large sizes, and a raster at 2x for a 640px sphere is a wasted megabyte
 * against an LCP budget of 2.5s.
 */

const STROKE = "rgba(111, 81, 151, 0.35)"
const STROKE_SOFT = "rgba(18, 19, 23, 0.1)"

/** The house sphere. Lit upper-left, warm limb low-left, cool limb low-right. */
function Orb({ className = "" }: { className?: string }) {
  return <div aria-hidden className={"orb rounded-full " + className} />
}

/** A road: the operating trail, as a line that bends and carries stops. */
function Trail({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={className} fill="none">
      <defs>
        <linearGradient id="m-trail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb352" />
          <stop offset="55%" stopColor="#6f5197" />
          <stop offset="100%" stopColor="#c79ffd" />
        </linearGradient>
      </defs>
      <path
        d="M28 292C28 214 96 206 160 178s96-44 96-122"
        stroke="url(#m-trail)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {[
        [28, 292],
        [104, 214],
        [160, 178],
        [226, 128],
        [256, 56],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i === 2 ? 7 : 4.5}
          fill="#fafafa"
          stroke={STROKE}
          strokeWidth="2"
        />
      ))}
    </svg>
  )
}

/** A lattice: the control surface, where everything is a cell you can inspect. */
function Grid({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={className} fill="none">
      {Array.from({ length: 7 }, (_, r) =>
        Array.from({ length: 7 }, (_, c) => {
          const lit = (r === 2 && c === 4) || (r === 4 && c === 1) || (r === 5 && c === 5)
          return (
            <rect
              key={`${r}-${c}`}
              x={20 + c * 42}
              y={20 + r * 42}
              width="32"
              height="32"
              rx="7"
              fill={lit ? "rgba(255, 179, 82, 0.55)" : "rgba(18, 19, 23, 0.035)"}
              stroke={lit ? "rgba(150, 99, 26, 0.4)" : STROKE_SOFT}
            />
          )
        }),
      )}
    </svg>
  )
}

/** A cycle: five products closing one loop. Find, run, move, get paid, control. */
function Ring({ className = "" }: { className?: string }) {
  const R = 108
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={className} fill="none">
      <defs>
        <linearGradient id="m-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb352" />
          <stop offset="100%" stopColor="#c79ffd" />
        </linearGradient>
      </defs>
      <circle cx="160" cy="160" r={R} stroke="url(#m-ring)" strokeWidth="2.5" />
      <circle cx="160" cy="160" r={R - 34} stroke={STROKE_SOFT} strokeDasharray="3 7" />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2
        return (
          <circle
            key={i}
            cx={160 + Math.cos(a) * R}
            cy={160 + Math.sin(a) * R}
            r="11"
            fill="#ffffff"
            stroke={STROKE}
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
}

/** A ledger: money, kept in rows that stay attached to the load. */
function Ledger({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={className} fill="none">
      <rect x="42" y="44" width="236" height="232" rx="16" fill="#ffffff" stroke={STROKE_SOFT} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect
            x="64"
            y={78 + i * 28}
            width={i === 3 ? 118 : 92 + ((i * 23) % 60)}
            height="7"
            rx="3.5"
            fill={i === 3 ? "rgba(255, 179, 82, 0.75)" : "rgba(18, 19, 23, 0.08)"}
          />
          <rect
            x="216"
            y={78 + i * 28}
            width="40"
            height="7"
            rx="3.5"
            fill={i === 3 ? "rgba(111, 81, 151, 0.5)" : "rgba(18, 19, 23, 0.06)"}
          />
        </g>
      ))}
    </svg>
  )
}

/** A signal: one clear reading pulled out of noise. */
function Signal({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={className} fill="none">
      {Array.from({ length: 22 }, (_, i) => {
        const h = 14 + ((i * 37) % 96)
        const lit = i === 13
        return (
          <rect
            key={i}
            x={26 + i * 12}
            y={200 - (lit ? 150 : h)}
            width="4"
            height={lit ? 150 : h}
            rx="2"
            fill={lit ? "#6f5197" : "rgba(18, 19, 23, 0.09)"}
          />
        )
      })}
      <circle cx="182" cy="44" r="9" fill="#ffb352" />
      <circle cx="182" cy="44" r="20" stroke="rgba(255, 179, 82, 0.45)" />
    </svg>
  )
}

/** A prism: one input, several qualified outputs. Proof and discovery pages. */
function Prism({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 320 320" className={className} fill="none">
      <defs>
        <linearGradient id="m-prism" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb352" />
          <stop offset="100%" stopColor="#c79ffd" />
        </linearGradient>
      </defs>
      <path d="M96 44 L232 160 L96 276 Z" fill="url(#m-prism)" opacity="0.16" />
      <path d="M96 44 L232 160 L96 276 Z" stroke={STROKE} strokeWidth="2" />
      <path d="M14 160 H96" stroke="rgba(18, 19, 23, 0.35)" strokeWidth="2" strokeLinecap="round" />
      {[104, 138, 172, 206].map((y, i) => (
        <path
          key={y}
          d={`M232 160 L308 ${y}`}
          stroke={i === 1 ? "#6f5197" : STROKE_SOFT}
          strokeWidth={i === 1 ? 2.5 : 1.5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

const SHAPES = { orb: Orb, trail: Trail, grid: Grid, ring: Ring, ledger: Ledger, signal: Signal, prism: Prism }

export function Motif({
  kind,
  className = "",
}: {
  kind: PageArt["motif"]
  className?: string
}) {
  const Shape = SHAPES[kind]
  return <Shape className={className} />
}
