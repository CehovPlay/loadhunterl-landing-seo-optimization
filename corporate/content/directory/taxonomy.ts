/**
 * The filter taxonomy, exactly as the design draws it.
 *
 * Every list here is FMCSA's own vocabulary rather than ours - the freight
 * types are the SAFER cargo-carried classes, the entity types are the SAFER
 * entity codes, the safety ratings are the three FMCSA issues plus "not rated".
 * Keeping our labels identical to the source is what makes the import a
 * mapping rather than a translation, and it is what lets a broker who knows
 * SAFER recognise the filter.
 *
 * The design shows the freight list collapsed to ten with "Show less"; the
 * order below is the order it draws.
 */

import type { AuthorityKind, EntityType, OperationScope, SafetyRating } from "./types"

export const ENTITY_TYPES: { value: EntityType; label: string }[] = [
  { value: "broker", label: "Broker" },
  { value: "carrier", label: "Carrier" },
  { value: "shipper", label: "Shipper" },
  { value: "registrant", label: "Registrant" },
  { value: "freight-forwarder", label: "Freight forwarder" },
  { value: "iep", label: "International equipment provider" },
  { value: "cargo-tank", label: "Cargo tank" },
]

export const AUTHORITY_FILTERS: { value: AuthorityKind; label: string }[] = [
  { value: "carrier", label: "Active carrier" },
  { value: "broker", label: "Active broker" },
  { value: "contract", label: "Active contract" },
]

export const FREIGHT_TYPES: string[] = [
  "General freight",
  "Household goods",
  "Metal",
  "Motor vehicles",
  "Drive/tow away",
  "Logs, poles",
  "Building materials",
  "Mobile homes",
  "Machinery, large objects",
  "Fresh produce",
  "Liquids/gases",
  "Intermodal container",
  "Passengers",
  "Oilfield equipment",
  "Livestock",
  "Grain, feed, hay",
  "Coal/coke",
  "Meat",
  "Garbage/refuse",
  "U.S. mail",
  "Chemicals",
  "Commodities dry bulk",
  "Refrigerated food",
  "Beverages",
  "Paper products",
  "Utilities",
  "Farm supplies",
  "Construction",
  "Water well",
  "Other cargo",
]

/** How many the panel shows before "Show more". */
export const FREIGHT_VISIBLE = 10

export const OPERATIONS: { value: OperationScope; label: string }[] = [
  { value: "interstate", label: "Interstate" },
  { value: "intrastate", label: "Intrastate" },
  { value: "hazmat", label: "Hazmat" },
]

export const SAFETY_RATINGS: SafetyRating[] = ["Satisfactory", "Unsatisfactory", "Conditional"]

/** The buckets the two selects offer. Ranges, because exact counts change. */
export const FLEET_SIZES: { label: string; range: [number, number] }[] = [
  { label: "1-5 trucks", range: [1, 5] },
  { label: "6-20 trucks", range: [6, 20] },
  { label: "21-100 trucks", range: [21, 100] },
  { label: "101-500 trucks", range: [101, 500] },
  { label: "500+ trucks", range: [501, Number.MAX_SAFE_INTEGER] },
]

export const DRIVER_COUNTS: { label: string; range: [number, number] }[] = [
  { label: "1-5 drivers", range: [1, 5] },
  { label: "6-20 drivers", range: [6, 20] },
  { label: "21-100 drivers", range: [21, 100] },
  { label: "101-500 drivers", range: [101, 500] },
  { label: "500+ drivers", range: [501, Number.MAX_SAFE_INTEGER] },
]

/** The four SMS BASICs the profile prints, in the order it prints them. */
export const BASIC_LABELS = [
  "Unsafe driving",
  "HOS compliance",
  "Driver fitness",
  "Vehicle maintenance",
] as const
