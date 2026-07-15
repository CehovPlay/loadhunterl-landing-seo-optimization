import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

/**
 * Full-bleed animated shader band (experiment): Swirl base → ChromaFlow
 * (violet cursor flow) → FlutedGlass refraction → FilmGrain, rendered by the
 * `shaders` WebGPU engine. Children act as the input of the wrapping effect,
 * so the stack nests inside-out: Swirl is the bottom layer, FilmGrain the top.
 *
 * The canvas must span the whole viewport width, not the centered 1920
 * artboard — so (BleedBg-style) this component measures the section band it
 * is mounted in and portals the shader to <body> at z-index -1, painted
 * behind the page content. It carries the section's base colour itself,
 * covering the >1920 side gutters; the host section must stay transparent so
 * the shader shows through over the artboard too. Section content (rings,
 * pills, copy) paints above untouched.
 *
 * PERF: the actual shader tree lives in ShaderStack.tsx behind React.lazy —
 * the `shaders` engine is ~600 KB minified and used to dominate the
 * DesktopLanding chunk. The flat base-colour band (identical to the shader's
 * idle background) paints immediately; the WebGPU stack streams in after.
 *
 * Debug escape hatch: `?noshader` renders only the flat base-colour band (no
 * WebGPU) — for headless screenshots and bisecting shader-related jank.
 */
const noShader =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("noshader")

const ShaderStack = lazy(() => import("./ShaderStack"))

export function ShaderBand({
  baseColor,
  polarCenter,
  extendBottom = 0,
}: {
  baseColor: string
  /** When set, the fluted pattern is bent into concentric circles around this
   *  point (0..1 of the band) — matches the orbit-rings composition. */
  polarCenter?: { x: number; y: number }
  /** Extra px the band runs PAST the host section's bottom edge — for
   *  covering the transparent top of the next section (e.g. the ecosystem
   *  card's hang-over zone). Remember polarCenter y is a fraction of the
   *  EXTENDED band height. */
  extendBottom?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)
  // don't even START fetching the ~700 KB shader chunk until the browser is
  // idle — it must not compete with the LCP hero image / critical JS
  const [engineReady, setEngineReady] = useState(false)
  useEffect(() => {
    if (noShader) return
    const start = () => setEngineReady(true)
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 1500 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(start, 350) // Safari: no requestIdleCallback
    return () => clearTimeout(t)
  }, [])

  useLayoutEffect(() => {
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
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {box &&
        createPortal(
          <div
            aria-hidden
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
            {noShader || !engineReady ? null : (
              <Suspense fallback={null}>
                <ShaderStack polarCenter={polarCenter} />
              </Suspense>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
