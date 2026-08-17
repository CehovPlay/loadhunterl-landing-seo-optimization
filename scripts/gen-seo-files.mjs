/**
 * Generates public/robots.txt and public/sitemap.xml from the route table.
 *
 * Runs on `prebuild`, so the two files can never drift from the routes that
 * actually exist. Only routes with `index: true` are listed (LH-056: "исключить
 * app/auth/staging", and an unpublished blog hub must not be submitted either).
 *
 * robots.txt (AEO-001): OAI-SearchBot, Claude-SearchBot and Claude-User are
 * explicitly allowed so ChatGPT Search and Claude web search can retrieve and
 * cite the FAQ. GPTBot and ClaudeBot are model-TRAINING crawlers, a separate
 * decision for the site owner, so they are neither allowed nor blocked here.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { loadRouteMeta } from "./route-meta.mjs"

const ROOT = process.cwd()
const SITE = "https://loadhunter.io"

/** Static pages that are not React routes but should still be indexed. */
const STATIC_PAGES = [
  { loc: "/privacy.html", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms.html", changefreq: "yearly", priority: "0.3" },
]

const ROBOTS = `# Search and retrieval crawlers
User-agent: *
Allow: /

# AI search / retrieval (AEO-001). These fetch pages to answer and cite;
# allowing them is what makes the FAQ eligible to be quoted.
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# NOTE: GPTBot and ClaudeBot are model-training crawlers, not search crawlers.
# They are intentionally left undeclared: that decision belongs to the site
# owner, and blocking them would NOT affect ChatGPT Search or Claude web search.

# Dev-only probes must never be crawled.
Disallow: /__probe.html
Disallow: /__measure.html

Sitemap: ${SITE}/sitemap.xml
`

function priorityFor(p) {
  if (p === "/") return "1.0"
  if (p === "/blog/") return "0.7"
  return "0.8"
}

async function main() {
  const { ROUTE_META } = await loadRouteMeta(ROOT)
  const today = new Date().toISOString().slice(0, 10)

  const indexable = ROUTE_META.filter((r) => r.index)
  const skipped = ROUTE_META.filter((r) => !r.index).map((r) => r.path)

  const urls = [
    ...indexable.map((r) => ({
      loc: r.path,
      changefreq: r.path === "/" ? "weekly" : "monthly",
      priority: priorityFor(r.path),
    })),
    ...STATIC_PAGES,
  ]

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${SITE}${u.loc}</loc>\n` +
          `    <lastmod>${today}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`

  await fs.writeFile(path.join(ROOT, "public/robots.txt"), ROBOTS)
  await fs.writeFile(path.join(ROOT, "public/sitemap.xml"), xml)

  console.log(`[seo] sitemap: ${urls.length} urls`)
  if (skipped.length) console.log(`[seo] excluded (noindex): ${skipped.join(", ")}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
