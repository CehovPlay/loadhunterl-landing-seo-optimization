"use client"

import Link from "next/link"
import { useRef } from "react"
import { ArrowRight, ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr"
import { BLOCKS, PRODUCTS, SELECTOR } from "@/content/home"
import { track } from "@/lib/analytics"
import { useStack } from "./StackContext"
import { RailNode } from "./Rail"
import { StatusList } from "./ui"

/**
 * Block 6 - choose your entry point.
 *
 * The tab's "exact text" for this block is an instruction rather than copy:
 * five cards compared on job-to-be-done, user, current status and next best
 * action; no two cards alike; each one opening a short interactive proof; and a
 * three-question route selector - role, then urgent job, then team size - whose
 * result recommends a product WITHOUT hiding the other four.
 *
 * So none of the words here are invented. The job line on each card is that
 * product page's own H1, the user line is its audience, the status comes from
 * the ledger, the next best action is the CTA the registry assigns it, and the
 * three questions offer the site's own governed vocabulary: the audiences from
 * this page's passport, the JTBD routing sentences from master §2.3 and the
 * priority segments from §2.2.
 *
 * "A short interactive proof" is not a new demo per card either - it is the one
 * already on this page for that product, so the card sends the visitor back up
 * the road rather than opening a second, unverified version of it.
 *
 * This block owns its CTA rather than delegating to the shared shell, because
 * the CTA here IS the builder: the tab's gate ("after interaction or 50% of the
 * block") is satisfied by the visitor answering, and an unanswered selector has
 * nothing to submit.
 */
export function EntryPoint() {
  const { answers, answer, label, complete, recommended, reset } = useStack()
  const started = useRef(false)
  const block = BLOCKS.six

  /** Sends the visitor to the first question they have not answered yet. */
  function focusNext() {
    const key = (["role", "job", "size"] as const).find((k) => !answers[k])
    if (!key) return
    const first = SELECTOR[key].options[0]
    const input = document.getElementById(`selector-${key}-${first.id}`)
    input?.focus()
    input?.scrollIntoView({ block: "center", behavior: "smooth" })
    if (!started.current) {
      started.current = true
      track("stack_builder_start", { CTA_label: BLOCKS.six.cta.label, CTA_position: "block_06" })
    }
  }

  function choose(key: "role" | "job" | "size", id: string) {
    if (!started.current) {
      started.current = true
      track("stack_builder_start", { CTA_position: "block_06" })
    }
    answer(key, id)

    const next = { ...answers, [key]: id }
    if (next.role && next.job && next.size) {
      track("stack_builder_complete", {
        product: next.job,
        audience: next.role,
        proof_type: "route_selector",
        CTA_label: block.cta.label,
        CTA_position: "block_06",
        team_size: next.size,
      })
    }
  }

  return (
    <section id={block.id} className="relative scroll-mt-28 pb-24 md:pb-32">
      <RailNode className="top-1" />

      <div className="pl-9 md:pl-20">
        <div className="max-w-[46rem]">
          <p className="figures text-meta text-ink-3">{block.n}</p>
          <h2 className="mt-4 max-w-[22ch] text-h2 text-balance">{block.title}</h2>
          <h3 className="mt-4 max-w-[34ch] text-lead text-ink-2">{block.h3}</h3>
        </div>

        {/* The selector. Three questions, each a real radio group, so a keyboard
            or screen reader moves through it the same way a pointer does. */}
        <div className="mt-10 rounded-surface border border-rule bg-paper-2 p-5 md:p-7">
          <div className="flex flex-col gap-6">
            {(["role", "job", "size"] as const).map((key, index) => (
              <fieldset key={key}>
                <legend className="flex items-baseline gap-3 text-meta text-ink-3">
                  <span className="figures">{String(index + 1).padStart(2, "0")}</span>
                  {SELECTOR[key].label}
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SELECTOR[key].options.map((option) => {
                    const active = answers[key] === option.id
                    return (
                      <label
                        key={option.id}
                        className={
                          "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-small transition duration-200 ease-out-quart " +
                          /* The radio itself is visually hidden, so the pill
                             has to carry the focus ring for it. */
                          "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet " +
                          (active
                            ? "border-violet bg-violet text-white"
                            : "border-rule bg-paper-2 text-ink-2 hover:border-violet-soft hover:text-ink")
                        }
                      >
                        <input
                          type="radio"
                          id={`selector-${key}-${option.id}`}
                          name={`selector-${key}`}
                          value={option.id}
                          checked={active}
                          onChange={() => choose(key, option.id)}
                          className="sr-only"
                        />
                        {option.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {/* The result. It explains itself by showing the mapping it used,
              which is what FAQ answer 5 promises the visitor. */}
          <div aria-live="polite" className="mt-7 border-t border-rule pt-6">
            {complete && recommended ? (
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h4 className="text-meta text-ink-3">Recommended starting point</h4>
                  <p className="mt-2 text-h3 text-ink">{recommended.name}</p>
                  <p className="mt-2 max-w-[46ch] text-small text-ink-2">{recommended.job}</p>
                  <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-meta">
                    {(["role", "job", "size"] as const).map((key) => (
                      <div key={key} className="flex items-baseline gap-2">
                        <dt className="text-ink-3">{SELECTOR[key].label}</dt>
                        <dd className="text-ink-2">{label(key)}</dd>
                      </div>
                    ))}
                  </dl>
                  <StatusList entries={recommended.statuses} className="mt-4" />
                </div>

                <div className="flex shrink-0 flex-col items-start gap-3">
                  <Link
                    href={recommended.href}
                    onClick={() =>
                      track("final_cta_click", {
                        product: recommended.key,
                        audience: answers.role,
                        CTA_label: recommended.next,
                        CTA_position: "block_06_result",
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
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex min-h-11 items-center gap-2 text-small text-ink-3 transition-colors duration-200 hover:text-ink"
                  >
                    <ArrowCounterClockwise size={14} weight="bold" />
                    Start over
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4">
                <p className="max-w-[52ch] text-small text-ink-3">
                  Answer all three and the page names one starting product, shows why it was chosen
                  and leaves the other four in view.
                </p>
                {/* The registry's label for this block, on the control that
                    actually does the work: it moves focus to the first question
                    still unanswered instead of pretending to submit. */}
                <button
                  type="button"
                  onClick={focusNext}
                  className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-violet px-6 text-small font-medium whitespace-nowrap text-violet-ink transition duration-200 ease-out-quart hover:bg-violet hover:text-white active:translate-y-px"
                >
                  {block.cta.label}
                  <ArrowRight
                    size={15}
                    weight="bold"
                    className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* The five, always visible. Never hidden by the recommendation. */}
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PRODUCTS.map((product) => {
            const picked = recommended?.key === product.key
            return (
              <li
                key={product.key}
                className={
                  "flex flex-col rounded-surface border p-5 transition duration-300 ease-out-quart " +
                  (picked
                    ? "border-violet bg-violet-wash sm:col-span-2 xl:col-span-1"
                    : "border-rule bg-paper-2")
                }
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="text-h3 text-ink">{product.name}</h4>
                  <span className="text-meta text-ink-3">{product.role}</span>
                </div>

                <p className="mt-3 text-small text-ink-2">{product.job}</p>

                <h5 className="mt-5 text-meta font-normal text-ink-3">Who it is for</h5>
                <p className="mt-1 text-meta text-ink-2">{product.user}</p>

                <h5 className="mt-5 text-meta font-normal text-ink-3">Current availability</h5>
                <StatusList entries={product.statuses} className="mt-1.5" />

                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                  <Link
                    href={product.href}
                    onClick={() =>
                      track("final_cta_click", {
                        product: product.key,
                        CTA_label: product.next,
                        CTA_position: "block_06_card",
                      })
                    }
                    className="group inline-flex min-h-11 items-center gap-2 text-small font-medium text-violet-ink transition-colors duration-200 hover:text-ink"
                  >
                    {product.next}
                    <ArrowRight
                      size={14}
                      weight="bold"
                      className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
                    />
                  </Link>
                  <a
                    href={product.block}
                    onClick={() =>
                      track("product_proof_open", {
                        product: product.key,
                        proof_type: "back_to_stage",
                        CTA_position: "block_06_card",
                      })
                    }
                    className="inline-flex min-h-11 items-center text-small text-ink-3 transition-colors duration-200 hover:text-ink"
                  >
                    See the proof
                  </a>
                </div>

                {picked ? (
                  <p className="mt-4 border-t border-violet/30 pt-3 text-meta text-violet-ink">
                    Recommended for the answers above.
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
