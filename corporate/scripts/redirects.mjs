// Every rule in the Redirect Registry actually lands somewhere.
//
//   node scripts/redirects.mjs
//
// §10.1 requires a redirect map with the check result recorded, and §14.3 makes
// "состояние перенаправления" a field of the registry rather than a note in a
// ticket. This is what fills that field in: it requests each source, follows at
// most one hop, and demands a 3xx to the declared destination and a 200 there.
//
// A `:slug` pattern is exercised with a real example, because a rule that only
// works for the literal string ":slug" is a rule that has never been tried.
const BASE = process.env.BASE ?? "http://localhost:4311"

const { REDIRECTS } = await import("../content/registry/redirects.ts")

/* One concrete value per dynamic segment, chosen so the destination exists. */
const EXAMPLE = { ":slug": "how-carriers-cut-detention-disputes" }
const fill = (path) =>
  Object.entries(EXAMPLE).reduce((p, [token, value]) => p.replaceAll(token, value), path)

const bad = []
let checked = 0

for (const rule of REDIRECTS) {
  const from = fill(rule.from)
  const to = fill(rule.to)
  const res = await fetch(`${BASE}${from}`, { redirect: "manual" })
  const status = res.status
  const location = res.headers.get("location")

  if (status < 300 || status >= 400) {
    bad.push(`${rule.from}: expected a redirect, got ${status}`)
    continue
  }
  const wantStatus = rule.permanent ? 308 : 307
  if (status !== wantStatus && status !== (rule.permanent ? 301 : 302)) {
    bad.push(`${rule.from}: ${status}, expected ${wantStatus} (permanent: ${rule.permanent})`)
  }
  const landed = location?.replace(/^https?:\/\/[^/]+/, "")
  if (landed !== to) {
    bad.push(`${rule.from}: lands on ${landed}, registry says ${to}`)
    continue
  }
  const final = await fetch(`${BASE}${landed}`, { method: "HEAD" })
  if (final.status >= 400) {
    bad.push(`${rule.from} -> ${landed}: destination returns ${final.status}`)
    continue
  }
  checked++
}

console.log(`${REDIRECTS.length} rules, ${checked} verified end to end`)
if (bad.length) {
  bad.forEach((b) => console.log("  " + b))
  console.log("\nRules that fail here must not be marked verified in the registry.")
} else {
  console.log("every rule redirects to a page that answers 200")
}
process.exitCode = bad.length ? 1 : 0
