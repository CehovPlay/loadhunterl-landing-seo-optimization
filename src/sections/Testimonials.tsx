import { Container } from "@/components/site/Container"
import { IconBadge } from "@/components/site/IconBadge"
import { Star, MessageSquareQuote } from "lucide-react"
import { cn } from "@/lib/utils"

type Review = {
  tone: "positive" | "negative"
  quote: string
  author: string
  featured?: boolean
}

const REVIEWS: Review[] = [
  { tone: "positive", quote: "Solid broker. Always answers the phone and pays within 21 days as promised. Had a breakdown on the way to pickup, and they were very understanding.", author: "Anonymous" },
  { tone: "positive", quote: "One of the best experiences with PLS. High-paying lane, quick detention approval, and zero issues with the paperwork. Definitely adding them to my preferred list.", author: "Anonymous", featured: true },
  { tone: "negative", quote: "Complete waste of time. They canceled the load 30 minutes before the pickup and didn't even offer a TONU. Their carrier relations department is impossible to reach.", author: "Anonymous" },
  { tone: "positive", quote: "Ugh, it seems to be a powerful and helpful tool for booking loads, makes everything so easier. Recommend to taste it. And keep quality of the loads as high is possible with this tool.", author: "Nicolae Cojocari" },
  { tone: "positive", quote: "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.", author: "FleetMax LLC" },
  { tone: "positive", quote: "Booked a Reefer load, rate was fair, and they paid without a fight after the lumper receipt.", author: "AJ Cargo", featured: true },
  { tone: "positive", quote: "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!", author: "Mason Aleksic" },
]

function ReviewCard({ r }: { r: Review }) {
  return (
    <div
      className={cn(
        "mb-4 break-inside-avoid rounded-xl border p-5",
        r.featured
          ? "border-violet-600/40 bg-gradient-to-br from-violet-600/20 to-gray-900"
          : "border-line bg-gray-800/40",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-subtle",
          r.tone === "positive"
            ? "bg-emerald/15 text-emerald"
            : "bg-rose/15 text-rose",
        )}
      >
        <span className={cn("size-1.5 rounded-full", r.tone === "positive" ? "bg-emerald" : "bg-rose")} />
        {r.tone === "positive" ? "Positive" : "Negative"}
      </span>
      <p className="mt-3 text-small leading-relaxed text-gray-200">"{r.quote}"</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="size-6 rounded-full bg-gray-700" />
        <span className="text-subtle text-gray-400">{r.author}</span>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="contact" className="bg-gray-900 py-24">
      <Container className="text-center">
        <IconBadge>
          <MessageSquareQuote className="size-5" />
        </IconBadge>
        <h2 className="mx-auto mt-8 text-h2 font-medium tracking-[-0.02em] text-dark-text">
          What client says
        </h2>

        {/* rating */}
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-line bg-gray-800 px-4 py-2 text-small">
          <span className="font-medium text-dark-text">Excellent</span>
          <span className="flex gap-0.5 text-violet-300">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </span>
          <span className="text-gray-300">4.7</span>
          <span className="border-l border-line pl-3 font-medium text-dark-text">
            ★ Trustpilot
          </span>
        </div>

        {/* masonry */}
        <div className="mt-12 columns-1 gap-4 text-left sm:columns-2 lg:columns-3">
          {REVIEWS.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </Container>
    </section>
  )
}
