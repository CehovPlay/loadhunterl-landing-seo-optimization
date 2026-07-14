import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from "shaders/react"

/**
 * Animated hero background (experiment): Swirl base → ChromaFlow (violet
 * cursor flow) → FlutedGlass refraction → FilmGrain, rendered by the
 * `shaders` WebGPU engine. Children act as the input of the wrapping effect,
 * so the stack nests inside-out: Swirl is the bottom layer, FilmGrain the top.
 *
 * FULL-BLEED: the canvas must span the whole viewport width, not the centered
 * 1920 artboard — so (BleedBg-style) this component measures the hero band it
 * is mounted in and portals the shader to <body> at z-index -1, painted behind
 * the page content. It carries the hero's #EFEFEF base itself, covering the
 * >1920 side gutters; the Hero section stays transparent so the shader shows
 * through over the artboard too.
 */
export function HeroShaderBg() {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBox({ top: r.top + window.scrollY, height: r.height })
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
  }, [])

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
              background: "#EFEFEF",
              zIndex: -1,
              pointerEvents: "none",
            }}
          >
            <Shader className="h-full w-full" style={{ width: "100%", height: "100%" }}>
              <FilmGrain strength={0.05}>
                <FlutedGlass
                  aberration={0.61}
                  angle={31}
                  frequency={8}
                  highlight={0.12}
                  highlightSoftness={0}
                  lightAngle={-90}
                  refraction={4}
                  shape="rounded"
                  softness={1}
                  speed={0.15}
                >
                  <ChromaFlow
                    baseColor="#ffffff"
                    downColor="#6f5197"
                    leftColor="#6f5197"
                    rightColor="#6f5197"
                    upColor="#6f5197"
                    momentum={13}
                    radius={3.5}
                    opacity={0.55}
                  >
                    <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
                  </ChromaFlow>
                </FlutedGlass>
              </FilmGrain>
            </Shader>
          </div>,
          document.body,
        )}
    </div>
  )
}
