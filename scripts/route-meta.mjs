/**
 * Loads src/routes.meta.ts into Node.
 *
 * The route table is TypeScript with `@/` aliases, so it cannot be imported
 * directly. Vite is already a dependency, so we let it bundle that one module
 * for SSR into a temp file and import the result. routes.meta.ts is deliberately
 * component-free (see its header), which is what keeps this bundle tiny and
 * side-effect free.
 */
import { build } from "vite"
import fs from "node:fs/promises"
import path from "node:path"
import os from "node:os"
import { pathToFileURL } from "node:url"

export async function loadRouteMeta(root = process.cwd()) {
  const outDir = await fs.mkdtemp(path.join(os.tmpdir(), "lh-routemeta-"))
  await build({
    root,
    logLevel: "error",
    configFile: path.join(root, "vite.config.ts"),
    build: {
      ssr: path.join(root, "src/routes.meta.ts"),
      outDir,
      emptyOutDir: true,
      write: true,
      minify: false,
      rollupOptions: { output: { entryFileNames: "routes.meta.mjs" } },
    },
  })
  const mod = await import(pathToFileURL(path.join(outDir, "routes.meta.mjs")).href)
  await fs.rm(outDir, { recursive: true, force: true })
  return mod
}
