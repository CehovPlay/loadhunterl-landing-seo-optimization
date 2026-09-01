/**
 * Approved copy for the directory, transcribed from the Figma frames
 * (Landing Page, `zt7S0UIB6gvsBEl7L4xNBt`, section "Section 2 - Light theme",
 * frames 19129-19135). Verbatim, including the sentence that ends the FAQ
 * intro without a full stop.
 *
 * Two notes for whoever reviews this before launch:
 *
 *   - The headline figures - 150,000+ companies, 110,000+ verified carriers -
 *     are claims. §3.6 blocks a claim without an owner, a source and a check
 *     date, so they are carried here with `unverified: true` and the pages
 *     render them from `STATS` only while that flag is honest about it. The
 *     import will produce the real counts.
 *   - FAQ answer 4 names "LoadConnect", which is not one of the five products
 *     in the Product Registry. Left verbatim rather than silently renamed; it
 *     is listed in `scripts/publishable.mts` output as a name to settle.
 */

export const HUB = {
  h1: "Find, check out, and rate trucking companies",
  supporting:
    "The most trusted directory to find trucking companies, verify authority, monitor changes, read reviews and export high-quality lead lists.",
  searchPlaceholder: "Search by name, MC or DOT",
  searchCta: "Search",
  citiesH2: "Look for a company that fits what you need.",
  citiesSupporting:
    "Looking for a certain kind of trucking company? You can filter your search by city, state, equipment type, fleet size, how long they've been in business, insurance status, and safety or fraud ratings.",
} as const

/**
 * The four figures under the search box. `unverified` is not decoration: the
 * page prints the count as a claim in need of a source until the import
 * replaces it, which is what §3.6 requires and what stops a design placeholder
 * from becoming a published number.
 */
export const STATS = [
  { value: "150,000+", label: "Companies", unverified: true },
  { value: "110,000+", label: "Verified carriers", unverified: true },
  { value: "50,000+", label: "Company reviews", unverified: true },
  { value: "24/7", label: "Changes monitored", unverified: true },
] as const

export const CLAIM = {
  title: "Hey, do you have a DOT or MC number?",
  body: "Your company is probably already on the list! Just claim your profile to update your contacts, add some branding like your logo and description, respond to reviews, and start getting leads.",
  primary: "Claim profile",
  secondary: "Contact us",
} as const

export const FAQ_INTRO = {
  h2: "Frequently Asked Questions",
  body: "Access a wealth of information and resources to ensure you find the solutions you need quickly and effectively, empowering you to make informed decisions Contact us.",
} as const

export const FAQ: { q: string; a: string }[] = [
  {
    q: "How does LoadHunter check out the trucking companies in the directory?",
    a: "LoadHunter's trucking directory pulls in real-time FMCSA data, safety scores, inspection records, and authority status to check out each trucking company. Every carrier lookup updates automatically so you can book with confidence.",
  },
  {
    q: "Can I check for updates on all the trucking companies I work with using the platform?",
    a: "Yep! You can follow any trucking company and get updates on their safety or compliance info, making it super easy to keep tabs on your whole truck company list.",
  },
  {
    q: "Does the directory have local trucking companies too, or just the big national ones?",
    a: "The directory covers all trucking companies - from small local outfits to big national carriers - giving brokers a full picture of available capacity everywhere.",
  },
  {
    q: "Can I use the trucking company directory to see what truck capacity is available?",
    a: "For sure. Besides showing trucking company names and safety info, the directory links up with LoadConnect's real-time capacity tools, so you can find and book trucks across the USA and Canada.",
  },
  {
    q: "Can I look up trucking companies in the USA and Canada based on equipment type or where they operate?",
    a: "Absolutely. You can filter trucking companies across the USA and Canada by equipment type, preferred routes, operating range, and region - helping brokers quickly find the best carriers for the job.",
  },
]

/**
 * The FMCSA attribution, verbatim from frame 19129. It is the page's legal
 * position on third-party data and is not editable copy: §18.3 puts anything
 * that changes it behind legal review.
 */
export const DISCLAIMER =
  "The company profiles featured here are compiled by LoadHunter from publicly accessible data provided by the Federal Motor Carrier Safety Administration (FMCSA), including resources like SAFER Web and the FMCSA Safety Measurement System (SMS). Although we strive to keep the information accurate and current, LoadHunter cannot assure the completeness or reliability of the data shown. We recommend that users verify any essential information directly with the FMCSA or the respective carrier. LoadHunter is not affiliated with, endorsed by, or representing any of the carriers listed here, and does not offer services for these companies. LoadHunter accepts no responsibility or legal liability for any inaccuracies, omissions, or decisions made based on this information."

export const PROFILE = {
  contactHeading: "Contact - lead goes directly to carrier",
  quoteCta: "Get a Quote",
  addReview: "Add review",
  suggestEdit: "Suggest an edit",
  claimPrompt: "Own this company? Claim profile",
  authorityTimeline: "Authority timeline - FMCSA",
  networkSource: "LoadHunter network - auto-collected",
  sections: {
    overview: "Company overview",
    insurances: "Insurances",
    history: "Authority history",
    reviews: "Reviews",
    safety: "Safety violations",
    accidents: "Accident reports",
    outOfService: "Out-of-service rate",
  },
} as const

/**
 * The empty states, one per panel. The design draws a separate frame for each
 * because "no data" and "no data yet" are different sentences: FMCSA genuinely
 * publishes nothing for some carriers, and saying "none" there would be a claim
 * we cannot make.
 */
export const EMPTY = {
  company: "No company matches that DOT or MC number in the current import.",
  overview: "FMCSA publishes no operating profile for this carrier.",
  authority: "No authority on file.",
  insurance: "No insurance filing on file.",
  insurances: "No insurance filings in the current import.",
  history: "No authority history in the current import.",
  reviews: "No reviews yet. Be the first to describe working with this carrier.",
  safety: "No safety measurement data. A carrier needs recent inspections before SMS scores it.",
  accidents: "No accident reports on file.",
  outOfService: "No inspections on file in the last 24 months.",
  results: "No companies match these filters.",
  resultsHint: "Try widening the insurance range, or clearing the freight type.",
} as const

/**
 * The banner every directory page carries while the import is not connected.
 * §22.1 forbids a placeholder that reads as a fact, and a company profile full
 * of invented figures is the most convincing placeholder on the site.
 */
export const SAMPLE_NOTICE = {
  title: "Sample data",
  body: "The FMCSA import is not connected yet. Every company, figure and review on this page is an example of the record shape, not a real carrier.",
} as const
