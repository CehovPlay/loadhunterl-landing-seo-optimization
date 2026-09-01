"use client"

import { useState } from "react"
import { ArrowRight, ArrowCounterClockwise, Check } from "@phosphor-icons/react/dist/ssr"
import { DRIVER_STEPS, SAMPLE_LOAD, SAMPLE_NOTE } from "@/content/home"
import { track } from "@/lib/analytics"
import { Panel } from "../Block"
import { SampleTag, Status } from "../ui"

/**
 * Block 3 proof - the driver lane and the office consequence.
 *
 * The tab asks for the road to turn into a mobile lane where a driver action
 * changes the status on the desktop panel, so this is the one place on the page
 * where the visitor drives the demonstration: they take the driver's action and
 * watch the office side change. That is the product's entire claim - "the
 * operational consequence, not another stream of disconnected messages" - and
 * it cannot be shown with a screenshot.
 *
 * The driver side shows exactly one action, because that is the shipped design:
 * one clear next step, with the trip context needed to complete it.
 *
 * Everything is real buttons and a real list, so keyboard and screen-reader
 * users get the same sequence (TZ §17.1), and the office side is announced with
 * aria-live so the consequence is heard, not only seen. No timers run: nothing
 * moves unless the visitor moves it, which is what reduced motion needs anyway.
 */
export function DriverProof({ onInteract }: { onInteract: () => void }) {
  const [done, setDone] = useState(0)
  const current = DRIVER_STEPS[done]
  const complete = done >= DRIVER_STEPS.length

  function advance() {
    setDone((n) => n + 1)
    onInteract()
    track("product_proof_open", {
      product: "huntdrive",
      proof_type: "driver_action",
      CTA_position: "block_03",
    })
  }

  return (
    <div className="grid max-w-[56rem] gap-8 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-start">
      {/* The mobile lane. */}
      <div className="rounded-[26px] border border-rule bg-paper-2 p-3 shadow-[0_1px_0_0_rgba(18,19,23,0.03),0_18px_40px_-28px_rgba(18,19,23,0.25)]">
        <div className="rounded-[18px] bg-night px-4 pt-4 pb-5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-meta text-night-ink">huntDRIVE</h4>
            <span className="text-meta text-night-ink-3">{SAMPLE_LOAD.id}</span>
          </div>

          <p className="mt-4 text-small text-night-ink">
            {SAMPLE_LOAD.origin} to {SAMPLE_LOAD.destination}
          </p>
          <p className="mt-1 text-meta text-night-ink-3">
            {SAMPLE_LOAD.equipment} · picks up {SAMPLE_LOAD.pickup}
          </p>

          {complete ? (
            <>
              <p className="mt-6 flex items-center gap-2 text-small text-live-night">
                <Check size={15} weight="bold" />
                Trip complete
              </p>
              <button
                type="button"
                onClick={() => setDone(0)}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-night-edge text-small text-night-ink transition-colors duration-200 hover:bg-night-field"
              >
                <ArrowCounterClockwise size={14} weight="bold" />
                Run it again
              </button>
            </>
          ) : (
            <>
              <h5 className="mt-6 text-meta font-normal text-night-ink-3">Next action</h5>
              <button
                type="button"
                onClick={advance}
                className="mt-2 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-violet px-5 text-small font-medium text-white transition duration-200 ease-out-quart hover:opacity-90 active:translate-y-px"
              >
                {current.action}
                <ArrowRight size={15} weight="bold" />
              </button>
              <p className="mt-3 text-meta text-night-ink-3">
                One action at a time. The driver never picks from a menu.
              </p>
            </>
          )}
        </div>
      </div>

      {/* The office consequence. */}
      <Panel
        label={
          <>
            <h4 className="flex-1 text-small text-ink">Dispatch view</h4>
            <SampleTag>{SAMPLE_NOTE}</SampleTag>
          </>
        }
      >
        <ol aria-live="polite" className="px-5 py-4">
          {DRIVER_STEPS.map((step, index) => {
            const reached = index < done
            return (
              <li key={step.action} className="relative flex gap-4 pb-5 last:pb-0">
                <span aria-hidden="true" className="relative flex w-3 shrink-0 justify-center">
                  {index < DRIVER_STEPS.length - 1 ? (
                    <span
                      className={
                        "absolute top-3 bottom-[-1.25rem] w-px " +
                        (reached ? "bg-violet/50" : "bg-rule")
                      }
                    />
                  ) : null}
                  <span
                    className={
                      "relative mt-1.5 size-[9px] rounded-full transition-colors duration-300 " +
                      (reached ? "bg-violet" : "border border-rule bg-paper-2")
                    }
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className={"text-small " + (reached ? "text-ink" : "text-ink-3")}>
                      {step.office}
                    </span>
                    <span className={"figures text-meta " + (reached ? "text-ink-3" : "text-ink-3")}>
                      {reached ? step.at : "pending"}
                    </span>
                  </span>
                  <span
                    className={
                      "mt-1 block text-meta transition-opacity duration-300 " +
                      (reached ? "text-ink-3 opacity-100" : "text-ink-3 opacity-0")
                    }
                  >
                    {step.detail}
                  </span>
                </span>
              </li>
            )
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rule px-5 py-4">
          <Status term="Live" scope="Telegram workflow" />
          <Status term="In Progress" scope="Native app" />
        </div>
      </Panel>
    </div>
  )
}
