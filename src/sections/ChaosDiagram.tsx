import { Container } from "@/components/site/Container"
import { LogoMark } from "@/components/site/Logo"
import { LayoutGrid, Users, Mail, Settings2, Inbox } from "lucide-react"

const TOP_NODES = [LayoutGrid, Users, Settings2, Mail, Inbox]

export function ChaosDiagram() {
  return (
    <section className="bg-gray-900 pb-28 pt-8">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl text-h2 font-medium tracking-[-0.02em] text-dark-text">
          From chaos to AI-Powered dispatch
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-small leading-relaxed text-gray-300">
          Stop refreshing load boards, rewriting emails, and calculating profits
          by hand. LoadHunter automates the busywork so your team can find better
          loads, respond faster, and book with confidence.
        </p>

        <div className="relative mx-auto mt-14 h-[360px] max-w-3xl">
          {/* connectors */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 360"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {[160, 280, 400, 520, 640].map((x) => (
              <path
                key={x}
                d={`M${x} 70 C ${x} 160, 400 160, 400 230`}
                stroke="url(#fade)"
                strokeWidth="1"
              />
            ))}
            {/* orbital arcs below center */}
            {[60, 120, 180].map((r, i) => (
              <path
                key={r}
                d={`M${400 - r * 2} 250 Q 400 ${250 + r} ${400 + r * 2} 250`}
                stroke="#ffffff"
                strokeOpacity={0.06 - i * 0.012}
                strokeWidth="1"
              />
            ))}
            <defs>
              <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0.02" />
              </linearGradient>
            </defs>
          </svg>

          {/* top nodes */}
          <div className="absolute inset-x-0 top-[40px] flex justify-between px-[120px]">
            {TOP_NODES.map((Icon, i) => (
              <span
                key={i}
                className="flex size-11 items-center justify-center rounded-full border border-line bg-gray-800 text-gray-200 shadow-lg shadow-black/40"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>

          {/* center node */}
          <div className="absolute left-1/2 top-[210px] flex size-14 -translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-gray-800 text-dark-text shadow-xl shadow-black/60">
            <LogoMark className="size-6" />
          </div>

          {/* tagline pill */}
          <div className="absolute left-1/2 top-[320px] -translate-x-1/2">
            <span className="inline-flex items-center rounded-lg border border-line-strong bg-gray-800 px-5 py-3 text-small font-medium text-dark-text shadow-lg shadow-black/40">
              Logistics is moving to AI. Don't get left behind.
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
