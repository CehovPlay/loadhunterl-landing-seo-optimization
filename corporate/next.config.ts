import type { NextConfig } from "next"
import { nextRedirects } from "./content/registry/redirects"

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

  // §10.1 and §14.3 - the Redirect Registry, applied. The rules exist because
  // §5.2 forbids the nested address shapes every other SaaS site uses, and a
  // link written from that habit should land on the page rather than on a 404.
  redirects: async () => nextRedirects(),
}

export default nextConfig
