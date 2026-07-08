import { useEffect, useState } from "react"

export type Breakpoint = "desktop" | "tablet" | "phone"

/** Figma adaptive frames: Phone 390 (< 640), Tablet 768 (640–1023), Full HD 1920 (>= 1024) */
export function getBreakpoint(w: number): Breakpoint {
  if (w < 640) return "phone"
  if (w < 1024) return "tablet"
  return "desktop"
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    getBreakpoint(typeof window === "undefined" ? 1920 : window.innerWidth),
  )
  useEffect(() => {
    const onResize = () => setBp(getBreakpoint(document.documentElement.clientWidth))
    window.addEventListener("resize", onResize)
    onResize()
    return () => window.removeEventListener("resize", onResize)
  }, [])
  return bp
}
