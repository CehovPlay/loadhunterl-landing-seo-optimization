"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * A list where exactly one item is awake.
 *
 * Vestora's how-it-works sections run a list of steps at two brightness levels
 * and move the bright one as you scroll, so the visitor's eye never has to
 * choose where to look. It is the cheapest hierarchy device on either
 * reference and it survives the inversion unchanged - on paper the sleeping
 * items drop to 38% rather than dimming to grey.
 *
 * The awake index is driven by scroll unless `controlled` is passed, which
 * lets a selector drive it from a click instead. Without JavaScript every item
 * is awake, which is the correct fallback: a list is still a list.
 */
export function WakeList({
  count,
  children,
}: {
  count: number
  children: (awake: number) => ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [awake, setAwake] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Progress through the block, measured from the point its top reaches
      // two thirds of the screen to the point its bottom leaves the same line.
      const span = rect.height + vh * 0.34
      const progress = (vh * 0.66 - rect.top) / Math.max(1, span)
      setAwake(Math.min(count - 1, Math.max(0, Math.floor(progress * count))))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [count])

  return <div ref={ref}>{children(awake)}</div>
}

export function WakeItem({
  asleep,
  className = "",
  children,
}: {
  asleep: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div data-wake={asleep ? "asleep" : "awake"} className={className}>
      {children}
    </div>
  )
}
