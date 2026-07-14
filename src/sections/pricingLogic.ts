/**
 * loadhunter.io pricing logic + dispatcher-slider mapping, shared by the
 * tablet and phone pricing sections (the desktop deck keeps its own copy in
 * Pricing.tsx with design-anchored desktop constants).
 *
 * team discount: n === 3 → -10%, n >= 4 → -20%;
 * annual billing → extra -10%;
 * per-dispatcher price truncated to cents, then multiplied by n.
 */
export function planTotal(base: number, n: number, annual: boolean): number {
  const teamMult = n >= 4 ? 0.8 : n === 3 ? 0.9 : 1
  const annualMult = annual ? 0.9 : 1
  const per = Math.floor(base * teamMult * annualMult * 100) / 100
  return Math.round(per * n * 100) / 100
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
