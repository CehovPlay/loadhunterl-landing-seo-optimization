import { PageSkeleton } from "@/components/PageSkeleton"

/**
 * 404 — TZ tab 39.
 *
 * Next renders this for every unmatched route, which is the only address it
 * should have: §5.2 does not create a public /404, and tab 39's printed
 * canonical would make an error page indexable, so `NOINDEX` overrides it.
 * The conflict is item 5 in the TZ README.
 */
export default function NotFound() {
  return <PageSkeleton num={39} />
}
