import {
  Shader,
  Swirl,
  ChromaFlow,
  FlutedGlass,
  FilmGrain,
  Group,
  LinearGradient,
  Mirror,
  PolarCoordinates,
} from "shaders/react"

/**
 * The WebGPU shader stack of ShaderBand, split into its own lazy chunk: the
 * `shaders` engine (TypeGPU + WGSL codegen) is ~600 KB minified — statically
 * importing it here used to dominate the DesktopLanding bundle. The band's
 * flat base colour paints immediately from the host; this stack streams in
 * after and takes over seamlessly (same pixels where the shader idles).
 */
export default function ShaderStack({
  polarCenter,
}: {
  polarCenter?: { x: number; y: number }
}) {
  // Polar (orbit) mode animates on its own: a violet Swirl — a couple of
  // tones brighter/lighter than the brand #6F5197 — drifts continuously, no
  // cursor involvement. The linear (hero) mode keeps the cursor-driven violet
  // ChromaFlow.
  const input = polarCenter ? (
    // Violet is radially fenced so it can NEVER flood the section: in
    // pre-polar space y = radius, and the white LinearGradient overlay
    // (transparent → opaque along y) erases the violet Swirl from mid-radius
    // outward. After the polar bend the outer rings — most of the viewport —
    // stay white; the drifting violet lives only around the centre.
    <Group>
      {/* base: neutral drifting swirl — drives the ring fluting */}
      <Swirl colorA="#ffffff" colorB="#e2e2e2" detail={1.7} speed={0.35} />
      {/* violet accent, luminance-masked by the fence below: visible only
          where the fence is bright (inner radius), so it can never flood the
          whole section */}
      <Swirl
        colorA="#9B79CE"
        colorB="#ffffff"
        detail={0.9}
        speed={0.35}
        opacity={0.35}
        maskSource="violet-fence"
        maskType="luminance"
      />
      {/* the fence: bright at inner radius (pre-polar y≈0.3), black from
          mid-radius out; not painted itself */}
      <LinearGradient
        id="violet-fence"
        visible={false}
        colorA="#ffffff"
        colorB="#000000"
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 0.72 }}
        edges="stretch"
      />
    </Group>
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
      {/* colorB stays slightly darker than white even on white bands — a
          flat input gives FlutedGlass nothing to refract and the whole
          effect vanishes */}
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
  return (
    <Shader className="h-full w-full" style={{ width: "100%", height: "100%" }}>
      <FilmGrain strength={0.05}>
        {/* Polar mode: horizontal flutes (angle 90) become constant-radius
            bands = concentric circles around polarCenter. Mirror first makes
            the input left-right symmetric, so the angular wrap seam (the
            horizontal line pointing left of the centre) lands on identical
            pixels and disappears. */}
        {polarCenter ? (
          <PolarCoordinates center={polarCenter} edges="mirror">
            <Mirror center={{ x: 0.5, y: 0.5 }} angle={90} edges="mirror">
              {fluted}
            </Mirror>
          </PolarCoordinates>
        ) : (
          fluted
        )}
      </FilmGrain>
    </Shader>
  )
}
