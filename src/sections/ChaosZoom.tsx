import { useEffect, useRef } from "react"
import gsap from "gsap"
import { BleedBg } from "@/components/site/BleedBg"
import { prefersReducedMotion } from "@/lib/inview"
import {
  HEADLINE_BASELINE,
  HEADLINE_D,
  HEADLINE_TEXT,
  HEADLINE_WIDTH,
  HYPHEN_BOX,
} from "@/generated/chaosHeadline"

/**
 * Scroll-scrubbed zoom-through transition (clearstreet.io-style) between the
 * light Features band and the dark Tools section: the camera dives straight
 * into the HYPHEN of "AI-powered".
 *
 * The heading is a pre-generated SVG PATH (scripts/gen-chaos-headline.mjs):
 * Inter Medium outlines with kerning + letter-spacing baked in. NOT live
 * <text> — GPU Chrome's font rasterisation falls apart beyond ~×50 viewBox
 * zoom (glyph fragments jump around the screen), while plain geometry
 * scales flawlessly in every engine at the full ×430 depth. Outlines also
 * kill every cross-browser font-metric problem: the dive anchor (the
 * hyphen's ink centre) is a build-time constant, identical everywhere, and
 * the letters stay fully opaque the whole way — no fades, no swaps.
 *
 * The zoom is done by animating the viewBox — the browser re-renders the
 * vectors at native resolution every frame, so the ink stays CRISP at any
 * zoom (transform:scale() composites a cached raster and turns to mush).
 * The SVG band is 6000px wide (bleeding far past the 1920 canvas into the
 * >1920 gutters) with xMidYMid slice, so mid-dive the giant glyphs — and at
 * the end the dark ink — cover the whole viewport with no white margins.
 * The viewBox centre is interpolated to the hyphen's ink centre, so the
 * dive lands dead-centre by construction.
 *
 * Pinning is ecosystemPin-style — translate driven from the live section
 * rect on each gsap.ticker frame (position:fixed can't escape the scaled
 * canvas; ScrollTrigger mis-measures inside transform:scale()). Everything
 * is a pure function of scroll — fully reversible. Ink colour = Tools bg
 * (var(--color-gray-800)) and a dark cover fades in at the very end, so the
 * handoff to the next section is invisible. Writes are memoised per value:
 * during the approach every computed value is constant, and re-setting the
 * same viewBox would repaint the whole 6000×2400 SVG every scroll frame
 * (this was the freeze between Features and the dive).
 */

const SVG_W = 6000 // svg band, canvas px — bleeds into the side gutters
const SVG_H = 2400 // tall enough to cover any viewport (up to 4K fullscreen)
const CX0 = SVG_W / 2
const CY0 = SVG_H / 2
const FONT = 96
const BASELINE_Y = CY0 + FONT * 0.354 // optically centred cap height
// The Figma outline export is at ~half the live 96px text size — scale it to
// the exact optical width the SVG <text> used to render at (measured 1513.901
// canvas px for this string in Inter Medium 96 / -0.04em).
const SCALE = 1513.901 / HEADLINE_WIDTH
const TEXT_X = CX0 - (HEADLINE_WIDTH * SCALE) / 2
const TEXT_Y = BASELINE_Y - HEADLINE_BASELINE * SCALE
// dive target: the hyphen's ink centre — build-time constants, no runtime
// font measurement of any kind
const HX = TEXT_X + ((HYPHEN_BOX.x0 + HYPHEN_BOX.x1) / 2) * SCALE
const HY = TEXT_Y + ((HYPHEN_BOX.y0 + HYPHEN_BOX.y1) / 2) * SCALE
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
  const coverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const pin = pinRef.current
    const svg = svgRef.current
    const cover = coverRef.current
    if (!section || !pin || !svg || !cover) return

    if (prefersReducedMotion()) {
      // no dive — just a static heading band. The path is centred for the
      // 2400px band, so without this translate it lands BELOW the shortened
      // section, gray-800 on the gray-800 Tools bg — i.e. invisible.
      const RM_H = 640
      section.style.height = `${RM_H}px`
      pin.style.transform = `translateY(${RM_H / 2 - SVG_H / 2}px)`
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

    let lastKey = NaN // skip the whole tick on scroll-idle frames
    let prevVb = ""
    let prevTf = ""
    let prevCoverA = ""
    const onTick = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const frameKey = rect.top + rect.width * 1e-5 + vh * 1e-9
      if (frameKey === lastKey) return
      lastKey = frameKey
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
      const cx = HX + (CX0 - HX) * r
      const cy = HY + (CY0 - HY) * r
      const vb = `${cx - vbW / 2} ${cy - vbH / 2} ${vbW} ${vbH}`
      if (vb !== prevVb) {
        prevVb = vb
        svg.setAttribute("viewBox", vb)
      }
      const tf = `translateY(${yCenter - SVG_H / 2}px)`
      if (tf !== prevTf) {
        prevTf = tf
        pin.style.transform = tf
      }
      const coverA = String(
        gsap.utils.clamp(0, 1, (p - COVER_FROM) / (1 - COVER_FROM)),
      )
      if (coverA !== prevCoverA) {
        prevCoverA = coverA
        cover.style.opacity = coverA
      }
    }
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
    <BleedBg color="var(--color-bg-light)">
      <section ref={sectionRef} className="relative" style={{ height: SECTION_H }}>
        {/* pinned svg band — translateY driven per tick; the viewBox zooms.
            data-no-reveal: fully owned by the tick loop. NO overflow clip:
            mid-dive the glyphs must spill across the >1920 gutters (the
            DesignFrame wrapper clips at the window edge). NO will-change: a
            forced layer on this 6000×2400 box is a (viewport × DPR)² texture
            and buys nothing — every dive frame repaints via the viewBox. */}
        <div
          ref={pinRef}
          data-no-reveal
          className="absolute top-0"
          style={{ left: (1920 - SVG_W) / 2, width: SVG_W, height: SVG_H }}
        >
          <svg
            ref={svgRef}
            width={SVG_W}
            height={SVG_H}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-label={HEADLINE_TEXT}
            role="img"
            className="block"
          >
            <path
              d={HEADLINE_D}
              transform={`translate(${TEXT_X} ${TEXT_Y}) scale(${SCALE})`}
              fill="var(--color-gray-800)"
            />
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
