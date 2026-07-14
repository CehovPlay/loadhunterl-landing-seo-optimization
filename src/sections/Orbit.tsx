import { ShaderBand } from "@/components/site/ShaderBand"

/**
 * Figma: Group 2085665057 (914:23049) — reduced to its essence for the shader
 * experiment: the dotted rings, orbiting badge pills and PNG centre mark are
 * gone. The concentric-circle ShaderBand IS the orbit graphic now; only the
 * vector centre mark remains, sitting on the shared centre.
 */

const CX = 959
const CY = 382

export function Orbit() {
  return (
    <section className="relative h-[1389px] w-full">
      {/* animated shader background (experiment) — full-bleed behind the
          section; carries the white base. Its concentric circles share the
          old orbit system centre. */}
      <ShaderBand baseColor="#ffffff" polarCenter={{ x: 0.5, y: CY / 1389 }} />

      {/* centre mark — inline vector (120px), replaces the old PNG disc */}
      <img
        src="/figma/orbit-center-mark.svg"
        alt=""
        aria-hidden
        data-pulse
        loading="lazy"
        decoding="async"
        className="absolute size-[120px] max-w-none"
        style={{ left: CX - 60, top: CY - 60 }}
      />
    </section>
  )
}
