import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * Renders children on a fixed `width`px design canvas (the Figma artboard width)
 * and uniformly scales it to the viewport width. Keeps hand-built HTML sections
 * and Figma image slices pixel-identical to the design at every screen size.
 */
export function DesignFrame({
  width = 1920,
  children,
}: {
  width?: number
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
      const s = vw / width
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
  }, [width])

  // keep height in sync once images/fonts load
  useEffect(() => {
    const onLoad = () => {
      const el = inner.current
      if (!el) return
      const vw = document.documentElement.clientWidth
      setHeight(el.offsetHeight * (vw / width))
    }
    window.addEventListener("load", onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [width])

  return (
    <div style={{ height, overflow: "hidden" }}>
      <div
        ref={inner}
        style={{
          width,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
