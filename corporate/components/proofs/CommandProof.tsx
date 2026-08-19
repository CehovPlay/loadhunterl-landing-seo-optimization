"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { EXCEPTIONS, SAMPLE_NOTE } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { Panel } from "../Block"
import { SampleTag } from "../ui"

gsap.registerPlugin(ScrollTrigger)

const LANES = ["LoadHunter", "huntTMS", "huntDRIVE", "huntPAY"] as const

/**
 * Block 5 proof - four lanes converging, then what the command layer puts
 * first.
 *
 * The tab asks for the four road lanes to converge into a command room. The
 * lanes are the four products that produce signals; the room is a list of
 * exceptions, not a wall of KPIs, because that is what the product page says
 * huntOS opens with: what changed and what it affects.
 *
 * Every exception names the product the signal came from. That is the honest
 * form of a "unifying layer" claim while cross-product intelligence is still In
 * Progress: the page can show where each line comes from without implying that
 * anything has been fused that has not.
 *
 * The lane names and the destination are real text in the layout; the drawing
 * behind them is decorative and hidden from assistive technology, so the
 * diagram is never the only way to read the relationship.
 */
export function CommandProof() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      /* Opacity, not a dash draw: the lanes live in a viewBox that is
         stretched horizontally to meet the four labels, and a dash pattern in
         user units comes out of that stretch unevenly - it renders as gaps in
         the middle of a line rather than as a line being drawn. */
      const paths = gsap.utils.toArray<SVGPathElement>("[data-lane]")
      gsap.set(paths, { opacity: 0 })
      gsap.to(paths, {
        opacity: 1,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 76%", once: true },
      })

      const rows = gsap.utils.toArray<HTMLElement>("[data-exception]")
      gsap.set(rows, { opacity: 0, y: 10 })
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 62%", once: true },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="max-w-[46rem]">
      <div className="grid max-w-[34rem] grid-cols-[auto_minmax(2.5rem,1fr)_auto] items-center gap-x-3 sm:gap-x-4">
        <ul className="flex flex-col gap-4 py-1">
          {LANES.map((lane) => (
            <li key={lane} className="text-small whitespace-nowrap text-ink-2">
              {lane}
            </li>
          ))}
        </ul>

        <svg
          aria-hidden="true"
          viewBox="0 0 100 132"
          preserveAspectRatio="none"
          className="h-[132px] w-full"
        >
          {[10, 46, 82, 118].map((y) => (
            <path
              key={y}
              data-lane
              d={`M0 ${y} C 42 ${y}, 58 66, 100 66`}
              fill="none"
              stroke="var(--color-violet)"
              strokeOpacity={0.55}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <circle cx="100" cy="66" r="2.5" fill="var(--color-violet)" vectorEffect="non-scaling-stroke" />
        </svg>

        <p className="rounded-full border border-violet bg-violet-wash px-4 py-2 text-small whitespace-nowrap text-violet-ink">
          huntOS
        </p>
      </div>

      <Panel
        className="mt-8 max-w-[42rem]"
        label={
          <>
            <h4 className="flex-1 text-small text-ink">Needs a decision</h4>
            <SampleTag>{SAMPLE_NOTE}</SampleTag>
          </>
        }
      >
        <ul>
          {EXCEPTIONS.map((item) => (
            <li
              key={item.title}
              data-exception
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rule-soft px-5 py-4 last:border-b-0"
            >
              <span className="min-w-0 flex-1 text-small text-ink">{item.title}</span>
              <span className="rounded-chip bg-paper-3 px-2 py-0.5 text-meta text-ink-3">
                {item.source}
              </span>
              <span className="figures text-meta text-ink-3">{item.load}</span>
              <span className="figures text-meta text-ink-3">{item.age}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <h5 className="mt-4 max-w-[56ch] text-meta font-normal text-ink-3">
        Priority order, not a dashboard. Each line names the product the signal came from, because
        the unified cross-product layer is still In Progress.
      </h5>
    </div>
  )
}
