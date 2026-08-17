import { BLOG_INDEX } from "@/content/copy"
import { BLOG_POSTS } from "@/content/blog"
import { track } from "@/lib/analytics"
import { Breadcrumbs, PageShell } from "./PageShell"

/**
 * LH-072 / SEO-023 — the /blog/ hub.
 *
 * The route, its H1, the five approved categories and the header/footer links
 * ship now; the articles themselves (BLOG-002..015) are a separate content
 * task. While `BLOG_POSTS` is empty the page is served `noindex` (see
 * src/routes.tsx) and is kept out of the sitemap, so an empty hub is never
 * submitted to search as thin content. Publishing posts flips both
 * automatically.
 */
export function BlogIndex() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "Blog" }]} />

      <h1 className="text-[clamp(30px,6vw,44px)] font-medium leading-[1.15] tracking-[-0.03em] text-ink">
        {BLOG_INDEX.h1}
      </h1>
      <p className="mt-6 text-[18px] font-medium leading-[28px] tracking-[-0.02em] text-ink/75">
        Practical guides on load-board automation, dispatch workflows and load profitability,
        written for U.S. carriers, owner-operators and dispatch teams.
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {BLOG_INDEX.categories.map((c) => (
          <li
            key={c}
            className="rounded-full border border-border-light bg-white px-4 py-2 text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-ink"
          >
            {c}
          </li>
        ))}
      </ul>

      {BLOG_POSTS.length > 0 ? (
        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {BLOG_POSTS.map((p) => (
            <li key={p.slug}>
              <a
                href={`/blog/${p.slug}/`}
                onClick={() => track("blog_click", { slug: p.slug })}
                className="flex h-full flex-col rounded-lg border border-border-light bg-white p-6 transition-colors hover:border-violet/40"
              >
                <span className="text-[13px] font-medium leading-[18px] text-violet">
                  {p.category}
                </span>
                <h2 className="mt-2 text-[20px] font-medium leading-[28px] tracking-[-0.02em] text-ink">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-[15px] font-medium leading-[22px] text-ink/70">
                  {p.excerpt}
                </p>
                <span className="mt-4 text-[13px] font-medium leading-[18px] text-ink/50">
                  Updated {p.updated} · {p.readingMinutes} min read
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-12 rounded-lg border border-border-light bg-white p-6 text-[16px] font-medium leading-[26px] text-ink/70">
          The first guides are being written. In the meantime, the product pages cover the same
          ground in detail:{" "}
          <a href="/auto-emailing/" className="text-violet underline underline-offset-2">
            broker email automation
          </a>
          ,{" "}
          <a href="/load-profit-calculator/" className="text-violet underline underline-offset-2">
            profit and RPM with deadhead
          </a>{" "}
          and{" "}
          <a href="/factoring-check/" className="text-violet underline underline-offset-2">
            broker factoring signals
          </a>
          .
        </p>
      )}
    </PageShell>
  )
}
