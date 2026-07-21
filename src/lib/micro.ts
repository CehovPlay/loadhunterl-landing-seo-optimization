import gsap from "gsap"
import { gateEach, isFinePointer } from "@/lib/inview"

/**
 * Micro-animation layer, wired via data-attributes:
 *  - [data-float]          gentle levitation loop (section icons)
 *  - [data-pulse]          slow breathing scale loop (orbit centre)
 *  - [data-spin]           continuous loader rotation (pricing coming-soon)
 *  - [data-parallax="k"]   scroll parallax, k ≈ 0.03–0.1; applied as
 *                          yPercent so it composes with the reveal's y
 *  - [data-lift]           hover scale-up (cards, CTAs)
 *  - [data-magnetic]       primary CTAs pull toward the cursor (x/y, clamped)
 *  - [data-countup]        first number in the text counts up on first view
 *  - every <button>        press feedback (scale down while pressed)
 *
 * All effects are transform/text-only — the pixel-perfect layout at rest is
 * untouched. Scale/yPercent are separate gsap transform channels from the
 * reveal cascade's y/autoAlpha, so the two systems never fight.
 */
export function initMicro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {}
  }

  const tweens: gsap.core.Tween[] = []
  const cleanups: (() => void)[] = []
  const touched = new Set<HTMLElement>()
  const floated = new Set<HTMLElement>() // own their y (never reveal targets)
  // (element → its infinite loop) pairs, gated to pause while off-screen
  const gateEntries: { el: Element; anims: gsap.core.Tween }[] = []

  /* ---------------------------------------------------- float / pulse --- */
  document.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
    floated.add(el)
    const t = gsap.to(el, {
      y: -5,
      duration: 2.4 + (i % 3) * 0.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: (i % 5) * 0.35,
    })
    tweens.push(t)
    gateEntries.push({ el, anims: t })
  })

  document.querySelectorAll<HTMLElement>("[data-pulse]").forEach((el) => {
    touched.add(el)
    const t = gsap.to(el, {
      scale: 1.04,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })
    tweens.push(t)
    gateEntries.push({ el, anims: t })
  })

  // continuous loader rotation (pricing coming-soon)
  document.querySelectorAll<HTMLElement>("[data-spin]").forEach((el) => {
    touched.add(el)
    const t = gsap.to(el, { rotation: "+=360", duration: 1.6, ease: "none", repeat: -1 })
    tweens.push(t)
    gateEntries.push({ el, anims: t })
  })

  // one shared observer pauses every float/pulse loop whose icon is off-screen
  if (gateEntries.length) cleanups.push(gateEach(gateEntries))

  /* --------------------------------------------------------- parallax --- */
  // The tick runs on gsap's scroll-synced ticker. The old version called
  // getBoundingClientRect() for every element EVERY frame — after Lenis had
  // just written the scroll transform — forcing a synchronous reflow of the
  // whole ~19kpx tree on each scroll frame (the dominant scroll-jank source).
  // We now cache each element's resting document-space geometry (scaled px) and
  // re-measure only on resize/load, so the per-frame tick is pure arithmetic on
  // window.scrollY with zero layout reads.
  const parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map(
    (el) => ({
      el,
      speed: parseFloat(el.dataset.parallax || "0.06"),
      set: gsap.quickSetter(el, "yPercent") as (v: number) => void,
      applied: 0,
      baseTop: 0, // resting top in document space (scaled px)
      h: 0, // rendered height (scaled px)
    }),
  )
  parallax.forEach((p) => touched.add(p.el))

  const measure = () => {
    const sy = window.scrollY
    for (const p of parallax) {
      const r = p.el.getBoundingClientRect()
      p.h = r.height
      // r.top includes both our yPercent and any reveal y still on the element;
      // undo our own applied offset to recover the resting document position.
      p.baseTop = r.top + sy - (p.applied / 100) * r.height
    }
  }

  const tick = () => {
    const vh = window.innerHeight
    const sy = window.scrollY
    for (const p of parallax) {
      if (!p.h) continue
      const center = p.baseTop + p.h / 2 - sy
      if (center < -vh || center > vh * 2) continue // off-screen: skip
      const px = (vh / 2 - center) * p.speed
      p.applied = (px / p.h) * 100
      p.set(p.applied)
    }
  }

  if (parallax.length) {
    measure()
    gsap.ticker.add(tick)
    // re-measure after the reveal cascade settles / images load, and on resize,
    // so cached resting positions stay correct (transform-independent baseline).
    const onLoad = () => measure()
    window.addEventListener("resize", measure)
    window.addEventListener("load", onLoad)
    cleanups.push(() => {
      gsap.ticker.remove(tick)
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", onLoad)
    })
  }

  const magnetics = new Set<HTMLElement>()

  /* --- hover-only effects (lift / magnetic / tilt): fine pointer only ---
   * On touch none of these can fire, and on hybrids emitting synthetic mouse
   * events the tilt/magnetic handlers would run getBoundingClientRect over the
   * scaled canvas per pointer move. Register them only for a real mouse. */
  if (isFinePointer()) {
  document.querySelectorAll<HTMLElement>("[data-lift]").forEach((el) => {
    touched.add(el)
    const over = () =>
      gsap.to(el, { scale: 1.02, duration: 0.35, ease: "power2.out", overwrite: "auto" })
    const out = () =>
      gsap.to(el, { scale: 1, duration: 0.55, ease: "power2.out", overwrite: "auto" })
    el.addEventListener("mouseenter", over)
    el.addEventListener("mouseleave", out)
    cleanups.push(() => {
      el.removeEventListener("mouseenter", over)
      el.removeEventListener("mouseleave", out)
    })
  })

  /* --------------------------------------------------------- magnetic --- */
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    magnetics.add(el)
    const k = parseFloat(el.dataset.magnetic || "") || 0.3 // pull factor
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" })
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      // rects are in viewport px, gsap x/y in layout px — undo the canvas scale
      const s = el.offsetWidth ? r.width / el.offsetWidth : 1
      const dx = (e.clientX - (r.left + r.width / 2)) / s
      const dy = (e.clientY - (r.top + r.height / 2)) / s
      xTo(gsap.utils.clamp(-14, 14, dx * k))
      yTo(gsap.utils.clamp(-10, 10, dy * k * 1.33))
    }
    const leave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.45)",
        overwrite: "auto",
      })
    }
    el.addEventListener("mousemove", move)
    el.addEventListener("mouseleave", leave)
    cleanups.push(() => {
      el.removeEventListener("mousemove", move)
      el.removeEventListener("mouseleave", leave)
      // quickTo tweens outlive the listeners — kill them and zero the offsets,
      // else the teardown clearProps pass spams "x/y not eligible for reset"
      // warnings on every HMR re-init
      xTo.tween?.kill()
      yTo.tween?.kill()
      gsap.set(el, { x: 0, y: 0 })
    })
  })

  } // end fine-pointer hover effects

  /* --------------------------------------------------- press feedback --- */
  document.querySelectorAll<HTMLElement>("button").forEach((el) => {
    touched.add(el)
    const down = () =>
      gsap.to(el, { scale: 0.96, duration: 0.12, ease: "power2.out", overwrite: "auto" })
    const up = () =>
      gsap.to(el, {
        scale: el.matches("[data-lift]:hover") ? 1.02 : 1,
        duration: 0.45,
        ease: "back.out(2.5)",
        overwrite: "auto",
      })
    el.addEventListener("pointerdown", down)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointerleave", up)
    cleanups.push(() => {
      el.removeEventListener("pointerdown", down)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointerleave", up)
    })
  })

  /* ---------------------------------------------------------- countup --- */
  const counters: { el: HTMLElement; run: () => void }[] = []
  document.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
    const text = el.textContent || ""
    const m = text.match(/\d[\d,]*(\.\d+)?/)
    if (!m || m.index === undefined) return
    const raw = m[0]
    const target = parseFloat(raw.replace(/,/g, ""))
    const decimals = raw.includes(".") ? raw.split(".")[1].length : 0
    const grouped = raw.includes(",")
    const prefix = text.slice(0, m.index)
    const suffix = text.slice(m.index + raw.length)
    const fmt = (v: number) => {
      const s = grouped
        ? Math.round(v).toLocaleString("en-US")
        : v.toFixed(decimals)
      return prefix + s + suffix
    }
    counters.push({
      el,
      run: () => {
        const obj = { v: 0 }
        tweens.push(
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = fmt(obj.v)
            },
          }),
        )
      },
    })
  })
  if (counters.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          counters.find((c) => c.el === e.target)?.run()
        })
      },
      { threshold: 0.4 },
    )
    counters.forEach((c) => io.observe(c.el))
    cleanups.push(() => io.disconnect())
  }

  return () => {
    tweens.forEach((t) => t.kill())
    cleanups.forEach((fn) => fn())
    // clear ONLY the channels this layer writes — reveal owns y/autoAlpha
    // (floated wrappers are never reveal targets, so their y is ours too)
    if (touched.size) gsap.set([...touched], { clearProps: "scale,yPercent" })
    if (floated.size) gsap.set([...floated], { clearProps: "transform" })
    if (magnetics.size) gsap.set([...magnetics], { clearProps: "x,y" })
  }
}
