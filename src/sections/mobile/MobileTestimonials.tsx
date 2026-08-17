import { useRef } from "react"
import { CHROME_REVIEWS_URL, REVIEWS as REVIEWS_COPY } from "@/content/copy"
import { track } from "@/lib/analytics"
import { Container, SectionHeader } from "./ui"

const REVIEWS = [
  {
    name: "Filip Hristovschi",
    initials: "FH",
    quote:
      "This tool is saving so much time and makes everything so much more comfortable in daily dispatching routing.",
    y: 0,
  },
  {
    name: "Nicolae Cojocari",
    initials: "NC",
    quote:
      "A powerful and helpful tool for booking loads — it makes everything so much easier. Recommend trying it: it keeps the quality of the loads as high as possible.",
    y: 56,
  },
  {
    name: "AJ Cargo",
    initials: "AC",
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
    y: 0,
  },
  {
    name: "FleetMax LLC",
    initials: "FL",
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
    y: 78,
  },
  {
    name: "Mason Aleksic",
    initials: "MA",
    quote:
      "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!",
    y: 34,
  },
]

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <figure
      data-card
      data-no-reveal
      className="group relative flex w-full flex-col overflow-hidden rounded-lg border border-[rgba(229,229,229,0.1)] p-6 transition-[border-color,box-shadow] duration-500 hover:border-[rgba(111,81,151,0.8)] hover:shadow-[0px_34px_74px_-20px_rgba(111,81,151,0.5)] md:p-10"
    >
      {/* desktop card bg: dark radial from the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg"
        style={{
          backgroundImage:
            "radial-gradient(453px circle at 100% 6px, rgba(53,50,70,1), rgba(53,50,70,0))",
        }}
      />
      {/* hover bg: violet radial from bottom-center, fades in (desktop) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(295px circle at 50% 285px, rgba(111,81,151,1), rgba(111,81,151,0))",
        }}
      />
      <blockquote className="relative flex-1 text-[16px] font-medium leading-[22px] tracking-[-0.02em] text-gray-50">
        &ldquo;{r.quote}&rdquo;
      </blockquote>
      <figcaption className="relative mt-8 flex items-center gap-3">
        <span
          className="flex size-[42px] items-center justify-center rounded-lg border border-white text-[14px] font-medium tracking-[-0.56px] text-ink-2"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
            boxShadow:
              "var(--shadow-pill)",
          }}
        >
          {r.initials}
        </span>
        <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          {r.name}
        </span>
      </figcaption>
      {/* LH-042 — the reader can open the source */}
      <a
        href={CHROME_REVIEWS_URL}
        target="_blank"
        rel="noopener"
        onClick={() => track("review_source_click", { source: "chrome" })}
        className="relative mt-4 inline-flex w-fit items-center text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.55)] underline underline-offset-2"
      >
        Chrome Web Store review
      </a>
      <div className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
    </figure>
  )
}

/**
 * Reviews on the flow layout, rebuilt for LH-042 / LH-043 / SEO-020.
 *
 * The GSAP marquee and the touch snap carousel are both gone: LH-042 bans
 * auto-loop and LH-016 bans infinite marquees, so the five unique reviews stack
 * (two columns from md). The blended "4.4 from 100+ reviews" stat is replaced
 * by the two separate source cards with an "As of" stamp.
 */
export function MobileTestimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} id="reviews" className="overflow-hidden bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/testimonials/header-icon.png"
          title={REVIEWS_COPY.h2}
          sub={REVIEWS_COPY.lead}
        />

        {/* LH-043 — two source cards, never a blended average */}
        <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {REVIEWS_COPY.metrics.map((m) => (
            <li key={m.source}>
              <a
                href={m.href}
                target="_blank"
                rel="noopener"
                onClick={() => track("review_source_click", { source: m.source })}
                className="flex h-full flex-col items-start gap-1.5 rounded-lg border border-gray-650 px-5 py-4"
              >
                <span className="text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.55)]">
                  {m.source}
                </span>
                <span className="text-[18px] font-medium leading-[26px] tracking-[-0.02em] text-white">
                  {m.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.45)]">
          {REVIEWS_COPY.asOf}
        </p>

        {/* five unique reviews, static (no auto-loop, no carousel) */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} r={r} />
          ))}
        </div>
      </Container>
    </section>
  )
}
