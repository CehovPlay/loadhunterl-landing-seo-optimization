import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { CTA, CYCLE } from "@/content/home"
import { RailNode } from "./Rail"
import { Status } from "./ui"

/**
 * The operating cycle, stated once and in full.
 *
 * TZ §27.5 asks for five compact entries that explain the whole cycle before
 * any single product is sold, and §6.6 rules out five equal little cards. So
 * this is a schedule read down the rail: each product is a stop with a number,
 * a job, an outcome and its confirmed status, and the rail itself is the
 * container. No card, no box, no repeated tile.
 *
 * The status sits on the row rather than on a badge over the section, which is
 * what §3.6 and §42.2 require: huntDRIVE and huntPAY each ship one live channel
 * and one that is still in progress, and a single product-level chip would hide
 * exactly that distinction.
 */
export function Cycle() {
  return (
    <section id="the-load-journey" className="relative scroll-mt-24 pb-24 md:pb-36">
      <div className="pl-9 md:pl-20">
        <h2 className="max-w-[18ch] text-h2 text-balance">Where the load goes next.</h2>
        <p className="mt-5 max-w-[62ch] text-body text-ink-2">
          One connected system for finding freight, running operations, keeping drivers moving,
          getting paid and seeing the business clearly.
        </p>
      </div>

      <ul className="mt-14">
        {CYCLE.map((stop) => (
          <li key={stop.product} className="group relative border-t border-rule">
            <RailNode className="-top-[4px]" />
            {/* Pointing at a stop lights that segment of the rail. It is the
                only hover state on the page that says anything, so it says the
                one thing worth saying: this is where you are on the route. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-violet transition-transform duration-300 ease-out-quart group-hover:scale-y-100"
            />
            <Link
              href={stop.href}
              className="grid gap-y-3 py-8 pl-9 md:pl-20 lg:grid-cols-[3.5rem_10rem_minmax(0,1fr)_1.5rem] lg:items-baseline lg:gap-x-8"
            >
              <span className="figures text-meta text-ink-3">{stop.step}</span>

              <span className="text-h3 text-ink">
                {stop.verb}
                <span className="mt-1 block text-small text-ink-3">{stop.product}</span>
              </span>

              <span className="max-w-[48ch]">
                <span className="block text-body text-ink-2">{stop.outcome}</span>
                <span className="mt-2.5 block">
                  <Status tone={stop.status.tone as "live" | "preview" | "progress"}>
                    {stop.status.label}
                  </Status>
                </span>
              </span>

              <span className="hidden justify-self-end text-ink-4 transition-transform duration-200 ease-out-quart group-hover:translate-x-1 group-hover:text-ink lg:block">
                <ArrowRight size={18} weight="bold" />
                <span className="sr-only">Open {stop.product}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="relative border-t border-rule">
        <RailNode className="-top-[4px]" />
        <div className="py-9 pl-9 md:pl-20">
          <Link
            href={CTA.platform.href}
            className="group inline-flex min-h-[44px] items-center gap-2 text-body text-ink-2 transition-colors duration-200 hover:text-ink"
          >
            {CTA.platform.label}
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
