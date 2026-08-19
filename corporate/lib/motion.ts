/**
 * Motion tokens.
 *
 * Two curves cover this page. Ease-out-quart for anything entering or leaving
 * (the visitor triggered it, so it should start fast), ease-in-out-cubic for
 * anything already on screen that repositions. Scroll-scrubbed motion uses no
 * easing at all: the scrollbar is the clock, and easing on top of it makes the
 * page feel like it is lagging behind the wheel, which TZ §11.3 rules out.
 */
export const EASE = {
  out: "power3.out",
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  inOut: "power2.inOut",
  none: "none",
} as const

export const DUR = {
  micro: 0.12,
  ui: 0.24,
  enter: 0.5,
  illustrative: 0.9,
} as const

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function isCoarsePointer(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(pointer: coarse)").matches
}
