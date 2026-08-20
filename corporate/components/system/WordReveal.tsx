"use client"

import { useEffect, useRef } from "react"

/**
 * A sentence that resolves as you scroll, word by word, grey to ink.
 *
 * This is the Vestora reference's signature move and the one gesture worth
 * importing wholesale: it turns a statement into something you read at the
 * page's pace rather than something you skim. Used sparingly - a statement
 * chapter, a hero, a footer sign-off - because a page where every paragraph
 * does this is a page you cannot skim at all.
 *
 * Driven from scroll position rather than from a timer, so scrubbing backwards
 * un-resolves it and the visitor stays in control. Under reduced motion the
 * whole sentence is simply ink from the start: the effect is decorative, and
 * the copy has to survive without it.
 */
export function WordReveal({
  text,
  /** Words rendered in the accent. Matched case-insensitively, punctuation ignored. */
  accent = [],
  /** Which surface the sentence sits on. Sets both ends of the colour ramp. */
  tone = "paper",
  className = "",
  as: Tag = "p",
}: {
  text: string
  accent?: string[]
  tone?: "paper" | "night"
  className?: string
  as?: "p" | "h1" | "h2" | "h3"
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"))
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.setAttribute("data-word", "on"))
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // The sentence resolves across the middle band of the viewport: it starts
      // when its top passes 82% of the screen and completes by the time its
      // bottom clears 38%. Those bounds keep the last word landing while the
      // sentence is still comfortably in view rather than as it exits.
      const start = vh * 0.82
      const end = vh * 0.38
      const progress = (start - rect.top) / Math.max(1, start - end + rect.height * 0.5)
      const lit = Math.round(Math.min(1, Math.max(0, progress)) * words.length)
      words.forEach((w, i) => w.setAttribute("data-word", i < lit ? "on" : "off"))
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
  }, [text])

  const accents = new Set(accent.map((w) => w.toLowerCase()))

  /* Custom properties rather than utility classes on the words: the resting
     and resolved colours are two ends of one ramp, and expressing them as a
     pair keeps a dark-surface statement from having to out-specify the global
     rule that owns the unresolved state. */
  const ramp =
    tone === "night"
      ? { "--word-on": "var(--color-night-ink)", "--word-off": "var(--color-night-ink-3)" }
      : undefined

  return (
    <Tag ref={ref as never} className={className} style={ramp as React.CSSProperties}>
      {text.split(" ").map((word, i) => {
        const bare = word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()
        return (
          <span key={i}>
            <span
              data-word="off"
              className={accents.has(bare) ? "text-violet-ink data-[word=off]:text-violet-soft" : ""}
            >
              {word}
            </span>
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        )
      })}
    </Tag>
  )
}
