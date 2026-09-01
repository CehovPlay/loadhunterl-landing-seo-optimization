import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { assertNoCollisions, DETAIL_ROUTES, detailBySlug } from "@/content/routes"
import { PageSkeleton, pageMetadata } from "@/components/PageSkeleton"

/**
 * Generated detail pages, at the root.
 *
 * Articles, case studies and comparisons all live at a root-level slug under
 * §5.2, so they share one dynamic segment and are told apart by the registry
 * in `content/routes.ts` rather than by a URL prefix. Tabs 40, 41 and 42 are
 * their templates.
 *
 * `dynamicParams = false` is the enforcement half of the policy: only slugs the
 * registry knows resolve, and anything else 404s instead of rendering an empty
 * template at an indexable URL.
 */
export const dynamicParams = false

export function generateStaticParams() {
  assertNoCollisions()
  return DETAIL_ROUTES.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const route = detailBySlug(slug)
  if (!route) return {}
  const base = pageMetadata(route.template)
  return { ...base, title: route.title, alternates: { canonical: `/${slug}` } }
}

export default async function DetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const route = detailBySlug(slug)
  if (!route) notFound()
  return <PageSkeleton num={route.template} />
}
