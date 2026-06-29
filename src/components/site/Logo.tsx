import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path
        d="M12 2 3 7.2v9.6L12 22l9-5.2V7.2L12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        opacity="0.45"
      />
      <path
        d="M12 6.5 7 9.3v5.4L12 17.5l5-2.8V9.3L12 6.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-small tracking-tight",
        className,
      )}
    >
      <LogoMark className="size-[18px] text-dark-text" />
      <span className="font-medium">
        <span className="text-gray-300">load</span>
        <span className="text-dark-text">hunter</span>
      </span>
    </span>
  )
}
