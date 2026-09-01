/**
 * Redirect Registry - TZ §14.3: "старый URL, новый URL, тип перенаправления и
 * состояние проверки", and §10.1: before any address changes, a map of old URL,
 * new URL, 301 and the check result.
 *
 * The site has no history yet, so there is no legacy traffic to catch. What
 * there is instead is §5.2's list of shapes that must never resolve:
 * /products/loadhunter, /solutions/carriers, /blog/article-name,
 * /resources/guides/name. Those are the addresses a partner, an old deck or a
 * hand-written link will use, because they are what every other SaaS site
 * looks like. Sending them to the real page costs one line each and is the
 * difference between a 404 and a visit.
 *
 * `verified` is §14.3's "состояние перенаправления": a rule is not finished
 * when it is written, it is finished when `scripts/redirects.mjs` has followed
 * it and seen a 200 at the other end. All 17 were checked that way on
 * 2026-08-20; a new rule starts at false and stays there until the script says
 * otherwise.
 */

export type RedirectRecord = {
  /** Next.js source pattern. `:slug` captures a segment. */
  from: string
  to: string
  /** 301 unless the move is genuinely temporary. */
  permanent: boolean
  /** Why it exists, so an unexplained rule is never inherited. */
  reason: string
  verified: boolean
}

export const REDIRECTS: RedirectRecord[] = [
  /* §5.2 - /products is a catalogue, not a parent address. */
  { from: "/products/loadhunter", to: "/loadhunter", permanent: true, reason: "§5.2 forbids nested product URLs", verified: true },
  { from: "/products/hunttms", to: "/hunttms", permanent: true, reason: "§5.2 forbids nested product URLs", verified: true },
  { from: "/products/huntdrive", to: "/huntdrive", permanent: true, reason: "§5.2 forbids nested product URLs", verified: true },
  { from: "/products/huntpay", to: "/huntpay", permanent: true, reason: "§5.2 forbids nested product URLs", verified: true },
  { from: "/products/huntos", to: "/huntos", permanent: true, reason: "§5.2 forbids nested product URLs", verified: true },

  /* §5.2 - there is no /solutions segment; role pages are first level. */
  { from: "/solutions/carriers", to: "/carriers", permanent: true, reason: "§5.2 forbids a /solutions segment", verified: true },
  { from: "/solutions/brokers", to: "/brokers", permanent: true, reason: "§5.2 forbids a /solutions segment", verified: true },
  { from: "/solutions/dispatchers", to: "/dispatchers", permanent: true, reason: "§5.2 forbids a /solutions segment", verified: true },
  { from: "/solutions/drivers", to: "/drivers", permanent: true, reason: "§5.2 forbids a /solutions segment", verified: true },
  { from: "/solutions/fleets", to: "/fleets", permanent: true, reason: "§5.2 forbids a /solutions segment", verified: true },
  { from: "/solutions/owner-operators", to: "/owner-operators", permanent: true, reason: "§5.2 forbids a /solutions segment", verified: true },
  { from: "/solutions/:slug", to: "/carriers", permanent: true, reason: "§5.2 - any other /solutions address lands on the role hub", verified: true },

  /* §5.2 - articles, guides and cases sit directly after the domain. The
     catalogue keeps its address; the nested form goes to the catalogue,
     because the slug behind it may not exist yet. */
  { from: "/blog/:slug", to: "/:slug", permanent: true, reason: "§5.2 - articles live at the root", verified: true },
  { from: "/resources/guides/:slug", to: "/:slug", permanent: true, reason: "§5.2 - guides live at the root", verified: true },
  { from: "/resources/:slug", to: "/resources", permanent: true, reason: "§5.2 - /resources creates no nested addresses", verified: true },
  { from: "/case-studies/:slug", to: "/:slug", permanent: true, reason: "§5.2 - cases live at the root", verified: true },

  /* The build-review page. It is out of the index and out of robots already;
     when it is deleted before launch this rule is what keeps the address from
     becoming a 404 in someone's bookmarks. */
  { from: "/sitemap", to: "/site-map", permanent: false, reason: "Common guess for the human site map", verified: true },
]

/** Shape Next.js wants in `next.config`. */
export const nextRedirects = () =>
  REDIRECTS.map(({ from, to, permanent }) => ({ source: from, destination: to, permanent }))

export const unverifiedRedirects = (): RedirectRecord[] => REDIRECTS.filter((r) => !r.verified)
