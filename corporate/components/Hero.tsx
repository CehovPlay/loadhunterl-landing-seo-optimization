"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { CTA, HERO } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { LoadCard } from "./LoadCard"
import { RailNode } from "./Rail"
import { PrimaryCta, SecondaryCta } from "./ui"

/**
 * First screen.
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
    <section ref={root} className="relative pt-28 pb-20 md:pt-36 md:pb-32">
      <div className="relative pl-9 md:pl-20">
        <RailNode className="top-[7px]" />
        <p data-enter className="text-small text-ink-3">
          {HERO.eyebrow}
        </p>

        <h1 data-enter className="display mt-6 max-w-[30ch] text-balance md:mt-8">
          {HERO.h1}
        </h1>
      </div>

      {/* The crossing. The rail runs down the page, this runs across it, and the
          load below sits on the intersection. */}
      <div className="relative mt-12 md:mt-16">
        <span
          data-enter-seam
          aria-hidden="true"
          className="absolute inset-x-0 top-0 block h-px origin-left bg-rule"
        />
        <RailNode className="-top-[4px]" />

        <div className="grid gap-y-12 pt-10 lg:grid-cols-12 lg:gap-x-10 lg:pt-12">
          <div className="pl-9 md:pl-20 lg:col-span-6">
            <p data-enter className="max-w-[50ch] text-body text-ink-2 md:text-lead">
              {HERO.sub}
            </p>

            <div data-enter className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
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
