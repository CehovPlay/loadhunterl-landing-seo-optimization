import type { ReactNode } from "react"
import { SAMPLE_NOTICE } from "@/content/directory/copy"
import { isSample } from "@/content/directory/source"
import type { AuthorityStatus } from "@/content/directory/types"

/**
 * The pieces every directory surface shares.
 *
 * The directory is the first part of this site that renders a record rather
 * than a sentence, so it needs a small vocabulary the marketing pages do not
 * have: a panel, a definition row, a status dot, a percentile bar and an empty
 * state. Keeping them here rather than in `blocks/kit.tsx` marks the boundary -
 * these are data primitives, and a marketing block should never reach for them.
 */

/* ---------------------------------------------------------------- */
/*  Sample-data banner                                              */
/* ---------------------------------------------------------------- */

/**
 * §22.1 forbids a placeholder that reads as a claim, and a company profile is
 * the most convincing placeholder this site could ship: plausible DOT numbers,
 * plausible percentiles, a plausible address. So every directory page states
 * what it is showing before it shows any of it, and the banner disappears on
 * its own when `SOURCE.kind` becomes "fmcsa".
 */
export function SampleBanner() {
  if (!isSample()) return null
  return (
    <div
      role="note"
      className="rounded-card border border-dashed border-rule bg-paper-3 px-4 py-3 sm:px-5"
    >
      <p className="text-small text-ink-2">
        <span className="font-medium text-ink">{SAMPLE_NOTICE.title}.</span>{" "}
        {SAMPLE_NOTICE.body}
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Surfaces                                                        */
/* ---------------------------------------------------------------- */

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={"min-w-0 rounded-card border border-rule bg-paper-2 " + className}>
      {title ? (
        <header className="flex items-baseline justify-between gap-4 border-b border-rule-soft px-5 py-4">
          <h2 className="text-small font-medium text-ink">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className="px-5 py-5">{children}</div>
    </section>
  )
}

/** A labelled figure. The label is never bigger than the value it describes. */
export function Field({
  label,
  value,
  mono = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-meta text-ink-4">{label}</dt>
      <dd className={"text-body text-ink " + (mono ? "font-mono tabular-nums" : "")}>{value}</dd>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Status                                                          */
/* ---------------------------------------------------------------- */

const STATUS_TONE: Record<AuthorityStatus, string> = {
  Active: "bg-live",
  Inactive: "bg-ink-4",
  "Not authorized": "bg-ink-4",
  Pending: "bg-progress",
}

/**
 * Authority status, printed as a word beside a dot rather than as a colour.
 * §17.2 forbids colour as the only carrier of meaning, and "green" is not a
 * legal state - "Active" is.
 */
export function AuthorityDot({ status }: { status: AuthorityStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className={"size-[6px] shrink-0 rounded-full " + STATUS_TONE[status]} />
      <span className="text-small text-ink">{status}</span>
    </span>
  )
}

export function Badge({ children, tone = "quiet" }: { children: ReactNode; tone?: "quiet" | "brand" | "good" }) {
  const cls =
    tone === "brand"
      ? "border-transparent bg-violet-wash text-violet-ink"
      : tone === "good"
        ? "border-transparent bg-paper-3 text-live"
        : "border-rule text-ink-3"
  return (
    <span className={"inline-flex items-center rounded-chip border px-2 py-0.5 text-meta " + cls}>
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- */
/*  Percentile bar                                                  */
/* ---------------------------------------------------------------- */

/**
 * An SMS BASIC percentile.
 *
 * Higher is worse, which is the opposite of what a filled bar usually means, so
 * the number is printed and the bar is secondary. The colour follows FMCSA's
 * own intervention thresholds rather than a gradient invented here: 65 is where
 * most BASICs trigger a warning letter.
 */
export function ScoreBar({
  label,
  percentile,
  total,
}: {
  label: string
  percentile: number
  total?: number
}) {
  const tone = percentile >= 65 ? "bg-progress" : percentile >= 40 ? "bg-ember" : "bg-live"
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-small text-ink-2">
          {label}
          {total !== undefined ? <span className="text-ink-4"> (total: {total})</span> : null}
        </span>
        <span className="font-mono text-small tabular-nums text-ink">{percentile}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-3">
        <div
          className={"h-full rounded-full " + tone}
          style={{ width: `${Math.min(100, Math.max(0, percentile))}%` }}
        />
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Empty state                                                     */
/* ---------------------------------------------------------------- */

/**
 * "Nothing here" and "nothing published" are different sentences, and the
 * design draws a separate empty frame for every panel because of it. FMCSA
 * genuinely publishes no SMS scores for a carrier with too few inspections;
 * printing "0%" there would be a claim we cannot make.
 */
export function Empty({ children }: { children: ReactNode }) {
  return <p className="text-small text-ink-3">{children}</p>
}
