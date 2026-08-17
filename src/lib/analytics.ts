/**
 * GA4 loader, gated behind VITE_GA_ID so dev/preview builds ship no tracking.
 * Deploy with `VITE_GA_ID=G-XXXXXXXXXX npm run build` (or set it in the CI
 * env) to enable; without the var this module is a no-op.
 */
export function initAnalytics() {
  const id = import.meta.env.VITE_GA_ID as string | undefined
  if (!id) return

  const s = document.createElement("script")
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)

  const w = window as typeof window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args)
  }

  // LH-066 — Consent Mode v2 defaults BEFORE config: analytics/ad storage stay
  // denied until a consent banner grants them. A CMP updates these by calling
  // gtag("consent", "update", {...}); without one, GA4 runs in cookieless
  // (modelled) mode rather than dropping cookies without consent.
  w.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  })

  w.gtag("js", new Date())
  // UTM preservation: GA4 reads them off the URL, and the params must survive
  // client-side navigation, so they are never stripped from the address bar.
  w.gtag("config", id, { send_page_view: true })
}

/**
 * The approved event taxonomy (LH-066). Every CTA/control in the marketing
 * pages fires exactly one of these names — QA-007 checks them by name, so do
 * not invent variants; add to this union if the spec grows.
 */
export type TrackEvent =
  | "hero_trial_click"
  | "hero_chrome_click"
  | "nav_pricing_click"
  | "compatibility_click"
  | "feature_expand"
  | "pricing_toggle"
  | "dispatcher_count_change"
  | "plan_trial_click"
  | "review_source_click"
  | "blog_click"
  | "faq_expand"
  | "newsletter_submit"
  | "final_trial_click"
  | "final_chrome_click"
  | "demo_start"

/**
 * Pushes an approved event to the dataLayer (and GA4 when it is loaded).
 * Params must never carry PII — pass plan names, section ids, counts only.
 */
export function track(
  event: TrackEvent,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return
  const w = window as typeof window & {
    dataLayer?: unknown[]
    gtag?: (...a: unknown[]) => void
  }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
  w.gtag?.("event", event, params ?? {})
}
