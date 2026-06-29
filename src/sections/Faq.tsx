import { HelpCircle } from "lucide-react"

const ITEMS = [
  {
    q: "How do I install and set up LoadHunter?",
    a: "The installation process is simple! Just go to the Chrome Web Store, find \"LoadHunter\" and click \"Add to Chrome\".",
    d: "Once installed, click on the puzzle icon in the top-right corner and pin LoadHunter. Log in with your email, visit your Load Board, and you'll immediately see all the LoadHunter features!",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes! Try an unlimited version of LoadHunter with a 14-day free trial.",
    d: "You can explore all the features and see how it can optimize your dispatching work — no credit card required. Enjoy full access without any obligations!",
  },
  {
    q: "Can I connect my factoring company account to LoadHunter?",
    a: "Yes! With LoadHunter, you can integrate your Factoring Company account directly into the dashboard.",
    d: "This allows you to see factoring ratings right on your LoadBoard, making it easier to evaluate brokers and streamline decision-making.",
  },
  {
    q: "Does LoadHunter work with VOIP for SMS and calls?",
    a: "Absolutely!",
    d: "You can connect your VOIP service and use LoadHunter to send pre-built SMS templates and make calls directly from the extension.",
  },
  {
    q: "Can I cancel my LoadHunter subscription anytime?",
    a: "Yes, you can cancel your LoadHunter subscription at any time.",
    d: "Even after cancellation, the extension will continue to work until the end of your current subscription period.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="flex flex-col items-center bg-[#18191f] px-[120px] pb-[120px] pt-[100px]">
      <span
        className="flex size-12 items-center justify-center rounded-[14px] border border-[#ffffff1a] bg-[#1d1f24] text-violet-300"
        style={{ boxShadow: "0px 6px 16px -6px rgba(111,81,151,0.45), inset 0px 0px 12px 0px rgba(111,81,151,0.12)" }}
      >
        <HelpCircle className="size-5" />
      </span>

      <h2 className="mt-8 text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-[#e8e8e8]">
        Frequently Asked Questions
      </h2>
      <p className="mt-3 max-w-[680px] text-center text-[14px] font-medium leading-[18px] tracking-[-0.56px] text-[#686b6f]">
        Access a wealth of information and resources to ensure you find the
        solutions you need quickly and effectively, empowering you to make
        informed decisions. Contact us.
      </p>

      <div className="mt-14 w-full max-w-[1680px]">
        {ITEMS.map((it) => (
          <div
            key={it.q}
            className="grid grid-cols-2 gap-16 border-t border-[#ffffff14] py-7"
          >
            <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.8px] text-[#e8e8e8]">
              {it.q}
            </h3>
            <div>
              <p className="text-[14px] font-medium leading-[20px] tracking-[-0.56px] text-[#c5c6c8]">
                {it.a}
              </p>
              <p className="mt-2 text-[12px] leading-[18px] tracking-[-0.48px] text-[#686b6f]">
                {it.d}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
