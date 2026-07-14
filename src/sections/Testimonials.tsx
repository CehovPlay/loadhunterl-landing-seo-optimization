import { useEffect, useRef } from "react"
import gsap from "gsap"

/**
 * Figma: header Frame 1618873946 (914:23696) 1920x320 @ y=15559,
 * reviews strip (914:23713) 643x42 @ (638.5, +278),
 * cards Group 2085665201 (914:23741) @ y=15999 (section-rel 440):
 * cards 375 wide, step 415, staggered y offsets. Rebuilt as a live GSAP
 * marquee (right→left); hovering a card eases the marquee to a stop and
 * lights the card up with the design's violet hover state.
 */

type Review = {
  quote: string
  initials: string
  name: string
  /** vertical offset within the cards band (from Figma) */
  y: number
}

const REVIEWS: Review[] = [
  {
    quote:
      "This tool is saving so much time and makes everything so much more comfortable in daily dispatching routing.",
    initials: "FH",
    name: "Filip Hristovschi",
    y: 0,
  },
  {
    quote:
      "Ugh, It Seems To Be A Powerful and helpful Tool for booking loads ,makes everything so easier. Recommend To Taste It, And keep quality of the loads as high is possible with this tool",
    initials: "NC",
    name: "Nicolae Cojocari",
    y: 202,
  },
  {
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
    initials: "AC",
    name: "AJ Cargo",
    y: 0,
  },
  {
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
    initials: "FL",
    name: "FleetMax LLC",
    y: 282,
  },
  {
    quote:
      "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!",
    initials: "MA",
    name: "Mason Aleksic",
    y: 120,
  },
]

const CARD_STEP = 415 // 375 card + 40 gap
const CYCLE = REVIEWS.length * CARD_STEP // 2075
const SPEED_S = 60 // seconds per full cycle — slow drift

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      className="group absolute w-[375px] overflow-hidden rounded-[12px] border border-[rgba(229,229,229,0.1)] p-[40px] transition-[border-color,box-shadow] duration-500 hover:border-[rgba(111,81,151,0.8)] hover:shadow-[0px_34px_74px_-20px_rgba(111,81,151,0.5)]"
      style={{ top: r.y }}
      data-card
    >
      {/* default bg: dark radial from top-right (Figma 914:23772) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] backdrop-blur-[100px]"
        style={{
          backgroundImage:
            "radial-gradient(453px circle at 375px 6px, rgba(53,50,70,1), rgba(53,50,70,0))",
        }}
      />
      {/* hover bg: violet radial from bottom-center (Figma 914:23766), fades in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(295px circle at 50% 285px, rgba(111,81,151,1), rgba(111,81,151,0))",
        }}
      />

      <p className="relative w-full text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-gray-50">
        {r.quote}
      </p>
      <div className="relative mt-[40px] flex w-full items-center gap-[12px]">
        <div
          className="flex size-[42px] items-center justify-center rounded-[12px] border border-white backdrop-blur-[10px]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
            boxShadow:
              "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            {r.initials}
          </span>
        </div>
        <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          {r.name}
        </span>
      </div>

      {/* bottom inner hairline shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  )
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const tween = gsap.to(track, {
      x: -CYCLE,
      duration: SPEED_S,
      ease: "none",
      repeat: -1,
    })
    tweenRef.current = tween

    const cards = track.querySelectorAll<HTMLElement>("[data-card]")
    const slow = () =>
      gsap.to(tween, { timeScale: 0, duration: 0.6, overwrite: true })
    const resume = () =>
      gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true })
    cards.forEach((c) => {
      c.addEventListener("mouseenter", slow)
      c.addEventListener("mouseleave", resume)
    })
    return () => {
      cards.forEach((c) => {
        c.removeEventListener("mouseenter", slow)
        c.removeEventListener("mouseleave", resume)
      })
      tween.kill()
    }
  }, [])

  return (
    <section id="contact" className="relative h-[1084px] overflow-hidden bg-gray-800">
      {/* heading */}
      <div data-float className="absolute left-[928px] top-0 size-[64px]">
        <img loading="lazy" decoding="async"
          src="/figma/tools/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2 className="absolute left-[418px] top-[124px] w-[1084px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        What client says
      </h2>
      <p className="absolute left-[418px] top-[202px] w-[1084px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Our clients appreciate our attention to their needs and professionalism.
        Here are some of their testimonials
      </p>

      {/* trust strip: 5,000+ users, 4.7 rating, Google Reviews / Trustpilot / G2 */}
      <img loading="lazy" decoding="async"
        src="/figma/reviews-strip.png"
        alt="5,000+ trusted users, 4.7 from 100+ reviews on Google, Trustpilot and G2"
        className="absolute left-[638.5px] top-[278px] w-[643.5px] max-w-none"
      />

      {/* marquee: initial offset matches the design frame (first card @ x=-82) */}
      <div className="absolute left-[-82px] top-[440px] h-[524px] w-[6225px]">
        <div
          ref={trackRef}
          data-marquee-track
          className="relative h-full w-full will-change-transform"
        >
          {[0, 1, 2].map((copy) =>
            REVIEWS.map((r, i) => (
              <div
                key={`${copy}-${r.name}`}
                className="absolute top-0 h-full"
                style={{ left: copy * CYCLE + i * CARD_STEP }}
              >
                <ReviewCard r={r} />
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
