/**
 * The six registries TZ §14.3 requires, in one place.
 *
 *   Brand       - legal name, domains, contacts, socials, copyright, logos
 *   Product     - the five products, their statuses and real destinations
 *   Commercial  - prices, trial, terms and approved risk-reduction wording
 *   Integration - name, category, status, evidence and link
 *   Schema      - which JSON-LD a page type is allowed to emit
 *   Redirect    - old URL, new URL, type and check state
 *
 * The Status Ledger (§3.6) sits beside them because the Product Registry is
 * defined in terms of it, and because §3.6 gives it its own rules.
 *
 * Nothing here imports from `content/tz` or from a component. The dependency
 * runs one way - registries are read by pages, never the reverse - which is
 * what keeps "change the term in one place" true.
 */

export * from "./brand"
export * from "./commercial"
export * from "./integrations"
export * from "./products"
export * from "./redirects"
export * from "./schema"
export * from "./status"

import { BRAND } from "./brand"
import { unapprovedClaims } from "./commercial"
import { INTEGRATIONS } from "./integrations"
import { owedDestinations } from "./products"
import { unverifiedRedirects } from "./redirects"
import { unpublishable } from "./status"
import { FAQ as DIRECTORY_FAQ } from "../directory/copy"
import { PRODUCTS } from "./products"

export type Blocker = { registry: string; item: string; reason: string }

/**
 * Everything the specification says must be settled before the site is public.
 *
 * This is deliberately not a build error. Each entry is somebody's decision or
 * somebody's address, and failing `next build` on a missing owner would stop
 * the work that produces the pages those owners have to review. `npm run
 * publishable` prints the list; a deploy runs it and reads it.
 */
export function publicationBlockers(): Blocker[] {
  const out: Blocker[] = []

  if (!BRAND.legalEntity) {
    out.push({
      registry: "Brand",
      item: "legalEntity",
      reason: "§14.3 requires the legal entity behind the copyright line",
    })
  }

  for (const { claim, reason } of unpublishable()) {
    out.push({ registry: "Status Ledger", item: `${claim.scope} - ${claim.term}`, reason })
  }

  for (const { product, owed } of owedDestinations()) {
    out.push({ registry: "Product", item: product, reason: `destination not confirmed: ${owed}` })
  }

  for (const gate of unapprovedClaims()) {
    out.push({
      registry: "Commercial",
      item: gate.subject,
      reason: `§18.3 needs recorded approval${gate.needsLegal ? " and legal review" : ""} before ${gate.pages.join(", ")} publish this`,
    })
  }

  for (const integration of INTEGRATIONS) {
    if (!integration.owner) {
      out.push({
        registry: "Integration",
        item: integration.name,
        reason: "§36.2 requires a data owner on the card",
      })
    }
  }

  /* A product name in visitor copy that no registry entry backs. §10.2 wants
     search engines told there are five products of one system; a sixth name in
     an FAQ answer contradicts that, whether or not it is a real internal tool. */
  const known = new Set([...PRODUCTS.map((p) => p.name.toLowerCase()), "loadhunter"])
  for (const item of DIRECTORY_FAQ) {
    for (const match of item.a.matchAll(/\b(?:Load|hunt)[A-Z][A-Za-z]+\b/g)) {
      if (known.has(match[0].toLowerCase())) continue
      out.push({
        registry: "Product",
        item: match[0],
        reason: `named in directory FAQ copy but absent from the Product Registry (§10.2): "${item.q}"`,
      })
    }
  }

  for (const redirect of unverifiedRedirects()) {
    out.push({
      registry: "Redirect",
      item: `${redirect.from} -> ${redirect.to}`,
      reason: "§10.1 requires the redirect to be followed and checked",
    })
  }

  return out
}
