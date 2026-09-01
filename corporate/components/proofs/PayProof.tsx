"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PAY_TIMELINE, SAMPLE_LOAD, SAMPLE_NOTE } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { Panel } from "../Block"
import { SampleTag, Status } from "../ui"

gsap.registerPlugin(ScrollTrigger)

/**
 * Block 4 proof - proof of delivery becoming an invoice timeline.
 *
 * The tab is strict about the money on this scene: amounts may be shown only
 * from confirmed demo data. So exactly one figure appears here, the sample
 * load's own line haul, on the two states where an invoice actually carries an
 * amount. No fee, no margin, no days-to-pay, no "average" anything.
 *
 * Every state names its owner and the evidence it rests on, which is how the
 * product page describes the shipped workflow, and the factoring step carries
 * its own In Progress status rather than hiding inside a product-level badge.
 *
 * The steps fade up in reading order as the section arrives. That is the whole
 * animation: it says the trail runs one way and is finished by the time the
 * visitor reaches the CTA.
 */
export function PayProof() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-pay-step]")
      gsap.set(steps, { opacity: 0, y: 10 })
      gsap.to(steps, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 74%", once: true },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="lg:max-w-[560px]">
      <Panel
        label={
          <>
            <h4 className="flex-1 text-small text-ink">
              Load {SAMPLE_LOAD.id} · delivered to paid
            </h4>
            <SampleTag>{SAMPLE_NOTE}</SampleTag>
          </>
        }
      >
        <ol className="px-5 py-5">
          {PAY_TIMELINE.map((step, index) => (
            <li key={step.step} data-pay-step className="relative flex gap-4 pb-6 last:pb-0">
              <span aria-hidden="true" className="relative flex w-3 shrink-0 justify-center">
                {index < PAY_TIMELINE.length - 1 ? (
                  <span className="absolute top-3 bottom-[-1.5rem] w-px bg-rule" />
                ) : null}
                <span className="relative mt-1.5 size-[9px] rounded-full border border-violet bg-paper-2" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h4 className="text-small text-ink">{step.step}</h4>
                  {step.amount ? (
                    <span className="figures text-body text-ink">{step.amount}</span>
                  ) : null}
                </span>
                <h5 className="mt-1 text-meta font-normal text-ink-3">
                  {step.owner} · {step.evidence}
                </h5>
              </span>
            </li>
          ))}
        </ol>

        <div className="border-t border-rule px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Status term="Live" scope="Invoicing and payroll" />
            <Status term="In Progress" scope="Direct factoring integration" />
          </div>
          <h5 className="mt-3 max-w-[52ch] text-meta font-normal text-ink-3">
            The amount is the sample load&apos;s line haul. Payment terms, fees and timing depend on
            your own agreements and are not modelled here.
          </h5>
        </div>
      </Panel>
    </div>
  )
}
