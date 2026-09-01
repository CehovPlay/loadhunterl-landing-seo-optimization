"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

/**
 * The road: one isometric scene, pinned, with the five stops tied to scroll.
 *
 * Two owner decisions built this, on 2026-08-20 and in this order. The first
 * replaced a stack of five sections with a drawn route, because §27 asks the
 * page to show the load's path from booking to payment rather than describe it.
 * The second replaced a scene that sat behind scrolling content with a scene
 * that is held still while the scroll moves through it - copy riding over a
 * drawing reads as two pages printed on top of each other.
 *
 * So the section is a runway N screens tall with one sticky screen inside it.
 * The scroll position through the runway is a single number: the scene reads it
 * to move the camera and the load, and the stop index is derived from the same
 * number, so the copy and the drawing cannot fall out of step.
 *
 * PROGRESSIVE ENHANCEMENT is why this is a component rather than a `sticky`
 * class in the page. The server renders the five stops in normal flow, one
 * after another, with no runway and no pinning. A visitor with no WebGL,
 * reduced motion, or no JavaScript reads the page as a document - §10.4 wants
 * the main text available without animation or client JS, and §17.3 forbids a
 * key scenario that needs a capable GPU. The pinned layout is switched on by
 * `data-scene="on"`, set only after three.js has loaded and drawn a frame.
 *
 * three.js is imported inside the effect, so it lands in its own chunk and is
 * fetched only when the section is actually on screen - §14.1's rule for heavy
 * interactive demonstrations. A visitor who bounces off the hero never
 * downloads it.
 */

const STOPS = 5

export function FreightRoute({
  anchors,
  children,
}: {
  /** One id per stop, in order. See the note on markers below. */
  anchors: string[]
  children: (active: number) => ReactNode
}) {
  const runway = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [on, setOn] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = runway.current
    const cv = canvas.current
    if (!el || !cv) return

    let cancelled = false
    let cleanup: (() => void) | undefined
    let measure: (() => void) | undefined

    /* No lookahead margin. The road begins directly under the hero, so any at
       all means three.js is fetched during the first load - the cost this lazy
       import exists to avoid. */
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        void start()
      },
      { rootMargin: "0px" },
    )
    io.observe(el)

    async function start() {
      const scene = await import("./freight-scene")
      if (cancelled || !scene.canRender()) return

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const handle = scene.createScene(cv!)
      setOn(true)

      const trigger = ScrollTrigger.create({
        trigger: el!,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          handle.setProgress(self.progress)
          /* The stop the reader has reached. The half-step bias means a stop
             takes the screen as the load arrives rather than after it leaves. */
          const i = Math.round(self.progress * (STOPS - 1))
          setActive(Math.min(STOPS - 1, Math.max(0, i)))
          /* The active stop changed height the moment the class did, and the
             scene has to reframe for it in the same frame or the station jumps
             a beat behind the copy. */
          measure?.()
        },
        /* The idle clock runs only while the road is on screen. A scene that
           never stops animating is a scene that costs battery on every page it
           is not being looked at. */
        onToggle: (self) => (self.isActive ? handle.play() : handle.pause()),
      })

      const onHidden = () => (document.hidden ? handle.pause() : trigger.isActive && handle.play())
      document.addEventListener("visibilitychange", onHidden)

      /* `setOn` is what makes the canvas visible, and a hidden canvas measures
         0x0, so the renderer would keep its 300x150 default buffer. A
         requestAnimationFrame is not enough - it can fire before React has
         committed - so the sizing is driven by the box itself. */
      const ro = new ResizeObserver(() => handle.resize())
      ro.observe(cv!)

      /* Tell the scene how much of the frame the copy has taken, so it can
         centre the station in what is left. The stops are not the same height -
         the load board with its layer open is twice the driver stop - so a
         fixed split would bury the station under one and strand it under the
         other. Measured from the active stop's own content, on every change. */
      const band = () => {
        const stop = el!.querySelector<HTMLElement>('[data-stop="active"]')
        const frame = cv!.getBoundingClientRect()
        if (!stop || !frame.height) return

        const cols = [...stop.querySelectorAll<HTMLElement>(":scope > div > div")]
        const proof = cols[cols.length - 1]

        /* The scene never gets less than this much of the frame. Without a
           floor the tallest stop - the load board with its layer open - takes
           the whole screen and the scene is not there at all, which is the
           thing this layout exists to avoid. */
        const SCENE_FLOOR = 0.28
        const top = (cols[0]?.getBoundingClientRect().top ?? frame.top) - frame.top
        const room = frame.height * (1 - SCENE_FLOOR) - top

        /* Scale the proof to the room it has, and no further than 0.78: below
           that the figures in it stop being readable, and a proof nobody can
           read is worse than no proof - §3.6 will not have a claim shown in a
           form the reader cannot check. */
        if (proof) {
          proof.style.setProperty("--proof-scale", "1")
          const natural = proof.getBoundingClientRect().height
          const fit = natural > room ? Math.max(0.78, room / natural) : 1
          proof.style.setProperty("--proof-scale", String(Math.round(fit * 100) / 100))
        }

        let bottom = 0
        for (const col of cols) {
          bottom = Math.max(bottom, col.getBoundingClientRect().bottom - frame.top)
        }
        handle.setBand(Math.min(1 - SCENE_FLOOR, bottom / frame.height))
      }
      band()
      /* Observe the stops' own content, not the runway.

         The runway's height is fixed, so observing it fires once - and once is
         too early: the load-board proof plays itself 900ms after it becomes
         visible, growing from 450px to 825px, and the measurement taken before
         that says everything fits. Watching each stop's grid catches the growth
         whenever it happens, including a font swap or a wrapped line. */
      const bandRo = new ResizeObserver(band)
      /* The COLUMNS, not the grid. The grid is `h-full` inside a stop pinned
         with `inset: 0`, so its height never changes however much its content
         grows - observing it fires exactly once, before the proof has played. */
      for (const col of el!.querySelectorAll(".road-stop > div > div")) bandRo.observe(col)
      measure = band

      /* Belt and braces for the proof that animates itself open on a timer: an
         observer only fires if the box actually changes, and a panel that
         reveals with a max-height transition can settle without one. */
      const settle = [400, 1200, 2400].map((ms) => window.setTimeout(band, ms))

      requestAnimationFrame(() => ScrollTrigger.refresh())

      cleanup = () => {
        document.removeEventListener("visibilitychange", onHidden)
        ro.disconnect()
        bandRo.disconnect()
        settle.forEach(window.clearTimeout)
        trigger.kill()
        handle.dispose()
      }
    }

    return () => {
      cancelled = true
      io.disconnect()
      cleanup?.()
    }
  }, [])

  return (
    <div ref={runway} data-scene={on ? "on" : "off"} className="road relative">
      {/* Anchor markers.

          A stop's id cannot live on the stop itself: pinned, every stop is
          absolutely positioned inside one sticky frame, so jumping to
          #close-the-load lands on the frame rather than on that stop, and the
          product cards in the entry-point block link exactly there.

          A marker at i/(n-1) of the runway is right in both states. Pinned, the
          runway IS the scroll range, so that fraction is the scroll position
          where the stop is active. Unpinned, the runway is the stack of stops,
          so the same fraction is roughly where that stop sits. One rule, two
          layouts, no script. */}
      {anchors.map((id, i) => (
        <span
          key={id}
          id={id}
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `${(i / Math.max(1, anchors.length - 1)) * 100}%` }}
        />
      ))}

      <div className="road-frame">
        <canvas
          ref={canvas}
          aria-hidden
          className="freight-canvas pointer-events-none absolute inset-0 hidden size-full"
          data-scene={on ? "on" : "off"}
        />
        <div className="road-stops relative">{children(active)}</div>
      </div>
    </div>
  )
}
