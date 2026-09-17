import puppeteer from "puppeteer-core"
import { mkdirSync, rmSync } from "node:fs"

// usage: node shoot.mjs [name] [pixelSize]   e.g. `node shoot.mjs sticker 512`
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const DUR = 2000, FPS = 30, N = Math.round((DUR / 1000) * FPS)
const variant = process.argv[2] || "disc"
const size = Number(process.argv[3] || 100)
const out = `frames-${variant}`
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true })

// the page is authored at 100 CSS px; deviceScaleFactor rasterises the same
// vectors at any output size (512 → 5.12), so nothing is upscaled from bitmap
const browser = await puppeteer.launch({ executablePath: CHROME, headless: "shell",
  args: ["--hide-scrollbars", "--disable-lcd-text"] })
const page = await browser.newPage()
await page.setViewport({ width: 100, height: 100, deviceScaleFactor: size / 100 })
await page.goto(`file://${process.cwd()}/frame.html`, { waitUntil: "load" })

for (let i = 0; i < N; i++) {
  await page.evaluate((t) => window.__render(t), (i * DUR) / N)
  await page.screenshot({ path: `${out}/f${String(i).padStart(3, "0")}.png`, omitBackground: true })
}
await browser.close()
console.log(`${N} frames @ ${size}px -> ${out}`)
