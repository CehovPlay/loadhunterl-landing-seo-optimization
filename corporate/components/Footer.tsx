import Link from "next/link"
import { FOOTER_ACCESS, SITE_INDEX } from "@/content/ia"
import { BRAND } from "@/content/registry"
import { CurrentLink } from "./nav/CurrentLink"
import { NewsletterForm } from "./NewsletterForm"
import { SocialLinks } from "./SocialLinks"

/**
 * Footer, in the shape the extension landing already ships: brand, contacts
 * and newsletter on the left, the approved link columns on the right, a quiet
 * row underneath, the trademark disclaimer, a full-bleed divider, then the
 * bottom bar with copyright, socials and legal links.
 *
 * It keeps the landing's dark surface. On a light page that is not a theme
 * switch, it is punctuation: TZ §25.1 makes the page one road, and §26.4 wants
 * the footer to close it rather than carry it further. The rail ends where the
 * paper does.
 *
 * Since the top bar was cut to five entries, this is also the site index:
 * every one of the 43 routes appears here exactly once, in the section it
 * belongs to, and `assertIndexCovers` fails the build if one goes missing. A
 * footer that lists a curated subset is how pages become unreachable.
 *
 * The product column is names only. Five products printing seven status lines
 * between them turned a link column into a ledger, and the reader was scanning
 * for a page, not auditing scope - §42.2's one line per scope is carried by the
 * products mega-menu and by each product page, where a status sits next to the
 * claim it qualifies.
 *
 * §5.4 and §26.4 set the contents: the five products, role solutions, resources, trust, legal, accessibility and status,
 * product login kept away from the marketing CTAs, and one line stating global
 * positioning, the first commercial region and the P0 language.
 */

const linkCls =
  "text-small text-night-ink-2 transition-colors duration-150 hover:text-night-ink"

export function Footer() {
  return (
    <footer className="bg-night">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        {/* Brand and reach on one line: with the index moved below, a single
            360px column left two thirds of the row empty. */}
        <div className="flex flex-col gap-12 pt-16 pb-12 md:pt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
          {/* brand, contacts, newsletter */}
          <div className="lg:w-[360px] lg:shrink-0">
            <Link href="/" className="flex items-center" aria-label="LoadHunter home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-icon-white.svg" alt="" width={24} height={24} className="size-6" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-text-white.svg"
                alt="LoadHunter"
                width={116}
                height={19}
                className="ml-2.5 h-[19px] w-[116px]"
              />
            </Link>

            <p className="mt-6 max-w-[38ch] text-small text-night-ink-2">{BRAND.statement}</p>

            <address className="mt-6 flex flex-col gap-1.5 not-italic">
              <a href={`mailto:${BRAND.contact.email}`} className={linkCls}>
                {BRAND.contact.email}
              </a>
              <a href={`tel:${BRAND.contact.phoneHref}`} className={linkCls}>
                {BRAND.contact.phone}
              </a>
              <span className="text-small text-night-ink-3">{BRAND.contact.region}</span>
            </address>

          </div>

          <NewsletterForm className="lg:w-[360px] lg:shrink-0" />
        </div>

        {/* The index. Everything the bar does not carry, which is most of it. */}
        <nav
          aria-label="Site index"
          className="columns-2 gap-x-6 border-t border-night-rule py-12 sm:columns-3 lg:columns-4 xl:columns-6"
        >
          {SITE_INDEX.map((column) => (
            <div key={column.title} className="mb-10 break-inside-avoid">
              <h2 className="text-small font-medium text-night-ink">{column.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.entries.map((entry) => (
                  <li key={entry.href + entry.title}>
                    <CurrentLink
                      href={entry.href}
                      label={entry.title}
                      className={"group block " + linkCls}
                      currentClassName="text-night-ink"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* quiet row: product access, deliberately not styled as a CTA */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pb-7">
          <h2 className="text-meta text-night-ink-3">{FOOTER_ACCESS.title}</h2>
          <Link
            href={FOOTER_ACCESS.href}
            className="text-meta text-night-ink-2 transition-colors duration-150 hover:text-night-ink"
          >
            {FOOTER_ACCESS.label}
          </Link>
          <span className="text-meta text-night-ink-3">{FOOTER_ACCESS.note}</span>
        </div>

        <p className="max-w-[110ch] pb-4 text-meta text-night-ink-3">{BRAND.trademarkDisclaimer}</p>
        <p className="max-w-[110ch] pb-8 text-meta text-night-ink-3">{BRAND.region}</p>
      </div>

      <div className="h-px w-full bg-night-rule" />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="relative flex flex-col items-start gap-6 pt-7 pb-14 lg:flex-row lg:items-center lg:justify-between">
          <span className="order-2 text-small text-night-ink-3 lg:order-1">{BRAND.copyright}</span>
          <div className="order-1 lg:absolute lg:left-1/2 lg:order-2 lg:-translate-x-1/2">
            <SocialLinks />
          </div>
          <div className="order-3 flex items-center gap-6 text-small text-night-ink-3">
            <Link href="/privacy" className="transition-colors duration-150 hover:text-night-ink">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-150 hover:text-night-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
