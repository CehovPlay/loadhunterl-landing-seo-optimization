/**
 * inview / loop-gate helpers — cut idle work from the page's many `repeat: -1`
 * animation loops and centralise device/motion capability checks.
 *
 * This landing renders on a single ~19,000px-tall canvas that is uniformly
 * scaled with one `transform: scale()`. Every infinite GSAP loop (marquees,
 * orbit rotation, beam pulses, float/pulse) otherwise keeps GSAP's shared
 * ticker and the compositor busy on every frame even when its section is far
 * off-screen. We gate each loop on an IntersectionObserver: play while the
 * anchor is near the viewport, pause once it leaves. On-screen behaviour is
 * pixel-identical — only wasted off-screen frames are removed.
 *
 * IntersectionObserver reports geometry in real viewport pixels and already
 * accounts for the DesignFrame's transform:scale, so gating stays correct at
 * every breakpoint (same basis the reveal cascade relies on).
 */

/* ------------------------------------------------------ capability checks --- */

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const isCoarsePointer = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches

export const isFinePointer = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches

/** Loops should run only with a fine pointer, no coarse touch, and motion on. */
export const shouldAnimateLoops = (): boolean => !prefersReducedMotion()

/* --------------------------------------------------------------- gating --- */

type Playable = { play: () => unknown; pause: () => unknown }

/**
 * Pause `anims` while `anchor` is off-screen, resume as it nears the viewport.
 * Starts paused. `rootMargin` pre-warms the loop slightly before it scrolls in
 * so there is no visible "jump to start" at the edge. Returns a disconnect fn.
 */
export function gateLoops(
  anchor: Element | null | undefined,
  anims: Playable | Playable[],
  rootMargin = "300px 0px 300px 0px",
): () => void {
  const list = Array.isArray(anims) ? anims : [anims]
  const play = () => list.forEach((a) => a.play())
  const pause = () => list.forEach((a) => a.pause())

  if (!anchor) {
    // no anchor to observe — just let it run (best-effort)
    play()
    return () => {}
  }

  pause()
  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1]
      if (e.isIntersecting) play()
      else pause()
    },
    { root: null, rootMargin, threshold: 0 },
  )
  io.observe(anchor)
  return () => io.disconnect()
}

/**
 * Batched variant: one shared IntersectionObserver for many independent
 * (element → its own animations) pairs — used for the scattered float/pulse
 * icons so we don't spin up one observer per element. Each element's anims
 * pause when that element leaves the viewport.
 */
export function gateEach(
  entries: { el: Element; anims: Playable | Playable[] }[],
  rootMargin = "200px 0px 200px 0px",
): () => void {
  if (!entries.length) return () => {}
  const map = new Map<Element, Playable[]>()
  for (const { el, anims } of entries) {
    map.set(el, Array.isArray(anims) ? anims : [anims])
    ;(Array.isArray(anims) ? anims : [anims]).forEach((a) => a.pause())
  }
  const io = new IntersectionObserver(
    (obs) => {
      for (const e of obs) {
        const anims = map.get(e.target)
        if (!anims) continue
        anims.forEach((a) => (e.isIntersecting ? a.play() : a.pause()))
      }
    },
    { root: null, rootMargin, threshold: 0 },
  )
  map.forEach((_, el) => io.observe(el))
  return () => io.disconnect()
}

/**
 * Toggle `will-change: transform` on `el` only while it (or `anchor`) is near
 * the viewport. A permanent will-change on a 6,000px marquee track keeps a
 * large composited texture resident even off-screen — texture pressure on
 * low-end mobile GPUs. Returns a disconnect fn.
 */
export function willChangeInView(
  el: HTMLElement | null | undefined,
  anchor: Element | null | undefined = el,
  rootMargin = "300px 0px 300px 0px",
): () => void {
  if (!el || !anchor) return () => {}
  el.style.willChange = "auto"
  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[entries.length - 1]
      el.style.willChange = e.isIntersecting ? "transform" : "auto"
    },
    { root: null, rootMargin, threshold: 0 },
  )
  io.observe(anchor)
  return () => io.disconnect()
}
