import { useEffect, useRef } from "react"
import gsap from "gsap"

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

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-ring]").forEach((ringEl) => {
        const duration = Number(ringEl.dataset.ring)
        gsap.to(ringEl, { rotation: "+=360", duration, ease: "none", repeat: -1 })
        ringEl.querySelectorAll<HTMLElement>("[data-upright]").forEach((u) => {
          gsap.set(u, { rotation: Number(u.dataset.upright) })
          gsap.to(u, { rotation: "-=360", duration, ease: "none", repeat: -1 })
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="relative h-[1389px] w-full overflow-hidden bg-white">
      {/* dotted rings */}
      <svg
        className="pointer-events-none absolute"
        style={{ left: CX - 1020, top: CY - 1020 }}
        width={2040}
        height={2040}
        viewBox="0 0 2040 2040"
        aria-hidden
      >
        {RING_RADII.map((r) => (
          <circle
            key={r}
            cx={1020}
            cy={1020}
            r={r}
            fill="none"
            stroke="#878787"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="0.1 6.2"
          />
        ))}
      </svg>

      {/* centre mark — 120px node, PNG render 191px (1x); the disc sits in the
          top of the render (soft shadow below), so we anchor by the GLYPH
          centroid (95, 59.5 at 1x) which is dead-centre of the disc */}
      <img
        src="/figma/orbit-center.png"
        alt=""
        aria-hidden
        className="absolute max-w-none"
        style={{ left: CX - 95, top: CY - 59.5, width: 191 }}
      />

      {/* orbiting badges */}
      {RINGS.map((ring) => (
        <div
          key={ring.r}
          data-ring={ring.duration}
          className="absolute size-0"
          style={{ left: CX, top: CY }}
        >
          {ring.badges.map((b) => (
            <div
              key={b.text}
              className="absolute size-0"
              style={{ transform: `rotate(${b.angle}deg) translateX(${ring.r}px)` }}
            >
              <div data-upright={-b.angle} className="size-0">
                <div
                  className="flex h-[42px] w-max -translate-x-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-[99px] border border-white px-[12px] backdrop-blur-[10px]"
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
    </section>
  )
}
