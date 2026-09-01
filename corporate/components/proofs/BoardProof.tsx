"use client"

import { useEffect, useRef, useState } from "react"
import { BOARD_ROWS, LOADHUNTER_ACTION, LOADHUNTER_LAYER, SAMPLE_LOAD, SAMPLE_NOTE } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { track } from "@/lib/analytics"
import { Panel } from "../Block"
import { SampleTag, Status } from "../ui"

/**
 * Block 1 proof - the board result, then the same result with the LoadHunter
 * layer on it.
 *
 * The tab asks for a browser screen where the cursor picks out the relevant
 * load, and for a static before/after under reduced motion. Both states are
 * therefore real states of one control, not an animation: the visitor can move
 * between them at any time, with a pointer or with the keyboard, and a visitor
 * who has asked for less motion simply lands on the "before" state with the
 * "after" one switch away.
 *
 * TZ §7.2 governs what the layer may say. The RPM formula is printed beside the
 * figure, deadhead is explained rather than asserted, and the broker row says
 * "Not published" instead of being dropped, because a field the product cannot
 * legitimately source has to say so. §27.7 forbids third-party load-board
 * logos, so the frame is a neutral browser chrome with no brand on it.
 */
export function BoardProof({ onInteract }: { onInteract: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [applied, setApplied] = useState(false)
  const [highlight, setHighlight] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setHighlight(true)
      return
    }
    const reduced = prefersReducedMotion()
    let timer = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHighlight(true)
        /* The demonstration plays itself once, so the visitor sees what the
           control does before deciding to touch it. Reduced motion holds on
           the raw result and leaves the switch to them. */
        if (!reduced) timer = window.setTimeout(() => setApplied(true), 900)
        io.disconnect()
      },
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  function choose(next: boolean) {
    setApplied(next)
    onInteract()
    track("product_proof_open", {
      product: "loadhunter",
      proof_type: next ? "loadhunter_layer" : "board_result",
      CTA_position: "block_01",
    })
  }

  return (
    <div ref={root} className="lg:max-w-[560px]">
      {/* Two real states of one control. TZ §17.1 - a tap target and a keyboard
          path for every interaction on the page. */}
      <div
        role="group"
        aria-label="Load result view"
        className="mb-4 inline-flex rounded-full border border-rule bg-paper-2 p-1"
      >
        {[
          { id: false, label: "Board result" },
          { id: true, label: "With LoadHunter" },
        ].map((option) => (
          <button
            key={String(option.id)}
            type="button"
            aria-pressed={applied === option.id}
            onClick={() => choose(option.id)}
            className={
              "min-h-9 rounded-full px-4 text-small transition duration-200 ease-out-quart " +
              (applied === option.id
                ? "bg-violet text-white"
                : "text-ink-2 hover:text-ink")
            }
          >
            {option.label}
          </button>
        ))}
      </div>

      <Panel
        label={
          <>
            <span aria-hidden="true" className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rule" />
              <span className="size-2 rounded-full bg-rule" />
              <span className="size-2 rounded-full bg-rule" />
            </span>
            <span className="figures flex-1 truncate rounded-chip bg-paper-3 px-3 py-1 text-meta text-ink-3">
              load board · search results
            </span>
            <SampleTag>{SAMPLE_NOTE}</SampleTag>
          </>
        }
      >
        <ul>
          {BOARD_ROWS.map((row) => (
            <li
              key={row.lane}
              className={
                "relative border-b border-rule-soft px-5 py-4 transition-colors duration-500 " +
                (row.match && highlight ? "bg-violet-wash" : "")
              }
            >
              {row.match && highlight ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px] bg-violet"
                />
              ) : null}
              <div className="flex items-baseline justify-between gap-4">
                <p className={row.match ? "text-body text-ink" : "text-body text-ink-3"}>{row.lane}</p>
                <p className={"figures text-body " + (row.match ? "text-ink" : "text-ink-3")}>
                  {row.rate}
                </p>
              </div>
              <p className="mt-1 text-meta text-ink-3">
                <span className="figures">{row.miles}</span> mi
                {row.match ? " · picks up " + SAMPLE_LOAD.pickup : ""}
              </p>
            </li>
          ))}
        </ul>

        {/* The layer. Same load, same row: everything below the violet seam is
            what the product adds to the result the board already gave. */}
        <div data-collapse={applied ? "open" : "closed"}>
          <div className="overflow-hidden">
            <div className="border-t-2 border-violet bg-violet-wash/60 px-5 pt-5 pb-6">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="text-meta text-violet-ink">LoadHunter layer</h4>
                <Status term="Live" />
              </div>

              <dl className="mt-4 flex flex-col gap-4">
                {LOADHUNTER_LAYER.map((row) => (
                  <div key={row.id}>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-small text-ink-2">{row.label}</dt>
                      <dd className="figures text-body text-ink">{row.value}</dd>
                    </div>
                    {/* H5 is the tab's level for micro-proof and technical
                        notes, and the formula behind a figure is exactly that. */}
                    <h5 className="mt-1 text-meta font-normal text-ink-3">{row.note}</h5>
                  </div>
                ))}
              </dl>

              <div className="mt-6">
                <span className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-violet px-5 text-small font-medium text-violet-ink">
                  {LOADHUNTER_ACTION.label}
                </span>
                <h5 className="mt-3 text-meta font-normal text-ink-3">{LOADHUNTER_ACTION.note}</h5>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <p className="mt-4 max-w-[46ch] text-meta text-ink-3">
        {SAMPLE_NOTE}. The same result in both states. Figures are illustrative and are not a
        market rate.
      </p>
    </div>
  )
}
