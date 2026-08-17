/**
 * Prerenders every route in `dist/` to a real static HTML document.
 *
 * WHY a browser and not react-dom/server: the landing tree is built around a
 * scaled canvas, `createPortal(document.body)`, a WebGPU shader engine and
 * layout-effect measurement. Making all of that SSR-safe would mean rewriting
 * working code; rendering it in headless Chrome and capturing the resulting DOM
 * gives the same artefact with none of that risk. This is the classic
 * react-snap approach.
 *
 * What it produces, per route:
 *   dist/index.html, dist/faq/index.html, dist/auto-emailing/index.html, ...
 * each containing the fully rendered markup plus the route's own title,
 * description, canonical, robots, Open Graph and JSON-LD.
 *
 * This is what closes LH-058 ("view-source contains hero, features, FAQ and
 * footer links") and AEO-001 ("source HTML contains all 8 Q&A").
 *
 * Skip it with PRERENDER=0 (e.g. on a machine with no Chrome); the build then
 * still produces a working SPA, just without static HTML.
 */
import fs from "node:fs/promises"
import path from "node:path"
import http from "node:http"
import { spawn } from "node:child_process"
import { loadRouteMeta } from "./route-meta.mjs"

const ROOT = process.cwd()
const DIST = path.join(ROOT, "dist")
const PORT = 5599

const CHROME =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
}

/** Static server over dist/ with SPA history fallback. */
function serve() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0])
      let file = path.join(DIST, url)
      try {
        const st = await fs.stat(file)
        if (st.isDirectory()) file = path.join(file, "index.html")
      } catch {
        file = path.join(DIST, "index.html") // history fallback
      }
      try {
        const body = await fs.readFile(file)
        res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" })
        res.end(body)
      } catch {
        res.writeHead(404).end("not found")
      }
    })
    server.listen(PORT, () => resolve(server))
  })
}

/** Runs headless Chrome and returns the settled DOM for a URL. */
function dumpDom(url) {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      // reduced motion keeps entrance animations from capturing mid-flight
      "--force-prefers-reduced-motion",
      // 800px (the default) would capture the FLOW tree for the homepage;
      // the desktop canvas is the canonical rendering
      "--window-size=1440,900",
      "--virtual-time-budget=15000",
      "--dump-dom",
      url,
    ]
    const p = spawn(CHROME, args)
    let out = ""
    let err = ""
    p.stdout.on("data", (d) => (out += d))
    p.stderr.on("data", (d) => (err += d))
    p.on("error", reject)
    p.on("close", (code) => {
      if (!out) reject(new Error(`chrome exited ${code}: ${err.slice(0, 400)}`))
      else resolve(out)
    })
  })
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** Replaces the head tags for one route and injects its JSON-LD. */
function applyMeta(html, route, canonical, preloaderBlock) {
  const title = esc(route.title)
  const desc = esc(route.description)
  const ogTitle = esc(route.ogTitle || route.title)
  const ogDesc = esc(route.ogDescription || route.description)
  const url = canonical(route.path)
  const robots = route.index ? "index,follow" : "noindex,follow"

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[\s\S]*?">/,
      `<meta name="description" content="${desc}">`,
    )
    .replace(/<link rel="canonical" href="[\s\S]*?">/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta name="robots" content="[\s\S]*?">/, `<meta name="robots" content="${robots}">`)
    .replace(/<meta property="og:url" content="[\s\S]*?">/, `<meta property="og:url" content="${url}">`)
    .replace(
      /<meta property="og:title" content="[\s\S]*?">/,
      `<meta property="og:title" content="${ogTitle}">`,
    )
    .replace(
      /<meta property="og:description" content="[\s\S]*?">/,
      `<meta property="og:description" content="${ogDesc}">`,
    )
    .replace(
      /<meta name="twitter:title" content="[\s\S]*?">/,
      `<meta name="twitter:title" content="${ogTitle}">`,
    )
    .replace(
      /<meta name="twitter:description" content="[\s\S]*?">/,
      `<meta name="twitter:description" content="${ogDesc}">`,
    )

  // strip any JSON-LD the previous pass injected, then add this route's
  out = out.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
  const ld = route.jsonLd
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join("\n    ")
  out = out.replace("</head>", `    ${ld}\n  </head>`)

  // The preloader removes ITSELF once the app has painted, so the captured DOM
  // no longer contains it and the shipped HTML would start with no curtain at
  // all. Re-insert the original markup from the build template, and drop the
  // lh-pl-lock class the capture may have frozen onto <html>.
  if (preloaderBlock && !out.includes('id="lh-preloader"')) {
    out = out.replace(/(<body[^>]*>)/, `$1\n${preloaderBlock}`)
  }
  out = out.replace(/<html([^>]*)\sclass="([^"]*)lh-pl-lock([^"]*)"/, '<html$1 class="$2$3"')

  return out
}

/** The preloader markup, lifted from the built template between its markers. */
function extractPreloader(templateHtml) {
  const m = templateHtml.match(/<!--lh-preloader-start-->([\s\S]*?)<!--lh-preloader-end-->/)
  return m ? m[1].trim() : ""
}

async function main() {
  if (process.env.PRERENDER === "0") {
    console.log("[prerender] skipped (PRERENDER=0)")
    return
  }
  try {
    await fs.access(CHROME)
  } catch {
    console.warn(
      `[prerender] Chrome not found at ${CHROME} — skipping. Set CHROME_PATH or PRERENDER=0.`,
    )
    return
  }

  const { ROUTE_META, canonical } = await loadRouteMeta(ROOT)
  // read the template BEFORE any route overwrites dist/index.html
  const preloaderBlock = extractPreloader(await fs.readFile(path.join(DIST, "index.html"), "utf8"))
  if (!preloaderBlock) console.warn("[prerender] preloader markers not found in dist/index.html")
  const server = await serve()
  console.log(`[prerender] serving dist/ on :${PORT}`)

  // Capture everything first, THEN write. The static server falls back to
  // dist/index.html for unknown paths, so writing the homepage mid-loop would
  // change what the remaining routes are captured from.
  const results = []
  try {
    for (const route of ROUTE_META) {
      const url = `http://127.0.0.1:${PORT}${route.path}`
      const dom = await dumpDom(url)
      results.push({ route, html: applyMeta(dom, route, canonical, preloaderBlock) })
    }
  } finally {
    server.close()
  }

  for (const { route, html } of results) {
    const outFile =
      route.path === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.path, "index.html")
    await fs.mkdir(path.dirname(outFile), { recursive: true })
    await fs.writeFile(outFile, html)
    console.log(
      `[prerender] ${route.path} → ${path.relative(DIST, outFile)} (${Math.round(html.length / 1024)} kB)`,
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
