import type { Metadata } from "next"
import Link from "next/link"
import { CLAIM, FAQ, FAQ_INTRO, HUB, STATS } from "@/content/directory/copy"
import { listCities } from "@/content/directory/source"
import { BRAND } from "@/content/registry"
import { SampleBanner } from "@/components/directory/kit"
import { FaqList } from "@/components/system/FaqGrid"

/**
 * The directory hub.
 *
 * A surface the 47-tab specification does not describe - it is the Figma
 * "Trucking directory" section, added by the owner on 2026-08-20. It follows
 * the same rules as the rest of the site: copy from `content/directory/copy.ts`
 * rather than typed into the component, figures marked when they are not yet
 * sourced, and no control that pretends to work.
 *
 * §5.2 forbids nested addresses for products, articles, guides and tools. A
 * directory of tens of thousands of carriers is none of those, and root-level
 * company slugs would collide with every page on the site - which is exactly
 * what §5.2's collision registry exists to prevent. So the directory owns one
 * segment and nests inside it.
 */

export const metadata: Metadata = {
  title: "Trucking company directory - find, verify and rate carriers | LoadHunter",
  description: HUB.supporting,
  alternates: { canonical: "/trucking-directory" },
  openGraph: {
    type: "website",
    url: "/trucking-directory",
    siteName: BRAND.name,
    title: HUB.h1,
    description: HUB.supporting,
    images: [{ ...BRAND.socialImage, alt: `${BRAND.name} - ${BRAND.category}` }],
  },
}

export default async function TruckingDirectoryPage() {
  const cities = await listCities()

  return (
    <main id="main" className="bg-paper">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <section className="pt-16 pb-14 md:pt-24">
          <h1 className="max-w-[20ch] text-h2 text-ink">{HUB.h1}</h1>
          <p className="mt-4 max-w-[68ch] text-body text-ink-2">{HUB.supporting}</p>

          {/* One field, one verb. The search lands on the listing, which is a
              real page rather than a modal, so a result set can be linked. */}
          <form
            action="/trucking-directory/houston-tx"
            method="get"
            className="mt-8 flex w-full max-w-[560px] items-center gap-2"
            role="search"
          >
            <label htmlFor="directory-search" className="sr-only">
              {HUB.searchPlaceholder}
            </label>
            <input
              id="directory-search"
              name="q"
              type="search"
              placeholder={HUB.searchPlaceholder}
              className="h-11 flex-1 rounded-full border border-rule bg-paper-2 px-4 text-small text-ink placeholder:text-ink-4"
            />
            <button
              type="submit"
              className="flex h-11 shrink-0 items-center rounded-full bg-violet px-6 text-small font-medium text-white transition-opacity duration-150 hover:opacity-90"
            >
              {HUB.searchCta}
            </button>
          </form>

          {/* §3.6 - a count is a claim. Until the import produces it, the page
              says where the number will come from instead of asserting it. */}
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="text-meta text-ink-4">{stat.label}</dt>
                <dd className="font-mono text-h3 tabular-nums text-ink">{stat.value}</dd>
                {stat.unverified ? (
                  <p className="text-meta text-ink-4">Pending the FMCSA import</p>
                ) : null}
              </div>
            ))}
          </dl>

          <div className="mt-10 max-w-[720px]">
            <SampleBanner />
          </div>
        </section>

        <section className="border-t border-rule py-14 md:py-20">
          <h2 className="max-w-[24ch] text-h2 text-ink">{HUB.citiesH2}</h2>
          <p className="mt-4 max-w-[76ch] text-body text-ink-2">{HUB.citiesSupporting}</p>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/trucking-directory/${city.slug}`}
                  className="flex h-full flex-col justify-between rounded-card border border-rule bg-paper-2 px-4 py-4 transition-colors duration-150 hover:border-ink-4"
                >
                  <span className="text-body text-ink">
                    {city.name}, {city.state}
                  </span>
                  <span className="mt-1 font-mono text-meta tabular-nums text-ink-3">
                    {city.companies.toLocaleString("en-US")} companies
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-rule py-14 md:py-20">
          <div className="rounded-card-lg border border-rule bg-paper-2 px-6 py-10 md:px-12 md:py-14">
            <h2 className="max-w-[24ch] text-h3 text-ink">{CLAIM.title}</h2>
            <p className="mt-4 max-w-[62ch] text-body text-ink-2">{CLAIM.body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* The claim flow needs an authenticated owner and a verification
                  step, neither of which exists. §22.1 says a control that does
                  not work may not look like one that does. */}
              <span
                aria-disabled
                data-cta="pending"
                className="flex h-10 cursor-not-allowed items-center rounded-full border border-dashed border-rule px-5 text-small text-ink-3"
              >
                {CLAIM.primary}
                <span className="ml-2 text-meta text-ink-4">Not built</span>
              </span>
              <Link
                href="/contact"
                className="flex h-10 items-center rounded-full border border-rule px-5 text-small text-ink transition-colors duration-150 hover:border-ink-4"
              >
                {CLAIM.secondary}
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-rule py-14 md:py-20">
          <h2 className="text-h2 text-ink">{FAQ_INTRO.h2}</h2>
          <p className="mt-4 max-w-[76ch] text-body text-ink-2">{FAQ_INTRO.body}</p>
          <div className="mt-10">
            <FaqList items={FAQ} />
          </div>
        </section>
      </div>
    </main>
  )
}
