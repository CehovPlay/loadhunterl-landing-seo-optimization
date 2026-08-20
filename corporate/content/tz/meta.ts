/**
 * Re-exported so `PageSkeleton` can import the page lookup and the noindex set
 * without pulling the whole JSON into a client bundle by accident.
 */
export { byNum, byUrl, PAGES, NOINDEX, TEMPLATES } from "./index"
export { SITE_URL as SITE_URL_FALLBACK } from "@/content/registry"
