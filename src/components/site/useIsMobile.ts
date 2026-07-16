import { useSyncExternalStore } from "react"

/**
 * Mobile breakpoint switch for the flow-responsive mobile landing.
 *
 * < 768px  → MobileLanding (real responsive flow layout, no scaled canvas)
 * ≥ 768px  → the 1920 desktop canvas in DesignFrame (down-scaled below 1920)
 *
 * matchMedia change events fire exactly at the threshold crossing, so no
 * debounce is needed (unlike the old resize-driven useBreakpoint).
 */
const QUERY = "(max-width: 767px)"

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

const getSnapshot = () => window.matchMedia(QUERY).matches

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot)
}
