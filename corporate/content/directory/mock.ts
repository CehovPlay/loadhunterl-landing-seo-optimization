/**
 * Sample records, until the FMCSA import lands.
 *
 * Two rules held this file's shape:
 *
 *   1. Nothing here may read as a real carrier. The names are constructed from
 *      a fixed word list and every page that renders them prints
 *      `SAMPLE_NOTICE` above the content. §22.1 forbids a placeholder that
 *      reads as a fact, and a profile full of plausible DOT numbers is the most
 *      convincing placeholder the site could ship.
 *   2. It has to be deterministic. A static build that regenerates its data on
 *      every run produces a different page every deploy, which breaks caching,
 *      diffing and any screenshot check. So the generator is a seeded LCG and
 *      never calls Math.random or Date.now.
 *
 * NorthStar Freight LLC is the one hand-written record: it is the profile the
 * design draws, field for field, so the page can be compared against the frame.
 */

import type { City, Company, Basic } from "./types"

/* The city list and the counts are the design's own, frame 19135. */
export const CITIES: City[] = [
  { slug: "houston-tx", name: "Houston", state: "TX", companies: 39136 },
  { slug: "miami-fl", name: "Miami", state: "FL", companies: 32770 },
  { slug: "los-angeles-ca", name: "Los Angeles", state: "CA", companies: 23067 },
  { slug: "chicago-il", name: "Chicago", state: "IL", companies: 17415 },
  { slug: "orlando-fl", name: "Orlando", state: "FL", companies: 14030 },
  { slug: "dallas-tx", name: "Dallas", state: "TX", companies: 13300 },
  { slug: "fresno-ca", name: "Fresno", state: "CA", companies: 12624 },
  { slug: "hialeah-fl", name: "Hialeah", state: "FL", companies: 12438 },
  { slug: "las-vegas-nv", name: "Las Vegas", state: "NV", companies: 12352 },
  { slug: "bakersfield-ca", name: "Bakersfield", state: "CA", companies: 11871 },
  { slug: "phoenix-az", name: "Phoenix", state: "AZ", companies: 27415 },
  { slug: "san-antonio-tx", name: "San Antonio", state: "TX", companies: 24890 },
  { slug: "denver-co", name: "Denver", state: "CO", companies: 21336 },
  { slug: "atlanta-ga", name: "Atlanta", state: "GA", companies: 19752 },
  { slug: "seattle-wa", name: "Seattle", state: "WA", companies: 18104 },
  { slug: "portland-or", name: "Portland", state: "OR", companies: 16493 },
  { slug: "dayton-oh", name: "Dayton", state: "OH", companies: 2184 },
]

/* A linear congruential generator, so the same seed always builds the same
   directory. Numerical Recipes constants; the quality of the randomness does
   not matter, only that it is reproducible. */
function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

const FIRST = ["North", "Iron", "Cedar", "Summit", "Blue", "Range", "Gulf", "Pine", "Anchor", "Vista", "Harbor", "Copper"]
const SECOND = ["Star", "Ridge", "Line", "Haul", "Point", "Field", "Gate", "Creek", "Rock", "Trail", "Bend", "Hill"]
const THIRD = ["Freight", "Logistics", "Transport", "Carriers", "Trucking", "Express"]
const SUFFIX = ["LLC", "Inc", "Co"]

const STREETS = ["Industrial Pkwy", "Commerce Dr", "Needmore Rd", "Terminal Way", "Depot St", "Frontage Rd"]

const FREIGHT_POOL = [
  "General freight",
  "Refrigerated food",
  "Building materials",
  "Machinery, large objects",
  "Metal",
  "Beverages",
  "Chemicals",
  "Motor vehicles",
]

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

const basics = (rand: () => number): Basic[] => [
  { label: "Unsafe driving", percentile: Math.round(rand() * 700) / 10, total: 4 + Math.floor(rand() * 60) },
  { label: "HOS compliance", percentile: Math.round(rand() * 900) / 10, total: 4 + Math.floor(rand() * 80) },
  { label: "Driver fitness", percentile: Math.round(rand() * 400) / 10, total: 1 + Math.floor(rand() * 20) },
  { label: "Vehicle maintenance", percentile: Math.round(rand() * 800) / 10, total: 20 + Math.floor(rand() * 300) },
]

/** The carrier the design draws, transcribed field for field from frame 19129. */
const NORTHSTAR: Company = {
  dot: "2043252",
  mc: "823512",
  name: "NorthStar Freight LLC",
  slug: "northstar-freight-llc-2043252",
  entity: ["carrier"],
  address: { line: "4210 Needmore Rd", city: "Dayton", state: "OH", zip: "45424", country: "US" },
  citySlug: "dayton-oh",
  startedOn: "1988-01-04",
  operatingStatus: "Authorized for property",
  authorizedFor: "Property",
  authorities: [
    { kind: "carrier", status: "Active", since: "1993-07-07" },
    { kind: "contract", status: "Active", since: "1993-07-07" },
    { kind: "broker", status: "Not authorized" },
  ],
  powerUnits: 118,
  drivers: 132,
  mileage: 17663536,
  insuranceRequired: 1000000,
  bipd: 5000000,
  cargo: true,
  bond: true,
  freightTypes: ["General freight", "Refrigerated food", "Building materials"],
  operations: ["interstate", "hazmat"],
  safetyRating: "Satisfactory",
  inspected24mo: true,
  basics: [
    { label: "Unsafe driving", percentile: 0, total: 42 },
    { label: "HOS compliance", percentile: 49.2, total: 56 },
    { label: "Driver fitness", percentile: 13.5, total: 4 },
    { label: "Vehicle maintenance", percentile: 27.7, total: 280 },
  ],
  accidentBasics: [
    { label: "HOS compliance", percentile: 57.4, total: 0 },
    { label: "Vehicle maintenance", percentile: 26.2, total: 0 },
    { label: "Driver fitness", percentile: 13.1, total: 0 },
  ],
  outOfService: [
    { label: "Vehicle", inspections: 94, rate: 8.5 },
    { label: "Driver", inspections: 155, rate: 1.9 },
  ],
  insurances: [
    {
      docket: "MC111401",
      type: "BIPD / Primary",
      carrier: "Great West Casualty Co.",
      policy: "GWP37571A",
      date: "2026-03-23",
      coverage: 5000000,
      effectiveDate: "2026-03-23",
      cancelDate: null,
    },
    {
      docket: "MC111401",
      type: "BIPD / Primary",
      carrier: "Great West Casualty Co.",
      policy: "GWP37571A",
      date: "2026-03-23",
      coverage: 1000000,
      effectiveDate: "2026-03-23",
      cancelDate: null,
    },
  ],
  authorityHistory: [
    { docket: "MC266356", subNumber: "1", authType: "Motor property common carrier", originalAction: "Dismissed", originalDate: "2006-02-08", disposition: null, dispositionDate: null },
    { docket: "MC266356", subNumber: "1", authType: "Contract", originalAction: "Involuntary revocation", originalDate: "2006-02-14", disposition: "Discontinued revocation", dispositionDate: "2006-02-22" },
    { docket: "MC266356", subNumber: "0", authType: "Motor property contract carrier", originalAction: "Granted", originalDate: "2006-02-08", disposition: "Revoke", dispositionDate: "2010-07-22" },
    { docket: "MC266356", subNumber: "0", authType: "Property broker", originalAction: "Granted", originalDate: "2006-02-08", disposition: null, dispositionDate: null },
    { docket: "MC778413", subNumber: "2", authType: "Motor property common carrier", originalAction: "Reinstated", originalDate: "2006-02-08", disposition: "Revoked", dispositionDate: "2021-07-14" },
    { docket: "FF230956", subNumber: "N/A", authType: "Freight forwarder", originalAction: "Granted", originalDate: "2023-02-05", disposition: "Inactive", dispositionDate: null },
  ],
  reviews: [
    {
      id: "r1",
      source: "google",
      author: "Mike R.",
      rating: 5,
      body: "Paid in 2 days, great communication, driver on time.",
      date: "2026-08-06",
    },
    {
      id: "r2",
      source: "loadhunter",
      author: "J. Alvarez",
      role: "broker",
      rating: 5,
      body: "Booked 3 loads through LoadHunter, zero issues, driver always reachable.",
      date: "2026-07-20",
      verifiedBooking: true,
    },
  ],
  rating: 4.4,
  contact: {
    phone: "802423525",
    email: "dispatch@northstarfreight.com",
    website: "northstarfreight.com",
  },
  claimed: true,
}

function build(): Company[] {
  const rand = seeded(20260820)
  const out: Company[] = [NORTHSTAR]

  for (let i = 0; i < 96; i++) {
    const city = CITIES[i % CITIES.length]
    const name = [
      FIRST[Math.floor(rand() * FIRST.length)] + SECOND[Math.floor(rand() * SECOND.length)],
      THIRD[Math.floor(rand() * THIRD.length)],
      SUFFIX[Math.floor(rand() * SUFFIX.length)],
    ].join(" ")
    const dot = String(1000000 + Math.floor(rand() * 8999999))
    const isBroker = rand() < 0.22
    const powerUnits = 1 + Math.floor(rand() ** 2 * 400)
    const startYear = 1988 + Math.floor(rand() * 34)

    out.push({
      dot,
      mc: rand() < 0.85 ? String(100000 + Math.floor(rand() * 899999)) : undefined,
      name,
      slug: `${slugify(name)}-${dot}`,
      entity: isBroker ? ["broker"] : rand() < 0.15 ? ["carrier", "broker"] : ["carrier"],
      address: {
        line: `${100 + Math.floor(rand() * 8900)} ${STREETS[Math.floor(rand() * STREETS.length)]}`,
        city: city.name,
        state: city.state,
        zip: String(10000 + Math.floor(rand() * 89999)),
        country: "US",
      },
      citySlug: city.slug,
      startedOn: `${startYear}-0${1 + Math.floor(rand() * 9)}-1${Math.floor(rand() * 9)}`,
      operatingStatus: rand() < 0.9 ? "Authorized for property" : "Out of service",
      authorizedFor: "Property",
      authorities: [
        { kind: "carrier", status: isBroker ? "Not authorized" : "Active", since: `${startYear + 1}-04-11` },
        { kind: "contract", status: rand() < 0.6 ? "Active" : "Inactive", since: `${startYear + 2}-06-02` },
        { kind: "broker", status: isBroker ? "Active" : rand() < 0.2 ? "Active" : "Not authorized" },
      ],
      powerUnits,
      drivers: powerUnits + Math.floor(rand() * powerUnits * 0.4),
      mileage: Math.floor(powerUnits * (80000 + rand() * 90000)),
      insuranceRequired: 1000000,
      bipd: [750000, 1000000, 5000000][Math.floor(rand() * 3)],
      cargo: rand() < 0.8,
      bond: rand() < 0.35,
      freightTypes: FREIGHT_POOL.filter(() => rand() < 0.35).slice(0, 4),
      operations: [
        ...(rand() < 0.85 ? (["interstate"] as const) : []),
        ...(rand() < 0.4 ? (["intrastate"] as const) : []),
        ...(rand() < 0.18 ? (["hazmat"] as const) : []),
      ],
      safetyRating:
        rand() < 0.55 ? "Satisfactory" : rand() < 0.8 ? "Not rated" : rand() < 0.95 ? "Conditional" : "Unsatisfactory",
      inspected24mo: rand() < 0.7,
      basics: basics(rand),
      accidentBasics: basics(rand).slice(0, 3),
      outOfService: [
        { label: "Vehicle", inspections: Math.floor(rand() * 200), rate: Math.round(rand() * 300) / 10 },
        { label: "Driver", inspections: Math.floor(rand() * 260), rate: Math.round(rand() * 90) / 10 },
      ],
      insurances: [],
      authorityHistory: [],
      reviews: [],
      rating: Math.round((3 + rand() * 2) * 10) / 10,
      contact: {
        phone: rand() < 0.7 ? `1${String(2000000000 + Math.floor(rand() * 7999999999)).slice(0, 9)}` : undefined,
        email: rand() < 0.5 ? `dispatch@${slugify(name.split(" ")[0])}.com` : undefined,
        website: rand() < 0.6 ? `${slugify(name.split(" ")[0])}.com` : undefined,
      },
      claimed: rand() < 0.15,
    })
  }
  return out
}

export const COMPANIES: Company[] = build()
