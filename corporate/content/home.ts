/**
 * Approved copy for the corporate homepage - and only this page.
 *
 * The registries §14.3 requires used to live here too, which meant a component
 * that wanted a phone number imported the homepage. They now sit in
 * `content/registry`, and this file holds what tab 01 alone says.
 *
 * SOURCE OF TRUTH: ~/loadhunter-tz/tabs/01-x.md, the page's own full spec.
 * Every visitor-facing string below that the tab prints as "точный контент" or
 * "Точный текст" is reproduced verbatim, hyphens and curly apostrophes
 * included. Nothing on this page is written in a component: TZ §22.2 requires
 * CTA labels and destinations to come from one registry, and §46.2 requires the
 * copy to be editable in the CMS without touching code. This module is the
 * pre-CMS stand-in for that registry.
 *
 * Canon decision (2026-08-19, revised): where tab 01 and master §27 disagree,
 * the page tab wins for this page. That reverses the earlier call and changes
 * the hero copy, both hero CTAs, the block sequence, the FAQ and the metadata.
 * The master's variants are listed in ~/loadhunter-tz/README.md, conflict 1;
 * they are still the owner's call, and nothing here is a merge of the two.
 *
 * Where a block's "Точный текст" is an instruction to the builder rather than
 * visitor copy (blocks 6, 7, 8 and FAQ answer 2), the instruction is carried
 * out with material from governed sources - the status ledger, the JTBD routing
 * in master §2.3, the audience lines in the product tabs - instead of being
 * paraphrased into marketing prose.
 */

import { CLAIMS, claimProvenance } from "./registry"

/* ------------------------------------------------------------------ */
/*  CTA registry for this page (tab 01 + cta-registry.md row 01)       */
/* ------------------------------------------------------------------ */

export const CTA = {
  primary: { label: "Start with LoadHunter - Free", href: "/loadhunter" },
  secondary: { label: "Build My Operating Stack", href: "#choose-your-entry-point" },
  customers: { label: "See Customer Workflows", href: "/customers" },
  login: { label: "Log in", href: "/login" },
  /* TZ §5.3 - the header keeps one compact sales path next to the primary
     action. "Build My Demo" is the approved /demo label (registry row 35). */
  demo: { label: "Build My Demo", href: "/demo" },
  status: { label: "View Current Status", href: "/status" },
} as const

/* Hero, verbatim from tab 01, "Hero - точный контент". */
export const HERO = {
  /* The tab requires a product/category label in the first viewport but does
     not write one, so this is the category master §1.1 defines, verbatim,
     rather than a phrase invented here. */
  label: "AI-powered Freight Operations Ecosystem",
  h1: "Run freight as one connected operation.",
  sub: "Five focused products. One LoadHunter operating system. Start with the tool you need today and connect the rest when your operation is ready.",
  microcopy: "See current availability before you commit.",
} as const

/* TZ §27.6 - the demo load passport. Direction, freight type, sample rate,
   distance and status, every value marked as an example. The same load is used
   in every scene below so the visitor can see the context being handed over. */
export const SAMPLE_LOAD = {
  id: "LH-4471",
  origin: "Dallas, TX",
  destination: "Atlanta, GA",
  equipment: "Dry van",
  weight: "42,000 lb",
  pickup: "Aug 25, 08:00 CT",
  delivery: "Aug 26, 15:00 ET",
  rate: "$2,180",
  loadedMiles: "762",
  deadheadMiles: "47",
  stops: "1",
  status: "Available",
} as const

export const SAMPLE_NOTE = "Sample data"

/* ------------------------------------------------------------------ */
/*  The eight blocks (tab 01, "Пошаговая структура страницы")          */
/*                                                                     */
/*  title - the block heading, rendered H2 per the tab's own rule      */
/*          ("H2 для системных разделов; H3 для смысловых блоков")     */
/*  h3    - the tab's H3, verbatim                                     */
/*  body  - the tab's "Точный текст", verbatim where it is visitor     */
/*          copy; blocks 6-8 carry an instruction instead, so their    */
/*          body is omitted here and executed in the component         */
/*  cta   - the tab's CTA, verbatim, destination from the URL registry */
/* ------------------------------------------------------------------ */

export const BLOCKS = {
  one: {
    n: "01",
    stop: "Find",
    id: "the-road-starts-with-the-next-load",
    title: "The road starts with the next load",
    h3: "Find stronger options before the market moves.",
    body: "LoadHunter surfaces relevant load opportunities inside the workflow dispatchers already use. Compare, score and act without rebuilding the day around another tab.",
    cta: { label: "Explore LoadHunter", href: "/loadhunter" },
  },
  two: {
    n: "02",
    stop: "Run",
    id: "turn-the-booked-load-into-an-operating-plan",
    title: "Turn the booked load into an operating plan",
    h3: "Dispatch without the spreadsheet handoff.",
    body: "huntTMS moves the selected load into a live dispatch workflow with drivers, equipment, documents and status in one operational view.",
    cta: { label: "See huntTMS", href: "/hunttms" },
  },
  three: {
    n: "03",
    stop: "Hand off",
    id: "keep-the-driver-and-office-on-the-same-mile",
    title: "Keep the driver and office on the same mile",
    h3: "Updates that move the operation forward.",
    body: "huntDRIVE gives drivers a focused action layer while dispatch sees the operational consequence-not another stream of disconnected messages.",
    cta: { label: "See huntDRIVE", href: "/huntdrive" },
  },
  four: {
    n: "04",
    stop: "Get paid",
    id: "close-the-load-without-opening-a-new-process",
    title: "Close the load without opening a new process",
    h3: "From delivered to ready-to-pay.",
    body: "huntPAY connects invoicing and payroll workflows to the completed load, preserving the operational context finance needs.",
    cta: { label: "See huntPAY", href: "/huntpay" },
  },
  five: {
    n: "05",
    stop: "Command",
    id: "see-the-exceptions-before-they-become-calls",
    title: "See the exceptions before they become calls",
    h3: "One command layer across the operation.",
    body: "huntOS is the unifying control layer: it prioritizes exceptions and connects decisions across LoadHunter, huntTMS, huntDRIVE and huntPAY according to verified product status.",
    cta: { label: "Preview huntOS", href: "/huntos" },
  },
  six: {
    n: "06",
    id: "choose-your-entry-point",
    title: "Choose your entry point",
    h3: "Start with one product. Keep the system advantage.",
    cta: { label: "Build My Operating Stack", href: "#choose-your-entry-point" },
  },
  seven: {
    n: "07",
    id: "proof-before-promise",
    title: "Proof before promise",
    h3: "Show the workflow, not marketing adjectives.",
    cta: { label: "See Customer Workflows", href: "/customers" },
  },
  eight: {
    n: "08",
    id: "the-operating-system-is-the-destination",
    title: "The operating system is the destination",
    h3: "One data trail. Fewer operational handoffs.",
    cta: { label: "Build My Operating Stack", href: "#choose-your-entry-point" },
  },
} as const

/* ------------------------------------------------------------------ */
/*  Block 1 proof - the LoadHunter decision layer (TZ §7.2 / §27.7)    */
/*                                                                     */
/*  One load result in two states, never two loads: the visitor has to */
/*  be able to credit the analysis rather than the load. Each row       */
/*  carries its own reason - §7.2 wants the RPM formula visible beside  */
/*  the figure, deadhead explained rather than asserted, and any field  */
/*  the product cannot legitimately source to say so.                  */
/* ------------------------------------------------------------------ */

export const BOARD_ROWS = [
  { lane: "Dallas, TX to Memphis, TN", rate: "$1,240", miles: "452", match: false },
  { lane: "Dallas, TX to Atlanta, GA", rate: "$2,180", miles: "762", match: true },
  { lane: "Dallas, TX to Oklahoma City, OK", rate: "$690", miles: "206", match: false },
] as const

export const LOADHUNTER_LAYER = [
  { id: "rpm", label: "Revenue per mile", value: "$2.86", note: "$2,180 divided by 762 loaded miles" },
  { id: "deadhead", label: "Deadhead to pickup", value: "47 mi", note: "Adds to the trip, not to the rate" },
  { id: "route", label: "Route", value: "762 mi", note: "Dallas, TX to Atlanta, GA, one stop" },
  { id: "broker", label: "Broker record", value: "Not published", note: "Shown only where a permitted source has it" },
] as const

export const LOADHUNTER_ACTION = {
  label: "Draft the outreach message",
  /* §7.2 - no auto-send is claimed anywhere on this page. */
  note: "Prepares a message for you to send. Nothing is sent automatically.",
} as const

/* Block 2 proof - the dispatch board row the load becomes (TZ §27.8:
   assignee, next step, timing, exception and documents). */
export const DISPATCH_BOARD = {
  columns: ["Load", "Driver", "Equipment", "Documents", "Status"],
  rows: [
    { load: "LH-4468", driver: "M. Alvarez", equipment: "Dry van 118", documents: "3 of 3", status: "Delivered" },
    { load: "LH-4470", driver: "R. Okafor", equipment: "Reefer 204", documents: "2 of 3", status: "In transit" },
  ],
  arriving: {
    load: "LH-4471",
    driver: "D. Whitfield",
    equipment: "Dry van 126",
    documents: "1 of 3",
    status: "Assigned",
  },
  detail: [
    { label: "Assigned to", value: "D. Whitfield" },
    { label: "Next step", value: "Confirm pickup appointment" },
    { label: "Due", value: "Aug 24, 17:00 CT" },
    { label: "Open exception", value: "Rate confirmation not signed" },
  ],
} as const

/* Block 3 proof - the driver lane. One action at a time on the phone, the
   operational consequence on the office panel. Order is the trip order. */
export const DRIVER_STEPS = [
  {
    action: "Confirm assignment",
    office: "Assigned",
    at: "Aug 24, 16:40 CT",
    detail: "Dispatch stops chasing the confirmation call.",
  },
  {
    action: "Arrived at pickup",
    office: "At pickup",
    at: "Aug 25, 07:52 CT",
    detail: "The detention clock starts from the driver's own action.",
  },
  {
    action: "Loaded and rolling",
    office: "In transit",
    at: "Aug 25, 09:35 CT",
    detail: "Check calls are answered by the record, not by the driver.",
  },
  {
    action: "Send proof of delivery",
    office: "Delivered, POD attached",
    at: "Aug 26, 15:08 ET",
    detail: "Finance can start closeout the same hour.",
  },
] as const

/* Block 4 proof - proof of delivery becoming an invoice timeline. Amounts come
   from the sample load only; §27.10 forbids anything else. Each state names the
   owner and the evidence, per tab 06. */
export const PAY_TIMELINE = [
  { step: "Delivered", owner: "Driver", evidence: "Arrival confirmed in huntDRIVE", amount: "" },
  { step: "POD attached", owner: "Driver", evidence: "Signed bill of lading", amount: "" },
  { step: "Invoice created", owner: "Finance", evidence: "Rate confirmation and POD", amount: "$2,180" },
  { step: "Invoice sent", owner: "Finance", evidence: "Broker billing contact", amount: "$2,180" },
  { step: "Payment received", owner: "Finance", evidence: "Bank reconciliation", amount: "" },
] as const

/* Block 5 proof - what a command layer surfaces first: exceptions, each with
   the product the signal comes from. */
export const EXCEPTIONS = [
  { title: "Rate confirmation not signed", source: "huntTMS", load: "LH-4471", age: "2 h" },
  { title: "Driver hours run out before the delivery window", source: "huntDRIVE", load: "LH-4470", age: "40 min" },
  { title: "Invoice unpaid past terms", source: "huntPAY", load: "LH-4462", age: "6 d" },
] as const

/* ------------------------------------------------------------------ */
/*  Block 6 - the route selector (tab 01: role, urgent job, team size)  */
/*                                                                     */
/*  Option wording is governed, not invented: roles are the page        */
/*  passport's audience list, jobs are the JTBD routing sentences in    */
/*  master §2.3, sizes are the priority segments in master §2.2.        */
/* ------------------------------------------------------------------ */

export const SELECTOR = {
  role: {
    label: "Role",
    options: [
      { id: "carrier", label: "Carrier" },
      { id: "broker", label: "Broker" },
      { id: "dispatch", label: "Dispatch" },
      { id: "driver", label: "Driver" },
      { id: "finance", label: "Finance leader" },
    ],
  },
  job: {
    label: "Urgent job",
    options: [
      { id: "loadhunter", label: "I need better freight" },
      { id: "hunttms", label: "I need to run loads" },
      { id: "huntdrive", label: "I need drivers to update me" },
      { id: "huntpay", label: "I need invoices and settlements under control" },
      { id: "huntos", label: "I need one view of the business" },
    ],
  },
  size: {
    label: "Team size",
    options: [
      { id: "owner", label: "Owner-operator" },
      { id: "small", label: "Small carrier" },
      { id: "growing", label: "Growing fleet" },
    ],
  },
} as const

/* Block 7 - what may appear as proof, and what may not. §27.14: until approved
   material exists, the page shows an honest demonstration of the process and
   says so, rather than inventing figures, logos or quotes. */
export const PROOF_ITEMS = [
  {
    kind: "Product screens",
    title: "The four workflows on this page",
    body: "Every panel above is the real field set of the shipped workflow, filled with clearly labeled sample data.",
    note: "Sample data. Not a market rate and not a customer record.",
    href: "#the-road-starts-with-the-next-load",
    ready: true,
  },
  {
    kind: "Status matrix",
    title: "What is available right now",
    body: "Availability for every product and connected capability, rendered from the status ledger.",
    note: claimProvenance(CLAIMS[0]),
    href: CTA.status.href,
    ready: true,
  },
  {
    kind: "Customer proof",
    title: "Named customer workflows",
    body: "Named customers, quotes and outcome figures are published only with written approval and a verified source.",
    note: "No approved customer proof is published yet.",
    href: CTA.customers.href,
    ready: false,
  },
  {
    kind: "Annotated clips",
    title: "Short workflow recordings",
    body: "Recorded passes through the dispatch day, the driver lane and load-to-cash, annotated step by step.",
    note: "Not published yet. Recordings are captured from the shipped build only.",
    href: CTA.demo.href,
    ready: false,
  },
] as const

/* Block 8 - one data trail. Each handoff names the event, the product it
   happens in and the role it reaches next. Nothing here claims automation
   beyond what the ledger marks Live. */
export const OS_TRAIL = [
  { event: "Load selected", product: "LoadHunter", reaches: "Dispatch", carries: "Lane, rate, miles, broker contact" },
  { event: "Load assigned", product: "huntTMS", reaches: "Driver", carries: "Pickup window, equipment, documents" },
  { event: "Delivery confirmed", product: "huntDRIVE", reaches: "Finance", carries: "Arrival time, proof of delivery" },
  { event: "Invoice issued", product: "huntPAY", reaches: "Owner", carries: "Amount, terms, payment state" },
  { event: "Exception raised", product: "huntOS", reaches: "Whoever can clear it", carries: "Source product, load, age" },
] as const

/* FAQ, verbatim from tab 01. Answer 2 is an instruction rather than visitor
   copy, so the component renders the ledger it points at instead of printing
   the sentence at the visitor. */
export const FAQ: readonly { q: string; a: string; render?: "status-ledger" }[] = [
  {
    q: "Do I need every product to start?",
    a: "No. Start with the product that solves today’s highest-friction job. The architecture should make the connected path visible without forcing a bundle.",
  },
  {
    q: "Which products are available now?",
    a: "",
    render: "status-ledger",
  },
  {
    q: "Is LoadHunter built only for the United States?",
    a: "LoadHunter is positioned for the international trucking and freight operations market. The first commercial region and P0 localization are the United States and US English.",
  },
  {
    q: "Can brokers and partners use the ecosystem?",
    a: "Yes. Dedicated broker, load-board, ELD and factoring pathways qualify the relationship before sending the lead to the right owner.",
  },
  {
    q: "How do I know which product fits my operation?",
    a: "The route selector recommends a starting point based on role, urgent job and operating model, then explains why.",
  },
]

/* ------------------------------------------------------------------ */
/*  Header and footer                                                  */
/*                                                                     */
/*  Shape is the extension landing's: the floating white pill nav and   */
/*  the dark footer band. Destinations come from the URL registry in    */
/*  TZ §2.2 to §2.9, groups from §5.4 and §26.4.                        */
/* ------------------------------------------------------------------ */

export const DEMO_CTA = CTA.demo

/**
 * TZ §5.4 + §26.4 - Products, Solutions, Resources, Company and Legal, with
 * Status, Trust, Accessibility, Privacy, Terms and Cookie Preferences all
 * present. The Products column is the one that carries statuses, because §5.4
 * asks for the five products with their current state.
 */
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
