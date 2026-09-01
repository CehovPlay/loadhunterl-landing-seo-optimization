"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { track } from "@/lib/analytics"
import type { ClaimRecord } from "@/content/registry"
import { RailNode } from "./Rail"
import { BlockCta, StatusList } from "./ui"

/**
 * One stage of the road.
 *
 * Every block on this page has the same skeleton because tab 01 gives them the
 * same parts: a heading, an H3, the exact copy, a proof and one CTA. What the
 * shell adds is the rule the tab repeats under every single block:
 *
 *   "CTA появляется после взаимодействия или просмотра не менее 50% блока;
 *    без агрессивного pop-up"
 *
 * so the action is gated on half the block being seen, or on the visitor having
 * touched the proof. It is a reveal, never a pop-up, and it never moves the
 * layout: the button occupies its space from the first paint and only fades in,
 * which keeps CLS at zero and keeps the tab's ≤0.1 budget intact.
 *
 * Without JavaScript the gate never engages and the CTA is simply there - the
 * acceptance criteria require the full meaning and an available CTA for
 * no-JS and reduced-motion visitors.
 *
 * The same observer fires road_stage_view once, at the same 50% mark, so the
 * funnel measures what the visitor actually saw rather than what scrolled past.
 */
export function Block({
  block,
  of,
  product,
  statuses,
  interacted = false,
  layout = "split",
  proofFirstOnMobile = false,
  stickProof = false,
  children,
}: {
  block: {
    n: string
    /** The verb §27.7-27.11 gives this stop. Set in display type. */
    stop?: string
    id: string
    title: string
    h3: string
    body?: string
    cta: { label: string; href: string }
  }
  /** How many stops the road has, printed beside the number. */
  of?: string
  /** Product key for the analytics payload, where the block has one. */
  product?: string
  statuses?: readonly ClaimRecord[]
  /** Lifted from the proof: any interaction opens the CTA immediately. */
  interacted?: boolean
  layout?: "split" | "wide" | "stack"
  proofFirstOnMobile?: boolean
  /** Pins the proof instead of the copy - block 7's rail is the pinned side. */
  stickProof?: boolean
  children: ReactNode
}) {
  const root = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = root.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          /* Tall blocks never reach ratio 0.5 on a short viewport, so half the
             VIEWPORT filled counts as half the block seen. Without this the CTA
             would stay shut on a phone, which is the opposite of the rule. */
          const half =
            entry.intersectionRatio >= 0.5 ||
            entry.intersectionRect.height >= window.innerHeight * 0.5
          if (!half) continue
          setSeen(true)
          track("road_stage_view", {
            product,
            CTA_label: block.cta.label,
            CTA_position: `block_${block.n}`,
            product_status: statuses?.map((s) => `${s.scope}: ${s.term}`).join(" · "),
          })
          io.disconnect()
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    )

    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const open = seen || interacted
  const copy = (
    <div className={layout === "split" ? "" : "max-w-[46rem]"}>
      <p className="figures text-meta text-ink-3">
        {block.n}
        {of ? <span className="text-ink-4"> / {of}</span> : null}
      </p>

      {/* The stop's verb, in display type.
          It is one word from the document rather than a headline written here,
          and it is set in sentence case: the brand's UI rule forbids caps
          outside abbreviations, and at this size caps would shout the page down
          anyway. The h2 that follows carries the actual sentence, so the verb
          is aria-hidden - a screen reader would otherwise hear "Find. The road
          starts with the next load." and take the verb for a heading of its
          own. */}
      {block.stop ? (
        <p aria-hidden className="mt-5 text-display text-ink">
          {block.stop}
        </p>
      ) : null}

      {/* A stop already has its verb overhead, so its heading stays at h2. A
          block with no verb is a section in its own right and takes the display
          face - see the hierarchy note in Destination. */}
      <h2
        className={
          block.stop
            ? "mt-6 max-w-[22ch] text-h2 text-balance"
            : "display mt-5 max-w-[18ch] text-balance"
        }
      >
        {block.title}
      </h2>
      <h3 className="mt-4 max-w-[30ch] text-lead text-ink-2">{block.h3}</h3>
      {block.body ? (
        <p className="mt-5 max-w-[52ch] text-body text-ink-2">{block.body}</p>
      ) : null}

      {statuses?.length ? (
        <>
          {/* §42.2 - the statuses are readable before the CTA, not after it. */}
          <h4 className="mt-7 text-meta text-ink-3">Current availability</h4>
          <StatusList entries={statuses} className="mt-2.5" />
        </>
      ) : null}

      <div className="mt-8" data-cta-gate={open ? "open" : "closed"}>
        <BlockCta
          href={block.cta.href}
          onClick={() =>
            track("final_cta_click", {
              product,
              CTA_label: block.cta.label,
              CTA_position: `block_${block.n}`,
            })
          }
        >
          {block.cta.label}
        </BlockCta>
      </div>
    </div>
  )

  return (
    <section
      ref={root}
      id={block.id}
      className="relative scroll-mt-28 pt-14 pb-24 md:pt-20 md:pb-32"
      onFocusCapture={() => setSeen(true)}
    >
      <RailNode className="top-1" />

      {/* A hairline across the whole stop, drawn edge to edge of the container.
          Five numbered stops with a rule over each is what turns a stack of
          sections into one numbered sequence, which is the road §25.1 asks for
          and the mass the page was missing. It is decoration in the strict
          sense - the heading below already says where the reader is - so it is
          hidden from the accessibility tree. */}
      {block.stop ? (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rule" />
      ) : null}

      {layout === "split" ? (
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div
            className={
              /* No mirroring. The road's copy column stays on the left for
                 all five stops: it is what makes the sticky verb read as one
                 column standing still while the panels scroll past it, and
                 alternating sides destroys exactly that. */
              /* The rail lane narrows from lg up: at 4 columns the copy needs
                 the 80px back more than the drawing needs the clearance.
                 `@container` is what lets --text-display size the stop verb
                 against this column rather than against the window. */
              "@container min-w-0 pl-9 md:pl-20 lg:col-span-5 lg:self-start lg:pl-12 " +
              (proofFirstOnMobile ? "order-2 lg:order-1" : "")
            }
          >
            <div className={stickProof ? "" : "lg:sticky lg:top-28"}>{copy}</div>
          </div>
          <div
            className={
              "min-w-0 pl-9 md:pl-20 lg:col-span-7 lg:pl-0 " +
              (proofFirstOnMobile ? "order-1 lg:order-2" : "")
            }
          >
            <div className={stickProof ? "lg:sticky lg:top-28" : ""}>{children}</div>
          </div>
        </div>
      ) : (
        <div className="flex min-w-0 flex-col gap-12">
          <div className="min-w-0 pl-9 md:pl-20">{copy}</div>
          <div className="min-w-0 pl-9 md:pl-20">{children}</div>
        </div>
      )}
    </section>
  )
}

/**
 * The panel every proof is drawn on. One surface, one radius, one hairline:
 * five differently-shaped boxes would read as five widgets rather than five
 * frames of the same map.
 */
export function Panel({
  label,
  children,
  className = "",
}: {
  label?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={
        "overflow-hidden rounded-surface border border-rule bg-paper-2 " +
        "shadow-[0_1px_0_0_rgba(18,19,23,0.03),0_18px_40px_-28px_rgba(18,19,23,0.25)] " +
        className
      }
    >
      {label ? (
        <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  )
}
