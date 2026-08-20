"use client"

import { useEffect, useId, useState } from "react"
import Link from "next/link"
import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { MENU_PRODUCTS, NAV_SECTIONS, type IaSection } from "@/content/ia"
import { CurrentLink } from "./CurrentLink"
import type { StatusTerm } from "@/content/registry"

/**
 * The menu behind the header pill.
 *
 * Five entries, and they are the four questions a first-time visitor asks in
 * the order they ask them - what is it, is it for me, does it work, what does
 * it cost - plus the library. Everything else the site has is in the footer
 * index: with 43 routes, a bar that tries to hold them all stops being a
 * choice and becomes a directory.
 *
 * Every link prints one line saying what is behind it. That line is the whole
 * reason the menu is worth opening: "Guides" and "Resource center" and "Tools"
 * are indistinguishable as words, and a visitor should not have to click three
 * times to find out which one holds a checklist.
 *
 * Desktop is a hover/focus disclosure: pointer opens it, focus opens it,
 * Escape closes it and leaving the bar closes it. The trigger is a button
 * rather than a link because it owns an expanded state - the hub page it
 * stands for is a link inside the panel, so nothing becomes unreachable.
 */

const DOT: Record<StatusTerm, string> = {
  Live: "bg-live",
  Beta: "bg-preview",
  Preview: "bg-preview",
  "In Progress": "bg-progress",
  Planned: "bg-ink-4",
  Deprecated: "bg-ink-4",
}

function StatusLine({ term, scope }: { term: StatusTerm; scope: string }) {
  return (
    <span className="mt-1 flex items-start gap-1.5 text-meta text-ink-3">
      <span aria-hidden className={"mt-[5px] size-[5px] shrink-0 rounded-full " + DOT[term]} />
      {scope}: {term}
    </span>
  )
}

function Panel({ section, onNavigate }: { section: IaSection; onNavigate: () => void }) {
  return (
    <div
      className={
        "rounded-card-lg border border-rule bg-paper-2 p-6 shadow-[var(--shadow-lift-lg)] " +
        (section.products
          ? "w-[min(56rem,calc(100vw-3rem))]"
          : "w-max max-w-[min(40rem,calc(100vw-3rem))]")
      }
    >
      <div className={section.products ? "grid gap-8 md:grid-cols-12" : "flex gap-8"}>
        {section.products ? (
          <ul className="grid gap-1 md:col-span-7 md:grid-cols-2">
            {MENU_PRODUCTS.map((product) => (
              <li key={product.href}>
                <CurrentLink
                  href={product.href}
                  onClick={onNavigate}
                  className="block h-full rounded-card px-3 py-3 transition-colors duration-150 hover:bg-paper-3"
                  currentClassName="bg-paper-3"
                  label={
                    <span className="flex items-baseline gap-2">
                      <span className="text-body font-medium text-ink">{product.name}</span>
                      <span className="text-meta tracking-[0.06em] text-ink-4">{product.role}</span>
                    </span>
                  }
                >
                  <span className="mt-1 block max-w-[30ch] text-small text-ink-3">{product.job}</span>
                  {product.statuses.map((s) => (
                    <StatusLine key={s.scope + s.term} term={s.term} scope={s.scope} />
                  ))}
                </CurrentLink>
              </li>
            ))}
          </ul>
        ) : null}

        {section.groups.map((group) => (
          <div key={group.title} className={section.products ? "md:col-span-5" : ""}>
            <p className="px-3 text-meta tracking-[0.06em] text-ink-4">{group.title}</p>
            <ul className="mt-2 flex flex-col">
              {group.entries.map((entry) => (
                <li key={entry.href}>
                  <CurrentLink
                    href={entry.href}
                    onClick={onNavigate}
                    className="block rounded-chip px-3 py-2 transition-colors duration-150 hover:bg-paper-3"
                    currentClassName="bg-paper-3"
                    label={<span className="text-small text-ink">{entry.title}</span>}
                  >
                    {entry.note ? (
                      <span className="mt-0.5 block max-w-[34ch] text-meta text-ink-3">
                        {entry.note}
                      </span>
                    ) : null}
                  </CurrentLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DesktopMenu() {
  const [open, setOpen] = useState<string | null>(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <nav
      aria-label="Primary"
      className="hidden lg:block"
      onPointerLeave={() => setOpen(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null)
      }}
    >
      <ul className="flex items-center gap-0.5 rounded-full">
        {NAV_SECTIONS.map((section) => {
          const expanded = open === section.title
          const panelId = `${id}-${section.title}`
          const hasPanel = !section.plain && section.groups.length > 0
          return (
            <li
              key={section.title}
              className="relative"
              onPointerEnter={() => setOpen(hasPanel ? section.title : null)}
            >
              {hasPanel ? (
                <>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : section.title)}
                    className={
                      "flex h-7 items-center justify-center gap-1 rounded-full px-2.5 text-small leading-4 font-medium transition-colors duration-150 xl:px-3 " +
                      (expanded ? "text-ink" : "text-ink-2 hover:text-ink")
                    }
                  >
                    {section.title}
                    <CaretDown
                      aria-hidden
                      size={10}
                      weight="bold"
                      className={
                        "transition-transform duration-200 " + (expanded ? "rotate-180" : "")
                      }
                    />
                  </button>
                  {/* Kept mounted so the panel fades rather than flashes, and
                      so the pointer can cross the 12px gap without closing it. */}
                  <div
                    id={panelId}
                    aria-hidden={!expanded}
                    className={
                      "absolute top-full left-1/2 z-10 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ease-out-quart " +
                      (expanded
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0")
                    }
                  >
                    <Panel section={section} onNavigate={() => setOpen(null)} />
                  </div>
                </>
              ) : (
                <Link
                  href={section.href ?? "/"}
                  className="flex h-7 items-center justify-center rounded-full px-2.5 text-small leading-4 font-medium text-ink-2 transition-colors duration-150 hover:text-ink xl:px-3"
                >
                  {section.title}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * The same map on a phone, as nested disclosures.
 *
 * Native details/summary gives the expanded state, the keyboard path and the
 * screen-reader announcement §26.1 asks for without a line of script.
 */
export function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <ul className="flex flex-col">
      {NAV_SECTIONS.map((section) =>
        !section.plain && section.groups.length ? (
          <li key={section.title} className="border-b border-rule-soft">
            <details className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-lead text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                {section.title}
                <CaretDown
                  aria-hidden
                  size={14}
                  weight="bold"
                  className="text-ink-3 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="pb-4">
                {section.products ? (
                  <ul className="flex flex-col">
                    {MENU_PRODUCTS.map((product) => (
                      <li key={product.href}>
                        <Link
                          href={product.href}
                          onClick={onNavigate}
                          className="flex min-h-12 flex-col justify-center py-2"
                        >
                          <span className="text-body text-ink">{product.name}</span>
                          <span className="text-small text-ink-3">{product.role}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.groups.map((group) => (
                  <ul key={group.title} className="flex flex-col">
                    {group.entries.map((entry) => (
                      <li key={entry.href}>
                        <Link
                          href={entry.href}
                          onClick={onNavigate}
                          className="flex min-h-12 flex-col justify-center py-2"
                        >
                          <span className="text-body text-ink-2">{entry.title}</span>
                          {entry.note ? (
                            <span className="text-meta text-ink-3">{entry.note}</span>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </details>
          </li>
        ) : (
          <li key={section.title} className="border-b border-rule-soft">
            <Link
              href={section.href ?? "/"}
              onClick={onNavigate}
              className="flex min-h-14 items-center text-lead text-ink"
            >
              {section.title}
            </Link>
          </li>
        ),
      )}
    </ul>
  )
}
