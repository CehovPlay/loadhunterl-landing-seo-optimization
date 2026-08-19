"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { CTA, HERO } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { LoadCard } from "./LoadCard"
import { RailNode } from "./Rail"
import { ShaderBand } from "./ShaderBand"
import { PrimaryCta, SecondaryCta } from "./ui"

/**
 * First screen, full height.
 *
 * The band behind it is the landing's shader: a white-to-pearl drift with the
 * brand violet fenced to the top by a luminance mask, dissolving into the page
 * ground before the copy ends. It is the one place on this site where the
 * surface moves on its own, and it earns that by being the only screen with no
 * data on it - everything below is figures, statuses and routes, and those
 * need a still ground to be read against.
 *
 * Composition: the promise runs full width, then a hairline crosses the page
 * and everything below it hangs off that crossing. The rail comes down, the
 * hairline goes across, the load sits where they meet. That is the whole idea
 * of the page in one screen, and it is why the card is not a floating panel in
 * a right column.
 *
 * The entrance sets its from-state in an effect rather than in the markup. TZ
 * §43.1 and §46.3 require the indexable text and links to be readable without
 * animation, so a visitor with JavaScript off gets the finished hero rather
 * than an empty stage. Its job is hierarchy: it walks the eye down promise,
 * explanation, action once, on arrival, and never again.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return

    const ctx = gsap.context(() => {
      const copy = gsap.utils.toArray<HTMLElement>("[data-enter]")
      gsap.set(copy, { opacity: 0, y: 14 })
      gsap.to(copy, {
        opacity: 1,
        y: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: 0.07,
      })

      const seam = root.current!.querySelector("[data-enter-seam]")
      if (seam) {
        gsap.set(seam, { scaleX: 0, transformOrigin: "left center" })
        gsap.to(seam, { scaleX: 1, duration: 1.1, ease: "power3.inOut", delay: 0.25 })
      }

      const card = root.current!.querySelector("[data-enter-card]")
      if (card) {
        gsap.set(card, { opacity: 0, y: 20 })
        gsap.to(card, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.45 })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      className="relative flex min-h-[100dvh] flex-col justify-center pt-32 pb-16 md:pt-36 md:pb-24"
    >
      {/* The base colour sits a shade under the page ground so the band reads
          as its own surface, and the fade returns it to paper before the
          section ends: the seam into the cycle below has no edge to show. The
          fallback echoes the shader's own violet placement, so Safari and
          anything without WebGPU gets a composed band, not a bare grey one. */}
      <ShaderBand
        baseColor="#efefef"
        bottomFade="linear-gradient(to bottom, rgba(250,250,250,0) 42%, var(--color-paper) 80%)"
        fallback={
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 60% at 85% -5%, rgba(156,102,229,0.16) 0%, rgba(156,102,229,0) 60%)," +
                "radial-gradient(90% 50% at 0% 30%, rgba(111,81,151,0.10) 0%, rgba(111,81,151,0) 65%)",
            }}
          />
        }
      />

      <div className="relative pl-9 md:pl-20">
        <RailNode className="top-[15px]" />
        <p data-enter>
          {/* A translucent pill rather than plain text: the eyebrow sits
              highest in the band, where the violet drift is strongest, and it
              needs a ground of its own to stay legible. */}
          <span className="inline-flex w-fit items-center rounded-2xl bg-paper-2/60 px-4 py-1.5 text-small text-ink-2 backdrop-blur-[2px] sm:rounded-full">
            {HERO.eyebrow}
          </span>
        </p>

        <h1 data-enter className="display-hero mt-7 max-w-[24ch] text-balance md:mt-9">
          {HERO.h1}
        </h1>
      </div>

      {/* The crossing. The rail runs down the page, this runs across it, and the
          load below sits on the intersection. */}
      <div className="relative mt-10 md:mt-14">
        {/* On the band, #e8e8e8 disappears into the drift, so the crossing is
            drawn as a tint of ink instead of the flat rule token. */}
        <span
          data-enter-seam
          aria-hidden="true"
          className="absolute inset-x-0 top-0 block h-px origin-left bg-ink/10"
        />
        <RailNode className="-top-[4px]" />

        <div className="grid gap-y-10 pt-9 lg:grid-cols-12 lg:gap-x-10 lg:pt-11">
          <div className="pl-9 md:pl-20 lg:col-span-6">
            <p data-enter className="max-w-[50ch] text-body text-ink-2 md:text-lead">
              {HERO.sub}
            </p>

            <div data-enter className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <PrimaryCta href={CTA.install.href}>{CTA.install.label}</PrimaryCta>
              <SecondaryCta href={CTA.ecosystem.href}>{CTA.ecosystem.label}</SecondaryCta>
            </div>
          </div>

          <div className="pl-9 md:pl-20 lg:col-span-5 lg:col-start-8 lg:pl-0">
            <div data-enter-card className="lg:max-w-[400px]">
              <LoadCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
