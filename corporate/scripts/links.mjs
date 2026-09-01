// Every internal link on every page must resolve.
//
//   node scripts/links.mjs
//
// §26.2 requires each action to have a confirmed destination, and the 213 CTA
// labels are mapped onto routes by `content/cta.ts` rather than written in the
// document - so the mapping needs a check that fails when it points somewhere
// that does not exist. Anchors are verified against the target page's own ids.
//
// Three failures this catches beyond a 404, all of them found in the build it
// was written for: a link to the page it is on, a dead href="#", and a CTA
// rendered as a live control with no destination behind it. The count of
// pending controls is printed rather than failed - they are honest, and the
// number only comes down when §15.3 hands over the missing addresses.
const BASE = process.env.BASE ?? "http://localhost:4311"

const routes = await fetch(`${BASE}/sitemap.xml`)
  .then((r) => r.text())
  .then((x) => [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))

const bad = []
const seen = new Map()
let pending = 0

for (const route of routes) {
  const html = await fetch(`${BASE}${route}`).then((r) => r.text())
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  pending += [...html.matchAll(/data-cta="pending"/g)].length
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])

  // A link in the page's own body that points at the page it is on: the
  // reader clicks an action and the same page reloads. The menus and the
  // footer index are exempt - they list every route by design, and mark the
  // one you are on with aria-current instead.
  const main = html.slice(html.indexOf('<main'), html.lastIndexOf('</main>'))
  const bodyLinks = [...main.matchAll(/href="([^"#]+)"/g)].map((m) => m[1])
  for (const h of bodyLinks) {
    if (h === route) bad.push(`${route}: body link to itself`)
  }
  // A page whose own copy offers no way onward is a dead end: the reader has
  // the menus and nothing else. Pending controls do not count - that is the
  // point of marking them.
  if (!bodyLinks.some((h) => h.startsWith("/") && h !== route)) {
    bad.push(`${route}: no live CTA in the page body`)
  }
  // Attribute order is React's, not ours, so match the whole tag.
  const here = [...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g)]
    .map((tag) => tag[0].match(/href="([^"]+)"/)?.[1])
    .filter(Boolean)
  const listed = hrefs.includes(route)
  if (route !== "/" && listed && !here.includes(route)) {
    bad.push(`${route}: listed in the index without aria-current`)
  }
  for (const href of hrefs) {
    if (href === "#") { bad.push(`${route}: dead href="#"`); continue }
    if (href.startsWith("#")) {
      if (!ids.has(href.slice(1))) bad.push(`${route}: anchor ${href} has no target`)
      continue
    }
    if (!href.startsWith("/")) continue                    // external or mailto
    const path = href.split("#")[0]
    if (!seen.has(path)) {
      const res = await fetch(`${BASE}${path}`, { method: "HEAD" })
      seen.set(path, res.status)
    }
    if (seen.get(path) >= 400) bad.push(`${route}: ${href} -> ${seen.get(path)}`)
  }
}

console.log(`${routes.length} pages, ${seen.size} distinct internal destinations, ${pending} pending controls`)
if (!bad.length) console.log("every internal link and anchor resolves")
else bad.slice(0, 40).forEach((b) => console.log("  " + b))
process.exitCode = bad.length ? 1 : 0
