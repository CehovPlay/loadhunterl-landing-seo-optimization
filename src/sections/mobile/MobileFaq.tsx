import { useState } from "react"
import { Container, SectionHeader } from "./ui"

const ROWS = [
  {
    q: "How do I install and set up LoadHunter?",
    a: 'The installation process is simple! Just go to the Chrome Web Store, find "LoadHunter" and click "Add to Chrome".',
    d: "Once installed, click on the puzzle icon in the top-right corner and pin LoadHunter.\nLog in with your email, visit your Load Board, and you'll immediately see all the LoadHunter features!",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes! Try an unlimited version of LoadHunter with a 14-day free trial.",
    d: "You can explore all the features and see how it can optimize your dispatching work — no credit card required. Enjoy full access without any obligations!",
  },
  {
    q: "Can I connect my factoring company account to LoadHunter?",
    a: "Yes! With LoadHunter, you can integrate your Factoring Company account directly into the dashboard.",
    d: "This allows you to see factoring ratings right on your load board, making it easier to evaluate brokers and streamline decision-making.",
  },
  {
    q: "Does LoadHunter work with VoIP for SMS and calls?",
    a: "Absolutely!",
    d: "You can connect your VoIP service and use LoadHunter to send pre-built SMS templates and make calls directly from the extension.",
  },
  {
    q: "Can I cancel my LoadHunter subscription anytime?",
    a: "Yes, you can cancel your LoadHunter subscription at any time.",
    d: "Even after cancellation, the extension will continue to work until the end of your current subscription period.",
  },
]

/**
 * Mobile FAQ: the desktop's static two-column list becomes an accordion —
 * question rows are ≥56px touch targets, one panel open at a time.
 */
export function MobileFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/tail/faq-icon.png"
          title="Frequently asked questions"
          sub="Access a wealth of information and resources to ensure you find the solutions you need quickly and effectively, empowering you to make informed decisions."
        />

        <div className="mt-10 flex flex-col lg:mx-auto lg:mt-14 lg:max-w-[900px]">
          {ROWS.map((row, i) => {
            const expanded = open === i
            return (
              <div key={row.q}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-[16px] font-medium leading-[21px] tracking-[-0.64px] text-white">
                    {row.q}
                  </span>
                  <span
                    aria-hidden
                    className={`flex size-6 shrink-0 items-center justify-center text-violet-300 transition-transform duration-300 ${
                      expanded ? "rotate-45" : ""
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-dark-text">
                      {row.a}
                    </p>
                    <p className="whitespace-pre-line pb-5 pt-2 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
                      {row.d}
                    </p>
                  </div>
                </div>
                <img
                  src="/figma/tail/faq-line.svg"
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="h-px w-full"
                />
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
