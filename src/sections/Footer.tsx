/**
 * Footer, rebuilt for LH-047..051.
 *
 * Structure: brand + contacts + newsletter on the left, the four approved link
 * columns (Product / Solutions / Resources / Company) on the right, a quiet
 * Ecosystem row underneath (LH-010 moved huntTMS/huntPAY/huntDRIVE/huntOS and
 * $LHUNT out of the header), the trademark independence disclaimer (LH-050),
 * then a full-bleed divider and the bottom row.
 *
 * The section must NOT clip: the divider bleeds into the >1920 gutters.
 * NOTE: no [content-visibility:auto] here — the 6000px-wide divider
 * intentionally paints outside the section box, and the containment that comes
 * with content-visibility would clip it.
 * data-no-reveal: these rows sit at max scroll, below the reveal observer's
 * rootMargin, and would stay at autoAlpha 0 forever if reveal-managed.
 */
import { SocialLinks } from "@/components/site/SocialLinks"
import {
  FOOTER_ECOSYSTEM,
  FOOTER_NAV,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
  TRADEMARK_DISCLAIMER,
} from "@/content/copy"
import { NewsletterForm } from "@/components/site/NewsletterForm"

const linkCls =
  "text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"

export function Footer() {
  return (
    <footer id="site-footer" data-no-reveal className="relative">
      <div className="flex gap-[80px] px-[120px] pb-[60px] pt-[96px]">
        {/* brand + contacts + newsletter */}
        <div className="w-[440px] shrink-0">
          <a href="/" className="flex h-[24px] w-[151px] items-center">
            <img
              loading="lazy"
              decoding="async"
              src="/figma/tail/logo-icon-white.svg"
              alt=""
              className="size-[24px] max-w-none"
            />
            <img
              loading="lazy"
              decoding="async"
              src="/figma/tail/logo-text-white.svg"
              alt="LoadHunter"
              className="ml-[10px] h-[18.88px] w-[116.44px] max-w-none"
            />
          </a>

          {/* LH-049 — public contacts, both clickable */}
          <address className="mt-[24px] flex flex-col gap-[6px] not-italic">
            <a href={`mailto:${SUPPORT_EMAIL}`} className={linkCls}>
              {SUPPORT_EMAIL}
            </a>
            <a href={`tel:${SUPPORT_PHONE_HREF}`} className={linkCls}>
              {SUPPORT_PHONE}
            </a>
            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[rgba(255,255,255,0.45)]">
              United States
            </span>
          </address>

          {/* LH-051 / LH-069 */}
          <NewsletterForm className="mt-[32px]" />
        </div>

        {/* LH-047 / LH-048 — four link columns, max 6 links each */}
        <nav aria-label="Footer" className="flex flex-1 justify-between gap-[40px]">
          {FOOTER_NAV.map((group) => (
            <div key={group.title} className="min-w-[160px]">
              <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-white">
                {group.title}
              </h2>
              <ul className="mt-[16px] flex flex-col gap-[10px]">
                {group.links.map((l) => (
                  <li key={l.label + l.href}>
                    <a
                      href={l.href}
                      {...("external" in l && l.external
                        ? { target: "_blank", rel: "noopener" }
                        : {})}
                      className={linkCls}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* LH-010 — quiet ecosystem group, upcoming products marked */}
      <div className="flex items-center gap-[16px] px-[120px] pb-[28px]">
        <h2 className="text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-[rgba(255,255,255,0.45)]">
          {FOOTER_ECOSYSTEM.title}
        </h2>
        <ul className="flex flex-wrap items-center gap-x-[20px] gap-y-[8px]">
          {FOOTER_ECOSYSTEM.links.map((l) => (
            <li key={l.label}>
              {"upcoming" in l && l.upcoming ? (
                <span className="flex items-center gap-[6px] text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-[rgba(255,255,255,0.4)]">
                  {l.label}
                  <span className="rounded-full border border-[rgba(255,255,255,0.18)] px-[6px] py-px text-[11px] leading-[14px]">
                    Coming soon
                  </span>
                </span>
              ) : (
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener"
                  className="text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* LH-050 — trademark independence, readable (not hidden) */}
      <p className="max-w-[1200px] px-[120px] pb-[32px] text-[13px] font-medium leading-[19px] tracking-[-0.01em] text-[rgba(255,255,255,0.5)]">
        {TRADEMARK_DISCLAIMER}
      </p>

      {/* full-bleed divider — spans the whole viewport, past the >1920 gutters
          (the DesignFrame wrapper clips it at the window edge) */}
      <div className="relative h-px">
        <div className="absolute left-1/2 top-0 h-px w-[6000px] -translate-x-1/2 bg-gray-650" />
      </div>

      {/* bottom row — copyright left, socials centred, legal links right */}
      <div className="relative flex h-[24px] items-center justify-between px-[120px] pb-[60px] pt-[28px]">
        <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[rgba(255,255,255,0.45)]">
          © 2026 LoadHunter. All rights reserved.
        </span>
        <div className="absolute left-1/2 -translate-x-1/2">
          <SocialLinks />
        </div>
        <div className="flex items-center gap-[24px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[rgba(255,255,255,0.45)]">
          <a href="/privacy.html" className="transition-colors hover:text-white">
            Privacy Policy
          </a>
          <a href="/terms.html" className="transition-colors hover:text-white">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  )
}
