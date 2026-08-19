"use client"

import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { prefersReducedMotion } from "@/lib/motion"

/**
 * Full-bleed animated shader band, ported from the extension landing.
 *
 * The canvas has to span the whole viewport, not the centred 1400 content
 * column, so this measures the section it is mounted in and portals the band
 * to <body> at z-index -1, behind the page. It paints the base colour itself,
 * which is what covers the side gutters; the host section stays transparent so
 * the band shows through under the content too.
 *
 * Load order is deliberate, in this order:
 *
 *   1. the flat base colour paints immediately, identical to the shader's idle
 *      background, so there is never a hole where the band will be
 *   2. the static fallback gradients paint over it - cheap, decorative, and
 *      the permanent answer for anything without working WebGPU (Safari today)
 *   3. the WebGPU stack streams in at browser idle and covers both
 *
 * TZ §43.1 and §46.3 make that sequence non-negotiable: the first screen has
 * to be complete before any of this arrives, so nothing here is ever load
 * bearing for reading the page. Reduced motion stops at step 2, and so does
 * `?noshader`, which exists for headless screenshots and for bisecting jank.
 */
const ShaderStack = lazy(() => import("./ShaderStack"))

export function ShaderBand({
  baseColor,
  extendBottom = 0,
  fallback,
  bottomFade,
}: {
  baseColor: string
  /** Extra px the band runs past the host section's bottom edge. */
  extendBottom?: number
  /** Static stand-in painted UNDER the shader canvas. Keep it cheap. */
  fallback?: ReactNode
  /** CSS background-image painted as the band's TOP layer, above the canvas
   *  and the fallback. The hero uses it to dissolve the band into the page
   *  ground across the full viewport width, gutters included, so the band has
   *  no bottom edge to show against the next section. */
  bottomFade?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)
  const [engineReady, setEngineReady] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (new URLSearchParams(window.location.search).has("noshader")) return

    // Do not even START fetching the chunk until the browser is idle: it must
    // not compete with the first paint of the hero it sits behind.
    const start = () => setEngineReady(true)
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 1500 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(start, 350)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBox({ top: r.top + window.scrollY, height: r.height + extendBottom })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener("resize", measure)
    window.addEventListener("load", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", measure)
    }
  }, [extendBottom])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {box
        ? createPortal(
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: box.top,
                left: 0,
                right: 0,
                height: box.height,
                background: baseColor,
                zIndex: -1,
                pointerEvents: "none",
              }}
            >
              {fallback}
              {engineReady ? (
                // The wrapper is absolute on purpose: the fallback layer is
                // positioned, and only a positioned sibling later in DOM order
                // paints above it. An in-flow canvas would paint under.
                <div className="absolute inset-0">
                  <Suspense fallback={null}>
                    <ShaderStack compact={compact} />
                  </Suspense>
                </div>
              ) : null}
              {bottomFade ? (
                <div className="absolute inset-0" style={{ backgroundImage: bottomFade }} />
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
