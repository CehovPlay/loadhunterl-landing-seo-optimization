import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * Renders children on a fixed `width`px design canvas (the Figma artboard width)
 * and uniformly scales it to the viewport width. Keeps hand-built HTML sections
 * and Figma image slices pixel-identical to the design at every screen size.
 *
 * `maxScale` caps how far the canvas is allowed to scale UP. The Figma adaptive
 * frames (2K 2560 vs Full HD 1920) keep the content block at identical pixel
 * sizes and merely center it with side gutters — i.e. above the artboard width
 * the design must NOT grow. Passing maxScale={1} for the desktop artboard locks
 * the canvas at its 1920 size beyond 1920px viewports and centers it, instead of
 * blowing everything up to 1.33×/2× on 2K/4K screens. Below the artboard width
 * the scale is still vw/width (unchanged down-scaling), and margin:auto collapses
 * to 0 because the 1920 layout box is wider than the viewport — so it stays
 * pinned left and scales down from the top-left origin exactly as before.
 */
export function DesignFrame({
  width = 1920,
  maxScale = Infinity,
  children,
}: {
  width?: number
  maxScale?: number
  children: React.ReactNode
}) {
  const inner = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number>(0)

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return

    const update = () => {
      const vw = document.documentElement.clientWidth
      const s = Math.min(vw / width, maxScale)
      setScale(s)
      setHeight(el.offsetHeight * s)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [width, maxScale])

  // keep height in sync once images/fonts load
  useEffect(() => {
    const onLoad = () => {
      const el = inner.current
      if (!el) return
      const vw = document.documentElement.clientWidth
      setHeight(el.offsetHeight * Math.min(vw / width, maxScale))
    }
    window.addEventListener("load", onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [width, maxScale])

  // Clip decorative bleed (hero glow, orbit rings, etc.) to the centered canvas.
  // The OUTER wrapper is full viewport width, so above 1920 its overflow:hidden
  // clips at the viewport, NOT the 1920 artboard — content overflowing the inner
  // would leak into the side gutters. So the INNER (the 1920 canvas) must clip
  // too. Full-bleed section BACKGROUNDS are unaffected: <BleedBg> portals a
  // full-width colour band to <body>, outside this clipped box.
  return (
    <div style={{ height, overflow: "hidden" }}>
      <div
        ref={inner}
        style={{
          width,
          margin: "0 auto",
          overflow: "hidden",
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
