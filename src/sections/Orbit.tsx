import { Img } from "@/components/site/Img"
import { ShaderBand } from "@/components/site/ShaderBand"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { prefersReducedMotion } from "@/lib/inview"

/**
 * Figma: Group 2085665057 (914:23049) — rings + centre mark + 15 badge pills.
 * Rebuilt as live layers so the badges orbit clockwise (coin.loadhunt.ai
 * style): each ring rotates slowly; badges counter-rotate to stay upright.
 * Centre of the system (section coords): (959, 382); the ring tops are
 * clipped by the section (design hides them under the dark block above).
 */

const CX = 959
const CY = 382
const RING_RADII = [215, 330, 442, 553, 664, 779, 890, 1007]

type Badge = { text: string; angle: number }
type Ring = { r: number; duration: number; badges: Badge[] }

/* initial angles = exact Figma badge positions (deg, 0 = right, cw) */
const RINGS: Ring[] = [
  {
    r: 330,
    duration: 170,
    badges: [
      { text: "Live data stream", angle: -90 },
      { text: "Instant notifications", angle: -3.6 },
      { text: "Fast calculations", angle: 40.7 },
      { text: "Stop missing loads", angle: 126.7 },
      { text: "One-click booking", angle: 183.6 },
    ],
  },
  {
    r: 553,
    duration: 200,
    badges: [
      { text: "No more spreadsheets", angle: -139.5 },
      { text: "Get your first load today", angle: 190.3 },
      { text: "Book faster in 30 seconds", angle: 154.8 },
      { text: "Verified brokers only", angle: -40.5 },
      { text: "Upgrade your dispatching", angle: -12.5 },
      { text: "Higher RPM only", angle: 27.1 },
    ],
  },
  {
    r: 890,
    duration: 230,
    badges: [
      { text: "Maximize your RPM", angle: 203.2 },
      { text: "Scalable fleet growth", angle: 176.1 },
      { text: "Zero wasted miles", angle: 6.5 },
      { text: "Start booking now", angle: -19 },
    ],
  },
]

const PILL_SHADOW =
  "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)"

export function Orbit() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLCanvasElement>(null)

  // The dotted rings are drawn ONCE into a canvas. As SVG circles with
  // stroke-dasharray="0.1 6.2" + round caps they froze the page for seconds
  // every time the section re-entered the viewport: the rasterizer walks the
  // dash pattern in 0.1px steps over ~30,000px of circumference on every
  // repaint. The canvas raster is composited like an image instead.
  useEffect(() => {
    const canvas = dotsRef.current
    if (!canvas) return
    const scale = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = 2040 * scale
    canvas.height = 2040 * scale
    const g = canvas.getContext("2d")
    if (!g) return
    g.scale(scale, scale)
    g.fillStyle = "#878787"
    for (const r of RING_RADII) {
      const step = 6.3 / r // dash rhythm: one dot every 6.3px of arc
      for (let a = 0; a < Math.PI * 2 - step / 2; a += step) {
        g.beginPath()
        g.arc(1020 + r * Math.cos(a), 1020 + r * Math.sin(a), 1, 0, Math.PI * 2)
        g.fill()
      }
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    // reduced motion: apply the upright orientations once but skip the endless
    // ring spins (leave the static Figma frame).
    const reduce = prefersReducedMotion()
    const tweens: gsap.core.Tween[] = []
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-ring]").forEach((ringEl) => {
        const duration = Number(ringEl.dataset.ring)
        if (!reduce)
          tweens.push(
            gsap.to(ringEl, { rotation: "+=360", duration, ease: "none", repeat: -1 }),
          )
        ringEl.querySelectorAll<HTMLElement>("[data-upright]").forEach((u) => {
          gsap.set(u, { rotation: Number(u.dataset.upright) })
          if (!reduce)
            tweens.push(
              gsap.to(u, { rotation: "-=360", duration, ease: "none", repeat: -1 }),
            )
        })
      })
    }, root)

    // 18 infinite rotation tweens are pure waste (and a scroll-jank source)
    // while the section is offscreen — run them only near the viewport
    const io = new IntersectionObserver(
      ([e]) => tweens.forEach((t) => t.paused(!e.isIntersecting)),
      { rootMargin: "200px 0px 200px 0px" },
    )
    if (tweens.length) io.observe(root)

    return () => {
      io.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={rootRef} className="relative h-[1389px] w-full">
      {/* animated shader background (experiment) — full-bleed behind the
          section; carries the white base. Rings/badges paint above untouched. */}
      <ShaderBand baseColor="#ffffff" />
      {/* Horizontal bleed: the rings span the Figma 2K frame's 2560px, so above
          1920 they run into the side gutters instead of being masked at the
          canvas edges. The wrapper clips only vertically (ring tops hide under
          the dark section above, as in the design). */}
      <div className="absolute left-[-320px] top-0 h-full w-[2560px] overflow-hidden">
        <div className="absolute left-[320px] top-0 h-full w-[1920px]">
      {/* dotted rings (canvas raster — see the drawing effect above) */}
      <canvas
        ref={dotsRef}
        className="pointer-events-none absolute"
        style={{ left: CX - 1020, top: CY - 1020, width: 2040, height: 2040 }}
        aria-hidden
      />

      {/* centre mark — 120px node, PNG render 191px (1x); the disc sits in the
          top of the render (soft shadow below), so we anchor by the GLYPH
          centroid (95, 59.5 at 1x) which is dead-centre of the disc */}
      <Img
        src="/figma/orbit-center.png"
        alt=""
        aria-hidden
        data-pulse
        loading="lazy"
        decoding="async"
        className="absolute max-w-none"
        style={{ left: CX - 95, top: CY - 59.5, width: 191 }}
      />

      {/* orbiting badges. Perf notes: the pills deliberately have NO
          backdrop-blur — 15 constantly-moving backdrop-filter layers force a
          full backdrop repaint every frame (the section-entry freeze), and
          over the plain white section the blur is invisible anyway. The
          rotating wrappers get will-change so each spins on its own
          compositor layer without repaints. */}
      {RINGS.map((ring) => (
        <div
          key={ring.r}
          data-ring={ring.duration}
          className="absolute size-0 will-change-transform"
          style={{ left: CX, top: CY }}
        >
          {ring.badges.map((b) => (
            <div
              key={b.text}
              className="absolute size-0"
              style={{ transform: `rotate(${b.angle}deg) translateX(${ring.r}px)` }}
            >
              <div data-upright={-b.angle} className="size-0 will-change-transform">
                <div
                  className="flex h-[42px] w-max -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-[99px] border border-white px-[12px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5))",
                    boxShadow: PILL_SHADOW,
                  }}
                >
                  <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink">
                    {b.text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
        </div>
      </div>
    </section>
  )
}
