/**
 * Route METADATA, in a component-free module.
 *
 * Kept separate from routes.tsx (which adds the React render functions) so
 * Node-side build steps can bundle just this: scripts/prerender.mjs bakes these
 * tags into each static HTML file and scripts/gen-sitemap.mjs lists the
 * indexable paths. Importing a component here would drag React into those
 * scripts and break them, so keep this file pure data.
 */
import { BLOG_POSTS } from "@/content/blog"
import { BLOG_INDEX, FAQ_ITEMS, META_DESCRIPTION, META_TITLE, OG_DESCRIPTION, OG_TITLE, SITE_URL } from "@/content/copy"
import { SEO_PAGES } from "@/content/pages"

export type RouteMeta = {
  /** always with a trailing slash; "/" for the homepage */
  path: string
  title: string
  description: string
  /** false → served noindex and left out of sitemap.xml */
  index: boolean
  /** Open Graph overrides; the homepage has approved OG copy of its own */
  ogTitle?: string
  ogDescription?: string
  /** JSON-LD blocks, already shaped */
  jsonLd: object[]
}

export const canonical = (path: string) => SITE_URL.replace(/\/$/, "") + path

/** LH-061 — FAQPage schema generated FROM the rendered Q&A, so schema and UI
 *  match 1:1 by construction rather than by review. */
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

/** LH-060 — Organization. Only public, verified fields; no postal address,
 *  because there is no published one to cite. */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LoadHunter",
  url: SITE_URL,
  logo: `${SITE_URL}/figma/logo-icon.svg`,
  email: "support@loadhunter.io",
  telephone: "+1-312-878-9795",
  sameAs: [
    "https://chromewebstore.google.com/detail/loadhunter/ogepjnnfghfpkpjjieenkcppifhmmcdg",
    "https://t.me/loadhunterextension",
    "https://www.instagram.com/loadhunter.io",
  ],
}

/**
 * LH-059 — SoftwareApplication.
 *
 * NOTE: `aggregateRating` is deliberately absent. Google requires the rating to
 * be visible on the page and source-valid; the page deliberately shows two
 * SEPARATE source ratings (Chrome Web Store and Trustpilot) instead of one
 * blended figure, so there is no single visible number to mark up. Marking up a
 * value the page never states is exactly what LH-059 forbids.
 */
export const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LoadHunter",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Chrome",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  description: META_DESCRIPTION,
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Freemium" },
    { "@type": "Offer", price: "9.99", priceCurrency: "USD", name: "Basic" },
    { "@type": "Offer", price: "14.99", priceCurrency: "USD", name: "Standard" },
    { "@type": "Offer", price: "29.99", priceCurrency: "USD", name: "Pro" },
  ],
}

const breadcrumb = (path: string, name: string) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name, item: canonical(path) },
  ],
})

export const ROUTE_META: RouteMeta[] = [
  {
    path: "/",
    title: META_TITLE,
    description: META_DESCRIPTION,
    ogTitle: OG_TITLE,
    ogDescription: OG_DESCRIPTION,
    index: true,
    jsonLd: [softwareJsonLd, organizationJsonLd, faqJsonLd],
  },
  {
    path: "/faq/",
    title: "LoadHunter Support Questions | LoadHunter",
    description:
      "Setup, load-board and email connections, factoring, Telegram alerts, trial and billing questions about the LoadHunter browser extension.",
    index: true,
    jsonLd: [breadcrumb("/faq/", "FAQ")],
  },
  {
    path: "/blog/",
    title: "LoadHunter Blog: Load Board Automation and Dispatch Workflows",
    description:
      "Practical guides on load-board automation, dispatch workflows and load profitability for U.S. carriers, owner-operators and dispatch teams.",
    // thin until the cluster is published — see src/content/blog.ts
    index: BLOG_POSTS.length > 0,
    jsonLd: [breadcrumb("/blog/", BLOG_INDEX.h1)],
  },
  ...SEO_PAGES.map(
    (p): RouteMeta => ({
      path: p.path,
      title: p.title,
      description: p.description,
      index: true,
      jsonLd: [
        breadcrumb(p.path, p.h1),
        ...(p.faq
          ? [
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: p.faq.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
            ]
          : []),
      ],
    }),
  ),
]

/** Normalises a pathname to the table's form (always a trailing slash). */
export function normalizePath(pathname: string): string {
  if (pathname === "" || pathname === "/") return "/"
  return pathname.endsWith("/") ? pathname : pathname + "/"
}
