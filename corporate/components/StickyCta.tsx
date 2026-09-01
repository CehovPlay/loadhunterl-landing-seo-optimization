"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BLOCKS, CTA } from "@/content/home"
import { track } from "@/lib/analytics"

/**
 * Mobile sticky action.
 *
 * The tab's mobile rules allow this and fence it: "sticky CTA только после
 * первого proof". So it appears once the visitor has passed block 1 - not on
 * arrival, where it would cover the hero's own CTA - and it stands down again
 * once the page's final action is on screen, because two live conversion
 * surfaces at the same moment is the aggressive pattern the tab rules out.
 *
 * Phones only. On a laptop the header pill already carries the same action.
 */
export function StickyCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const first = document.getElementById(BLOCKS.one.id)
    const last = document.getElementById(BLOCKS.eight.id)
    if (!first) return

    /* A rect read on scroll rather than an IntersectionObserver: a jump - an
       anchor, a restored scroll position, a keyboard End - can take the page
       from above block 1 to below it without the observer ever seeing an
       intersection change, and the bar would then never appear. One rAF-gated
       read per scroll event is cheaper than getting that wrong. */
    let frame = 0
    const read = () => {
      frame = 0
      const passedFirst = first.getBoundingClientRect().bottom < 0
      const atFinal = last ? last.getBoundingClientRect().top < window.innerHeight : false
      setShow(passedFirst && !atFinal)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    read()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition duration-300 ease-out-quart lg:hidden"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(12px)",
        visibility: show ? "visible" : "hidden",
      }}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-rule bg-paper-2/90 p-1.5 pl-5 shadow-[var(--shadow-pill)] backdrop-blur-[10px]">
        <Link
          href={CTA.status.href}
          onClick={() => track("status_open", { CTA_position: "sticky" })}
          className="min-w-0 flex-1 truncate text-meta text-ink-3"
        >
          Availability
        </Link>
        <Link
          href={CTA.primary.href}
          onClick={() =>
            track("hero_primary_click", {
              product: "loadhunter",
              CTA_label: CTA.primary.label,
              CTA_position: "sticky",
              product_status: "Live",
            })
          }
          className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-violet px-5 text-small font-medium whitespace-nowrap text-white"
        >
          {CTA.primary.label}
        </Link>
      </div>
    </div>
  )
}
