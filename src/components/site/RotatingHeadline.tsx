import { useEffect, useLayoutEffect, useRef, useState } from "react"
import gsap from "gsap"
import { prefersReducedMotion } from "@/lib/inview"

/**
 * Rotating hero headline + matching sub-headline.
 *
 * Cycle: the phrase's WORDS rise in one after another out of a light blur →
 * the sub-headline follows → the pair holds → both softly blur/lift out →
 * the next (random, non-repeating) pair enters. Reduced-motion visitors get
 * the first pair, static.
 *
 * Chromium gotcha: bg-clip-text on the H1 breaks the moment descendant spans
 * carry transforms (glyphs collapse to the line start), so each WORD clips
 * its own copy of the gradient, sized to the whole H1 box and offset to the
 * word's position — one continuous gradient visually, transform-safe.
 */

type Phrase = { lines: [string, string]; sub: string }

const PHRASES: Phrase[] = [
  { lines: ["Book better loads", "before anyone else"], sub: "In less than a minute" },
  { lines: ["Dispatch smarter", "not harder"], sub: "AI does the heavy lifting" },
  { lines: ["Only the loads", "that matter"], sub: "AI filters out the noise" },
  { lines: ["Email brokers", "in one click"], sub: "No more copy-paste" },
  { lines: ["Loads find you", "on Telegram"], sub: "Instant alerts, anywhere" },
  { lines: ["Know your profit", "before you call"], sub: "RPM+ does the math" },
]

const WORD_STAGGER = 0.14 // s between word starts
const WORD_DUR = 0.6 // s each word rises out of the blur
const SUB_DELAY = 0.3 // s sub-headline lag behind the last word's start
const SUB_OPACITY = 0.8
const HOLD = 3 // s a finished pair stays on screen
const EXIT = 0.4 // s blur/lift out

const H1_GRADIENT = "linear-gradient(100deg, rgb(26,26,26) 2%, rgb(120,120,120) 100%)"

const nextIndex = (current: number) =>
  (current + 1 + Math.floor(Math.random() * (PHRASES.length - 1))) % PHRASES.length

export function RotatingHeadline({
  h1ClassName = "-mx-[10px] -my-[12px] whitespace-nowrap px-[10px] py-[12px] text-hero font-medium leading-[80px] tracking-[-3.32px]",
  subClassName = "whitespace-nowrap text-[48px] font-medium leading-[80px] tracking-[-1.92px] text-ink",
}: {
  /** type-scale overrides so the mobile flow layout can reuse the cycle */
  h1ClassName?: string
  subClassName?: string
}) {
  const [index, setIndex] = useState(0)
  const [reduced] = useState(prefersReducedMotion)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const inViewRef = useRef(true)
  const phrase = PHRASES[index]

  // slice the shared gradient into per-word windows (see header comment)
  useLayoutEffect(() => {
    const h1 = h1Ref.current
    if (!h1) return
    const w = h1.clientWidth
    const h = h1.clientHeight
    h1.querySelectorAll<HTMLElement>("[data-w]").forEach((word) => {
      word.style.backgroundSize = `${w}px ${h}px`
      word.style.backgroundPosition = `-${word.offsetLeft}px -${word.offsetTop}px`
    })
  }, [index])

  // pause the cycle while the hero is off-screen (same idea as gateLoops)
  useEffect(() => {
    if (reduced || !h1Ref.current) return
    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[entries.length - 1].isIntersecting
        if (inViewRef.current) tlRef.current?.play()
        else tlRef.current?.pause()
      },
      { rootMargin: "100px 0px 100px 0px" },
    )
    io.observe(h1Ref.current)
    return () => io.disconnect()
  }, [reduced])

  useEffect(() => {
    if (reduced) return
    const h1 = h1Ref.current
    const sub = subRef.current
    if (!h1 || !sub) return

    const words = Array.from(h1.querySelectorAll<HTMLElement>("[data-w]"))
    const lastWordAt = (words.length - 1) * WORD_STAGGER

    const tl = gsap.timeline({
      paused: !inViewRef.current,
      onComplete: () => setIndex(nextIndex),
    })
    tl.set(h1, { opacity: 1, y: 0, filter: "none" })
    tl.set(words, { opacity: 0, y: 20, filter: "blur(6px)" })

    // words rise in one after another, each out of a light blur
    tl.to(
      words,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: WORD_DUR,
        ease: "expo.out",
        stagger: WORD_STAGGER,
      },
      0,
    )
    tl.fromTo(
      sub,
      { opacity: 0, y: 16, filter: "blur(4px)" },
      { opacity: SUB_OPACITY, y: 0, filter: "blur(0px)", duration: 0.6, ease: "expo.out" },
      lastWordAt + SUB_DELAY,
    )
    tl.to(
      [h1, sub],
      { opacity: 0, y: -14, filter: "blur(6px)", duration: EXIT, ease: "power2.in", stagger: 0.06 },
      lastWordAt + SUB_DELAY + 0.6 + HOLD,
    )

    tlRef.current = tl
    return () => {
      tlRef.current = null
      tl.kill()
    }
  }, [index, reduced])

  return (
    <>
      {/* H1 — gradient painted per word (see header comment) */}
      <h1
        ref={h1Ref}
        data-no-reveal
        aria-label={`${phrase.lines[0]} ${phrase.lines[1]}`}
        className={h1ClassName}
      >
        <span aria-hidden>
          {phrase.lines.map((line, li) => (
            <span key={`${index}-${li}`} className="block">
              {line.split(" ").map((word, wi) => (
                <span key={wi}>
                  {wi > 0 && " "}
                  {/* padding + negative margins widen each word's paint box so
                      bg-clip-text doesn't crop ascenders/descenders; the gradient
                      slicing uses measured offsets, so it stays aligned */}
                  <span
                    data-w
                    className="-mx-[8px] -my-[16px] inline-block bg-clip-text px-[8px] py-[16px] text-transparent"
                    style={{
                      backgroundImage: H1_GRADIENT,
                      ...(reduced ? undefined : { opacity: 0 }),
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </h1>

      {/* matching sub-headline — plain text, no pill, no gradient mask */}
      <div
        ref={subRef}
        data-no-reveal
        className="flex w-fit items-center justify-center"
        style={reduced ? { opacity: SUB_OPACITY } : { opacity: 0 }}
      >
        <span className={subClassName}>{phrase.sub}</span>
      </div>
    </>
  )
}
