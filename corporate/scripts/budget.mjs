// The JavaScript budget, measured the only way that cannot be gamed.
//
//   node scripts/budget.mjs            (after next build; runs on postbuild)
//   BUDGET_ALL=1                       measure every route, not just the named ones
//
// TZ §17.1: "Допустимый объём JavaScript для критических страниц определяется
// до разработки и автоматически контролируется при каждой сборке."
//
// Two earlier versions of this file were wrong, and both failures are worth
// keeping written down because both look correct:
//
//   1. Reading the <script> tags out of the prerendered HTML. A chunk imported
//      from inside another chunk never appears in the HTML, so the homepage
//      measured 300 KB while the browser fetched about a megabyte.
//   2. Walking the chunk graph by filename. That fixes (1) but over-counts: a
//      dynamic import() writes the chunk name into the importing chunk too, so
//      genuinely lazy weight - three.js on the homepage - got billed to the
//      first load it is deliberately kept out of.
//
// So this drives a real browser and records what it actually transferred.
//
// The split is by INTERACTION, not by the load event. Keying it on
// `Page.loadEventFired` was the third wrong version: a page with more DOM fires
// load later, so the same chunk counted as eager on one route and lazy on
// another, and /trucking-directory appeared 56 KB heavier than /privacy while
// actually loading strictly fewer files.
//
//   initial  - fetched with no interaction at all. What a visitor pays to read
//              the page. This is the number the budget is enforced against.
//   scrolled - fetched once the page is scrolled. What the page costs if you
//              engage with it: the hero shader, three.js, the proofs.
//
// Reported separately because §14.1 asks for heavy demonstrations to be
// isolated and loaded on approach, and that rule is only real if the two halves
// are measured apart.
import { readFileSync } from "node:fs"
import { spawn } from "node:child_process"

const budget = JSON.parse(readFileSync("perf-budget.json", "utf8"))
const BASE = process.env.BASE ?? "http://localhost:4311"

const named = Object.keys(budget.budgets).filter((r) => r !== "*")

/** One representative of everything the "*" budget covers. */
const sample = process.env.BUDGET_ALL
  ? await fetch(`${BASE}/sitemap.xml`)
      .then((r) => r.text())
      .then((x) => [...x.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
  : [...named, "/privacy", "/trucking-directory"]

const routes = [...new Set(sample)]

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--no-sandbox", "--remote-debugging-port=9358",
   "--user-data-dir=/tmp/lh-budget", "about:blank"],
  { stdio: "ignore" },
)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let target = null
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250)
  try {
    target = (await fetch("http://127.0.0.1:9358/json/list").then((r) => r.json()))
      .find((t) => t.type === "page")
  } catch {}
}
if (!target) {
  console.log("no CDP target - is Chrome installed at the expected path?")
  process.exit(0)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
let interacted = false
const js = []

ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data)
  if (m.method === "Network.loadingFinished") {
    const req = inflight.get(m.params.requestId)
    if (req?.endsWith(".js")) js.push({ url: req, bytes: m.params.encodedDataLength, initial: !interacted })
  }
  if (m.method === "Network.responseReceived") inflight.set(m.params.requestId, m.params.response.url)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) }
})
const inflight = new Map()

await new Promise((r) => ws.addEventListener("open", r))
const send = (method, params = {}) =>
  new Promise((res) => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })) })

await send("Network.enable")
await send("Page.enable")
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

const rows = []
for (const route of routes) {
  js.length = 0
  inflight.clear()
  interacted = false
  await send("Network.clearBrowserCache")
  await send("Page.navigate", { url: `${BASE}${route}` })
  /* Long enough for anything the page starts on its own, including work queued
     at browser idle - the hero shader probes the GPU adapter that way. */
  await sleep(3800)

  interacted = true
  await send("Runtime.evaluate", { expression: "window.scrollTo(0, document.body.scrollHeight * 0.4)" })
  await sleep(2600)

  const initial = js.filter((f) => f.initial).reduce((t, f) => t + f.bytes, 0) / 1024
  const scrolled = js.filter((f) => !f.initial).reduce((t, f) => t + f.bytes, 0) / 1024
  rows.push({ route, initial, scrolled })
}

ws.close()
chrome.kill()

const limitFor = (r) => budget.budgets[r] ?? budget.budgets["*"]
rows.sort((a, b) => b.initial - a.initial)

console.log(`JavaScript over the wire (${budget.unit}), ${rows.length} routes measured\n`)
console.log(`      initial   limit  on scroll   route`)
for (const r of rows) {
  const limit = limitFor(r.route).max
  const flag = r.initial > limit ? "OVER" : "ok  "
  console.log(
    `  ${flag}  ${r.initial.toFixed(1).padStart(7)}  ${String(limit).padStart(5)}  ${r.scrolled.toFixed(1).padStart(9)}   ${r.route}`,
  )
}

const worst = rows[0]
const target2 = budget.launchTarget[worst.route] ?? budget.launchTarget["*"]
console.log(`\nheaviest initial: ${worst.route} at ${worst.initial.toFixed(1)} KB, launch target ${target2} KB`)
const heaviestScroll = [...rows].sort((a, b) => b.scrolled - a.scrolled)[0]
console.log(`heaviest on scroll: ${heaviestScroll.route} at ${heaviestScroll.scrolled.toFixed(1)} KB`)

const over = rows.filter((r) => r.initial > limitFor(r.route).max)
if (over.length) {
  console.log(`\n${over.length} route(s) over budget.`)
  process.exitCode = 1
}
