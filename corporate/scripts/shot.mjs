// Device-emulated screenshot over CDP.
//
// Headless Chrome clamps --window-size to about 500px wide, so mobile widths
// have to come from Emulation.setDeviceMetricsOverride instead.
//
//   node scripts/shot.mjs <url> <width> <height> <out.png> [full]
//   SCROLL=2000  scroll there first, then wait for scroll-triggered motion
//   WAIT=800     shoot this many ms after navigate instead of the 4500 default,
//                which is how the preloader is caught mid-choreography
//   DSF=1        device scale factor (default 2; use 1 for cheap review shots)
//
// Full-page shots are capped at 7800px tall by Chrome, so a long page is read
// as a series of viewport shots at SCROLL positions rather than one image.
import { spawn } from "node:child_process"
import { writeFileSync } from "node:fs"

const [, , url, w, h, out, full] = process.argv
const width = Number(w)
const height = Number(h)

const chrome = spawn(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  [
    "--headless=new",
    "--no-sandbox",
    "--hide-scrollbars",
    "--remote-debugging-port=9333",
    "--user-data-dir=/tmp/lh-cdp-profile",
    "about:blank",
  ],
  { stdio: "ignore" },
)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  let target = null
  for (let i = 0; i < 40 && !target; i++) {
    await sleep(250)
    try {
      const res = await fetch("http://127.0.0.1:9333/json/list")
      const list = await res.json()
      target = list.find((t) => t.type === "page")
    } catch {}
  }
  if (!target) throw new Error("no CDP target")

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg.result)
      pending.delete(msg.id)
    }
  })
  await new Promise((r) => ws.addEventListener("open", r))

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const n = ++id
      pending.set(n, resolve)
      ws.send(JSON.stringify({ id: n, method, params }))
    })

  await send("Page.enable")
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: Number(process.env.DSF || 2),
    mobile: width < 768,
  })
  await send("Page.navigate", { url })
  await sleep(Number(process.env.WAIT || 4500))

  if (process.env.SCROLL) {
    await send("Runtime.evaluate", {
      expression: `window.scrollTo(0, ${Number(process.env.SCROLL)})`,
    })
    await sleep(2800)
  }

  if (full) {
    const { cssContentSize } = await send("Page.getLayoutMetrics")
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: Math.min(Math.ceil(cssContentSize.height), 7800),
      deviceScaleFactor: 1,
      mobile: width < 768,
    })
    await sleep(1200)
  }

  const { data } = await send("Page.captureScreenshot", { format: "png" })
  writeFileSync(out, Buffer.from(data, "base64"))
  ws.close()
  chrome.kill()
  console.log("wrote", out)
}

main().catch((e) => {
  console.error(e)
  chrome.kill()
  process.exit(1)
})
