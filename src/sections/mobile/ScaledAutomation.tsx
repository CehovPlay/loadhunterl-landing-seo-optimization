import { useLayoutEffect, useRef, useState } from "react"
import { CtaAutomation } from "@/components/site/CtaAutomation"

const PANEL_W = 1129
const PANEL_H = 627

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

  return (
    <div ref={hostRef} className="w-full" style={{ height: PANEL_H * scale || undefined }}>
      {scale > 0 && (
        <div
          className="origin-top-left"
          style={{ width: PANEL_W, transform: `scale(${scale})` }}
        >
          <CtaAutomation className="relative" />
        </div>
      )}
    </div>
  )
}
