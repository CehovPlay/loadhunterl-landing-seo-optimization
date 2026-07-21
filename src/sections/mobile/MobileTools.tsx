import { Img } from "@/components/site/Img"
import { Container } from "./ui"

type Item = { icon: string; title: string; sub: string }
type Block = { title: string; desc: string; mockup: string; items: [Item, Item] }

/* Mobile mockups are dedicated exports (public/figma/mobile/tools-*.png,
   724px = 2× the 362px slot) — NOT the desktop compositions. They're drawn
   for the phone frame, so they render 1:1 with no cropping or masks. */
const BLOCKS: Block[] = [
  {
    title: "Smart-board view",
    desc: "We've completely redesigned how load boards are displayed by replacing the default DAT view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    mockup: "/figma/mobile/tools-a.png",
    items: [
      {
        icon: "/figma/tools/a-icon1.png",
        title: "Performance optimization",
        sub: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
      },
      {
        icon: "/figma/tools/a-icon2.png",
        title: "Workflow customization",
        sub: "You can drag, resize, reorder, hide, or pin any load — customizing the load board interface to fit their unique dispatching flow.",
      },
    ],
  },
  {
    title: "Auto-emailing",
    desc: "Set your criteria — rate, RPM+, miles, truck type — and LoadHunter emails matching brokers the moment a load appears. One click for a single load, zero clicks once your rules are on.",
    mockup: "/figma/mobile/tools-b.png",
    items: [
      {
        icon: "/figma/tools/b-icon1.png",
        title: "Multiple email accounts",
        sub: "Send emails from multiple accounts automatically, ideal for teams working with different carriers.",
      },
      {
        icon: "/figma/tools/b-icon2.png",
        title: "AI filtering",
        sub: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant.",
      },
    ],
  },
  {
    title: "Telegram notifications",
    desc: "Get instant load alerts from multiple load boards like One and Truckstop directly in Telegram. Stay ahead with real-time updates across all your platforms.",
    mockup: "/figma/mobile/tools-c.png",
    items: [
      {
        icon: "/figma/tools/c-icon1.png",
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        icon: "/figma/tools/c-icon2.png",
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
  },
  {
    title: "Integrated TMS",
    desc: "Take full control of your dispatching process with a built-in TMS. Track driver timelines, manage workflows, and streamline operations — all within LoadHunter. Perfect for organizing your team and boosting efficiency.",
    mockup: "/figma/mobile/tools-d.png",
    items: [
      {
        icon: "/figma/tools/d-icon1.png",
        title: "Efficient workflow management",
        sub: "Manage dispatch tasks directly in TMS, streamlining communication and boosting productivity.",
      },
      {
        icon: "/figma/tools/d-icon2.png",
        title: "Improved task planning",
        sub: "Easily track driver schedules and task timelines for better coordination.",
      },
    ],
  },
  {
    title: "Integrated map",
    desc: "Easily track routes and load details on an interactive map, all directly within your load board for enhanced convenience.",
    mockup: "/figma/mobile/tools-e.png",
    items: [
      {
        icon: "/figma/tools/e-icon1.png",
        title: "Deadhead & trip overlays",
        sub: "See origin, destination and deadhead miles plotted on the route before you commit — the entire road is planned in advance.",
      },
      {
        icon: "/figma/tools/e-icon2.png",
        title: "One-click route view",
        sub: "Open any load's route in the built-in map or jump straight to Google Maps without leaving your load board.",
      },
    ],
  },
  {
    title: "Broker reviews",
    desc: "Easily share your experiences working with brokers to help others make informed decisions and avoid potential issues.",
    mockup: "/figma/mobile/tools-f.png",
    items: [
      {
        icon: "/figma/tools/f-icon1.png",
        title: "Verified payment history",
        sub: "See how long brokers actually take to pay and if they respect detention or layover agreements.",
      },
      {
        icon: "/figma/tools/f-icon2.png",
        title: "Real-time red flags",
        sub: "Get instant alerts on brokers who frequently cancel loads at the last minute or have low credit scores.",
      },
    ],
  },
  {
    title: "Profit calculator",
    desc: "Estimate profitability by factoring in expenses like fuel and miles, giving you clear insights to maximize your earnings.",
    mockup: "/figma/mobile/tools-g.png",
    items: [
      {
        icon: "/figma/tools/g-icon1.png",
        title: "Full expense breakdown",
        sub: "Account for fuel consumption, current diesel prices, and tolls automatically. Know your true net profit before you even call the broker.",
      },
      {
        icon: "/figma/tools/g-icon2.png",
        title: "Smart RPM+ evaluation",
        sub: "Evaluate load profitability including deadhead miles (DHO/DHD). Don't settle for high gross if the Rate Per Mile doesn't meet your margin goals.",
      },
    ],
  },
]

/**
 * Mobile Tools — the user's own mobile structure (Figma 1263:87697):
 * everything centre-aligned, NO spine line / nodes. Per block: full-width
 * mockup → title → description → two items (icon, title, sub), all centred.
 */
export function MobileTools() {
  return (
    <section id="features" className="bg-gray-800 py-16">
      <Container>
        {/* intro — centred: gear icon plate, heading, dimmed sub */}
        <div className="flex flex-col items-center text-center">
          <div data-float className="w-[72px]">
            <Img src="/figma/tools/intro-icon.png" alt="" loading="lazy" decoding="async" className="w-full" />
          </div>
          <h2 className="mt-8 max-w-[900px] text-[clamp(28px,7.7vw,34px)] font-medium leading-[1.2] tracking-[-0.04em] text-white md:text-[40px] md:leading-[48px]">
            Book better loads faster — without missing opportunities with game-changing tools for
            dispatchers
          </h2>
          <p className="mt-4 max-w-[600px] text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
            LoadHunter finds high-RPM loads in real-time, filters the noise, and lets you contact
            brokers instantly — all in one place. Real-time load scanning, smart filters, and
            instant outreach — built for dispatchers who want results, not dashboards.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-20 md:gap-24">
          {BLOCKS.map((b) => (
            <article key={b.title} data-card className="flex flex-col items-center">
              <Img
                src={b.mockup}
                alt={`${b.title} interface`}
                loading="lazy"
                decoding="async"
                className="block w-full max-w-[560px]"
              />
              <h3 className="mt-8 text-center text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-white">
                {b.title}
              </h3>
              <p className="mt-3 max-w-[560px] text-center text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
                {b.desc}
              </p>
              <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-start md:gap-8">
                {b.items.map((it) => (
                  <div key={it.title} className="flex flex-col items-center text-center md:max-w-[340px]">
                    <div className="size-12">
                      <Img src={it.icon} alt="" loading="lazy" decoding="async" className="w-full" />
                    </div>
                    <h4 className="mt-4 text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                      {it.title}
                    </h4>
                    <p className="mt-2.5 max-w-[420px] text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
                      {it.sub}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
