import { lazy, Suspense, useLayoutEffect } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { initReveal } from "@/lib/reveal"
import { initMicro } from "@/lib/micro"
import { initEcosystemPin } from "@/lib/ecosystemPin"
import { DesignFrame } from "@/components/site/DesignFrame"
import { useFlowLayout } from "@/components/site/useFlowLayout"
import { isCoarsePointer, prefersReducedMotion } from "@/lib/inview"

// Code-split the two experiences: a phone visitor never downloads the desktop
// tree (with its WebGPU shader engine), and vice versa.
const DesktopLanding = lazy(() =>
  import("@/sections/DesktopLanding").then((m) => ({ default: m.DesktopLanding })),
)
const MobileLanding = lazy(() =>
  import("@/sections/mobile/MobileLanding").then((m) => ({ default: m.MobileLanding })),
)

/**
 * Smooth scroll + anchor navigation.
 *
 * Lenis is created only for a fine-pointer (mouse) visitor with motion enabled.
 * On touch it fights native momentum and adds a permanent rAF loop for no gain,
 * and under prefers-reduced-motion we want plain native scrolling — in both
 * cases we skip Lenis entirely and route anchor clicks through native
 * scrollIntoView. lagSmoothing is relaxed (was 0) so a single heavy frame is
 * caught up smoothly instead of teleporting (the "freeze-then-jump" symptom).
 */
function useLenis(mobile: boolean) {
  useLayoutEffect(() => {
    const nativeOnly = isCoarsePointer() || prefersReducedMotion()

    // Deep links (/#pricing etc.): the browser's initial jump to the anchor
    // happens while the preloader holds `html.lh-pl-lock { overflow:hidden }`,
    // so it lands nowhere and the visitor is left at the top. Re-apply the
    // hash the moment the preloader unlocks (or now, if it's already gone).
    const jumpToHash = () => {
      const hash = window.location.hash
      const el = hash.length > 1 ? document.querySelector(hash) : null
      if (el) (el as HTMLElement).scrollIntoView({ behavior: "instant", block: "start" })
    }

    let lenis: Lenis | null = null
    let update: ((time: number) => void) | null = null
    let onPreloaderDone: (() => void) | null = null
    if (!nativeOnly) {
      lenis = new Lenis()
      update = (time: number) => lenis!.raf(time * 1000)
      gsap.ticker.add(update)
      gsap.ticker.lagSmoothing(500, 33)
      // While the index.html preloader locks scrolling (html.lh-pl-lock),
      // Lenis would still accumulate wheel deltas against the frozen page and
      // fire them as one big jump on unlock — keep it stopped until the
      // preloader dispatches lh:preloader-done at the moment it unlocks.
      if (document.documentElement.classList.contains("lh-pl-lock")) {
        lenis.stop()
        onPreloaderDone = () => {
          lenis?.start()
          jumpToHash()
        }
        window.addEventListener("lh:preloader-done", onPreloaderDone, { once: true })
      }
    } else if (document.documentElement.classList.contains("lh-pl-lock")) {
      onPreloaderDone = jumpToHash
      window.addEventListener("lh:preloader-done", onPreloaderDone, { once: true })
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute("href")!
      if (hash.length < 2) return
      const el = document.querySelector(hash)
      if (!el) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(el as HTMLElement)
      else (el as HTMLElement).scrollIntoView({ behavior: "smooth" })
    }
    document.addEventListener("click", onClick)

    return () => {
      document.removeEventListener("click", onClick)
      if (onPreloaderDone) window.removeEventListener("lh:preloader-done", onPreloaderDone)
      if (update) gsap.ticker.remove(update)
      if (lenis) lenis.destroy()
    }
  }, [mobile])
}

/**
 * Warm the heaviest below-the-fold rasters while the preloader still owns the
 * screen (and on first idle after it). Their lazy <Img>s otherwise start
 * fetching + AVIF-decoding right as they approach the viewport — which landed
 * exactly under the ChaosZoom dive and read as a scroll freeze. Fetch + decode
 * off the critical path instead; the browser keeps them in its caches.
 * AVIF is what <Img> picks in every current browser; a non-AVIF browser just
 * re-fetches its fallback lazily as before.
 */
function useImageWarmup(mobile: boolean) {
  useLayoutEffect(() => {
    const base = mobile ? "/figma/mobile" : "/figma/desk"
    const urls = [
      `${base}/tools-a.avif`,
      `${base}/tools-b.avif`,
      `${base}/tools-c.avif`,
      `${base}/tools-d.avif`,
      `${base}/tools-e.avif`,
      `${base}/tools-f.avif`,
      `${base}/tools-g.avif`,
      `${base}/eco-loadhunter.avif`,
      `${base}/eco-tms.avif`,
    ]
    let cancelled = false
    const warm = () => {
      if (cancelled) return
      for (const src of urls) {
        const img = new Image()
        img.decoding = "async"
        img.src = src
        img.decode?.().catch(() => {})
      }
    }
    // wait for the window load (critical assets done), then first idle
    const idle = () => {
      if ("requestIdleCallback" in window) requestIdleCallback(warm, { timeout: 4000 })
      else setTimeout(warm, 1200)
    }
    if (document.readyState === "complete") idle()
    else window.addEventListener("load", idle, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener("load", idle)
    }
  }, [mobile])
}

/**
 * Runs the scroll-reveal cascade + micro-animation layer + ecosystem pin.
 * Rendered as the last child INSIDE the Suspense boundary so its layout effect
 * fires only after the lazy landing tree has committed to the DOM (React runs
 * sibling layout effects in order, and the boundary keeps this unmounted until
 * the chunk resolves) — initReveal must hide elements before first paint, so
 * the DOM must exist first. initEcosystemPin no-ops when the desktop ecosystem
 * DOM is absent (mobile).
 */
function CanvasEffects({ mobile }: { mobile: boolean }) {
  useLayoutEffect(() => {
    const teardownReveal = initReveal()
    const teardownMicro = initMicro()
    const teardownEcoPin = initEcosystemPin()
    // release the index.html preloader after the first REAL paint of the
    // landing tree (double rAF = the frame after this commit is on screen);
    // the preloader itself enforces its minimum display time
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => window.__lhPreloaderDone?.()),
    )
    return () => {
      cancelAnimationFrame(raf)
      teardownEcoPin()
      teardownMicro()
      teardownReveal()
    }
  }, [mobile])
  return null
}

declare global {
  interface Window {
    /** defined inline in index.html; completes and removes the preloader */
    __lhPreloaderDone?: () => void
  }
}

/**
 * Two experiences:
 *  - < 1280px — the flow landing (src/sections/mobile/*): a real responsive
 *    layout (fluid widths, stacked sections, 44px+ touch targets). Mobile-first;
 *    `md:` (≥768) adds the tablet refinements. No DesignFrame, no scaling.
 *  - ≥ 1280px — the 1920 desktop canvas: below 1920 it scales down (vw/1920),
 *    at/above 1920 maxScale={1} holds it at pixel size and centers it. So
 *    1280–1920 is the desktop design adapted by uniform scale.
 */
function App() {
  const mobile = useFlowLayout()
  useLenis(mobile)
  useImageWarmup(mobile)

  if (mobile) {
    return (
      <Suspense fallback={null}>
        <MobileLanding />
        <CanvasEffects mobile={mobile} />
      </Suspense>
    )
  }

  return (
    <DesignFrame width={1920} maxScale={1}>
      <Suspense fallback={null}>
        <DesktopLanding />
        <CanvasEffects mobile={mobile} />
      </Suspense>
    </DesignFrame>
  )
}

export default App
