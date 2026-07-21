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
        fallback={
          // Safari / no-WebGPU stand-in: the shader IS the orbit graphic, so
          // without it the section was a bare white void. Dotted concentric
          // rings + a soft violet core echo the composition statically.
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div
              className="absolute"
              style={{
                left: "50%",
                top: CY,
                width: 0,
                height: 0,
              }}
            >
              <svg
                width={2400}
                height={2400}
                viewBox="0 0 2400 2400"
                className="absolute"
                style={{ left: -1200, top: -1200 }}
              >
                {[190, 330, 470, 610, 750, 890, 1030].map((r, i) => (
                  <circle
                    key={r}
                    cx={1200}
                    cy={1200}
                    r={r}
                    fill="none"
                    stroke={`rgba(20,18,28,${0.09 - i * 0.01})`}
                    strokeWidth="1.5"
                    strokeDasharray="2 7"
                  />
                ))}
              </svg>
              <div
                className="absolute rounded-full"
                style={{
                  left: -420,
                  top: -420,
                  width: 840,
                  height: 840,
                  background:
                    "radial-gradient(circle, rgba(155,121,206,0.20) 0%, rgba(155,121,206,0.08) 45%, rgba(155,121,206,0) 70%)",
                }}
              />
            </div>
          </div>
        }
      />

      {/* centre mark — inline vector (120px), replaces the old PNG disc */}
      <img
        src="/figma/orbit-center-mark.svg"
        alt=""
        aria-hidden
        data-float
        loading="lazy"
        decoding="async"
        className="absolute size-[120px] max-w-none"
        style={{ left: CX - 60, top: CY - 60 }}
      />
    </section>
  )
}
