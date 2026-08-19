/**
 * Analytics dispatch.
 *
 * TZ tab 01 names seven events for this page and one required parameter set,
 * so both live here rather than being spelled out at each call site: a typo in
 * an event name is invisible in review and fatal in reporting.
 *
 * Nothing is sent anywhere yet. Events are pushed to window.dataLayer, which is
 * what a tag manager reads, and mirrored to a DOM CustomEvent so the wiring can
 * be verified in the console before any vendor is chosen. TZ §45 requires the
 * consent gate to sit in front of the vendor, not in front of this queue.
 *
 * PII never enters a payload (tab 01, analytics section). The route selector
 * sends the chosen scenario, not the person: role, job and size are closed
 * option ids, and the form fields that would carry identity are not read here.
 */

export type PageEvent =
  | "hero_primary_click"
  | "stack_builder_start"
  | "stack_builder_complete"
  | "road_stage_view"
  | "product_proof_open"
  | "status_open"
  | "final_cta_click"

/** The required parameter set for template group A (tabs 01-12). */
type Params = {
  product?: string
  audience?: string
  CTA_label?: string
  CTA_position?: string
  proof_type?: string
  product_status?: string
  [key: string]: string | undefined
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: PageEvent, params: Params = {}) {
  if (typeof window === "undefined") return

  const payload: Record<string, unknown> = {
    event,
    page_path: window.location.pathname,
    page_type: "home",
    /* experiment_id and the UTM set are read from the URL rather than
       hard-coded, so an unbranded visit sends the parameter as absent instead
       of as a fabricated value. */
    experiment_id: new URLSearchParams(window.location.search).get("experiment_id") ?? undefined,
    ...utm(),
    ...params,
  }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)
  window.dispatchEvent(new CustomEvent("lh:analytics", { detail: payload }))
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const

function utm(): Record<string, string> {
  const search = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    const value = search.get(key)
    if (value) out[key] = value
  }
  return out
}
