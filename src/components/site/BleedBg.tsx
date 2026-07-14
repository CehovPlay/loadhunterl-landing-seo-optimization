import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

/**
 * Full-bleed background for a light section without un-clipping the design canvas.
 *
 * The canvas (DesignFrame) stays `overflow: hidden` so decorative content (glows,
 * orbit rings) is clipped at the centered 1920px artboard. This component instead
 * measures the wrapped section's position in the document and portals a
 * full-viewport-width colour band to <body>, painted BEHIND the canvas (z-index
 * -1, above the body background). In the side gutters that appear above 1920px the
 * band shows through; over the centered artboard the section's own background
 * covers it. Below 1920 the canvas fills the viewport and hides the band entirely.
 *
 * getBoundingClientRect returns the post-transform (visual) box, so at scale 1 the
 * band lines up exactly with the section; we re-measure on resize / load / content
 * growth (ResizeObserver) since the canvas scale and layout shift with viewport.
 */
export function BleedBg({
  color,
  children,
}: {
  color: string
  children: React.ReactNode
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
    <div ref={ref}>
      {box &&
        createPortal(
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: box.top,
              // left:0 + right:0 spans the document content width (excludes the
              // scrollbar) — `width: 100vw` would include it and add a 15px
              // horizontal scrollbar. The band still covers both side gutters.
              left: 0,
              right: 0,
              height: box.height,
              background: color,
              zIndex: -1,
              pointerEvents: "none",
            }}
          />,
          document.body,
        )}
      {children}
    </div>
  )
}
