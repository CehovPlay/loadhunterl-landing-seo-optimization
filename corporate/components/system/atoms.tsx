import type { ReactNode } from "react"

/**
 * The small parts, shared by every archetype.
 *
 * All four come from cosmoq. What changed in the inversion is how each one is
 * separated from its ground: the reference separates by light (a rim, a glow),
 * paper has to separate by edge and shadow instead.
 */

/**
 * A chip. cosmoq uses these as the fast-read layer under every feature - four
 * or five capability names the eye can take in without reading the paragraph.
 * Icon optional, label always short enough to hold one line.
 */
export function Chip({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2 px-3.5 py-2 text-small text-ink-2">
      {icon ? <span className="text-ink-4 [&>svg]:size-4">{icon}</span> : null}
      {children}
    </span>
  )
}

/**
 * A card. White, hairlined, lifted. `tone="wash"` tints it with the cool pole
 * for the one card in a group that carries the argument - the reference does
 * this with a brighter rim, which paper cannot do.
 */
export function Card({
  tone = "plain",
  className = "",
  children,
}: {
  tone?: "plain" | "wash" | "well"
  className?: string
  children: ReactNode
}) {
  const skin =
    tone === "wash"
      ? "bg-violet-wash border-violet-soft/40"
      : tone === "well"
        ? "bg-paper-3 border-rule-soft"
        : "bg-paper-2 border-rule"
  return (
    <div
      className={
        "rounded-card border p-6 md:p-8 " +
        skin +
        (tone === "well" ? " " : " shadow-[var(--shadow-lift)] ") +
        className
      }
    >
      {children}
    </div>
  )
}

/**
 * A block's ordinal. The reference numbers its steps "01." in a mono face at
 * body size and lets the number sit above a hairline - small enough to be a
 * label, present enough to promise a sequence.
 */
export function Ordinal({ n, total }: { n: number; total?: number }) {
  return (
    <span className="figures text-meta text-ink-4">
      {String(n).padStart(2, "0")}
      {total ? <span className="text-ink-4/60"> / {String(total).padStart(2, "0")}</span> : null}
    </span>
  )
}

/**
 * The label that opens a block. The TZ gives every block a short name of its
 * own ("Name the bottleneck", "Start narrow") which is exactly the eyebrow the
 * reference wants and which we would otherwise have to invent.
 */
/**
 * The document's own name for a block, set as a heading.
 *
 * It used to be a 12px label beside an ordinal. That put the one line that says
 * what the section IS below every other line in it, which is why six blocks on
 * a page read as six undifferentiated panels. The ordinal moved to its own
 * counter row above; this is the name alone, at heading size.
 *
 * Tabs 43-46 name their blocks in Russian ("Первый экран"). The name is visible
 * page furniture, so an untranslated one carries the same amber mark the
 * untranslated copy does rather than passing as finished English - and at this
 * size it is impossible to miss in review, which is the point.
 */
export function BlockName({ n, name }: { n: number; name: string }) {
  const untranslated = /[А-Яа-яЁё]/.test(name)
  return (
    <h2
      data-untranslated={untranslated ? "" : undefined}
      title={untranslated ? "Block name not translated to US English" : undefined}
      className={
        "mt-3 flex max-w-[24ch] items-start gap-2.5 text-h2 text-balance " +
        (untranslated ? "text-progress" : "text-ink")
      }
    >
      {untranslated ? (
        <span aria-hidden className="mt-[0.55em] size-2 shrink-0 rounded-full bg-progress" />
      ) : null}
      <span>{name}</span>
    </h2>
  )
}
