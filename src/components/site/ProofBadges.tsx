import { PROOF_AS_OF, PROOF_BADGES } from "@/content/copy"
import { track } from "@/lib/analytics"

/**
 * LH-004 / LH-043 — three separate, source-attributed and clickable proof
 * badges plus an "As of" stamp. Deliberately NOT a blended average, and the
 * Chrome source is always named "Chrome Web Store", never "Google".
 *
 * NOTE: the brief asks for the sources' own logos. Official Chrome Web Store /
 * Trustpilot brand assets are not in the repo, so each badge carries a neutral
 * source glyph instead of an approximated (and therefore wrong) brand mark.
 * Swap `SourceIcon` for the real assets once they are supplied.
 */
function SourceIcon({ source }: { source: "chrome" | "trustpilot" }) {
  if (source === "trustpilot") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="size-[16px] shrink-0" fill="currentColor">
        <path d="M12 2.6l2.9 6.06 6.6.86-4.86 4.53 1.24 6.55L12 17.4l-5.88 3.2 1.24-6.55L2.5 9.52l6.6-.86L12 2.6z" />
      </svg>
    )
  }
  // extension / puzzle-piece glyph: the Chrome Web Store distributes extensions
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[16px] shrink-0" fill="currentColor">
      <path d="M11 2a2.5 2.5 0 0 1 2.45 3H16a1 1 0 0 1 1 1v2.55A2.5 2.5 0 1 1 20 12a2.5 2.5 0 0 1-3 2.45V17a1 1 0 0 1-1 1h-2.55A2.5 2.5 0 1 0 9 21H6a1 1 0 0 1-1-1v-3a2.5 2.5 0 1 1 0-5V6a1 1 0 0 1 1-1h2.55A2.5 2.5 0 0 1 11 2z" />
    </svg>
  )
}

export function ProofBadges({
  className = "",
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <div className={"flex flex-col " + (compact ? "gap-2" : "gap-[10px]") + " " + className}>
      <ul className={"flex flex-wrap items-center " + (compact ? "gap-2" : "gap-[10px]")}>
        {PROOF_BADGES.map((b) => (
          <li key={b.label}>
            <a
              href={b.href}
              target="_blank"
              rel="noopener"
              onClick={() => track("review_source_click", { source: b.source })}
              className={
                "inline-flex items-center gap-[8px] rounded-full border border-border-light bg-white text-ink transition-colors hover:text-black " +
                (compact
                  ? "px-3 py-1.5 text-[13px] leading-[18px]"
                  : "px-[14px] py-[7px] text-[15px] leading-[20px]")
              }
              style={{ boxShadow: "var(--shadow-pill)" }}
            >
              <span className="text-violet">
                <SourceIcon source={b.source} />
              </span>
              <span className="font-medium tracking-[-0.03em]">
                <strong className="font-medium">{b.value}</strong> {b.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p
        className={
          "text-ink/70 " + (compact ? "text-[12px] leading-[16px]" : "text-[13px] leading-[18px]")
        }
      >
        {PROOF_AS_OF}
      </p>
    </div>
  )
}
