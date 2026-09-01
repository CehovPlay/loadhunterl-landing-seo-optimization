"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * A menu or index link that knows whether it is the page you are on.
 *
 * The bar carries five entries and the footer carries all 43 routes, so on
 * every page a handful of those links point at the page itself. Removing them
 * would make the index incomplete and the menus jump; leaving them silent
 * makes a reader click and arrive nowhere. So they stay, and they say so -
 * `aria-current="page"` for the screen reader, a quieter colour and a dot for
 * everyone else.
 */
export function CurrentLink({
  href,
  label,
  className = "",
  currentClassName = "",
  onClick,
  children,
}: {
  href: string
  /** The link's own text. The marker follows it, so an entry that also
      carries status lines does not get a dot stranded on a line of its own. */
  label?: ReactNode
  className?: string
  currentClassName?: string
  onClick?: () => void
  children?: ReactNode
}) {
  const pathname = usePathname()
  const current = pathname === href

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={className + (current ? " " + currentClassName : "")}
    >
      <span>
        {label}
        {current ? (
          <>
            <span
              aria-hidden
              className="ml-2 inline-block size-1.5 rounded-full bg-current align-middle opacity-50"
            />
            <span className="sr-only"> (current page)</span>
          </>
        ) : null}
      </span>
      {children}
    </Link>
  )
}
