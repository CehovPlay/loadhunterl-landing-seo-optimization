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
  const [left, setLeft] = useState(0)
  const [height, setHeight] = useState<number>(0)

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return

    const update = () => {
      const vw = document.documentElement.clientWidth
      const s = Math.min(vw / width, maxScale)
      setScale(s)
      // center the SCALED canvas, not the layout box: margin:auto would offset
      // by (vw - width)/2 whenever the artboard is narrower than the viewport
      // (tablet 768 in a 640–1023 window, phone 390 above 390) and the
      // top-left-origin scale would then overflow the right edge by the same
      // amount — the whole landing looked pushed right. Non-zero only when
      // maxScale caps the scale (desktop canvas above 1920).
      setLeft(Math.max(0, (vw - width * s) / 2))
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

  // The inner canvas deliberately does NOT clip: decorative bleed (orbit rings,
  // marquee rows, the fullscreen-expanding ecosystem panel) is allowed to spill
  // into the >1920 side gutters, matching the full-bleed Figma 2K frame. The
  // OUTER wrapper still clips at the viewport, so nothing causes a horizontal
  // scrollbar.
  return (
    <div style={{ height, overflow: "hidden" }}>
      <div
        ref={inner}
        style={{
          width,
          marginLeft: left,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
