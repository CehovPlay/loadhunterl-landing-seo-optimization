"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { CTA, HERO, OS_TRAIL, PRODUCTS, SAMPLE_LOAD, SAMPLE_NOTE } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { track } from "@/lib/analytics"
import { RailNode } from "./Rail"
import { ShaderBand } from "./ShaderBand"
import { PrimaryCta, SampleTag, SecondaryCta, Status } from "./ui"

/**
 * First screen, full height.
 *
 * Everything the tab requires in the first viewport is here and in its order:
 * product/category label, H1, supporting copy, the two CTAs, the microcopy, and
 * a status/access cue - which is a link, because "see current availability"
 * should be something the visitor can actually do from here. Nothing on this
 * screen is a stock truck, an autoplaying video or an unverified number, all
 * three of which the tab bans by name.
 *
 * The proof sits right of the copy on desktop and immediately after the CTAs on
 * mobile, again per the tab. It is the sample load passport from §27.6 - the
 * same load every scene below inherits - and it is interactive: the strip under
 * it follows that one load through the five products, which is the page's whole
 * argument stated once, in the first screen, with real data.
 *
 * The band behind it is the landing's shader: a white-to-pearl drift with the
 * brand violet fenced to the top by a luminance mask, dissolving into the page
 * ground before the copy ends. It is the one place on this site where the
 * surface moves on its own, and it earns that by being the only screen with no
 * figures on it.
 *
 * The entrance sets its from-state in an effect rather than in the markup: the
 * acceptance criteria require the full meaning and an available CTA without
 * animation, so a visitor with JavaScript off gets the finished hero rather
 * than an empty stage.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return

    const ctx = gsap.context(() => {
      const copy = gsap.utils.toArray<HTMLElement>("[data-enter]")
      gsap.set(copy, { opacity: 0, y: 14 })
      gsap.to(copy, { opacity: 1, y: 0, duration: 0.62, ease: "power3.out", stagger: 0.07 })

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

  const product = PRODUCTS[stage]
  const handoff = OS_TRAIL[stage]

  return (
    <section
      ref={root}
      className="relative flex min-h-[100dvh] flex-col justify-center pt-32 pb-16 md:pt-36 md:pb-24"
    >
      {/* The base colour sits a shade under the page ground so the band reads
          as its own surface, and the fade returns it to paper before the
          section ends: the seam into the next block has no edge to show. The
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
          {/* A translucent pill rather than plain text: the label sits highest
              in the band, where the violet drift is strongest, and it needs a
              ground of its own to stay legible. */}
          <span className="inline-flex w-fit items-center rounded-2xl bg-paper-2/60 px-4 py-1.5 text-small text-ink-2 backdrop-blur-[2px] sm:rounded-full">
            {HERO.label}
          </span>
        </p>

        <h1 data-enter className="display-hero mt-7 max-w-[16ch] text-balance md:mt-9">
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
              <PrimaryCta
                href={CTA.primary.href}
                onClick={() =>
                  track("hero_primary_click", {
                    product: "loadhunter",
                    CTA_label: CTA.primary.label,
                    CTA_position: "hero",
                    product_status: "Live",
                  })
                }
              >
                {CTA.primary.label}
              </PrimaryCta>
              <SecondaryCta
                href={CTA.secondary.href}
                onClick={() =>
                  track("stack_builder_start", {
                    CTA_label: CTA.secondary.label,
                    CTA_position: "hero",
                  })
                }
              >
                {CTA.secondary.label}
              </SecondaryCta>
            </div>

            {/* Microcopy and access cue in one: the sentence promises the
                visitor can check availability first, so it goes where they can. */}
            <p data-enter className="mt-6">
              <Link
                href={CTA.status.href}
                onClick={() => track("status_open", { CTA_position: "hero" })}
                className="inline-flex min-h-11 items-center gap-2 text-small text-ink-3 underline decoration-rule underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-violet"
              >
                {HERO.microcopy}
              </Link>
            </p>
          </div>

          <div className="pl-9 md:pl-20 lg:col-span-5 lg:col-start-8 lg:pl-0">
            <div data-enter-card className="lg:max-w-[420px]">
              <article className="rounded-surface border border-rule bg-paper-2 shadow-[0_1px_0_0_rgba(18,19,23,0.03),0_18px_40px_-28px_rgba(18,19,23,0.25)]">
                <header className="flex items-center justify-between gap-3 px-6 pt-5 pb-4">
                  <SampleTag>{SAMPLE_NOTE}</SampleTag>
                  <span className="figures text-meta text-ink-3">{SAMPLE_LOAD.id}</span>
                </header>

                {/* The lane, drawn the same way as the page rail so the card
                    reads as a fragment of the same map, not a separate widget. */}
                <div className="px-6">
                  <div className="relative pl-6">
                    <span aria-hidden="true" className="absolute top-[9px] bottom-[9px] left-[3px] w-px bg-rule" />
                    <span aria-hidden="true" className="absolute top-[6px] left-0 size-[7px] rounded-full border border-ink-3 bg-paper-2" />
                    <span aria-hidden="true" className="absolute bottom-[6px] left-0 size-[7px] rounded-full bg-ink" />
                    <p className="text-h3 leading-8 text-ink">{SAMPLE_LOAD.origin}</p>
                    <p className="text-h3 leading-8 text-ink">{SAMPLE_LOAD.destination}</p>
                  </div>

                  <p className="mt-4 text-small text-ink-3">
                    {SAMPLE_LOAD.equipment} · {SAMPLE_LOAD.weight} · picks up {SAMPLE_LOAD.pickup}
                  </p>
                </div>

                <dl className="mt-5 grid grid-cols-2 border-t border-rule">
                  <div className="border-r border-rule px-6 py-4">
                    <dt className="text-meta text-ink-3">Line haul</dt>
                    <dd className="figures mt-1 text-h3 text-ink">{SAMPLE_LOAD.rate}</dd>
                  </div>
                  <div className="px-6 py-4">
                    <dt className="text-meta text-ink-3">Loaded miles</dt>
                    <dd className="figures mt-1 text-h3 text-ink">{SAMPLE_LOAD.loadedMiles}</dd>
                  </div>
                </dl>

                {/* Follow this one load through the five products. The strip is
                    the ecosystem claim, made with the page's own data instead
                    of an adjective. */}
                <div className="border-t border-rule px-6 pt-4 pb-5">
                  <p id="hero-follow" className="text-meta text-ink-3">
                    Follow this load
                  </p>

                  <div
                    role="group"
                    aria-labelledby="hero-follow"
                    className="mt-3 flex flex-wrap gap-1"
                  >
                    {PRODUCTS.map((item, index) => (
                      <button
                        key={item.key}
                        type="button"
                        aria-pressed={index === stage}
                        onClick={() => {
                          setStage(index)
                          track("product_proof_open", {
                            product: item.key,
                            proof_type: "hero_stage",
                            CTA_position: "hero",
                          })
                        }}
                        className={
                          "min-h-8 rounded-full px-2.5 text-meta transition duration-200 ease-out-quart " +
                          (index === stage
                            ? "bg-violet text-white"
                            : "bg-paper-3 text-ink-3 hover:text-ink")
                        }
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>

                  <div aria-live="polite" className="mt-4">
                    <p className="text-small text-ink">
                      {handoff.event}
                      <span className="text-ink-3"> · reaches {handoff.reaches}</span>
                    </p>
                    <p className="mt-1 text-meta text-ink-3">{handoff.carries}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <Status term={product.statuses[0].term} scope={product.statuses[0].scope} />
                      <a
                        href={product.block}
                        className="group inline-flex min-h-9 items-center gap-1.5 text-meta text-violet-ink transition-colors duration-200 hover:text-ink"
                      >
                        See the stage
                        <ArrowRight
                          size={12}
                          weight="bold"
                          className="transition-transform duration-200 ease-out-quart group-hover:translate-x-0.5"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
