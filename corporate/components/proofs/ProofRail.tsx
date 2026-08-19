"use client"

import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { PRODUCTS, PROOF_ITEMS, STATUS_SOURCE } from "@/content/home"
import { track } from "@/lib/analytics"
import { Status } from "../ui"

/**
 * Block 7 proof - the proof rail.
 *
 * The tab allows four kinds of material here and nothing else: verifiable
 * product screens, short annotated clips, an integration/status matrix, and
 * named customer proof that has been approved. Every figure must carry a source
 * and a verifiedAt. Master §27.14 adds the case this page is actually in: when
 * the approved material does not exist yet, show an honest demonstration of the
 * process and say so, rather than inventing numbers, logos or quotes.
 *
 * So two of the four cards are marked as not published. That is not a gap in
 * the build - it is the block doing its job. The moment a customer approval or
 * a recording exists, the card carries it and the "not published" line goes.
 *
 * The only fully sourced proof today is the status matrix, so it is rendered in
 * full rather than linked: it is the page's one claim that can be checked line
 * by line, against a named source and a check date.
 *
 * Pinned beside the copy on desktop, swiped as cards on mobile, per the tab.
 */
export function ProofRail() {
  return (
    <div
      /* On a phone the rail becomes a swipe track. It is a list either way, so
         the reading order and the tab order never change with the layout. */
      className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-1 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {PROOF_ITEMS.map((item) => (
        <article
          key={item.title}
          className={
            "flex w-[82%] shrink-0 snap-start flex-col rounded-surface border p-5 sm:w-[60%] lg:w-auto " +
            (item.ready ? "border-rule bg-paper-2" : "border-dashed border-rule bg-transparent")
          }
        >
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-small text-ink">{item.title}</h4>
            <span className="text-meta whitespace-nowrap text-ink-3">{item.kind}</span>
          </div>

          <p className="mt-2.5 max-w-[52ch] text-small text-ink-2">{item.body}</p>

          {item.kind === "Status matrix" ? (
            <table className="mt-4 w-full border-t border-rule text-left">
              <caption className="sr-only">
                Product availability from the {STATUS_SOURCE.source}
              </caption>
              <tbody>
                {PRODUCTS.map((product) => (
                  <tr key={product.key} className="border-b border-rule-soft last:border-b-0">
                    <th scope="row" className="py-2.5 pr-4 align-top text-small font-normal text-ink">
                      {product.name}
                    </th>
                    <td className="py-2.5 align-top">
                      <ul className="flex flex-col gap-1.5">
                        {product.statuses.map((entry) => (
                          <li key={entry.term + entry.scope}>
                            <Status term={entry.term} scope={entry.scope} />
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {/* H5 is the tab's level for micro-proof and technical notes, which is
              exactly what a source line and a check date are. */}
          <h5 className="mt-4 text-meta font-normal text-ink-3">{item.note}</h5>

          <div className="mt-auto pt-5">
            <Link
              href={item.href}
              onClick={() =>
                track(item.kind === "Status matrix" ? "status_open" : "product_proof_open", {
                  proof_type: item.kind.toLowerCase().replace(/\s+/g, "_"),
                  CTA_position: "block_07",
                })
              }
              className="group inline-flex min-h-11 items-center gap-2 text-small font-medium text-violet-ink transition-colors duration-200 hover:text-ink"
            >
              {item.ready ? "Open" : "See what is published"}
              <ArrowRight
                size={14}
                weight="bold"
                className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
              />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
