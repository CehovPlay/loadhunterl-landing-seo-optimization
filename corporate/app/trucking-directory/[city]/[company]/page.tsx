import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { DISCLAIMER, EMPTY, PROFILE } from "@/content/directory/copy"
import { getCity, getCompany, listCompanySlugs } from "@/content/directory/source"
import type { Company } from "@/content/directory/types"
import { BRAND } from "@/content/registry"
import { AuthorityDot, Badge, Empty, Field, Panel, SampleBanner, ScoreBar } from "@/components/directory/kit"

/**
 * One company.
 *
 * The page is a record, not an argument, and it is arranged the way a broker
 * reads one: who they are and whether they are allowed to haul, then what they
 * are insured for, then what the inspections say, then what other people
 * report. The contact panel is pinned to the right on desktop because it is the
 * only action on the page.
 *
 * No JSON-LD. §10.3 permits Organization, Product, Review and AggregateRating
 * only under conditions this page fails: the organization is not ours, the
 * reviews are collected but not yet ours to republish as markup, and §18.3 puts
 * ratings behind approval. The Schema Registry would drop them anyway; not
 * emitting them is the same decision made earlier.
 */

type Params = { params: Promise<{ city: string; company: string }> }

export async function generateStaticParams() {
  return listCompanySlugs()
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city, company: slug } = await params
  const company = await getCompany(city, slug)
  if (!company) return {}
  const where = `${company.address.city}, ${company.address.state}`
  const title = `${company.name} - USDOT ${company.dot} | LoadHunter directory`
  const description = `Authority, insurance, inspection history and reviews for ${company.name}, ${where}. Compiled from FMCSA SAFER and SMS data.`
  return {
    title,
    description,
    alternates: { canonical: `/trucking-directory/${city}/${slug}` },
    openGraph: {
      type: "profile",
      url: `/trucking-directory/${city}/${slug}`,
      siteName: BRAND.name,
      title,
      description,
      images: [{ ...BRAND.socialImage, alt: `${BRAND.name} - ${BRAND.category}` }],
    },
  }
}

const usd = (n: number) => "$" + n.toLocaleString("en-US")
const num = (n: number) => n.toLocaleString("en-US")

const AUTHORITY_TITLE = {
  carrier: "Carrier authority",
  contract: "Contract authority",
  broker: "Broker authority",
} as const

/** "38 years, 6 months" from a filing date, computed rather than stored. */
function since(iso: string, now = new Date("2026-08-20T00:00:00Z")): string {
  const start = new Date(iso + "T00:00:00Z")
  let years = now.getUTCFullYear() - start.getUTCFullYear()
  let months = now.getUTCMonth() - start.getUTCMonth()
  if (months < 0) {
    years -= 1
    months += 12
  }
  return `${years} years, ${months} months`
}

const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })

function Overview({ company }: { company: Company }) {
  return (
    <Panel title={PROFILE.sections.overview}>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        <Field label="Operating authority status" value={company.operatingStatus} />
        <Field label="Freight" value={company.authorizedFor} />
        <Field label="Insurance required" value={usd(company.insuranceRequired)} mono />
        <Field label="Power units" value={num(company.powerUnits)} mono />
        <Field label="Drivers" value={num(company.drivers)} mono />
        <Field label="Mileage" value={num(company.mileage)} mono />
      </dl>

      <div className="mt-8 grid gap-6 border-t border-rule-soft pt-6 sm:grid-cols-3">
        {company.authorities.map((a) => (
          <div key={a.kind}>
            <h3 className="text-meta text-ink-4">{AUTHORITY_TITLE[a.kind]}</h3>
            <div className="mt-2 flex flex-col gap-1.5">
              <AuthorityDot status={a.status} />
              <span className="text-small text-ink-3">
                {a.since ? `Since ${fmtDate(a.since)}` : EMPTY.authority}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-x-6 gap-y-4 border-t border-rule-soft pt-6 sm:grid-cols-3">
        <Field label="BIPD" value={usd(company.bipd)} mono />
        <Field label="Cargo" value={company.cargo ? "Yes" : "No"} />
        <Field label="Bond" value={company.bond ? "Yes" : "No"} />
      </div>
    </Panel>
  )
}

function Insurances({ company }: { company: Company }) {
  return (
    <Panel title={PROFILE.sections.insurances}>
      {company.insurances.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-rule-soft">
                {["Docket number", "Type", "Insurance carrier", "Policy/surety", "Coverage", "Effective", "Cancelled"].map(
                  (h) => (
                    <th key={h} scope="col" className="py-2 pr-4 text-meta font-normal text-ink-4">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {company.insurances.map((ins, i) => (
                <tr key={ins.policy + i} className="border-b border-rule-soft last:border-0">
                  <td className="py-3 pr-4 font-mono text-small tabular-nums text-ink">{ins.docket}</td>
                  <td className="py-3 pr-4 text-small text-ink-2">{ins.type}</td>
                  <td className="py-3 pr-4 text-small text-ink-2">{ins.carrier}</td>
                  <td className="py-3 pr-4 font-mono text-small text-ink-2">{ins.policy}</td>
                  <td className="py-3 pr-4 font-mono text-small tabular-nums text-ink">{usd(ins.coverage)}</td>
                  <td className="py-3 pr-4 text-small text-ink-2">{fmtDate(ins.effectiveDate)}</td>
                  <td className="py-3 pr-4 text-small text-ink-3">
                    {ins.cancelDate ? fmtDate(ins.cancelDate) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>{EMPTY.insurances}</Empty>
      )}
    </Panel>
  )
}

function History({ company }: { company: Company }) {
  return (
    <Panel title={PROFILE.sections.history}>
      {company.authorityHistory.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-rule-soft">
                {["Docket number", "Sub", "Authority type", "Original action", "Disposition"].map((h) => (
                  <th key={h} scope="col" className="py-2 pr-4 text-meta font-normal text-ink-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {company.authorityHistory.map((e, i) => (
                <tr key={e.docket + i} className="border-b border-rule-soft last:border-0">
                  <td className="py-3 pr-4 font-mono text-small tabular-nums text-ink">{e.docket}</td>
                  <td className="py-3 pr-4 font-mono text-small tabular-nums text-ink-2">{e.subNumber}</td>
                  <td className="py-3 pr-4 text-small text-ink-2">{e.authType}</td>
                  <td className="py-3 pr-4 text-small text-ink-2">
                    {e.originalAction}
                    <span className="block text-meta text-ink-4">{fmtDate(e.originalDate)}</span>
                  </td>
                  <td className="py-3 pr-4 text-small text-ink-2">
                    {e.disposition ?? "N/A"}
                    {e.dispositionDate ? (
                      <span className="block text-meta text-ink-4">{fmtDate(e.dispositionDate)}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>{EMPTY.history}</Empty>
      )}
    </Panel>
  )
}

function Reviews({ company }: { company: Company }) {
  const google = company.reviews.filter((r) => r.source === "google").length
  const ours = company.reviews.filter((r) => r.source === "loadhunter").length
  return (
    <Panel
      title={PROFILE.sections.reviews}
      action={
        <span className="text-meta text-ink-4">
          Google · {google} &nbsp;LoadHunter · {ours}
        </span>
      }
    >
      {company.reviews.length ? (
        <ul className="flex flex-col gap-5">
          {company.reviews.map((r) => (
            <li key={r.id} className="border-b border-rule-soft pb-5 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="text-small text-ink">
                  {r.author}
                  {r.role ? <span className="text-ink-3"> — {r.role}</span> : null}
                </span>
                <span aria-label={`${r.rating} out of 5`} className="font-mono text-small text-ink-2">
                  {"★".repeat(r.rating)}
                </span>
                {r.verifiedBooking ? <Badge tone="good">Verified booking</Badge> : null}
                <span className="ml-auto text-meta text-ink-4">{fmtDate(r.date)}</span>
              </div>
              <p className="mt-2 max-w-[70ch] text-small text-ink-2">“{r.body}”</p>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>{EMPTY.reviews}</Empty>
      )}

      {/* Posting a review needs an account and a moderation queue. Neither
          exists, and §15.4 forbids a form that reports success it cannot
          confirm - so the control says what it is. */}
      <div className="mt-6 border-t border-rule-soft pt-5">
        <span
          aria-disabled
          data-cta="pending"
          className="inline-flex h-9 cursor-not-allowed items-center rounded-full border border-dashed border-rule px-4 text-small text-ink-3"
        >
          {PROFILE.addReview}
          <span className="ml-2 text-meta text-ink-4">Not built</span>
        </span>
      </div>
    </Panel>
  )
}

function Contact({ company }: { company: Company }) {
  const { phone, email, website } = company.contact
  return (
    <Panel title={PROFILE.contactHeading}>
      <dl className="flex flex-col gap-4">
        <Field
          label="Phone"
          value={phone ? <a href={`tel:${phone}`} className="hover:text-violet-ink">{phone}</a> : "—"}
          mono={!!phone}
        />
        <Field
          label="Email"
          value={email ? <a href={`mailto:${email}`} className="break-all hover:text-violet-ink">{email}</a> : "—"}
        />
        <Field
          label="Website"
          value={
            website ? (
              <a
                href={`https://${website}`}
                rel="nofollow noopener"
                target="_blank"
                className="break-all hover:text-violet-ink"
              >
                {website}
              </a>
            ) : (
              "—"
            )
          }
        />
      </dl>

      {/* The quote dialog collects a reason and routes it to the carrier. The
          routing does not exist yet, so the button does not pretend to. */}
      <span
        aria-disabled
        data-cta="pending"
        className="mt-5 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full border border-dashed border-rule text-small text-ink-3"
      >
        {PROFILE.quoteCta}
        <span className="ml-2 text-meta text-ink-4">Not built</span>
      </span>
    </Panel>
  )
}

export default async function CompanyProfilePage({ params }: Params) {
  const { city: citySlug, company: slug } = await params
  const [company, city] = await Promise.all([getCompany(citySlug, slug), getCity(citySlug)])
  if (!company || !city) notFound()

  return (
    <main id="main" className="bg-paper">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <nav aria-label="Breadcrumb" className="pt-10">
          <ol className="flex flex-wrap items-center gap-2 text-meta text-ink-3">
            <li>
              <Link href="/trucking-directory" className="hover:text-ink">
                Trucking directory
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href={`/trucking-directory/${city.slug}`} className="hover:text-ink">
                {city.name}, {city.state}
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">{company.name}</li>
          </ol>
        </nav>

        <header className="pt-6 pb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-h2 text-ink">{company.name}</h1>
            {company.claimed ? <Badge tone="brand">Claimed</Badge> : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {company.entity.includes("carrier") ? <Badge>Carrier</Badge> : null}
            {company.entity.includes("broker") ? <Badge>Broker</Badge> : null}
            {company.operations.includes("hazmat") ? <Badge>Hazmat</Badge> : null}
            {company.inspected24mo ? <Badge tone="good">Inspected in last 24 mo</Badge> : null}
          </div>

          <p className="mt-4 font-mono text-small tabular-nums text-ink-3">
            USDOT {company.dot}
            {company.mc ? ` · MC ${company.mc}` : ""}
          </p>
          <p className="mt-1 text-small text-ink-3">
            {company.address.line}, {company.address.city}, {company.address.state} {company.address.zip}
            {" · "}
            Started on {fmtDate(company.startedOn)} ({since(company.startedOn)})
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-ink-2">
            <span className="font-mono tabular-nums text-ink">{company.rating.toFixed(1)}</span>
            <span className="text-ink-4">·</span>
            <span>{company.reviews.length} reviews</span>
            <Link
              href="/contact"
              className="ml-auto text-meta text-ink-3 underline-offset-2 hover:text-ink hover:underline"
            >
              {PROFILE.claimPrompt}
            </Link>
          </div>

          <div className="mt-6 max-w-[720px]">
            <SampleBanner />
          </div>
        </header>

        <div className="grid gap-6 pb-16 lg:grid-cols-12 lg:items-start">
          {/* min-w-0: a grid item defaults to min-width:auto, so the 720px
              insurance table would stretch the column past the viewport
              instead of scrolling inside its own overflow container. */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-8">
            <Overview company={company} />
            <Insurances company={company} />
            <History company={company} />
            <Reviews company={company} />
          </div>

          <aside className="flex min-w-0 flex-col gap-6 lg:col-span-4 lg:sticky lg:top-24">
            <Contact company={company} />

            <Panel title={PROFILE.sections.safety}>
              {company.basics.length ? (
                <div className="flex flex-col gap-4">
                  {company.basics.map((b) => (
                    <ScoreBar key={b.label} label={b.label} percentile={b.percentile} total={b.total} />
                  ))}
                  <p className="text-meta text-ink-4">{PROFILE.authorityTimeline}</p>
                </div>
              ) : (
                <Empty>{EMPTY.safety}</Empty>
              )}
            </Panel>

            <Panel title={PROFILE.sections.accidents}>
              {company.accidentBasics.length ? (
                <div className="flex flex-col gap-4">
                  {company.accidentBasics.map((b) => (
                    <ScoreBar key={b.label} label={b.label} percentile={b.percentile} />
                  ))}
                  <p className="text-meta text-ink-4">{PROFILE.networkSource}</p>
                </div>
              ) : (
                <Empty>{EMPTY.accidents}</Empty>
              )}
            </Panel>

            <Panel title={PROFILE.sections.outOfService}>
              {company.outOfService.length ? (
                <dl className="flex flex-col gap-3">
                  {company.outOfService.map((o) => (
                    <div key={o.label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-small text-ink-2">
                        {o.label}
                        <span className="text-ink-4"> · {o.inspections} inspections</span>
                      </dt>
                      <dd className="font-mono text-small tabular-nums text-ink">{o.rate}%</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <Empty>{EMPTY.outOfService}</Empty>
              )}
            </Panel>
          </aside>
        </div>

        <p className="max-w-[110ch] border-t border-rule py-10 text-meta text-ink-4">{DISCLAIMER}</p>
      </div>
    </main>
  )
}
