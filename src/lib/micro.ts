import gsap from "gsap"

/**
 * Micro-animation layer, wired via data-attributes:
 *  - [data-float]          gentle levitation loop (section icons)
 *  - [data-pulse]          slow breathing scale loop (orbit centre)
 *  - [data-parallax="k"]   scroll parallax, k ≈ 0.03–0.1; applied as
 *                          yPercent so it composes with the reveal's y
 *  - [data-lift]           hover scale-up (cards, CTAs)
 *  - [data-magnetic]       primary CTAs pull toward the cursor (x/y, clamped)
 *  - [data-tilt="deg"]     3D tilt following the mouse across the enclosing
 *                          section (hero mockup); rotation channels only
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

  /* ---------------------------------------------------- float / pulse --- */
  document.querySelectorAll<HTMLElement>("[data-float]").forEach((el, i) => {
    floated.add(el)
    tweens.push(
      gsap.to(el, {
        y: -5,
        duration: 2.4 + (i % 3) * 0.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: (i % 5) * 0.35,
      }),
    )
  })

  document.querySelectorAll<HTMLElement>("[data-pulse]").forEach((el) => {
    touched.add(el)
    tweens.push(
      gsap.to(el, {
        scale: 1.04,
        duration: 2.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    )
  })

  /* --------------------------------------------------------- parallax --- */
  const parallax = [...document.querySelectorAll<HTMLElement>("[data-parallax]")].map(
    (el) => ({
      el,
      speed: parseFloat(el.dataset.parallax || "0.06"),
      set: gsap.quickSetter(el, "yPercent") as (v: number) => void,
      applied: 0,
    }),
  )
  parallax.forEach((p) => touched.add(p.el))

  const tick = () => {
    const vh = window.innerHeight
    for (const p of parallax) {
      const r = p.el.getBoundingClientRect()
      if (!r.height || r.bottom < -vh || r.top > vh * 2) continue
      // rect includes the offset we applied — recover the resting centre
      const center = r.top + r.height / 2 - (p.applied / 100) * r.height
      const px = (vh / 2 - center) * p.speed
      p.applied = (px / r.height) * 100
      p.set(p.applied)
    }
  }
  if (parallax.length) {
    gsap.ticker.add(tick)
    cleanups.push(() => gsap.ticker.remove(tick))
  }

  /* ------------------------------------------------------ hover lift --- */
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
  const magnetics = new Set<HTMLElement>()
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
    })
  })

  /* ------------------------------------------------------------- tilt --- */
  const tilted = new Set<HTMLElement>()
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    tilted.add(el)
    const strength = parseFloat(el.dataset.tilt || "4")
    const area = (el.closest("section") as HTMLElement) || el
    gsap.set(el, { transformPerspective: 1400 })
    const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power2.out" })
    const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power2.out" })
    const move = (e: MouseEvent) => {
      const r = area.getBoundingClientRect()
      const mx = (e.clientX - r.left) / r.width - 0.5
      const my = (e.clientY - r.top) / r.height - 0.5
      ryTo(mx * strength)
      rxTo(-my * strength * 0.75)
    }
    const leave = () => {
      ryTo(0)
      rxTo(0)
    }
    area.addEventListener("mousemove", move)
    area.addEventListener("mouseleave", leave)
    cleanups.push(() => {
      area.removeEventListener("mousemove", move)
      area.removeEventListener("mouseleave", leave)
    })
  })

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
    if (tilted.size) gsap.set([...tilted], { clearProps: "transform" })
  }
}
