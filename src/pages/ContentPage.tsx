import type { PageContent } from "@/content/pages"
import { track } from "@/lib/analytics"
import { APP_URL, CHROME_STORE_URL } from "@/sections/Navbar"
import { Breadcrumbs, PageShell } from "./PageShell"

/**
 * The template behind WEB-001..005 and the Security page (LH-070).
 *
 * Every instance gets its own H1, intro, sections and FAQ from
 * `src/content/pages.ts` — the template supplies structure only, so no two
 * pages share body copy and none of them duplicates the homepage.
 */
export function ContentPage({ page }: { page: PageContent }) {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: page.h1 }]} />

      <h1 className="text-[clamp(30px,6vw,44px)] font-medium leading-[1.15] tracking-[-0.03em] text-ink">
        {page.h1}
      </h1>
      <p className="mt-6 text-[18px] font-medium leading-[28px] tracking-[-0.02em] text-ink/75">
        {page.intro}
      </p>

      {page.sections.map((s) => (
        <section key={s.h2} className="mt-12">
          <h2 className="text-[24px] font-medium leading-[32px] tracking-[-0.02em] text-ink">
            {s.h2}
          </h2>
          <p className="mt-4 text-[16px] font-medium leading-[26px] tracking-[-0.01em] text-ink/75">
            {s.body}
          </p>
          {s.bullets && (
            <ul className="mt-5 flex flex-col gap-3">
              {s.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-violet"
                    fill="currentColor"
                  >
                    <path d="M9.6 16.2 5.4 12l1.4-1.4 2.8 2.8 7.6-7.6L18.6 7 9.6 16.2z" />
                  </svg>
                  <span className="text-[16px] font-medium leading-[26px] tracking-[-0.01em] text-ink/85">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {page.faq && (
        <section className="mt-14">
          <h2 className="text-[24px] font-medium leading-[32px] tracking-[-0.02em] text-ink">
            Frequently asked
          </h2>
          <dl className="mt-6 flex flex-col gap-6">
            {page.faq.map((f) => (
              <div key={f.q}>
                <dt className="text-[17px] font-medium leading-[26px] tracking-[-0.02em] text-ink">
                  {f.q}
                </dt>
                <dd className="mt-2 text-[16px] font-medium leading-[26px] tracking-[-0.01em] text-ink/75">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* internal linking — every SEO page passes weight on to its siblings */}
      <section className="mt-14 rounded-lg border border-border-light bg-white p-6">
        <h2 className="text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-ink">
          Related
        </h2>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {page.related.map((r) => (
            <li key={r.href + r.label}>
              <a
                href={r.href}
                className="text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-violet underline underline-offset-2"
              >
                {r.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-lg bg-violet px-6 py-8 text-white">
        <h2 className="text-[24px] font-medium leading-[32px] tracking-[-0.02em]">
          {page.ctaHeading}
        </h2>
        <p className="mt-3 text-[15px] font-medium leading-[22px] text-white/85">
          14-day free trial. No credit card required.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener"
            onClick={() => track("final_trial_click", { page: page.path })}
            className="inline-flex h-[48px] items-center rounded-full bg-white px-6 text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-violet"
          >
            Start Your Free 14-Day Trial
          </a>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            onClick={() => track("final_chrome_click", { page: page.path })}
            className="inline-flex h-[48px] items-center rounded-full border border-white/70 px-6 text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-white"
          >
            Add to Chrome
          </a>
        </div>
      </section>
    </PageShell>
  )
}
