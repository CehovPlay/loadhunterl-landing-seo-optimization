/**
 * Compact footer: logo/subscribe row @ (120,120) and a full-bleed separator
 * @ y=191 — the page ends there (links/socials, hairline and © were removed
 * on request). The section must NOT clip (the divider bleeds into the >1920
 * gutters) and has no own bg — the root gray-800 shows through.
 * NOTE: no [content-visibility:auto] here — the 6000px-wide divider
 * intentionally paints outside the section box, and the containment that
 * comes with content-visibility would clip it.
 * data-no-reveal: the row sits in the bottom 6% of the viewport at max
 * scroll, below the reveal IntersectionObserver's rootMargin — it would
 * stay at autoAlpha 0 forever if reveal-managed.
 */

export function Footer() {
  return (
    <footer id="token" data-no-reveal className="relative h-[192px]">
      {/* logo + subscribe row */}
      <div className="absolute left-[120px] top-[120px] h-[40px] w-[1680px]">
        <div className="absolute left-0 top-[8px] h-[24px] w-[151px]">
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-icon-white.svg"
            alt=""
            className="absolute left-0 top-0 size-[24px] max-w-none"
          />
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-text-white.svg"
            alt="LoadHunter"
            className="absolute left-[34px] top-[2.56px] h-[18.88px] w-[116.44px] max-w-none"
          />
        </div>

        {/* social icons — muted gray, brighten on hover */}
        <div className="absolute left-[220px] top-[10px] flex items-center gap-[16px] text-[rgba(255,255,255,0.45)]">
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

        <form
          className="absolute right-0 top-0 flex h-[40px] items-center gap-[6px] rounded-full bg-[rgba(54,56,61,0.5)] py-[6px] pl-[8px] pr-[6px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            aria-label="Email address"
            placeholder="Enter your email address"
            className="h-[24px] w-[241px] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.05)] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-pill placeholder:text-ink-2 focus:outline-none"
          />
          <button className="flex h-[28px] items-center justify-center rounded-full border border-white bg-violet px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-pill transition-opacity hover:opacity-90">
            Subscribe
          </button>
        </form>
      </div>

      {/* full-bleed separator — spans the whole viewport, past the >1920
          gutters (the DesignFrame wrapper clips it at the window edge) */}
      <div className="absolute left-1/2 top-[191px] h-px w-[6000px] -translate-x-1/2 bg-gray-650" />
    </footer>
  )
}
