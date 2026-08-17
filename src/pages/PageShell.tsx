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
import { track } from "@/lib/analytics"
import { APP_URL, LINKS } from "@/sections/Navbar"

/**
 * Shell for the standalone content routes (/faq/, /security/, /blog/ and the
 * five SEO landing pages).
 *
 * These pages are flow-responsive at every width — they are NOT rendered on the
 * 1920 canvas. Marketing surfaces beyond the homepage therefore already satisfy
 * LH-015 (content-driven height) and LH-068 (one tree, no desktop/mobile
 * content fork).
 */

const footerLink =
  "text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[rgba(255,255,255,0.55)] transition-colors hover:text-white"

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-light bg-bg-light/90 backdrop-blur-md">
      <div className="mx-auto flex h-[64px] w-full max-w-[1280px] items-center gap-6 px-5 md:px-8">
        <a href="/" className="flex shrink-0 items-center gap-2" aria-label="LoadHunter home">
          <img src="/figma/logo-icon.svg" alt="" width={28} height={26} />
          <img src="/figma/logo-text.svg" alt="LoadHunter" width={97} height={16} />
        </a>
        <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={l.event ? () => track(l.event!) : undefined}
              className="whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-ink transition-colors hover:bg-black/[0.04]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener"
          onClick={() => track("hero_trial_click", { placement: "header" })}
          className="ml-auto flex h-[40px] shrink-0 items-center rounded-full bg-violet px-5 text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-white"
        >
          Start free trial
        </a>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-800 pb-10 pt-14 text-dark-text">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="md:w-[340px] md:shrink-0">
            <a href="/" className="flex items-center gap-2">
              <img src="/figma/tail/logo-icon-white.svg" alt="" width={24} height={24} />
              <img
                src="/figma/tail/logo-text-white.svg"
                alt="LoadHunter"
                width={116}
                height={19}
              />
            </a>
            <address className="mt-6 flex flex-col gap-1.5 not-italic">
              <a href={`mailto:${SUPPORT_EMAIL}`} className={footerLink}>
                {SUPPORT_EMAIL}
              </a>
              <a href={`tel:${SUPPORT_PHONE_HREF}`} className={footerLink}>
                {SUPPORT_PHONE}
              </a>
              <span className="text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-[rgba(255,255,255,0.45)]">
                United States
              </span>
            </address>
            <NewsletterForm className="mt-8" />
          </div>

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
                        className={footerLink}
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
                    <span className="rounded-full border border-[rgba(255,255,255,0.18)] px-1.5 py-px text-[11px] leading-4">
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

        <p className="mt-8 max-w-[1000px] text-[12px] font-medium leading-[18px] text-[rgba(255,255,255,0.5)]">
          {TRADEMARK_DISCLAIMER}
        </p>

        <div className="mt-8 h-px w-full bg-gray-650" />

        <div className="flex flex-col items-center gap-4 pt-6 text-center md:relative md:flex-row md:justify-between md:text-left">
          <span className="text-[12px] font-medium leading-[15px] tracking-[-0.48px] text-[rgba(255,255,255,0.45)] max-md:order-1">
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
      </div>
    </footer>
  )
}

/** LH-072 — breadcrumbs on every non-home route. */
export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] font-medium leading-[18px] text-ink/60">
        <li>
          <a href="/" className="transition-colors hover:text-ink">
            Home
          </a>
        </li>
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {t.href && i < trail.length - 1 ? (
              <a href={t.href} className="transition-colors hover:text-ink">
                {t.label}
              </a>
            ) : (
              <span aria-current="page" className="text-ink">
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-light">
      <Header />
      <main className="mx-auto w-full max-w-[860px] px-5 py-12 md:px-8 md:py-16">{children}</main>
      <Footer />
    </div>
  )
}
