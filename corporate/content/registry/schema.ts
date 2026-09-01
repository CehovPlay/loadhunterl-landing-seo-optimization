/**
 * Schema Registry - TZ §14.3: "соответствие типа страницы разрешённой разметке
 * JSON-LD."
 *
 * §10.3 permits nine types and attaches a condition to most of them. The
 * conditions are the point of the registry: SoftwareApplication only for a
 * product that is really available with confirmed characteristics, Product and
 * Offer only where live commercial terms are visible on the page, Review and
 * AggregateRating only with real reviews and the right to publish, VideoObject
 * only with a transcript, FAQPage only where the visitor can see every question
 * and answer.
 *
 * The closing rule of §10.3 - markup may not contain a benefit, rating, price
 * or feature the visitor cannot see - is why `allowedFor` refuses a type rather
 * than merely warning: a build that emits Offer on a page with no visible price
 * is a build that lies to a search engine on our behalf.
 */

import { COMMERCIAL } from "./commercial"
import { CLAIMS } from "./status"

export type SchemaType =
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "BreadcrumbList"
  | "SoftwareApplication"
  | "Product"
  | "Offer"
  | "Article"
  | "VideoObject"
  | "FAQPage"

/** What the page can prove at render time, checked against the conditions. */
export type PageEvidence = {
  url: string
  /** A product page whose product is in the registry. */
  productKey?: string
  /** Every FAQ pair is rendered in the visible DOM. */
  faqVisible?: boolean
  /** Commercial terms are visible on this page right now. */
  offerVisible?: boolean
  /** The page is an article with an author and dates. */
  article?: boolean
  /** A video with a full text transcript on the page. */
  videoWithTranscript?: boolean
  /** Real, attributable, publishable reviews are on the page. */
  reviews?: boolean
}

type Condition = (e: PageEvidence) => boolean

const ALWAYS: Condition = () => true

/**
 * §10.3, one entry per permitted type. A type absent from this map is a type
 * the site never emits.
 */
const CONDITIONS: Record<SchemaType, Condition> = {
  /* Home and company information only - §10.3 first line. */
  Organization: (e) => e.url === "/" || e.url === "/about",
  WebSite: (e) => e.url === "/",
  WebPage: ALWAYS,
  BreadcrumbList: (e) => e.url !== "/",

  /* "Только для реально доступных программных продуктов с подтверждёнными
     характеристиками": the product needs a Live or Beta row in the ledger. */
  SoftwareApplication: (e) =>
    !!e.productKey &&
    CLAIMS.some((c) => c.product === e.productKey && (c.term === "Live" || c.term === "Beta")),

  /* "Только если на странице видны актуальные коммерческие условия." An
     approved price must exist AND be rendered. Neither is true today. */
  Product: (e) =>
    !!e.offerVisible &&
    !!e.productKey &&
    COMMERCIAL.some((c) => c.product === e.productKey && !!c.price),
  Offer: (e) =>
    !!e.offerVisible &&
    !!e.productKey &&
    COMMERCIAL.some((c) => c.product === e.productKey && !!c.price),

  Article: (e) => !!e.article,
  VideoObject: (e) => !!e.videoWithTranscript,
  FAQPage: (e) => !!e.faqVisible,
}

export const allowedFor = (type: SchemaType, evidence: PageEvidence): boolean =>
  CONDITIONS[type](evidence)

/** The types a page may emit, in the order they should appear in the graph. */
export function schemaFor(evidence: PageEvidence): SchemaType[] {
  const order: SchemaType[] = [
    "Organization",
    "WebSite",
    "WebPage",
    "BreadcrumbList",
    "SoftwareApplication",
    "Product",
    "Offer",
    "Article",
    "VideoObject",
    "FAQPage",
  ]
  return order.filter((t) => allowedFor(t, evidence))
}

/**
 * Drop anything the registry does not permit, loudly.
 *
 * Renderers build the graph they would like to emit and pass it through here;
 * an entry with no permission is removed and named, so the omission shows up in
 * the build log instead of being discovered by a search console penalty.
 */
export function filterGraph(
  graph: { "@type": SchemaType | string }[],
  evidence: PageEvidence,
): Record<string, unknown>[] {
  const kept: Record<string, unknown>[] = []
  for (const node of graph) {
    const type = node["@type"] as SchemaType
    if (!(type in CONDITIONS)) {
      console.warn(`[schema] ${evidence.url}: ${type} is not in the Schema Registry - dropped`)
      continue
    }
    if (!allowedFor(type, evidence)) {
      console.warn(`[schema] ${evidence.url}: ${type} not permitted by §10.3 here - dropped`)
      continue
    }
    kept.push(node as Record<string, unknown>)
  }
  return kept
}
