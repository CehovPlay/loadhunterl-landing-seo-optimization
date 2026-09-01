// Pinpoint what widens the document on one route.
//
//   node scripts/overflow-why.mjs /carriers 390
//
// overflow.mjs answers "which pages scroll sideways"; this one answers "which
// element". It walks the tree from <body>, keeps every box whose right edge is
// past the viewport, and prints the ancestor chain with the computed position -
// a fixed box inside a transformed ancestor sits on the document, not the
// viewport, and shows up as a false lead unless you can see the chain.
import { spawn } from "node:child_process"

const route = process.argv[2] ?? "/"
const width = Number(process.argv[3] ?? 390)
const BASE = process.env.BASE ?? "http://localhost:4311"

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new", "--no-sandbox", "--hide-scrollbars", "--remote-debugging-port=9335",
   "--user-data-dir=/tmp/lh-overflow-why", "about:blank"],
  { stdio: "ignore" },
)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(1400)

const { webSocketDebuggerUrl } = await fetch("http://127.0.0.1:9335/json/version").then((r) => r.json())
const ws = new WebSocket(webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id) }
}
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => { const n = ++id; pending.set(n, resolve); ws.send(JSON.stringify({ id: n, method, params, sessionId })) })

const { targetId } = await send("Target.createTarget", { url: "about:blank" })
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true })
await send("Page.enable", {}, sessionId)
await send("Runtime.enable", {}, sessionId)
await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 }, sessionId)
await send("Page.navigate", { url: `${BASE}${route}` }, sessionId)
await wait(1200)

const PROBE = `(() => {
  const de = document.documentElement
  const vw = de.clientWidth
  const label = el => el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 4).join('.') : '')
  const chain = el => { const out = []; for (let n = el; n && n !== document.body; n = n.parentElement) out.unshift(label(n)); return out.join(' > ') }
  const out = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.right <= vw + 1) continue
    const cs = getComputedStyle(el)
    // Only report a box whose parent stays inside - the outermost offender.
    const pr = el.parentElement.getBoundingClientRect()
    if (pr.right > vw + 1 && el.parentElement !== document.body) continue
    out.push({ path: chain(el), right: Math.round(r.right), width: Math.round(r.width), position: cs.position, transform: cs.transform.slice(0, 30), overflowX: cs.overflowX })
  }
  return { vw, scrollWidth: de.scrollWidth, bodyScroll: document.body.scrollWidth, offenders: out.slice(0, 12) }
})()`

const { result } = await send("Runtime.evaluate", { expression: PROBE, returnByValue: true }, sessionId)
console.log(route, `${width}px`)
console.log(JSON.stringify(result.value, null, 2))
ws.close(); chrome.kill()
