/**
 * The Trucking Directory domain, typed once.
 *
 * The shape follows the FMCSA record the design displays - SAFER Web fields for
 * identity and authority, SMS percentiles for safety - because the backend is
 * parsing that same source. Anything the site invents on top of it (our review
 * counts, the claimed flag) is marked as ours in the comments, so the import
 * cannot quietly overwrite a field it does not own.
 *
 * Every accessor in ./source.ts is async even though it reads a local array
 * today. That is the seam: when the parser is finished, `source.ts` swaps a
 * fetch in behind the same signatures and no page changes.
 */

export type AuthorityStatus = "Active" | "Inactive" | "Not authorized" | "Pending"

/** SAFER's three authority kinds. A company can hold any combination. */
export type AuthorityKind = "carrier" | "contract" | "broker"

export type Authority = {
  kind: AuthorityKind
  status: AuthorityStatus
  /** ISO date. Absent when the authority was never granted. */
  since?: string
}

export type EntityType =
  | "carrier"
  | "broker"
  | "shipper"
  | "registrant"
  | "freight-forwarder"
  | "iep"
  | "cargo-tank"

export type SafetyRating = "Satisfactory" | "Conditional" | "Unsatisfactory" | "Not rated"

export type OperationScope = "interstate" | "intrastate" | "hazmat"

/** One SMS BASIC: the percentile and the violation count behind it. */
export type Basic = {
  label: string
  /** 0-100. Higher is worse - it is a percentile against the peer group. */
  percentile: number
  total: number
}

export type Insurance = {
  docket: string
  type: string
  carrier: string
  policy: string
  /** ISO date the filing was recorded. */
  date: string
  coverage: number
  effectiveDate: string
  /** Null while the policy is current. */
  cancelDate: string | null
}

export type AuthorityEvent = {
  docket: string
  subNumber: string
  authType: string
  originalAction: string
  originalDate: string
  disposition: string | null
  dispositionDate: string | null
}

export type ReviewSource = "google" | "loadhunter"

export type Review = {
  id: string
  source: ReviewSource
  author: string
  /** "broker", "dispatcher" - who is speaking, where they said so. */
  role?: string
  rating: number
  body: string
  /** ISO date. The page prints a relative age from it. */
  date: string
  /** Ours, not FMCSA's: the booking behind the review is in our records. */
  verifiedBooking?: boolean
}

export type Company = {
  /** USDOT number. The primary key everywhere - it is the one FMCSA id that
      never changes when a company renames or re-files. */
  dot: string
  mc?: string
  name: string
  slug: string
  entity: EntityType[]
  address: { line: string; city: string; state: string; zip: string; country: "US" | "CA" }
  citySlug: string
  /** ISO date of the original filing. The page prints the elapsed time. */
  startedOn: string
  operatingStatus: string
  authorizedFor: string
  authorities: Authority[]
  powerUnits: number
  drivers: number
  /** Annual mileage as last reported. */
  mileage: number
  insuranceRequired: number
  bipd: number
  cargo: boolean
  bond: boolean
  freightTypes: string[]
  operations: OperationScope[]
  safetyRating: SafetyRating
  /** True when a roadside inspection is on file within 24 months. */
  inspected24mo: boolean
  basics: Basic[]
  accidentBasics: Basic[]
  outOfService: { label: string; inspections: number; rate: number }[]
  insurances: Insurance[]
  authorityHistory: AuthorityEvent[]
  reviews: Review[]
  rating: number
  contact: { phone?: string; email?: string; website?: string }
  /** Ours: the operator has claimed and verified the profile. */
  claimed: boolean
}

export type City = {
  slug: string
  name: string
  state: string
  /** How many companies the import holds for this city. */
  companies: number
}

/** What the filter panel produces and the listing consumes. */
export type DirectoryQuery = {
  city?: string
  search?: string
  entity?: EntityType[]
  authority?: AuthorityKind[]
  bipdMin?: number
  bipdMax?: number
  bond?: boolean
  cargo?: boolean
  freightTypes?: string[]
  operations?: OperationScope[]
  fleetSize?: [number, number]
  driverCount?: [number, number]
  inspected24mo?: boolean
  safetyRating?: SafetyRating[]
  hasPhone?: boolean
  hasEmail?: boolean
  page?: number
}

export type DirectoryPage<T> = {
  items: T[]
  total: number
  page: number
  perPage: number
}
