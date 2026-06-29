import { Container } from "@/components/site/Container"
import { FeatureBlock } from "@/sections/tools/FeatureBlock"
import { LoadboardWindow } from "@/components/mockups/LoadboardWindow"
import {
  Zap,
  SlidersHorizontal,
  AtSign,
  Filter,
  Send,
  Bell,
  Table2,
  Workflow,
  MapPin,
  Route,
  Star,
  ShieldCheck,
  Calculator,
  TrendingUp,
} from "lucide-react"

/* --- small mockups ---------------------------------------------- */

function AutoEmailOverlay() {
  return (
    <div className="absolute right-3 top-16 w-[150px] rounded-md border border-line-strong bg-gray-800 p-2.5 shadow-xl shadow-black/60">
      <p className="mb-2 text-[9px] font-medium text-dark-text">Auto send emails</p>
      {[
        ["Max Trip", "$2,40"],
        ["Min Weight", "12,650"],
        ["Min RPM", "$2,80"],
        ["Min Rate", "44,830"],
      ].map(([k, v]) => (
        <div key={k} className="mb-1 flex items-center justify-between rounded border border-line bg-black/30 px-1.5 py-1">
          <span className="text-[8px] text-gray-300">{k}</span>
          <span className="text-[8px] text-gray-200">{v}</span>
        </div>
      ))}
      <button className="mt-1 w-full rounded bg-violet-600 py-1 text-[8px] font-medium text-white">
        Apply
      </button>
    </div>
  )
}

function TelegramMockup() {
  const cards = [
    { route: "Dallas, TX → Atlanta, GA", price: "$2,350" },
    { route: "Houston, TX → Memphis, TN", price: "$1,920" },
    { route: "Phoenix, AZ → Denver, CO", price: "$2,780" },
  ]
  return (
    <div className="relative h-[340px] rounded-lg border border-line bg-gray-900 p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_50%_40%,rgba(156,102,229,0.12),transparent_60%)]"
      />
      <div className="relative space-y-3">
        {cards.map((c, i) => (
          <div
            key={c.route}
            style={{ marginLeft: `${i * 28}px` }}
            className="flex max-w-[280px] items-center gap-2.5 rounded-lg border border-line bg-gray-800 px-3 py-2.5 shadow-lg shadow-black/40"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-violet-600/20 text-violet-300">
              <Send className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] font-medium text-dark-text">
                LoadHunter
                <span className="rounded bg-emerald/20 px-1 text-[8px] text-emerald">New</span>
              </p>
              <p className="truncate text-[9px] text-gray-300">
                {c.route} — {c.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TmsMockup() {
  return (
    <div className="rounded-lg border border-line bg-gray-900 p-4 shadow-2xl shadow-black/60">
      <div className="mb-3 flex items-center gap-2 border-b border-line pb-2 text-[10px] text-gray-200">
        <Table2 className="size-3.5 text-violet-300" /> Integrated TMS
        <span className="ml-auto text-[9px] text-gray-400">12 active</span>
      </div>
      <div className="space-y-1.5">
        {["Load #4821 · Picked up", "Load #4822 · In transit", "Load #4823 · Delivered", "Load #4824 · Booked"].map(
          (t, i) => (
            <div key={t} className="flex items-center gap-2 rounded-md border border-line bg-gray-800 px-2.5 py-2 text-[9px] text-gray-200">
              <span className={cnDot(i)} />
              {t}
              <span className="ml-auto text-gray-400">edit</span>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
function cnDot(i: number) {
  const c = ["bg-emerald", "bg-orange", "bg-violet-300", "bg-gray-400"][i % 4]
  return `size-1.5 rounded-full ${c}`
}

function MapMockup() {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-lg border border-line bg-gray-900">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 320" fill="none">
        <path d="M70 240 C 150 180, 220 200, 330 90" stroke="#9c66e5" strokeWidth="2" strokeDasharray="5 5" />
        <circle cx="70" cy="240" r="6" fill="#9c66e5" />
        <circle cx="330" cy="90" r="6" fill="#10b981" />
      </svg>
      <div className="absolute left-4 top-4 rounded-md border border-line bg-gray-800 px-2.5 py-1.5 text-[9px] text-gray-200">
        <MapPin className="mr-1 inline size-3 text-violet-300" /> Grand Prairie, TX
      </div>
    </div>
  )
}

function ReviewsMockup() {
  return (
    <div className="space-y-2.5">
      {[
        { name: "IronGate Logistics", mc: "MC #1109347", score: "4.8", pos: "224", neg: "104" },
        { name: "Northstar Freight", mc: "MC #884201", score: "4.6", pos: "189", neg: "37" },
      ].map((b) => (
        <div key={b.name} className="rounded-lg border border-line bg-gray-900 p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-dark-text">{b.name}</p>
              <p className="text-[9px] text-gray-400">{b.mc}</p>
            </div>
            <span className="flex items-center gap-1 rounded-md bg-violet-600/15 px-2 py-1 text-[10px] text-violet-300">
              <Star className="size-3 fill-current" /> {b.score}
            </span>
          </div>
          <div className="mt-3 flex gap-2 text-[9px]">
            <span className="rounded bg-emerald/15 px-2 py-1 text-emerald">↑ {b.pos} positive</span>
            <span className="rounded bg-rose/15 px-2 py-1 text-rose">↓ {b.neg} disputes</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfitMockup() {
  return (
    <div className="rounded-lg border border-line bg-gray-900 p-4 shadow-2xl shadow-black/60">
      <div className="mb-3 flex items-center gap-2 text-[10px] text-gray-200">
        <Calculator className="size-3.5 text-violet-300" /> Profit calculator
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Rate", "$2,640"],
          ["Miles", "920"],
          ["Fuel", "-$410"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md border border-line bg-gray-800 py-2.5">
            <p className="text-[8px] text-gray-400">{k}</p>
            <p className="mt-0.5 text-[11px] font-medium text-dark-text">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-md border border-violet-600/40 bg-violet-600/10 px-3 py-2.5">
        <span className="text-[10px] text-gray-200">Net profit</span>
        <span className="flex items-center gap-1 text-[13px] font-medium text-violet-300">
          <TrendingUp className="size-3.5" /> $2,230
        </span>
      </div>
    </div>
  )
}

/* --- section ----------------------------------------------------- */

export function Tools() {
  return (
    <section id="features" className="bg-gray-900 py-8">
      <Container className="space-y-28">
        <FeatureBlock
          heading="Smart-board view"
          description="We've completely redesigned how LoadBoards are displayed by replacing the default DAT view with our custom high-performance interface. This allows users to fully customize column layout, hide or show fields, and experience a smoother, faster workflow — without any of the typical lags or freezing."
          items={[
            { icon: <Zap className="size-4" />, title: "Performance optimization", body: "Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported loadboards." },
            { icon: <SlidersHorizontal className="size-4" />, title: "Workflow customization", body: "You can drag, resize, reorder, hide, or pin any load — customizing the loadboard interface to fit your unique dispatching flow." },
          ]}
          mockup={<LoadboardWindow />}
        />

        <FeatureBlock
          reverse
          heading="Auto-emailing"
          description="Our custom view eliminates the slowdowns and UI glitches of traditional integration, delivering a smooth and responsive experience across all supported load boards."
          items={[
            { icon: <AtSign className="size-4" />, title: "Multiple email accounts", body: "Send emails from multiple accounts automatically, ideal for teams working with different carriers." },
            { icon: <Filter className="size-4" />, title: "AI filtering", body: "Avoid duplicates and re-posted loads by sending emails only to new brokers, keeping requests relevant." },
          ]}
          mockup={<LoadboardWindow overlay={<AutoEmailOverlay />} />}
        />

        <FeatureBlock
          heading="Telegram notifications"
          description="Get instant alerts the moment a matching high-RPM load appears — straight to your Telegram, so you never miss an opportunity even away from the board."
          items={[
            { icon: <Send className="size-4" />, title: "Instant load alerts", body: "Real-time push of matching loads with route, rate and broker, delivered the second they post." },
            { icon: <Bell className="size-4" />, title: "Custom triggers", body: "Set your own rate, lane and equipment filters so only the loads worth booking reach you." },
          ]}
          mockup={<TelegramMockup />}
        />

        <FeatureBlock
          reverse
          heading="Integrated TMS"
          description="Manage every booked load end-to-end inside LoadHunter — no copy-pasting between tools. Status, documents and contacts in one place."
          items={[
            { icon: <Table2 className="size-4" />, title: "One source of truth", body: "Track every load from booked to delivered with live statuses synced across your whole team." },
            { icon: <Workflow className="size-4" />, title: "No double entry", body: "Booked loads flow straight into the TMS — broker, rate and lane carried over automatically." },
          ]}
          mockup={<TmsMockup />}
        />

        <FeatureBlock
          heading="Integrated map"
          description="See origin, destination and deadhead at a glance on a built-in map, so you can judge a load's real value before you ever pick up the phone."
          items={[
            { icon: <MapPin className="size-4" />, title: "Advanced filtering", body: "Filter Telegram notifications to receive only the most relevant loads based on your preferences, improving efficiency." },
            { icon: <Route className="size-4" />, title: "Multiple load-boards", body: "Connect multiple load boards to get loads from all of them in Telegram, streamlining your workflow." },
          ]}
          mockup={<MapMockup />}
        />

        <FeatureBlock
          reverse
          heading="Broker reviews"
          description="Know who you're dealing with before you book. Community-sourced broker ratings and payment history right next to every load."
          items={[
            { icon: <Star className="size-4" />, title: "Verified Payment History", body: "See how long brokers actually take to pay and if they require detention or lumper agreements." },
            { icon: <ShieldCheck className="size-4" />, title: "Real-time Red Flags", body: "Get instant alerts on brokers who frequently cancel loads at the last minute or have low credit scores." },
          ]}
          mockup={<ReviewsMockup />}
        />

        <FeatureBlock
          heading="Profit calculator"
          description="Instantly see the real number behind every load — rate per mile, fuel, and net profit — so you only chase loads that actually pay."
          items={[
            { icon: <Calculator className="size-4" />, title: "Full Expense Breakdown", body: "Account for fuel consumption, current diesel prices, and tolls automatically. Know your true net profit before you even talk to the broker." },
            { icon: <TrendingUp className="size-4" />, title: "Smart RPM+ Evaluation", body: "Evaluate true profitability including deadhead miles (DHO/DHD). Don't settle for high gross if the fees file doesn't meet your margin goals." },
          ]}
          mockup={<ProfitMockup />}
        />
      </Container>
    </section>
  )
}
