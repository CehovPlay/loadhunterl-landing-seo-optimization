import { Img } from "@/components/site/Img"
import { CHROME_REVIEWS_URL, REVIEWS as REVIEWS_COPY } from "@/content/copy"
import { track } from "@/lib/analytics"
import { useRef } from "react"

/**
 * Reviews, rebuilt for LH-042 / LH-043 / SEO-020.
 *
 * The GSAP marquee is gone: LH-042 bans auto-loop and LH-016 bans infinite
 * marquees, so the five unique reviews render as a static grid. Each card links
 * to the source listing (per-review deep links are not available on the Chrome
 * Web Store, so they point at the reviews tab) and fires `review_source_click`.
 *
 * The old blended "4.4 from 100+ reviews" stat is replaced by two separate
 * source cards with an "As of" stamp — never one averaged number (LH-043).
 *
 * Review text is quoted VERBATIM (COPYQA-021): customer wording, including its
 * em dash, must not be silently edited.
 */

type Review = {
  quote: string
  initials: string
  name: string
  /** vertical offset within the cards band (from Figma) */
  y: number
}

const REVIEWS: Review[] = [
  {
    quote:
      "This tool is saving so much time and makes everything so much more comfortable in daily dispatching routing.",
    initials: "FH",
    name: "Filip Hristovschi",
    y: 0,
  },
  {
    quote:
      "A powerful and helpful tool for booking loads — it makes everything so much easier. Recommend trying it: it keeps the quality of the loads as high as possible.",
    initials: "NC",
    name: "Nicolae Cojocari",
    y: 202,
  },
  {
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
    initials: "AC",
    name: "AJ Cargo",
    y: 0,
  },
  {
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
    initials: "FL",
    name: "FleetMax LLC",
    y: 282,
  },
  {
    quote:
      "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!",
    initials: "MA",
    name: "Mason Aleksic",
    y: 120,
  },
]


function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      className="group relative flex w-[375px] flex-col overflow-hidden rounded-lg border border-[rgba(229,229,229,0.1)] p-[32px] transition-[border-color,box-shadow] duration-500 hover:border-[rgba(111,81,151,0.8)] hover:shadow-[0px_34px_74px_-20px_rgba(111,81,151,0.5)]"
      data-card
    >
      {/* default bg: dark radial from top-right (Figma 914:23772) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{
          backgroundImage:
            "radial-gradient(453px circle at 375px 6px, rgba(53,50,70,1), rgba(53,50,70,0))",
        }}
      />
      {/* hover bg: violet radial from bottom-center (Figma 914:23766), fades in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(295px circle at 50% 285px, rgba(111,81,151,1), rgba(111,81,151,0))",
        }}
      />

      <blockquote className="relative w-full flex-1 text-[16px] font-medium leading-[22px] tracking-[-0.02em] text-gray-50">
        &ldquo;{r.quote}&rdquo;
      </blockquote>
      <div className="relative mt-[28px] flex w-full items-center gap-[12px]">
        <div
          className="flex size-[42px] shrink-0 items-center justify-center rounded-lg border border-white"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
            boxShadow: "var(--shadow-pill)",
          }}
        >
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            {r.initials}
          </span>
        </div>
        <cite className="not-italic text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          {r.name}
        </cite>
      </div>
      {/* LH-042 — the reader can open the source */}
      <a
        href={CHROME_REVIEWS_URL}
        target="_blank"
        rel="noopener"
        onClick={() => track("review_source_click", { source: "chrome" })}
        className="relative mt-[16px] inline-flex w-fit items-center gap-[6px] text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.55)] underline underline-offset-2 transition-colors hover:text-white"
      >
        Chrome Web Store review
      </a>

      {/* bottom inner hairline shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
    </div>
  )
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} id="reviews" className="relative w-full bg-gray-800">
      <div className="flex flex-col items-center px-[120px] pb-[120px] pt-[120px]">
        <div data-float className="relative size-[64px]">
          <Img
            src="/figma/testimonials/header-icon.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-[-10px] top-[-4px] h-[84px] w-[84px] max-w-none"
          />
        </div>

        {/* LH-042 / SEO-020 */}
        <h2 className="mt-[48px] text-center text-[44px] font-medium leading-[52px] tracking-[-0.03em] text-white">
          {REVIEWS_COPY.h2}
        </h2>
        <p className="mt-[20px] max-w-[900px] text-center text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-[rgba(255,255,255,0.65)]">
          {REVIEWS_COPY.lead}
        </p>

        {/* LH-043 — two source cards, never a blended average */}
        <ul className="mt-[40px] flex items-stretch justify-center gap-[16px]">
          {REVIEWS_COPY.metrics.map((m) => (
            <li key={m.source}>
              <a
                href={m.href}
                target="_blank"
                rel="noopener"
                onClick={() => track("review_source_click", { source: m.source })}
                data-lift
                className="flex h-full w-[320px] flex-col items-start gap-[6px] rounded-lg border border-gray-650 px-[24px] py-[18px] transition-colors hover:border-violet/60"
              >
                <span className="text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.55)]">
                  {m.source}
                </span>
                <span className="text-[20px] font-medium leading-[28px] tracking-[-0.02em] text-white">
                  {m.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-[12px] text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.45)]">
          {REVIEWS_COPY.asOf}
        </p>

        {/* five unique reviews, static (no auto-loop) */}
        <div className="mt-[56px] flex flex-wrap justify-center gap-[24px]">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </div>
      </div>
    </section>
  )
}
