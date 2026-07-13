import path from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // cache-stable vendor chunks so React/GSAP/Lenis aren't re-downloaded
        // on every app-code deploy; the three device canvases are already
        // code-split via React.lazy in App.tsx.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return "vendor-react"
          if (/node_modules\/(gsap|lenis)\//.test(id)) return "vendor-anim"
        },
      },
    },
  },
})
