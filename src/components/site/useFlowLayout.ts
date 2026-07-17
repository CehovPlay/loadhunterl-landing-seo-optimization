import { useSyncExternalStore } from "react"

/**
 * Breakpoint switch between the two experiences:
 *
 * < 1920px  → the flow-responsive landing (src/sections/mobile/*): mobile-first
 *             layout, with `md:` (≥768px) tablet and `lg:` (≥1024px) / `xl:`
 *             (≥1280px) / `2xl:` (≥1536px) laptop-desktop refinements — one
 *             codebase for phone → tablet → laptop. Adapted from the desktop
 *             design so laptops read as a real desktop layout, not a shrunk
 *             canvas or a stretched tablet column.
 * ≥ 1920px  → the pixel-perfect 1920 desktop canvas in DesignFrame, held at
 *             native size (maxScale={1}) and centered with side gutters.
 *
 * matchMedia change events fire exactly at the threshold crossing, so no
 * debounce is needed (unlike the old resize-driven useBreakpoint).
 */
const QUERY = "(max-width: 1919px)"

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
