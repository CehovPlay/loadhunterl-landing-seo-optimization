"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { DISPATCH_BOARD, SAMPLE_LOAD, SAMPLE_NOTE } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { track } from "@/lib/analytics"
import { Panel } from "../Block"
import { SampleTag, Status } from "../ui"

gsap.registerPlugin(ScrollTrigger)

/**
 * Block 2 proof - the load arriving on the dispatch board.
 *
 * The tab asks for the load card to physically drive into the board and for the
 * route and the responsible person to appear. So the row travels in from the
 * left, along the same axis the page reads on, and the operating detail opens
 * under it. TZ §27.8 fixes what that detail has to contain: who owns it, the
 * next step, the timing, the open exception and the documents. Not a module
 * list - the tab is explicit that the centre of this scene is operational
 * control, not a feature inventory.
 *
 * The row is in the DOM from the first paint and only its transform is
 * animated, so the board is complete for a reader with no JavaScript and the
 * board's height never changes: nothing here can move the page.
 */
export function DispatchProof({ onInteract }: { onInteract: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const row = el.querySelector("[data-arriving]")
      if (!row) return
      gsap.set(row, { xPercent: -104, opacity: 0 })
      gsap.to(row, {
        xPercent: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      })
    }, root)

    return () => ctx.revert()
  }, [])

  function toggle() {
    setOpen((v) => {
      if (!v) {
        onInteract()
        track("product_proof_open", {
          product: "hunttms",
          proof_type: "dispatch_board",
          CTA_position: "block_02",
        })
      }
      return !v
    })
  }

  const cell = "text-small text-ink-2"

  return (
    <div ref={root} className="max-w-[56rem]">
      <Panel
        label={
          <>
            <h4 className="flex-1 text-small text-ink">Dispatch board</h4>
            <SampleTag>{SAMPLE_NOTE}</SampleTag>
          </>
        }
      >
        {/* Column titles are the board's own; on a phone each row repeats the
            ones that matter instead of scrolling a five-column table sideways. */}
        <div className="hidden grid-cols-[6rem_minmax(0,1fr)_9rem_6rem_7rem] gap-4 border-b border-rule px-5 py-3 md:grid">
          {DISPATCH_BOARD.columns.map((column) => (
            <span key={column} className="text-meta text-ink-3">
              {column}
            </span>
          ))}
        </div>

        <ul>
          {DISPATCH_BOARD.rows.map((row) => (
            <li
              key={row.load}
              className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-rule-soft px-5 py-4 md:grid-cols-[6rem_minmax(0,1fr)_9rem_6rem_7rem] md:items-center md:gap-y-0"
            >
              <span className="figures text-small text-ink-3">{row.load}</span>
              <span className={cell}>{row.driver}</span>
              <span className="text-small text-ink-3">{row.equipment}</span>
              <span className="figures text-small text-ink-3">{row.documents}</span>
              <span className="text-small text-ink-3">{row.status}</span>
            </li>
          ))}

          <li className="overflow-hidden border-b border-rule-soft">
            <div data-arriving>
              <button
                type="button"
                onClick={toggle}
                aria-expanded={open}
                className="grid w-full grid-cols-2 gap-x-4 gap-y-1 bg-violet-wash px-5 py-4 text-left transition-colors duration-200 hover:bg-violet-wash/70 md:grid-cols-[6rem_minmax(0,1fr)_9rem_6rem_7rem] md:items-center md:gap-y-0"
              >
                <span className="figures text-small text-violet-ink">{DISPATCH_BOARD.arriving.load}</span>
                <span className="text-small text-ink">{DISPATCH_BOARD.arriving.driver}</span>
                <span className="text-small text-ink-2">{DISPATCH_BOARD.arriving.equipment}</span>
                <span className="figures text-small text-ink-2">{DISPATCH_BOARD.arriving.documents}</span>
                <span className="text-small text-violet-ink">{DISPATCH_BOARD.arriving.status}</span>
              </button>
            </div>

            <div data-collapse={open ? "open" : "closed"}>
              <div className="overflow-hidden">
                <div className="border-t border-violet/30 bg-violet-wash/50 px-5 pt-5 pb-6">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="text-small text-ink">
                      {SAMPLE_LOAD.origin} to {SAMPLE_LOAD.destination}
                    </h4>
                    <span className="figures text-meta text-ink-3">
                      {SAMPLE_LOAD.loadedMiles} mi · {SAMPLE_LOAD.stops} stop
                    </span>
                  </div>

                  <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {DISPATCH_BOARD.detail.map((item) => (
                      <div key={item.label}>
                        <dt className="text-meta text-ink-3">{item.label}</dt>
                        <dd className="mt-0.5 text-small text-ink">{item.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-5">
                    <Status term="Live" scope="huntTMS" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </Panel>

      <p className="mt-4 max-w-[52ch] text-meta text-ink-3">
        {SAMPLE_NOTE}. The load from the previous step, on the board.{" "}
        {open ? "" : "Open it to see who owns it and what happens next."}
      </p>
    </div>
  )
}
