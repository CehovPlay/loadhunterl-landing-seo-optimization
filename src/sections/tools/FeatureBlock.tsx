import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export type FeatureItem = {
  icon: ReactNode
  title: string
  body: string
}

export function FeatureBlock({
  id,
  eyebrow,
  heading,
  description,
  items,
  mockup,
  reverse = false,
  className,
}: {
  id?: string
  eyebrow?: string
  heading: string
  description: string
  items: FeatureItem[]
  mockup: ReactNode
  reverse?: boolean
  className?: string
}) {
  return (
    <div
      id={id}
      className={cn(
        "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
        className,
      )}
    >
      {/* Mockup */}
      <div className={cn("min-w-0", reverse && "lg:order-2")}>{mockup}</div>

      {/* Copy */}
      <div className={cn("max-w-lg", reverse && "lg:order-1")}>
        {eyebrow && (
          <p className="mb-3 text-small text-violet-300">{eyebrow}</p>
        )}
        <h3 className="text-h2 font-medium tracking-[-0.02em] text-dark-text">
          {heading}
        </h3>
        <p className="mt-4 text-small leading-relaxed text-gray-200">
          {description}
        </p>

        <div className="mt-8 space-y-6">
          {items.map((it) => (
            <div key={it.title} className="flex gap-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-gray-800 text-gray-200">
                {it.icon}
              </span>
              <div>
                <h4 className="text-small font-medium text-dark-text">
                  {it.title}
                </h4>
                <p className="mt-1 text-subtle leading-relaxed text-gray-300">
                  {it.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
