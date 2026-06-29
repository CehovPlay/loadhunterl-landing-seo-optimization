import { Container } from "@/components/site/Container"
import { Logo, LogoMark } from "@/components/site/Logo"
import { Globe, Mail, Settings2, MapPin, Phone, Star, Calculator } from "lucide-react"

const ORBIT = [
  { Icon: Mail, x: 50, y: 6 },
  { Icon: Settings2, x: 88, y: 26 },
  { Icon: MapPin, x: 88, y: 72 },
  { Icon: Phone, x: 12, y: 26 },
  { Icon: Star, x: 12, y: 72 },
  { Icon: Calculator, x: 50, y: 92 },
]

export function Cta() {
  return (
    <section id="start" className="bg-gray-900 pb-12 pt-8">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-line lg:grid-cols-2">
          {/* left — violet card */}
          <div className="relative flex flex-col justify-between bg-gradient-to-br from-violet-600/35 via-violet-600/15 to-gray-900 p-8 lg:p-10">
            <Logo />
            <div className="mt-16">
              <h2 className="text-h3 font-medium tracking-[-0.02em] text-dark-text">
                Start your experience
                <br />
                with LoadHunter
              </h2>
              <p className="mt-3 max-w-sm text-subtle leading-relaxed text-gray-300">
                Search loads with efficiency and speed you never had before.
                LoadHunter: AI-powered tool.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-small font-medium text-ink transition-opacity hover:opacity-90">
                <Globe className="size-4" />
                Add to Chrome
              </button>
            </div>
          </div>

          {/* right — automation diagram */}
          <div className="relative min-h-[300px] bg-gray-900 p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(156,102,229,0.12),transparent_60%)]"
            />
            <div className="relative mx-auto h-full max-w-md">
              {ORBIT.map(({ Icon, x, y }, i) => (
                <span
                  key={i}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full border border-line bg-gray-800 text-gray-200 shadow-lg shadow-black/40"
                >
                  <Icon className="size-4" />
                </span>
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-line-strong bg-gray-800 text-dark-text shadow-xl shadow-black/60">
                  <LogoMark className="size-6" />
                </span>
                <p className="mt-4 text-body font-medium text-dark-text">
                  One click automation
                </p>
                <p className="mt-1 text-subtle text-gray-300">
                  Book faster. Miss less. Earn more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
