import { Container } from "@/components/site/Container"

/* --- decorative graphics (monochrome, light theme) --------------- */

function NodeCluster() {
  const items = ["Email", "SMS", "Maps", "Calls", "Notes", "RPM"]
  return (
    <div className="relative mx-auto grid h-40 w-full place-items-center">
      <div className="relative size-32">
        <div className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border-light bg-white shadow-sm">
          <svg viewBox="0 0 24 24" className="size-4 text-ink/70" fill="none">
            <path d="M12 2 3 7.2v9.6L12 22l9-5.2V7.2L12 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
        {items.map((label, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2
          const x = 50 + Math.cos(a) * 46
          const y = 50 + Math.sin(a) * 46
          return (
            <span
              key={label}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-border-light bg-white px-2 py-1 text-[9px] text-ink-2 shadow-sm"
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function Gauge() {
  return (
    <div className="relative mx-auto grid h-40 w-full place-items-center">
      <svg viewBox="0 0 200 120" className="w-44">
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (i / 39) * Math.PI - Math.PI
          const x1 = 100 + Math.cos(a) * 78
          const y1 = 110 + Math.sin(a) * 78
          const x2 = 100 + Math.cos(a) * 88
          const y2 = 110 + Math.sin(a) * 88
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#454545"
              strokeOpacity={i > 28 ? 0.15 : 0.35}
              strokeWidth="2"
            />
          )
        })}
        <line x1="100" y1="110" x2="150" y2="62" stroke="#454545" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="110" r="6" fill="#454545" />
      </svg>
    </div>
  )
}

function AutoNodes() {
  return (
    <div className="relative mx-auto grid h-40 w-full place-items-center">
      <div className="w-full max-w-[220px] space-y-2.5">
        <div className="flex items-center justify-end gap-2">
          <span className="rounded-md border border-border-light bg-white px-2 py-1 text-[9px] text-ink-2 shadow-sm">
            Telegram notifications
          </span>
        </div>
        <div className="flex items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full border border-border-light bg-white shadow-sm">
            <svg viewBox="0 0 24 24" className="size-4 text-ink/70" fill="none">
              <path d="M12 2 3 7.2v9.6L12 22l9-5.2V7.2L12 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="flex items-center justify-start gap-2">
          <span className="rounded-md border border-border-light bg-white px-2 py-1 text-[9px] text-ink-2 shadow-sm">
            Auto-emailing
          </span>
        </div>
      </div>
    </div>
  )
}

const CARDS = [
  {
    title: "All needs in one place",
    body: "Access every essential dispatching tool directly from your load board — emails, notifications, maps, and more, all seamlessly integrated.",
    art: <NodeCluster />,
  },
  {
    title: "Time saver",
    body: "Save hours every day by automating repetitive tasks, streamlining workflows, and focusing on what matters most — booking the best loads.",
    art: <Gauge />,
  },
  {
    title: "AI-Powered automation",
    body: "Automate your workflow with AI-driven features like Telegram notifications and auto-emailing, reducing manual tasks and saving valuable time.",
    art: <AutoNodes />,
  },
]

export function Features() {
  return (
    <section id="why" className="bg-bg-light py-24 text-ink">
      <Container>
        <h2 className="mx-auto max-w-3xl text-center text-h2 font-medium leading-[1.12] tracking-[-0.02em]">
          Everything you need to book faster — nothing extra
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-body text-ink-2">
          New loads appear instantly — no refresh, no delay. Email or text
          brokers in seconds, not minutes.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((c) => (
            <article
              key={c.title}
              className="rounded-lg border border-border-light bg-white p-6"
            >
              <div className="rounded-lg">{c.art}</div>
              <h3 className="mt-4 text-center text-h4 font-medium">{c.title}</h3>
              <p className="mx-auto mt-2 max-w-[34ch] text-center text-small leading-relaxed text-ink-2">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
