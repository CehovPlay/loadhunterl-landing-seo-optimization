/**
 * The data seam.
 *
 * Everything the directory renders comes through these four functions, and
 * nothing else in the app imports `mock.ts`. When the backend finishes parsing
 * the FMCSA base, this file changes and no page does: the signatures already
 * return promises, already paginate, and already carry the query object the
 * filter panel produces.
 *
 * `SOURCE` is what the pages read to decide whether to print the sample banner.
 * It is a single flag rather than a build-time environment check on purpose -
 * a page that forgets to check it is a page that shows invented figures as
 * fact, so the flag lives next to the data it describes.
 */

import { CITIES, COMPANIES } from "./mock"
import type { City, Company, DirectoryPage, DirectoryQuery } from "./types"

export const SOURCE = {
  kind: "sample" as "sample" | "fmcsa",
  /** Printed on the page beside anything the import will replace. */
  note: "Sample records. The FMCSA import is not connected yet.",
  /** Set when the import runs; §3.6 requires the check date to be visible. */
  verifiedAt: null as string | null,
} as const

export const isSample = () => SOURCE.kind === "sample"

const PER_PAGE = 20

export async function listCities(): Promise<City[]> {
  return CITIES
}

export async function getCity(slug: string): Promise<City | null> {
  return CITIES.find((c) => c.slug === slug) ?? null
}

/** Every company slug, for `generateStaticParams`. */
export async function listCompanySlugs(): Promise<{ city: string; company: string }[]> {
  return COMPANIES.map((c) => ({ city: c.citySlug, company: c.slug }))
}

export async function getCompany(citySlug: string, slug: string): Promise<Company | null> {
  return COMPANIES.find((c) => c.citySlug === citySlug && c.slug === slug) ?? null
}

const inRange = (value: number, range?: [number, number]) =>
  !range || (value >= range[0] && value <= range[1])

export async function searchCompanies(query: DirectoryQuery): Promise<DirectoryPage<Company>> {
  const q = query.search?.trim().toLowerCase()

  const matched = COMPANIES.filter((c) => {
    if (query.city && c.citySlug !== query.city) return false
    if (q && !(c.name.toLowerCase().includes(q) || c.dot.includes(q) || (c.mc ?? "").includes(q))) return false
    if (query.entity?.length && !query.entity.some((e) => c.entity.includes(e))) return false
    if (query.authority?.length) {
      const active = c.authorities.filter((a) => a.status === "Active").map((a) => a.kind)
      if (!query.authority.some((a) => active.includes(a))) return false
    }
    if (query.bipdMin !== undefined && c.bipd < query.bipdMin) return false
    if (query.bipdMax !== undefined && c.bipd > query.bipdMax) return false
    if (query.bond !== undefined && c.bond !== query.bond) return false
    if (query.cargo !== undefined && c.cargo !== query.cargo) return false
    if (query.freightTypes?.length && !query.freightTypes.some((f) => c.freightTypes.includes(f))) return false
    if (query.operations?.length && !query.operations.some((o) => c.operations.includes(o))) return false
    if (!inRange(c.powerUnits, query.fleetSize)) return false
    if (!inRange(c.drivers, query.driverCount)) return false
    if (query.inspected24mo !== undefined && c.inspected24mo !== query.inspected24mo) return false
    if (query.safetyRating?.length && !query.safetyRating.includes(c.safetyRating)) return false
    if (query.hasPhone && !c.contact.phone) return false
    if (query.hasEmail && !c.contact.email) return false
    return true
  })

  const page = query.page ?? 1
  return {
    items: matched.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    total: matched.length,
    page,
    perPage: PER_PAGE,
  }
}
