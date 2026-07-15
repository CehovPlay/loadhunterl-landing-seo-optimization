import { useEffect, useRef } from "react"
import gsap from "gsap"
import { BleedBg } from "@/components/site/BleedBg"
import { prefersReducedMotion } from "@/lib/inview"

/**
 * Scroll-scrubbed zoom-through transition (clearstreet.io-style) between the
 * light Features band and the dark Tools section.
 *
 * The heading "From chaos to AI-Powered dispatch" pins at the viewport
 * centre while the scroll runway scrubs a huge scale-up whose
 * transform-origin is the HYPHEN between "AI" and "Powered" — the camera
 * dives straight into the hyphen. As the glyph bar floods the screen a
 * full-bleed dark cover fades in, landing seamlessly on the gray-800 Tools
 * section that follows. Fully reversible: everything is a pure function of
 * scroll position.
 *
 * Pinning is done ecosystemPin-style — translate driven from the live
 * section rect on each gsap.ticker frame (position:fixed can't escape the
 * scaled canvas, and ScrollTrigger mis-measures inside transform:scale()).
 * The text colour equals the Tools bg (#181a1f), so the moment the bar
 * fills the viewport the handoff to the next section is invisible.
 */

const RUNWAY = 1600 // canvas px of scroll consumed by the dive
const SECTION_H = RUNWAY + 1080
const SCALE_MAX = 130
const DIVE_EASE = 2.2 // pow easing — accelerate into the hyphen
const COVER_FROM = 0.82 // progress where the dark cover starts fading in

export function ChaosZoom() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const hyphenRef = useRef<HTMLSpanElement>(null)
  const coverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const section = sectionRef.current
    const pin = pinRef.current
    const h2 = h2Ref.current
    const hyphen = hyphenRef.current
    const cover = coverRef.current
    if (!section || !pin || !h2 || !hyphen || !cover) return

    // dive point: the hyphen's centre inside the h2 (transform-origin), and
    // its horizontal offset from the canvas centre (drifted out during the
    // dive so the bar lands dead-centre). Measured after fonts settle.
    let originSet = false
    let dx = 0
    const measure = () => {
      const ox = hyphen.offsetLeft + hyphen.offsetWidth / 2
      const oy = hyphen.offsetTop + hyphen.offsetHeight / 2
      h2.style.transformOrigin = `${ox}px ${oy}px`
      const sRect = section.getBoundingClientRect()
      const s = sRect.width / 1920
      const hRect = hyphen.getBoundingClientRect()
      dx = 960 - (hRect.left + hRect.width / 2 - sRect.left) / s
      originSet = true
    }
    if (document.fonts?.ready) document.fonts.ready.then(measure)

    const onTick = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const s = rect.width / 1920
      if (!originSet) measure()
      // keep the heading at the viewport centre while the runway is consumed
      const halfView = vh / (2 * s)
      const yCenter = gsap.utils.clamp(
        halfView,
        RUNWAY + halfView,
        (vh / 2 - rect.top) / s,
      )
      const p = gsap.utils.clamp(0, 1, (yCenter - halfView) / RUNWAY)
      const eased = Math.pow(p, DIVE_EASE)
      pin.style.transform = `translate(${dx * eased}px, ${yCenter - h2.offsetHeight / 2}px)`
      h2.style.transform = `scale(${1 + (SCALE_MAX - 1) * eased})`
      cover.style.opacity = String(
        gsap.utils.clamp(0, 1, (p - COVER_FROM) / (1 - COVER_FROM)),
      )
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
      if (ticking) gsap.ticker.remove(onTick)
    }
  }, [])

  return (
    <BleedBg color="#fafafa">
      <section
        ref={sectionRef}
        className="relative overflow-hidden"
        style={{ height: SECTION_H }}
      >
        {/* pinned heading — translate driven per tick; the h2 zooms around
            the hyphen. data-no-reveal: fully owned by the tick loop. */}
        <div
          ref={pinRef}
          data-no-reveal
          className="absolute inset-x-0 top-0 flex justify-center will-change-transform"
        >
          <h2
            ref={h2Ref}
            className="whitespace-nowrap text-[96px] font-medium leading-[104px] tracking-[-3.84px] will-change-transform"
            style={{ color: "#181a1f" }}
          >
            From chaos to AI
            <span ref={hyphenRef} data-hyphen>
              -
            </span>
            Powered dispatch
          </h2>
        </div>

        {/* full-bleed dark cover — fades in at the end of the dive so the
            handoff to the gray-800 Tools section below is seamless; wider
            than the canvas to also cover the >1920 side gutters */}
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
