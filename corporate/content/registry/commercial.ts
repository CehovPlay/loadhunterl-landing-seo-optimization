/**
 * Commercial Registry - TZ §14.3: "цены, trial, договорные условия и
 * утверждённые формулировки снижения риска."
 *
 * There are no amounts in this file, and that is the specification rather than
 * an omission. Tab 19's selling hypothesis is "no placeholder dollar amounts",
 * §35.1 says that where public tiers are not approved the page explains the
 * buying model instead, and §35.2 forbids struck-through prices, artificial
 * urgency, "most popular" and unsubstantiated savings. So the registry stores
 * the pricing *mode* per product - the thing that is known - and leaves `price`
 * absent until an approved figure exists.
 *
 * §18.3 lists seven claim families that cannot be published without recorded
 * owner sign-off. `APPROVAL_GATES` is that list in code, and
 * `unapprovedClaims()` is what a pre-publication check calls: a page carrying
 * one of these subjects with `approvedBy: null` does not ship.
 */

import type { ProductKey } from "./status"

/** §19 block 1 - the four modes a product's commercial context can be in. */
export type PricingMode = "free" | "published" | "quote" | "preview-only"

export type CommercialRecord = {
  product: ProductKey
  mode: PricingMode
  /** §19 block 3 - what the buyer gets, so scope is not a surprise later. */
  includes: string[]
  /** §19 block 3 - stated exclusions beat discovered ones. */
  excludes: string[]
  /** §19 block 2 - inputs that materially change the offer. Never revenue. */
  profileInputs: string[]
  /** Present only once a figure is approved. §35.1 forbids inventing one. */
  price?: { amount: string; period: string; approvedBy: string; verifiedAt: string }
  trial?: { length: string; approvedBy: string }
  approvedBy: string | null
  verifiedAt: string | null
}

const UNAPPROVED = { approvedBy: null, verifiedAt: null }

export const COMMERCIAL: CommercialRecord[] = [
  {
    product: "loadhunter",
    mode: "free",
    includes: ["Browser extension", "Load evaluation layer", "Outreach draft"],
    excludes: ["Dispatch execution", "Invoicing"],
    profileInputs: ["access type"],
    ...UNAPPROVED,
  },
  {
    product: "hunttms",
    mode: "quote",
    includes: ["Dispatch workflow", "Resource and document context", "Load timeline"],
    excludes: ["Driver app seats", "Payment processing"],
    profileInputs: ["users", "trucks", "monthly loads"],
    ...UNAPPROVED,
  },
  {
    product: "huntdrive",
    mode: "quote",
    includes: ["Driver action layer", "Status and document capture"],
    excludes: ["ELD hardware", "Cellular plans"],
    profileInputs: ["drivers", "access type"],
    ...UNAPPROVED,
  },
  {
    product: "huntpay",
    mode: "quote",
    includes: ["Invoicing", "Payroll workflow", "Finance exceptions"],
    excludes: ["Factoring fees", "Banking charges"],
    profileInputs: ["monthly loads", "users"],
    ...UNAPPROVED,
  },
  {
    product: "huntos",
    mode: "preview-only",
    includes: ["Exception command layer preview"],
    excludes: ["Unified cross-product intelligence"],
    profileInputs: ["users"],
    ...UNAPPROVED,
  },
]

export const commercialFor = (product: ProductKey): CommercialRecord => {
  const found = COMMERCIAL.find((c) => c.product === product)
  if (!found) throw new Error(`No commercial record for ${product}`)
  return found
}

/**
 * §35.2 - patterns the pricing page may not use, kept as data so a check can
 * look for them in rendered copy rather than relying on review to catch them.
 */
export const FORBIDDEN_PRICING_PATTERNS: { pattern: RegExp; why: string }[] = [
  { pattern: /most popular/i, why: "§35.2 forbids an unsubstantiated 'most popular' badge" },
  { pattern: /\bwas\s*\$|\bsave\s+\d+%|\d+%\s+off\b/i, why: "§35.2 forbids struck-through prices and unsubstantiated savings" },
  { pattern: /only \d+ (left|spots|seats)|offer ends|limited time/i, why: "§35.2 forbids artificial urgency" },
]

/** §18.3 - what a page may not claim without recorded approval. */
export type ApprovalSubject =
  | "pricing-and-cancellation"
  | "factoring-payments-and-financial-outcomes"
  | "ratings-reviews-and-customer-results"
  | "security-certifications-and-compliance"
  | "partner-and-integration-logos"
  | "competitor-comparisons"
  | "ai-autonomy-and-decisions"

export type ApprovalGate = {
  subject: ApprovalSubject
  /** Pages that would carry this subject if the content existed. */
  pages: string[]
  approvedBy: string | null
  verifiedAt: string | null
  /** Legal review as well as product owner, where §18.3 requires it. */
  needsLegal: boolean
}

export const APPROVAL_GATES: ApprovalGate[] = [
  { subject: "pricing-and-cancellation", pages: ["/pricing"], needsLegal: true, ...UNAPPROVED },
  { subject: "factoring-payments-and-financial-outcomes", pages: ["/huntpay", "/finance", "/accounting"], needsLegal: true, ...UNAPPROVED },
  { subject: "ratings-reviews-and-customer-results", pages: ["/customers", "/case-studies"], needsLegal: false, ...UNAPPROVED },
  { subject: "security-certifications-and-compliance", pages: ["/trust"], needsLegal: true, ...UNAPPROVED },
  { subject: "partner-and-integration-logos", pages: ["/integrations", "/partners"], needsLegal: false, ...UNAPPROVED },
  { subject: "competitor-comparisons", pages: ["/compare"], needsLegal: true, ...UNAPPROVED },
  { subject: "ai-autonomy-and-decisions", pages: ["/platform", "/huntos"], needsLegal: false, ...UNAPPROVED },
]

export const unapprovedClaims = (): ApprovalGate[] =>
  APPROVAL_GATES.filter((g) => !g.approvedBy)
