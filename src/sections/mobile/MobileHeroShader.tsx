import { Suspense, lazy, useEffect, useState } from "react"
import { prefersReducedMotion } from "@/lib/inview"

const ShaderStack = lazy(() => import("@/components/site/ShaderStack"))

// same escape hatch as ShaderBand: `?noshader` keeps the static gradients
// only — for headless screenshots and bisecting shader-related jank
const noShader =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).has("noshader")

/**
 * Progressive hero shader for the flow layout (phone + tablet). The static
 * CSS gradients in MobileHero paint instantly and remain the ONLY visual on
 * devices without WebGPU or with reduced motion — nothing is lost there. On
 * capable devices the autonomous `drift` variant of the desktop hero shader
 * (no cursor involvement) streams in once the browser is idle and cross-fades
 * over the static tints.
 *
 * Perf: the `shaders` engine self-throttles — canvas DPR is capped at 1.5 on
 * mobile GPUs (maxPixelRatioForDevice) and rendering pauses via its own
 * IntersectionObserver whenever the hero leaves the viewport, so scrolling
 * the rest of the page costs nothing.
 */
export function MobileHeroShader() {
  const [gpuOk, setGpuOk] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (noShader || prefersReducedMotion() || !("gpu" in navigator)) return
    let alive = true
    // don't compete with the LCP hero paint / critical JS: probe the adapter
    // (and only then fetch the ~700 KB engine chunk) on browser idle
    const probe = () => {
      ;(navigator as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
        ?.requestAdapter()
        .then((adapter) => {
          if (alive && adapter) setGpuOk(true)
        })
        .catch(() => {})
    }
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(probe, { timeout: 2500 })
      return () => {
        alive = false
        cancelIdleCallback(id)
      }
    }
    const t = setTimeout(probe, 600) // Safari: no requestIdleCallback
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [])

  if (!gpuOk) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
      style={{ opacity: shown ? 1 : 0 }}
    >
      <Suspense fallback={null}>
        <ShaderStack drift onReady={() => setShown(true)} />
      </Suspense>
      {/* re-apply the hero's bottom fade so the shader dissolves into the
          var(--color-bg-light) partner band exactly like the static background does */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(250,250,250,0) 75%, var(--color-bg-light) 100%)",
        }}
      />
    </div>
  )
}
