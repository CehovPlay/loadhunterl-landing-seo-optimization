/**
 * Status Ledger - TZ §3.6, the registry every availability claim points at.
 *
 * §3.6 sets four rules and this file is shaped by all four:
 *
 *   1. One of six terms, never free text.
 *   2. The status sits beside the capability it covers, so the unit of the
 *      ledger is a scope - "Telegram workflow" - and never a product. huntDRIVE
 *      has two rows because it is Live one way and In Progress the other.
 *   3. No date on In Progress or Planned without the product owner in writing.
 *      `eta` therefore cannot be set without `etaApprovedBy`.
 *   4. "Любая claim без владельца, источника и даты проверки блокируется от
 *      публикации." That is a publication gate, not a build gate: `owner: null`
 *      compiles and renders, and `unpublishable()` is what refuses to ship it.
 *
 * Changing a term here updates the product page, the mega-menu, the homepage
 * FAQ and /status together, which is the automatic propagation §3.6 asks for.
 */

export type StatusTerm = "Live" | "Beta" | "Preview" | "In Progress" | "Planned" | "Deprecated"

/** §3.6 - the closed vocabulary, in the order the ledger reads best. */
export const STATUS_TERMS: readonly StatusTerm[] = [
  "Live",
  "Beta",
  "Preview",
  "In Progress",
  "Planned",
  "Deprecated",
] as const

export type ClaimRecord = {
  /** Stable id, so a claim can be referenced from copy and from analytics. */
  id: string
  /** Which product page the claim belongs to. */
  product: ProductKey
  /** The capability the term covers. Printed next to the term, never alone. */
  scope: string
  term: StatusTerm
  /**
   * Who signed off. `null` blocks publication - see `unpublishable()`. It is a
   * role identifier rather than a person: the site never prints it, the
   * approval log does.
   */
  owner: string | null
  source: string
  /** ISO date of the last check. §10.4 requires it to be readable as text. */
  verifiedAt: string
  /** Forbidden on In Progress / Planned unless `etaApprovedBy` is set. */
  eta?: string
  etaApprovedBy?: string
}

export type ProductKey = "loadhunter" | "hunttms" | "huntdrive" | "huntpay" | "huntos"

const LEDGER_SOURCE = "LoadHunter status ledger"
const VERIFIED = "2026-08-19"

export const CLAIMS: ClaimRecord[] = [
  {
    id: "loadhunter-extension",
    product: "loadhunter",
    scope: "LoadHunter extension",
    term: "Live",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "hunttms-core",
    product: "hunttms",
    scope: "huntTMS",
    term: "Live",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntdrive-telegram",
    product: "huntdrive",
    scope: "Telegram workflow",
    term: "Live",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntdrive-native",
    product: "huntdrive",
    scope: "Native app",
    term: "In Progress",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntpay-invoicing",
    product: "huntpay",
    scope: "Invoicing and payroll",
    term: "Live",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntpay-factoring",
    product: "huntpay",
    scope: "Direct factoring integration",
    term: "In Progress",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntos-preview",
    product: "huntos",
    scope: "huntOS",
    term: "Preview",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntos-dashboard",
    product: "huntos",
    scope: "huntTMS dashboard",
    term: "Live",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
  {
    id: "huntos-unified",
    product: "huntos",
    scope: "Unified cross-product intelligence",
    term: "In Progress",
    owner: null,
    source: LEDGER_SOURCE,
    verifiedAt: VERIFIED,
  },
]

export const claimsFor = (product: ProductKey): ClaimRecord[] =>
  CLAIMS.filter((c) => c.product === product)

export const claimById = (id: string): ClaimRecord | undefined =>
  CLAIMS.find((c) => c.id === id)

/** The line the page prints: scope first, then term. Never a lone badge. */
export const claimLine = (claim: ClaimRecord): string => `${claim.scope}: ${claim.term}`

/** §10.4 - the check date has to be readable, not hidden in a tooltip. */
export const claimProvenance = (claim: ClaimRecord): string =>
  `Source: ${claim.source}. Verified ${claim.verifiedAt}.`

/**
 * Claims §3.6 will not let us publish, with the reason.
 *
 * Called by `scripts/publishable.mts` before a deploy, not by the build: a
 * missing owner is an owner's task, and failing `next build` on it would stop
 * the work that produces the page the owner has to review.
 */
export function unpublishable(): { claim: ClaimRecord; reason: string }[] {
  const out: { claim: ClaimRecord; reason: string }[] = []
  for (const claim of CLAIMS) {
    if (!claim.owner) out.push({ claim, reason: "no owner on record (§3.6)" })
    if (!claim.source) out.push({ claim, reason: "no source on record (§3.6)" })
    if (!claim.verifiedAt) out.push({ claim, reason: "no verification date (§3.6)" })
    if (claim.eta && !claim.etaApprovedBy) {
      out.push({ claim, reason: "date published without written approval (§3.6)" })
    }
  }
  return out
}

/**
 * The ledger as one sentence, for a place that can only take a string.
 *
 * Tab 01's answer to "Which products are available now?" is an instruction -
 * render availability from the governed source using only the allowed terms -
 * so the page renders the ledger instead of printing the instruction at the
 * visitor. The FAQPage markup needs the same content as plain text, because
 * §10.3 forbids structured data that says anything the visitor cannot see.
 */
export function statusAnswerText(products: { key: ProductKey; name: string }[]): string {
  const lines = products.map((product) => {
    const claims = claimsFor(product.key)
    return `${product.name}: ` + claims.map((c) => `${c.scope} - ${c.term}`).join("; ")
  })
  const first = CLAIMS[0]
  return `${lines.join(". ")}. Source: ${first.source}, verified ${first.verifiedAt}.`
}
