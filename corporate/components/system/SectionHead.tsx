import type { ReactNode } from "react"
import { Reveal } from "./Reveal"

/**
 * The section opening, lifted from cosmoq.
 *
 * Three parts, always in this order: a small label with a mark beside it and a
 * hairline running out to the edge of the content column, then a wide heading
 * on the left with its supporting sentence parked in the right column at body
 * size. The size gap between the two - roughly 4:1 - is what makes the pattern
 * work; matching them turns it into an ordinary two-column header.
 *
 * The reference sets the label in caps. We do not: interface text on this site
 * is sentence case throughout, so the label earns its separation from letter
 * spacing and colour instead. Abbreviations are the only caps that survive.
 *
 * `rule` shortens the hairline. The reference varies it - full width over wide
 * sections, half width where the section's content only occupies the left
 * column - and that variation is worth keeping, because a rule that always
 * runs the full width stops being a compositional decision.
 */
export function SectionHead({
  label,
  mark,
  title,
  supporting,
  rule = "full",
  align = "split",
}: {
  label: string
  /** A small glyph in the label row. The reference uses a different one per section. */
  mark?: ReactNode
  title: ReactNode
  supporting?: string
  rule?: "full" | "half" | "none"
  /** "split" puts supporting copy in the right column; "stack" keeps it under the title. */
  align?: "split" | "stack"
}) {
  return (
    <header className="mb-12 md:mb-16">
      <Reveal>
        <div
          className={
            "flex items-center gap-3 " +
            (rule === "half" ? "md:max-w-[52%]" : "")
          }
        >
          {mark ? <span className="text-ink-4 [&>svg]:size-4">{mark}</span> : null}
          <span className="text-meta tracking-[0.06em] text-ink-3">{label}</span>
          {rule === "none" ? null : (
            <span aria-hidden className="h-px flex-1 bg-rule" />
          )}
        </div>
      </Reveal>

      <div
        className={
          "mt-7 gap-x-10 gap-y-4 " +
          (align === "split" ? "md:grid md:grid-cols-12 md:items-end" : "")
        }
      >
        <Reveal delay={60} className={align === "split" ? "md:col-span-7" : ""}>
          <h2 className="display text-balance">{title}</h2>
        </Reveal>
        {supporting ? (
          <Reveal
            delay={120}
            className={align === "split" ? "md:col-span-4 md:col-start-9" : "mt-4 max-w-[52ch]"}
          >
            <p className="text-small text-ink-3">{supporting}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  )
}
