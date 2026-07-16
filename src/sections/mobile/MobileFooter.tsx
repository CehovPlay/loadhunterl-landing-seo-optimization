import { Img } from "@/components/site/Img"
import { Container } from "./ui"

/**
 * Mobile footer: logo + email subscribe stacked. Inputs and the button are
 * 48px tall; email keyboard via type/inputMode/autoComplete.
 */
export function MobileFooter() {
  return (
    <footer id="token" className="bg-gray-800 pb-10 pt-4" data-no-reveal>
      <Container>
        <div className="h-px w-full bg-[#33353a]" />
        <div className="flex flex-col gap-6 pt-8">
          <div className="flex items-center gap-2">
            <Img src="/figma/tail/logo-icon-white.svg" alt="" className="h-6 w-6" />
            <Img src="/figma/tail/logo-text-white.svg" alt="loadhunter" className="h-[17px] w-[105px]" />
          </div>
          <form
            className="flex h-12 items-center gap-1 rounded-full border border-line-strong bg-gray-750 p-1 pl-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label="Email address"
              placeholder="Enter your e-mail address"
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-dark-text placeholder:text-placeholder focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-10 shrink-0 items-center justify-center rounded-full bg-[#6f5197] px-5 text-[14px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </footer>
  )
}
