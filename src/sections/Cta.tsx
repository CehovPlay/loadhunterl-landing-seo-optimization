import { Logo, LogoMark } from "@/components/site/Logo"
import { Globe, Mail, Settings2, MapPin, Phone, Star, Calculator } from "lucide-react"

const LEFT_NODES = [
  { Icon: Mail, top: "18%" },
  { Icon: Settings2, top: "50%" },
  { Icon: Phone, top: "82%" },
]
const RIGHT_NODES = [
  { Icon: MapPin, top: "18%" },
  { Icon: Star, top: "50%" },
  { Icon: Calculator, top: "82%" },
]

export function Cta() {
  return (
    <section id="start" className="bg-[#18191f] px-[120px] py-[100px]">
      <div className="mx-auto grid max-w-[1680px] grid-cols-[minmax(0,560px)_1fr] overflow-hidden rounded-[24px] border border-[#ffffff14]">
        {/* left — violet card */}
        <div className="relative flex min-h-[560px] flex-col justify-between bg-[linear-gradient(150deg,#7a5ca6_0%,#574380_45%,#2b2640_100%)] p-10">
          <Logo />
          <div>
            <h2 className="text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-white">
              Start your experience
              <br />
              with LoadHunter
            </h2>
            <p className="mt-3 max-w-[360px] text-[12px] leading-[18px] tracking-[-0.48px] text-white/70">
              Search loads with efficiency and speed you never had before.
              LoadHunter: AI-powered tool.
            </p>
            <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-medium tracking-[-0.56px] text-[#454545] transition-opacity hover:opacity-90">
              <Globe className="size-4" />
              Add to Chrome
            </button>
          </div>
        </div>

        {/* right — automation diagram */}
        <div className="relative min-h-[560px] overflow-hidden bg-[#18191f]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(156,102,229,0.14),transparent_55%)]"
          />
          {/* connectors */}
          <svg className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 560">
            {[100, 280, 460].map((y, i) => (
              <path key={`l${i}`} d={`M250 ${y} C 360 ${y}, 380 280, 430 280`} stroke="#ffffff18" strokeWidth="1" />
            ))}
            {[100, 280, 460].map((y, i) => (
              <path key={`r${i}`} d={`M750 ${y} C 640 ${y}, 620 280, 570 280`} stroke="#ffffff18" strokeWidth="1" />
            ))}
          </svg>

          {/* nodes */}
          <div className="absolute left-[20%] top-0 h-full w-px">
            {LEFT_NODES.map(({ Icon, top }, i) => (
              <span key={i} style={{ top }} className="absolute -translate-x-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full border border-[#ffffff1a] bg-[#1d1f24] text-[#a3a4a6] shadow-lg shadow-black/40">
                <Icon className="size-4" />
              </span>
            ))}
          </div>
          <div className="absolute left-[80%] top-0 h-full w-px">
            {RIGHT_NODES.map(({ Icon, top }, i) => (
              <span key={i} style={{ top }} className="absolute -translate-x-1/2 -translate-y-1/2 flex size-11 items-center justify-center rounded-full border border-[#ffffff1a] bg-[#1d1f24] text-[#a3a4a6] shadow-lg shadow-black/40">
                <Icon className="size-4" />
              </span>
            ))}
          </div>

          {/* center */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span className="flex size-14 items-center justify-center rounded-full border border-[#ffffff26] bg-[#1d1f24] text-[#e8e8e8] shadow-xl shadow-black/60">
              <LogoMark className="size-6" />
            </span>
            <p className="mt-4 text-[20px] font-medium tracking-[-0.8px] text-[#e8e8e8]">
              One click automation
            </p>
            <p className="mt-1 text-[12px] tracking-[-0.48px] text-[#686b6f]">
              Book faster. Miss less. Earn more.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
