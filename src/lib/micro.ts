import gsap from "gsap"

/**
 * Micro-animation layer, wired via data-attributes:
 *  - [data-float]          gentle levitation loop (section icons)
 *  - [data-pulse]          slow breathing scale loop (orbit centre)
 *  - [data-parallax="k"]   scroll parallax, k ≈ 0.03–0.1; applied as
 *                          yPercent so it composes with the reveal's y
 *  - [data-lift]           hover scale-up (cards, CTAs)
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
  }
}
