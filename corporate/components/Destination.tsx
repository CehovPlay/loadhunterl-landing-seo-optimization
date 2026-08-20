"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { BLOCKS, OS_TRAIL, SAMPLE_NOTE, SELECTOR } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { track } from "@/lib/analytics"
import { useStack } from "./StackContext"
import { RailNode } from "./Rail"
import { SampleTag } from "./ui"

gsap.registerPlugin(ScrollTrigger)

/**
 * Block 8 - the operating system is the destination.
 *
 * The tab asks for the final contour to show how an event in one product
 * reaches the next roles, and then for the road to become a personal CTA by
 * role. Both halves are here and both are literal.
 *
 * The map is a handoff list, not an automation diagram. Each line names the
 * event, the product it happens in, the role it reaches and the data it
 * carries - and nothing on it claims that the handoff happens by itself,
 * because the tab forbids promising automation that is not marked Live. What
 * the page can say honestly is what stops being retyped, so that is what the
 * "carries" column shows.
 *
 * The CTA is the one the visitor earned. Answer the three questions in block 6
 * and this block ends on that product's own next best action with the answers
 * printed next to it; skip them and it ends on the registry's secondary CTA,
 * which is the builder itself.
 */
export function Destination() {
  const root = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)
  const { complete, recommended, label } = useStack()
  const block = BLOCKS.eight

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        const half =
          entry.intersectionRatio >= 0.5 ||
          entry.intersectionRect.height >= window.innerHeight * 0.5
        if (!half) return
        setSeen(true)
        track("road_stage_view", { CTA_label: block.cta.label, CTA_position: "block_08" })
        io.disconnect()
      },
      { threshold: [0.25, 0.5, 0.75] },
    )
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>("[data-trail]")
      gsap.set(nodes, { opacity: 0, y: 12 })
      gsap.to(nodes, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id={block.id} className="relative scroll-mt-28 pb-24 md:pb-32">
      <RailNode className="top-1" />

      <div className="pl-9 md:pl-20">
        <div className="max-w-[46rem]">
          <p className="figures text-meta text-ink-3">{block.n}</p>
          {/* Blocks 06-08 are not stops on the road, so they get no display verb -
              nothing was handed to them and nothing is handed on. They do get
              the display face for their own heading, because after five 96px
              verbs a 40px h2 reads as the page running out of energy rather
              than as the road arriving somewhere. Hierarchy top to bottom:
              hero 124, stop verb 96, closing heading 64, block heading 40. */}
          <h2 className="display mt-5 max-w-[18ch] text-balance">{block.title}</h2>
          <h3 className="mt-4 max-w-[34ch] text-lead text-ink-2">{block.h3}</h3>
        </div>

        {/* The trail. One row per handoff on a phone, one connected track from
            lg up, where there is room to read it as a single line. */}
        <ol className="mt-10 grid gap-px overflow-hidden rounded-surface border border-rule bg-rule lg:grid-cols-5">
          {OS_TRAIL.map((step, index) => (
            <li key={step.event} data-trail className="flex flex-col bg-paper-2 p-5">
              <span className="flex items-baseline gap-2">
                <span className="figures text-meta text-ink-3">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-meta text-ink-3">{step.product}</span>
              </span>

              <h4 className="mt-3 text-small text-ink">{step.event}</h4>

              <p className="mt-4 flex items-baseline gap-2 text-meta text-ink-3">
                <ArrowRight size={12} weight="bold" className="translate-y-px text-violet" />
                {step.reaches}
              </p>
              <h5 className="mt-2 text-meta font-normal text-ink-2">{step.carries}</h5>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <SampleTag>{SAMPLE_NOTE}</SampleTag>
          <h5 className="max-w-[64ch] text-meta font-normal text-ink-3">
            What each step carries is what the next role stops retyping. Where a handoff is not
            marked Live in the status ledger, it is a workflow you run, not one that runs itself.
          </h5>
        </div>

        {/* The road turning into an action. */}
        <div className="mt-12" data-cta-gate={seen ? "open" : "closed"}>
          {complete && recommended ? (
            <div className="rounded-surface border border-violet bg-violet-wash p-6 md:p-8">
              <h4 className="text-meta text-ink-3">Your starting point</h4>
              <p className="mt-2 text-h3 text-ink">{recommended.name}</p>
              <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-meta">
                {(["role", "job", "size"] as const).map((key) => (
                  <div key={key} className="flex items-baseline gap-2">
                    <dt className="text-ink-3">{SELECTOR[key].label}</dt>
                    <dd className="text-ink-2">{label(key)}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={recommended.href}
                  onClick={() =>
                    track("final_cta_click", {
                      product: recommended.key,
                      CTA_label: recommended.next,
                      CTA_position: "block_08_personal",
                    })
                  }
                  className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-violet px-7 text-body font-medium whitespace-nowrap text-white transition duration-200 ease-out-quart hover:bg-violet-ink active:translate-y-px"
                >
                  {recommended.next}
                  <ArrowRight
                    size={17}
                    weight="bold"
                    className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
                  />
                </Link>
                <a
                  href={block.cta.href}
                  className="inline-flex min-h-11 items-center text-small text-ink-2 transition-colors duration-200 hover:text-ink"
                >
                  Change the answers
                </a>
              </div>
            </div>
          ) : (
            <a
              href={block.cta.href}
              onClick={() =>
                track("final_cta_click", {
                  CTA_label: block.cta.label,
                  CTA_position: "block_08",
                })
              }
              className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-violet px-7 text-body font-medium whitespace-nowrap text-white transition duration-200 ease-out-quart hover:bg-violet-ink active:translate-y-px"
            >
              {block.cta.label}
              <ArrowRight
                size={17}
                weight="bold"
                className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
              />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
