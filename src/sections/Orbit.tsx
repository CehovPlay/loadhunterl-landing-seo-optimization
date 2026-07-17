import { ShaderBand } from "@/components/site/ShaderBand"

/**
 * Figma: Group 2085665057 (914:23049) — reduced to its essence for the shader
 * experiment: the dotted rings, orbiting badge pills and PNG centre mark are
 * gone. The concentric-circle ShaderBand IS the orbit graphic now; only the
 * vector centre mark remains, sitting on the shared centre.
 */

const CX = 959
const CY = 382
/** The band runs past the section bottom to fill the ecosystem card's
 *  hang-over zone and 1000px beyond (card bottom = eco top + 377), so the white
 *  band stays visible until the pinned eco card expands to full screen.
 *  Ecosystem's own bg starts at that same y. */
const EXTEND = 1377

export function Orbit() {
  return (
    <section className="relative h-[1389px] w-full">
      {/* animated shader background (experiment) — full-bleed behind the
          section; carries the white base. Its concentric circles share the
          old orbit system centre. */}
      <ShaderBand
        baseColor="var(--color-white)"
        polarCenter={{ x: 0.5, y: CY / (1389 + EXTEND) }}
        extendBottom={EXTEND}
      />

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
