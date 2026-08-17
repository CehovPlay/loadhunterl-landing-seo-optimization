import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Img } from "@/components/site/Img"
import { FEATURES_INTRO, TOOL_BLOCKS } from "@/content/copy"
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
 *   w=688; title → desc → 80px → mockup (w=688) → 80px → items. The vertical
 *   rhythm is content-driven — each block starts GAP px under the previous
 *   one's real height (Block.h), not on the old fixed 1461px pitch.
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
  /** LH-032 — where a signal comes from, shown as a chip next to the item. */
  source?: string
}

type Block = {
  key: string
  title: string
  desc: string
  items: Item[]
  mockup: string
  /**
   * Rendered height in canvas px. The blocks are absolutely positioned (fixed
   * canvas), so the vertical rhythm cannot come from flow — it is
   * `previous top + previous height + GAP`. Measured in the browser at
   * scale 1 (`getBoundingClientRect` on `[data-tool-block]`); heights are
   * stable before the mockups load because <Img> reserves their box from
   * img-dimensions.ts. RE-MEASURE after editing a block's copy or mockup.
   */
  h: number
}

/* ------------------------------------------------- geometry constants --- */
const CENTER_X = 960 // spine vertical, canvas centre
const ICON_Y = 628 // icon centre — the horizontal run's y
const ARC_R = 150 // corner radius of the horizontal→vertical turn
const CURVE_END_Y = ICON_Y + ARC_R // where the arc lands on the vertical
const SPINE_D = `M 206 ${ICON_Y} H ${CENTER_X - ARC_R} Q ${CENTER_X} ${ICON_Y} ${CENTER_X} ${CURVE_END_Y}`
const BLOCK0_Y = 820 // first block title top
/** Vertical step between blocks = previous block's height + GAP. NEGATIVE on
 *  purpose: consecutive blocks sit on OPPOSITE sides of the spine, so letting
 *  them overlap by 300px weaves the two columns together (same-side blocks —
 *  i.e. i and i+2 — still keep 195–390px of clear air). With the old
 *  1461px pitch every block was followed by 470–670px in which its own side —
 *  and the other one — were both empty, which read as a bare spine. */
const GAP = -300
const TAIL = 300 // air under the last block before the section ends
const NODE_OFFSET = 20 // node sits level with the block title
const BLOCK_W = 688 // matches the mock exports’ native width — text aligns to the mock edge
const RIGHT_X = 1020 // blocks right of the spine
const LEFT_X = 120 // blocks left of the spine

/** Rendered heights, measured in the browser at canvas scale 1 (see Block.h).
 *  RE-MEASURE with public/__measure.html after editing any block's copy. */
const BLOCK_H: Record<string, number> = {
  a: 816,
  b: 810,
  c: 931,
  d: 976,
  e: 841,
  f: 799,
  g: 763,
}

const BLOCKS: Block[] = TOOL_BLOCKS.map((b) => ({
  key: b.key,
  title: b.h3,
  desc: b.body,
  items: b.items.map((i) => ({ ...i })),
  mockup: `/figma/desk/tools-${b.key}.png`,
  h: BLOCK_H[b.key],
}))

/* Block tops: content-driven rhythm (see Block.h). The old fixed 1461px pitch
   was ~500–670px of dead air between the shorter blocks — the section read as
   an empty spine with text far apart. */
const TOPS = BLOCKS.reduce<number[]>((acc, _b, i) => {
  acc.push(i === 0 ? BLOCK0_Y : acc[i - 1] + BLOCKS[i - 1].h + GAP)
  return acc
}, [])
const LAST_TOP = TOPS[TOPS.length - 1]
const SPINE_BOTTOM = LAST_TOP + NODE_OFFSET // last node
const SECTION_H = LAST_TOP + BLOCKS[BLOCKS.length - 1].h + TAIL
const SPINE_PATH = `${SPINE_D} V ${SPINE_BOTTOM}`

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
      style={{ top: TOPS[index], left, width: BLOCK_W }}
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
            <h4 className="flex flex-wrap items-center gap-[8px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
              {it.title}
              {/* LH-032 — every signal names its source */}
              {it.source && (
                <span className="rounded-full border border-gray-650 px-[8px] py-px text-[11px] font-medium leading-[16px] tracking-normal text-[rgba(255,255,255,0.55)]">
                  Source: {it.source}
                </span>
              )}
            </h4>
            <p className="mt-[8px] text-[14px] font-medium leading-[18px] tracking-[-0.02em] text-ink-2">
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
            top: TOPS[i] + NODE_OFFSET - 7,
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
      {/* LH-026 / SEO-010 / COPYQA-008 */}
      <h2 className="absolute left-[120px] top-[220px] w-[1400px] text-left text-[44px] font-medium leading-[52px] tracking-[-0.03em] text-white">
        {FEATURES_INTRO.h2}
      </h2>
      {/* COPYQA-009 */}
      <p className="absolute left-[120px] top-[330px] w-[900px] text-left text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[rgba(255,255,255,0.65)]">
        {FEATURES_INTRO.lead}
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
