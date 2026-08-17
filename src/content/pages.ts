/**
 * Content for the standalone indexable pages (WEB-001..005, LH-070, LH-072,
 * LH-045's dedicated /faq/).
 *
 * Each page owns UNIQUE title, description, H1 and intro — none of it is
 * copied from the homepage, because the brief's acceptance criterion for every
 * one of these routes is "does not cannibalise the homepage".
 *
 * Only confirmed capabilities are described here. Anything a page would need to
 * assert but Product has not confirmed is left out rather than softened.
 */

export type Section = { h2: string; body: string; bullets?: string[] }

export type PageContent = {
  /** route path, always with a trailing slash */
  path: string
  /** <title> */
  title: string
  /** <meta name="description"> */
  description: string
  h1: string
  intro: string
  sections: Section[]
  faq?: { q: string; a: string }[]
  /** internal links rendered at the bottom of the page */
  related: { label: string; href: string }[]
  ctaHeading: string
}

/* --------------------------------------------------------------- WEB-001 */

export const DAT_PAGE: PageContent = {
  path: "/dat-load-board-extension/",
  title: "DAT One Browser Extension for Dispatchers | LoadHunter",
  description:
    "Filter DAT One loads, contact brokers and check profit inside one browser workflow with LoadHunter.",
  h1: "DAT One Browser Extension for Faster Load Decisions",
  intro:
    "LoadHunter is a browser extension that runs on top of DAT One. It keeps your DAT One account and adds the steps dispatchers repeat all day: a customizable load view, saved filters, one-click broker email, route and deadhead context and an RPM estimate, without moving to another tab.",
  sections: [
    {
      h2: "What LoadHunter adds inside DAT One",
      body: "Every capability below runs in the DAT One tab you already work in. Availability can vary by plan.",
      bullets: [
        "A customizable load view: choose columns, pin the loads you are working and hide what you never read.",
        "Saved filters for rate, RPM, mileage and equipment, so only relevant postings reach you.",
        "One-click broker email from your own templates, or rule-based outreach when your plan allows it.",
        "Route and deadhead view with origin, destination and deadhead miles before you make contact.",
        "An RPM and profit estimate using the posted rate, loaded miles, deadhead miles and your own fuel and toll inputs.",
      ],
    },
    {
      h2: "What you still need from DAT",
      body: "LoadHunter does not provide load-board access and does not replace a DAT One subscription. You keep your DAT One account, and LoadHunter reads the postings you already have permission to see. It is an independent product and is not affiliated with DAT Solutions.",
    },
    {
      h2: "Setting it up",
      body: "Add the extension from the Chrome Web Store, sign in to LoadHunter, then open DAT One. Connect the email account you want broker messages sent from, and set the filters and rules that describe the freight you want.",
    },
  ],
  faq: [
    {
      q: "Does LoadHunter work with my existing DAT One subscription?",
      a: "Yes. LoadHunter runs on top of DAT One and requires an active DAT One account. It does not resell or replace load-board access.",
    },
    {
      q: "Can LoadHunter email a DAT One broker automatically?",
      a: "You can send a prepared email with one click, and depending on your plan and settings you can automate outreach for loads that match your rules. You control the rules and can disable them at any time.",
    },
  ],
  related: [
    { label: "Truckstop browser extension", href: "/truckstop-extension/" },
    { label: "Broker email automation", href: "/auto-emailing/" },
    { label: "Load profit and RPM calculator", href: "/load-profit-calculator/" },
    { label: "Pricing", href: "/#pricing" },
  ],
  ctaHeading: "Try LoadHunter on your next DAT One search",
}

/* --------------------------------------------------------------- WEB-002 */

export const TRUCKSTOP_PAGE: PageContent = {
  path: "/truckstop-extension/",
  title: "Truckstop Browser Extension for Dispatchers | LoadHunter",
  description:
    "Filter Truckstop loads, contact brokers and check profit inside one browser workflow with LoadHunter.",
  h1: "Truckstop Browser Extension for Faster Dispatch Workflows",
  intro:
    "LoadHunter layers a dispatch workflow over Truckstop. Your Truckstop account stays exactly as it is; the extension adds saved filters, broker outreach, route and deadhead context and profit estimates to the same browser tab.",
  sections: [
    {
      h2: "Where LoadHunter fits into a Truckstop day",
      body: "The extension is built around the sequence a dispatcher actually repeats: narrow the board, judge the load, contact the broker.",
      bullets: [
        "Narrow the board with saved rules for rate, RPM, mileage and equipment.",
        "Route filtered postings to Telegram so the desk can react without watching one screen.",
        "Judge the load with deadhead miles and a profit estimate built from your own cost inputs.",
        "Contact the broker with a prepared email from a connected mailbox.",
        "Keep notes, driver timelines and the next action on the load in the built-in dispatch workspace.",
      ],
    },
    {
      h2: "Truckstop stays your load board",
      body: "LoadHunter reads the postings your Truckstop account already gives you access to. It does not provide load-board access, does not replace your Truckstop subscription and is not affiliated with Truckstop.",
    },
    {
      h2: "Working across more than one board",
      body: "If your desk uses more than one supported board, the same rules, templates and profit inputs apply everywhere LoadHunter runs, so a dispatcher does not relearn the workflow per board.",
    },
  ],
  faq: [
    {
      q: "Do I need a paid Truckstop plan to use LoadHunter?",
      a: "You need an active account with Truckstop. LoadHunter enhances the board you already subscribe to and never provides load-board access itself.",
    },
    {
      q: "Can my whole desk share the same Truckstop workflow?",
      a: "Team plans let dispatchers share outreach templates and rules, so everyone works the board the same way.",
    },
  ],
  related: [
    { label: "DAT One browser extension", href: "/dat-load-board-extension/" },
    { label: "Telegram load alerts", href: "/#features" },
    { label: "Broker factoring signals", href: "/factoring-check/" },
    { label: "Pricing", href: "/#pricing" },
  ],
  ctaHeading: "Put LoadHunter on top of Truckstop",
}

/* --------------------------------------------------------------- WEB-003 */

export const AUTO_EMAILING_PAGE: PageContent = {
  path: "/auto-emailing/",
  title: "Broker Email Automation Inside Your Load Board | LoadHunter",
  description:
    "Build rules for rate, RPM, mileage and equipment, then send broker emails with one click or automate outreach for matching loads.",
  h1: "Broker Email Automation Inside Your Load Board",
  intro:
    "Broker outreach is the step that decides whether you are early or late on a load. LoadHunter keeps it in the load board: you write the template once, describe the freight once, and then either send with one click or let matching loads trigger the email.",
  sections: [
    {
      h2: "The rule is the input",
      body: "A rule describes the freight you want, in the terms the board already uses.",
      bullets: [
        "Rate and rate per mile thresholds.",
        "Loaded mileage range.",
        "Equipment type.",
        "The mailbox the message is sent from.",
        "The template used for that kind of load.",
      ],
    },
    {
      h2: "Two modes, and you choose which one is on",
      body: "One-click mode prepares the message and waits for you to send it. Automatic mode sends to brokers whose posting matches an active rule. Automatic outreach depends on your plan and settings, and you can change or disable any rule at any time.",
    },
    {
      h2: "Keeping outreach clean",
      body: "Rules can skip re-posted loads and brokers you already contacted, so the same broker is not emailed repeatedly about the same freight. You are responsible for the content of the messages you send, and for the applicable rules on commercial email in your jurisdiction.",
    },
    {
      h2: "What LoadHunter does not do",
      body: "LoadHunter does not book loads on your behalf and does not negotiate. It prepares and sends the outreach you configured; every commitment stays a human decision.",
    },
  ],
  faq: [
    {
      q: "Which mailbox do broker emails come from?",
      a: "From an email account you connect yourself. Teams can connect more than one, which is useful when dispatchers work under different carriers.",
    },
    {
      q: "Can I stop automated outreach immediately?",
      a: "Yes. Rules can be edited or disabled at any time, and disabling a rule stops any further sending under it.",
    },
  ],
  related: [
    { label: "DAT One browser extension", href: "/dat-load-board-extension/" },
    { label: "Truckstop browser extension", href: "/truckstop-extension/" },
    { label: "Security and data access", href: "/security/" },
    { label: "Pricing", href: "/#pricing" },
  ],
  ctaHeading: "Set up your first outreach rule",
}

/* --------------------------------------------------------------- WEB-004 */

export const PROFIT_PAGE: PageContent = {
  path: "/load-profit-calculator/",
  title: "Load Profit and RPM Calculator With Deadhead | LoadHunter",
  description:
    "Estimate rate per mile and load profit with loaded miles, deadhead miles, fuel and toll inputs before you contact the broker.",
  h1: "Load Profit and RPM Calculator With Deadhead",
  intro:
    "A posted rate is not a result. LoadHunter estimates what a load is actually worth to you by combining the posted rate with the miles you will really drive and the costs you actually carry.",
  sections: [
    {
      h2: "The inputs",
      body: "Every figure below comes either from the posting or from settings you control.",
      bullets: [
        "Posted rate, taken from the load.",
        "Loaded miles, taken from the load.",
        "Deadhead miles to the pickup (DHO) and from the delivery (DHD).",
        "Fuel consumption and the diesel price you want to assume.",
        "Toll and other per-trip costs you choose to include.",
      ],
    },
    {
      h2: "How the estimate is built",
      body: "Rate per mile is the posted rate divided by miles. Including deadhead in that denominator is what separates a load that looks good on the board from one that pays after the repositioning drive. The profit estimate then subtracts your fuel and toll assumptions from the rate.",
    },
    {
      h2: "What the number is, and what it is not",
      body: "The result is an operational estimate based on the load data available at that moment and the assumptions you entered. It is not a guarantee of final profit: detention, layover, fuel price movement, accessorials and how the delivery actually goes all land outside the calculation.",
    },
  ],
  faq: [
    {
      q: "Does the calculator include deadhead miles?",
      a: "Yes. Deadhead to the pickup and from the delivery can both be included, which is the point of calculating rate per mile this way rather than from loaded miles alone.",
    },
    {
      q: "Can I change the fuel price it assumes?",
      a: "Yes. Fuel consumption and diesel price are inputs you set, so the estimate reflects your equipment and your costs rather than a generic average.",
    },
  ],
  related: [
    { label: "Route and deadhead view", href: "/#features" },
    { label: "DAT One browser extension", href: "/dat-load-board-extension/" },
    { label: "Broker email automation", href: "/auto-emailing/" },
    { label: "Pricing", href: "/#pricing" },
  ],
  ctaHeading: "Run the numbers before your next call",
}

/* --------------------------------------------------------------- WEB-005 */

export const FACTORING_PAGE: PageContent = {
  path: "/factoring-check/",
  title: "Check Broker Factoring Signals Before You Book | LoadHunter",
  description:
    "See the factoring data available through your connected provider and carrier feedback on a broker, with the source and update time shown.",
  h1: "Check Broker Factoring Signals Before You Pursue a Load",
  intro:
    "Who you haul for decides when you get paid. LoadHunter surfaces the broker signals available to you next to the posting, so the check happens before the call rather than after the invoice.",
  sections: [
    {
      h2: "Where the signals come from",
      body: "There are two distinct sources, and LoadHunter labels which one you are looking at. It never merges them into a single score.",
      bullets: [
        "Carrier feedback: what other LoadHunter users reported about working with that broker.",
        "Connected factoring provider: the broker data your own factoring account exposes, once you connect it.",
      ],
    },
    {
      h2: "Reading the states honestly",
      body: "A signal can be available, unavailable or out of date, and the interface says which. An unavailable signal means LoadHunter has nothing for that broker right now, not that the broker is bad. An outdated signal shows when it was last refreshed so you can judge how much weight it deserves.",
    },
    {
      h2: "This does not replace your own check",
      body: "LoadHunter does not verify brokers, does not issue credit ratings and does not guarantee payment. Treat these signals as one input into your own due diligence, alongside the checks your operation already runs.",
    },
  ],
  faq: [
    {
      q: "Do I need a factoring account to see factoring signals?",
      a: "Yes. Factoring data comes from the provider account you connect. Without a connected provider you still see carrier feedback, labelled as community-sourced.",
    },
    {
      q: "Is a broker with no signals a bad broker?",
      a: "No. It only means no data is available for that broker in the sources you have connected.",
    },
  ],
  related: [
    { label: "Broker signals in the extension", href: "/#features" },
    { label: "Security and data access", href: "/security/" },
    { label: "Truckstop browser extension", href: "/truckstop-extension/" },
    { label: "Pricing", href: "/#pricing" },
  ],
  ctaHeading: "Check the broker before you chase the load",
}

/* ---------------------------------------------------------------- LH-070 */

export const SECURITY_PAGE: PageContent = {
  path: "/security/",
  title: "Security and Data Access | LoadHunter",
  description:
    "What the LoadHunter browser extension can access, why each permission is needed, and how load-board and email data are handled, retained and deleted.",
  h1: "Security and Data Access",
  intro:
    "LoadHunter runs inside your browser, next to accounts that matter. This page explains, in plain terms, what the extension can reach and why. It states only what the product actually does; it makes no certification claims.",
  sections: [
    {
      h2: "What the extension can access",
      body: "The extension reads the pages of the supported load boards you open, so it can render its own view of the postings you already have access to. When you connect an email account, it uses that account to send the broker messages you configured. When you connect a factoring provider, it reads the broker data that provider exposes to you.",
    },
    {
      h2: "Why each connection exists",
      body: "Nothing is connected by default. A load-board permission exists so the extension can display and filter postings in place. An email connection exists so outreach is sent from your own mailbox rather than a shared sender. A factoring connection exists so broker signals reflect your own provider relationship.",
    },
    {
      h2: "Retention and deletion",
      body: "Data associated with your account is retained while the account exists so the features you enabled keep working. You can disconnect an email account or factoring provider at any time, which stops further access through that connection. Account deletion requests are handled through support at the address on this site; see the Privacy Policy for the controlling terms.",
    },
    {
      h2: "What we do not claim",
      body: "This page deliberately carries no SOC 2, ISO or encryption badges. LoadHunter does not publish an audit report, and presenting an unverified badge would be worse than saying so. According to its Chrome Web Store disclosure, LoadHunter states that user data is not sold or used for unrelated purposes.",
    },
  ],
  related: [
    { label: "Privacy Policy", href: "/privacy.html" },
    { label: "Terms of Service", href: "/terms.html" },
    { label: "Broker email automation", href: "/auto-emailing/" },
    { label: "Frequently asked questions", href: "/faq/" },
  ],
  ctaHeading: "Questions about permissions?",
}

export const SEO_PAGES: PageContent[] = [
  DAT_PAGE,
  TRUCKSTOP_PAGE,
  AUTO_EMAILING_PAGE,
  PROFIT_PAGE,
  FACTORING_PAGE,
  SECURITY_PAGE,
]

/* --------------------------------------------------------------- /faq/ */

/**
 * LH-045 — the support-flavoured questions that used to sit on the homepage
 * live here, with unique answers and links to the relevant pages. The eight
 * homepage Q&A are NOT repeated verbatim; this page links to them instead.
 */
export const FAQ_PAGE_GROUPS = [
  {
    title: "Getting started",
    items: [
      {
        id: "install",
        q: "How do I install and set up LoadHunter?",
        a: "Open the LoadHunter listing on the Chrome Web Store and add it to Chrome. Pin the extension from the puzzle icon, sign in with your email, then open a supported load board: the LoadHunter interface appears in that tab. Connect the email account you want broker messages sent from, and set your first filters.",
      },
      {
        id: "accounts",
        q: "Do I need a load-board subscription as well?",
        a: "Yes. LoadHunter works on top of DAT One and Truckstop and requires an active account with the provider. It never resells or replaces load-board access.",
      },
      {
        id: "browsers",
        q: "Which browsers are supported?",
        a: "LoadHunter is distributed as a Chrome extension through the Chrome Web Store.",
      },
    ],
  },
  {
    title: "Connections",
    items: [
      {
        id: "factoring",
        q: "Can I connect my factoring company account?",
        a: "Yes. Connecting a factoring provider lets LoadHunter show the broker data that provider exposes to you, labelled with its source. See the factoring signals page for what each state means.",
      },
      {
        id: "email",
        q: "Can I send from more than one email account?",
        a: "Team plans support more than one connected mailbox, which is useful when dispatchers work under different carriers.",
      },
      {
        id: "telegram",
        q: "How do Telegram alerts work?",
        a: "You connect Telegram and choose which filters should notify you. Only postings matching those filters are sent, so the channel stays useful.",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        id: "trial",
        q: "How does the free trial work?",
        a: "Explore the full workflow during the 14-day trial. No credit card is required to start.",
      },
      {
        id: "cancel",
        q: "Can I cancel at any time?",
        a: "Yes. Paid subscriptions can be cancelled at any time, and access continues until the end of the current billing period.",
      },
      {
        id: "seats",
        q: "How does team pricing work?",
        a: "Pricing is per user per month. Teams save 10% at three users and 20% at four or more, and annual billing saves a further 10%.",
      },
    ],
  },
] as const
