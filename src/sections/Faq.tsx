import { Img } from "@/components/site/Img"
/**
 * Figma: Frame 2147238594 (914:23798) — 1920x1166 @ page y=16643.
 * Section renders y 16643–17689 (h=1046); the frame's bottom 120px padding
 * overlaps the CTA section and is clipped. Header icon @ (928,120), title
 * @ y=244, subtitle @ y=322, FAQ list frame @ (120,474) 1680x572.
 */

type Row = {
  top: number
  q: string
  a: string
  d: React.ReactNode
}

const ROWS: Row[] = [
  {
    top: 0,
    q: "How do I install and set up LoadHunter?",
    a: 'The installation process is simple! Just go to the Chrome Web Store, find "LoadHunter" and click "Add to Chrome".',
    d: (
      <>
        Once installed, click on the puzzle icon in the top-right corner and
        pin LoadHunter.
        <br />
        Log in with your email, visit your load board, and you&rsquo;ll
        immediately see all the LoadHunter features!
      </>
    ),
  },
  {
    top: 124,
    q: "Do you offer a free trial?",
    a: "Yes! Try an unlimited version of LoadHunter with a 14-day free trial.",
    d: "You can explore all the features and see how it can optimize your dispatching work — no credit card required. Enjoy full access without any obligations!",
  },
  {
    top: 248,
    q: "Can I connect my factoring company account to LoadHunter?",
    a: "Yes! With LoadHunter, you can integrate your Factoring Company account directly into the dashboard.",
    d: "This allows you to see factoring ratings right on your load board, making it easier to evaluate brokers and streamline decision-making.",
  },
  {
    top: 356,
    q: "Does LoadHunter work with VoIP for SMS and calls?",
    a: "Absolutely!",
    d: "You can connect your VoIP service and use LoadHunter to send pre-built SMS templates and make calls directly from the extension.",
  },
  {
    top: 464,
    q: "Can I cancel my LoadHunter subscription anytime?",
    a: "Yes, you can cancel your LoadHunter subscription at any time.",
    d: "Even after cancellation, the extension will continue to work until the end of your current subscription period.",
  },
]

/** tapered hairline dividers sit after rows 1–4, in the answers column only */
const LINES = [124, 248, 356, 464]

export function Faq() {
  return (
    <section id="faq" className="relative h-[1046px] overflow-hidden bg-gray-800 [content-visibility:auto] [contain-intrinsic-size:1920px_1046px]">
      {/* icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
      <div data-float className="absolute left-[928px] top-[120px] size-[64px]">
        <Img
          src="/figma/tail/faq-icon.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <h2 className="absolute left-[119px] top-[244px] w-[1680px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        Frequently asked questions
      </h2>

      <p className="absolute left-[119px] top-[322px] w-[1680px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Access a wealth of information and resources to ensure you find the
        solutions you need quickly and effectively, empowering you to make
        informed decisions.
      </p>

      {/* FAQ list — questions left (780), answers right @ x=860 (820) */}
      <div className="absolute left-[120px] top-[474px] h-[572px] w-[1680px]">
        {ROWS.map((r) => (
          <div key={r.q} className="absolute left-0 w-full" style={{ top: r.top }}>
            <h3 className="absolute left-0 top-[25px] w-[780px] text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-[#e8e8e8]">
              {r.q}
            </h3>
            <p className="absolute left-[860px] top-[24px] w-[820px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#e8e8e8]">
              {r.a}
            </p>
            <p className="absolute left-[860px] top-[68px] w-[820px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
              {r.d}
            </p>
          </div>
        ))}

        {LINES.map((y) => (
          <Img
            key={y}
            src="/figma/tail/faq-line.svg"
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute left-[860px] h-px w-[820px] max-w-none"
            style={{ top: y - 0.5 }}
          />
        ))}
      </div>
    </section>
  )
}
