import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Looping light beams over the CTA "One click automation" panel.
 *
 * The dashed connector lines are baked into /figma/tail/cta-right.png; their
 * exact vector geometry was exported from Figma (Groups 2085665136/-137,
 * Vectors 6923–6928 per side, panel-local coordinates of node 914:23949 —
 * placed at (671, 240) of the section). Each path starts at the panel edge,
 * runs the horizontal connector, curves, and continues along the long
 * diagonal through its side icon.
 *
 * Per line we find the point nearest to its icon, clip the overlay so only
 * the icon→panel run can paint, and loop a short two-layer stroke (blurred
 * violet glow + bright core) along that run via the dashoffset technique —
 * the pulse emerges from under the icon and flows into the panel.
 */

interface Line {
  d: string
  /** icon centre in the same local space as `d` */
  icon: [number, number]
}

const LEFT: Line[] = [
  { d: "M337.5 266.5H335.921C315.484 266.5 305.265 266.5 296.077 262.694C286.888 258.888 279.662 251.662 265.211 237.211L0 -28", icon: [226, 218] },
  { d: "M337.5 284.5H314.921C294.484 284.5 284.265 284.5 275.077 280.694C265.888 276.888 258.662 269.662 244.211 255.211L-18 -7", icon: [226, 218] },
  { d: "M337.5 303H294.921C274.484 303 264.265 303 255.077 299.194C245.888 295.388 238.662 288.162 224.211 273.711L-51.5 -2", icon: [266, 314] },
  { d: "M337.5 324.5H294.921C274.484 324.5 264.265 324.5 255.077 328.306C245.888 332.112 238.662 339.338 224.211 353.789L-10 588", icon: [266, 314] },
  { d: "M337.5 343H314.921C294.484 343 284.265 343 275.077 346.806C265.888 350.612 258.662 357.838 244.211 372.289L-19 635.5", icon: [226, 410] },
  { d: "M337.5 361H335.921C315.484 361 305.265 361 296.077 364.806C286.888 368.612 279.662 375.838 265.211 390.289L1.5 654", icon: [226, 410] },
]

/** right-side group is drawn in its own local space and shifted +778px */
const RIGHT: Line[] = [
  { d: "M0.5 266.5H2.07864C22.5162 266.5 32.7349 266.5 41.9235 262.694C51.112 258.888 58.3378 251.662 72.7893 237.211L338 -28", icon: [92, 218] },
  { d: "M0.5 284.5H23.0786C43.5162 284.5 53.7349 284.5 62.9235 280.694C72.112 276.888 79.3378 269.662 93.7893 255.211L356 -7", icon: [92, 218] },
  { d: "M0.5 303H43.0786C63.5162 303 73.7349 303 82.9235 299.194C92.112 295.388 99.3378 288.162 113.789 273.711L389.5 -2", icon: [72, 314] },
  { d: "M0.5 324.5H43.0786C63.5162 324.5 73.7349 324.5 82.9235 328.306C92.112 332.112 99.3378 339.338 113.789 353.789L348 588", icon: [72, 314] },
  { d: "M0.5 343H23.0786C43.5162 343 53.7349 343 62.9235 346.806C72.112 350.612 79.3378 357.838 93.7893 372.289L357 635.5", icon: [92, 410] },
  { d: "M0.5 361H2.07864C22.5162 361 32.7349 361 41.9235 364.806C51.112 368.612 58.3378 375.838 72.7893 390.289L336.5 654", icon: [92, 410] },
]

const BEAM = 56 // visible pulse length, px along the path
const SPEED = 190 // px/s

/* hidden until the effect measures the paths and starts the loops */
const IDLE: React.CSSProperties = {
  strokeDasharray: "56 4000",
  strokeDashoffset: -800,
}

function BeamLine({ line, side, id }: { line: Line; side: "left" | "right"; id: string }) {
  return (
    <g data-beam={side} data-icon={line.icon.join(",")}>
      <clipPath id={id}>
        <rect x="0" y="-40" width="0" height="707" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <path
          d={line.d}
          fill="none"
          stroke="#925cff"
          strokeWidth={4.5}
          strokeLinecap="round"
          opacity={0.55}
          filter="url(#ctabeam-blur)"
          style={IDLE}
        />
        <path
          d={line.d}
          fill="none"
          stroke="#e2d3ff"
          strokeWidth={1.6}
          strokeLinecap="round"
          style={IDLE}
        />
      </g>
    </g>
  )
}

export function CtaBeams() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const svg = svgRef.current
    if (!svg) return
    const tweens: gsap.core.Tween[] = []

    svg.querySelectorAll<SVGGElement>("g[data-beam]").forEach((g) => {
      const side = g.dataset.beam as "left" | "right"
      const [ix, iy] = (g.dataset.icon || "0,0").split(",").map(Number)
      const paths = [...g.querySelectorAll<SVGPathElement>("path")]
      const probe = paths[0]
      const len = probe.getTotalLength()

      // length parameter of the point nearest to the icon centre
      let atIcon = 0
      let bestD = Infinity
      for (let s = 0; s <= len; s += 3) {
        const p = probe.getPointAtLength(s)
        const d = (p.x - ix) ** 2 + (p.y - iy) ** 2
        if (d < bestD) {
          bestD = d
          atIcon = s
        }
      }
      // step back one icon radius along the path so the pulse emerges at the
      // circle's rim instead of crossing over it
      const emergeS = Math.max(0, atIcon - 34)
      const pt = probe.getPointAtLength(emergeS)

      // clip so only the icon→panel run can paint (the diagonal beyond the
      // icon stays dark, and the pulse visually emerges from under the icon)
      const rect = g.querySelector<SVGRectElement>("clipPath rect")!
      if (side === "left") {
        rect.setAttribute("x", String(pt.x - 2))
        rect.setAttribute("width", String(340 - (pt.x - 2)))
      } else {
        rect.setAttribute("x", "-1")
        rect.setAttribute("width", String(pt.x + 3))
      }

      paths.forEach((p) => {
        p.style.strokeDasharray = `${BEAM} ${len}`
      })
      // dash head slides from the icon (emerging out of the clip edge) to the
      // panel edge (path start), then off; loop with a randomized breather
      tweens.push(
        gsap.fromTo(
          paths,
          { strokeDashoffset: -emergeS },
          {
            strokeDashoffset: BEAM,
            duration: (emergeS + BEAM) / SPEED,
            ease: "none",
            repeat: -1,
            delay: gsap.utils.random(0, 2.4),
            repeatDelay: gsap.utils.random(1.2, 2.6),
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
      className="pointer-events-none absolute left-[671px] top-[240px]"
      width={1129}
      height={627}
      viewBox="0 0 1129 627"
      fill="none"
    >
      <defs>
        <filter id="ctabeam-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
      {LEFT.map((l, i) => (
        <BeamLine key={`l${i}`} line={l} side="left" id={`ctabeam-l${i}`} />
      ))}
      <g transform="translate(778 0)">
        {RIGHT.map((l, i) => (
          <BeamLine key={`r${i}`} line={l} side="right" id={`ctabeam-r${i}`} />
        ))}
      </g>
    </svg>
  )
}
