import { Logo, LogoMark } from "@/components/site/Logo"
import { Globe, AtSign, Send } from "lucide-react"

export function Footer() {
  return (
    <footer id="token" className="bg-[#18191f] px-[120px]">
      {/* subscribe row */}
      <div className="flex items-center justify-between border-t border-[#ffffff14] py-7">
        <Logo className="text-[18px]" />
        <form className="flex items-center gap-2">
          <input
            type="email"
            aria-label="Email address"
            placeholder="Enter your e-mail address"
            className="h-10 w-[300px] rounded-full border border-[#ffffff14] bg-[#1d1f24] px-4 text-[13px] text-[#e8e8e8] placeholder:text-[#686b6f] focus:border-[#ffffff26]"
          />
          <button className="h-10 rounded-full bg-violet-600 px-5 text-[13px] font-medium text-white transition-opacity hover:opacity-90">
            Subscribe
          </button>
        </form>
      </div>

      {/* links row */}
      <div className="flex items-center justify-between border-t border-[#ffffff14] py-4">
        <div className="flex gap-6 text-[12px] text-[#8c8d8f]">
          <a href="#" className="hover:text-[#e8e8e8]">Privacy Policy</a>
          <a href="#" className="hover:text-[#e8e8e8]">Terms of Service</a>
        </div>
        <div className="flex gap-2">
          {[
            { Icon: Globe, label: "Website" },
            { Icon: AtSign, label: "X (Twitter)" },
            { Icon: Send, label: "Telegram" },
          ].map(({ Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="flex size-8 items-center justify-center rounded-md border border-[#ffffff14] bg-[#1d1f24] text-[#8c8d8f] hover:text-[#e8e8e8]"
            >
              <Icon className="size-3.5" />
            </a>
          ))}
        </div>
      </div>

      {/* big mark area */}
      <div className="relative h-[860px] overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[120px] -translate-x-1/2">
          {[400, 700, 1000, 1320].map((d) => (
            <div
              key={d}
              style={{ width: d, height: d }}
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full border border-[#ffffff0d]"
            />
          ))}
        </div>
        <div className="relative flex flex-col items-center pt-[200px]">
          <LogoMark className="size-14 text-[#e8e8e8]" />
        </div>
        <p className="absolute bottom-[40px] left-1/2 -translate-x-1/2 text-[12px] text-[#686b6f]">
          © 2026 loadhunt Corp. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
