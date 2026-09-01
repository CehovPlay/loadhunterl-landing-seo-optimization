/**
 * Product Registry - TZ §14.3: "пять продуктов, их статусы и реальные точки
 * назначения."
 *
 * The three parts of that sentence are three things this file owns.
 *
 * Statuses are not stored here - they live in ./status.ts, one row per scope,
 * and are read back through `claimsFor`. Copying a term into the product record
 * would create a second place to be wrong.
 *
 * "Реальные точки назначения" is the part §15.3 is strict about: the Chrome Web
 * Store listing and the huntDRIVE Telegram link are verified before publication
 * and are the only addresses that may sit behind an install or open-the-app
 * button. Neither has been handed over, so both are `pending` and every control
 * that would use them renders as "Address pending" rather than guessing a URL
 * that would 404 in front of a buyer.
 *
 * §10.2 also reads this file: the search engines are told these are five
 * products of one system, with the Hunt Intelligence Layer described as a
 * platform capability rather than a sixth product.
 */

import { claimsFor, type ClaimRecord, type ProductKey } from "./status"

export type { ProductKey }

/**
 * An address that lives outside this site.
 *
 * `pending` is not a failure state, it is the honest one: §15.3 requires the
 * address to be checked before publication, and `owed` names who has to hand it
 * over so the gap is trackable rather than forgotten.
 */
export type ExternalDestination =
  | { state: "confirmed"; url: string; verifiedAt: string }
  | { state: "pending"; owed: string }

export type ProductRecord = {
  key: ProductKey
  name: string
  /** One-word position in the system, printed beside the name in the menu. */
  role: string
  href: string
  /** Anchor of this product's scene on the homepage. */
  block: string
  /** The product page H1, verbatim from tabs 03-07. */
  job: string
  /** The page passport's audience line. */
  user: string
  /** The routing sentence from master §2.3. */
  jtbd: string
  /** The homepage block CTA for this product, verbatim from tab 01. */
  next: string
  /** §15.3 - where the product actually opens, if anywhere public. */
  destination?: ExternalDestination
}

export const PRODUCTS: ProductRecord[] = [
  {
    key: "loadhunter",
    name: "LoadHunter",
    role: "Opportunity engine",
    href: "/loadhunter",
    block: "#the-road-starts-with-the-next-load",
    job: "Turn load-board noise into your next best move.",
    user: "Dispatchers, owner-operators and carriers actively searching and evaluating loads.",
    jtbd: "I need better freight",
    next: "Explore LoadHunter",
    destination: { state: "pending", owed: "Chrome Web Store listing URL (§15.3)" },
  },
  {
    key: "hunttms",
    name: "huntTMS",
    role: "Execution core",
    href: "/hunttms",
    block: "#turn-the-booked-load-into-an-operating-plan",
    job: "Run the freight day without the spreadsheet handoffs.",
    user: "Carrier owners, operations leaders and dispatch teams evaluating a TMS.",
    jtbd: "I need to run loads",
    next: "See huntTMS",
  },
  {
    key: "huntdrive",
    name: "huntDRIVE",
    role: "Field network",
    href: "/huntdrive",
    block: "#keep-the-driver-and-office-on-the-same-mile",
    job: "Give drivers one clear next action-and dispatch the outcome.",
    user: "Carrier operations leaders and driver managers; secondary audience drivers.",
    jtbd: "I need drivers to update me",
    next: "See huntDRIVE",
    destination: { state: "pending", owed: "huntDRIVE Telegram link (§15.3)" },
  },
  {
    key: "huntpay",
    name: "huntPAY",
    role: "Cashflow engine",
    href: "/huntpay",
    block: "#close-the-load-without-opening-a-new-process",
    job: "Carry the load context all the way to payment.",
    user: "Carrier finance teams, owners and operations leaders responsible for invoicing and payroll.",
    jtbd: "I need invoices and settlements under control",
    next: "See huntPAY",
  },
  {
    key: "huntos",
    name: "huntOS",
    role: "Command layer",
    href: "/huntos",
    block: "#see-the-exceptions-before-they-become-calls",
    job: "See the operation through the exceptions that need you.",
    user: "Owners and operations executives seeking cross-operation visibility.",
    jtbd: "I need one view of the business",
    next: "Preview huntOS",
  },
]

/**
 * §10.2 - a platform capability, described here so no page can drift into
 * calling it a sixth product.
 */
export const INTELLIGENCE_LAYER = {
  name: "Hunt Intelligence Layer",
  kind: "platform capability" as const,
  href: "/platform",
  note: "Shared across the five products. Not a product of its own.",
} as const

export const productByKey = (key: ProductKey): ProductRecord => {
  const found = PRODUCTS.find((p) => p.key === key)
  if (!found) throw new Error(`No product ${key} in the registry`)
  return found
}

export const productByHref = (href: string): ProductRecord | undefined =>
  PRODUCTS.find((p) => p.href === href)

/** Product plus its ledger rows - what the menu and the product page render. */
export type ProductWithStatus = ProductRecord & { statuses: ClaimRecord[] }

export const PRODUCTS_WITH_STATUS: ProductWithStatus[] = PRODUCTS.map((p) => ({
  ...p,
  statuses: claimsFor(p.key),
}))

/** §15.3 - addresses still owed, for the pre-publication report. */
export const owedDestinations = (): { product: string; owed: string }[] =>
  PRODUCTS.filter((p) => p.destination?.state === "pending").map((p) => ({
    product: p.name,
    owed: (p.destination as { state: "pending"; owed: string }).owed,
  }))
