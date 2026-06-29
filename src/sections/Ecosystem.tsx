import { Container } from "@/components/site/Container"
import { LogoMark } from "@/components/site/Logo"

/* Orbit banner — concentric rings with a central mark and scattered labels */

const ORBIT_LABELS: { text: string; x: number; y: number }[] = [
  { text: "Maximize your RPM", x: 12, y: 8 },
  { text: "No more spreadsheets", x: 33, y: 4 },
  { text: "Live data stream", x: 52, y: 6 },
  { text: "Verified brokers only", x: 70, y: 6 },
  { text: "Start booking in seconds", x: 88, y: 12 },
  { text: "Get your first load today", x: 22, y: 24 },
  { text: "One-click booking", x: 35, y: 36 },
  { text: "Instant notifications", x: 66, y: 36 },
  { text: "Upgrade your dispatching", x: 80, y: 26 },
  { text: "Scalable fleet growth", x: 4, y: 34 },
  { text: "Zero wasted miles", x: 92, y: 40 },
  { text: "Book faster in 30 seconds", x: 22, y: 56 },
  { text: "Stop missing loads", x: 40, y: 62 },
  { text: "Fast calculations", x: 64, y: 56 },
  { text: "Higher RPM only", x: 78, y: 60 },
]

function OrbitBanner() {
  return (
    <div className="relative mx-auto h-[440px] max-w-5xl overflow-hidden">
      {/* concentric rings */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[160, 280, 400, 520, 640].map((d) => (
          <div
            key={d}
            style={{ width: d, height: d }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border-light"
          />
        ))}
      </div>

      {/* center mark */}
      <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-light bg-white shadow-md">
        <LogoMark className="size-7 text-ink" />
      </div>

      {/* labels */}
      {ORBIT_LABELS.map((l) => (
        <span
          key={l.text}
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
          className="absolute -translate-y-1/2 whitespace-nowrap rounded-full border border-border-light bg-white px-3 py-1.5 text-subtle text-ink-2 shadow-sm"
        >
          {l.text}
        </span>
      ))}
    </div>
  )
}

/* Ecosystem products card */

function ProductScreenshot({ kind }: { kind: "ext" | "tms" | "pay" }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border-light px-3 py-2">
        <span className="size-2 rounded-full bg-border-light" />
        <span className="size-2 rounded-full bg-border-light" />
        <span className="size-2 rounded-full bg-border-light" />
      </div>
      <div className="grid grid-cols-[80px_1fr] gap-2 p-3">
        <div className="space-y-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-bg-light" />
          ))}
        </div>
        <div className="space-y-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className={`size-2 rounded-full ${
                  kind === "pay" ? "bg-emerald/50" : kind === "tms" ? "bg-orange/60" : "bg-violet-600/50"
                }`}
              />
              <div className="h-3 flex-1 rounded bg-bg-light" />
              <div className="h-3 w-10 rounded bg-bg-light" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PRODUCTS = [
  {
    name: "loadhunter",
    kind: "ext" as const,
    body: "LoadHunter Extension is an AI browser tool that enhances the load booking process on major LoadBoards (DAT, Truckstop, etc.).",
  },
  {
    name: "huntTMS",
    kind: "tms" as const,
    body: "Comprehensive transport management system providing a single platform to manage all aspects.",
  },
  {
    name: "huntPAY",
    kind: "pay" as const,
    body: "Comprehensive transport management system providing a single platform to manage all aspects.",
  },
]

export function Ecosystem() {
  return (
    <section id="offers" className="bg-bg-light pb-24 pt-12 text-ink">
      <Container>
        <OrbitBanner />

        <div className="mt-8 grid gap-8 rounded-2xl border border-border-light bg-white p-8 lg:grid-cols-[320px_1fr] lg:p-12">
          {/* left intro */}
          <div>
            <span className="flex size-11 items-center justify-center rounded-md border border-border-light bg-bg-light text-violet-600">
              <LogoMark className="size-5" />
            </span>
            <h2 className="mt-6 text-h2 font-medium tracking-[-0.02em]">
              Our ecosystem products
            </h2>
            <p className="mt-3 text-small text-ink-2">
              Everything you need to find, evaluate, and book loads — faster,
              smarter, and in one place.
            </p>
          </div>

          {/* right products */}
          <div className="space-y-6">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="grid items-center gap-5 border-t border-border-light pt-6 first:border-t-0 first:pt-0 md:grid-cols-[260px_1fr]"
              >
                <div>
                  <div className="flex items-center gap-2 text-body font-medium">
                    <LogoMark className="size-4 text-ink" />
                    {p.name}
                  </div>
                  <p className="mt-2 text-subtle leading-relaxed text-ink-2">
                    {p.body}
                  </p>
                </div>
                <ProductScreenshot kind={p.kind} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
