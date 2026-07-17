import { Img } from "@/components/site/Img"
import { Stars } from "@/components/site/Stars"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { gateLoops, prefersReducedMotion, willChangeInView } from "@/lib/inview"

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
      {/* default bg: dark radial from top-right (Figma 914:23772).
          NOTE: this used backdrop-blur-[100px], but the backdrop is the flat
          solid gray-800 section (cards never overlap: step 415 > width 375), so
          the 100px blur returned the identical color — a pure no-op that
          re-sampled a ~100px kernel every frame the marquee advanced, ×15 cards.
          Removed; the radial gradient below is the only visible effect. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px]"
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
          className="flex size-[42px] items-center justify-center rounded-[12px] border border-white"
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
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    // reduced motion: leave the strip on its static first frame
    if (prefersReducedMotion()) return

    const tween = gsap.to(track, {
      x: -CYCLE,
      duration: SPEED_S,
      ease: "none",
      repeat: -1,
    })

    // pause the marquee (and free its composited layer) while off-screen
    const stopGate = gateLoops(sectionRef.current, tween)
    const stopWC = willChangeInView(track, sectionRef.current)

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
      stopWC()
      stopGate()
      tween.kill()
    }
  }, [])

  return (
    // No overflow-hidden: the marquee cards drift past the 1920 canvas into
    // the >1920 side gutters (the DesignFrame wrapper clips at the window
    // edge), instead of being cut at the canvas boundary.
    <section ref={sectionRef} id="contact" className="relative h-[1084px] bg-gray-800">
      {/* heading */}
      <div data-float className="absolute left-[928px] top-0 size-[64px]">
        <Img
          src="/figma/tools/intro-icon.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2 className="absolute left-[418px] top-[124px] w-[1084px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        What clients say
      </h2>
      <p className="absolute left-[418px] top-[202px] w-[1084px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Our clients appreciate our attention to their needs and professionalism.
        Here are some of their testimonials
      </p>

      {/* trust stats — real text (was a baked reviews-strip.png export);
          logos dropped per design feedback, stats enlarged */}
      <div className="absolute left-[418px] top-[266px] flex w-[1084px] items-stretch justify-center gap-8">
        <div className="flex flex-col items-center justify-center gap-[6px]">
          <span className="text-[24px] font-medium leading-[28px] tracking-[-0.96px] text-white">
            6,000&thinsp;+
          </span>
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            Trusted by users
          </span>
        </div>
        <div aria-hidden className="w-px self-stretch bg-line-strong" />
        <div className="flex flex-col items-center justify-center gap-[6px]">
          <span className="flex items-center gap-[10px]">
            <Stars score={4.4} className="text-[16px]" />
            <span className="text-[24px] font-medium leading-[28px] tracking-[-0.96px] text-white">
              4.4
            </span>
          </span>
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            from 100+ reviews
          </span>
        </div>
      </div>

      {/* marquee: initial offset matches the design frame (first card @ x=-82) */}
      <div className="absolute left-[-82px] top-[440px] h-[524px] w-[6225px]">
        <div
          ref={trackRef}
          data-marquee-track
          className="relative h-full w-full"
        >
          {/* the -1 copy keeps the left gutter populated right after each
              loop reset (t≈0), when copy 0 has not yet drifted past it */}
          {[-1, 0, 1, 2].map((copy) =>
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
