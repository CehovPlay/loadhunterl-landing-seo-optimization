const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    img: "/figma/feat-card1-img.png",
    // Figma: container 546x350 @ top 89, img shifted 5.47% down
    imgBox: { top: 89, height: 350 },
    imgCls: "absolute left-0 top-[5.47%] size-full max-w-none",
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most— booking the best loads.",
    img: "/figma/feat-card2-img.png",
    imgBox: { top: 97, height: 342 },
    imgCls: "absolute left-0 top-0 h-[102.34%] w-full max-w-none",
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    img: "/figma/feat-card3-img.png",
    imgBox: { top: 83, height: 356 },
    imgCls: "absolute left-[-3.85%] top-0 h-[105.62%] w-[107.43%] max-w-none",
  },
]

/* Partners marquee row — Figma PartnersBlock: logos 112x56 @ y40, step 302px */
const PARTNER_SEQ = [
  { src: "/figma/partner-123loadboard.svg", cls: "mt-[18px] h-[19.029px] w-[112px]" },
  { src: "/figma/partner-trucksmarter.svg", cls: "mt-[14px] h-[27.07px] w-[112px]" },
  { src: "/figma/partner-truckstop.svg", cls: "mt-[18px] h-[19.911px] w-[112px]" },
  { src: "/figma/partner-dat.svg", cls: "mt-[16px] h-[24.17px] w-[112px]" },
]

function PartnerLogo({ x, idx }: { x: number; idx: number }) {
  const p = PARTNER_SEQ[idx % 4]
  return (
    <div className="absolute top-[40px] h-[56px] w-[112px]" style={{ left: x }}>
      <img src={p.src} alt="" className={p.cls} />
    </div>
  )
}

export function Features() {
  // Figma x positions: -20, 282, 584, 886, 1188, 1490, 1792 (step 302)
  const xs = [-20, 282, 584, 886, 1188, 1490, 1792]
  return (
    <section id="why" className="relative w-full bg-bg-light">
      {/* Partners block, 136px */}
      <div className="relative h-[136px] w-full overflow-hidden">
        {xs.map((x, i) => (
          <PartnerLogo key={x} x={x} idx={i} />
        ))}
        {/* edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 h-[136px] w-[189px] bg-gradient-to-r from-[#fafafa] to-[rgba(250,250,250,0)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-[136px] w-[189px] bg-gradient-to-l from-[#fafafa] to-[rgba(250,250,250,0)]" />
      </div>

      <div className="flex w-full flex-col items-center gap-[120px] pb-[120px] pt-[80px]">
        {/* header */}
        <div className="flex w-full flex-col items-center gap-[20px] px-[120px]">
          <div className="flex w-full flex-col items-center gap-[60px]">
            {/* feature icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
            <div className="relative size-[64px]">
              <img
                src="/figma/feat-icon-2x.png"
                alt=""
                className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
              />
            </div>
            <h2 className="w-full text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-ink">
              Everything you need to book faster — nothing extra
            </h2>
          </div>
          <p className="w-full text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            New loads appear instantly — no refresh, no delay. Email or text
            brokers in seconds, not minutes.
          </p>
        </div>

        {/* cards */}
        <div className="flex items-start gap-[20px]">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="relative h-[440px] w-[546px] overflow-hidden rounded-[12px] border border-border-light bg-[#f0f0f0]"
            >
              <div className="absolute left-[-1px] top-[-1px] flex w-[546px] items-center px-[14px] py-[20px]">
                <div className="flex w-[518px] flex-col items-start gap-[12px]">
                  <p className="w-full text-center text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-ink">
                    {c.title}
                  </p>
                  <p className="w-full text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
                    {c.body}
                  </p>
                </div>
              </div>
              <div
                className="absolute left-[-1px] w-[546px] overflow-hidden"
                style={{ top: c.imgBox.top, height: c.imgBox.height }}
              >
                <img src={c.img} alt="" className={c.imgCls} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
