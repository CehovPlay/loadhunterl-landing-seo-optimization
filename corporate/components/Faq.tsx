"use client"

import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { FAQ } from "@/content/home"
import { CLAIMS, claimProvenance, PRODUCTS_WITH_STATUS } from "@/content/registry"
import { track } from "@/lib/analytics"
import { RailNode } from "./Rail"
import { Status } from "./ui"

/**
 * FAQ, verbatim from the tab.
 *
 * Native details/summary rather than a scripted accordion: it opens with no
 * JavaScript, it is already in the keyboard order, screen readers announce the
 * expanded state without any aria bookkeeping, and browser find-in-page reaches
 * the closed answers. There is no reason to rebuild any of that by hand.
 *
 * One answer is not printed as written. The tab's answer to "Which products are
 * available now?" is an instruction to the builder - render availability from
 * the governed status source, using only the six allowed terms - so the answer
 * is the ledger itself, with its source and check date underneath. Printing the
 * instruction at a visitor would answer nothing.
 *
 * The block is visible on the page, which is the condition the tab sets before
 * FAQPage markup may be emitted at all.
 */
export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-28 pb-24 md:pb-32">
      <RailNode className="top-1" />

      <div className="pl-9 md:pl-20">
        <h2 className="max-w-[22ch] text-h2 text-balance">FAQ</h2>

        <div className="mt-10 max-w-[62rem] border-t border-rule">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group border-b border-rule"
              onToggle={(event) => {
                if (!(event.currentTarget as HTMLDetailsElement).open) return
                track(item.render === "status-ledger" ? "status_open" : "product_proof_open", {
                  proof_type: "faq",
                  CTA_position: "faq",
                })
              }}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="max-w-[46ch] text-body text-ink">{item.q}</h3>
                <CaretDown
                  size={16}
                  weight="bold"
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-ink-3 transition-transform duration-200 ease-out-quart group-open:rotate-180"
                />
              </summary>

              <div className="pb-7">
                {item.render === "status-ledger" ? (
                  <>
                    <ul className="flex max-w-[52rem] flex-col gap-3">
                      {PRODUCTS_WITH_STATUS.map((product) => (
                        <li
                          key={product.key}
                          className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6"
                        >
                          <h4 className="w-[9rem] shrink-0 text-small font-normal text-ink">
                            {product.name}
                          </h4>
                          <span className="flex flex-wrap gap-x-5 gap-y-1.5">
                            {product.statuses.map((entry) => (
                              <Status key={entry.term + entry.scope} term={entry.term} scope={entry.scope} />
                            ))}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <h5 className="mt-5 text-meta font-normal text-ink-3">
                      {claimProvenance(CLAIMS[0])}
                    </h5>
                  </>
                ) : (
                  <p className="max-w-[68ch] text-body text-ink-2">{item.a}</p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
