import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

type Tone = "live" | "preview" | "progress"

const TONE: Record<Tone, string> = {
  live: "text-live before:bg-live",
  preview: "text-preview before:bg-preview",
  progress: "text-progress before:bg-progress",
}

/**
 * Feature status, printed next to the thing it describes.
 *
 * TZ §3.6 and §42.2 are explicit that a status belongs beside the capability
 * and never as one badge covering a whole product, and §22.1 makes the wording
 * come from the status ledger. The dot is the one place on this page where a
 * coloured mark carries meaning rather than decorating.
 */
export function Status({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={
        "inline-flex items-center gap-2 text-meta " +
        "before:block before:size-[5px] before:rounded-full " +
        TONE[tone]
      }
    >
      {children}
    </span>
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
 * The page's one primary action. Solid violet clears 6.4:1 against white, so
 * the label is readable, and the pill never wraps because the label is short
 * enough to hold one line down to 360px.
 */
export function PrimaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
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
 * The secondary path is a link, not a second button. TZ §4.2 wants the sales /
 * explore route to sit visually below the primary action, and two competing
 * pills side by side is exactly what that rule is written against.
 */
export function SecondaryCta({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
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
