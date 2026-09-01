// Horizontal-overflow check across the breakpoints the TZ names.
//
//   node scripts/overflow.mjs [width ...]
//   ROUTES='^/trucking-directory'   check only the routes matching this regex
//
// The directory generates a route per company, so the full sweep is now 161
// routes. Scope it while working on one surface; run it unscoped before a
// deploy.
//
//   ROUTES='^/trucking-directory'   only the routes matching this regex
//
// Desktop widths only, by the owner's decision of 2026-08-20: the corporate
// site is being built for the desktop first and the phone layouts are not being
// worked on yet. §17.3's range is "компьютерные экраны от 1280 пикселей до
// больших широкоформатных мониторов", which is what the defaults below are.
// The page tabs' 360-430 floor is still in the document and this check still
// takes those widths as arguments - `node scripts/overflow.mjs 360 390 430` -
// so nothing is lost when the phone work starts.
//
// Runs every route in the registry at each width and reports the ones whose
// document is wider than the viewport, plus any single element sticking out
// past the right edge, which is what usually causes it.
import { spawn } from "node:child_process"

const WIDTHS = process.argv.slice(2).map(Number)
const widths = WIDTHS.length ? WIDTHS : [1280, 1440, 1920]
const BASE = process.env.BASE ?? "http://localhost:4311"

const filter = process.env.ROUTES ? new RegExp(process.env.ROUTES) : null

const routes = await fetch(`${BASE}/sitemap.xml`)
  .then((r) => r.text())
  .then((xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
  .then((all) => (filter ? all.filter((r) => filter.test(r)) : all))

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--no-sandbox",
    "--hide-scrollbars",
    "--remote-debugging-port=9334",
    "--user-data-dir=/tmp/lh-overflow-profile",
    "about:blank",
  ],
  { stdio: "ignore" },
)

const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(1400)

const { webSocketDebuggerUrl } = await fetch("http://127.0.0.1:9334/json/version").then((r) =>
  r.json(),
)

const ws = new WebSocket(webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))

let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result)
    pending.delete(msg.id)
  }
}
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => {
    const n = ++id
    pending.set(n, resolve)
    ws.send(JSON.stringify({ id: n, method, params, sessionId }))
  })

const { targetId } = await send("Target.createTarget", { url: "about:blank" })
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true })
await send("Page.enable", {}, sessionId)
await send("Runtime.enable", {}, sessionId)

const PROBE = `(() => {
  const de = document.documentElement
  const vw = de.clientWidth
  if (de.scrollWidth <= vw + 1) return null
  const guilty = [...document.querySelectorAll('body *')]
    .map(el => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && r.right > vw + 1)
    .slice(0, 3)
    .map(({ el, r }) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '') + ' → ' + Math.round(r.right))
  return { scrollWidth: de.scrollWidth, vw, guilty }
})()`

const failures = []
for (const width of widths) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 768,
  }, sessionId)

  for (const route of routes) {
    await send("Page.navigate", { url: `${BASE}${route}` }, sessionId)
    await wait(650)
    const { result } = await send(
      "Runtime.evaluate",
      { expression: PROBE, returnByValue: true, awaitPromise: false },
      sessionId,
    )
    if (result?.value) failures.push({ width, route, ...result.value })
  }
  process.stdout.write(`checked ${width}px\n`)
}

ws.close()
chrome.kill()

if (!failures.length) {
  console.log(`\nNo horizontal overflow on ${routes.length} routes at ${widths.join(", ")}px.`)
} else {
  console.log(`\n${failures.length} overflow(s):`)
  for (const f of failures) {
    console.log(`  ${f.width}px ${f.route} — ${f.scrollWidth} > ${f.vw}`)
    f.guilty.forEach((g) => console.log(`      ${g}`))
  }
  process.exitCode = 1
}
