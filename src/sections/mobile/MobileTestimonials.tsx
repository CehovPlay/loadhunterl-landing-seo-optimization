import { useEffect, useRef } from "react"
import gsap from "gsap"
import { gateLoops, prefersReducedMotion, willChangeInView } from "@/lib/inview"
import { Container, SectionHeader, Stars } from "./ui"

const REVIEWS = [
  {
    name: "Filip Hristovschi",
    initials: "FH",
    quote:
      "This tool is saving so much time and makes everything so much more comfortable in daily dispatching routing.",
    y: 0,
  },
  {
    name: "Nicolae Cojocari",
    initials: "NC",
    quote:
      "Ugh, It Seems To Be A Powerful and helpful Tool for booking loads ,makes everything so easier. Recommend To Taste It, And keep quality of the loads as high is possible with this tool",
    y: 56,
  },
  {
    name: "AJ Cargo",
    initials: "AC",
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
    y: 0,
  },
  {
    name: "FleetMax LLC",
    initials: "FL",
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
    y: 78,
  },
  {
    name: "Mason Aleksic",
    initials: "MA",
    quote:
      "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!",
    y: 34,
  },
]

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure
      data-card
      data-no-reveal
      className="group relative mr-4 w-[300px] shrink-0 overflow-hidden rounded-[12px] border border-[rgba(229,229,229,0.1)] p-6 transition-[border-color,box-shadow] duration-500 hover:border-[rgba(111,81,151,0.8)] hover:shadow-[0px_34px_74px_-20px_rgba(111,81,151,0.5)] md:mr-10 md:w-[375px] md:p-10"
      style={{ marginTop: r.y }}
    >
      {/* desktop card bg: dark radial from the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px]"
        style={{
          backgroundImage:
            "radial-gradient(453px circle at 100% 6px, rgba(53,50,70,1), rgba(53,50,70,0))",
        }}
      />
      {/* hover bg: violet radial from bottom-center, fades in (desktop) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(295px circle at 50% 285px, rgba(111,81,151,1), rgba(111,81,151,0))",
        }}
      />
      <blockquote className="relative text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-gray-50">
        {r.quote}
      </blockquote>
      <figcaption className="relative mt-8 flex items-center gap-3">
        <span
          className="flex size-[42px] items-center justify-center rounded-[12px] border border-white text-[14px] font-medium tracking-[-0.56px] text-ink-2"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
            boxShadow:
              "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          {r.initials}
        </span>
        <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          {r.name}
        </span>
      </figcaption>
      <div className="pointer-events-none absolute inset-0 rounded-[12px] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
    </figure>
  )
}

/**
 * Testimonials — same behavior as desktop: a GSAP marquee drifting right→left
 * (two copies of the list, seamless wrap on half the track width), hovering a
 * card eases the drift to a stop and lights the violet hover state. Cards
 * carry staggered y offsets like the desktop band. Reduced-motion shows the
 * static row.
 */
export function MobileTestimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (prefersReducedMotion()) return

    let tween: gsap.core.Tween | null = null
    const playable = {
      play: () => tween?.play(),
      pause: () => tween?.pause(),
    }
    const build = () => {
      const half = track.scrollWidth / 2
      if (!half) return
      const paused = tween ? tween.paused() : true
      tween?.kill()
      gsap.set(track, { x: 0 })
      tween = gsap.fromTo(
        track,
        { x: 0 },
        { x: -half, duration: half / 55, ease: "none", repeat: -1, paused },
      )
    }
    build()
    window.addEventListener("resize", build)

    const stopGate = gateLoops(sectionRef.current, playable)

    // hover: ease the marquee to a stop, resume on leave (desktop behavior)
    const slow = () => tween && gsap.to(tween, { timeScale: 0, duration: 0.6, overwrite: true })
    const resume = () => tween && gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true })
    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"))
    cards.forEach((c) => {
      c.addEventListener("mouseenter", slow)
      c.addEventListener("mouseleave", resume)
    })
    const stopWC = willChangeInView(track, sectionRef.current)

    return () => {
      cards.forEach((c) => {
        c.removeEventListener("mouseenter", slow)
        c.removeEventListener("mouseleave", resume)
      })
      window.removeEventListener("resize", build)
      stopWC()
      stopGate()
      tween?.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="overflow-hidden bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/tools/intro-icon.png"
          title="What clients say"
          sub="Our clients appreciate our attention to their needs and professionalism. Here are some of their testimonials"
        />
        {/* trust stats — real text (the desktop strip is a baked image) */}
        <div className="mt-8 flex items-stretch justify-center gap-6">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span className="text-[24px] font-medium leading-[28px] tracking-[-0.96px] text-white">
              6,000&thinsp;+
            </span>
            <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
              Trusted by users
            </span>
          </div>
          <div aria-hidden className="w-px self-stretch bg-line-strong" />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span className="flex items-center gap-2">
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
      </Container>

      {/* marquee band — reduced-motion just shows the static row */}
      <div className="mt-10">
        <div ref={trackRef} className="flex w-max items-start">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-start" aria-hidden={copy === 1}>
              {REVIEWS.map((r) => (
                <ReviewCard key={`${copy}-${r.name}`} r={r} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
