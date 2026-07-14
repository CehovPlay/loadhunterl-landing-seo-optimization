/**
 * Figma: Tablet (768) frame 916:70003 → Group 2085665212 (921:86999),
 * 768x9387 @ frame y=2703 (+120px dark tail → section h=9507).
 * Stacked: dispatchers intro (0–1080), 7 tools blocks (1080–7584),
 * white orbit strip (7624–8387), light ecosystem section clipped at
 * 1000px (8387–9387), dark tail (9387–9507).
 * Mockups/orbit/eco cards are tablet-specific 2x exports (render bounds
 * verified equal to layout bounds via cross-correlation, dx=dy=0).
 */

type ToolItem = {
  icon: string
  /** natural PNG width at 1x: 62 (baked shadow, offset -10) or 52 */
  iconW: 62 | 52
  y: number
  title: string
  sub: string
}

type ToolBlock = {
  key: string
  top: number
  title: string
  desc: string
  /** block A uses gray-50 for title/desc/item titles; the rest white/ink-2 */
  lightDesc?: boolean
  mockup: { src: string; w: number; h: number }
  textY: number
  items: ToolItem[]
}

const BLOCKS: ToolBlock[] = [
  {
    key: "a",
    top: 1080,
    title: "Smart-board view",
    desc: "We’ve completely redesigned how LoadBoards are displayed by replacing the default DAT  view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    lightDesc: true,
    mockup: { src: "/figma/tablet/tool-a.png", w: 688, h: 437 },
    textY: 477,
    items: [
      {
        icon: "/figma/tools/a-icon1.png",
        iconW: 62,
        y: 224,
        title: "Performance optimization",
        sub: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported loadboards.",
      },
      {
        icon: "/figma/tools/a-icon2.png",
        iconW: 62,
        y: 344,
        title: "Workflow customization",
        sub: "You can drag, resize, reorder, hide, or pin any load — customizing the loadboard interface to fit their unique dispatching flow.",
      },
    ],
  },
  {
    key: "b",
    top: 2079,
    title: "Auto-emailing",
    desc: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
    mockup: { src: "/figma/tablet/tool-b.png", w: 688, h: 437.07 },
    textY: 469.07,
    items: [
      {
        icon: "/figma/tools/b-icon1.png",
        iconW: 52,
        y: 144,
        title: "Multiple email accounts",
        sub: "Send emails from multiple accounts automatically, ideal for teams working with different carriers.",
      },
      {
        icon: "/figma/tools/b-icon2.png",
        iconW: 52,
        y: 248,
        title: "AI filtering",
        sub: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant.",
      },
    ],
  },
  {
    key: "c",
    top: 2974.07,
    title: "Telegram notifications",
    desc: "Get instant load alerts from multiple load boards like One and Truckstop directly in Telegram. Stay ahead with real-time updates across all your platforms.",
    mockup: { src: "/figma/tablet/tool-c.png", w: 688, h: 559 },
    textY: 591,
    items: [
      {
        icon: "/figma/tools/c-icon1.png",
        iconW: 62,
        y: 144,
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        icon: "/figma/tools/c-icon2.png",
        iconW: 62,
        y: 264,
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
  },
  {
    key: "d",
    top: 3991.07,
    title: "Integrated TMS",
    desc: "Take full control of your dispatching process with a built-in TMS. Track driver timelines, manage workflows, and streamline operations — all within LoadHunter. Perfect for organizing your team and boosting efficiency.",
    mockup: { src: "/figma/tablet/tool-d.png", w: 688, h: 468.07 },
    textY: 500.07,
    items: [
      {
        icon: "/figma/tools/d-icon1.png",
        iconW: 52,
        y: 164,
        title: "Efficient workflow management",
        sub: "Manage dispatch tasks directly in TMS, streamlining communication and boosting productivity.",
      },
      {
        icon: "/figma/tools/d-icon2.png",
        iconW: 52,
        y: 268,
        title: "Improved task planning",
        sub: "Easily track driver schedules and task timelines for better coordination.",
      },
    ],
  },
  {
    key: "e",
    top: 4921.15,
    title: "Integrated map",
    desc: "Easily track routes and load details on an interactive map, all directly within your load board for enhanced convenience.",
    // export render is 19px wider than the layout box (map glow bleeds right)
    mockup: { src: "/figma/tablet/tool-e.png", w: 707, h: 474 },
    textY: 506,
    items: [
      {
        icon: "/figma/tools/e-icon1.png",
        iconW: 62,
        y: 144,
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        icon: "/figma/tools/e-icon2.png",
        iconW: 62,
        y: 264,
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
  },
  {
    key: "f",
    top: 5853.15,
    title: "Broker reviews",
    desc: "Easily share your experiences working with brokers to help others make informed decisions and avoid potential issues.",
    mockup: { src: "/figma/tablet/tool-f.png", w: 688, h: 510.79 },
    textY: 542.79,
    items: [
      {
        icon: "/figma/tools/f-icon1.png",
        iconW: 52,
        y: 144,
        title: "Verified Payment History",
        sub: "See how long brokers actually take to pay and if they respect detention or layover agreements.",
      },
      {
        icon: "/figma/tools/f-icon2.png",
        iconW: 52,
        y: 248,
        title: "Real-time Red Flags",
        sub: "Get instant alerts on brokers who frequently cancel loads at the last minute or have low credit scores.",
      },
    ],
  },
  {
    key: "g",
    top: 6805.94,
    title: "Profit calculator",
    desc: "Estimate profitability by factoring in expenses like fuel and miles, giving you clear insights to maximize your earnings.",
    mockup: { src: "/figma/tablet/tool-g.png", w: 688, h: 422.5 },
    textY: 454.5,
    items: [
      {
        icon: "/figma/tools/g-icon1.png",
        iconW: 62,
        y: 144,
        title: "Full Expense Breakdown",
        sub: "Account for fuel consumption, current diesel prices, and tolls automatically. Know your true net profit before you even call the broker.",
      },
      {
        icon: "/figma/tools/g-icon2.png",
        iconW: 62,
        y: 264,
        title: "Smart RPM+ Evaluation",
        sub: "Evaluate load profitability including deadhead miles (DHO/DHD). Don't settle for high gross if the Rate Per Mile doesn't meet your margin goals.",
      },
    ],
  },
]

/** Intro heading — icon @ (352,392), heading frame @ (40,496). */
function DispatchIntroT() {
  return (
    <>
      {/* icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
      <div className="absolute left-[352px] top-[392px] size-[64px]">
        <img loading="lazy" decoding="async"
          src="/figma/tablet/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2 className="absolute left-[40px] top-[496px] w-[688px] text-center text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-gray-50">
        Book better loads faster — without missing
        <br />
        opportunities with game-changing tools
        <br />
        for dispatchers
      </h2>
      <p className="absolute left-[86px] top-[640px] w-[596px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        LoadHunter finds high-RPM loads in real-time, filters the noise, and
        lets you contact brokers instantly — all in one place. Real-time load
        scanning, smart filters, and instant outreach — built for dispatchers
        who want results, not dashboards.
      </p>
    </>
  )
}

function ToolBlockT({ b }: { b: ToolBlock }) {
  const titleCls = b.lightDesc ? "text-gray-50" : "text-white"
  const descCls = b.lightDesc ? "text-gray-50" : "text-ink-2"
  return (
    <div className="absolute left-[40px] w-[688px]" style={{ top: b.top }}>
      <img loading="lazy" decoding="async"
        src={b.mockup.src}
        alt=""
        className="absolute left-0 top-0 max-w-none"
        style={{ width: b.mockup.w, height: b.mockup.h }}
      />
      <div className="absolute left-0 w-full" style={{ top: b.textY }}>
        <h3
          className={`absolute top-0 w-full text-[30px] font-medium leading-[40px] tracking-[-1.2px] ${titleCls}`}
        >
          {b.title}
        </h3>
        <p
          className={`absolute top-[64px] w-full text-[16px] font-medium leading-[20px] tracking-[-0.64px] ${descCls}`}
        >
          {b.desc}
        </p>
        {b.items.map((it) => (
          <div key={it.title} className="absolute w-full" style={{ top: it.y }}>
            {/* icon 42x42; PNG has baked shadow margins (see iconW) */}
            <div className="absolute left-0 top-0 size-[42px]">
              <img loading="lazy" decoding="async"
                src={it.icon}
                alt=""
                className="absolute top-0 max-w-none"
                style={{ left: it.iconW === 62 ? -10 : 0, width: it.iconW }}
              />
            </div>
            <div className="absolute left-[62px] top-0 w-[626px]">
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

/** White orbit strip — Group 2085665057 (920:60643), single 2x export. */
function OrbitT() {
  return (
    <div className="absolute left-0 top-[7624px] h-[763px] w-full bg-white">
      <img loading="lazy" decoding="async"
        src="/figma/tablet/orbit.png"
        alt=""
        aria-hidden
        className="absolute left-0 top-0 w-[768px] max-w-none"
      />
    </div>
  )
}

/**
 * Ecosystem — Frame 2147238589 (921:82383) 768x1000. The light block is the
 * pin stage: initEcosystemPin() (see src/lib/ecosystemPin.ts) pins it at the
 * viewport centre, grows it to the full viewport height and scrolls the
 * product list through the window below the heading, then releases. The div's
 * height reserves the resting 1000px block plus the 2500px pinned runway
 * (expand 400 + listScroll 2100).
 * Cards 1–2 are the Figma 2x exports; cards 3–6 are hidden (unrenderable) in
 * the tablet Figma frame, so they're rebuilt in HTML from the desktop
 * ecosystem assets following the exported cards' layout.
 */

const ECO_DESC =
  "Comprehensive transport management system providing a single platform to manage all aspects."

const ECO_PRODUCTS = [
  { name: "huntTMS", logo: "/figma/eco/logo2.png", logoW: 113, mockup: "/figma/eco/row2.png", live: true },
  { name: "huntPAY", logo: "/figma/eco/logo3.png", logoW: 109, mockup: "/figma/eco/row3.png" },
  { name: "huntDRIVE", logo: "/figma/eco/logo4.png", logoW: 130, mockup: "/figma/eco/row4.png" },
  { name: "fleetHUNT", logo: "/figma/eco/logo5.png", logoW: 126, mockup: "/figma/eco/row5.png" },
  { name: "huntONE", logo: "/figma/eco/logo6.png", logoW: 114, mockup: "/figma/eco/row6.png" },
]

function EcoCardT({ p }: { p: (typeof ECO_PRODUCTS)[number] }) {
  return (
    <div className="relative h-[450px] w-[688px] shrink-0 overflow-hidden rounded-[12px] bg-white">
      <img loading="lazy" decoding="async"
        src={p.logo}
        alt={p.name}
        className="absolute left-[32px] top-[32px] h-[24px] max-w-none"
        style={{ width: p.logoW }}
      />
      <p className="absolute left-[32px] top-[104px] w-[560px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-ink-2">
        {ECO_DESC}
      </p>
      {!p.live && (
        <div className="absolute left-[32px] top-[168px] inline-flex h-[28px] items-center justify-center rounded-[99px] border border-white bg-[#6f5197] px-[12px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
            Coming soon
          </span>
        </div>
      )}
      <img loading="lazy" decoding="async"
        src={p.mockup}
        alt={`${p.name} product preview`}
        className="absolute left-[32px] top-[224px] w-[624px] max-w-none"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e8e8e8]" />
    </div>
  )
}

function EcosystemT() {
  return (
    <div
      id="offers"
      data-eco-pin='{"sectionW":768,"cardH":1000,"cardTop":0,"cardLeft":0,"cardW":768,"radius":0,"expand":400,"listContent":3080,"listScroll":2100}'
      className="absolute left-0 top-[8387px] h-[3500px] w-full"
    >
      <div
        data-eco-stage
        data-no-reveal
        className="absolute left-0 top-0 h-[1000px] w-[768px] overflow-hidden bg-[#ebeaec] will-change-transform"
      >
        <div data-eco-inner className="absolute inset-0 will-change-transform">
          {/* the window spans the whole card: the heading is part of the
              scrolled content (it drifts away with the list) and cards clip
              only at the card/viewport edge, not at a mid-screen boundary */}
          <div
            data-eco-window
            className="absolute inset-0 overflow-hidden will-change-[transform,height]"
          >
            <div data-eco-list className="relative will-change-transform">
              <div className="relative h-[240px]">
                {/* icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
                <div className="absolute left-[40px] top-[80px] size-[64px]">
                  <img loading="lazy" decoding="async"
                    src="/figma/tablet/eco-icon.png"
                    alt=""
                    className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
                  />
                </div>
                <h2 className="absolute left-[144px] top-[80px] w-[564px] text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-ink">
                  Our ecosystem products
                </h2>
                <p className="absolute left-[144px] top-[132px] w-[564px] text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-ink">
                  Everything you need to find, evaluate, and book loads — faster,
                  smarter, and in one place.
                </p>
              </div>
              <div className="ml-[40px] flex w-[688px] flex-col gap-[20px] pb-[40px]">
              {/* card 1 is the Figma 2x export; the rest are hidden in the
                  tablet frame (unrenderable), rebuilt as EcoCardT */}
              <img loading="lazy" decoding="async"
                src="/figma/tablet/eco-card1.png"
                alt="LoadHunter Extension — AI browser tool for major LoadBoards"
                className="w-[688px] max-w-none"
              />
              {ECO_PRODUCTS.map((p) => (
                <EcoCardT key={p.name} p={p} />
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TabletMain() {
  // height: the design's 9507 plus the ecosystem pin runway (2500)
  return (
    <section id="features" className="relative bg-gray-800" style={{ height: 12007 }}>
      <DispatchIntroT />
      {BLOCKS.map((b) => (
        <ToolBlockT key={b.key} b={b} />
      ))}
      <OrbitT />
      <EcosystemT />
    </section>
  )
}
