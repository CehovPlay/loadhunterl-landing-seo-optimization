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
  w.gtag("js", new Date())
  w.gtag("config", id)
}
