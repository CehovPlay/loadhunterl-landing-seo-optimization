import { useLayoutEffect, useRef, useState } from "react"
import { CtaAutomation } from "@/components/site/CtaAutomation"

const PANEL_W = 1129
const PANEL_H = 627
/* the desktop composition carries generous empty margins — on the PHONE break
   zoom it inside the box and crop the edges so the content reads larger;
   tablet keeps the untouched desktop framing */
const PHONE_ZOOM = 1.22

/**
 * The REAL desktop "One click automation" panel (CtaAutomation — vector
 * dashes, beam volleys, glass balls), uniformly scaled to the flow-layout
 * container width. The beams are GSAP dash-offset tweens on SVG paths, so
 * they run fine inside a scale transform.
 */
export function ScaledAutomation() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const measure = () => setScale(host.getBoundingClientRect().width / PANEL_W)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [])

  const zoom = typeof window !== "undefined" && window.innerWidth < 768 ? PHONE_ZOOM : 1
  const boxH = PANEL_H * scale
  const s = scale * zoom
  return (
    <div
      ref={hostRef}
      className="w-full overflow-hidden rounded-[12px]"
      style={{ height: boxH || undefined }}
    >
      {scale > 0 && (
        <div
          className="origin-top-left"
          style={{
            width: PANEL_W,
            transform: `translate(${-(PANEL_W * s - PANEL_W * scale) / 2}px, ${-(PANEL_H * s - boxH) / 2}px) scale(${s})`,
          }}
        >
          <CtaAutomation className="relative" />
        </div>
      )}
    </div>
  )
}
