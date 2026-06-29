import featIcon from "/figma/feat-icon.png"
import card1 from "/figma/feat-card1.png"
import card2 from "/figma/feat-card2.png"
import card3 from "/figma/feat-card3.png"

const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    img: card1,
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most — booking the best loads.",
    img: card2,
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    img: card3,
  },
]

export function Features() {
  return (
    <section id="why" className="flex flex-col items-center gap-[80px] bg-[#fafafa] px-6 pb-[120px] pt-[80px] lg:px-[120px]">
      {/* header */}
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-[60px]">
          <span
            className="flex size-16 items-center justify-center overflow-hidden rounded-[16px]"
            style={{
              boxShadow:
                "0px 6px 16px -6px rgba(111,81,151,0.48), inset 0px 0px 1px 0px #6f5197, inset 0px 0px 3px 0px rgba(111,81,151,0.24), inset 0px 0px 12px 0px rgba(111,81,151,0.12)",
            }}
          >
            <img src={featIcon} alt="" className="size-16" />
          </span>
          <h2 className="text-center text-[34px] font-medium leading-[1.12] tracking-[-1.36px] text-[#454545] lg:whitespace-nowrap lg:text-[48px] lg:leading-[58px] lg:tracking-[-1.92px]">
            Everything you need to book faster — nothing extra
          </h2>
        </div>
        <p className="text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#686b6f]">
          New loads appear instantly — no refresh, no delay. Email or text
          brokers in seconds, not minutes.
        </p>
      </div>

      {/* cards */}
      <div className="grid w-full max-w-[1680px] gap-5 md:grid-cols-3">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="relative h-[440px] overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-[#f0f0f0]"
          >
            <div className="relative z-10 flex flex-col gap-3 px-[14px] py-5">
              <h3 className="text-center text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-[#454545]">
                {c.title}
              </h3>
              <p className="mx-auto max-w-[440px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#686b6f]">
                {c.body}
              </p>
            </div>
            <img
              src={c.img}
              alt=""
              className="pointer-events-none absolute inset-x-0 bottom-0 top-[89px] w-full object-cover object-top"
            />
          </article>
        ))}
      </div>
    </section>
  )
}
