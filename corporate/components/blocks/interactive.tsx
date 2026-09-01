"use client"

import { useState } from "react"
import { Reveal } from "@/components/system/Reveal"
import { WakeItem, WakeList } from "@/components/system/Wake"
import { Motif } from "@/components/system/Motif"
import { Ordinal } from "@/components/system/atoms"
import {
  BlockAction,
  BlockIntro,
  BlockSection,
  isBuildNote,
  listing,
  ProofSlot,
  SpecCaption,
  Wireframe,
  type BlockProps,
} from "./kit"

/**
 * The archetypes that hold state.
 *
 * Each one is a skeleton of the interaction its TZ block specifies: the shape,
 * the states and the keyboard behaviour are real, the content behind them is
 * the proof slot. Building the shell now is what makes the page's rhythm
 * honest - a selector that is really a static list would let the finished page
 * come out a very different height.
 */

/**
 * Sticky option rail on the left, panel on the right.
 *
 * cosmoq's "All-in-one AI for enterprise". The rail is the section's whole
 * navigation: three or four words per row, an underline under the active one,
 * and the panel swapping beside it. On paper the active row gets ink and a
 * violet rule; the rest sit at ink-3.
 */
export function SelectorBlock({ block, motif, page, total }: BlockProps) {
  const { items, block: intro } = listing(block, ["Overview", "Mechanism", "Status"])
  const [active, setActive] = useState(0)

  return (
    <BlockSection id={`block-${block.n}`}>
      <BlockIntro block={intro} total={total} wide className="max-w-[52ch]" />
      <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28" role="tablist" aria-label={block.name}>
            {items.map((item, i) => (
              <button
                key={item}
                role="tab"
                type="button"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={
                  "flex w-full items-center gap-3 border-b py-4 text-left text-small transition-colors " +
                  (i === active
                    ? "border-violet text-ink"
                    : "border-rule text-ink-3 hover:text-ink-2")
                }
              >
                <Ordinal n={i + 1} />
                <span className="first-letter:uppercase">{item}</span>
              </button>
            ))}
            <div className="mt-8">
              <BlockAction block={block} page={page} />
            </div>
          </div>
        </div>
        <Reveal delay={60} className="md:col-span-8 md:col-start-5">
          <ProofSlot motif={motif} spec={block.visual} />
          <p className="mt-4 text-small text-ink-3">
            Selected: <span className="text-ink-2 first-letter:uppercase">{items[active]}</span>
          </p>
        </Reveal>
      </div>
    </BlockSection>
  )
}

/**
 * Numbered steps under a progress rail.
 *
 * cosmoq's "3 Steps to Kickstart": a hairline across the full width with the
 * ordinals sitting on it and a violet segment filling to the step you have
 * reached, then one very large card per step below. The rail is what makes it
 * a sequence rather than three cards.
 */
export function StepsBlock({ block, motif, page, total }: BlockProps) {
  const { items: steps, block: intro } = listing(block, ["Set up", "Run", "Review"])
  return (
    <BlockSection id={`block-${block.n}`}>
      <BlockIntro block={intro} total={total} wide className="max-w-[52ch]" />
      <div className="mt-5">
        <SpecCaption>{block.visual}</SpecCaption>
      </div>
      <WakeList count={steps.length}>
        {(awake) => (
          <div className="mt-14">
            <div className="relative flex" aria-hidden>
              <span className="absolute inset-x-0 top-6 h-px bg-rule" />
              <span
                className="absolute top-6 left-0 h-px bg-violet transition-[width] duration-500"
                style={{ width: `${((awake + 1) / steps.length) * 100}%` }}
              />
              {steps.map((s, i) => (
                <span key={s} className="flex-1 pb-8">
                  <Ordinal n={i + 1} />
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-5">
              {steps.map((step, i) => (
                <WakeItem key={step} asleep={i > awake}>
                  <div className="grid items-center gap-8 overflow-hidden rounded-card-lg border border-rule bg-paper-2 p-6 shadow-[var(--shadow-lift)] md:grid-cols-12 md:p-8">
                    <div className="flex items-baseline gap-5 md:col-span-5">
                      {/* The ordinal at display size does the work the missing
                          per-step copy would have done: it fills the column,
                          and it says where you are without inventing a
                          sentence the document never wrote. */}
                      <span
                        aria-hidden
                        className="figures text-[clamp(2.5rem,2rem+1.6vw,3.75rem)] leading-none text-ink-4/50"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <Ordinal n={i + 1} total={steps.length} />
                        <p className="mt-2 text-h3 font-medium tracking-[-0.035em] text-ink first-letter:uppercase">
                          {step}
                        </p>
                      </span>
                    </div>
                    {/* The step's own panel. Two record rows, not a grey box
                        with a motif in the corner: the card is as tall as its
                        content instead of holding open a 160px void that the
                        finished step will not need. */}
                    <div className="relative overflow-hidden rounded-card border border-rule-soft bg-paper-3/70 p-4 md:col-span-6 md:col-start-7">
                      <div aria-hidden className="dust absolute inset-0 opacity-50" />
                      <Motif
                        kind={motif}
                        className="pointer-events-none absolute -right-10 -bottom-12 size-40 opacity-50"
                      />
                      <div className="relative">
                        <Wireframe rows={2} />
                      </div>
                    </div>
                  </div>
                </WakeItem>
              ))}
            </div>
          </div>
        )}
      </WakeList>
      <BlockAction block={block} page={page} />
    </BlockSection>
  )
}

/**
 * A load moving through checkpoints.
 *
 * This one is ours rather than either reference's, because the specification
 * keeps asking for it - "interactive journey with five checkpoints",
 * "end-to-end synthetic workflow with product status at every transition" - and
 * neither cosmoq nor Vestora has a horizontal trail. It borrows the progress
 * rail from cosmoq's steps and the one-awake rule from Vestora's lists, laid
 * out along the axis the freight actually travels.
 */
export function JourneyBlock({ block, motif, page, total }: BlockProps) {
  const { items: stops, block: intro } = listing(block, ["Find", "Run", "Move", "Get paid", "Control"])
  return (
    <BlockSection id={`block-${block.n}`}>
      <div className="grid gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-4">
          <BlockIntro block={intro} total={total} wide />
          <BlockAction block={block} page={page} />
        </div>

        <Reveal delay={80} className="md:col-span-8">
          <div className="relative isolate overflow-hidden rounded-card-lg border border-rule bg-paper-2 p-6 shadow-[var(--shadow-lift)] md:p-10">
            <div aria-hidden className="dust absolute inset-0 opacity-50" />
            <div aria-hidden className="aurora-soft absolute inset-0" />
            <Motif
              kind={motif}
              className="pointer-events-none absolute -right-16 -bottom-20 size-72 opacity-40"
            />

            <WakeList count={stops.length}>
              {(awake) => (
                <ol className="relative">
                  <span aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-rule" />
                  <span
                    aria-hidden
                    className="absolute top-2 left-[7px] w-px bg-violet transition-[height] duration-500"
                    style={{ height: `${((awake + 0.5) / stops.length) * 100}%` }}
                  />
                  {stops.map((stop, i) => (
                    <li key={stop} className="relative pb-7 pl-10 last:pb-0">
                      <span
                        aria-hidden
                        className={
                          "absolute top-1.5 left-0 size-[15px] rounded-full border-2 bg-paper-2 transition-colors " +
                          (i <= awake ? "border-violet" : "border-rule")
                        }
                      />
                      <WakeItem asleep={i > awake}>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p className="text-body text-ink first-letter:uppercase">{stop}</p>
                          <span className="figures text-meta text-ink-4">
                            checkpoint {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </WakeItem>
                    </li>
                  ))}
                </ol>
              )}
            </WakeList>

            {/* The block's specified interaction, stated once rather than
                repeated under every checkpoint - the stops are the shape, this
                is what still has to be built into it. */}
            <div className="relative mt-8 border-t border-rule pt-5">
              <p className="text-small text-ink-3">
                Every transition prints its product owner and connection status.
              </p>
              <SpecCaption className="mt-3">{block.visual}</SpecCaption>
            </div>
          </div>
        </Reveal>
      </div>
    </BlockSection>
  )
}

/**
 * A library that scrolls sideways.
 *
 * cosmoq's testimonial carousel, where the neighbouring cards peek in from
 * both edges so the row announces that it continues. Used for every "case
 * library rail", article list and resource shelf in the specification. Native
 * scroll with snap points rather than a JavaScript carousel: it keeps the
 * keyboard and the trackpad working and costs nothing.
 */
export function RailBlock({ block, motif, page, total }: BlockProps) {
  const cards = Array.from({ length: 6 })
  return (
    <BlockSection id={`block-${block.n}`}>
      <BlockIntro block={block} total={total} wide className="max-w-[52ch]" />
      <div
        className="mt-12 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10"
        tabIndex={0}
        role="group"
        aria-label={block.name}
      >
        {cards.map((_, i) => (
          <article
            key={i}
            className="w-[78vw] shrink-0 snap-start overflow-hidden rounded-card border border-rule bg-paper-2 shadow-[var(--shadow-lift)] sm:w-[22rem]"
          >
            <div className="relative h-40 bg-paper-3">
              <div aria-hidden className="dust absolute inset-0 opacity-60" />
              <Motif kind={motif} className="absolute -right-6 -bottom-8 size-44 opacity-80" />
            </div>
            <div className="p-6">
              <Ordinal n={i + 1} total={cards.length} />
              <p className="mt-3 text-body text-ink">{block.h3}</p>
              <SpecCaption className="mt-2">{block.visual}</SpecCaption>
            </div>
          </article>
        ))}
      </div>
      <BlockAction block={block} page={page} />
    </BlockSection>
  )
}
