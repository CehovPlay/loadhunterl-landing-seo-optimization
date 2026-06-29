import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  Zap, SlidersHorizontal, AtSign, Filter, Layers, Workflow,
  CalendarCheck, BadgeCheck, Flag, Receipt, TrendingUp,
} from "lucide-react"

import mSmart from "/figma/tools/smartboard.png"
import mAuto from "/figma/tools/autoemail.png"
import mTelegram from "/figma/tools/telegram.png"
import mTms from "/figma/tools/tms.png"
import mMap from "/figma/tools/map.png"
import mReviews from "/figma/tools/reviews.png"
import mProfit from "/figma/tools/profit.png"

type Item = { icon: ReactNode; title: string; body: string }

function FeatureItem({ it }: { it: Item }) {
  return (
    <div className="flex gap-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-[#ffffff14] bg-[#26282e] text-[#a3a4a6]">
        {it.icon}
      </span>
      <div>
        <h4 className="text-[14px] font-medium tracking-[-0.56px] text-[#e8e8e8]">{it.title}</h4>
        <p className="mt-1 max-w-[420px] text-[12px] leading-[18px] tracking-[-0.48px] text-[#686b6f]">{it.body}</p>
      </div>
    </div>
  )
}

function Copy({ heading, desc, items }: { heading: string; desc: string; items: Item[] }) {
  return (
    <div className="max-w-[560px]">
      <h3 className="text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-[#e8e8e8]">{heading}</h3>
      <p className="mt-4 text-[14px] leading-[20px] tracking-[-0.56px] text-[#8c8d8f]">{desc}</p>
      <div className="mt-8 space-y-6">
        {items.map((it) => <FeatureItem key={it.title} it={it} />)}
      </div>
    </div>
  )
}

function Mockup({ src }: { src: string }) {
  return <img src={src} alt="" className="w-full rounded-[12px]" />
}

type Block = {
  heading: string
  desc: string
  items: Item[]
  mockup: string
  layout: "top" | "left" | "right" // mockup position
}

const BLOCKS: Block[] = [
  {
    heading: "Smart-board view",
    desc: "We've completely redesigned how LoadBoards are displayed by replacing the default DAT view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    items: [
      { icon: <Zap className="size-4" />, title: "Performance optimization", body: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported loadboards." },
      { icon: <SlidersHorizontal className="size-4" />, title: "Workflow customization", body: "You can drag, resize, reorder, hide, or pin any load — customizing the loadboard interface to fit your unique dispatching flow." },
    ],
    mockup: mSmart, layout: "top",
  },
  {
    heading: "Auto-emailing",
    desc: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
    items: [
      { icon: <AtSign className="size-4" />, title: "Multiple email accounts", body: "Send emails from multiple accounts automatically, ideal for teams working with different carriers." },
      { icon: <Filter className="size-4" />, title: "AI filtering", body: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant." },
    ],
    mockup: mAuto, layout: "right",
  },
  {
    heading: "Telegram notifications",
    desc: "Get instant load alerts from multiple load boards like One and Truckstop directly in Telegram. Stay ahead with real-time updates across all your platforms.",
    items: [
      { icon: <SlidersHorizontal className="size-4" />, title: "Advanced filtering", body: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency." },
      { icon: <Layers className="size-4" />, title: "Multiple load-boards", body: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow." },
    ],
    mockup: mTelegram, layout: "left",
  },
  {
    heading: "Integrated TMS",
    desc: "Take full control of your dispatching process with a built-in TMS. Track driver timelines, manage workflows, and streamline operations — all within LoadHunter. Perfect for organizing your team and boosting efficiency.",
    items: [
      { icon: <Workflow className="size-4" />, title: "Efficient workflow management", body: "Manage dispatch tasks directly in TMS, streamlining communication and boosting productivity." },
      { icon: <CalendarCheck className="size-4" />, title: "Improved task planning", body: "Easily track driver schedules and task timelines for better coordination." },
    ],
    mockup: mTms, layout: "right",
  },
  {
    heading: "Integrated map",
    desc: "Easily track routes and load details on an interactive map, all directly within your load board for enhanced convenience.",
    items: [
      { icon: <SlidersHorizontal className="size-4" />, title: "Advanced filtering", body: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency." },
      { icon: <Layers className="size-4" />, title: "Multiple load-boards", body: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow." },
    ],
    mockup: mMap, layout: "left",
  },
  {
    heading: "Broker reviews",
    desc: "Easily share your experiences working with brokers to help others make informed decisions and avoid potential issues.",
    items: [
      { icon: <BadgeCheck className="size-4" />, title: "Verified Payment History", body: "See how long brokers actually take to pay and if they require detention or lumper agreements." },
      { icon: <Flag className="size-4" />, title: "Real-time Red Flags", body: "Get instant alerts on brokers who frequently cancel loads at the last minute or have low credit scores." },
    ],
    mockup: mReviews, layout: "right",
  },
  {
    heading: "Profit calculator",
    desc: "Estimate profitability by factoring in expenses like fuel and miles, giving you clear insights to maximize your earnings.",
    items: [
      { icon: <Receipt className="size-4" />, title: "Full Expense Breakdown", body: "Account for fuel consumption, current diesel prices, and tolls automatically. Know your true net profit before you even talk to the broker." },
      { icon: <TrendingUp className="size-4" />, title: "Smart RPM+ Evaluation", body: "Evaluate true profitability including deadhead miles (DHO/DHD). Don't settle for high gross if the fees file doesn't meet your margin goals." },
    ],
    mockup: mProfit, layout: "left",
  },
]

export function Tools() {
  return (
    <section id="features" className="bg-[#18191f] px-[120px] py-[40px]">
      <div className="mx-auto max-w-[1680px] space-y-[120px]">
        {BLOCKS.map((b) => {
          if (b.layout === "top") {
            return (
              <div key={b.heading}>
                <Mockup src={b.mockup} />
                <div className="mt-10 flex justify-end">
                  <Copy heading={b.heading} desc={b.desc} items={b.items} />
                </div>
              </div>
            )
          }
          return (
            <div key={b.heading} className="grid grid-cols-2 items-center gap-16">
              <div className={cn(b.layout === "left" ? "order-1" : "order-2")}>
                <Mockup src={b.mockup} />
              </div>
              <div className={cn("flex", b.layout === "left" ? "order-2 justify-start" : "order-1 justify-end")}>
                <Copy heading={b.heading} desc={b.desc} items={b.items} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
