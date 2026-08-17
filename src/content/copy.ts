/**
 * APPROVED MARKETING COPY — single source of truth.
 *
 * Every string here is transcribed verbatim from the SEO brief
 * ("ЕДИНОЕ ТЗ LOADHUNTER"), with the task ID in a comment above it. Both
 * section trees (the 1920 desktop canvas in `src/sections/*` and the flow
 * layout in `src/sections/mobile/*`) render from this module, which is what
 * keeps desktop/mobile content parity checkable (QA-005, LH-068) and makes
 * "внедрён дословно" verifiable by diffing one file against the brief.
 *
 * Editing rules:
 *  - никаких длинных тире (U+2014) в marketing copy — COPYQA-001..022.
 *  - do not paraphrase; if the brief changes, change it here.
 */

import { APP_URL, CHROME_STORE_URL } from "@/content/links"

/* ------------------------------------------------------------------ links */

/** Chrome Web Store reviews tab — the source behind the rating badge. */
export const CHROME_REVIEWS_URL = `${CHROME_STORE_URL}/reviews`

/** Trustpilot profile — source behind the Trustpilot badge. NEEDS CONFIRMATION. */
export const TRUSTPILOT_URL = "https://www.trustpilot.com/review/loadhunter.io"

/** LH-049 — public support contacts. NEEDS CONFIRMATION. */
export const SUPPORT_EMAIL = "support@loadhunter.io"
export const SUPPORT_PHONE = "+1 312 878 9795"
export const SUPPORT_PHONE_HREF = "+13128789795"

/** huntTMS — the separate ecosystem product referenced by FAQ-004 / LH-030. */
export const HUNT_TMS_URL = "https://hunttms.com"

/* ------------------------------------------------------------------- meta */

/** LH-052 / SEO-001 / COPYQA-001 */
export const META_TITLE = "LoadHunter: AI Browser Extension for DAT One & Truckstop"

/** LH-053 / SEO-002 / COPYQA-002 */
export const META_DESCRIPTION =
  "Book better loads faster with LoadHunter, the AI-powered browser extension for DAT One and Truckstop. Filter loads, contact brokers and check profit in one workflow. Start your free 14-day trial today."

/** LH-054 */
export const OG_TITLE = "LoadHunter AI Browser Extension for DAT One & Truckstop"

/** LH-054 / COPYQA-003 */
export const OG_DESCRIPTION =
  "Filter loads, contact brokers and check profit in one workflow with LoadHunter. Start your free 14-day trial today."

export const SITE_URL = "https://loadhunter.io"

/* ------------------------------------------------------------------- hero */

export const HERO = {
  /** LH-001 / SEO-003 */
  eyebrow: "AI-powered browser extension for DAT One and Truckstop",
  /** LH-002 / SEO-004 */
  h1: "Book better loads faster in DAT One and Truckstop",
  /**
   * SEO-005. LH-003 carries a longer variant ending "...without switching
   * between disconnected tools"; the SEO sheet is the deduplicated approved
   * register, so this shorter line wins. Flagged to the owner.
   */
  lead: "LoadHunter is an AI-powered browser extension and dispatch workflow layer for U.S. carriers, owner-operators and dispatch teams. Filter loads, contact brokers and check profit in one workflow.",
  /** LH-005 */
  primaryCta: "Start Your Free 14-Day Trial",
  /** LH-006 */
  secondaryCta: "Watch the 60-Second Demo",
  /** LH-007 */
  microcopy: "No credit card required. Setup in minutes.",
  /** LH-008 */
  caption: "Works directly inside the load boards your team already uses.",
} as const

/* ------------------------------------------------------------------ proof */

/**
 * LH-004 / LH-043 — three separate source-attributed badges, never a blended
 * average and never the word "Google". Every figure below comes from the brief
 * and MUST be re-verified against its source before a production deploy.
 */
export const PROOF_AS_OF = "As of Aug 2026"

export const PROOF_BADGES = [
  {
    value: "6,000",
    label: "Chrome Web Store users",
    href: CHROME_STORE_URL,
    source: "chrome" as const,
  },
  {
    value: "4.6/5",
    label: "from 29 Chrome ratings",
    href: CHROME_REVIEWS_URL,
    source: "chrome" as const,
  },
  {
    value: "4.4/5",
    label: "on Trustpilot",
    href: TRUSTPILOT_URL,
    source: "trustpilot" as const,
  },
]

/* ---------------------------------------------------------- compatibility */

/** LH-071 / SEO-009 */
export const COMPATIBILITY = {
  h2: "Works with the load boards your team already uses",
  /** LH-071 heading variant used as the section lead. */
  lead: "Works inside the load boards your team already uses",
  /**
   * Platforms that the brief lists as supported. `href` points at this site's
   * own SEO landing page for that board (internal linking, LH-048); a platform
   * without a page renders as a plain badge.
   *
   * TruckSmarter is listed by the brief but NOT yet confirmed by Product, and
   * LH-071 says to publish only confirmed platforms. Drop its entry here until
   * it is signed off.
   *
   * `w`/`h` MUST keep each file's own viewBox ratio: the exports carry
   * preserveAspectRatio="none", so a wrong pair visibly stretches the mark.
   * (The four partner-*.svg files were misnamed in the original export set and
   * were renamed to match their contents on 2026-08-17; the old marquee cycled
   * all four, which hid the mismatch.)
   */
  platforms: [
    {
      name: "DAT One",
      logo: "/figma/partner-dat.svg", // viewBox 112 x 19.03
      w: 106,
      h: 18,
      href: "/dat-load-board-extension/",
    },
    {
      name: "Truckstop",
      logo: "/figma/partner-truckstop.svg", // viewBox 112 x 24.17
      w: 102,
      h: 22,
      href: "/truckstop-extension/",
    },
    {
      name: "TruckSmarter",
      logo: "/figma/partner-trucksmarter.svg", // viewBox 112 x 19.91
      w: 101,
      h: 18,
      href: undefined as string | undefined,
    },
  ],
  note: "LoadHunter enhances the load boards you already use and requires an active account with the relevant provider.",
} as const

/* ------------------------------------------------------- why loadhunter */

export const WHY = {
  /** LH-017 / SEO-006 / COPYQA-004 */
  h2: "One workflow layer for the load boards you already use",
  /**
   * SEO-007. LH-018 carries "faster filtering, broker outreach, profit checks";
   * the SEO sheet says "faster filtering, instant outreach, profitability
   * checks". SEO register wins, same rule as HERO.lead.
   */
  lead: "Keep DAT One, Truckstop and your existing workflow. LoadHunter adds faster filtering, instant outreach, profitability checks and team-ready tools directly where dispatch work happens.",
  cards: [
    {
      /** LH-019 / COPYQA-006 */
      h3: "Work inside your load board",
      body: "Email brokers, open routes, check factoring signals and save load details without jumping between tabs.",
    },
    {
      /** LH-020 / COPYQA-007 */
      h3: "Respond while the load is still fresh",
      body: "Real-time scanning, saved rules and one-click outreach reduce repetitive steps between finding and contacting a broker.",
    },
    {
      /** LH-021 */
      h3: "Automate the repetitive steps",
      body: "Set rate, RPM, mileage and equipment rules. LoadHunter can surface matches, trigger broker emails and send Telegram alerts.",
    },
  ],
} as const

/* --------------------------------------------------------- differentiation */

/** LH-022 / LH-023 */
export const DIFFERENTIATION = {
  h2: "Why teams choose LoadHunter instead of more tabs and manual copy-paste",
  proofPoints: [
    "Works where dispatchers already work",
    "Faster broker outreach",
    "Profit view with deadhead and costs",
    "Scales from one user to a dispatch team",
  ],
  /** Only verifiable characteristics, no competitor names (LH-022). */
  columns: ["Manual workflow", "Generic TMS", "LoadHunter"] as const,
  rows: [
    { label: "Works inside load boards", values: [false, false, true] },
    { label: "Real-time actions on a posted load", values: [false, false, true] },
    { label: "Profit context before outreach", values: [false, true, true] },
    { label: "Team tools and shared rules", values: [false, true, true] },
    { label: "Setup without replacing your stack", values: [true, false, true] },
  ],
} as const

/* ---------------------------------------------------------- how it works */

/** LH-024 / SEO-008 */
export const HOW_IT_WORKS = {
  h2: "Start in minutes without replacing your load boards",
  steps: [
    { n: "1", title: "Add LoadHunter to Chrome" },
    { n: "2", title: "Connect your supported load board and email" },
    { n: "3", title: "Filter, evaluate and contact brokers from one workflow" },
  ],
} as const

/* ------------------------------------------------------------ product demo */

/** LH-073 */
export const DEMO = {
  h2: "See the full load-to-broker workflow in 60 seconds",
  lead: "Filter a load, evaluate profit and contact the broker without leaving the workflow.",
} as const

/* --------------------------------------------------------------- features */

export const FEATURES_INTRO = {
  /** LH-026 / SEO-010 / COPYQA-008 */
  h2: "Turn load-board activity into a faster dispatch workflow",
  /** COPYQA-009 */
  lead: "Find high-RPM loads, filter noise, contact brokers and evaluate the next step from one browser-based workflow.",
} as const

/** LH-027..LH-033 + SEO-011..017 + COPYQA-010..014. Keys match the existing
 *  tools block ids so the sections can look copy up by key. */
export const FEATURES = {
  smartboard: {
    h3: "SmartBoard view",
    body: "Customize columns, pin priority loads and remove interface clutter in a faster view built for active dispatch work.",
  },
  autoEmailing: {
    h3: "Auto-emailing",
    body: "Create rules for rate, RPM, mileage and equipment. Send a broker email with one click, or automate outreach for matching loads when your plan and settings allow it.",
  },
  telegram: {
    h3: "Telegram load alerts",
    body: "Receive filtered alerts from supported load boards in Telegram, so your team can react to relevant opportunities away from the main screen.",
  },
  workspace: {
    h3: "Built-in dispatch workspace",
    body: "Track driver timelines, notes and the next action in LoadHunter. For broader transport management, link to huntTMS.",
  },
  route: {
    h3: "Route and deadhead view",
    body: "See origin, destination and deadhead miles before you contact the broker. Open the route in LoadHunter or Google Maps.",
  },
  brokerSignals: {
    h3: "Broker signals",
    body: "Review community feedback and connected factoring data before deciding whether to pursue a load.",
  },
  profit: {
    h3: "True-profit calculator",
    body: "Estimate RPM with loaded and deadhead miles, fuel assumptions and toll inputs before you commit to a load.",
  },
} as const

/**
 * The seven feature blocks, in page order, with their two sub-items.
 *
 * Both trees read this array (the desktop canvas adds geometry + the /desk/
 * mockups, the flow layout adds the /mobile/ mockups), so feature copy cannot
 * drift between breakpoints (QA-005).
 *
 * Sub-item copy is written to the brief's constraints rather than transcribed,
 * because the brief only supplies approved text for the block titles and
 * descriptions. Specifically: no "no lags" claim without measurements (LH-027),
 * no "verified" broker data (LH-032), no guaranteed profit (LH-033), and every
 * broker signal names its `source` (LH-032).
 */
export const TOOL_BLOCKS = [
  {
    key: "a",
    ...FEATURES.smartboard,
    items: [
      {
        icon: "/figma/tools/a-icon1.png",
        iconW: 62 as const,
        title: "A view built for dispatch work",
        sub: "A custom load-board view that keeps the columns you use and removes the interface elements you do not.",
      },
      {
        icon: "/figma/tools/a-icon2.png",
        iconW: 62 as const,
        title: "Workflow customization",
        sub: "Drag, resize, reorder, hide or pin loads to match your dispatch workflow.",
      },
    ],
  },
  {
    key: "b",
    ...FEATURES.autoEmailing,
    items: [
      {
        icon: "/figma/tools/b-icon1.png",
        iconW: 52 as const,
        title: "Multiple email accounts",
        sub: "Send from more than one connected mailbox, which helps teams working with different carriers.",
      },
      {
        icon: "/figma/tools/b-icon2.png",
        iconW: 52 as const,
        title: "Duplicate filtering",
        sub: "Rules can skip re-posted loads and brokers you already contacted, so outreach stays relevant.",
      },
    ],
  },
  {
    key: "c",
    ...FEATURES.telegram,
    items: [
      {
        icon: "/figma/tools/c-icon1.png",
        iconW: 62 as const,
        title: "Advanced filtering",
        sub: "Send only the loads that match your filters to Telegram, so the channel stays relevant.",
      },
      {
        icon: "/figma/tools/c-icon2.png",
        iconW: 62 as const,
        title: "Multiple load boards",
        sub: "Connect more than one supported load board and receive their alerts in the same place.",
      },
    ],
  },
  {
    key: "d",
    ...FEATURES.workspace,
    items: [
      {
        icon: "/figma/tools/d-icon1.png",
        iconW: 52 as const,
        title: "Dispatch task tracking",
        sub: "Keep dispatch tasks, notes and the next action on a load in one place.",
      },
      {
        icon: "/figma/tools/d-icon2.png",
        iconW: 52 as const,
        title: "Driver timelines",
        sub: "Track driver schedules and task timelines so the desk stays coordinated.",
      },
    ],
  },
  {
    key: "e",
    ...FEATURES.route,
    items: [
      {
        icon: "/figma/tools/e-icon1.png",
        iconW: 62 as const,
        title: "Deadhead and trip overlay",
        sub: "See origin, destination and deadhead miles before you contact the broker.",
      },
      {
        icon: "/figma/tools/e-icon2.png",
        iconW: 62 as const,
        title: "One-click route view",
        sub: "Open a load's route in LoadHunter or in Google Maps without leaving the load board.",
      },
    ],
  },
  {
    key: "f",
    ...FEATURES.brokerSignals,
    items: [
      {
        icon: "/figma/tools/f-icon1.png",
        iconW: 52 as const,
        title: "Carrier feedback",
        sub: "Read what other carriers reported about a broker before you decide to pursue a load.",
        source: "Community",
      },
      {
        icon: "/figma/tools/f-icon2.png",
        iconW: 52 as const,
        title: "Factoring signals",
        sub: "See the broker data available through the factoring provider you connected.",
        source: "Connected factoring provider",
      },
    ],
  },
  {
    key: "g",
    ...FEATURES.profit,
    items: [
      {
        icon: "/figma/tools/g-icon1.png",
        iconW: 62 as const,
        title: "Expense inputs you control",
        sub: "Add fuel consumption, diesel price and toll inputs so the estimate reflects your own costs.",
      },
      {
        icon: "/figma/tools/g-icon2.png",
        iconW: 62 as const,
        title: "RPM including deadhead",
        sub: "Compare rate per mile with deadhead miles (DHO/DHD) against your own margin target. The result is an estimate, not a guaranteed profit.",
      },
    ],
  },
] as const

/* -------------------------------------------------------------- use cases */

/** LH-034 / SEO-018 */
export const USE_CASES = {
  h2: "Built for the way your operation dispatches",
  tabs: [
    {
      id: "owner-operators",
      label: "Owner-operators",
      outcomes: [
        "Check RPM, deadhead and costs before you call a broker.",
        "Send a prepared broker email without leaving the load board.",
        "Keep the loads you are working on in one place.",
      ],
    },
    {
      id: "small-carriers",
      label: "Small carriers",
      outcomes: [
        "Set filters and rules once, then react only to relevant loads.",
        "Share broker outreach templates across the team.",
        "Track driver timelines and the next action per load.",
      ],
    },
    {
      id: "dispatch-teams",
      label: "Dispatch teams",
      outcomes: [
        "Give every dispatcher the same view and the same rules.",
        "Route filtered alerts to Telegram so nobody watches one screen.",
        "Scale seats and permissions as the desk grows.",
      ],
    },
  ],
  /** Default tab per LH-034. */
  defaultTab: "small-carriers",
} as const

/* --------------------------------------------------------- regional proof */

/** LH-035 */
export const REGIONAL = {
  h2: "Built for U.S. trucking and freight dispatch workflows",
  body: "Evaluate loads across U.S. load boards, compare RPM and deadhead miles, review broker signals and make faster dispatch decisions.",
} as const

/* ---------------------------------------------------------------- pricing */

export const PRICING_COPY = {
  /** LH-036 / SEO-019 */
  h2: "Plans that scale from one user to a dispatch team",
  /** LH-036 */
  lead: "Test the complete workflow for 14 days, then choose the level of automation your operation needs.",
  /** LH-037 / COPYQA-020 */
  discountNote:
    "Save 10% with annual billing. Teams save 10% with 3 users and 20% with 4 or more users.",
  /** LH-037 */
  toggleMonthly: "Monthly",
  toggleAnnual: "Annual: save 10%",
  /** LH-041 */
  riskReversal:
    "14-day full-feature trial. No credit card required. Cancel paid plans anytime; access continues until the end of the billing period.",
  /** LH-038 — best-fit labels per plan. */
  bestFit: {
    Freemium: "Explore the basics",
    Basic: "Essential outreach for one user",
    Standard: "Workflow tools for active dispatch",
    Pro: "Advanced automation and team control",
  } as Record<string, string>,
  /** LH-040 */
  custom: {
    title: "Custom AI automation",
    body: "For larger dispatch operations that need tailored workflow rules, integrations and onboarding. Contact sales.",
    cta: "Contact sales",
  },
  /** LH-039 */
  groups: ["Core tools", "Automation", "SmartBoard", "Team", "Coming soon"],
} as const

/* ---------------------------------------------------------------- reviews */

export const REVIEWS = {
  /** LH-042 / SEO-020 */
  h2: "Proof from real dispatch workflows",
  /** LH-042 */
  lead: "See how carriers and dispatch teams use LoadHunter to reduce repetitive work and respond faster.",
  /** LH-043 — two source cards, never a blended average. */
  metrics: [
    { source: "Chrome Web Store", value: "4.6 from 29 ratings", href: CHROME_REVIEWS_URL },
    { source: "Trustpilot", value: "4.4 from 11 reviews", href: TRUSTPILOT_URL },
  ],
  asOf: "As of August 2026",
} as const

/* -------------------------------------------------------------------- faq */

/** LH-044 / SEO-021 */
export const FAQ_INTRO = {
  h2: "LoadHunter, answered",
  lead: "Clear answers about the LoadHunter AI-powered browser extension for DAT One and Truckstop, including supported load boards, broker email automation, profit calculations, data access and the 14-day free trial.",
} as const

/**
 * FAQ-001..008 — the eight homepage questions, verbatim. `id` is the permanent
 * anchor required by LH-045; the FAQPage JSON-LD is generated from this exact
 * array so schema and UI cannot drift (LH-061).
 */
export const FAQ_ITEMS = [
  {
    id: "what-is-loadhunter",
    q: "What is LoadHunter?",
    a: "LoadHunter is an AI-powered browser extension and dispatch workflow layer for U.S. carriers, owner-operators and dispatch teams using DAT One and Truckstop. It adds advanced load filters, broker email tools, Telegram alerts, route and deadhead views, factoring signals, broker reviews, RPM calculations and a true-profit calculator directly to the load-board workflow.",
  },
  {
    id: "supported-load-boards",
    q: "Which load boards does LoadHunter support?",
    a: "LoadHunter works with DAT One and Truckstop. It enhances the load boards you already use and requires an active account with the relevant provider. LoadHunter does not provide load-board access or replace your DAT One or Truckstop subscription.",
  },
  {
    id: "what-loadhunter-adds",
    q: "What does LoadHunter add to DAT One and Truckstop?",
    a: "LoadHunter adds customizable load views, advanced filters, one-click and rule-based broker emails, Telegram load alerts, route and deadhead tools, factoring signals, broker reviews, RPM calculations and profit estimates inside the dispatch workflow. Feature availability can vary by plan and supported load board.",
  },
  {
    id: "does-loadhunter-replace",
    q: "Does LoadHunter replace DAT One, Truckstop or a TMS?",
    a: "No. LoadHunter works on top of DAT One and Truckstop as a browser extension and workflow layer. You keep your existing load-board accounts. LoadHunter can organize dispatch tasks and driver timelines, while broader transport management is handled separately through huntTMS.",
  },
  {
    id: "broker-email-automation",
    q: "How does LoadHunter broker email automation work?",
    a: "LoadHunter lets you create broker email templates and rules based on rate, RPM, mileage and equipment. Depending on your plan and settings, you can send a prepared email with one click or automate outreach for matching loads. You control the rules and can change or disable them at any time.",
  },
  {
    id: "rpm-and-profit",
    q: "How does LoadHunter calculate RPM and load profit with deadhead?",
    a: "LoadHunter estimates rate per mile and potential load profit using the posted rate, loaded miles, deadhead miles and configurable cost inputs such as fuel and tolls. The result is an operational estimate based on the available load data and your inputs, not a guarantee of final profit.",
  },
  {
    id: "data-safety",
    q: "Is LoadHunter safe to use with load-board and email data?",
    a: "LoadHunter accesses the load-board, account and connected-service data required for the features you enable. Its Security & Data Access page explains browser permissions, email and load-board data handling, retention and deletion. According to its Chrome Web Store disclosure, LoadHunter states that user data is not sold or used for unrelated purposes.",
  },
  {
    id: "free-trial",
    q: "How does the LoadHunter 14-day free trial work?",
    a: "LoadHunter offers a free 14-day trial with no credit card required. You can test the available workflow features before choosing a paid plan. Paid subscriptions can be cancelled at any time, and access continues until the end of the current billing period.",
  },
] as const

/* -------------------------------------------------------------- final cta */

/** LH-046 / SEO-022 */
export const FINAL_CTA = {
  h2: "Turn your load boards into a faster dispatch workflow",
  body: "Start your free 14-day trial today. No credit card required.",
  primary: HERO.primaryCta,
  primaryHref: APP_URL,
  secondary: HERO.secondaryCta,
} as const

/* ---------------------------------------------------------------- ecosystem */

export const ECOSYSTEM_COPY = {
  /** COPYQA-015 */
  lead: "A connected product ecosystem for load discovery, dispatch operations, payments and drivers.",
  /** COPYQA-016..019 */
  huntTMS: "A transport management system for dispatch, driver timelines and daily operations.",
  huntPAY:
    "Automated invoicing, factoring workflows and payment tracking designed to help teams get paid sooner.",
  huntDRIVE: "The driver companion app for trips, documents and dispatch chat from the cab.",
  huntOS: "One operating system for load boards, fleet activity and daily trucking operations.",
} as const

/* ------------------------------------------------------------------ footer */

/** LH-047 / LH-048 — deep links. Only routes that exist (or are being built in
 *  this pass) are listed, per "нет dead links". */
export const FOOTER_NAV = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Chrome Extension", href: CHROME_STORE_URL, external: true },
      { label: "SmartBoard", href: "/#features" },
      { label: "Auto-emailing", href: "/auto-emailing/" },
      { label: "Profit Calculator", href: "/load-profit-calculator/" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Owner-operators", href: "/#use-cases" },
      { label: "Small Carriers", href: "/#use-cases" },
      { label: "Dispatch Teams", href: "/#use-cases" },
      { label: "DAT One extension", href: "/dat-load-board-extension/" },
      { label: "Truckstop extension", href: "/truckstop-extension/" },
      { label: "Factoring check", href: "/factoring-check/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog/" },
      { label: "FAQ", href: "/faq/" },
      { label: "Security & Data Access", href: "/security/" },
      { label: "Contact Support", href: `mailto:${SUPPORT_EMAIL}` },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Privacy Policy", href: "/privacy.html" },
      { label: "Terms of Service", href: "/terms.html" },
    ],
  },
] as const

/** LH-010 — ecosystem moved out of the header into a quiet footer group. */
export const FOOTER_ECOSYSTEM = {
  title: "Ecosystem",
  links: [
    { label: "huntTMS", href: HUNT_TMS_URL, external: true },
    { label: "huntPAY", href: "#", upcoming: true },
    { label: "huntDRIVE", href: "#", upcoming: true },
    { label: "huntOS", href: "#", upcoming: true },
    { label: "$LHUNT", href: "https://coin.loadhunt.ai", external: true },
  ],
} as const

/** LH-051 / LH-069 — newsletter block. */
export const NEWSLETTER = {
  h3: "Get practical load-board workflow tips",
  body: "Monthly product updates, dispatch workflow guides and new feature notes.",
  cta: "Subscribe",
  placeholder: "Work email",
  success: "You're subscribed. Check your inbox to confirm.",
  error: "We couldn't subscribe this address. Please try again.",
  consent:
    "By subscribing you agree to receive product emails. Unsubscribe at any time. See our Privacy Policy.",
} as const

/** LH-050 — trademark independence disclaimer. */
export const TRADEMARK_DISCLAIMER =
  "LoadHunter is an independent product and is not affiliated with, endorsed by or sponsored by DAT Solutions, Truckstop, TruckSmarter or other third-party load-board providers. Product names and trademarks belong to their respective owners."

/* ------------------------------------------------------------------- blog */

/** LH-074 */
export const BLOG_TEASER = {
  h2: "Latest from the Dispatch Blog",
  lead: "Three practical guides for faster load-board workflows.",
  cta: "Read article",
} as const

/** SEO-023 / BLOG-001 */
export const BLOG_INDEX = {
  h1: "LoadHunter Blog: Load Board Automation and Dispatch Workflows",
  categories: [
    "Load Board Automation",
    "Dispatch Workflows",
    "Profit & RPM",
    "Product Guides",
    "Carrier Operations",
  ],
} as const
