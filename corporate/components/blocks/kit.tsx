import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import type { PageArt } from "@/content/art"
import { resolveCta, resolveExit, type CtaTarget } from "@/content/cta"
import type { TzBlock, TzPage } from "@/content/tz"
import { Motif } from "@/components/system/Motif"
import { Reveal } from "@/components/system/Reveal"
import { BlockName, Card } from "@/components/system/atoms"

export type BlockProps = {
  block: TzBlock
  index: number
  total: number
  motif: PageArt["motif"]
  page: TzPage
}

/**
 * Where the real thing goes.
 *
 * These pages are skeletons: every heading, sentence and CTA is the TZ's final
 * copy, but the interactive proof each block is specified to carry - the
 * diagnostic selector, the five-checkpoint journey, the recommendation card -
 * is not built yet. The honest way to hold that space is to print what the
 * document asks for, in the frame the finished thing will occupy, rather than
 * to draw a grey box or fake a screenshot.
 *
 * So the slot renders the block's "Визуал и интеракция" line verbatim over the
 * page's motif. It is legible to a reviewer, it reserves the correct amount of
 * vertical space so the page's rhythm is real, and it cannot be mistaken for
 * finished work.
 */
/**
 * The shape of the thing, without its content.
 *
 * A proof panel that is only a caption over a gradient reads as a hole in the
 * layout, and a page of six holes cannot be judged for rhythm - which is the
 * one thing a skeleton exists to show. So the panel draws the record rows the
 * finished proof will hold: a leading mark, a subject, two attributes. Bars,
 * not lorem text and not a fake screenshot - nothing here can be read as a
 * claim about the product, which is exactly what §3.6 forbids a placeholder
 * from doing.
 */
export function Wireframe({ rows = 3 }: { rows?: number }) {
  /* Deterministic, not random: the same page must render identically on the
     server and on the client, and a reviewer comparing two builds should see
     the same bars. */
  const widths = ["58%", "44%", "66%", "38%", "52%"]
  return (
    <div aria-hidden className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-card border border-rule-soft bg-paper/60 px-3 py-3"
        >
          <span className="size-2 shrink-0 rounded-full bg-rule" />
          <span className="h-2 rounded-full bg-paper-3" style={{ width: widths[i % widths.length] }} />
          <span className="ml-auto h-2 w-10 shrink-0 rounded-full bg-paper-3" />
          <span className="h-2 w-6 shrink-0 rounded-full bg-paper-3" />
        </div>
      ))}
    </div>
  )
}

export function ProofSlot({
  motif,
  spec,
  height = "tall",
  className = "",
}: {
  motif: PageArt["motif"]
  spec: string
  height?: "short" | "tall"
  className?: string
}) {
  return (
    <div
      className={
        "relative isolate overflow-hidden rounded-card-lg border border-rule bg-paper-2 " +
        (height === "tall" ? "min-h-[22rem] md:min-h-[27rem] " : "min-h-[14rem] ") +
        className
      }
    >
      <div aria-hidden className="dust absolute inset-0 opacity-70" />
      <div aria-hidden className="aurora-soft absolute inset-0" />
      <Motif
        kind={motif}
        className="pointer-events-none absolute -right-10 -bottom-12 size-72 opacity-90 md:size-80"
      />
      <div className="relative flex h-full flex-col gap-6 p-6 md:p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rule bg-paper-2/80 px-3 py-1.5 text-meta text-ink-3 backdrop-blur">
          <span aria-hidden className="size-1.5 rounded-full bg-violet-soft" />
          Proof slot
        </span>
        <Wireframe rows={height === "tall" ? 4 : 2} />
        <SpecCaption className="mt-auto">{spec}</SpecCaption>
      </div>
    </div>
  )
}

/**
 * What the panel has to become, printed as a brief rather than as copy.
 *
 * Every tab describes its proof in a "layout" field - "Desktop: copy 5
 * columns, functional proof 7 columns", and on 27 of the 42 tabs that carry
 * one, in Russian. It is a brief to the builder, not a sentence for the
 * reader, so it gets the label and the muted size that say so; set in lead
 * copy inside the panel it read as the product's own words.
 */
export function SpecCaption({
  children,
  tone = "paper",
  className = "",
}: {
  children: ReactNode
  tone?: "paper" | "night"
  className?: string
}) {
  const dark = tone === "night"
  return (
    <p
      data-untranslated=""
      data-note=""
      className={
        "max-w-[46ch] text-small " + (dark ? "text-night-ink-3 " : "text-ink-3 ") + className
      }
    >
      <span
        className={
          "mr-2 rounded-full border px-2 py-0.5 text-meta tracking-[0.06em] " +
          (dark ? "border-night-rule text-night-ink-3" : "border-rule text-ink-3")
        }
      >
        Proof spec
      </span>
      {children}
    </p>
  )
}

/**
 * Copy the document never actually wrote.
 *
 * 29 of the 245 blocks have a "Точный текст" field that is not page copy at
 * all - it is an instruction to the builder, in Russian, on a site whose P0
 * language is US English ("Показать one-minute proof: source context →
 * relevance signal → action"). Six pages are affected: 01, 02, 43, 44, 45, 46.
 *
 * Printing those as body copy would put Russian on an English page and would
 * quietly imply the copy exists. Rendering them as a marked note does the
 * opposite: the block still shows what it has to contain, and the missing
 * English copy stays visible as missing. The list is in the handoff notes.
 */
export const isBuildNote = (text: string): boolean => /[А-Яа-яЁё]/.test(text)

/**
 * The mark that says "this string is still in the document's Russian".
 *
 * Spread onto whatever element prints it. Two things follow from the
 * attribute: a dotted amber underline in `globals.css`, so a reviewer sees it
 * without reading Russian, and a single selector for `scripts/sweep.mjs`,
 * which fails the build's acceptance check on any Russian text that is NOT
 * marked. Without the contract the sweep cannot tell an honest placeholder
 * from copy that leaked onto an English page.
 */
export const untranslated = (text: string) =>
  isBuildNote(text)
    ? ({ "data-untranslated": "", title: "Not translated to US English" } as const)
    : {}

export function BuildNote({ children }: { children: ReactNode }) {
  return (
    <p
      data-untranslated=""
      data-note=""
      className="mt-4 max-w-[54ch] border-l-2 border-progress/50 bg-ember-wash/60 py-2.5 pr-3 pl-4 text-small text-ink-2"
    >
      <span className="mr-2 text-meta tracking-[0.06em] text-progress">Copy not written</span>
      {children}
    </p>
  )
}

/** The frame every block shares: the ordinal, the block name, the H3, the copy. *//**
 * A block's opening, in the shape the homepage road settled on.
 *
 * The road sets a counter, then a display verb, then the heading. That
 * hierarchy transfers here; the verb does not. The document's block names run
 * to 23 characters at the median and 55 at the longest, and a 55-character
 * name at 96px is a wall rather than a heading.
 *
 * So the counter and the name lead, and the name is set at heading size rather
 * than at 12px in a label row - which is where it used to sit, below every
 * other line on the page, despite being the document's own naming of the
 * section.
 *
 *     01 / 06     counter, mono
 *     name        the document's name for the block
 *     h3          the block's sentence, large
 *     text        the exact copy
 */
export function BlockIntro({
  block,
  total,
  className = "",
  wide = false,
}: {
  block: TzBlock
  /** How many blocks the page has, printed beside the number. */
  total?: number
  className?: string
  wide?: boolean
}) {
  const nn = String(block.n).padStart(2, "0")
  return (
    <div className={className}>
      <Reveal>
        <p className="figures text-meta text-ink-3">
          {nn}
          {total ? <span className="text-ink-4"> / {String(total).padStart(2, "0")}</span> : null}
        </p>
      </Reveal>
      <Reveal delay={40}>
        <BlockName n={block.n} name={block.name} />
      </Reveal>
      <Reveal delay={70}>
        <h3
          {...untranslated(block.h3)}
          className={
            "mt-4 max-w-[30ch] text-balance font-medium tracking-[-0.035em] text-ink " +
            (wide ? "text-[clamp(1.5rem,1.1rem+1.1vw,2rem)] leading-[1.14]" : "text-h3")
          }
        >
          {block.h3}
        </h3>
      </Reveal>
      {block.text ? (
        <Reveal delay={110}>
          {isBuildNote(block.text) ? (
            <BuildNote>{block.text}</BuildNote>
          ) : (
            <p className="mt-4 max-w-[54ch] text-body text-ink-2">{block.text}</p>
          )}
        </Reveal>
      ) : null}
    </div>
  )
}

/**
 * The option lists the document actually announces - and nothing else.
 *
 * A block's "Точный текст" is usually prose, and prose split on commas turns
 * into labels like "truck" or "imported or integrated". So a list is only read
 * where the sentence declares one: a short lead-in, a colon, then short items
 * inside that same sentence ("Options: owner-led fleet, dispatcher-led fleet,
 * multi-dispatch operation."). An arrow sequence wins over commas, because
 * "detect → review → compare → save/act" is one list written two ways. Nine
 * of the 245 blocks qualify; the rest keep the archetype's own labels and say
 * their sentence as copy.
 */
type Enumeration = { items: string[]; rest: string }

export function enumeration(text: string): Enumeration | null {
  if (!text || isBuildNote(text)) return null
  const m =
    text.match(/^([^.:\u201d"]{0,32}):\s*([^.]+?)\.(?:\s|$)/) ??
    text.match(/^([^.:\u201d"]{0,32}):\s*([^.]+)$/)
  if (!m) return null
  const body = m[2]
  const items = (body.includes("\u2192") ? body.split("\u2192") : body.split(/\s*[;,]\s+|\s+\/\s+/))
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean)
  if (items.length < 2) return null
  if (items.some((s) => s.length > 42 || s.length < 3)) return null
  return { items, rest: text.slice(m[0].length).trim() }
}

/** The labels for an interactive archetype, plus the copy left over. */
export function listing(block: TzBlock, fallback: string[]) {
  const parsed = enumeration(block.text)
  return {
    items: parsed ? parsed.items.slice(0, 6) : fallback,
    /* Whatever the sentence said besides the list. Printing the raw sentence
       above a rail that renders it says the same thing twice; dropping it
       loses the qualifier that usually follows ("The story and proof order
       adapt without changing facts"). */
    block: parsed ? { ...block, text: parsed.rest } : block,
  }
}

/**
 * A call to action, and the name of the place it goes.
 *
 * The label the document approved is a verb - "Explore the Dispatch Day",
 * "See Connected Products" - and 213 of them on 43 routes gave a reader no way
 * to tell a page move from an in-page control. So the control prints its
 * destination beside the label, taken from the site index rather than from the
 * words in the label.
 *
 * When there is no destination the control is not a link. It keeps the shape
 * of the action, marks itself as unbuilt, and says which kind of unbuilt it
 * is: an interaction this skeleton has not built, or an address the Product
 * Registry (§15.3) has not handed over. A dashed border, no arrow, no hover -
 * nothing a reader could mistake for a button that works.
 */
type CtaTone = "quiet" | "primary" | "night"

function Pending({ target, label, tone }: { target: CtaTarget; label: string; tone: CtaTone }) {
  const note = target.kind === "pending" && target.artifact ? "Address pending" : "Not built"
  const night = tone === "night"
  return (
    <span
      data-cta="pending"
      aria-disabled="true"
      className={
        "inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-dashed px-4 py-2.5 text-small " +
        (night ? "border-night-edge text-night-ink-2" : "border-rule text-ink-3")
      }
    >
      {label}
      <span
        className={
          "text-meta tracking-[0.06em] " + (night ? "text-night-ink-3" : "text-ink-4")
        }
      >
        {note}
      </span>
    </span>
  )
}

export function Cta({
  label,
  page,
  tone = "quiet",
  exit = false,
  className = "",
}: {
  label?: string
  page: TzPage | undefined
  tone?: CtaTone
  /** Hero and closer on a page with no live action anywhere: the label is
      allowed to fall back to the demo rather than leave the page a dead end. */
  exit?: boolean
  className?: string
}) {
  if (!label) return null
  const url = page?.url ?? "/"
  const target = exit ? resolveExit(label, url) : resolveCta(label, url)

  if (target.kind === "pending") {
    return <Pending target={target} label={label} tone={tone} />
  }

  if (tone === "primary" || tone === "night") {
    const primary = tone === "primary"
    return (
      <Link
        href={target.href}
        className={
          "inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-small shadow-[var(--shadow-pill)] transition-colors " +
          (primary
            ? "bg-violet text-white hover:bg-violet-ink "
            : "bg-night-ink text-night hover:bg-white ") +
          className
        }
      >
        {label}
        <span
          className={
            "border-l pl-3 text-meta tracking-[0.06em] " +
            (primary ? "border-white/25 text-white/70" : "border-night/25 text-night/60")
          }
        >
          {target.to}
        </span>
      </Link>
    )
  }

  const words = label.trim().split(" ")
  const head = words.slice(0, -1).join(" ")
  const tail = words[words.length - 1]
  return (
    <Link
      href={target.href}
      className={
        "group inline-flex items-center gap-3 rounded-full border border-rule bg-paper-2 px-4 py-2.5 text-small text-ink-2 transition-colors hover:border-violet-soft " +
        className
      }
    >
      <span>
        {head ? head + " " : ""}
        <span className="text-violet-ink">{tail}</span>
      </span>
      <span className="border-l border-rule pl-3 text-meta tracking-[0.06em] text-ink-4">
        {target.to}
      </span>
      <ArrowRight
        aria-hidden
        className="size-4 text-ink-4 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}

/** The block's one action, when the TZ gives it one. */
export function BlockAction({ block, page }: { block: TzBlock; page?: TzPage }) {
  if (!block.cta) return null
  return (
    <Reveal delay={160} className="mt-8">
      <Cta label={block.cta} page={page} />
    </Reveal>
  )
}

/**
 * The section shell. `bleed` lets the one inverted band run edge to edge while
 * every other section stays inside the container that the page's left rail is
 * aligned to.
 */
/**
 * One block's outer section.
 *
 * The hairline is the layout's spine. Six blocks with nothing between them read
 * as six floating panels however well each one is set; a rule across the top of
 * every block, running the full width of the container, turns the same six into
 * one numbered sequence. It is the device the homepage road uses, and it is the
 * cheapest thing on this page that makes it read as designed rather than as
 * output.
 *
 * The rule is decoration in the strict sense - the counter and the name below
 * already say where the reader is - so it is hidden from the accessibility
 * tree.
 *
 * Padding: 112px at each end put 280-350px of white between two blocks once
 * their own head and tail margins were added, which read as a missing section
 * rather than as breathing room. The asymmetry is deliberate - a block sits
 * closer to its own rule than to the next one, so the rule reads as belonging
 * to what follows it.
 */
export function BlockSection({
  id,
  bleed = false,
  ruled = true,
  className = "",
  children,
}: {
  id: string
  bleed?: boolean
  /** Inversion blocks are a full-bleed dark band and draw their own edge. */
  ruled?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className={
        "relative " +
        (bleed ? "left-1/2 w-screen -translate-x-1/2 " : "") +
        "pt-12 pb-20 md:pt-16 md:pb-24 " +
        className
      }
    >
      {ruled && !bleed ? (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rule" />
      ) : null}
      {children}
    </section>
  )
}

export { Card }
