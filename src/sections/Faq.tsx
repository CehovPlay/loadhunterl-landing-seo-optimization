import { useState } from "react"
import { Container } from "@/components/site/Container"
import { IconBadge } from "@/components/site/IconBadge"
import { HelpCircle, Plus, Minus } from "lucide-react"

const ITEMS = [
  {
    q: "How do I install and set up LoadHunter?",
    a: "The installation process is simple! Just go to the Chrome Web Store, find \"LoadHunter\" and click \"Add to Chrome\". Once installed, click on the puzzle icon in the top-right corner and pin LoadHunter. Log in with your email, set up your Load Board, and you'll immediately see all the LoadHunter features.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes! Try an unlimited version of LoadHunter with a 14-day free trial. You can explore all the features and see how it can optimize your dispatching work — no credit card required. Enjoy full access without any obligations!",
  },
  {
    q: "Can I connect my factoring company account to LoadHunter?",
    a: "Yes! With LoadHunter, you can integrate your Factoring Company account directly into the dashboard. This allows you to see factoring ratings right on your LoadBoard, making it easier to evaluate brokers and streamline decision-making.",
  },
  {
    q: "Does LoadHunter work with VOIP for SMS and calls?",
    a: "You can connect your VOIP service and use LoadHunter to send pre-built SMS templates and make calls directly from the extension.",
  },
  {
    q: "Can I cancel my LoadHunter subscription anytime?",
    a: "Yes, you can cancel your LoadHunter subscription at any time. Even after cancellation, the extension will continue to work until the end of your current subscription period.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-gray-900 py-24">
      <Container>
        <div className="text-center">
          <IconBadge>
            <HelpCircle className="size-5" />
          </IconBadge>
          <h2 className="mx-auto mt-8 text-h1 font-medium tracking-[-0.02em] text-dark-text">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-small text-gray-300">
            Access a wealth of information and resources to ensure you find the
            solutions you need quickly and effectively, empowering you to make
            informed decisions. Contact us.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl divide-y divide-line border-t border-line">
          {ITEMS.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} className="py-6">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid w-full grid-cols-[1fr_auto] items-start gap-6 text-left lg:grid-cols-[1fr_1.2fr_auto]"
                >
                  <span className="text-h4 font-medium text-dark-text">
                    {it.q}
                  </span>
                  <span
                    className={`hidden text-small leading-relaxed text-gray-300 lg:block ${
                      isOpen ? "" : "lg:line-clamp-1 lg:opacity-60"
                    }`}
                  >
                    {it.a}
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full border border-line text-gray-200">
                    {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-small leading-relaxed text-gray-300 lg:hidden">
                    {it.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
