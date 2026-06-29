import { Container } from "@/components/site/Container"
import { DispatchDashboard } from "@/components/mockups/DispatchDashboard"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-900 pb-24 pt-36">
      {/* ambient glow ("beem") */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        {/* Left — copy */}
        <div className="max-w-xl">
          <p className="mb-7 inline-flex items-center gap-2 text-small text-gray-300">
            <span className="inline-block size-1.5 rotate-45 bg-gray-400" />
            The AI copilot for smarter dispatching.
          </p>

          <h1 className="text-h1 font-medium leading-[1.04] tracking-[-0.03em] text-dark-text">
            Book <span className="text-gray-300">better</span> loads
            <br />
            before <span className="text-gray-300">anyone else</span>
          </h1>

          <div className="mt-5 inline-flex rounded-md border border-line-strong bg-gray-800 px-5 py-3">
            <span className="text-h3 font-medium tracking-tight text-dark-text">
              In under 30 seconds
            </span>
          </div>

          <p className="mt-7 max-w-md text-body leading-relaxed text-gray-200">
            LoadHunter scans loadboard in real-time, filters high-RPM loads,
            and lets you contact brokers instantly — email, SMS, or call.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#start"
              className="inline-flex items-center rounded-full bg-white px-5 py-3 text-small font-medium text-ink transition-opacity hover:opacity-90"
            >
              Start free trial 14 days
            </a>
            <a
              href="#book"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-gray-800 px-5 py-3 text-small font-medium text-dark-text transition-colors hover:bg-gray-750"
            >
              <svg viewBox="0 0 24 24" className="size-4 text-violet-300" fill="none">
                <path
                  d="M12 2 3 7.2v9.6L12 22l9-5.2V7.2L12 2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              Start booking in minutes
            </a>
          </div>
        </div>

        {/* Right — product mockup */}
        <div className="relative">
          <DispatchDashboard />
        </div>
      </Container>
    </section>
  )
}
