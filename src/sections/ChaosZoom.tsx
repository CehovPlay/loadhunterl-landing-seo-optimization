import { useEffect, useRef } from "react"
import gsap from "gsap"
import { BleedBg } from "@/components/site/BleedBg"
import { prefersReducedMotion } from "@/lib/inview"

/**
 * Scroll-scrubbed zoom-through transition (clearstreet.io-style) between the
 * light Features band and the dark Tools section: the camera dives straight
 * into the HYPHEN of "AI-powered".
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
const TEXT = "From chaos to AI-powered dispatch"
const HYPHEN_I = TEXT.indexOf("-")
const FINAL_VBW = 14 // viewBox width at full zoom — inside the hyphen bar
const RUNWAY = 1600 // canvas px of scroll consumed by the dive
// initial tail fallback; the effect resizes the section to RUNWAY + exactly
// one viewport, so the next section enters the moment the dive completes
// (and not a px earlier — the screen is already dark by then)
const SECTION_H = RUNWAY + 2400
const DIVE_EASE = 1.5 // pow on progress — the exponential zoom does the rest
const COVER_FROM = 0.9 // progress where the dark cover starts fading in

export function ChaosZoom() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const textRef = useRef<SVGTextElement>(null)
  const barRef = useRef<SVGRectElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const svg = svgRef.current
    const textEl = textRef.current
    const bar = barRef.current
    const cover = coverRef.current
    if (!section || !pin || !svg || !textEl || !bar || !cover) return

    if (prefersReducedMotion()) {
      // no dive — just a static heading band
      section.style.height = "1080px"
      return
    }

    // tail = exactly one viewport (canvas px): Tools enters the moment the
    // dive completes, with no dead dark scroll after it
    const sizeSection = () => {
      const s = section.getBoundingClientRect().width / 1920
      section.style.height = `${RUNWAY + window.innerHeight / s}px`
    }
    sizeSection()
    window.addEventListener("resize", sizeSection)

    // Dive target: the EXACT ink centre of the hyphen bar, in SVG user
    // units. Any anchor error is magnified by the zoom factor (×430 at full
    // depth) and reads as the camera drifting off the hyphen mid-dive, so an
    // estimate is not good enough — the glyph ink box is measured precisely
    // via canvas TextMetrics (actualBoundingBox*), anchored at the char's
    // pen position from the live SVG text.
    let hx = CX0
    let hy = BASELINE_Y - FONT * HYPHEN_RISE
    const measure = () => {
      try {
        const pen = textEl.getStartPositionOfChar(HYPHEN_I)
        const ctx = document.createElement("canvas").getContext("2d")
        if (!ctx) return
        ctx.font = `500 ${FONT}px Inter, sans-serif`
        const m = ctx.measureText(TEXT[HYPHEN_I])
        hx = pen.x + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2
        hy = BASELINE_Y - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2
        // solid rect laid EXACTLY over the hyphen's ink (same fill — it is
        // invisible over the glyph). Chrome's glyph rasterisation falls apart
        // beyond ~×50 viewBox zoom (fragments jump around the screen); plain
        // rects scale flawlessly, so the deep phase of the dive rides on the
        // rect while the text is faded out.
        bar.setAttribute("x", String(pen.x - m.actualBoundingBoxLeft))
        bar.setAttribute("y", String(BASELINE_Y - m.actualBoundingBoxAscent))
        bar.setAttribute("width", String(m.actualBoundingBoxLeft + m.actualBoundingBoxRight))
        bar.setAttribute("height", String(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent))
      } catch {
        /* not rendered yet — keep the estimate fallback */
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
      // crossfade the glyphs out before Chrome's deep-zoom glyph breakage
      // kicks in (~×50); from here the ink rect carries the growing bar
      textEl.style.opacity = String(gsap.utils.clamp(0, 1, (vbW - 150) / 100))
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
      window.removeEventListener("resize", sizeSection)
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
            {/* the hyphen's ink, duplicated as a rect (set from measure()) —
                invisible over the glyph, it carries the deep zoom phase */}
            <rect ref={barRef} fill="#181a1f" width="0" height="0" />
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
