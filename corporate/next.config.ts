import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root holds the extension landing; this app is a sibling package,
  // so Turbopack has to be told which lockfile is ours.
  turbopack: { root: __dirname },
  // The floating dev badge overlaps the bottom-left of the composition while
  // screenshotting; it has no effect on the production build.
  devIndicators: false,
  // The repo documents its own conventions in CLAUDE.md at the root.
  agentRules: false,
  // TZ §14.1 and §43.1 require every indexable string to be server-rendered and
  // readable without animation or hydration. Nothing here opts a route out.
}

export default nextConfig
