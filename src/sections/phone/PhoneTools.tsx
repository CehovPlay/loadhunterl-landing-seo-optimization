/**
 * Figma: Group 2085665222 (926:113307) — 390x4222 @ y2540 (section h 4342,
 * 120px bottom padding). Intro (icon @160, H2 @264, sub @360) + 4 blocks:
 *   A Smart-board view   — mockup y600 362x289, title 929, items 1113/1291
 *   B Auto-emailing      — mockup y1549 362x437, title 2026, items 2162/2324
 *   C Telegram notifs    — mockup y2566 363x295, title 2901, items 3037/3215
 *   D Integrated TMS     — mockup y3457 362x289, title 3786, items 3938/4100
 * Item icons reuse the desktop 42px-button exports (62/52 wide incl. glow);
 * block D uses the design's literal "ico" placeholder buttons.
 */

type Item = {
  y: number
  title: string
  sub: string
  /** desktop PNG reuse: 62-wide (offset −10) or 52-wide render of the 42 box */
  icon?: { src: string; w: 62 | 52 }
}

type Block = {
  key: string
  mockup: { src: string; y: number; w: number }
  titleY: number
  title: string
  descY: number
  desc: string
  /** block A uses gray-50 for title/desc/item titles */
  light?: boolean
  items: Item[]
}

const BLOCKS: Block[] = [
  {
    key: "a",
    mockup: { src: "/figma/phone/tools-a-mockup.png", y: 600, w: 362 },
    titleY: 929,
    title: "Smart-board view",
    descY: 977,
    desc: "We’ve completely redesigned how LoadBoards are displayed by replacing the default DAT  view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    light: true,
    items: [
      {
        y: 1113,
        icon: { src: "/figma/tools/a-icon1.png", w: 62 },
        title: "Performance optimization",
        sub: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported loadboards.",
      },
      {
        y: 1291,
        icon: { src: "/figma/tools/a-icon2.png", w: 62 },
        title: "Workflow customization",
        sub: "You can drag, resize, reorder, hide, or pin any load — customizing the loadboard interface to fit their unique dispatching flow.",
      },
    ],
  },
  {
    key: "b",
    mockup: { src: "/figma/phone/tools-b-mockup.png", y: 1549, w: 362 },
    titleY: 2026,
    title: "Auto-emailing",
    descY: 2074,
    desc: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
    items: [
      {
        y: 2162,
        icon: { src: "/figma/tools/b-icon1.png", w: 52 },
        title: "Multiple email accounts",
        sub: "Send emails from multiple accounts automatically, ideal for teams working with different carriers .",
      },
      {
        y: 2324,
        icon: { src: "/figma/tools/b-icon2.png", w: 52 },
        title: "AI filtering",
        sub: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant.",
      },
    ],
  },
  {
    key: "c",
    mockup: { src: "/figma/phone/tools-c-mockup.png", y: 2566, w: 363 },
    titleY: 2901,
    title: "Telegram notifications",
    descY: 2949,
    desc: "Get instant load alerts from multiple load boards like One and Truckstop directly in Telegram. Stay ahead with real-time updates across all your platforms.",
    items: [
      {
        y: 3037,
        icon: { src: "/figma/tools/c-icon1.png", w: 62 },
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        y: 3215,
        icon: { src: "/figma/tools/c-icon2.png", w: 62 },
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
  },
  {
    key: "d",
    mockup: { src: "/figma/phone/tools-d-mockup.png", y: 3457, w: 362 },
    titleY: 3786,
    title: "Integrated TMS",
    descY: 3834,
    desc: "Take full control of your dispatching process with a built-in TMS. Track driver timelines, manage workflows, and streamline operations — all within LoadHunter. Perfect for organizing your team and boosting efficiency.",
    items: [
      {
        y: 3938,
        title: "Efficient workflow management",
        sub: "Manage dispatch tasks directly in TMS, streamlining communication and boosting productivity.",
      },
      {
        y: 4100,
        title: "Improved task planning",
        sub: "Easily track driver schedules and task timelines for better coordination.",
      },
    ],
  },
]

/** 42x42 white-gradient button with the design's "ico" placeholder label */
function IcoPlaceholder() {
  return (
    <div
      className="relative flex size-[42px] items-center justify-center rounded-[12px] border border-transparent backdrop-blur-[10px]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
        backgroundOrigin: "border-box",
        backgroundClip: "border-box",
        boxShadow:
          "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[-1px] rounded-[12px] p-px"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.05))",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        ico
      </span>
    </div>
  )
}

function ToolItem({ it, light }: { it: Item; light?: boolean }) {
  return (
    <>
      {/* icon — 42x42 box centered @ x174 */}
      <div
        className="absolute left-[174px] size-[42px]"
        style={{ top: it.y }}
      >
        {it.icon ? (
          <img
            src={it.icon.src}
            alt=""
            className="absolute top-0 max-w-none"
            style={{
              left: it.icon.w === 62 ? -10 : 0,
              width: it.icon.w,
            }}
          />
        ) : (
          <IcoPlaceholder />
        )}
      </div>
      <div
        className="absolute left-[14px] w-[362px] text-center"
        style={{ top: it.y + 62 }}
      >
        <h4
          className={`text-[16px] font-medium leading-[20px] tracking-[-0.64px] ${
            light ? "text-gray-50" : "text-white"
          }`}
        >
          {it.title}
        </h4>
        <p className="mt-[8px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
          {it.sub}
        </p>
      </div>
    </>
  )
}

export function PhoneTools() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gray-800"
      style={{ height: 4342 }}
    >
      {/* intro icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
      <div data-float className="absolute left-[163px] top-[160px] size-[64px]">
        <img
          src="/figma/tools/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <h2 className="absolute left-[14px] top-[264px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-gray-50">
        Book better loads faster — without missing opportunities with
        game-changing tools for dispatchers
      </h2>
      <p className="absolute left-[14px] top-[360px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        LoadHunter finds high-RPM loads in real-time, filters the noise, and
        lets you contact brokers instantly — all in one place. Real-time load
        scanning, smart filters, and instant outreach — built for dispatchers
        who want results, not dashboards.
      </p>

      {BLOCKS.map((b) => (
        <div key={b.key} className="contents">
          <img
            src={b.mockup.src}
            alt=""
            className="absolute left-[14px] max-w-none"
            style={{ top: b.mockup.y, width: b.mockup.w }}
          />
          <h3
            className={`absolute left-[14px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] ${
              b.light ? "text-gray-50" : "text-white"
            }`}
            style={{ top: b.titleY }}
          >
            {b.title}
          </h3>
          <p
            className={`absolute left-[14px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] ${
              b.light ? "text-gray-50" : "text-white"
            }`}
            style={{ top: b.descY }}
          >
            {b.desc}
          </p>
          {b.items.map((it) => (
            <ToolItem key={it.title} it={it} light={b.light} />
          ))}
        </div>
      ))}
    </section>
  )
}
