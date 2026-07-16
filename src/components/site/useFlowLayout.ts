import { useSyncExternalStore } from "react"

/**
 * Breakpoint switch between the two experiences:
 *
 * < 1024px  → the flow-responsive landing (src/sections/mobile/*): mobile-first
 *             layout, with `md:` (≥768px) Tailwind modifiers providing the
 *             tablet refinements — one codebase for phone + tablet.
 * ≥ 1024px  → the 1920 desktop canvas in DesignFrame (down-scaled below 1920).
 *
 * matchMedia change events fire exactly at the threshold crossing, so no
 * debounce is needed (unlike the old resize-driven useBreakpoint).
 */
const QUERY = "(max-width: 1023px)"

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

/** True below 1024px — the flow (phone + tablet) experience. */
export function useFlowLayout(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
