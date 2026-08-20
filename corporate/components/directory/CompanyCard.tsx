import Link from "next/link"
import { AuthorityDot, Badge } from "./kit"
import type { Company } from "@/content/directory/types"

/**
 * One result in the listing.
 *
 * The card answers the four questions a broker asks before they call: is the
 * authority live, are they insured, how big are they, and have they been
 * inspected recently. Everything else is on the profile. The design puts the
 * badges top-right and the four figures in a row along the bottom; the row
 * becomes two columns on a phone rather than shrinking, because a rate figure
 * that has to be squinted at is worse than one that wraps.
 */

const usd = (n: number) => "$" + n.toLocaleString("en-US")
const num = (n: number) => n.toLocaleString("en-US")

export function CompanyCard({ company }: { company: Company }) {
  const href = `/trucking-directory/${company.citySlug}/${company.slug}`
  const carrier = company.authorities.find((a) => a.kind === "carrier")
  const broker = company.authorities.find((a) => a.kind === "broker")

  return (
    <article className="rounded-card border border-rule bg-paper-2 p-5 transition-colors duration-150 hover:border-ink-4">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 className="text-lead text-ink">
          <Link href={href} className="hover:text-violet-ink">
            {company.name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {company.entity.includes("carrier") ? <Badge>Carrier</Badge> : null}
          {company.entity.includes("broker") ? <Badge>Broker</Badge> : null}
          {company.operations.includes("hazmat") ? <Badge>Hazmat</Badge> : null}
          {company.inspected24mo ? <Badge tone="good">Inspected 24 mo</Badge> : null}
        </div>
      </div>

      <p className="mt-1.5 text-small text-ink-3">
        {company.address.line}, {company.address.city}, {company.address.state} {company.address.zip}
      </p>
      <p className="mt-0.5 font-mono text-meta tabular-nums text-ink-4">
        USDOT {company.dot}
        {company.mc ? ` · MC ${company.mc}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule-soft pt-4">
        {carrier ? (
          <span className="flex items-center gap-2 text-small text-ink-3">
            Carrier auth: <AuthorityDot status={carrier.status} />
          </span>
        ) : null}
        {broker ? (
          <span className="flex items-center gap-2 text-small text-ink-3">
            Broker auth: <AuthorityDot status={broker.status} />
          </span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-meta text-ink-4">Power units</dt>
          <dd className="font-mono text-small tabular-nums text-ink">{num(company.powerUnits)}</dd>
        </div>
        <div>
          <dt className="text-meta text-ink-4">Drivers</dt>
          <dd className="font-mono text-small tabular-nums text-ink">{num(company.drivers)}</dd>
        </div>
        <div>
          <dt className="text-meta text-ink-4">Mileage</dt>
          <dd className="font-mono text-small tabular-nums text-ink">{num(company.mileage)}</dd>
        </div>
        <div>
          <dt className="text-meta text-ink-4">Insurance</dt>
          <dd className="font-mono text-small tabular-nums text-ink">{usd(company.insuranceRequired)}</dd>
        </div>
      </dl>
    </article>
  )
}
