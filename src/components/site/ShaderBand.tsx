import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain, Mirror, PolarCoordinates } from "shaders/react"

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
 */
export function ShaderBand({
  baseColor,
  polarCenter,
}: {
  baseColor: string
  /** When set, the fluted pattern is bent into concentric circles around this
   *  point (0..1 of the band) — matches the orbit-rings composition. */
  polarCenter?: { x: number; y: number }
}) {
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
              background: baseColor,
              zIndex: -1,
              pointerEvents: "none",
            }}
          >
            <Shader className="h-full w-full" style={{ width: "100%", height: "100%" }}>
              <FilmGrain strength={0.05}>
                {(() => {
                  // Polar (orbit) mode animates on its own: a violet Swirl —
                  // a couple of tones brighter/lighter than the brand #6F5197
                  // — drifts continuously, no cursor involvement. The linear
                  // (hero) mode keeps the cursor-driven violet ChromaFlow.
                  const input = polarCenter ? (
                    <Swirl colorA="#9B79CE" colorB="#F1ECFA" detail={1.7} speed={0.5} />
                  ) : (
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
                      {/* colorB stays slightly darker than white even on white
                          bands — a flat input gives FlutedGlass nothing to
                          refract and the whole effect vanishes */}
                      <Swirl colorA="#ffffff" colorB="#eaeaea" detail={1.7} />
                    </ChromaFlow>
                  )
                  const fluted = (
                    <FlutedGlass
                      aberration={0.61}
                      angle={polarCenter ? 90 : 31}
                      frequency={8}
                      highlight={0.12}
                      highlightSoftness={0}
                      lightAngle={-90}
                      refraction={4}
                      shape="rounded"
                      softness={1}
                      speed={0.15}
                    >
                      {input}
                    </FlutedGlass>
                  )
                  // Polar mode: horizontal flutes (angle 90) become constant-
                  // radius bands = concentric circles around polarCenter.
                  // Mirror first makes the input left-right symmetric, so the
                  // angular wrap seam (the horizontal line pointing left of
                  // the centre) lands on identical pixels and disappears.
                  return polarCenter ? (
                    <PolarCoordinates center={polarCenter} edges="mirror">
                      <Mirror center={{ x: 0.5, y: 0.5 }} angle={90} edges="mirror">
                        {fluted}
                      </Mirror>
                    </PolarCoordinates>
                  ) : (
                    fluted
                  )
                })()}
              </FilmGrain>
            </Shader>
          </div>,
          document.body,
        )}
    </div>
  )
}
