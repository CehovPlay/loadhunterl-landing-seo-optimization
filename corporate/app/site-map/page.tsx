import type { Metadata } from "next"
import Link from "next/link"
import { ART, artFor } from "@/content/art"
import { DETAIL_ROUTES } from "@/content/routes"
import { NOINDEX, PAGES, TEMPLATES } from "@/content/tz"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Motif } from "@/components/system/Motif"
import { SectionHead } from "@/components/system/SectionHead"

/**
 * How the site assembles. A review surface, not a page of the site.
 *
 * 47 skeletons are only useful if you can see them as one thing: which route
 * exists, what shape each page is, where the inversion lands, which motif
 * carries which product. Reading that out of 47 files is not review, so it is
 * printed here instead.
 *
 * This route is not in the URL registry and must not ship. It is noindex and
 * absent from the sitemap; delete `app/site-map` before launch.
 */
export const metadata: Metadata = {
  title: "Site map — build review",
  robots: { index: false, follow: false },
}

const HERO_NOTE: Record<string, string> = {
  cosmic: "Centred over the dust field",
  split: "Copy left, proof right",
  statement: "Word-by-word statement",
  field: "Full-bleed art field",
  plain: "Narrow and quiet",
}

const GROUPS: { name: string; note: string; nums: number[] }[] = [
  { name: "Ecosystem", note: "The whole operation, before any single product.", nums: [1, 2, 43] },
  { name: "Products", note: "Five products. Each one gets its own motif.", nums: [3, 4, 5, 6, 7, 8, 44] },
  { name: "Solutions", note: "Entered by what hurts, not by what we sell.", nums: [9, 10, 11, 12, 13] },
  { name: "Roles", note: "The same operation, seen from one seat.", nums: [14, 15, 16, 17, 18] },
  { name: "Commercial", note: "Price, fit and integration.", nums: [19, 20, 27] },
  { name: "Proof", note: "Evidence, filtered by operating reality.", nums: [21, 22] },
  { name: "Resources", note: "Libraries. The rail archetype carries these.", nums: [23, 24, 25, 26] },
  { name: "Trust", note: "Inspectable before the sales call.", nums: [28, 29, 30, 45] },
  { name: "Company", note: "Story, people, press, contact.", nums: [31, 32, 33, 34, 35, 46] },
  { name: "Legal", note: "No motif, no proof slot, no ornament.", nums: [36, 37, 38] },
  { name: "Utility", note: "Error, sign-in and the generated templates.", nums: [39, 47, 40, 41, 42] },
]

export default function SiteMapPage() {
  const covered = new Set(GROUPS.flatMap((g) => g.nums))
  const missing = PAGES.filter((p) => !covered.has(p.num))

  return (
    <>
      <Header />
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[1400px] px-5 md:px-10">
        <main id="main" className="pt-32 pb-24 md:pt-44">
          <p className="text-meta tracking-[0.06em] text-ink-3">Build review</p>
          <h1 className="display-hero mt-6 max-w-[18ch] text-balance">
            47 pages, one system.
          </h1>
          <p className="mt-7 max-w-[62ch] text-lead text-ink-2">
            Every route below is generated from its tab in the specification and rendered
            through the shared block archetypes. The rhythm column is the page&rsquo;s own:
            one archetype per specified block, in document order.
          </p>

          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-card border border-rule bg-rule sm:grid-cols-4">
            {[
              ["Pages", String(PAGES.length)],
              ["Blocks", String(PAGES.reduce((n, p) => n + p.blocks.length, 0))],
              ["Questions", String(PAGES.reduce((n, p) => n + p.faq.length, 0))],
              ["Archetypes", "13"],
            ].map(([term, value]) => (
              <div key={term} className="bg-paper-2 p-5">
                <dt className="text-meta tracking-[0.06em] text-ink-3">{term}</dt>
                <dd className="figures mt-2 text-h3 text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          {GROUPS.map((group) => (
            <section key={group.name} className="pt-20 md:pt-28">
              <SectionHead
                label={group.name}
                title={group.note}
                supporting={`${group.nums.length} ${group.nums.length === 1 ? "page" : "pages"}`}
              />
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {group.nums.map((num) => {
                  const page = PAGES.find((p) => p.num === num)
                  if (!page) return null
                  const art = artFor(num)
                  const template = TEMPLATES.has(page.url)
                  const href = template
                    ? `/${DETAIL_ROUTES.find((r) => r.template === num)?.slug ?? ""}`
                    : page.url

                  return (
                    <article
                      key={num}
                      className="relative overflow-hidden rounded-card border border-rule bg-paper-2 p-6 shadow-[var(--shadow-lift)]"
                    >
                      <Motif
                        kind={art.motif}
                        className="pointer-events-none absolute -right-8 -bottom-10 size-40 opacity-25"
                      />
                      <div className="relative">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="figures text-meta text-ink-4">
                            {String(num).padStart(2, "0")}
                          </span>
                          <span className="text-meta text-ink-4">{art.motif}</span>
                        </div>

                        <h3 className="mt-3 text-h3 font-medium tracking-[-0.035em] text-ink">
                          {page.name}
                        </h3>
                        <p className="figures mt-1 text-small text-ink-3">
                          {page.url}
                          {NOINDEX.has(page.url) ? (
                            <span className="ml-2 text-ink-4">noindex</span>
                          ) : null}
                          {template ? <span className="ml-2 text-ink-4">template</span> : null}
                        </p>

                        <p className="mt-5 text-small text-ink-2">{HERO_NOTE[art.hero]}</p>

                        <ol className="mt-4 flex flex-wrap gap-1.5">
                          {art.rhythm.map((step, i) => (
                            <li
                              key={i}
                              className={
                                "rounded-chip px-2 py-1 text-meta " +
                                (step === "inversion"
                                  ? "bg-night text-night-ink"
                                  : step === "statement"
                                    ? "bg-violet-wash text-violet-ink"
                                    : "bg-paper-3 text-ink-3")
                              }
                            >
                              {step}
                            </li>
                          ))}
                        </ol>

                        <Link
                          href={href}
                          className="mt-6 inline-flex text-small text-violet-ink underline underline-offset-4"
                        >
                          Open {page.url}
                        </Link>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}

          {missing.length ? (
            <p className="mt-20 rounded-card border border-progress/40 bg-ember-wash p-6 text-small text-ink-2">
              Not grouped: {missing.map((p) => p.url).join(", ")}
            </p>
          ) : null}

          <p className="mt-20 border-t border-rule pt-8 text-small text-ink-3">
            {Object.keys(ART).length} pages carry hand-assigned art direction. Delete this
            route before launch: it is not in the URL registry.
          </p>
        </main>
      </div>
      <Footer />
    </>
  )
}
