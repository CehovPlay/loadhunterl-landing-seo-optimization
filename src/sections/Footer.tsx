import { Img } from "@/components/site/Img"
/**
 * Compact footer (the Figma orbit-rings figure that used to fill the bottom
 * ~800px was removed on request): logo/subscribe row @ (120,120), full-bleed
 * separator @ y=191, links/socials row @ (120,224), gradient hairline @
 * y=274, © caption below. The section must NOT clip (the dividers bleed into
 * the >1920 gutters) and has no own bg — the root gray-800 shows through.
 * NOTE: no [content-visibility:auto] here — the 6000px-wide dividers
 * intentionally paint outside the section box, and the containment that
 * comes with content-visibility would clip them.
 */

const SOCIALS = ["/figma/tail/social-1.png", "/figma/tail/social-2.png", "/figma/tail/social-3.png"]
const SOCIAL_LABELS = ["Website", "X (Twitter)", "Telegram"]

export function Footer() {
  return (
    <footer id="token" className="relative h-[340px]">
      {/* © caption — the orbit-rings figure that used to fill the footer's
          bottom is gone; the footer is now compact */}
      <p className="absolute left-[848px] top-[300px] w-[224px] whitespace-nowrap text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
        © 2026 loadhunt Corp. All rights reserved.
      </p>

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
            alt="loadhunter"
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
            placeholder="Enter your e-mail address"
            className="h-[24px] w-[241px] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.05)] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] placeholder:text-ink-2 focus:outline-none"
          />
          <button className="flex h-[28px] items-center justify-center rounded-full border border-white bg-[#6f5197] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90">
            Subscribe
          </button>
        </form>
      </div>

      {/* full-bleed separator — spans the whole viewport, past the >1920
          gutters (the DesignFrame wrapper clips it at the window edge) */}
      <div className="absolute left-1/2 top-[191px] h-px w-[6000px] -translate-x-1/2 bg-[#33353a]" />

      {/* links + socials row */}
      <div className="absolute left-[120px] top-[224px] h-[18px] w-[1680px]">
        <div className="absolute left-0 top-0 flex h-full items-center gap-[32px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
          <a href="#" className="hover:text-gray-100">Privacy Policy</a>
          <a href="#" className="hover:text-gray-100">Terms of Service</a>
        </div>
        <div className="absolute right-0 top-0 flex h-full items-center gap-[4px]">
          {SOCIALS.map((src, i) => (
            <a key={src} href="#" aria-label={SOCIAL_LABELS[i]} className="block size-[18px]">
              <Img src={src} alt="" loading="lazy" decoding="async" className="size-[18px] max-w-none" />
            </a>
          ))}
        </div>
      </div>

      {/* gradient hairline — full viewport width */}
      <div
        className="absolute left-1/2 top-[274px] h-px w-[6000px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.268) 50%, rgba(255,255,255,0.03) 100%)",
        }}
      />
    </footer>
  )
}
