/**
 * Integration Registry - TZ §14.3 and §36.2.
 *
 * §36.2 sets the card: name, category, which products use it, what data moves
 * and in which direction, connection requirements, confirmed status with a
 * check date, and an action button only where the action really works.
 *
 * Two records, and only two, because the document names exactly two third-party
 * systems: Stripe (tab 47, checkout) and Telegram (the huntDRIVE workflow,
 * marked Live throughout). No ELD vendor, load board or accounting package is
 * named anywhere in 48 tabs, and §18.3 puts partner logos behind approval, so
 * inventing a catalogue here would ship claims about companies we have no
 * agreement with. /integrations says the catalogue is being verified instead.
 *
 * The `action` field is what §36.2's last line becomes in code: a card cannot
 * render a Connect button unless the registry carries a working destination.
 */

import type { ProductKey } from "./status"
import type { StatusTerm } from "./status"

export type IntegrationCategory = "eld" | "load-source" | "finance" | "communications" | "data"

export const CATEGORY_LABEL: Record<IntegrationCategory, string> = {
  eld: "ELD and telematics",
  "load-source": "Load sources",
  finance: "Finance and payments",
  communications: "Communications",
  data: "Data and reporting",
}

export type DataFlow = {
  /** The object that moves, in the visitor's words. */
  object: string
  direction: "in" | "out" | "both"
  /** How often. §36.2 asks for cadence, not just direction. */
  cadence: string
}

export type IntegrationAction =
  | { kind: "connect"; href: string }
  | { kind: "documentation"; href: string }
  | { kind: "request" }

export type IntegrationRecord = {
  id: string
  name: string
  category: IntegrationCategory
  /** Which of the five products use it. */
  products: ProductKey[]
  flows: DataFlow[]
  /** §36.2 - what has to be true before it can be connected. */
  prerequisites: string[]
  /** §36.2 uses the governed vocabulary; Requestable is its own case below. */
  status: StatusTerm
  owner: string | null
  verifiedAt: string
  /** Only present where the action actually works today. */
  action?: IntegrationAction
}

export const INTEGRATIONS: IntegrationRecord[] = [
  {
    id: "telegram",
    name: "Telegram",
    category: "communications",
    products: ["huntdrive"],
    flows: [
      { object: "Driver task and status update", direction: "both", cadence: "On each action" },
      { object: "Proof of delivery photo", direction: "in", cadence: "On delivery" },
    ],
    prerequisites: ["Driver has a Telegram account", "Dispatcher invites the driver to the workflow"],
    status: "Live",
    owner: null,
    verifiedAt: "2026-08-19",
    /* No `action`: §15.3 has not handed over the verified bot address. */
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "finance",
    products: [],
    flows: [
      { object: "Checkout session and subscription state", direction: "both", cadence: "On purchase and on webhook" },
    ],
    prerequisites: ["An approved plan exists in the Commercial Registry"],
    status: "In Progress",
    owner: null,
    verifiedAt: "2026-08-19",
  },
]

/**
 * Categories the page lists as open to requests.
 *
 * §36.2's fourth status, Requestable, is not a capability claim - it says we
 * will talk about it - so it lives here rather than in the Status Ledger, which
 * §3.6 reserves for what the product does.
 */
export const REQUESTABLE_CATEGORIES: IntegrationCategory[] = ["eld", "load-source", "data"]

export const integrationsBy = (category: IntegrationCategory): IntegrationRecord[] =>
  INTEGRATIONS.filter((i) => i.category === category)

/**
 * §36.2 - a thin filter combination must not be indexable, while the base page
 * must be. One category is a real page; category plus anything else is not.
 */
export const isIndexableFilter = (params: Record<string, string | string[] | undefined>): boolean =>
  Object.keys(params).filter((k) => params[k] !== undefined).length <= 1
