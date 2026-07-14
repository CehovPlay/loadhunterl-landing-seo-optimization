import { useEffect, useState } from "react"

export type Breakpoint = "desktop" | "hd" | "tablet" | "phone"

/** Figma adaptive frames: Phone 390 (< 640), Tablet 768 (640–1023), HD 1440 (1024–1919), Full HD 1920 (>= 1920) */
export function getBreakpoint(w: number): Breakpoint {
  if (w < 640) return "phone"
  if (w < 1024) return "tablet"
  if (w < 1920) return "hd"
  return "desktop"
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    getBreakpoint(
      // measure with clientWidth (excludes the scrollbar) on both the initial
      // state AND the resize handler, so the first paint and post-mount agree —
      // reading innerWidth here vs clientWidth below could straddle 640/1024 and
      // force an immediate remount/flash.
      typeof document === "undefined" ? 1920 : document.documentElement.clientWidth,
    ),
  )
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    const measure = () => setBp(getBreakpoint(document.documentElement.clientWidth))
    const onResize = () => {
      // debounce: crossing 640/1024 tears down and rebuilds the entire section
      // tree + Lenis + reveal — the single most expensive frame in the app.
      // Only rebuild once the drag/rotation settles.
      clearTimeout(t)
      t = setTimeout(measure, 150)
    }
    measure() // correct any first-paint mismatch immediately
    window.addEventListener("resize", onResize)
    return () => {
      clearTimeout(t)
      window.removeEventListener("resize", onResize)
    }
  }, [])
  return bp
}
