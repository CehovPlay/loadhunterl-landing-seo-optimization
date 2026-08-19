import { SAMPLE_LOAD, SAMPLE_NOTE } from "@/content/home"
import { SampleTag, Status } from "./ui"

/**
 * The load.
 *
 * One card, carried through every scene on the page. TZ §7.2 is strict about
 * this: the visitor has to watch the SAME result gain a decision layer, because
 * two different loads let them miss what the product actually contributes. So
 * the card is a single component, and each scene passes the layer it adds.
 *
 * It is deliberately not a dashboard collage and not a screenshot frame. Every
 * field here is a real field the product works with, every figure is marked as
 * sample data, and nothing implies a capability the ledger has not confirmed.
 */
export function LoadCard({ children }: { children?: React.ReactNode }) {
  return (
    <article className="rounded-surface border border-rule bg-paper-2 shadow-[0_1px_0_0_rgba(18,19,23,0.03),0_18px_40px_-28px_rgba(18,19,23,0.25)]">
      <header className="flex items-center justify-between gap-3 px-6 pt-5 pb-4">
        <SampleTag>{SAMPLE_NOTE}</SampleTag>
        <Status tone="live">{SAMPLE_LOAD.status}</Status>
      </header>

      {/* The lane, drawn the same way as the page rail so the card reads as a
          fragment of the same map rather than a separate widget. */}
      <div className="px-6">
        <div className="relative pl-6">
          <span
            aria-hidden="true"
            className="absolute top-[9px] bottom-[9px] left-[3px] w-px bg-rule"
          />
          <span
            aria-hidden="true"
            className="absolute top-[6px] left-0 size-[7px] rounded-full border border-ink-3 bg-paper-2"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-[6px] left-0 size-[7px] rounded-full bg-ink"
          />
          <p className="text-h3 leading-8 text-ink">{SAMPLE_LOAD.origin}</p>
          <p className="text-h3 leading-8 text-ink">{SAMPLE_LOAD.destination}</p>
        </div>

        <p className="mt-4 text-small text-ink-3">
          {SAMPLE_LOAD.equipment} · {SAMPLE_LOAD.weight} · picks up {SAMPLE_LOAD.pickup}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 border-t border-rule">
        <div className="border-r border-rule px-6 py-4">
          <dt className="text-meta text-ink-3">Line haul</dt>
          <dd className="figures mt-1 text-h3 text-ink">{SAMPLE_LOAD.rate}</dd>
        </div>
        <div className="px-6 py-4">
          <dt className="text-meta text-ink-3">Loaded miles</dt>
          <dd className="figures mt-1 text-h3 text-ink">{SAMPLE_LOAD.loadedMiles}</dd>
        </div>
      </dl>

      {children}
    </article>
  )
}
