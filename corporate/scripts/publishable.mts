/**
 * Everything the specification says must be settled before the site goes public.
 *
 *   npx tsx scripts/publishable.mts
 *
 * §3.6 blocks a claim with no owner, source or check date. §18.3 blocks seven
 * subjects without recorded approval. §15.3 blocks an install button with no
 * verified address. §10.1 blocks a redirect nobody has followed. Each of those
 * is a person's decision, not a coding error, so this runs on demand and before
 * a deploy rather than inside `next build` - failing the build would stop the
 * work that produces the pages those people have to review.
 *
 * Exit code 1 when anything is outstanding, so a deploy pipeline can gate on it.
 */

import { publicationBlockers } from "../content/registry"

const blockers = publicationBlockers()

if (!blockers.length) {
  console.log("Nothing outstanding. Every registry entry is owned, sourced and checked.")
  process.exit(0)
}

const byRegistry = new Map<string, typeof blockers>()
for (const b of blockers) {
  if (!byRegistry.has(b.registry)) byRegistry.set(b.registry, [])
  byRegistry.get(b.registry)!.push(b)
}

console.log(`${blockers.length} items block publication.\n`)
for (const [registry, items] of byRegistry) {
  console.log(`${registry} Registry (${items.length})`)
  for (const item of items) console.log(`  ${item.item}\n    ${item.reason}`)
  console.log("")
}
process.exitCode = 1
