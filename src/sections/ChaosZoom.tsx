import { useEffect, useRef } from "react"
import gsap from "gsap"
import { BleedBg } from "@/components/site/BleedBg"
import { prefersReducedMotion } from "@/lib/inview"

/**
 * Scroll-scrubbed zoom-through transition (clearstreet.io-style) between the
 * light Features band and the dark Tools section: the camera dives straight
 * into the HYPHEN of "AI-Powered".
 *
 * The heading lives in an SVG and the zoom is done by animating the viewBox
 * — the browser re-renders the vector glyphs at native resolution every
 * frame, so the text stays CRISP at any zoom (transform:scale() composites a
 * cached raster and turns to mush). The SVG band is 6000px wide (bleeding
 * far past the 1920 canvas into the >1920 gutters) with xMidYMid slice, so
 * mid-dive the giant glyphs — and at the end the dark bar — cover the whole
 * viewport with no white margins. The viewBox centre is interpolated to the
 * hyphen's ink centre, so the dive lands dead-centre by construction.
 *
 * Pinning is ecosystemPin-style — translate driven from the live section
 * rect on each gsap.ticker frame (position:fixed can't escape the scaled
 * canvas; ScrollTrigger mis-measures inside transform:scale()). Everything
 * is a pure function of scroll — fully reversible. Text colour = Tools bg
 * (#181a1f) and a dark cover fades in at the very end, so the handoff to
 * the next section is invisible.
 */

const SVG_W = 6000 // svg band, canvas px — bleeds into the side gutters
const SVG_H = 2400 // tall enough to cover any viewport (up to 4K fullscreen)
const CX0 = SVG_W / 2
const CY0 = SVG_H / 2
const FONT = 96
const BASELINE_Y = CY0 + FONT * 0.354 // optically centred cap height
const HYPHEN_RISE = 0.31 // Inter hyphen ink-bar centre, em above baseline
const TEXT = "From chaos to AI-Powered dispatch"
const HYPHEN_I = TEXT.indexOf("-")
const FINAL_VBW = 14 // viewBox width at full zoom — inside the hyphen bar
const RUNWAY = 1600 // canvas px of scroll consumed by the dive
// tail below the runway ≥ any viewport height (canvas px): the next section
// physically cannot enter the viewport until the dive is complete and the
// screen is already dark (the cover spans the whole section)
const SECTION_H = RUNWAY + 2400
const DIVE_EASE = 1.5 // pow on progress — the exponential zoom does the rest
const COVER_FROM = 0.9 // progress where the dark cover starts fading in

export function ChaosZoom() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    const pin = pinRef.current
    const svg = svgRef.current
    const textEl = textRef.current
    const cover = coverRef.current
    if (!section || !pin || !svg || !textEl || !cover) return

    // dive target: the hyphen's ink centre in SVG user units. The horizontal
    // extent is reliable from the glyph cell; the bar's vertical centre is
    // derived from the baseline (the cell spans the whole ascent/descent).
    let hx = CX0
    let hy = BASELINE_Y - FONT * HYPHEN_RISE
    const measure = () => {
      try {
        const ext = textEl.getExtentOfChar(HYPHEN_I)
        hx = ext.x + ext.width / 2
      } catch {
        /* not rendered yet — keep the centre fallback */
      }
    }
    if (document.fonts?.ready) document.fonts.ready.then(measure)

    const onTick = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const s = rect.width / 1920
      // keep the band at the viewport centre while the runway is consumed
      const halfView = vh / (2 * s)
      const yCenter = gsap.utils.clamp(
        halfView,
        RUNWAY + halfView,
        (vh / 2 - rect.top) / s,
      )
      const p = gsap.utils.clamp(0, 1, (yCenter - halfView) / RUNWAY)
      const eased = Math.pow(p, DIVE_EASE)
      // exponential camera zoom. Classic zoom-to-point anchoring: the centre
      // converges onto the hyphen at the SAME rate as the zoom (r = vbW/W0),
      // which keeps the hyphen at a fixed screen spot (≈ dead centre, since
      // the text is centred) for the whole dive — no lateral drift.
      const vbW = SVG_W * Math.pow(FINAL_VBW / SVG_W, eased)
      const vbH = vbW * (SVG_H / SVG_W)
      const r = vbW / SVG_W
      const cx = hx + (CX0 - hx) * r
      const cy = hy + (CY0 - hy) * r
      svg.setAttribute("viewBox", `${cx - vbW / 2} ${cy - vbH / 2} ${vbW} ${vbH}`)
      pin.style.transform = `translateY(${yCenter - SVG_H / 2}px)`
      cover.style.opacity = String(
        gsap.utils.clamp(0, 1, (p - COVER_FROM) / (1 - COVER_FROM)),
      )
    }
    measure()
    onTick()

    // run the ticker only while the section is on screen
    let ticking = false
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1]
        if (e.isIntersecting && !ticking) {
          ticking = true
          gsap.ticker.add(onTick)
        } else if (!e.isIntersecting && ticking) {
          ticking = false
          gsap.ticker.remove(onTick)
        }
      },
      { rootMargin: "300px 0px 300px 0px" },
    )
    io.observe(section)
    return () => {
      io.disconnect()
      if (ticking) gsap.ticker.remove(onTick)
    }
  }, [])

  return (
    <BleedBg color="#fafafa">
      <section ref={sectionRef} className="relative" style={{ height: SECTION_H }}>
        {/* pinned svg band — translateY driven per tick; the viewBox zooms.
            data-no-reveal: fully owned by the tick loop. NO overflow clip:
            mid-dive the glyphs must spill across the >1920 gutters (the
            DesignFrame wrapper clips at the window edge). */}
        <div
          ref={pinRef}
          data-no-reveal
          className="absolute top-0 will-change-transform"
          style={{ left: (1920 - SVG_W) / 2, width: SVG_W, height: SVG_H }}
        >
          <svg
            ref={svgRef}
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-label={TEXT}
            role="img"
            className="block"
          >
            <text
              ref={textRef}
              x={CX0}
              y={BASELINE_Y}
              textAnchor="middle"
              fill="#181a1f"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: FONT,
                letterSpacing: "-0.04em",
              }}
            >
              {TEXT}
            </text>
          </svg>
        </div>

        {/* full-bleed dark cover — guarantees a clean handoff to the gray-800
            Tools section at the very end of the dive */}
        <div
          ref={coverRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full w-[6000px] -translate-x-1/2 bg-gray-800"
          style={{ opacity: 0 }}
        />
      </section>
    </BleedBg>
  )
}
