import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Looping violet beams over the "From chaos to AI-Powered dispatch" diagram.
 * The curved connectors are baked into /figma/misc/chaos-diagram.png; the 14
 * exact vector paths (Group 2085665078, 914:23235 — 7 per side) all converge
 * on the central logo at (680, 74) in the lines' local space.
 *
 * Every beam emerges from the centre logo and flies OUTWARD along its curve
 * synchronously, dissolving near the composition edge — the beam stroke reuses
 * each line's own vertical fade gradient (opaque at the centre, transparent at
 * the bottom/outer end), so it dims exactly where the dashes do. A radial mask
 * at the centre hides the beams under the logo so they appear to shoot out of
 * it.
 */

interface Line {
  d: string
  /** Figma line gradient geometry (x1,y1,x2,y2) — reused for the beam fade */
  g: [number, number, number, number]
}

/* left-hand + right-hand groups, in the lines' local space (viewBox 0 0 1361 208) */
const LINES: Line[] = [
  { d: "M680.184 74.1613C680.184 74.1613 664.549 41.0695 639.028 13.1609C572.274 -59.839 582.256 206.661 582.256 206.661", g: [581.727, 0.161, 581.727, 207.118] },
  { d: "M290.563 206.66C290.563 206.66 289.225 67.8265 402.963 36.66C506.027 8.41844 680.258 74.66 680.258 74.66", g: [290.562, 29.361, 290.562, 207.052] },
  { d: "M60.6719 206.662C60.6719 206.662 108.263 114.662 275.748 81.1623C470.131 42.282 680.259 74.6622 680.259 74.6622", g: [60.672, 61.782, 60.672, 206.983] },
  { d: "M0.265625 206.661C0.265625 206.661 123.057 128.662 290.542 95.1616C484.924 56.2813 680.257 74.6613 680.257 74.6613", g: [0.266, 70.096, 0.266, 206.963] },
  { d: "M105.516 206.66C105.516 206.66 190.631 139.661 358.116 106.161C552.498 67.2802 680.257 74.6604 680.257 74.6604", g: [105.516, 73.884, 105.516, 206.954] },
  { d: "M292.195 206.66C292.195 206.66 408.799 153.501 491.742 126.16C562.207 102.933 680.219 74.6602 680.219 74.6602", g: [292.195, 74.443, 292.195, 206.952] },
  { d: "M460.617 206.66C460.617 206.66 515.197 161.43 557.63 135.805C601.119 109.542 680.219 74.6602 680.219 74.6602", g: [460.617, 74.443, 460.617, 206.952] },
  { d: "M680.347 74.1613C680.347 74.1613 695.982 41.0695 721.503 13.1609C788.257 -59.839 778.276 206.661 778.276 206.661", g: [778.805, 0.161, 778.805, 207.118] },
  { d: "M1069.97 206.66C1069.97 206.66 1071.31 67.8265 957.569 36.66C854.504 8.41844 680.273 74.66 680.273 74.66", g: [1069.97, 29.361, 1069.97, 207.052] },
  { d: "M1299.86 206.662C1299.86 206.662 1252.27 114.662 1084.78 81.1623C890.4 42.282 680.273 74.6622 680.273 74.6622", g: [1299.86, 61.782, 1299.86, 206.983] },
  { d: "M1360.27 206.661C1360.27 206.661 1237.47 128.662 1069.99 95.1616C875.607 56.2813 680.274 74.6613 680.274 74.6613", g: [1360.27, 70.096, 1360.27, 206.963] },
  { d: "M1255.02 206.66C1255.02 206.66 1169.9 139.661 1002.42 106.161C808.033 67.2802 680.275 74.6604 680.275 74.6604", g: [1255.02, 73.884, 1255.02, 206.954] },
  { d: "M1068.34 206.66C1068.34 206.66 951.733 153.501 868.79 126.16C798.324 102.933 680.312 74.6602 680.312 74.6602", g: [1068.34, 74.443, 1068.34, 206.952] },
  { d: "M899.914 206.66C899.914 206.66 845.334 161.43 802.901 135.805C759.412 109.542 680.312 74.6602 680.312 74.6602", g: [899.914, 74.443, 899.914, 206.952] },
]

const CENTER: [number, number] = [680, 74]
const BEAM = 70 // pulse length, px along the path
const DURATION = 1.9 // s — all beams travel out together (synchronous)
const REPEAT_DELAY = 1.3

const IDLE: React.CSSProperties = {
  strokeDasharray: "70 4000",
  strokeDashoffset: -8000,
}

export function ChaosBeams() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const svg = svgRef.current
    if (!svg) return
    const tweens: gsap.core.Tween[] = []

    svg.querySelectorAll<SVGGElement>("g[data-beam]").forEach((g) => {
      const paths = [...g.querySelectorAll<SVGPathElement>("path")]
      const probe = paths[0]
      const len = probe.getTotalLength()
      const start = probe.getPointAtLength(0)
      const d2c = (p: DOMPoint) => (p.x - CENTER[0]) ** 2 + (p.y - CENTER[1]) ** 2
      const centreAtStart = d2c(start) < d2c(probe.getPointAtLength(len))

      paths.forEach((p) => {
        p.style.strokeDasharray = `${BEAM} ${len}`
      })
      // emerge at the centre end, travel outward to the far end
      const from = centreAtStart ? BEAM : -len
      const to = centreAtStart ? -len : BEAM
      tweens.push(
        gsap.fromTo(
          paths,
          { strokeDashoffset: from },
          {
            strokeDashoffset: to,
            duration: DURATION,
            ease: "power1.in", // accelerate away from the logo
            repeat: -1,
            repeatDelay: REPEAT_DELAY,
          },
        ),
      )
    })

    return () => {
      tweens.forEach((t) => t.kill())
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute left-[280px] top-[475px]"
      width={1361}
      height={208}
      viewBox="0 0 1361 208"
      fill="none"
    >
      <defs>
        <filter id="chaosbeam-blur" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        {/* hide beams under the centre logo, soft reveal once they fan apart */}
        <radialGradient id="chaosbeam-mask" gradientUnits="userSpaceOnUse" cx={CENTER[0]} cy={CENTER[1]} r={62}>
          <stop offset="0.42" stopColor="black" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <mask id="chaosbeam-emerge">
          <rect x={-40} y={-80} width={1441} height={368} fill="white" />
          <circle cx={CENTER[0]} cy={CENTER[1]} r={62} fill="url(#chaosbeam-mask)" />
        </mask>
        {LINES.map((l, i) => (
          <linearGradient key={i} id={`chaosb-${i}`} gradientUnits="userSpaceOnUse" x1={l.g[0]} y1={l.g[1]} x2={l.g[2]} y2={l.g[3]}>
            <stop stopColor="#b98cff" />
            <stop offset="0.5" stopColor="#925cff" />
            <stop offset="1" stopColor="#925cff" stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <g mask="url(#chaosbeam-emerge)">
        {LINES.map((l, i) => (
          <g key={i} data-beam>
            <path d={l.d} stroke={`url(#chaosb-${i})`} strokeWidth={4} strokeLinecap="round" opacity={0.42} filter="url(#chaosbeam-blur)" style={IDLE} />
            <path d={l.d} stroke={`url(#chaosb-${i})`} strokeWidth={1.6} strokeLinecap="round" style={IDLE} />
          </g>
        ))}
      </g>
    </svg>
  )
}
