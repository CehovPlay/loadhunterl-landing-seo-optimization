"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { track } from "@/lib/analytics"
import type { ClaimRecord } from "@/content/registry"
import { BlockCta, StatusList } from "@/components/ui"

/**
 * One stop of the pinned road.
 *
 * This is the presentation half of what `Block` used to do on the homepage.
 * The behaviour moved with it, but one rule changed shape because the layout
 * did:
 *
 *   The tab requires the action to appear "после взаимодействия или просмотра
 *   не менее 50% блока; без агрессивного pop-up". In a scrolling document that
 *   meant an IntersectionObserver at half the block. In a pinned road there is
 *   no such thing as half a block on screen - a stop is either the one the
 *   scroll has reached or it is not - so the gate is now "this stop is active".
 *   Same intent, and a stricter reading of it: the action arrives when the
 *   reader is actually at the stop rather than when its edge has crept up.
 *
 * `road_stage_view` fires once, on the same event, so the funnel still measures
 * what the visitor reached rather than what scrolled past.
 */

export function RoadStage({
  block,
  of,
  product,
  statuses,
  active,
  children,
}: {
  block: {
    n: string
    stop?: string
    id: string
    title: string
    h3: string
    body?: string
    cta: { label: string; href: string }
  }
  of: string
  product?: string
  statuses?: readonly ClaimRecord[]
  /** True when the scroll has reached this stop. */
  active: boolean
  /** The stop's proof panel. */
  children: ReactNode
}) {
  const fired = useRef(false)

  useEffect(() => {
    if (!active || fired.current) return
    fired.current = true
    track("road_stage_view", {
      product,
      CTA_label: block.cta.label,
      CTA_position: `block_${block.n}`,
      product_status: statuses?.map((s) => `${s.scope}: ${s.term}`).join(" · "),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <article
      /* No id here - the runway owns the anchors. See FreightRoute. */
      data-stop={active ? "active" : "idle"}
      /* Every stop occupies the same box and only one is opaque. They stay in
         the accessibility tree and in find-in-page either way: §10.4 wants the
         main text available without the animation, and `visibility: hidden`
         or `display: none` would take it away from exactly the readers who
         cannot scroll to reveal it. */
      className="road-stop scroll-mt-28"
    >
      <div className="grid h-full items-center gap-y-8 lg:grid-cols-12 lg:gap-x-10">
        <div className="@container min-w-0 pl-9 md:pl-20 lg:col-span-5 lg:pl-12">
          <p className="figures text-meta text-ink-3">
            {block.n}
            <span className="text-ink-4"> / {of}</span>
          </p>

          {/* The verb §27.7-27.11 gives this stop, in display type. The h2 below
              carries the sentence, so this is hidden from the reading order -
              otherwise a screen reader hears "Find. The road starts with the
              next load." and takes the verb for a heading of its own. */}
          {block.stop ? (
            <p aria-hidden className="mt-4 text-display text-ink">
              {block.stop}
            </p>
          ) : null}

          <h2 className="mt-5 max-w-[22ch] text-h2 text-balance">{block.title}</h2>
          <h3 className="mt-3 max-w-[30ch] text-lead text-ink-2">{block.h3}</h3>
          {block.body ? (
            <p className="mt-4 max-w-[52ch] text-body text-ink-2">{block.body}</p>
          ) : null}

          {statuses?.length ? (
            <>
              {/* §42.2 - the statuses are readable before the action, not after. */}
              <h4 className="mt-6 text-meta text-ink-3">Current availability</h4>
              <StatusList entries={statuses} className="mt-2" />
            </>
          ) : null}

          <div className="mt-7" data-cta-gate={active ? "open" : "closed"}>
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

        <div className="min-w-0 pl-9 md:pl-20 lg:col-span-7 lg:pl-0">{children}</div>
      </div>
    </article>
  )
}
