import { useEffect, useState } from "react"
import { FAQ_ITEMS } from "@/content/copy"
import { track } from "@/lib/analytics"

/**
 * LH-045 / FAQ-001..008 — the eight approved homepage questions as a single
 * accordion shared by both section trees.
 *
 * Requirements this encodes:
 *  - the FULL answer text stays in the DOM even when collapsed (the panel is
 *    collapsed with a `grid-template-rows: 0fr → 1fr` transition, never with
 *    `hidden`, `display:none` or conditional rendering), so crawlers and
 *    answer engines read every answer from the initial HTML;
 *  - every question has a PERMANENT anchor (`#what-is-loadhunter`, ...), and
 *    landing on one of those hashes opens that question;
 *  - the first question is open by default;
 *  - expanding fires the approved `faq_expand` event.
 */
export function FaqAccordion({
  dark = true,
  className = "",
}: {
  dark?: boolean
  className?: string
}) {
  const [open, setOpen] = useState<string>(FAQ_ITEMS[0].id)

  // deep link: /#broker-email-automation opens that question
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace("#", "")
      if (FAQ_ITEMS.some((i) => i.id === id)) setOpen(id)
    }
    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  const qColor = dark ? "text-white" : "text-ink"
  const aColor = dark ? "text-[rgba(255,255,255,0.65)]" : "text-ink/75"
  const border = dark ? "border-gray-650" : "border-border-light"

  return (
    <ul className={"flex w-full flex-col " + className}>
      {FAQ_ITEMS.map((item) => {
        const isOpen = open === item.id
        return (
          <li key={item.id} id={item.id} className={`border-b ${border} scroll-mt-24`}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-panel`}
                onClick={() => {
                  const next = isOpen ? "" : item.id
                  setOpen(next)
                  if (next) track("faq_expand", { question: item.id })
                }}
                className={`flex w-full items-start justify-between gap-6 py-5 text-left text-[20px] font-medium leading-[28px] tracking-[-0.02em] ${qColor} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300`}
              >
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className={`mt-1 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                    <path d="M11 5h2v14h-2z" />
                    <path d="M5 11h14v2H5z" />
                  </svg>
                </span>
              </button>
            </h3>

            {/* collapsed via grid rows: the answer is always rendered */}
            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={item.id}
              className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-[900px] pb-6 pr-8 text-[16px] font-medium leading-[24px] tracking-[-0.01em] ${aColor}`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
