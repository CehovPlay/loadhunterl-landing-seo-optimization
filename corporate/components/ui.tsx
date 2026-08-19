"use client"

import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"
import type { StatusEntry, StatusTerm } from "@/content/home"

/**
 * Status, printed next to the thing it describes.
 *
 * TZ §3.6 and §42.2 are explicit that a status belongs beside the capability
 * and never as one badge covering a whole product, which is why the unit here
 * is a scope plus a term rather than a product plus a colour. The vocabulary is
 * closed to the six values §3.6 allows. The dot is the one place on this page
 * where a coloured mark carries meaning rather than decorating.
 */
const TONE: Record<StatusTerm, string> = {
  Live: "text-live before:bg-live",
  Beta: "text-preview before:bg-preview",
  Preview: "text-preview before:bg-preview",
  "In Progress": "text-progress before:bg-progress",
  Planned: "text-ink-3 before:bg-ink-4",
  Deprecated: "text-ink-3 before:bg-ink-4",
}

export function Status({ term, scope }: { term: StatusTerm; scope?: string }) {
  return (
    <span className="inline-flex items-baseline gap-2 text-meta">
      <span
        className={
          "inline-flex items-center gap-1.5 whitespace-nowrap " +
          "before:block before:size-[5px] before:shrink-0 before:rounded-full " +
          TONE[term]
        }
      >
        {term}
      </span>
      {scope ? <span className="text-ink-3">{scope}</span> : null}
    </span>
  )
}

/** Every scope a product ships, each with its own term. Never one chip. */
export function StatusList({
  entries,
  className = "",
}: {
  entries: readonly StatusEntry[]
  className?: string
}) {
  return (
    <ul className={"flex flex-col gap-1.5 " + className}>
      {entries.map((entry) => (
        <li key={entry.term + entry.scope}>
          <Status term={entry.term} scope={entry.scope} />
        </li>
      ))}
    </ul>
  )
}

/** Marks synthetic content, required by TZ §25.3 wherever demo data is shown. */
export function SampleTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="figures rounded-chip bg-paper-3 px-2 py-1 text-meta text-ink-3">
      {children}
    </span>
  )
}

/**
 * The page's one primary action shape. Solid violet clears 6.4:1 against white,
 * so the label is readable, and the pill never wraps because every label in the
 * registry holds one line down to 360px.
 */
export function PrimaryCta({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-violet px-7 text-body font-medium whitespace-nowrap text-white transition duration-200 ease-out-quart hover:bg-violet-ink active:translate-y-px"
    >
      {children}
      <ArrowRight
        size={17}
        weight="bold"
        className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
      />
    </Link>
  )
}

/**
 * The secondary path is a link, not a second button. TZ §4.2 and the tab's own
 * acceptance criteria require the secondary CTA not to compete visually with
 * the primary one, and two equal pills side by side is exactly what that rule
 * is written against.
 */
export function SecondaryCta({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group inline-flex min-h-[52px] items-center gap-2 border-b border-rule pb-0.5 text-body text-ink-2 transition-colors duration-200 hover:border-violet hover:text-ink"
    >
      {children}
      <ArrowUpRight
        size={16}
        weight="bold"
        className="text-ink-3 transition-transform duration-200 ease-out-quart group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  )
}

/** The block-level action: quieter than the hero pill, still a real button. */
export function BlockCta({
  href,
  onClick,
  children,
}: {
  href: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-violet px-6 text-small font-medium whitespace-nowrap text-violet-ink transition duration-200 ease-out-quart hover:bg-violet hover:text-white active:translate-y-px"
    >
      {children}
      <ArrowRight
        size={15}
        weight="bold"
        className="transition-transform duration-200 ease-out-quart group-hover:translate-x-1"
      />
    </Link>
  )
}
