"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"

/**
 * Full-bleed decorative band behind the hero.
 *
 * The canvas has to span the whole viewport, not the centred 1400 content
 * column, so this measures the section it is mounted in and portals the band
 * to <body> at z-index -1, behind the page. It paints the base colour itself,
 * which is what covers the side gutters; the host section stays transparent so
 * the band shows through under the content too.
 *
 * IT USED TO RUN A WEBGPU SHADER. Removed 2026-08-20, by the owner's decision,
 * on a measurement:
 *
 *   - The shader pulled TypeGPU, and TypeGPU is 688 KB gzip. It was fetched at
 *     browser idle on every single visit to the homepage - no scroll, no
 *     interaction - which put the page at 967 KB against a §17.1 launch target
 *     of 240 KB. For a gradient.
 *   - The engine never ran in Safari or anything without WebGPU, so a large
 *     part of the audience was already seeing the static fallback below. What
 *     was removed is the version most visitors never saw.
 *   - For scale: the isometric freight route, which draws the load's path from
 *     booking to payment and is the thing §27 actually asks the page to show,
 *     costs 131 KB and only loads when its section is on screen. The decoration
 *     was five times the price of the content.
 *
 * What is left is what the fallback always was: the base colour, the caller's
 * static gradients, and the bottom fade that dissolves the band into the page
 * ground. No JavaScript is needed to see any of it - the effects here only
 * measure the box the band has to cover.
 */

export function ShaderBand({
  baseColor,
  extendBottom = 0,
  fallback,
  bottomFade,
}: {
  baseColor: string
  /** Extra px the band runs past the host section's bottom edge. */
  extendBottom?: number
  /** The band's decorative layer, painted over the base colour. */
  fallback?: ReactNode
  /** CSS background-image painted as the band's TOP layer. The hero uses it to
   *  dissolve the band into the page ground across the full viewport width,
   *  gutters included, so the band has no bottom edge to show against the next
   *  section. */
  bottomFade?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ top: number; height: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setBox({ top: r.top + window.scrollY, height: r.height + extendBottom })
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
  }, [extendBottom])

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {box
        ? createPortal(
            <div
              aria-hidden="true"
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
              {fallback}
              {bottomFade ? (
                <div className="absolute inset-0" style={{ backgroundImage: bottomFade }} />
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
