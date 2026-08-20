/**
 * Where a call to action goes, and what it says about it.
 *
 * The document writes 213 distinct CTA labels across 47 tabs and never once
 * writes a destination for them - §26.2 only fixes the wording per product and
 * requires that every button have "подтверждённый адрес назначения".
 *
 * The first attempt matched the label against regular expressions and sent it
 * to whatever route the words suggested. That produced three failures worth
 * naming, because they are the failures any label-guessing scheme produces:
 *
 *   - Pages linking to themselves. "Explore the Dispatch Day" on /hunttms
 *     resolved to /hunttms, so the button reloaded the page it was on.
 *   - Substring collisions. "Browse by Freight Job" went to /careers, "View
 *     Detail" to /live-tracking - because "job" and "eta" appear inside them.
 *   - Anchors that do not move. 122 labels fell back to the block they were
 *     already inside, so the click did nothing at all.
 *
 * The rule now: a CTA is a link only when it goes to another page in the site
 * index. Everything else is what it actually is - an in-page control that has
 * not been built - and is rendered as pending rather than as a live button
 * that lies. §3.6 forbids a placeholder from reading as a claim, and a dead
 * link is a claim that something is there.
 *
 * Every resolved link carries the destination's name from the index, so the
 * page says where it is going instead of asking the reader to guess from a
 * verb: "Explore the Ecosystem → Platform".
 */

import { TITLE } from "./ia"
import type { TzPage } from "./tz"

export type CtaTarget =
  | { kind: "route"; href: string; to: string }
  /** No destination exists yet: an unbuilt interaction, or an address the
      Product Registry (§15.3) still owes us - the store listing, the Telegram
      bot. Guessing either would be inventing a fact. `artifact` marks the
      labels that promise to hand the reader a thing - install, download,
      apply, subscribe - which is what stops the hero fallback from sending
      them somewhere else entirely. */
  | { kind: "pending"; artifact: boolean }

type Rule = [RegExp, string]

/* Verbs that promise delivery of something rather than a move through the
   site. A booking form is not an acceptable substitute for any of them. */
const ARTIFACT = /\b(install|download|add to chrome|get the app|apply|subscribe|copy)\b/i

/* Ordered, and every pattern is anchored on whole words: the collisions above
   all came from unanchored fragments. Product names first, because they appear
   inside sentences that also contain a generic verb. */
const RULES: Rule[] = [
  /* Before the product names: "See the LoadHunter Ecosystem" is about how the
     five fit together, not about the extension. */
  [/\becosystem\b|\bconnected system\b|\boperating stack\b|\bplatform\b/i, "/platform"],
  [/\ball (five )?products\b|\bthe five products\b|\bstarting (product|tool)\b|\bproduct (line|family|catalogue)\b/i, "/products"],

  [/\bloadhunter\b|\bextension\b|\bchrome\b/i, "/loadhunter"],
  [/\bhunttms\b|\bdispatch (day|board|workflow)\b|\btms\b/i, "/hunttms"],
  [/\bhuntdrive\b|\bdriver (app|workflow|experience|layer)\b/i, "/huntdrive"],
  [/\bhuntpay\b|\bload[- ]to[- ]cash\b|\binvoice\b|\bpayroll\b|\bfactoring\b/i, "/huntpay"],
  [/\bhuntos\b|\bcommand layer\b|\bexceptions?\b/i, "/huntos"],

  [/\bmarketplace\b|\bload board\b|\bfind freight\b/i, "/marketplace"],
  [/\btracking\b|\btrack a load\b|\bvisibility\b/i, "/live-tracking"],
  [/\bintegrations?\b|\bconnect(ed)? (products|operations|tools)\b|\bapi\b/i, "/integrations"],

  [/\bpricing\b|\bplans?\b|\bcost\b|\bquote\b/i, "/pricing"],
  [/\bcompare\b|\bcomparison\b|\bvs\b/i, "/compare"],
  [/\bcase stud(y|ies)\b|\bcustomer stor(y|ies)\b|\bread the story\b/i, "/case-studies"],
  [/\bcustomers?\b(?! stories)|\bwho (uses|runs)\b/i, "/customers"],

  [/\bguides?\b|\bchecklists?\b|\btemplates?\b/i, "/guides"],
  [/\bcalculators?\b|\btools?\b/i, "/tools"],
  [/\barticles?\b|\bblog\b|\bwriting\b/i, "/blog"],
  [/\bresources?\b|\blibrary\b|\blearn more\b/i, "/resources"],

  [/\bcarriers?\b/i, "/carriers"],
  [/\bowner[- ]operators?\b/i, "/owner-operators"],
  [/\bfleets?\b/i, "/fleets"],
  [/\bdispatchers?\b/i, "/dispatchers"],
  [/\bdrivers?\b/i, "/drivers"],
  [/\bfinance\b|\bfinance team\b/i, "/finance"],
  [/\baccounting\b|\bbookkeep/i, "/accounting"],
  [/\bbroker intelligence\b|\bbroker (score|history|reputation)\b/i, "/broker-intelligence"],
  [/\bbrokers?\b/i, "/brokers"],
  [/\bpartners?\b|\bpartnership\b/i, "/partners"],

  [/\bdemo\b|\bwalkthrough\b|\bworkflow review\b|\btalk to\b|\bbook a\b|\bcontact sales\b/i, "/demo"],
  [/\bcontact\b|\bget in touch\b/i, "/contact"],
  [/\bsupport\b|\bhelp\b/i, "/support"],
  [/\bstatus\b|\buptime\b|\bavailability\b/i, "/status"],
  [/\broadmap\b|\bwhat.s next\b|\bcoming\b/i, "/roadmap"],
  /* The legal pages own their own words: a privacy request belongs on the
     privacy page, not in the trust centre's marketing frame. */
  [/\bprivacy\b|\bsubprocessors?\b|\bdata (practices|terms)\b/i, "/privacy"],
  [/\bterms\b|\bacceptable use\b/i, "/terms"],
  [/\bcookies?\b|\banalytics\b/i, "/cookies"],
  [/\baccessibility\b|\bstandards\b/i, "/accessibility"],
  [/\btrust\b|\bsecurity\b|\bcompliance\b|\bdue[- ]diligence\b/i, "/trust"],
  [/\bcareers?\b|\bhiring\b|\bopen roles?\b/i, "/careers"],
  [/\bpress\b|\bnewsroom\b|\bmedia kit\b|\bcompany description\b|\bannouncement\b/i, "/press"],
  [/\babout\b|\bour story\b|\bthe team\b|\bhow we work\b|\bmission\b/i, "/about"],
  [/\bincident\b|\bmaintenance\b/i, "/status"],
  [/\bgo to home\b|\bhomepage\b/i, "/"],
  [/\bsign in\b|\blog in\b|\baccount\b/i, "/login"],
]

/**
 * Resolve a label against the site index.
 *
 * `pageUrl` is what makes a self-link impossible: the same label means "go to
 * huntTMS" on /carriers and "look at this section" on /hunttms, and only the
 * second one is not a link.
 */
export function resolveCta(label: string | undefined, pageUrl: string): CtaTarget {
  if (!label) return { kind: "pending", artifact: false }
  const artifact = ARTIFACT.test(label)
  for (const [test, href] of RULES) {
    if (!test.test(label)) continue
    /* Matched, and the destination is this page: the label names something on
       the page rather than a place to go. */
    if (href === pageUrl) return { kind: "pending", artifact }
    return { kind: "route", href, to: TITLE[href] ?? href }
  }
  return { kind: "pending", artifact }
}

/**
 * The page's own way forward, for the hero and the closer.
 *
 * A page whose every action is inert is a dead end, and §26.2 makes the demo
 * the ecosystem's next step - so on those pages the hero and the closer fall
 * back to it, and on /demo itself to contact, because the fallback may not
 * become a self-link either.
 *
 * Two limits, both learned from the build that had neither:
 *
 *   - A label that names its object never falls back. "Install LoadHunter -
 *     Free" pointed at /demo for exactly one build and that was worse than the
 *     dead link it replaced: the reader clicked install and got a booking
 *     form. Those stay pending until §15.3 hands over the store address.
 *   - The fallback only fires on a page that has no live action at all. On
 *     /pricing it turned "View Plans and Pricing" into a second demo button
 *     beside "Book a Personalized Demo" - two controls, one destination, and
 *     the first one lying about it. `pageHasLiveCta` is what asks the page
 *     before the label is allowed to borrow someone else's destination.
 */
export function resolveExit(
  label: string | undefined,
  pageUrl: string,
  deadEnd = true,
): CtaTarget {
  const target = resolveCta(label, pageUrl)
  if (target.kind === "route" || target.artifact || !deadEnd) return target
  const href = pageUrl === "/demo" ? "/contact" : "/demo"
  return { kind: "route", href, to: TITLE[href] ?? href }
}

/** Does anything the page specifies actually go somewhere? */
export function pageHasLiveCta(page: TzPage): boolean {
  const labels = [
    page.hero.ctaPrimary,
    page.hero.ctaSecondary,
    page.passport.primaryCta,
    ...page.blocks.map((b) => b.cta),
  ]
  return labels.some((l) => resolveCta(l, page.url).kind === "route")
}
