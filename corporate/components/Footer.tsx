import Link from "next/link"
import {
  CONTACT,
  COPYRIGHT,
  FOOTER_ACCESS,
  FOOTER_NAV,
  FOOTER_REGION,
  FOOTER_STATEMENT,
  PRODUCTS,
  TRADEMARK_DISCLAIMER,
  type StatusEntry,
  type StatusTerm,
} from "@/content/home"
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
 * §5.4 and §26.4 set the contents: the five products with their current
 * statuses, role solutions, resources, trust, legal, accessibility and status,
 * product login kept away from the marketing CTAs, and one line stating global
 * positioning, the first commercial region and the P0 language.
 */

/* The same three meanings as on paper, re-taken at values that clear AA on
   #121317. §42.2 still applies down here: one line per scope, never one chip
   per product. */
const TONE: Record<StatusTerm, string> = {
  Live: "text-live-night before:bg-live-night",
  Beta: "text-preview-night before:bg-preview-night",
  Preview: "text-preview-night before:bg-preview-night",
  "In Progress": "text-progress-night before:bg-progress-night",
  Planned: "text-night-ink-3 before:bg-night-ink-3",
  Deprecated: "text-night-ink-3 before:bg-night-ink-3",
}

/** Statuses per product, read from the ledger the whole page reads from. */
const STATUS = Object.fromEntries(
  PRODUCTS.map((product) => [product.name, product.statuses]),
) as Record<string, readonly StatusEntry[]>

const linkCls =
  "text-small text-night-ink-2 transition-colors duration-150 hover:text-night-ink"

export function Footer() {
  return (
    <footer className="bg-night">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col gap-14 pt-16 pb-12 md:pt-24 lg:flex-row lg:gap-20">
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

            <p className="mt-6 max-w-[38ch] text-small text-night-ink-2">{FOOTER_STATEMENT}</p>

            <address className="mt-6 flex flex-col gap-1.5 not-italic">
              <a href={`mailto:${CONTACT.email}`} className={linkCls}>
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phoneHref}`} className={linkCls}>
                {CONTACT.phone}
              </a>
              <span className="text-small text-night-ink-3">{CONTACT.region}</span>
            </address>

            <NewsletterForm className="mt-8" />
          </div>

          {/* link columns */}
          <nav
            aria-label="Footer"
            className="grid flex-1 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-5"
          >
            {FOOTER_NAV.map((group) => (
              <div key={group.title}>
                <h2 className="text-small font-medium text-night-ink">{group.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => {
                    const statuses = STATUS[link.label]
                    return (
                      <li key={link.href + link.label}>
                        <Link href={link.href} className={"group block " + linkCls}>
                          {link.label}
                          {statuses?.map((status) => (
                            <span
                              key={status.term + status.scope}
                              className={
                                "mt-0.5 flex items-start gap-1.5 text-meta " +
                                "before:mt-[5px] before:block before:size-[5px] before:shrink-0 before:rounded-full " +
                                TONE[status.term]
                              }
                            >
                              {status.scope}: {status.term}
                            </span>
                          ))}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

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

        <p className="max-w-[110ch] pb-4 text-meta text-night-ink-3">{TRADEMARK_DISCLAIMER}</p>
        <p className="max-w-[110ch] pb-8 text-meta text-night-ink-3">{FOOTER_REGION}</p>
      </div>

      <div className="h-px w-full bg-night-rule" />

      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="relative flex flex-col items-start gap-6 pt-7 pb-14 lg:flex-row lg:items-center lg:justify-between">
          <span className="order-2 text-small text-night-ink-3 lg:order-1">{COPYRIGHT}</span>
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
