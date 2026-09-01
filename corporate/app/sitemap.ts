import type { MetadataRoute } from "next"
import { SITE_URL } from "@/content/registry"
import { assertIndexCovers } from "@/content/ia"
import { listCities, listCompanySlugs } from "@/content/directory/source"
import { DETAIL_ROUTES } from "@/content/routes"
import { NOINDEX, PAGES, TEMPLATES } from "@/content/tz"

/**
 * The sitemap, generated from the URL registry rather than maintained by hand.
 *
 * Every page tab's acceptance criteria include "sitemap inclusion/exclusion …
 * verified", and the exclusions are the part a hand-written file gets wrong:
 * /login and /account are out by tab 47 §2, /404 is out because an indexable
 * error page is forbidden, and tabs 40-42 are templates rather than pages so
 * only their generated slugs appear.
 *
 * There are no lastModified dates here. The CMS owns `verifiedAt` per page and
 * a build timestamp would claim every page changed on every deploy, which is
 * exactly the kind of unverifiable signal the governance section rules out.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /* The sitemap and the site index answer the same question - which pages
     exist - so this is where the index is held to it. A route that reaches
     the sitemap without a home in the menus fails the build here. */
  assertIndexCovers()

  const pages = PAGES.filter((p) => !NOINDEX.has(p.url) && !TEMPLATES.has(p.url)).map((p) => ({
    url: `${SITE_URL}${p.url === "/" ? "" : p.url}`,
    // The homepage and the five product pages are the entry points every other
    // page routes into, so they carry the higher weight.
    priority: p.num === 1 ? 1 : p.num <= 8 || p.num === 43 ? 0.8 : 0.6,
  }))

  const details = DETAIL_ROUTES.map((r) => ({
    url: `${SITE_URL}/${r.slug}`,
    priority: 0.5,
  }))

  /* The directory. The hub and the city pages are the indexable surface;
     company profiles are the long tail and carry the lower weight. Filtered
     views are absent by design - §36.2 keeps thin filter combinations out of
     the index, and each one sets its own noindex. */
  const [cities, companies] = await Promise.all([listCities(), listCompanySlugs()])

  const directory = [
    { url: `${SITE_URL}/trucking-directory`, priority: 0.8 },
    ...cities.map((c) => ({ url: `${SITE_URL}/trucking-directory/${c.slug}`, priority: 0.6 })),
    ...companies.map((c) => ({
      url: `${SITE_URL}/trucking-directory/${c.city}/${c.company}`,
      priority: 0.4,
    })),
  ]

  return [...pages, ...details, ...directory]
}
