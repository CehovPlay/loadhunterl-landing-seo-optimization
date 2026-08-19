"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CTA, SAMPLE_NOTE, STOP_ONE } from "@/content/home"
import { prefersReducedMotion } from "@/lib/motion"
import { LoadCard } from "./LoadCard"
import { RailNode } from "./Rail"
import { PrimaryCta } from "./ui"

gsap.registerPlugin(ScrollTrigger)

/**
 * Stop 01, LoadHunter.
 *
 * The rule this scene exists to obey is TZ §7.2: show ONE load result in two
 * states. The card above is the raw result; here the same card gains the
 * decision layer, row by row, as the visitor scrolls past it. Using a second,
 * better-looking load would let them credit the product for the load instead of
 * for the analysis.
 *
 * Each row also carries its own reason. §7.2 requires the RPM formula to be
 * visible beside the figure and deadhead to be explained rather than asserted,
 * and it requires any field the product cannot legitimately source to say so,
 * which is why the broker row reads "Not published" instead of being dropped.
 *
 * The motion is storytelling, not decoration: the layer arrives in the reading
 * order of the explanation on the left. Nothing is pinned and the scroll is
 * never hijacked, per §11.3.
 */
export function StopOne() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-layer-row]")
      rows.forEach((row) => {
        gsap.set(row, { opacity: 0, y: 12 })
        gsap.to(row, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        })
      })

      const seam = root.current!.querySelector("[data-layer-seam]")
      if (seam) {
        gsap.set(seam, { scaleX: 0, transformOrigin: "left center" })
        gsap.to(seam, {
          scaleX: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: seam, start: "top 92%", once: true },
        })
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative pb-28 md:pb-40">
      <RailNode className="top-1" />

      <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="pl-9 md:pl-20 lg:col-span-6 lg:self-start lg:pt-1">
          <div className="lg:sticky lg:top-28">
            <p className="figures text-meta text-ink-3">
              {STOP_ONE.step} · {STOP_ONE.kicker}
            </p>
            <h2 className="mt-5 max-w-[19ch] text-h2 text-balance">{STOP_ONE.h3}</h2>
            <p className="mt-6 max-w-[48ch] text-body text-ink-2">{STOP_ONE.body}</p>
            <div className="mt-9">
              <PrimaryCta href={CTA.install.href}>{CTA.install.label}</PrimaryCta>
            </div>

            {/* TZ §7.2 puts a hard limit on compatibility claims: only the
                browsers and boards the shipped version actually supports. The
                honest form of that on a marketing page is to point at the
                maintained list rather than to imply coverage here. */}
            <p className="mt-7 max-w-[40ch] text-meta text-ink-3">
              Supported browsers and load boards are published per release on the{" "}
              <Link href={CTA.install.href} className="text-ink-2 underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-violet">
                LoadHunter product page
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="pl-9 md:pl-20 lg:col-span-5 lg:col-start-8 lg:pl-0">
          <div className="lg:max-w-[460px]">
            <LoadCard>
              {/* Everything below this seam is what LoadHunter adds. The seam is
                  drawn rather than fading in so the boundary between the source
                  result and the product's contribution stays legible. */}
              <div className="relative border-t border-rule bg-violet-wash/60 px-6 pt-5 pb-6">
                <span
                  data-layer-seam
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 block h-px origin-left bg-violet"
                />

                <p data-layer-row className="text-meta text-violet-ink">
                  LoadHunter layer
                </p>

                <dl className="mt-4 flex flex-col gap-5">
                  {STOP_ONE.layer.map((row) => (
                    <div key={row.id} data-layer-row>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-small text-ink-2">{row.label}</dt>
                        <dd className="figures text-body text-ink">{row.value}</dd>
                      </div>
                      <p className="mt-1 text-meta text-ink-3">{row.note}</p>
                    </div>
                  ))}
                </dl>

                <div data-layer-row className="mt-7">
                  <button
                    type="button"
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-violet px-5 text-small font-medium text-violet-ink transition duration-200 ease-out-quart hover:bg-violet hover:text-white active:translate-y-px"
                  >
                    {STOP_ONE.action}
                  </button>
                  <p className="mt-3 text-meta text-ink-3">{STOP_ONE.actionNote}</p>
                </div>
              </div>
            </LoadCard>

            {/* Says out loud what the composition is doing, because the whole
                argument depends on the visitor knowing it is the same load. */}
            <p className="mt-4 max-w-[44ch] text-meta text-ink-3">
              {SAMPLE_NOTE}. The same load as above, with the LoadHunter layer applied. Figures are
              illustrative and are not a market rate.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
