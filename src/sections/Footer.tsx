import { Container } from "@/components/site/Container"
import { Logo, LogoMark } from "@/components/site/Logo"
import { Globe, AtSign, Send } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900">
      <Container>
        {/* subscribe row */}
        <div className="flex flex-col gap-5 border-t border-line py-8 md:flex-row md:items-center md:justify-between">
          <Logo />
          <form className="flex w-full max-w-sm items-center gap-2">
            <input
              type="email"
              placeholder="Enter your e-mail address"
              className="h-10 flex-1 rounded-full border border-line bg-gray-800 px-4 text-small text-dark-text placeholder:text-gray-400 focus:border-line-strong focus:outline-none"
            />
            <button className="h-10 shrink-0 rounded-full bg-violet-600 px-5 text-small font-medium text-white transition-opacity hover:opacity-90">
              Subscribe
            </button>
          </form>
        </div>

        {/* links row */}
        <div className="flex flex-col gap-4 border-t border-line py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-6 text-subtle text-gray-300">
            <a href="#" className="hover:text-dark-text">Privacy Policy</a>
            <a href="#" className="hover:text-dark-text">Terms of Service</a>
          </div>
          <div className="flex gap-2">
            {[Globe, AtSign, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex size-8 items-center justify-center rounded-md border border-line bg-gray-800 text-gray-300 hover:text-dark-text"
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </Container>

      {/* big mark */}
      <div className="relative h-[340px] overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
          {[400, 640, 900].map((d) => (
            <div
              key={d}
              style={{ width: d, height: d }}
              className="absolute left-1/2 top-10 -translate-x-1/2 rounded-full border border-line"
            />
          ))}
        </div>
        <div className="relative flex flex-col items-center pt-10">
          <LogoMark className="size-12 text-dark-text" />
          <p className="absolute bottom-8 text-subtle text-gray-400">
            © 2026 loadhunt Corp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
