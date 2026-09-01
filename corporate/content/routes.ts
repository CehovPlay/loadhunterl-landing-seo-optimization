/**
 * The URL registry.
 *
 * The master spec's §5.2 sets a root-level direct URL policy: every page sits
 * at the root, no /products/… or /solutions/… segment is ever created, and
 * generated detail pages (articles, cases, comparisons) take "a descriptive
 * root slug and a maintained redirect/collision registry".
 *
 * That registry is this file. It has to exist for the policy to be
 * implementable at all: if articles live at /how-carriers-cut-detention and
 * pages live at /carriers, something has to know which slug is which and
 * refuse the ones that collide. Next's dynamic segment resolves after every
 * static route, so the collision case is a slug that duplicates a page - which
 * `assertNoCollisions` below catches at build time rather than in production.
 *
 * The entries are examples. Real ones come from the CMS.
 */

import { PAGES, TEMPLATES } from "./tz"

/** Which template tab renders a given detail page. */
export type DetailTemplate = 40 | 41 | 42

export type DetailRoute = {
  slug: string
  template: DetailTemplate
  /** Printed on the page while the CMS is not connected. */
  title: string
}

export const DETAIL_ROUTES: DetailRoute[] = [
  {
    slug: "how-carriers-cut-detention-disputes",
    template: 40,
    title: "How carriers cut detention disputes",
  },
  {
    slug: "dispatch-handoffs-without-spreadsheets",
    template: 40,
    title: "Dispatch handoffs without spreadsheets",
  },
  {
    slug: "midwest-carrier-load-to-cash",
    template: 41,
    title: "Midwest carrier: load to cash in one trail",
  },
  {
    slug: "loadhunter-vs-manual-load-boards",
    template: 42,
    title: "LoadHunter vs manual load boards",
  },
]

/** Every static page URL, minus the three template tabs, which are not pages. */
export const STATIC_URLS: string[] = PAGES.filter((p) => !TEMPLATES.has(p.url)).map((p) => p.url)

/**
 * A detail slug may never shadow a page. Called from the dynamic route's
 * `generateStaticParams`, so a colliding slug fails the build.
 */
export function assertNoCollisions(): void {
  const taken = new Set(STATIC_URLS.map((u) => u.replace(/^\//, "")))
  const clashes = DETAIL_ROUTES.filter((r) => taken.has(r.slug)).map((r) => r.slug)
  if (clashes.length) {
    throw new Error(
      `URL registry collision: ${clashes.join(", ")} already exist as pages. ` +
        `§5.2 requires the registry to keep root slugs unique.`,
    )
  }
}

export const detailBySlug = (slug: string): DetailRoute | undefined =>
  DETAIL_ROUTES.find((r) => r.slug === slug)
