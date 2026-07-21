import { Img } from "@/components/site/Img"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { gateLoops } from "@/lib/inview"

/**
 * Fully vector rebuild of the CTA "One click automation" panel (Figma
 * "Timeline / Create load modal / Full view", 914:23949 — 1129x627 @
 * (671, 240) of the section). Replaces the baked bitmap so the beams can
 * run under real layers:
 *
 *   bg radial → dashed lines + dashed rect (SVG, original fade gradients)
 *   → beams (SVG, violet, travel OUTWARD from the rect and dissolve toward
 *   the composition edge exactly like the dashes do — the beam stroke reuses
 *   the same gradient geometry) → heading/central icon → glass balls on top.
 *
 * Path + gradient data exported from Figma (Vectors 6923–6928, both sides).
 * The background is the frame's 0.4-opacity radial pre-blended into the
 * section bg (var(--color-gray-800)) so it fully covers the old bitmap underneath.
 */

interface Line {
  d: string
  /** linearGradient coords in the same local space as `d` */
  g: [number, number, number, number]
  /** last gradient stop keeps the line colour (true) or falls to #3c3c3c */
  fadeSame?: boolean
}

const LEFT: Line[] = [
  { d: "M337.5 266.5H335.921C315.484 266.5 305.265 266.5 296.077 262.694C286.888 258.888 279.662 251.662 265.211 237.211L0 -28", g: [338, 267, 74.1559, -2.1039], fadeSame: true },
  { d: "M337.5 284.5H314.921C294.484 284.5 284.265 284.5 275.077 280.694C265.888 276.888 258.662 269.662 244.211 255.211L-18 -7", g: [338.027, 284.995, 77.6938, 2.43264] },
  { d: "M337.5 303H294.921C274.484 303 264.265 303 255.077 299.194C245.888 295.388 238.662 288.162 224.211 273.711L-51.5 -2", g: [338.076, 303.518, 66.9517, -4.23551] },
  { d: "M337.5 324.5H294.921C274.484 324.5 264.265 324.5 255.077 328.306C245.888 332.112 238.662 339.338 224.211 353.789L-10 588", g: [338.015, 324.053, 107.663, 636.249] },
  { d: "M337.5 343H314.921C294.484 343 284.265 343 275.077 346.806C265.888 350.612 258.662 357.838 244.211 372.289L-19 635.5", g: [338.028, 342.503, 99.4676, 618.303] },
  { d: "M337.5 361H335.921C315.484 361 305.265 361 296.077 364.806C286.888 368.612 279.662 375.838 265.211 390.289L1.5 654", g: [337.998, 360.503, 87.6046, 617.03] },
]

/** right-hand group lives in its own local space, shifted +779px */
const RIGHT: Line[] = [
  { d: "M0.5 266.5H2.07864C22.5162 266.5 32.7349 266.5 41.9235 262.694C51.112 258.888 58.3378 251.662 72.7893 237.211L338 -28", g: [0, 267, 263.844, -2.1039], fadeSame: true },
  { d: "M0.5 284.5H23.0786C43.5162 284.5 53.7349 284.5 62.9235 280.694C72.112 276.888 79.3378 269.662 93.7893 255.211L356 -7", g: [-0.0266842, 284.995, 260.306, 2.43264] },
  { d: "M0.5 303H43.0786C63.5162 303 73.7349 303 82.9235 299.194C92.112 295.388 99.3378 288.162 113.789 273.711L389.5 -2", g: [-0.0763155, 303.518, 271.048, -4.23551] },
  { d: "M0.5 324.5H43.0786C63.5162 324.5 73.7349 324.5 82.9235 328.306C92.112 332.112 99.3378 339.338 113.789 353.789L348 588", g: [-0.0148605, 324.053, 230.337, 636.249] },
  { d: "M0.5 343H23.0786C43.5162 343 53.7349 343 62.9235 346.806C72.112 350.612 79.3378 357.838 93.7893 372.289L357 635.5", g: [-0.0281974, 342.503, 238.532, 618.303] },
  { d: "M0.5 361H2.07864C22.5162 361 32.7349 361 41.9235 364.806C51.112 368.612 58.3378 375.838 72.7893 390.289L336.5 654", g: [0.00217325, 360.503, 250.395, 617.03] },
]

const BALLS: { icon: string; x: number; cy: number; w: number; h: number }[] = [
  { icon: "/figma/cta/icon-email.svg", x: 195, cy: 218, w: 16, h: 16 },
  { icon: "/figma/cta/icon-calculator.svg", x: 235, cy: 314, w: 16, h: 16 },
  { icon: "/figma/cta/icon-timeline.svg", x: 195, cy: 410, w: 16, h: 16 },
  { icon: "/figma/cta/icon-map.svg", x: 839, cy: 218, w: 14.69, h: 16 },
  { icon: "/figma/cta/icon-factoring.svg", x: 819, cy: 314, w: 14, h: 15.47 },
  { icon: "/figma/cta/icon-fleet.svg", x: 839, cy: 410, w: 13.73, h: 16 },
]

const BEAM = 64 // pulse length, px along the path
const DURATION = 2.6 // s — all beams travel out together (synchronous)
const REPEAT_DELAY = 1.6 // s — equal pause between every volley

/* frame radial (0.4 opacity) pre-blended into the section bg var(--color-gray-800) */
const PANEL_BG = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1129 627' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect width='100%' height='100%' fill='url(%23g)'/><defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-20.75 55.45 -64.003 -23.951 686 27)'><stop stop-color='rgb(36,38,43)' offset='0'/><stop stop-color='rgb(30,32,37)' offset='0.5'/><stop stop-color='rgb(24,26,31)' offset='1'/></radialGradient></defs></svg>")`

/* hidden until the effect measures paths and starts the loops */
const IDLE: React.CSSProperties = {
  strokeDasharray: "64 4000",
  strokeDashoffset: -800,
}

function LineDefs({ side, lines }: { side: "l" | "r"; lines: Line[] }) {
  return (
    <defs>
      {lines.map((l, i) => (
        <linearGradient
          key={i}
          id={`cta-${side}${i}`}
          gradientUnits="userSpaceOnUse"
          x1={l.g[0]}
          y1={l.g[1]}
          x2={l.g[2]}
          y2={l.g[3]}
        >
          <stop stopColor="var(--color-ink-3)" />
          <stop offset="1" stopColor={l.fadeSame ? "var(--color-ink-3)" : "#3C3C3C"} stopOpacity="0" />
        </linearGradient>
      ))}
    </defs>
  )
}

function BeamDefs({ side, lines }: { side: "l" | "r"; lines: Line[] }) {
  return (
    <defs>
      {lines.map((l, i) => (
        <linearGradient
          key={i}
          id={`ctab-${side}${i}`}
          gradientUnits="userSpaceOnUse"
          x1={l.g[0]}
          y1={l.g[1]}
          x2={l.g[2]}
          y2={l.g[3]}
        >
          <stop stopColor="var(--color-violet-glow-2)" />
          <stop offset="0.75" stopColor="var(--color-violet-glow)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-violet-glow)" stopOpacity="0" />
        </linearGradient>
      ))}
    </defs>
  )
}

export function CtaAutomation({
  className = "absolute left-[671px] top-[240px]",
}: {
  /** placement wrapper classes — the flow layout renders it `relative` inside
   *  a scale-transformed box instead of the desktop canvas position */
  className?: string
}) {
  const beamsRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const svg = beamsRef.current
    if (!svg) return
    const tweens: gsap.core.Tween[] = []

    svg.querySelectorAll<SVGGElement>("g[data-beam]").forEach((g) => {
      const paths = [...g.querySelectorAll<SVGPathElement>("path")]
      const len = paths[0].getTotalLength()
      paths.forEach((p) => {
        p.style.strokeDasharray = `${BEAM} ${len}`
      })
      // pulse emerges at the rect edge (path start) and travels outward,
      // dimming along the line's own fade gradient until it dissolves.
      // All beams share one duration and one repeat delay (no random offsets)
      // so every volley fires in sync with an even beat between volleys.
      tweens.push(
        gsap.fromTo(
          paths,
          { strokeDashoffset: BEAM },
          {
            strokeDashoffset: -len,
            duration: DURATION,
            ease: "none",
            repeat: -1,
            repeatDelay: REPEAT_DELAY,
          },
        ),
      )
    })

    // pause the beam pulses while the CTA panel is off-screen
    const stopGate = gateLoops(svg, tweens)

    return () => {
      stopGate()
      tweens.forEach((t) => t.kill())
    }
  }, [])

  return (
    <div
      className={`${className} h-[627px] w-[1129px] isolate overflow-hidden rounded-lg`}
      style={{ backgroundImage: PANEL_BG }}
    >
      {/* dashed connectors + centre rect — original geometry and fade gradients */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={1129}
        height={627}
        viewBox="0 0 1129 627"
        fill="none"
      >
        <LineDefs side="l" lines={LEFT} />
        {LEFT.map((l, i) => (
          <path key={i} d={l.d} stroke={`url(#cta-l${i})`} strokeDasharray="2 4" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        <g transform="translate(779 0)">
          <LineDefs side="r" lines={RIGHT} />
          {RIGHT.map((l, i) => (
            <path key={i} d={l.d} stroke={`url(#cta-r${i})`} strokeDasharray="2 4" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
        <defs>
          {/* the rect stroke lives only near the left/right edges, as in Figma */}
          <linearGradient id="cta-rect" gradientUnits="userSpaceOnUse" x1={778} y1={314} x2={338} y2={314}>
            <stop stopColor="var(--color-ink-3)" />
            <stop offset="0.15" stopColor="var(--color-ink-3)" stopOpacity="0" />
            <stop offset="0.9" stopColor="var(--color-ink-3)" stopOpacity="0" />
            <stop offset="1" stopColor="var(--color-ink-3)" />
          </linearGradient>
        </defs>
        <rect
          x={338}
          y={202}
          width={440}
          height={223}
          rx={50}
          stroke="url(#cta-rect)"
          strokeDasharray="2 4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* beams — under the balls, over the dashes */}
      <svg
        ref={beamsRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        width={1129}
        height={627}
        viewBox="0 0 1129 627"
        fill="none"
      >
        <defs>
          <filter id="ctab-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>
        <BeamDefs side="l" lines={LEFT} />
        {LEFT.map((l, i) => (
          <g key={i} data-beam>
            <path d={l.d} stroke={`url(#ctab-l${i})`} strokeWidth={4} strokeLinecap="round" opacity={0.5} filter="url(#ctab-blur)" style={IDLE} />
            <path d={l.d} stroke={`url(#ctab-l${i})`} strokeWidth={1.6} strokeLinecap="round" style={IDLE} />
          </g>
        ))}
        <g transform="translate(779 0)">
          <BeamDefs side="r" lines={RIGHT} />
          {RIGHT.map((l, i) => (
            <g key={i} data-beam>
              <path d={l.d} stroke={`url(#ctab-r${i})`} strokeWidth={4} strokeLinecap="round" opacity={0.5} filter="url(#ctab-blur)" style={IDLE} />
              <path d={l.d} stroke={`url(#ctab-r${i})`} strokeWidth={1.6} strokeLinecap="round" style={IDLE} />
            </g>
          ))}
        </g>
      </svg>

      {/* centre: icon + copy */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[24px] pl-px pt-px">
        <div className="flex size-[52px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.27)] bg-gradient-to-b from-[rgba(195,195,195,0.1)] to-[rgba(255,255,255,0.1)] shadow-[0px_7.98px_7.98px_0px_rgba(0,0,0,0.05),0px_19.949px_19.949px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px] pointer-coarse:backdrop-blur-none pointer-coarse:bg-[rgba(148,148,160,0.28)]">
          <Img src="/figma/cta/icon-center.svg" alt="" data-no-reveal className="h-[33.92px] w-[35.86px]" />
        </div>
        <div className="flex flex-col items-center gap-[12px]">
          <p className="whitespace-nowrap text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-white">
            One click automation
          </p>
          <p className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            Book faster. Miss less. Earn more.
          </p>
        </div>
      </div>

      {/* glass balls — topmost, beams pass underneath */}
      {BALLS.map((b) => (
        <div
          key={b.icon}
          className="absolute flex size-[62px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.27)] bg-gradient-to-b from-[rgba(195,195,195,0.1)] to-[rgba(255,255,255,0.1)] backdrop-blur-[10px] pointer-coarse:backdrop-blur-none pointer-coarse:bg-[rgba(148,148,160,0.28)]"
          style={{ left: b.x, top: b.cy - 31 }}
        >
          <Img src={b.icon} alt="" data-no-reveal style={{ width: b.w, height: b.h }} />
        </div>
      ))}
    </div>
  )
}
