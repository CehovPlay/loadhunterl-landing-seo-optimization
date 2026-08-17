import { Img } from "@/components/site/Img"
import { NewsletterForm } from "@/components/site/NewsletterForm"
import { SocialLinks } from "@/components/site/SocialLinks"
import {
  FOOTER_ECOSYSTEM,
  FOOTER_NAV,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_HREF,
  TRADEMARK_DISCLAIMER,
} from "@/content/copy"
import { Container } from "./ui"

/**
 * Footer on the flow layout — same information architecture as the desktop
 * footer (LH-047..051): brand + contacts + newsletter, the four approved link
 * columns, the quiet Ecosystem group, the trademark disclaimer, then the
 * bottom row. Content parity with desktop is a QA-005 requirement, so the link
 * lists come from the same module.
 */
const linkCls =
  "text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"

export function MobileFooter() {
  return (
    <footer id="site-footer" className="bg-gray-800 pb-10 pt-4" data-no-reveal>
      <Container>
        <div className="h-px w-full bg-gray-650" />

        <div className="flex flex-col gap-10 pt-8 md:flex-row md:items-start md:justify-between">
          <div className="md:w-[340px] md:shrink-0">
            <a href="/" className="flex items-center justify-center gap-2 md:justify-start">
              <Img src="/figma/tail/logo-icon-white.svg" alt="" className="h-6 w-6" />
              <Img
                src="/figma/tail/logo-text-white.svg"
                alt="LoadHunter"
                className="h-[17px] w-[105px]"
              />
            </a>

            {/* LH-049 */}
            <address className="mt-6 flex flex-col items-center gap-1.5 not-italic md:items-start">
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
            <NewsletterForm className="mt-8 text-center md:text-left" />
          </div>

          {/* LH-047 / LH-048 */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 md:flex md:flex-1 md:justify-between md:gap-6"
          >
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <h2 className="text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-white">
                  {group.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
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

        {/* LH-010 — quiet ecosystem group */}
        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <h2 className="text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-[rgba(255,255,255,0.45)]">
            {FOOTER_ECOSYSTEM.title}
          </h2>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {FOOTER_ECOSYSTEM.links.map((l) => (
              <li key={l.label}>
                {"upcoming" in l && l.upcoming ? (
                  <span className="flex items-center gap-1.5 text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.4)]">
                    {l.label}
                    <span className="rounded-full border border-[rgba(255,255,255,0.18)] px-1.5 py-px text-[11px] leading-[14px]">
                      Coming soon
                    </span>
                  </span>
                ) : (
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* LH-050 */}
        <p className="mt-8 text-[12px] font-medium leading-[18px] text-[rgba(255,255,255,0.5)]">
          {TRADEMARK_DISCLAIMER}
        </p>

        <div className="mt-8 h-px w-full bg-gray-650" />

        {/* bottom row — stacked on phone, one row on tablet */}
        <div className="flex flex-col items-center gap-4 pt-6 text-center md:relative md:flex-row md:justify-between md:gap-3 md:text-left">
          <span className="whitespace-nowrap text-[12px] font-medium leading-[15px] tracking-[-0.48px] text-[rgba(255,255,255,0.45)] max-md:order-1">
            © 2026 LoadHunter. All rights reserved.
          </span>
          <div className="max-md:order-2 md:absolute md:left-1/2 md:-translate-x-1/2">
            <SocialLinks />
          </div>
          <div className="flex items-center gap-5 text-[12px] font-medium leading-[15px] tracking-[-0.48px] text-[rgba(255,255,255,0.45)] max-md:order-3">
            <a href="/privacy.html" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms.html" className="transition-colors hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
