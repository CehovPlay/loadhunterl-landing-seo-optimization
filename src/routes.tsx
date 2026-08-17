import type { ReactElement } from "react"
import { BlogIndex } from "@/pages/BlogIndex"
import { ContentPage } from "@/pages/ContentPage"
import { FaqPage } from "@/pages/FaqPage"
import { SEO_PAGES } from "@/content/pages"
import { normalizePath, ROUTE_META, type RouteMeta } from "@/routes.meta"

/**
 * Route metadata (src/routes.meta.ts) joined with what to render.
 *
 * The homepage renderer is injected by App rather than imported here, so the
 * code-split landing chunks are not pulled into every standalone page's bundle.
 */

export type RouteDef = RouteMeta & { render: () => ReactElement }

let renderHome: () => ReactElement = () => <div />
export function setHomeRenderer(fn: () => ReactElement) {
  renderHome = fn
}

const RENDERERS: Record<string, () => ReactElement> = {
  "/": () => renderHome(),
  "/faq/": () => <FaqPage />,
  "/blog/": () => <BlogIndex />,
  ...Object.fromEntries(
    SEO_PAGES.map((p) => [p.path, () => <ContentPage page={p} />] as const),
  ),
}

export const ROUTES: RouteDef[] = ROUTE_META.map((m) => ({
  ...m,
  render: RENDERERS[m.path],
}))

export function matchRoute(pathname: string): RouteDef | undefined {
  return ROUTES.find((r) => r.path === normalizePath(pathname))
}

export { canonical } from "@/routes.meta"
