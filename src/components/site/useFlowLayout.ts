import { useSyncExternalStore } from "react"

/**
 * Breakpoint switch between the two experiences:
 *
 * < 1024px  → the flow-responsive landing (src/sections/mobile/*): mobile-first
 *             layout, with `md:` (≥768px) tablet refinements — phone + tablet.
 * ≥ 1024px  → the 1920 desktop canvas in DesignFrame: it fills the width by
 *             scaling down (vw/1920 ≈ 0.53 at 1024 → 1.0 at 1920) and holds at
 *             native size above 1920 (maxScale={1}), centered with gutters. So
 *             1024–1920 is the desktop design, adapted by uniform scale
 *             (user 2026-07-21: the stretched flow layout on sub-HD laptop
 *             widths read poorly — the full desktop design wins there).
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
