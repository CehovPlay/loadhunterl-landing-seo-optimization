import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Img } from "@/components/site/Img"
import { prefersReducedMotion } from "@/lib/inview"

/**
 * Dark tools mega-frame, rebuilt to Figma 1206:96802 (intro + zigzag blocks
 * in ONE section — the old DispatchIntro was merged in so the spine is a
 * single seamless SVG path):
 *
 *   heading (x120, y220, left-aligned) → subtitle (y360) → 220px air →
 *   gear icon (120, 596). The glowing spine is born at the icon: horizontal
 *   run right → soft arc → vertical drop at the CANVAS CENTRE (x=960).
 *   Feature blocks alternate sides of the centre line (1st right, 2nd left,
 *   …), each with a node on the spine at title level (+20). Block column
 *   w=777; title → desc → 80px → mockup (w=777) → 80px → items; block pitch
 *   1461.
 *
 * The path is revealed with stroke-dashoffset; the vertical front is kept
 * px-aligned with the 60%-viewport line (the curve prefix is compressed into
 * the pre-vertical scroll distance). All scroll math reads live
 * getBoundingClientRect per gsap.ticker frame — immune to the scaled canvas
 * and Lenis smoothing (ScrollTrigger mis-measures inside transform: scale()).
 * IO-gated so it costs nothing off-screen.
 *
 * Block text elements get the hero-headline entrance (rise out of a light
 * blur, expo.out) via [data-tb] targets; the software mockup emerges from
 * the dark (fade + rise + brightness ramp) via [data-tb-mockup] — the global
 * reveal cascade is opted out.
 */

type Item = {
  icon: string
  /** natural PNG width at 1x: 62 (124px png, offset -10) or 52 (104px png) */
  iconW: 62 | 52
  title: string
  sub: string
}

type Block = {
  key: string
  title: string
  desc: string
  items: Item[]
  mockup: string
}

/* ------------------------------------------------- geometry constants --- */
const CENTER_X = 960 // spine vertical, canvas centre
const ICON_Y = 628 // icon centre — the horizontal run's y
const ARC_R = 150 // corner radius of the horizontal→vertical turn
const CURVE_END_Y = ICON_Y + ARC_R // where the arc lands on the vertical
const SPINE_D = `M 206 ${ICON_Y} H ${CENTER_X - ARC_R} Q ${CENTER_X} ${ICON_Y} ${CENTER_X} ${CURVE_END_Y}`
const BLOCK0_Y = 1028 // first block title top
const PITCH = 1461 // title-to-title vertical rhythm
const NODE_OFFSET = 20 // node sits level with the block title
const BLOCK_W = 688 // matches the mock exports’ native width — text aligns to the mock edge
const RIGHT_X = 1020 // blocks right of the spine
const LEFT_X = 120 // blocks left of the spine
const SPINE_BOTTOM = BLOCK0_Y + 6 * PITCH + NODE_OFFSET // last node
const SECTION_H = 10960
const SPINE_PATH = `${SPINE_D} V ${SPINE_BOTTOM}`

const BLOCKS: Block[] = [
  {
    key: "a",
    title: "Smart-board view",
    desc: "We’ve completely redesigned how load boards are displayed by replacing the default DAT view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing.",
    items: [
      {
        icon: "/figma/tools/a-icon1.png",
        iconW: 62,
        title: "Performance optimization",
        sub: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards.",
      },
      {
        icon: "/figma/tools/a-icon2.png",
        iconW: 62,
        title: "Workflow customization",
        sub: "You can drag, resize, reorder, hide, or pin any load — customizing the load board interface to fit their unique dispatching flow.",
      },
    ],
    mockup: "/figma/desk/tools-a.png",
  },
  {
    key: "b",
    title: "Auto-emailing",
    desc: "Set your criteria — rate, RPM+, miles, truck type — and LoadHunter emails matching brokers the moment a load appears. One click for a single load, zero clicks once your rules are on.",
    items: [
      {
        icon: "/figma/tools/b-icon1.png",
        iconW: 52,
        title: "Multiple email accounts",
        sub: "Send emails from multiple accounts automatically, ideal for teams working with different carriers.",
      },
      {
        icon: "/figma/tools/b-icon2.png",
        iconW: 52,
        title: "AI filtering",
        sub: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant.",
      },
    ],
    mockup: "/figma/desk/tools-b.png",
  },
  {
    key: "c",
    title: "Telegram notifications",
    desc: "Get instant load alerts from multiple load boards like One and Truckstop directly in Telegram. Stay ahead with real-time updates across all your platforms.",
    items: [
      {
        icon: "/figma/tools/c-icon1.png",
        iconW: 62,
        title: "Advanced filtering",
        sub: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency.",
      },
      {
        icon: "/figma/tools/c-icon2.png",
        iconW: 62,
        title: "Multiple load-boards",
        sub: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow.",
      },
    ],
    mockup: "/figma/desk/tools-c.png",
  },
  {
    key: "d",
    title: "Integrated TMS",
    desc: "Take full control of your dispatching process with a built-in TMS. Track driver timelines, manage workflows, and streamline operations — all within LoadHunter. Perfect for organizing your team and boosting efficiency.",
    items: [
      {
        icon: "/figma/tools/d-icon1.png",
        iconW: 52,
        title: "Efficient workflow management",
        sub: "Manage dispatch tasks directly in TMS, streamlining communication and boosting productivity.",
      },
      {
        icon: "/figma/tools/d-icon2.png",
        iconW: 52,
        title: "Improved task planning",
        sub: "Easily track driver schedules and task timelines for better coordination.",
      },
    ],
    mockup: "/figma/desk/tools-d.png",
  },
  {
    key: "e",
    title: "Integrated map",
    desc: "Easily track routes and load details on an interactive map, all directly within your load board for enhanced convenience.",
    items: [
      {
        icon: "/figma/tools/e-icon1.png",
        iconW: 62,
        title: "Deadhead & trip overlays",
        sub: "See origin, destination and deadhead miles plotted on the route before you commit — the entire road is planned in advance.",
      },
      {
        icon: "/figma/tools/e-icon2.png",
        iconW: 62,
        title: "One-click route view",
        sub: "Open any load's route in the built-in map or jump straight to Google Maps without leaving your load board.",
      },
    ],
    mockup: "/figma/desk/tools-e.png",
  },
  {
    key: "f",
    title: "Broker reviews",
    desc: "Easily share your experiences working with brokers to help others make informed decisions and avoid potential issues.",
    items: [
      {
        icon: "/figma/tools/f-icon1.png",
        iconW: 52,
        title: "Verified payment history",
        sub: "See how long brokers actually take to pay and if they respect detention or layover agreements.",
      },
      {
        icon: "/figma/tools/f-icon2.png",
        iconW: 52,
        title: "Real-time red flags",
        sub: "Get instant alerts on brokers who frequently cancel loads at the last minute or have low credit scores.",
      },
    ],
    mockup: "/figma/desk/tools-f.png",
  },
  {
    key: "g",
    title: "Profit calculator",
    desc: "Estimate profitability by factoring in expenses like fuel and miles, giving you clear insights to maximize your earnings.",
    items: [
      {
        icon: "/figma/tools/g-icon1.png",
        iconW: 62,
        title: "Full expense breakdown",
        sub: "Account for fuel consumption, current diesel prices, and tolls automatically. Know your true net profit before you even call the broker.",
      },
      {
        icon: "/figma/tools/g-icon2.png",
        iconW: 62,
        title: "Smart RPM+ evaluation",
        sub: "Evaluate load profitability including deadhead miles (DHO/DHD). Don't settle for high gross if the Rate Per Mile doesn't meet your margin goals.",
      },
    ],
    mockup: "/figma/desk/tools-g.png",
  },
]

/* -------------------------------------------------------------- blocks --- */

function ToolBlock({ b, index }: { b: Block; index: number }) {
  const left = index % 2 === 0 ? RIGHT_X : LEFT_X
  // data-no-reveal: the block runs its own blur-rise entrance (same motion as
  // the hero headline) driven from the effect below — the global reveal
  // cascade must not double-animate. [data-tb] marks the entrance targets.
  return (
    <div
      data-tool-block={b.key}
      data-no-reveal
      className="absolute"
      style={{ top: BLOCK0_Y + index * PITCH, left, width: BLOCK_W }}
    >
      <h3 data-tb className="text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-white">
        {b.title}
      </h3>
      <p data-tb className="mt-[16px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-ink-2">
        {b.desc}
      </p>
      {/* mockup between the description and the items (Figma: 80px gaps);
          the entrance animates this wrapper, so it never fights the img's own
          data-parallax transform. [data-tb-mockup]: unlike the text targets,
          the mockup emerges from the dark — fade + rise + brightness ramp */}
      <div data-tb-mockup className="mt-[80px]">
        <Img
          src={b.mockup}
          alt=""
          loading="lazy"
          decoding="async"
          data-parallax="0.04"
          className="max-w-none"
          style={{ width: BLOCK_W }}
        />
      </div>
      <div className="mt-[80px] flex flex-col gap-[24px]">
        {b.items.map((it) => (
          <div key={it.title} data-tb className="relative pl-[62px]">
            {/* icon 42x42; PNG has baked margins (see iconW) */}
            <div className="absolute left-0 top-0 size-[42px]">
              <Img
                src={it.icon}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute top-0 max-w-none"
                style={{ left: it.iconW === 62 ? -10 : 0, width: it.iconW }}
              />
            </div>
            <h4 className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
              {it.title}
            </h4>
            <p className="mt-[8px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
              {it.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------- glowing spine --- */

function Spine() {
  return (
    <div aria-hidden data-no-reveal>
      <svg
        className="pointer-events-none absolute left-0 top-0"
        width="1920"
        height={SPINE_BOTTOM + 10}
        viewBox={`0 0 1920 ${SPINE_BOTTOM + 10}`}
        fill="none"
      >
        {/* static track */}
        <path d={SPINE_PATH} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        {/* soft glow around the drawn fill. This used to be an SVG
            drop-shadow filter on the animated path — but a filter is
            re-rasterised over the path's ~1920×9800 region on EVERY
            strokeDashoffset change, i.e. every scroll frame (the main jank
            source in this section, pathological in Safari). Two wide
            low-alpha strokes drawn under the crisp line read the same and
            cost nothing. */}
        <path
          data-spine-glow
          d={SPINE_PATH}
          stroke="#9b79ce"
          strokeWidth="10"
          strokeOpacity="0.06"
          strokeLinecap="round"
          strokeDasharray={1000}
          strokeDashoffset={1000}
          pathLength={1000}
        />
        <path
          data-spine-glow
          d={SPINE_PATH}
          stroke="#9b79ce"
          strokeWidth="4"
          strokeOpacity="0.16"
          strokeLinecap="round"
          strokeDasharray={1000}
          strokeDashoffset={1000}
          pathLength={1000}
        />
        {/* scroll-drawn fill — one continuous stroke from the icon; the muted
            glow (user: line dimmer, only the tip sphere stays bright) */}
        <path
          data-spine-fill
          d={SPINE_PATH}
          stroke="url(#spine-grad)"
          strokeWidth="2"
          strokeDasharray={1000}
          strokeDashoffset={1000}
          pathLength={1000}
        />
        <defs>
          <linearGradient
            id="spine-grad"
            x1={CENTER_X}
            y1={ICON_Y}
            x2={CENTER_X}
            y2={SPINE_BOTTOM}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="var(--color-violet)" />
            <stop offset="1" stopColor="var(--color-violet-400)" />
          </linearGradient>
        </defs>
      </svg>
      {/* luminous tip riding the vertical fill's leading edge */}
      <div
        data-spine-tip
        className="absolute size-[10px] rounded-full"
        style={{
          left: CENTER_X - 5,
          top: CURVE_END_Y - 5,
          background: "var(--color-violet-100)",
          boxShadow: "0 0 10px 3px rgba(199,159,253,0.9), 0 0 34px 10px rgba(146,92,255,0.6)",
          opacity: 0,
        }}
      />
      {/* ignite nodes, one per block at title level */}
      {BLOCKS.map((b, i) => (
        <div
          key={b.key}
          data-tool-node={b.key}
          className="absolute size-[14px] rounded-full border border-white/15"
          style={{
            left: CENTER_X - 7,
            top: BLOCK0_Y + i * PITCH + NODE_OFFSET - 7,
            background: "var(--color-gray-900)",
          }}
        />
      ))}
    </div>
  )
}

export function Tools() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return
    const fill = section.querySelector<SVGPathElement>("[data-spine-fill]")
    const glows = [...section.querySelectorAll<SVGPathElement>("[data-spine-glow]")]
    const tip = section.querySelector<HTMLElement>("[data-spine-tip]")
    if (!fill || !tip) return
    const setDash = (v: string) => {
      fill.style.strokeDashoffset = v
      for (const g of glows) g.style.strokeDashoffset = v
    }

    const lit = (key: string, on: boolean) => {
      const node = section.querySelector<HTMLElement>(`[data-tool-node="${key}"]`)
      if (!node) return
      gsap.to(node, {
        backgroundColor: on ? "var(--color-violet-400)" : "var(--color-gray-900)",
        borderColor: on ? "rgba(201,179,236,0.9)" : "rgba(255,255,255,0.15)",
        boxShadow: on ? "0 0 18px 4px rgba(155,121,206,0.55)" : "0 0 0px 0px rgba(155,121,206,0)",
        scale: on ? 1.25 : 1,
        duration: 0.3,
        ease: "power3.out",
        overwrite: "auto",
      })
    }

    if (prefersReducedMotion()) {
      setDash("0")
      BLOCKS.forEach((b) => lit(b.key, true))
      return
    }

    const blocks = BLOCKS.map((b) => ({
      key: b.key,
      el: section.querySelector<HTMLElement>(`[data-tool-block="${b.key}"]`),
      lit: false,
    }))

    // blur-rise entrance for each block's text elements — the same motion as
    // the hero headline, cascading once per block as it enters the viewport.
    // The mockup gets its own emerge-from-the-dark reveal (fade + rise +
    // brightness ramp), timed to land inside the text cascade.
    const entranceTweens: gsap.core.Tween[] = []
    const entranceIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          entranceIo.unobserve(e.target)
          const targets = e.target.querySelectorAll<HTMLElement>("[data-tb]")
          entranceTweens.push(
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.7,
              ease: "expo.out",
              stagger: 0.12,
              overwrite: "auto",
            }),
          )
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    )
    // the mockup is observed SEPARATELY: the block IO above fires when the
    // block's title enters, at which point the mockup (~240px lower) is still
    // below the fold — animating it then would finish entirely off-screen.
    const mockupIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          mockupIo.unobserve(e.target)
          entranceTweens.push(
            gsap.to(e.target, {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "brightness(1)",
              duration: 1.05,
              ease: "expo.out",
              overwrite: "auto",
            }),
          )
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    blocks.forEach((blk) => {
      if (!blk.el) return
      gsap.set(blk.el.querySelectorAll<HTMLElement>("[data-tb]"), {
        opacity: 0,
        y: 22,
        filter: "blur(6px)",
      })
      const mockup = blk.el.querySelector<HTMLElement>("[data-tb-mockup]")
      if (mockup) {
        gsap.set(mockup, {
          opacity: 0,
          y: 56,
          scale: 0.965,
          transformOrigin: "50% 65%",
          filter: "brightness(0.25)",
        })
        mockupIo.observe(mockup)
      }
      entranceIo.observe(blk.el)
    })

    // per-frame scroll math from the live rect (scale/Lenis-immune). The
    // vertical front stays px-aligned with the 60%-viewport line; the curve
    // prefix (horizontal + arc) is drawn proportionally while the 60% line
    // travels from icon level down to the curve's landing point.
    const totalLen = fill.getTotalLength()
    const verticalLen = SPINE_BOTTOM - CURVE_END_Y
    const curveLen = totalLen - verticalLen
    let lastKey = NaN // skip all writes on frames where nothing scrolled
    const onTick = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const frameKey = rect.top + vh * 1e-7
      if (frameKey === lastKey) return
      lastKey = frameKey
      const scale = rect.width / 1920
      const y60 = (vh * 0.6 - rect.top) / scale // 60%-line in canvas px
      const s =
        y60 <= CURVE_END_Y
          ? curveLen * gsap.utils.clamp(0, 1, (y60 - ICON_Y) / (CURVE_END_Y - ICON_Y))
          : curveLen + Math.min(verticalLen, y60 - CURVE_END_Y)
      setDash(String(1000 * (1 - s / totalLen)))
      const vp = gsap.utils.clamp(0, 1, (y60 - CURVE_END_Y) / verticalLen)
      tip.style.transform = `translateY(${vp * verticalLen}px)`
      // the tip appears only once the front has passed the FIRST node —
      // before that the leading edge rides bare
      const frontY = CURVE_END_Y + vp * verticalLen
      tip.style.opacity =
        frontY > BLOCK0_Y + NODE_OFFSET && vp < 0.998 ? "1" : "0"
      for (const blk of blocks) {
        if (!blk.el) continue
        const on = blk.el.getBoundingClientRect().top < vh * 0.65
        if (on !== blk.lit) {
          blk.lit = on
          lit(blk.key, on)
        }
      }
    }

    // run the ticker only while the section is on screen
    let ticking = false
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1]
        if (e.isIntersecting && !ticking) {
          ticking = true
          gsap.ticker.add(onTick)
        } else if (!e.isIntersecting && ticking) {
          ticking = false
          gsap.ticker.remove(onTick)
        }
      },
      { rootMargin: "200px 0px 200px 0px" },
    )
    io.observe(section)
    return () => {
      io.disconnect()
      entranceIo.disconnect()
      mockupIo.disconnect()
      entranceTweens.forEach((t) => t.kill())
      if (ticking) gsap.ticker.remove(onTick)
    }
  }, [])

  return (
    <section
      id="features"
      ref={ref}
      className={`relative bg-gray-800 [content-visibility:auto]`}
      style={{ height: SECTION_H, containIntrinsicSize: `1920px ${SECTION_H}px` }}
    >
      {/* intro — left-aligned heading + subtitle, 220px from the top */}
      <h2 className="absolute left-[120px] top-[220px] w-[1680px] text-left text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        Book better loads faster — without missing opportunities with
        <br />
        game-changing tools for dispatchers
      </h2>
      <p className="absolute left-[120px] top-[360px] w-[1200px] text-left text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        LoadHunter finds high-RPM loads in real-time, filters the noise, and
        lets you contact brokers instantly — all in one place. Real-time load
        scanning, smart filters, and instant outreach — built for dispatchers
        who want results, not dashboards.
      </p>

      {/* gear icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4);
          the spine is born here */}
      <div data-float className="absolute left-[120px] top-[596px] size-[64px]">
        <Img
          src="/figma/tools/intro-icon.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <Spine />
      {BLOCKS.map((b, i) => (
        <ToolBlock key={b.key} b={b} index={i} />
      ))}
    </section>
  )
}
