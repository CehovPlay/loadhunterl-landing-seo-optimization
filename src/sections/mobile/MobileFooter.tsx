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
        <div className="h-px w-full bg-gray-650" />
        <div className="flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2">
              <Img src="/figma/tail/logo-icon-white.svg" alt="" className="h-6 w-6" />
              <Img src="/figma/tail/logo-text-white.svg" alt="LoadHunter" className="h-[17px] w-[105px]" />
            </div>
            {/* social icons — muted gray, brighten on hover */}
            <div className="flex items-center gap-4 text-[rgba(255,255,255,0.45)]">
              <a
                href="https://t.me/loadhunterextension"
                target="_blank"
                rel="noopener"
                aria-label="LoadHunter on Telegram"
                className="transition-colors hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M9.04 15.51l-.38 5.36c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.66.25 1.92-.9L22.9 4.6c.31-1.42-.51-1.98-1.45-1.63L3.36 9.94c-1.38.54-1.36 1.31-.24 1.66l4.62 1.44L18.5 6.28c.5-.33.96-.15.58.18L9.04 15.51z" />
                </svg>
              </a>
              {/* TODO: real LinkedIn URL when the page exists */}
              <a
                href="#"
                aria-label="LoadHunter on LinkedIn"
                className="transition-colors hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
              </a>
            </div>
          </div>
          <form
            className="flex h-12 items-center gap-1 rounded-full border border-line-strong bg-gray-750 p-1 pl-4 md:w-[400px]"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              aria-label="Email address"
              placeholder="Enter your email address"
              className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-dark-text placeholder:text-placeholder focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-10 shrink-0 items-center justify-center rounded-full bg-violet px-5 text-[14px] font-medium text-white transition-transform active:scale-[0.98]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </footer>
  )
}
