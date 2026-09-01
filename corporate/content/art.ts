/**
 * Art direction, as data.
 *
 * Two references drive this site. The visual language is cosmoq
 * (cosmoq.framer.website) inverted to paper: an eyebrow with a hairline rule
 * over a wide H2 with its supporting copy pushed to the right column, cards
 * as lifted white objects, one recurring gradient orb, chips, and a text CTA
 * whose last word carries the accent. The narrative language is Vestora
 * (the scroll-story landing already analysed in the huntTMS carrier repo):
 * statement chapters between product blocks, copy that resolves word by word,
 * lists where exactly one item is awake, numbers that count, and one single
 * inversion into a dark band somewhere in the middle.
 *
 * The failure mode of building 47 pages from one spec is that all 47 look the
 * same. What stops that is not decoration - it is giving each page its own
 * RHYTHM: a different sequence of block archetypes, a different hero, and the
 * inversion landing in a different place. The archetypes are shared so the
 * site reads as one system; the order is the page's own.
 *
 * Every page below is assigned by hand. A page's rhythm has one entry per
 * block in its TZ tab, in order - `art.ts` never invents or drops a block.
 */

/** How the first screen is composed. */
export type HeroKind =
  /** Centred display type over the dust field, the cosmoq opening. */
  | "cosmic"
  /** Copy left, live product proof right - the layout most product tabs ask for. */
  | "split"
  /** One sentence at display size, resolving word by word. Vestora's opening. */
  | "statement"
  /** Copy over a full-bleed art field; for pages that carry an argument, not a product. */
  | "field"
  /** Narrow, centred, quiet. Legal, status and utility pages. */
  | "plain"

/** How one TZ block is laid out. */
export type Archetype =
  /** Copy and chips on one side, an art or proof panel on the other. Mirrors by index. */
  | "split"
  /** Sticky list of options on the left, the selected panel on the right. */
  | "selector"
  /** 01/02/03 rail with a progress fill, then one large card per step. */
  | "steps"
  /** Horizontal checkpoint trail - a load moving through stages. */
  | "journey"
  /** Asymmetric card grid, 2 up then 1 narrow. */
  | "bento"
  /** Full-width sentence resolving word by word. A chapter break. */
  | "statement"
  /** The single dark band. Counters, or a quote, or both. */
  | "inversion"
  /** A table: plans, capabilities, comparisons. */
  | "matrix"
  /** Horizontally scrolling library of cards. */
  | "rail"
  /** Personalised recap beside a form. */
  | "form"
  /** Grid of marks or icons over a light burst. */
  | "constellation"
  /** One capability, orb-centred, nothing else on screen. */
  | "orb"
  /** Ordered prose with hairline rules - legal and policy bodies. */
  | "document"

export type PageArt = {
  hero: HeroKind
  /** One archetype per TZ block, in document order. */
  rhythm: Archetype[]
  /**
   * The recurring object for this page. "orb" is the house motif; product pages
   * each get their own so the five products are distinguishable at a glance.
   */
  motif: "orb" | "trail" | "grid" | "ring" | "ledger" | "signal" | "prism"
}

const A = (hero: HeroKind, motif: PageArt["motif"], ...rhythm: Archetype[]): PageArt => ({
  hero,
  motif,
  rhythm,
})

/**
 * Keyed by TZ tab number, so the map and the spec cannot drift apart. The
 * comment on each line is the page's argument in one phrase - it is why the
 * rhythm is what it is.
 */
export const ART: Record<number, PageArt> = {
  // 01 The whole ecosystem as one road. Already built; kept here so the map is complete.
  1: A("cosmic", "trail", "journey", "split", "split", "split", "split", "bento", "inversion", "form"),
  // 02 Five products, one advantage - the page is a tour, so it repeats a shape deliberately.
  2: A("cosmic", "ring", "statement", "bento", "split", "split", "selector", "inversion", "form"),

  // --- The five products. Each one: prove the mechanism, then the seam. -----
  // 03 LoadHunter turns noise into a move: selection is the whole story.
  3: A("split", "signal", "selector", "split", "journey", "orb", "inversion", "form"),
  // 04 huntTMS removes handoffs: the day, laid out as steps.
  4: A("split", "trail", "steps", "split", "journey", "bento", "inversion", "form"),
  // 05 huntDRIVE is one clear next action: the phone is the hero of every block.
  5: A("split", "signal", "split", "steps", "orb", "bento", "inversion", "form"),
  // 06 huntPAY carries context to payment: a ledger that never loses the load.
  6: A("split", "ledger", "journey", "split", "matrix", "orb", "inversion", "form"),
  // 07 huntOS is exceptions-first: a control surface, so a grid reads truest.
  7: A("split", "grid", "bento", "selector", "split", "orb", "inversion", "form"),

  // --- Marketplace and audiences. Diagnostic first, recommendation second. --
  // 08 Marketplace: fragmented discovery becomes one workflow.
  8: A("split", "prism", "journey", "selector", "split", "bento", "inversion", "form"),
  // 09 Carriers: name the bottleneck, then earn the stack.
  9: A("field", "trail", "selector", "journey", "orb", "steps", "rail", "form"),
  // 10 Brokers: posted load to qualified conversation.
  10: A("field", "signal", "selector", "journey", "split", "bento", "rail", "form"),
  // 11 Live tracking: the fleet state without a check-call loop.
  11: A("split", "signal", "split", "journey", "selector", "bento", "inversion", "form"),
  // 12 Accounting: keep the money attached to the load.
  12: A("split", "ledger", "journey", "split", "matrix", "bento", "inversion", "form"),
  // 13 Partners: build with the workflow, not around it.
  13: A("field", "grid", "statement", "bento", "split", "constellation", "form"),
  // 14 Dispatchers: fewer tabs, more controlled actions.
  14: A("split", "trail", "selector", "journey", "split", "bento", "form"),
  // 15 Drivers: clarity from the driver seat.
  15: A("statement", "signal", "steps", "orb", "split", "bento", "form"),
  // 16 Finance: close the work without reconstructing it.
  16: A("split", "ledger", "journey", "matrix", "split", "bento", "form"),
  // 17 Owner-operators: one operation, fewer chores.
  17: A("statement", "trail", "selector", "steps", "split", "bento", "form"),
  // 18 Fleets: coordinate through one trail.
  18: A("split", "trail", "journey", "selector", "split", "bento", "form"),

  // --- Commercial and proof. --------------------------------------------
  // 19 Pricing: the matrix is the page; everything else supports it.
  19: A("plain", "ledger", "selector", "matrix", "split", "bento", "form"),
  // 20 Integrations: a constellation of connected systems.
  20: A("field", "grid", "constellation", "selector", "split", "matrix", "form"),
  // 21 Customers: proof organised by operating reality.
  21: A("statement", "prism", "selector", "rail", "split", "inversion", "form"),
  // 22 Case studies: the workflow, the evidence, the context.
  22: A("statement", "prism", "selector", "rail", "split", "inversion", "form"),

  // --- Resources. Libraries, so the rail archetype does the heavy lifting. --
  // 23 Resources hub.
  23: A("field", "grid", "selector", "rail", "rail", "split", "form"),
  // 24 Blog.
  24: A("field", "grid", "selector", "rail", "split", "rail", "form"),
  // 25 Guides.
  25: A("field", "trail", "selector", "steps", "rail", "split", "form"),
  // 26 Tools.
  26: A("field", "prism", "bento", "selector", "split", "rail", "form"),
  // 27 Compare: an honest table, and the reasons around it.
  27: A("plain", "grid", "selector", "matrix", "split", "rail", "form"),

  // --- Trust, roadmap, status. Evidence pages: quiet heroes, dense bodies. --
  // 28 Trust centre: inspectable before the sales call.
  28: A("plain", "grid", "selector", "matrix", "document", "split", "form"),
  // 29 Roadmap: live, moving, still a direction.
  29: A("statement", "trail", "selector", "steps", "split", "matrix", "form"),
  // 30 Status: current state, history, updates.
  30: A("plain", "signal", "split", "rail", "document", "matrix", "form"),

  // --- Company. ----------------------------------------------------------
  // 31 About: the company story following the customer workflow.
  31: A("statement", "orb", "statement", "constellation", "split", "bento", "form"),
  // 32 Careers.
  32: A("field", "orb", "statement", "bento", "split", "rail", "form"),
  // 33 Press.
  33: A("plain", "prism", "document", "rail", "split", "constellation", "form"),
  // 34 Contact: route to the right team, not a generic inbox.
  34: A("plain", "grid", "selector", "split", "matrix", "form", "document"),
  // 35 Demo: built around the workflow you need to fix.
  35: A("split", "trail", "selector", "steps", "split", "form", "document"),

  // --- Legal and utility. One document archetype, no ornament. -----------
  // 36 Privacy. Block 2 is explicitly a table ("Table must be counsel-approved");
  //    block 5 is a secure request workflow, which is a form and not prose.
  36: A("plain", "grid", "document", "matrix", "document", "document", "form"),
  // 37 Terms. Prose the whole way down - nothing here is tabular.
  37: A("plain", "grid", "document", "document", "document", "document", "document"),
  // 38 Cookies. Block 2 enumerates its own columns: name, provider, purpose,
  //    duration, category. Block 1 is a consent choice, so it gets the selector.
  38: A("plain", "grid", "selector", "matrix", "document", "document", "document"),
  // 39 404: the one page allowed a joke, so it gets the orb and a route out.
  39: A("cosmic", "orb", "split", "rail", "selector", "bento", "form"),

  // --- Templates for generated routes. -----------------------------------
  40: A("plain", "grid", "document", "split", "rail", "form", "document"),
  41: A("statement", "prism", "journey", "matrix", "split", "rail", "form"),
  42: A("plain", "grid", "matrix", "split", "selector", "rail", "form"),

  // --- Late additions to the registry. -----------------------------------
  // 43 Platform: the five products as one cycle. The ring is the page.
  43: A("cosmic", "ring", "journey", "selector", "split", "bento", "form"),
  // 44 Broker intelligence.
  44: A("split", "signal", "selector", "split", "journey", "bento", "form"),
  // 45 Accessibility statement.
  45: A("plain", "grid", "document", "document", "matrix", "document", "form"),
  // 46 Support.
  46: A("plain", "grid", "selector", "rail", "split", "matrix", "form"),
  // 47 Login: no marketing rhythm. The screen is the form.
  47: A("plain", "orb", "form", "document", "steps", "matrix", "document"),
}

export const artFor = (num: number): PageArt => {
  const art = ART[num]
  if (!art) throw new Error(`No art direction for TZ page ${num}`)
  return art
}
