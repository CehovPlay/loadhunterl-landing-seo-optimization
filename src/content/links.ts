/**
 * External URLs, in a component-free module.
 *
 * They live here rather than in Navbar.tsx so that pure content modules
 * (copy.ts, pages.ts, routes.meta.ts) can import them without pulling React in.
 * The build-time sitemap and prerender steps bundle those content modules in
 * Node, and that only works if the graph stays free of components.
 * Navbar re-exports these for existing call sites.
 */

/** Chrome Web Store listing — every "Add to Chrome" CTA leads here. */
export const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/loadhunter/ogepjnnfghfpkpjjieenkcppifhmmcdg"

/** Calendly event — every "Get Demo" CTA leads here (PROD loadhunter.io/demo
 *  embeds this same event inline; no backend involved). */
export const CALENDLY_URL = "https://calendly.com/loadhunterdev/30min"

/** The web app — trial/"start" CTAs lead here, mirroring PROD loadhunter.io. */
export const APP_URL = "https://app.loadhunter.io"
