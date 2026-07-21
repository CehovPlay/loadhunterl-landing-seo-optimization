/**
 * loadhunter.io pricing logic + dispatcher-slider mapping, shared by the
 * desktop compare table and the flow-layout plan selector.
 *
 * Mirrors the PROD bundle math exactly (loadhunter.io, checked 2026-07-21):
 *   teamMult: n <= 2 → 1, n === 3 → 0.9, n >= 4 → 0.8
 *   per-seat = round2(base × teamMult), then × 0.9 for annual billing
 *   (NO re-rounding after the annual multiplier — prod does
 *   `(base*mult).toFixed(2) * yearlyMult`), total = round2(n × per-seat).
 * The displayed figure is the TEAM TOTAL per month, not per dispatcher.
 */
export function perDispatcher(base: number, n: number, annual: boolean): number {
  const teamMult = n >= 4 ? 0.8 : n === 3 ? 0.9 : 1
  const per = Math.round(base * teamMult * 100) / 100
  return annual ? per * 0.9 : per
}

/** The monthly team total — the figure both layouts display. */
export function planTotal(base: number, n: number, annual: boolean): number {
  return Math.round(perDispatcher(base, n, annual) * n * 100) / 100
}

/** Slider zones anchored to each breakpoint's badge positions (design px
 *  within the track): 1–3 dispatchers up to `at3`, the 3/4 boundary between
 *  the badges, then 4–50 up to `max`. */
export type SliderZones = { min: number; at3: number; at4: number; max: number }

export function knobToCount(px: number, z: SliderZones): number {
  if (px <= z.at3) return Math.round(1 + ((px - z.min) / (z.at3 - z.min)) * 2)
  if (px <= z.at4) return px < (z.at3 + z.at4) / 2 ? 3 : 4
  return Math.round(4 + ((px - z.at4) / (z.max - z.at4)) * 46)
}

/** Inverse of knobToCount: the knob px for a dispatcher count (used by keyboard
 *  stepping so the slider lands exactly on the target count). */
export function countToKnob(n: number, z: SliderZones): number {
  const c = Math.min(50, Math.max(1, n))
  if (c <= 3) return z.min + ((c - 1) / 2) * (z.at3 - z.min)
  return z.at4 + ((c - 4) / 46) * (z.max - z.at4)
}
