import { Shader, Swirl, ChromaFlow, FlutedGlass, FilmGrain } from "shaders/react"

/**
 * Animated hero background (experiment): Swirl base → ChromaFlow (cursor-
 * reactive orange flow) → FlutedGlass refraction → FilmGrain, rendered by the
 * `shaders` WebGPU engine. Children act as the input of the wrapping effect,
 * so the stack nests inside-out: Swirl is the bottom layer, FilmGrain the top.
 * pointer-events-none keeps the canvas transparent to clicks; ChromaFlow
 * tracks the pointer globally, so it still reacts.
 */
export function HeroShaderBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
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
            downColor="#ff5f03"
            leftColor="#ff5f03"
            rightColor="#ff5f03"
            upColor="#ff5f03"
            momentum={13}
            radius={3.5}
          >
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
          </ChromaFlow>
        </FlutedGlass>
        </FilmGrain>
      </Shader>
    </div>
  )
}
