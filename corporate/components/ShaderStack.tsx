"use client"

import {
  Shader,
  Swirl,
  FlutedGlass,
  FilmGrain,
  Group,
  LinearGradient,
} from "shaders/react"

/**
 * The WebGPU shader stack behind the hero, ported from the extension landing's
 * linear (non-polar) mode. It is its own lazy chunk on purpose: the `shaders`
 * engine is TypeGPU plus WGSL codegen, about 600 KB minified, and importing it
 * statically would put it in the first-paint bundle for a page whose whole
 * point is that the promise reads instantly.
 *
 * Children are the INPUT of the wrapping effect, so the tree nests inside out:
 * Swirl at the bottom, FilmGrain on top.
 *
 * The palette is the landing's and it is already light - a white-to-#f0f0f0
 * pearl drift with the brand violet fenced to the upper band by a luminance
 * mask. That fence is what keeps it usable here: violet can never flood the
 * area where the H1 and the CTAs sit, so the type keeps its contrast against
 * paper rather than against whatever the shader happens to be doing.
 */
export default function ShaderStack({
  compact = false,
  onReady,
}: {
  /** Narrow viewports. The fluted bands are a fixed count across the canvas,
   *  so at 390px each one is four times wider than at 1440 and the chromatic
   *  aberration that reads as a soft refraction on desktop reads as holographic
   *  rainbow stripes on a phone. More bands, far less aberration. */
  compact?: boolean
  onReady?: () => void
}) {
  return (
    <Shader className="h-full w-full" style={{ width: "100%", height: "100%" }} onReady={onReady}>
      <FilmGrain strength={0.05}>
        <FlutedGlass
          aberration={compact ? 0.08 : 0.28}
          angle={31}
          frequency={compact ? 16 : 8}
          highlight={0.12}
          highlightSoftness={0}
          lightAngle={-90}
          refraction={4}
          shape="rounded"
          softness={1}
          speed={0.15}
        >
          <Group>
            {/* Base pearl drift. Without the white wash on top, an #eaeaea
                swirl through the fluted glass reads as loud holographic
                rainbows; #f0f0f0 keeps it a soft drift. */}
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} speed={0.3} />
            {/* Violet accent, luminance-masked by the fence below: it exists
                only where the fence is bright, which is the top of the band. */}
            <Swirl
              colorA="#9b79ce"
              colorB="#ffffff"
              detail={0.9}
              speed={0.3}
              opacity={compact ? 0.24 : 0.3}
              maskSource="drift-fence"
              maskType="luminance"
            />
            {/* The fence itself is never painted: white at 5% height, black by
                80%, so the drifting violet fades out well above the CTAs. */}
            <LinearGradient
              id="drift-fence"
              visible={false}
              colorA="#ffffff"
              colorB="#000000"
              start={{ x: 0.5, y: 0.05 }}
              end={{ x: 0.5, y: 0.8 }}
              edges="stretch"
            />
          </Group>
        </FlutedGlass>
      </FilmGrain>
    </Shader>
  )
}
