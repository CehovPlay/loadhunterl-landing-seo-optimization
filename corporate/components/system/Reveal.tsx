"use client"

import { useEffect, useRef, type ElementType, type ReactNode } from "react"

/**
 * The entrance.
 *
 * The cosmoq reference brings almost everything in the same way - a short rise
 * out of a blur - and that single repeated gesture is most of why the page
 * reads as one object rather than a stack of sections. Copied here, with two
 * changes forced by our constraints.
 *
 * The closed state lives in CSS behind `html[data-js="on"]` (see globals.css),
 * not in an inline style, so the server HTML ships revealed: TZ acceptance
 * criteria require the full meaning without scripting, and an inline
 * `opacity: 0` would hide the page from exactly the visitors who cannot undo
 * it. The observer only ever removes the closed state, never re-applies it -
 * scrolling back up must not un-render the page.
 *
 * `delay` staggers siblings. Keep it under ~240ms in total across a group; the
 * reference staggers to guide the eye, not to make the visitor wait.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  immediate = false,
  className = "",
  children,
}: {
  as?: ElementType
  delay?: number
  /**
   * Renders with no entrance at all.
   *
   * Required for anything above the fold. The closed state is CSS, so a
   * reveal-gated element is invisible from first paint until an observer fires
   * and a 700ms transition finishes - which on the hero means the LCP element
   * is a blurred, transparent box for most of the budget the TZ allows for the
   * whole page. Below the fold that cost is free, because the visitor has not
   * arrived yet. Above it, the entrance has to go.
   */
  immediate?: boolean
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (immediate) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-reveal", "shown")
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // Intersecting is the normal case. The second condition covers a jump
        // that skips the element entirely - an anchor link, a restored scroll
        // position, a find-in-page hit - where the element goes from below the
        // viewport to above it without ever intersecting, and would otherwise
        // stay blurred out forever.
        const passed = entry.boundingClientRect.bottom < 0
        if (!entry.isIntersecting && !passed) return
        el.style.transitionDelay = passed ? "0ms" : `${delay}ms`
        el.setAttribute("data-reveal", "shown")
        io.disconnect()
      },
      // A little before the element's top edge arrives, so the settle finishes
      // roughly as it reaches comfortable reading height.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay, immediate])

  if (immediate) return <Tag className={className}>{children}</Tag>

  return (
    <Tag ref={ref} data-reveal="hidden" className={className}>
      {children}
    </Tag>
  )
}
