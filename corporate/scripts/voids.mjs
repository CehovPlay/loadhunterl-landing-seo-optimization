// Where a page is empty and should not be.
//
//   node scripts/voids.mjs /carriers 1440
//
// Prints one row per <section>: its height, and the largest vertical gap
// between the content boxes inside it. A 400px gap inside a 900px section is
// the "half the screen is white" report, in numbers rather than by eye.
import { spawn } from "node:child_process"

const route = process.argv[2] ?? "/"
const width = Number(process.argv[3] ?? 1440)
const BASE = process.env.BASE ?? "http://localhost:4311"

const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ["--headless=new","--no-sandbox","--hide-scrollbars","--remote-debugging-port=9339","--user-data-dir=/tmp/lh-voids","about:blank"], { stdio: "ignore" })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(1400)
const { webSocketDebuggerUrl } = await fetch("http://127.0.0.1:9339/json/version").then((r) => r.json())
const ws = new WebSocket(webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))
let id = 0
const pend = new Map()
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id) } }
const send = (method, params = {}, sessionId) => new Promise((res) => { const n = ++id; pend.set(n, res); ws.send(JSON.stringify({ id: n, method, params, sessionId })) })
const { targetId } = await send("Target.createTarget", { url: "about:blank" })
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true })
await send("Page.enable", {}, sessionId)
await send("Runtime.enable", {}, sessionId)
await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId)
await send("Page.navigate", { url: `${BASE}${route}` }, sessionId)
await wait(1500)
// Reveal animations start at opacity 0; force them visible before measuring.
await send("Runtime.evaluate", { expression: `document.querySelectorAll('[style*="opacity"]').forEach(el => el.style.opacity = 1); window.scrollTo(0, document.body.scrollHeight); ` }, sessionId)
await wait(1200)
await send("Runtime.evaluate", { expression: `window.scrollTo(0,0)` }, sessionId)
await wait(400)

const PROBE = `(() => {
  const rows = []
  const leaf = (el) => !el.querySelector('p, h1, h2, h3, li, img, svg, input, button, table, dl')
  for (const section of document.querySelectorAll('main section')) {
    const sr = section.getBoundingClientRect()
    const boxes = [...section.querySelectorAll('p, h1, h2, h3, li, img, svg, input, button, table, dl')]
      .filter(leaf)
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.height > 0 && r.width > 0)
      .sort((a, b) => a.top - b.top)
    let gap = 0, at = 0, bottom = -Infinity, top = Infinity
    for (const r of boxes) {
      if (bottom !== -Infinity && r.top - bottom > gap) { gap = r.top - bottom; at = bottom }
      bottom = Math.max(bottom, r.bottom)
      top = Math.min(top, r.top)
    }
    rows.push({
      id: section.id || section.className.split(' ')[0] || '-',
      height: Math.round(sr.height),
      gap: Math.round(gap),
      head: Math.round(top - sr.top),
      tail: Math.round(sr.bottom - bottom),
    })
  }
  return rows
})()`
const { result } = await send("Runtime.evaluate", { expression: PROBE, returnByValue: true }, sessionId)
console.log(`${route} at ${width}px`)
console.log("section".padEnd(28), "height", " gap", " head", " tail")
for (const r of result.value) {
  const flag = r.gap > 180 || r.tail > 180 || r.head > 200 ? "  <<" : ""
  console.log(String(r.id).padEnd(28), String(r.height).padStart(6), String(r.gap).padStart(5), String(r.head).padStart(6), String(r.tail).padStart(6), flag)
}
ws.close(); chrome.kill()
