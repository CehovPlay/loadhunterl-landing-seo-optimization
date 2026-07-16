import { Img } from "@/components/site/Img"
import { Container, SectionHeader } from "./ui"

const REVIEWS = [
  {
    name: "Filip Hristovschi",
    initials: "FH",
    quote:
      "This tool is saving so much time and makes everything so much more comfortable in daily dispatching routing.",
  },
  {
    name: "Nicolae Cojocari",
    initials: "NC",
    quote:
      "Ugh, It Seems To Be A Powerful and helpful Tool for booking loads ,makes everything so easier. Recommend To Taste It, And keep quality of the loads as high is possible with this tool",
  },
  {
    name: "AJ Cargo",
    initials: "AC",
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
  },
  {
    name: "FleetMax LLC",
    initials: "FL",
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
  },
  {
    name: "Mason Aleksic",
    initials: "MA",
    quote:
      "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!",
  },
]

/**
 * Mobile testimonials: the desktop marquee becomes a horizontal snap
 * carousel — swipe is the native gesture, no auto-scroll fighting the reader.
 */
export function MobileTestimonials() {
  return (
    <section id="contact" className="bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/tools/intro-icon.png"
          title="What client says"
          sub="Our clients appreciate our attention to their needs and professionalism. Here are some of their testimonials"
        />
        {/* trust strip — same baked export as desktop */}
        <Img
          src="/figma/reviews-strip.png"
          alt="5,000+ trusted users, 4.7 from 100+ reviews on Google, Trustpilot and G2"
          loading="lazy"
          decoding="async"
          className="mx-auto mt-6 w-full max-w-[350px]"
        />
      </Container>
      <div className="lh-snap mt-10 flex gap-4 overflow-x-auto px-[9vw] pb-2">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            data-no-reveal
            className="relative flex w-[82vw] max-w-[380px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-[rgba(229,229,229,0.1)] p-6"
          >
            {/* desktop card bg: dark radial from the top-right corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[12px]"
              style={{
                backgroundImage:
                  "radial-gradient(453px circle at 100% 6px, rgba(53,50,70,1), rgba(53,50,70,0))",
              }}
            />
            <blockquote className="relative flex-1 text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-gray-50">
              {r.quote}
            </blockquote>
            <figcaption className="relative mt-8 flex items-center gap-3">
              <span
                className="flex size-[42px] items-center justify-center rounded-[12px] border border-white text-[14px] font-medium text-ink-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
                  boxShadow:
                    "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
                }}
              >
                {r.initials}
              </span>
              <span className="text-[15px] font-medium tracking-[-0.02em] text-white">
                {r.name}
              </span>
            </figcaption>
            <div className="pointer-events-none absolute inset-0 rounded-[12px] shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.25)]" />
          </figure>
        ))}
      </div>
    </section>
  )
}
