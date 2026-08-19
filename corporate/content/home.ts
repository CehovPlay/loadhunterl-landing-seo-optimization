/**
 * Approved copy for the corporate homepage.
 *
 * Every string carries its clause in the TZ. Nothing on this page may be
 * written in a component: TZ §22.2 requires CTA labels and destinations to come
 * from one registry, and §46.2 requires the copy to be editable in the CMS
 * without touching code. This module is the pre-CMS stand-in for that registry.
 *
 * Canon decision (2026-08-19): the master spec wins over the per-page tab where
 * the two disagree. See ~/loadhunter-tz/README.md for the full conflict list.
 */

export const SITE_URL = "https://loadhunt.ai"

/* TZ §5.1 - global navigation. Every one of the five products is top level;
   none is nested under huntTMS. */
export const NAV = [
  { label: "Platform", href: "/platform" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/carriers" },
  { label: "Customers", href: "/customers" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
  { label: "Company", href: "/about" },
] as const

/* TZ §4.2 + §27.3. The homepage header carries the contextual install action,
   not a second label for the same intent. §5.3 "Start Free" is the generic
   header rule; §27.3 overrides it for this page. */
export const CTA = {
  install: { label: "Install LoadHunter - Free", href: "/loadhunter" },
  ecosystem: { label: "Watch the Ecosystem Come Together", href: "#the-load-journey" },
  platform: { label: "Explore the Platform", href: "/platform" },
  login: { label: "Log in", href: "/login" },
} as const

/* TZ §6.1 / §27.4 - hero, verbatim. */
export const HERO = {
  eyebrow: "Five Products. One Freight Intelligence System.",
  h1: "Run Your Entire Freight Operation - From Load Search to Payment.",
  sub: "LoadHunter brings load discovery, dispatch and transportation management, driver workflows, financial operations and business intelligence into one connected ecosystem.",
} as const

/* TZ §27.6 - the demo load passport. Direction, freight type, sample rate,
   distance and status, every value marked as an example. The same load is used
   in every scene below so the visitor can see the context being handed over. */
export const SAMPLE_LOAD = {
  origin: "Dallas, TX",
  destination: "Atlanta, GA",
  equipment: "Dry van",
  weight: "42,000 lb",
  pickup: "Aug 25, 08:00 CT",
  rate: "$2,180",
  loadedMiles: "762",
  deadheadMiles: "47",
  stops: "1",
  status: "Available",
} as const

/* TZ §27.5 - the five stops of the operating cycle, stated once, up front. */
export const CYCLE = [
  {
    step: "01",
    verb: "Find",
    product: "LoadHunter",
    role: "Opportunity engine",
    /* TZ §3.1 */
    outcome: "Turn the load board you already use into a faster decision system.",
    status: { label: "Live", tone: "live" },
    href: "/loadhunter",
  },
  {
    step: "02",
    verb: "Run",
    product: "huntTMS",
    role: "Execution core",
    /* TZ §3.2 */
    outcome: "Run every load from one live operating view.",
    status: { label: "Live", tone: "live" },
    href: "/hunttms",
  },
  {
    step: "03",
    verb: "Move",
    product: "huntDRIVE",
    role: "Field network",
    /* TZ §3.3 */
    outcome: "Keep every driver update connected to the load.",
    status: { label: "Telegram workflow live. Native app in progress.", tone: "progress" },
    href: "/huntdrive",
  },
  {
    step: "04",
    verb: "Get paid",
    product: "huntPAY",
    role: "Cashflow engine",
    /* TZ §3.4 */
    outcome: "Turn delivered freight into controlled cash flow.",
    status: { label: "Invoicing and payroll live. Factoring in progress.", tone: "progress" },
    href: "/huntpay",
  },
  {
    step: "05",
    verb: "Control",
    product: "huntOS",
    role: "Command layer",
    /* TZ §3.5 */
    outcome: "See the operation as one connected business.",
    status: { label: "Preview", tone: "preview" },
    href: "/huntos",
  },
] as const

/**
 * TZ §27.7 + §7.2 - stop 01.
 *
 * The rule that shapes this section: one load card in two states. The raw
 * result first, then the LoadHunter layer applied to the SAME card. Two
 * different loads would let the visitor miss what the product actually adds.
 *
 * Copy for the block body is the approved English from tab 01, block 1; the
 * button and destination are the master spec's (§27.7).
 */
export const STOP_ONE = {
  step: "01",
  kicker: "Find",
  h3: "Find stronger options before the market moves.",
  body: "LoadHunter surfaces relevant load opportunities inside the workflow dispatchers already use. Compare, score and act without rebuilding the day around another tab.",
  /* Each row is one thing the layer adds, with the reason it matters. TZ §7.2
     requires the RPM formula to be visible next to the figure, deadhead to be
     explained rather than shown as a bare number, and any field the product
     cannot actually source to say so. */
  layer: [
    {
      id: "rpm",
      label: "Revenue per mile",
      value: "$2.86",
      note: "$2,180 divided by 762 loaded miles",
    },
    {
      id: "deadhead",
      label: "Deadhead to pickup",
      value: "47 mi",
      note: "Adds to the trip, not to the rate",
    },
    {
      id: "route",
      label: "Route",
      value: "762 mi",
      note: "Dallas, TX to Atlanta, GA, one stop",
    },
    {
      id: "broker",
      label: "Broker record",
      value: "Not published",
      note: "Shown only where a permitted source has it",
    },
  ],
  action: "Draft the outreach message",
  /* TZ §7.2 - no auto-send is claimed anywhere on this page. */
  actionNote: "Prepares a message for you to send. Nothing is sent automatically.",
} as const

export const SAMPLE_NOTE = "Sample data"

/* ------------------------------------------------------------------ */
/*  Header and footer                                                  */
/*                                                                     */
/*  Shape is the extension landing's: the floating white pill nav and   */
/*  the dark footer band. Destinations come from the URL registry in    */
/*  TZ §2.2 to §2.9, groups from §5.4 and §26.4.                        */
/* ------------------------------------------------------------------ */

/* TZ §5.3 - the header keeps one compact sales path next to the primary
   action. "Build My Demo" is the approved /demo label (§35 of the CTA
   registry), so the sales path reuses it rather than inventing a synonym. */
export const DEMO_CTA = { label: "Build My Demo", href: "/demo" } as const

/**
 * TZ §5.4 + §26.4 - Products, Solutions, Resources, Company and Legal, with
 * Status, Trust, Accessibility, Privacy, Terms and Cookie Preferences all
 * present. The Products column is the one that carries statuses, because §5.4
 * asks for the five products with their current state and §42.2 forbids a
 * status badge that covers a product without saying what it covers.
 */
export const FOOTER_NAV = [
  {
    title: "Products",
    links: [
      { label: "LoadHunter", href: "/loadhunter" },
      { label: "huntTMS", href: "/hunttms" },
      { label: "huntDRIVE", href: "/huntdrive" },
      { label: "huntPAY", href: "/huntpay" },
      { label: "huntOS", href: "/huntos" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Carriers", href: "/carriers" },
      { label: "Owner-operators", href: "/owner-operators" },
      { label: "Fleets", href: "/fleets" },
      { label: "Dispatchers", href: "/dispatchers" },
      { label: "Drivers", href: "/drivers" },
      { label: "Brokers", href: "/brokers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resource center", href: "/resources" },
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Tools", href: "/tools" },
      { label: "Integrations", href: "/integrations" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Partners", href: "/partners" },
      { label: "Contact", href: "/contact" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie preferences", href: "/cookies" },
      { label: "Trust", href: "/trust" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Status", href: "/status" },
    ],
  },
] as const

/**
 * TZ §5.4 - product login destinations, kept away from the marketing CTAs.
 * One destination, because §2.8 makes /login the place where the product is
 * chosen; inventing per-product app URLs here would ship guesses.
 */
export const FOOTER_ACCESS = {
  title: "Product access",
  label: "Log in",
  href: "/login",
  note: "Choose your product after signing in.",
} as const

/* Public contacts, mirroring the ones the extension landing publishes. */
export const CONTACT = {
  email: "support@loadhunter.io",
  phone: "+1 312 878 9795",
  phoneHref: "+13128789795",
  region: "United States",
} as const

/* TZ §26.4 - the category statement plus the market and language line. */
export const FOOTER_STATEMENT =
  "One connected system for finding freight, running operations, keeping drivers moving, getting paid and seeing the business clearly."

export const FOOTER_REGION =
  "Built for trucking and freight operations worldwide. First commercial region: United States. Site language: US English."

export const NEWSLETTER = {
  title: "Get practical freight operations notes",
  body: "Monthly product updates, dispatch workflow guides and new feature notes.",
  cta: "Subscribe",
  placeholder: "Work email",
  success: "You're subscribed. Check your inbox to confirm.",
  error: "We couldn't subscribe this address. Please try again.",
  /* Honest state for the un-wired build. The landing's stub shows success
     without sending; on a page that also carries a privacy claim that is not
     acceptable, so an unconfigured form says so instead. */
  offline: "Newsletter signup is not connected yet. Email us and we'll add you.",
  consent: "By subscribing you agree to receive product emails. Unsubscribe at any time. ",
} as const

/** Trademark independence, carried over from the landing. */
export const TRADEMARK_DISCLAIMER =
  "LoadHunter is an independent product and is not affiliated with, endorsed by or sponsored by DAT Solutions, Truckstop, TruckSmarter or other third-party load-board providers. Product names and trademarks belong to their respective owners."

export const SOCIALS = [
  { label: "Telegram", href: "https://t.me/loadhunterextension" },
  { label: "Instagram", href: "https://www.instagram.com/loadhunter.io/" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UC5-wNvj8HpG-9fZgFa88SXw" },
  { label: "X", href: "https://x.com/load_hunt" },
] as const

/* Brand Registry (§14.3) has no legal entity yet, so the line carries the
   trading name only and the entity is added the moment the registry exists. */
export const COPYRIGHT = "© 2026 LoadHunter. All rights reserved."
