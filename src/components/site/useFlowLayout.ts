import { useSyncExternalStore } from "react"

/**
 * Breakpoint switch between the two experiences:
 *
 * < 1280px  → the flow-responsive landing (src/sections/mobile/*): mobile-first
 *             layout, with `md:` (≥768px) tablet refinements — phone + tablet.
 * ≥ 1280px  → the 1920 desktop canvas in DesignFrame: it fills the width by
 *             scaling down (vw/1920 ≈ 0.67 at 1280 → 1.0 at 1920) and holds at
 *             native size above 1920 (maxScale={1}), centered with gutters. So
 *             1280–1920 is the desktop design, adapted by uniform scale.
 *
 * matchMedia change events fire exactly at the threshold crossing, so no
 * debounce is needed (unlike the old resize-driven useBreakpoint).
 */
const QUERY = "(max-width: 1279px)"

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
