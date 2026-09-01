import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EMPTY } from "@/content/directory/copy"
import { DRIVER_COUNTS, FLEET_SIZES } from "@/content/directory/taxonomy"
import { getCity, listCities, searchCompanies } from "@/content/directory/source"
import type { AuthorityKind, DirectoryQuery, EntityType, OperationScope, SafetyRating } from "@/content/directory/types"
import { BRAND } from "@/content/registry"
import { CompanyCard } from "@/components/directory/CompanyCard"
import { FilterPanel } from "@/components/directory/FilterPanel"
import { Empty, SampleBanner } from "@/components/directory/kit"

/**
 * Companies in one city, with the filter rail.
 *
 * §36.2's indexing rule, applied: the bare city page is a real destination and
 * is indexable; the moment a filter is applied the view becomes one of
 * thousands of thin combinations, so it is served noindex and drops its
 * canonical onto the bare page. That is the same rule the integrations
 * catalogue follows, and it is why the filters are a GET form rather than
 * client state - the URL is what makes the distinction expressible.
 */

type Params = { params: Promise<{ city: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function generateStaticParams() {
  const cities = await listCities()
  return cities.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: slug } = await params
  const city = await getCity(slug)
  if (!city) return {}
  const title = `Trucking companies in ${city.name}, ${city.state} | LoadHunter`
  const description = `Verify authority, insurance and safety for carriers and brokers based in ${city.name}, ${city.state}. Filter by entity, freight type, fleet size and inspection history.`
  return {
    title,
    description,
    alternates: { canonical: `/trucking-directory/${city.slug}` },
    openGraph: {
      type: "website",
      url: `/trucking-directory/${city.slug}`,
      siteName: BRAND.name,
      title,
      description,
      images: [{ ...BRAND.socialImage, alt: `${BRAND.name} - ${BRAND.category}` }],
    },
  }
}

const arr = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v]

const rangeFor = (label: string | undefined, table: { label: string; range: [number, number] }[]) =>
  table.find((t) => t.label === label)?.range

/** The query string, read into the shape `searchCompanies` takes. */
function toQuery(city: string, p: Record<string, string | string[] | undefined>): DirectoryQuery {
  const contact = arr(p.contact)
  return {
    city,
    search: typeof p.q === "string" ? p.q : undefined,
    entity: arr(p.entity) as EntityType[],
    authority: arr(p.authority) as AuthorityKind[],
    bipdMin: p.bipdMin ? Number(p.bipdMin) : undefined,
    bipdMax: p.bipdMax ? Number(p.bipdMax) : undefined,
    bond: arr(p.bond).includes("yes") || undefined,
    cargo: arr(p.cargo).includes("yes") || undefined,
    freightTypes: arr(p.freight),
    operations: arr(p.ops) as OperationScope[],
    fleetSize: rangeFor(p.fleet as string, FLEET_SIZES),
    driverCount: rangeFor(p.drivers as string, DRIVER_COUNTS),
    inspected24mo: arr(p.inspected).includes("yes") || undefined,
    safetyRating: arr(p.safety) as SafetyRating[],
    hasPhone: contact.includes("phone") || undefined,
    hasEmail: contact.includes("email") || undefined,
    page: p.page ? Number(p.page) : 1,
  }
}

/** Any parameter other than the page number makes this a filtered view. */
const isFiltered = (p: Record<string, string | string[] | undefined>) =>
  Object.keys(p).some((k) => k !== "page" && p[k] !== undefined)

export default async function CityListingPage({ params, searchParams }: Params) {
  const { city: slug } = await params
  const p = await searchParams
  const city = await getCity(slug)
  if (!city) notFound()

  const results = await searchCompanies(toQuery(slug, p))
  const filtered = isFiltered(p)

  return (
    <main id="main" className="bg-paper">
      {/* §36.2 - a thin filter combination is not an indexable page. */}
      {filtered ? <meta name="robots" content="noindex, follow" /> : null}

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <nav aria-label="Breadcrumb" className="pt-10">
          <ol className="flex flex-wrap items-center gap-2 text-meta text-ink-3">
            <li>
              <Link href="/trucking-directory" className="hover:text-ink">
                Trucking directory
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-ink">
              {city.name}, {city.state}
            </li>
          </ol>
        </nav>

        <header className="pt-6 pb-8">
          <h1 className="text-h2 text-ink">
            Trucking companies in {city.name}, {city.state}
          </h1>
          <p className="mt-3 font-mono text-small tabular-nums text-ink-3">
            {results.total.toLocaleString("en-US")} in this view
            {filtered ? " · filtered" : ""}
          </p>
          <div className="mt-6 max-w-[720px]">
            <SampleBanner />
          </div>
        </header>

        <div className="grid gap-10 pb-20 lg:grid-cols-12 lg:gap-12">
          <aside className="min-w-0 lg:col-span-3">
            <FilterPanel city={city} params={p} filtered={filtered} />
          </aside>

          <div className="min-w-0 lg:col-span-9">
            {results.items.length ? (
              <ul className="flex flex-col gap-4">
                {results.items.map((company) => (
                  <li key={company.dot}>
                    <CompanyCard company={company} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-card border border-dashed border-rule bg-paper-2 px-6 py-12 text-center">
                <Empty>{EMPTY.results}</Empty>
                <p className="mt-2 text-small text-ink-4">{EMPTY.resultsHint}</p>
                {filtered ? (
                  <Link
                    href={`/trucking-directory/${city.slug}`}
                    className="mt-6 inline-flex h-10 items-center rounded-full border border-rule px-5 text-small text-ink transition-colors duration-150 hover:border-ink-4"
                  >
                    Clear all filters
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
