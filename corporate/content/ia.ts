/**
 * Information architecture: one home per page.
 *
 * The build has 44 routes and several of them overlap in meaning - /products
 * and /platform, /customers and /case-studies, /resources against /blog,
 * /guides and /tools, /finance against /accounting. While that overlap was
 * only implicit, nothing could resolve a link: the top bar guessed, the footer
 * listed a different subset, and the CTA resolver matched a label against a
 * regular expression and sent "Open Guide" on /guides to /resources.
 *
 * So the structure is declared once, here, and everything else reads it.
 * Two rules make it usable:
 *
 *   1. Every page appears exactly once. `assertIndexCovers` fails the build if
 *      a route is missing from the index or listed twice, which is the only
 *      way a 44-page site stays walkable.
 *   2. `place` decides the top bar. "nav" is the buying path - what it is, who
 *      it is for, does it work, what it costs. Everything else is "footer":
 *      still one click from every page, but not competing with the four
 *      questions a first-time visitor actually asks.
 *
 * The nav set is deliberately five entries. §5.1 requires the products
 * mega-menu and names Solutions, Pricing and Resources; Platform moved inside
 * the products panel because a visitor cannot be asked to choose between
 * "Products" and "Platform" in the same bar, and Trust moved to the footer
 * with the rest of the operational pages.
 */

export type IaEntry = {
  href: string
  /** The page's name everywhere it is referenced: menu, footer, link chip. */
  title: string
  /** One line, printed in the mega-menu and the site index. */
  note?: string
}

export type IaSection = {
  /** Menu label in the top bar, column heading in the footer index. */
  title: string
  /** The section's own landing page, if it has one. */
  href?: string
  place: "nav" | "footer"
  /** The five products, rendered as the mega-menu §5.1 requires. */
  products?: boolean
  /** Top bar renders a plain link even though the footer index lists a group. */
  plain?: boolean
  /** In the bar, absent from the footer index. Only `/` qualifies: the index
      lists the pages of the site, and the site is not a page of itself. */
  hidden?: boolean
  groups: { title: string; entries: IaEntry[] }[]
}

export const SITE: IaSection[] = [
  {
    /* The wordmark already goes home, and it is the convention every visitor
       knows. It is also the one link a first-time visitor cannot see is a link
       until they try it, and a reader who has scrolled 4 000px into /huntpay
       should not have to aim at a 24px mark to get back. Owner's call,
       2026-08-20: home is a named entry in the bar as well.

       It carries no panel and no index column - `/` is the site, not a section
       of it - so `hidden` keeps it out of the footer index that lists every
       route exactly once. */
    title: "Home",
    href: "/",
    place: "nav",
    plain: true,
    hidden: true,
    groups: [],
  },
  {
    title: "Products",
    href: "/products",
    place: "nav",
    products: true,
    groups: [
      {
        /* The five product pages are rendered from the ledger, not listed
           here - see MENU_PRODUCTS - so this group carries what the spec
           calls the places products meet. */
        title: "Where products meet",
        entries: [
          { href: "/platform", title: "Platform", note: "How the five products share one record" },
          { href: "/products", title: "All five products", note: "Compared side by side" },
          { href: "/marketplace", title: "Marketplace", note: "Where loads are found and booked" },
          { href: "/live-tracking", title: "Live tracking", note: "Position and ETA on a booked load" },
          { href: "/integrations", title: "Integrations", note: "What connects in and out" },
        ],
      },
    ],
  },
  {
    title: "Solutions",
    href: "/carriers",
    place: "nav",
    groups: [
      {
        title: "By role",
        entries: [
          { href: "/carriers", title: "Carriers", note: "Run the fleet on one record" },
          { href: "/owner-operators", title: "Owner-operators", note: "One truck, no back office" },
          { href: "/fleets", title: "Fleets", note: "Multiple trucks and dispatchers" },
          { href: "/dispatchers", title: "Dispatchers", note: "Cover the board without tabs" },
          { href: "/drivers", title: "Drivers", note: "The phone side of the load" },
          { href: "/finance", title: "Finance teams", note: "Load to cash, in one trail" },
        ],
      },
      {
        title: "By workflow",
        entries: [
          { href: "/brokers", title: "Brokers", note: "Qualify and cover faster" },
          { href: "/broker-intelligence", title: "Broker intelligence", note: "Who to trust with a load" },
          { href: "/accounting", title: "Accounting handoff", note: "What the bookkeeper receives" },
        ],
      },
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    place: "nav",
    groups: [
      {
        title: "Proof",
        entries: [
          { href: "/customers", title: "Customers", note: "Who runs on the stack" },
          { href: "/case-studies", title: "Case studies", note: "One operation, start to finish" },
          { href: "/compare", title: "Compare", note: "Against the tools you use now" },
        ],
      },
    ],
  },
  {
    title: "Resources",
    href: "/resources",
    place: "nav",
    groups: [
      {
        title: "Learn",
        entries: [
          { href: "/resources", title: "Resource center", note: "Everything, by freight job" },
          { href: "/blog", title: "Blog", note: "What we are seeing in the market" },
          { href: "/guides", title: "Guides", note: "Step-by-step, one job each" },
          { href: "/tools", title: "Tools", note: "Calculators that use your numbers" },
        ],
      },
      {
        /* Its own group rather than a fifth "Learn" entry: the others are
           things to read, this one is a thing to look somebody up in. */
        title: "Look up",
        entries: [
          {
            href: "/trucking-directory",
            title: "Trucking directory",
            note: "Authority, insurance and safety by carrier",
          },
        ],
      },
    ],
  },
  {
    /* One destination in the bar, one column in the index: the section exists
       so pricing is not filed under a product or under "company". */
    title: "Pricing",
    href: "/pricing",
    place: "nav",
    plain: true,
    groups: [
      {
        title: "Pricing",
        entries: [
          { href: "/pricing", title: "Plans and pricing", note: "What each product costs" },
        ],
      },
    ],
  },

  {
    /* Owner's call, 2026-08-20: About gets its own button rather than living
       only in the footer's Company column. It is still listed there - a section
       heading in the bar is not a home, and the index is where a page's home
       is - so `hidden` keeps it from being counted twice. */
    title: "About",
    href: "/about",
    place: "nav",
    plain: true,
    hidden: true,
    groups: [],
  },

  /* Below the fold. Reachable from every page, absent from the buying path. */
  {
    title: "Company",
    place: "footer",
    groups: [
      {
        title: "Company",
        entries: [
          { href: "/about", title: "About" },
          { href: "/careers", title: "Careers" },
          { href: "/press", title: "Press" },
          { href: "/partners", title: "Partners" },
        ],
      },
    ],
  },
  {
    title: "Talk to us",
    place: "footer",
    groups: [
      {
        title: "Talk to us",
        entries: [
          { href: "/demo", title: "Book a demo" },
          { href: "/contact", title: "Contact" },
          { href: "/support", title: "Support" },
          { href: "/login", title: "Product login" },
        ],
      },
    ],
  },
  {
    title: "Trust and operations",
    place: "footer",
    groups: [
      {
        title: "Trust and operations",
        entries: [
          { href: "/trust", title: "Trust center" },
          { href: "/status", title: "Status" },
          { href: "/roadmap", title: "Roadmap" },
          { href: "/accessibility", title: "Accessibility" },
        ],
      },
    ],
  },
  {
    title: "Legal",
    place: "footer",
    groups: [
      {
        title: "Legal",
        entries: [
          { href: "/privacy", title: "Privacy" },
          { href: "/terms", title: "Terms" },
          { href: "/cookies", title: "Cookie preferences" },
        ],
      },
    ],
  },
]

/** A section with no groups is a single destination: Pricing is one page. */
export const sectionEntry = (s: IaSection): IaEntry | null =>
  s.groups.length === 0 && s.href ? { href: s.href, title: s.title } : null

export const NAV_SECTIONS = SITE.filter((s) => s.place === "nav")
export const FOOTER_SECTIONS = SITE.filter((s) => s.place === "footer")

/** Every entry, flattened. Product pages are added by `withProducts` below. */
export const IA_ENTRIES: IaEntry[] = SITE.flatMap((s) => {
  const own = sectionEntry(s)
  return [...(own ? [own] : []), ...s.groups.flatMap((g) => g.entries)]
})

/* The five product pages come from the same ledger the page bodies read, so a
   name or a status can never drift between the menu and the page. */
import { PRODUCTS_WITH_STATUS } from "./registry"
import { PAGES, TEMPLATES } from "./tz"

export const PRODUCT_ENTRIES: IaEntry[] = PRODUCTS_WITH_STATUS.map((p) => ({
  href: p.href,
  title: p.name,
  note: p.job,
}))

/** What the mega-menu prints per product: role, outcome, status - §5.1. */
export const MENU_PRODUCTS = PRODUCTS_WITH_STATUS.map((p) => ({
  name: p.name,
  href: p.href,
  role: p.role,
  job: p.job,
  statuses: p.statuses,
}))

const ALL: IaEntry[] = [...PRODUCT_ENTRIES, ...IA_ENTRIES]

/** A route's short name, for menus, the index and link destinations. */
export const TITLE: Record<string, string> = Object.fromEntries(
  ALL.map((e) => [e.href, e.title]),
)

/** The section a route belongs to, so a link can say where it is going. */
export const SECTION_OF: Record<string, string> = Object.fromEntries(
  SITE.flatMap((s) => {
    const own = sectionEntry(s)
    return [
      ...(s.products ? PRODUCT_ENTRIES : []),
      ...(own ? [own] : []),
      ...s.groups.flatMap((g) => g.entries),
    ].map((e) => [e.href, s.title] as const)
  }),
)

export const inIndex = (href: string): boolean => href in TITLE

/**
 * The structural guarantee. A 44-page site is only walkable if every page has
 * exactly one home: a route missing from the index is unreachable except by
 * URL, and a route listed twice makes the menus disagree about where it lives.
 * /404 is excluded - it is rendered by not-found and is never linked. `/` is
 * excluded from the *coverage* half for the reason `hidden` exists: the index
 * lists the pages of the site, and the site is not one of its own pages. It
 * stays a permitted destination, so the bar can name it and `TITLE` can resolve
 * it, which is why it is added back to `known` below.
 */
/** Routes added after the specification. See the directory note in the vault. */
export const OFF_SPEC = ["/trucking-directory"]

export function assertIndexCovers(): void {
  const routes = PAGES.filter((p) => !TEMPLATES.has(p.url) && p.url !== "/404" && p.url !== "/")
    .map((p) => p.url)
  /* Surfaces the 47-tab document does not describe. They are real routes with
     a home in the index, so the coverage half must not demand them from
     `PAGES` and the duplicate half must still police them. */
  const known = [...routes, "/", ...OFF_SPEC]
  const seen = new Map<string, number>()
  for (const e of ALL) seen.set(e.href, (seen.get(e.href) ?? 0) + 1)

  /* A `hidden` section puts a destination in the bar without claiming to be
     that page's home - About's home is the Company column, and Home has no home
     because the site is not one of its own pages. Discount those so the
     duplicate check stays about the index rather than about the bar. */
  for (const s of SITE) {
    if (!s.hidden || !s.href) continue
    const n = seen.get(s.href) ?? 0
    if (n > 1) seen.set(s.href, n - 1)
  }

  const missing = routes.filter((r) => !seen.has(r))
  const duplicated = [...seen].filter(([, n]) => n > 1).map(([href]) => href)
  const unknown = [...seen.keys()].filter((h) => !known.includes(h))

  const problems = [
    missing.length ? `missing from the index: ${missing.join(", ")}` : "",
    duplicated.length ? `listed twice: ${duplicated.join(", ")}` : "",
    unknown.length ? `not a route: ${unknown.join(", ")}` : "",
  ].filter(Boolean)

  if (problems.length) throw new Error(`Site index is not one home per page - ${problems.join("; ")}`)
}

/**
 * The footer index: every route the site has, in columns.
 *
 * The footer is where the other 38 pages live now that the bar carries five.
 * That only works if it is complete - a page that is in neither the bar nor
 * the index is a page nobody will find - which is what `assertIndexCovers`
 * guarantees above.
 */
export type IndexColumn = { title: string; entries: IaEntry[]; products?: boolean }

export const SITE_INDEX: IndexColumn[] = SITE.flatMap((s) => [
  ...(s.products ? [{ title: s.title, entries: PRODUCT_ENTRIES, products: true }] : []),
  ...s.groups.map((g) => ({ title: g.title, entries: g.entries })),
])

/**
 * TZ §5.4 - product login destinations, kept away from the marketing CTAs.
 * One destination, because §2.8 makes /login the place where the product is
 * chosen; inventing per-product app URLs here would ship guesses.
 */
export const FOOTER_ACCESS = {
  title: "Product access",
  label: "Log in",
  href: "/login",
  note: "Choose your product after signing in.",
} as const
