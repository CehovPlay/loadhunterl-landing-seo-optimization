/**
 * Figma: dark tools mega-frame 2147238623 (914:23995), page y=2194, h=8058.
 * The intro (first 1080px) lives in DispatchIntro.tsx; this section renders
 * the remaining 6978px with 7 absolutely-positioned feature blocks.
 * Block tops here = Figma frameY − 1080.
 */

type Item = {
  y: number
  icon: string
  /** natural PNG width at 1x: 62 (124px png, offset -10) or 52 (104px png) */
  iconW: 62 | 52
  title: string
  sub: string
}

type Block = {
  key: string
  top: number
  height: number
  /** block frame x (E and G sit at 119 in the design) */
  frameX?: number
  textX: number
  titleY: number
  title: string
  descY: number
  desc: string
  /** A uses gray-50 for title+desc; the rest use white/ink-2 */
  lightDesc?: boolean
  items: Item[]
  mockup: { src: string; x: number; y: number; w: number }
}

const BLOCKS: Block[] = [
  {
    key: "a",
    top: 260,
    height: 924,
    textX: 1004,
    titleY: 400,
    title: "Smart-board view",
    descY: 464,
    desc: "We’ve completely redesigned how LoadBoards are displayed by replacing the default DAT  view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    lightDesc: true,
    items: [
      {
        y: 624,
        icon: "/figma/tools/a-icon1.png",
        iconW: 62,
        title: "Performance optimization",
        sub: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported loadboards.",
      },
      {
        y: 744,
        icon: "/figma/tools/a-icon2.png",
        iconW: 62,
        title: "Workflow customization",
        sub: "You can drag, resize, reorder, hide, or pin any load — customizing the loadboard interface to fit their unique dispatching flow.",
      },
    ],
    mockup: { src: "/figma/tools/a-mockup.png", x: 0, y: 0, w: 924 },
  },
  {
    key: "b",
    top: 1304,
    height: 828,
    textX: 0,
    titleY: 400,
    title: "Auto-emailing",
    descY: 464,
    desc: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
    items: [
      {
        y: 544,
        icon: "/figma/tools/b-icon1.png",
        iconW: 52,
        title: "Multiple email accounts",
        sub: "Send emails from multiple accounts automatically, ideal for teams working with different carriers.",
      },
      {
        y: 648,
        icon: "/figma/tools/b-icon2.png",
        iconW: 52,
        title: "AI filtering",
        sub: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant.",
      },
    ],
    mockup: { src: "/figma/tools/b-mockup.png", x: 756, y: 0, w: 924 },
  },
  {
    key: "c",
    top: 2252,
    height: 924,
    textX: 1004,
    titleY: 448,
    title: "Telegram notifications",
    descY: 512,
    desc: "Get instant load alerts from multiple load boards like One and Truckstop directly in Telegram. Stay ahead with real-time updates across all your platforms.",
    items: [
      {
        y: 592,
        icon: "/figma/tools/c-icon1.png",
        iconW: 62,
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        y: 712,
        icon: "/figma/tools/c-icon2.png",
        iconW: 62,
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
    // export render bounds start 29px left of the layout box
    mockup: { src: "/figma/tools/c-mockup.png", x: -29, y: 0, w: 953.5 },
  },
  {
    key: "d",
    top: 3296,
    height: 832,
    textX: 0,
    titleY: 400,
    title: "Integrated TMS",
    descY: 464,
    desc: "Take full control of your dispatching process with a built-in TMS. Track driver timelines, manage workflows, and streamline operations — all within LoadHunter. Perfect for organizing your team and boosting efficiency.",
    items: [
      {
        y: 564,
        icon: "/figma/tools/d-icon1.png",
        iconW: 52,
        title: "Efficient workflow management",
        sub: "Manage dispatch tasks directly in TMS, streamlining communication and boosting productivity.",
      },
      {
        y: 668,
        icon: "/figma/tools/d-icon2.png",
        iconW: 52,
        title: "Improved task planning",
        sub: "Easily track driver schedules and task timelines for better coordination.",
      },
    ],
    mockup: { src: "/figma/tools/d-mockup.png", x: 756, y: 0, w: 924 },
  },
  {
    key: "e",
    top: 4248,
    height: 828,
    frameX: 119,
    textX: 1004,
    titleY: 400,
    title: "Integrated map",
    descY: 464,
    desc: "Easily track routes and load details on an interactive map, all directly within your load board for enhanced convenience.",
    items: [
      {
        y: 544,
        icon: "/figma/tools/e-icon1.png",
        iconW: 62,
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        y: 664,
        icon: "/figma/tools/e-icon2.png",
        iconW: 62,
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
    mockup: { src: "/figma/tools/e-mockup.png", x: 0, y: 0, w: 943 },
  },
  {
    key: "f",
    top: 5180,
    height: 832,
    textX: 0,
    titleY: 400,
    title: "Broker reviews",
    descY: 464,
    desc: "Easily share your experiences working with brokers to help others make informed decisions and avoid potential issues.",
    items: [
      {
        y: 544,
        icon: "/figma/tools/f-icon1.png",
        iconW: 52,
        title: "Verified Payment History",
        sub: "See how long brokers actually take to pay and if they respect detention or layover agreements.",
      },
      {
        y: 648,
        icon: "/figma/tools/f-icon2.png",
        iconW: 52,
        title: "Real-time Red Flags",
        sub: "Get instant alerts on brokers who frequently cancel loads at the last minute or have low credit scores.",
      },
    ],
    mockup: { src: "/figma/tools/f-mockup.png", x: 756, y: 0, w: 924 },
  },
  {
    key: "g",
    top: 6132,
    height: 844,
    frameX: 119,
    textX: 1004,
    titleY: 400,
    title: "Profit calculator",
    descY: 464,
    desc: "Estimate profitability by factoring in expenses like fuel and miles, giving you clear insights to maximize your earnings.",
    items: [
      {
        y: 544,
        icon: "/figma/tools/g-icon1.png",
        iconW: 62,
        title: "Full Expense Breakdown",
        sub: "Account for fuel consumption, current diesel prices, and tolls automatically. Know your true net profit before you even call the broker.",
      },
      {
        y: 664,
        icon: "/figma/tools/g-icon2.png",
        iconW: 62,
        title: "Smart RPM+ Evaluation",
        sub: "Evaluate load profitability including deadhead miles (DHO/DHD). Don't settle for high gross if the Rate Per Mile doesn't meet your margin goals.",
      },
    ],
    mockup: { src: "/figma/tools/g-mockup.png", x: 0, y: 0, w: 924 },
  },
]

function ToolBlock({ b }: { b: Block }) {
  const titleCls = b.lightDesc ? "text-gray-50" : "text-white"
  const descCls = b.lightDesc ? "text-gray-50" : "text-ink-2"
  return (
    <div
      className="absolute w-[1680px]"
      style={{ top: b.top, height: b.height, left: b.frameX ?? 120 }}
    >
      <img loading="lazy" decoding="async"
        src={b.mockup.src}
        alt=""
        className="absolute max-w-none"
        style={{ left: b.mockup.x, top: b.mockup.y, width: b.mockup.w }}
      />

      {/* text column */}
      <div className="absolute top-0 h-full w-[676px]" style={{ left: b.textX }}>
        <h3
          className={`absolute w-full text-[30px] font-medium leading-[40px] tracking-[-1.2px] ${titleCls}`}
          style={{ top: b.titleY }}
        >
          {b.title}
        </h3>
        <p
          className={`absolute w-full text-[16px] font-medium leading-[20px] tracking-[-0.64px] ${descCls}`}
          style={{ top: b.descY }}
        >
          {b.desc}
        </p>
        {b.items.map((it) => (
          <div key={it.title} className="absolute w-full" style={{ top: it.y }}>
            {/* icon 42x42; PNG has baked margins (see iconW) */}
            <div className="absolute left-0 top-0 size-[42px]">
              <img loading="lazy" decoding="async"
                src={it.icon}
                alt=""
                className="absolute top-0 max-w-none"
                style={{
                  left: it.iconW === 62 ? -10 : 0,
                  width: it.iconW,
                }}
              />
            </div>
            <div className="absolute left-[62px] top-0 w-[614px]">
              <h4
                className={`text-[16px] font-medium leading-[20px] tracking-[-0.64px] ${
                  b.lightDesc ? "text-gray-50" : "text-white"
                }`}
              >
                {it.title}
              </h4>
              <p className="mt-[8px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
                {it.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Tools() {
  return (
    <section id="features" className="relative h-[6978px] bg-gray-800">
      {BLOCKS.map((b) => (
        <ToolBlock key={b.key} b={b} />
      ))}
    </section>
  )
}
