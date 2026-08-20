// Acceptance sweep over every route in the sitemap.
//
//   node scripts/sweep.mjs
//   ROUTES='^/trucking-directory'   only the routes matching this regex
//
// The directory generates a route per company, so the full sweep is 161 routes
// and takes minutes. Scope it while working on one surface; run it unscoped
// before a deploy.
//
// The tabs all repeat the same handful of page-level requirements, and they are
// cheap to check from the rendered DOM rather than by eye on 47 pages: exactly
// one H1, a title and a meta description, no console error, and - because P0
// is US English while a quarter of the document's copy fields are Russian
// instructions - no Russian text outside the places that mark it as a note.
import { spawn } from "node:child_process"

const BASE = process.env.BASE ?? "http://localhost:4311"
const filter = process.env.ROUTES ? new RegExp(process.env.ROUTES) : null

const routes = await fetch(`${BASE}/sitemap.xml`)
  .then((r) => r.text())
  .then((x) => [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
  .then((all) => (filter ? all.filter((r) => filter.test(r)) : all))

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--no-sandbox", "--hide-scrollbars", "--remote-debugging-port=9336",
   "--user-data-dir=/tmp/lh-sweep", "about:blank"],
  { stdio: "ignore" },
)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(1400)

const { webSocketDebuggerUrl } = await fetch("http://127.0.0.1:9336/json/version").then((r) => r.json())
const ws = new WebSocket(webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
let errors = []
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) }
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
    errors.push((m.params.args || []).map((a) => a.value ?? a.description).join(" ").slice(0, 120))
  if (m.method === "Runtime.exceptionThrown")
    errors.push(m.params.exceptionDetails?.exception?.description?.slice(0, 120) ?? "exception")
}
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params, sessionId })) })

const { targetId } = await send("Target.createTarget", { url: "about:blank" })
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true })
await send("Page.enable", {}, sessionId)
await send("Runtime.enable", {}, sessionId)
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId)

const PROBE = `(() => {
  const cyr = /[А-Яа-яЁё]/
  // Russian is allowed only where the page marks it as untranslated - see
  // \`untranslated()\` in components/blocks/kit.tsx. Anything else is a leak.
  const leaks = []
  for (const el of document.querySelectorAll('h1, h2, h3, p, li, dd, a, button, span')) {
    if (!cyr.test(el.textContent || '')) continue
    if (el.closest('[data-untranslated]')) continue
    if (el.querySelector('h1, h2, h3, p, li, dd')) continue       // report the leaf
    leaks.push(el.tagName.toLowerCase() + ': ' + (el.textContent || '').trim().slice(0, 70))
  }
  return {
    h1: document.querySelectorAll('h1').length,
    title: (document.title || '').length,
    description: (document.querySelector('meta[name=description]')?.content || '').length,
    jsonLd: document.querySelectorAll('script[type="application/ld+json"]').length,
    leaks: leaks.slice(0, 4),
  }
})()`

const rows = []
for (const route of routes) {
  errors = []
  await send("Page.navigate", { url: `${BASE}${route}` }, sessionId)
  await wait(700)
  const { result } = await send("Runtime.evaluate", { expression: PROBE, returnByValue: true }, sessionId)
  rows.push({ route, ...result.value, errors: [...errors] })
}
ws.close(); chrome.kill()

const bad = rows.filter(
  (r) => r.h1 !== 1 || !r.title || !r.description || r.leaks.length || r.errors.length,
)
console.log(`${routes.length} routes checked`)
if (!bad.length) console.log("clean: one H1, title, description and no Russian outside marked notes")
for (const r of bad) {
  console.log(`\n${r.route}`)
  if (r.h1 !== 1) console.log(`  h1 count: ${r.h1}`)
  if (!r.title) console.log("  no title")
  if (!r.description) console.log("  no meta description")
  r.leaks.forEach((l) => console.log(`  untranslated: ${l}`))
  r.errors.forEach((e) => console.log(`  console: ${e}`))
}
process.exitCode = bad.length ? 1 : 0
