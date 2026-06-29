import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

type Card = {
  quote: string
  author: string
  x: number
  y: number
  w: number
  featured?: boolean
}

const CARDS: Card[] = [
  { quote: "This tool is saving so much time and everything is so much more comfortable in daily dispatching routing.", author: "Filip Hristovschi", x: -2, y: 44, w: 300 },
  { quote: "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!", author: "AJ Cargo", x: 39, y: 47, w: 340, featured: true },
  { quote: "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!", author: "Mason Aleksic", x: 85, y: 57, w: 320 },
  { quote: "Ugh, It Seems To Be A Powerful and helpful Tool for booking loads, makes everything so easier. Recommend To Taste It, And keep quality of the loads as high is possible with this tool", author: "Nicolae Cojocari", x: 18, y: 63, w: 300 },
  { quote: "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.", author: "FleetMax LLC", x: 61, y: 70, w: 300 },
]

function ReviewCard({ c }: { c: Card }) {
  return (
    <div
      style={{ left: `${c.x}%`, top: `${c.y}%`, width: c.w }}
      className={cn(
        "absolute rounded-[16px] border p-5",
        c.featured
          ? "border-violet-600/40 bg-[linear-gradient(160deg,rgba(156,102,229,0.22),#1b1722)]"
          : "border-[#ffffff12] bg-[#1d1f24]",
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald/15 px-2 py-1 text-[11px] text-emerald">
        <span className="size-1.5 rounded-full bg-emerald" /> Positive
      </span>
      <p className="mt-3 text-[13px] leading-[19px] tracking-[-0.52px] text-[#c5c6c8]">
        {c.quote}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="size-6 rounded-full bg-[#2f3136]" />
        <span className="text-[12px] text-[#8c8d8f]">{c.author}</span>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="contact" className="relative h-[1180px] overflow-hidden bg-[#18191f]">
      {/* header */}
      <div className="flex flex-col items-center pt-[60px]">
        <span
          className="flex size-12 items-center justify-center rounded-[14px] border border-[#ffffff1a] bg-[#1d1f24] text-violet-300"
          style={{ boxShadow: "0px 6px 16px -6px rgba(111,81,151,0.45)" }}
        >
          <Star className="size-5" />
        </span>
        <h2 className="mt-7 text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-[#e8e8e8]">
          What client says
        </h2>
        <p className="mt-2 text-[14px] font-medium tracking-[-0.56px] text-[#686b6f]">
          Our clients appreciate our attention to their needs and professionalism. Here are some of their testimonials.
        </p>

        {/* rating row */}
        <div className="mt-6 flex items-center gap-6 text-[#a3a4a6]">
          <div className="text-center">
            <p className="text-[16px] font-medium text-[#e8e8e8]">5,000 +</p>
            <p className="text-[11px] text-[#686b6f]">Trusted by users</p>
          </div>
          <div className="h-8 w-px bg-[#ffffff14]" />
          <div className="flex items-center gap-2">
            <span className="flex gap-0.5 text-violet-300">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </span>
            <div className="text-[11px]">
              <p className="text-[13px] font-medium text-[#e8e8e8]">4.7</p>
              <p className="text-[#686b6f]">from 100 + reviews</p>
            </div>
          </div>
          <div className="h-8 w-px bg-[#ffffff14]" />
          <span className="text-[13px] font-medium text-[#e8e8e8]">Google Reviews</span>
          <div className="h-8 w-px bg-[#ffffff14]" />
          <span className="flex items-center gap-1 text-[13px] font-medium text-[#e8e8e8]">
            <Star className="size-3.5 fill-emerald text-emerald" /> Trustpilot
          </span>
          <span className="flex size-6 items-center justify-center rounded-full bg-[#e0492b] text-[11px] font-bold text-white">G</span>
        </div>
      </div>

      {/* scattered cards */}
      {CARDS.map((c) => (
        <ReviewCard key={c.author} c={c} />
      ))}
    </section>
  )
}
