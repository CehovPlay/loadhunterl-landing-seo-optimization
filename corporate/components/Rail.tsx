"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { prefersReducedMotion } from "@/lib/motion"

gsap.registerPlugin(ScrollTrigger)

/**
 * The rail.
 *
 * One hairline runs the whole height of the page at the left edge of the
 * content column, and a violet segment grows down it in step with scroll
 * position. That is the entire continuity device for this page: TZ §25.1 asks
 * for one road that the same load travels, and §26.3 lists continuity as the
 * first conversion trigger, so the line is load-bearing, not decoration.
 *
 * It is scrubbed, never eased. The scrollbar is the clock; adding a curve on
 * top of it reads as the page lagging the wheel.
 */
export function Rail() {
  const wrap = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !wrap.current || !progress.current) return

    const ctx = gsap.context(() => {
      gsap.set(progress.current, { scaleY: 0, transformOrigin: "top center" })
      gsap.to(progress.current, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none absolute top-0 bottom-0 left-5 w-px md:left-10"
    >
      {/* A tint of ink rather than the flat rule token: the line has to hold
          on the hero's shader band as well as on paper, and #e8e8e8 vanishes
          into the band. */}
      <div className="absolute inset-0 bg-ink/10" />
      <div ref={progress} className="absolute inset-0 origin-top bg-violet/70" />
    </div>
  )
}

/**
 * A node on the rail. Sits exactly on the line, opposite whatever it marks, and
 * fills once the travelled segment has reached it. It is the only "you are
 * here" signal on the page, which is why a coloured dot is justified here and
 * nowhere else.
 */
export function RailNode({ className = "" }: { className?: string }) {
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !el.current) return
    const node = el.current

    const st = ScrollTrigger.create({
      trigger: node,
      start: "top 55%",
      onEnter: () => node.setAttribute("data-reached", "true"),
      onLeaveBack: () => node.removeAttribute("data-reached"),
    })

    return () => st.kill()
  }, [])

  return (
    <span
      ref={el}
      aria-hidden="true"
      className={
        "absolute left-0 z-10 block size-[9px] -translate-x-1/2 rounded-full border border-rule bg-paper " +
        "transition duration-300 ease-out-quart " +
        "data-[reached=true]:scale-125 data-[reached=true]:border-violet data-[reached=true]:bg-violet " +
        className
      }
    />
  )
}

/**
 * A spur: the short hairline connecting the rail to an object that sits away
 * from it. It draws itself when that object arrives, which is what makes the
 * composition read as one continuous drawing instead of a left border with
 * unrelated content next to it.
 */
export function RailSpur({ className = "" }: { className?: string }) {
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !el.current) return
    const node = el.current

    const ctx = gsap.context(() => {
      gsap.set(node, { scaleX: 0, transformOrigin: "left center" })
      gsap.to(node, {
        scaleX: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 82%", once: true },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <span
      ref={el}
      aria-hidden="true"
      className={"absolute left-0 block h-px origin-left bg-rule " + className}
    />
  )
}
