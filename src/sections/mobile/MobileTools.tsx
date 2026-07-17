import { useEffect, useRef } from "react"
import { Img } from "@/components/site/Img"
import { prefersReducedMotion } from "@/lib/inview"
import { Container } from "./ui"

type Item = { icon: string; title: string; sub: string }
type Block = { title: string; desc: string; mockup: string; items: [Item, Item] }

const BLOCKS: Block[] = [
  {
    title: "Smart-board view",
    desc: "We've completely redesigned how load boards are displayed by replacing the default DAT view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    mockup: "/figma/tools/a-mockup.png",
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
    desc: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
    mockup: "/figma/tools/b-mockup.png",
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
    mockup: "/figma/tools/c-mockup.png",
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
    mockup: "/figma/tools/d-mockup.png",
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
    mockup: "/figma/tools/e-mockup.png",
    items: [
      {
        icon: "/figma/tools/e-icon1.png",
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        icon: "/figma/tools/e-icon2.png",
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
  },
  {
    title: "Broker reviews",
    desc: "Easily share your experiences working with brokers to help others make informed decisions and avoid potential issues.",
    mockup: "/figma/tools/f-mockup.png",
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
    mockup: "/figma/tools/g-mockup.png",
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
 * Mobile Tools: intro + the 7 tool blocks stacked along the violet spine.
 * Like desktop, the glowing line is DRAWN by scroll: a dim track runs the
 * full height, and the luminous fill grows until it reaches the viewport
 * centre, igniting each block's node as it passes (scroll + rAF, gated by an
 * IntersectionObserver; reduced-motion gets the fully-drawn state).
 */
export function MobileTools() {
  const areaRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const area = areaRef.current
    const line = lineRef.current
    const fill = fillRef.current
    const tip = tipRef.current
    if (!area || !line || !fill || !tip) return
    const nodes = Array.from(area.querySelectorAll<HTMLElement>("[data-spine-node]"))

    const litNow = (px: number, lineTop: number) => {
      for (const n of nodes) {
        const r = n.getBoundingClientRect()
        const y = r.top - lineTop + r.height / 2
        const lit = px >= y
        n.style.background = lit ? "#C9B3EC" : "#434447"
        n.style.boxShadow = lit ? "0 0 10px rgba(201,179,236,0.9)" : "none"
      }
    }

    if (prefersReducedMotion()) {
      fill.style.height = "100%"
      tip.style.opacity = "0"
      litNow(Infinity, 0)
      return
    }

    let raf = 0
    const update = () => {
      raf = 0
      const rect = line.getBoundingClientRect()
      // the glow tip tracks 60% of the viewport height
      const px = Math.min(rect.height, Math.max(0, window.innerHeight * 0.6 - rect.top))
      fill.style.height = `${px}px`
      tip.style.transform = `translateY(${px}px)`
      tip.style.opacity = px > 4 && px < rect.height - 4 ? "1" : "0"
      litNow(px, rect.top)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // listen only while the section is anywhere near the viewport
    let listening = false
    const start = () => {
      if (listening) return
      listening = true
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onScroll)
      onScroll()
    }
    const stop = () => {
      if (!listening) return
      listening = false
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
    const io = new IntersectionObserver(
      (entries) => (entries[entries.length - 1].isIntersecting ? start() : stop()),
      { rootMargin: "200px 0px 200px 0px" },
    )
    io.observe(area)
    update()

    return () => {
      io.disconnect()
      stop()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="features" className="bg-gray-800 py-16">
      <Container>
        {/* intro — desktop order: heading, subtitle, then the gear icon */}
        <div className="flex flex-col">
          <h2 className="max-w-[900px] text-[clamp(28px,7.7vw,34px)] font-medium leading-[1.2] tracking-[-0.04em] text-white md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] xl:text-[56px] xl:leading-[64px]">
            Book better loads faster — without missing opportunities with game-changing tools for
            dispatchers
          </h2>
          <p className="mt-4 max-w-[600px] text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2 lg:mt-5 lg:max-w-[720px] lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
            LoadHunter finds high-RPM loads in real-time, filters the noise, and lets you contact
            brokers instantly — all in one place. Real-time load scanning, smart filters, and
            instant outreach — built for dispatchers who want results, not dashboards.
          </p>
        </div>

        {/* spine area: the gear icon at the line's origin, the glowing line
            born straight out of it, blocks shifted right of the line */}
        <div ref={areaRef} className="relative mt-14">
          <div data-float className="w-[72px]">
            <Img src="/figma/tools/intro-icon.png" alt="" loading="lazy" decoding="async" className="w-full" />
          </div>

          {/* line container — centered under the icon (icon centre x=36) */}
          <div ref={lineRef} aria-hidden className="absolute bottom-2 left-[35px] top-[64px] w-[2px]">
            {/* track — dim line for the full height */}
            <div className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.08)]" />
            {/* glow fill — height driven by scroll */}
            <div
              ref={fillRef}
              className="absolute left-0 top-0 w-full rounded-full"
              style={{
                height: 0,
                background: "linear-gradient(to bottom, rgba(155,121,206,0.35) 0%, #9B79CE 100%)",
                boxShadow: "0 0 12px rgba(155,121,206,0.55)",
              }}
            />
            {/* luminous tip */}
            <div
              ref={tipRef}
              className="absolute left-1/2 top-[-3px] size-[6px] -translate-x-1/2 rounded-full bg-[#E3D5FA]"
              style={{ opacity: 0, boxShadow: "0 0 14px 4px rgba(201,179,236,0.85)" }}
            />
          </div>

          <div className="mt-12 flex flex-col gap-48 pl-[76px] md:pl-[92px] lg:gap-32">
          {BLOCKS.map((b, bi) => (
            <article
              key={b.title}
              data-card
              className="relative lg:grid lg:grid-cols-2 lg:items-center lg:gap-14"
            >
              {/* ignite node — centered on the line (x=36 of the area) */}
              <span
                data-spine-node
                aria-hidden
                className="absolute left-[-45px] top-[9px] size-[10px] rounded-full transition-[background,box-shadow] duration-300 md:left-[-61px]"
                style={{ background: "#434447" }}
              />
              {/* text column — on laptop it alternates sides with the mockup */}
              <div className={bi % 2 === 1 ? "lg:order-2" : ""}>
                <h3 className="text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-white lg:text-[32px] lg:leading-[40px] lg:tracking-[-1.28px]">
                  {b.title}
                </h3>
                <p className="mt-3 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2 lg:mt-4 lg:text-[16px] lg:leading-[22px] lg:tracking-[-0.64px]">
                  {b.desc}
                </p>
                <div className="mt-8 flex flex-col gap-8">
                  {b.items.map((it) => (
                    <div key={it.title} className="flex flex-col gap-4 md:flex-row md:gap-5">
                      <div className="size-10 shrink-0">
                        <Img src={it.icon} alt="" loading="lazy" decoding="async" className="w-full" />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
                          {it.title}
                        </h4>
                        <p className="mt-2.5 text-[14px] font-medium leading-[19px] tracking-[-0.56px] text-ink-2">
                          {it.sub}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* bare mockup, like desktop — the export carries its own chrome */}
              <Img
                src={b.mockup}
                alt={`${b.title} interface`}
                loading="lazy"
                decoding="async"
                className={`mt-8 block w-full lg:mt-0 ${bi % 2 === 1 ? "lg:order-1" : ""}`}
              />
            </article>
          ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
