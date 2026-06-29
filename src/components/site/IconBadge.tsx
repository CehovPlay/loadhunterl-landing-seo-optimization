import { cn } from "@/lib/utils"

/** Centered pill-icon used above section headings on dark bands. */
export function IconBadge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "mx-auto flex size-11 items-center justify-center rounded-md border border-line bg-gray-800 text-gray-200 shadow-lg shadow-black/40",
        className,
      )}
    >
      {children}
    </span>
  )
}
