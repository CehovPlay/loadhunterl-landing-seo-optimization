/**
 * Compact footer: logo/subscribe row @ (120,120), a full-bleed divider
 * @ y=191 under it, and a bottom row (social icons left, © right) below the
 * divider. The section must NOT clip (the divider bleeds into the >1920
 * gutters) and has no own bg — the root gray-800 shows through.
 * NOTE: no [content-visibility:auto] here — the 6000px-wide divider
 * intentionally paints outside the section box, and the containment that
 * comes with content-visibility would clip it.
 * data-no-reveal: the rows sit in the bottom of the viewport at max scroll,
 * below the reveal IntersectionObserver's rootMargin — they would stay at
 * autoAlpha 0 forever if reveal-managed.
 */
import { SocialLinks } from "@/components/site/SocialLinks"

export function Footer() {
  return (
    <footer id="token" data-no-reveal className="relative h-[280px]">
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

      {/* full-bleed divider — spans the whole viewport, past the >1920
          gutters (the DesignFrame wrapper clips it at the window edge) */}
      <div className="absolute left-1/2 top-[191px] h-px w-[6000px] -translate-x-1/2 bg-gray-650" />

      {/* bottom row — socials left, copyright right */}
      <div className="absolute left-[120px] top-[219px] flex h-[24px] w-[1680px] items-center justify-between">
        <SocialLinks />
        <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[rgba(255,255,255,0.45)]">
          © 2026 LoadHunter. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
