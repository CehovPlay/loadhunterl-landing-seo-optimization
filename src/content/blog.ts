/**
 * Published blog posts (BLOG-002..015).
 *
 * EMPTY ON PURPOSE. This pass ships the /blog/ route, its H1, the five approved
 * categories and the header/footer links; writing, fact-checking and publishing
 * the articles is the separate content task the owner scheduled for later.
 *
 * Consequences of the array being empty, all automatic:
 *  - /blog/ renders its "first guides are being written" state;
 *  - /blog/ is served noindex and left out of sitemap.xml, so an empty hub is
 *    never submitted to search as thin content (see src/routes.tsx);
 *  - the homepage "Latest from the Dispatch Blog" teaser (LH-074) does not
 *    render, so the page carries no links to pages that do not exist.
 *
 * Adding entries here reverses all three at once. Each post also needs a real
 * page at /blog/<slug>/ with Article + BreadcrumbList schema before it is
 * listed.
 */
export type BlogPost = {
  slug: string
  title: string
  category: string
  excerpt: string
  /** ISO date, shown as the "updated" stamp */
  updated: string
  readingMinutes: number
}

export const BLOG_POSTS: BlogPost[] = []

/**
 * The planned cluster from the brief, kept as a checklist for whoever writes
 * them. These are NOT rendered anywhere — a title without an article is not a
 * link.
 */
export const PLANNED_POSTS = [
  { id: "BLOG-002", slug: "best-chrome-extensions-for-dat-one", title: "Best Chrome Extensions for DAT One in 2026" },
  { id: "BLOG-003", slug: "truckstop-workflow-automation", title: "How to Automate Repetitive Work in Truckstop" },
  { id: "BLOG-004", slug: "dat-one-vs-truckstop-carriers", title: "DAT One vs Truckstop for Carriers: Workflow, Tools and Use Cases" },
  { id: "BLOG-005", slug: "calculate-rate-per-mile-with-deadhead", title: "How to Calculate Rate per Mile With Deadhead" },
  { id: "BLOG-006", slug: "automate-broker-emails-from-load-boards", title: "How to Automate Broker Emails From Your Load Board" },
  { id: "BLOG-007", slug: "telegram-load-alerts-dat-truckstop", title: "How Telegram Load Alerts Help Teams React Faster" },
  { id: "BLOG-008", slug: "dispatch-software-small-trucking-companies", title: "Dispatch Software for Small Trucking Companies: What Actually Matters" },
  { id: "BLOG-009", slug: "owner-operator-load-board-workflow", title: "A Faster Load-Board Workflow for Owner-Operators" },
  { id: "BLOG-010", slug: "evaluate-brokers-before-booking", title: "How Carriers Can Evaluate Brokers Before Pursuing a Load" },
  { id: "BLOG-011", slug: "ai-freight-dispatch-software-guide", title: "AI Tools for Load-Board Workflows: A Practical 2026 Guide" },
  { id: "BLOG-012", slug: "chrome-extension-vs-tms-dispatch-workflow", title: "Load-Board Extension vs TMS: Where Each Tool Fits" },
  { id: "BLOG-013", slug: "find-high-rpm-loads-faster", title: "How to Find High-RPM Loads Without Adding More Tabs" },
  { id: "BLOG-014", slug: "what-is-load-board-automation", title: "What Is Load Board Automation?" },
  { id: "BLOG-015", slug: "dispatch-workflow-checklist", title: "Dispatch Workflow Checklist for Busy Carrier Teams" },
] as const
