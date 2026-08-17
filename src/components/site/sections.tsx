import { useId, useState } from "react"
import {
  BLOG_TEASER,
  DEMO,
  DIFFERENTIATION,
  HOW_IT_WORKS,
  REGIONAL,
  USE_CASES,
} from "@/content/copy"
import { BLOG_POSTS } from "@/content/blog"
import { track } from "@/lib/analytics"
import { APP_URL, CHROME_STORE_URL } from "@/sections/Navbar"

/**
 * The sections the brief adds to the homepage, written ONCE and rendered in
 * both trees.
 *
 * Each takes `flow`: `false` (default) targets the 1920 desktop canvas
 * (px-[120px] gutters, canvas type scale), `true` targets the flow layout
 * (fluid container, clamp type). Sharing the component is what keeps desktop
 * and mobile content identical, which QA-005 and LH-068 require.
 *
 * Heights are content-driven everywhere (LH-015): none of these sections
 * declare a fixed pixel height.
 */

function Shell({
  id,
  flow,
  dark = false,
  labelledBy,
  children,
}: {
  id: string
  flow: boolean
  dark?: boolean
  labelledBy: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={
        (dark ? "bg-gray-800 " : "bg-bg-light ") +
        "relative w-full " +
        (flow ? "py-16" : "px-[120px] py-[96px]")
      }
    >
      <div className={flow ? "mx-auto w-full max-w-[440px] px-5 md:max-w-[768px] md:px-8" : "mx-auto w-full max-w-[1280px]"}>
        {children}
      </div>
    </section>
  )
}

/** Section heading, LH-014 type scale (H2 44/52 desktop). */
function H2({
  id,
  flow,
  dark = false,
  children,
}: {
  id: string
  flow: boolean
  dark?: boolean
  children: React.ReactNode
}) {
  return (
    <h2
      id={id}
      className={
        (dark ? "text-white " : "text-ink ") +
        (flow
          ? "text-[clamp(26px,6.6vw,32px)] leading-[1.2] md:text-[40px] md:leading-[48px] "
          : "text-[44px] leading-[52px] ") +
        "font-medium tracking-[-0.03em]"
      }
    >
      {children}
    </h2>
  )
}

function Lead({
  flow,
  dark = false,
  children,
}: {
  flow: boolean
  dark?: boolean
  children: React.ReactNode
}) {
  return (
    <p
      className={
        (dark ? "text-[rgba(255,255,255,0.65)] " : "text-ink/75 ") +
        (flow ? "text-[16px] leading-[24px] " : "text-[18px] leading-[26px] ") +
        "mt-4 max-w-[900px] font-medium tracking-[-0.02em]"
      }
    >
      {children}
    </p>
  )
}

/* --------------------------------------------------------- how it works --- */

/** LH-024 / SEO-008 — three-step onboarding, so time-to-value is explicit. */
export function HowItWorks({ flow = false }: { flow?: boolean }) {
  return (
    <Shell id="how-it-works" flow={flow} labelledBy="how-it-works-title">
      <H2 id="how-it-works-title" flow={flow}>
        {HOW_IT_WORKS.h2}
      </H2>

      <ol
        className={
          "mt-10 grid gap-5 " + (flow ? "grid-cols-1 md:grid-cols-3" : "grid-cols-3 gap-[24px]")
        }
      >
        {HOW_IT_WORKS.steps.map((s) => (
          <li
            key={s.n}
            className="flex flex-col gap-4 rounded-lg border border-border-light bg-white p-6"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-violet/10 text-[15px] font-medium text-violet">
              {s.n}
            </span>
            <h3
              className={
                (flow ? "text-[18px] leading-[26px] " : "text-[20px] leading-[28px] ") +
                "font-medium tracking-[-0.02em] text-ink"
              }
            >
              {s.title}
            </h3>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noopener"
          onClick={() => track("hero_chrome_click")}
          className="inline-flex h-[48px] items-center rounded-full bg-violet px-[24px] text-[15px] font-medium leading-[20px] tracking-[-0.02em] text-white"
        >
          Add LoadHunter to Chrome
        </a>
        <p className="text-[14px] font-medium leading-[20px] text-ink/70">
          Requires an active account with the load board you use.
        </p>
      </div>
    </Shell>
  )
}

/* ------------------------------------------------------- differentiation --- */

/**
 * LH-022 / LH-023 — why teams pick this over more tabs and copy-paste.
 * Only verifiable characteristics, and deliberately NO competitor names on the
 * homepage (the columns are workflow archetypes, not products).
 */
export function Differentiation({ flow = false }: { flow?: boolean }) {
  return (
    <Shell id="why-teams-choose" flow={flow} labelledBy="differentiation-title">
      <H2 id="differentiation-title" flow={flow}>
        {DIFFERENTIATION.h2}
      </H2>

      <ul
        className={
          "mt-8 grid gap-4 " + (flow ? "grid-cols-1 md:grid-cols-2" : "grid-cols-4")
        }
      >
        {DIFFERENTIATION.proofPoints.map((p) => (
          <li
            key={p}
            className="flex items-start gap-3 rounded-lg border border-border-light bg-white p-5"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-violet"
              fill="currentColor"
            >
              <path d="M9.6 16.2 5.4 12l1.4-1.4 2.8 2.8 7.6-7.6L18.6 7 9.6 16.2z" />
            </svg>
            <span className="text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink">
              {p}
            </span>
          </li>
        ))}
      </ul>

      {/* the table scrolls inside its own box so the page never scrolls sideways */}
      <div className="mt-10 overflow-x-auto rounded-lg border border-border-light bg-white">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <caption className="sr-only">
            How the same dispatch tasks are handled in a manual workflow, in a generic TMS and in
            LoadHunter
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-[40%] px-5 py-4 text-[14px] font-medium text-ink/60">
                Capability
              </th>
              {DIFFERENTIATION.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className={
                    "px-5 py-4 text-[14px] font-medium " +
                    (c === "LoadHunter" ? "text-violet" : "text-ink/60")
                  }
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DIFFERENTIATION.rows.map((r) => (
              <tr key={r.label} className="border-t border-border-light">
                <th
                  scope="row"
                  className="px-5 py-4 text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink"
                >
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td key={DIFFERENTIATION.columns[i]} className="px-5 py-4">
                    {v ? (
                      <svg
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label="Yes"
                        className="size-5 text-violet"
                        fill="currentColor"
                      >
                        <path d="M9.6 16.2 5.4 12l1.4-1.4 2.8 2.8 7.6-7.6L18.6 7 9.6 16.2z" />
                      </svg>
                    ) : (
                      <span role="img" aria-label="No" className="text-ink/30">
                        &ndash;
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}

/* ------------------------------------------------------------ use cases --- */

/**
 * LH-034 — role-based entry. The same feature set, different outcomes per
 * segment; "Small carriers" is preselected. Tabs follow the WAI-ARIA tabs
 * pattern (arrow keys move focus, roving tabindex) and every panel stays in the
 * DOM so the copy is crawlable, not duplicated per tab.
 */
export function UseCases({ flow = false }: { flow?: boolean }) {
  const uid = useId()
  const [active, setActive] = useState<string>(USE_CASES.defaultTab)
  const ids: string[] = USE_CASES.tabs.map((t) => t.id)

  function onKeyDown(e: React.KeyboardEvent) {
    const i = ids.indexOf(active)
    let next: number | null = null
    if (e.key === "ArrowRight") next = (i + 1) % ids.length
    else if (e.key === "ArrowLeft") next = (i - 1 + ids.length) % ids.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = ids.length - 1
    if (next != null) {
      e.preventDefault()
      setActive(ids[next])
      document.getElementById(`${uid}-tab-${ids[next]}`)?.focus()
    }
  }

  return (
    <Shell id="use-cases" flow={flow} labelledBy="use-cases-title">
      <H2 id="use-cases-title" flow={flow}>
        {USE_CASES.h2}
      </H2>

      <div
        role="tablist"
        aria-label="Operation type"
        onKeyDown={onKeyDown}
        className="mt-8 flex flex-wrap gap-2"
      >
        {USE_CASES.tabs.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              id={`${uid}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                setActive(t.id)
                track("feature_expand", { section: "use-cases", tab: t.id })
              }}
              className={
                "h-[44px] rounded-full px-5 text-[15px] font-medium leading-[20px] tracking-[-0.02em] transition-colors " +
                (selected
                  ? "bg-violet text-white"
                  : "border border-border-light bg-white text-ink hover:border-violet/40")
              }
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {USE_CASES.tabs.map((t) => (
        <div
          key={t.id}
          id={`${uid}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${t.id}`}
          hidden={t.id !== active}
          className="mt-8"
        >
          <ul className={"grid gap-4 " + (flow ? "grid-cols-1 md:grid-cols-3" : "grid-cols-3")}>
            {t.outcomes.map((o) => (
              <li
                key={o}
                className="rounded-lg border border-border-light bg-white p-5 text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink"
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Shell>
  )
}

/* --------------------------------------------------------- product demo --- */

/**
 * LH-073 — the full load-to-broker workflow in one place.
 *
 * ASSET GAP: no recorded demo exists yet. Until `VITE_DEMO_VIDEO_URL` (or a
 * file dropped at public/demo/workflow.mp4) is supplied, this renders the three
 * workflow stages as text over the product screenshot instead of claiming a
 * video that does not play. Do not ship a fake play button.
 */
export function ProductDemo({ flow = false }: { flow?: boolean }) {
  const videoUrl = import.meta.env.VITE_DEMO_VIDEO_URL as string | undefined
  const stages = ["Detect relevant loads", "Evaluate profit and risk", "Contact the broker"]

  return (
    <Shell id="demo" flow={flow} labelledBy="demo-title">
      <H2 id="demo-title" flow={flow}>
        {DEMO.h2}
      </H2>
      <Lead flow={flow}>{DEMO.lead}</Lead>

      <div className="mt-8 overflow-hidden rounded-lg border border-border-light bg-white">
        {videoUrl ? (
          <video
            controls
            preload="none"
            poster="/figma/hero-dashboard-2x.png"
            onPlay={() => track("demo_start")}
            className="block w-full"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser cannot play this video.
          </video>
        ) : (
          <img
            src="/figma/hero-dashboard-2x.png"
            alt="LoadHunter workflow inside the load board: filtered loads, the profit view and the broker email step"
            loading="lazy"
            decoding="async"
            className="block w-full"
          />
        )}
      </div>

      <ol className={"mt-6 grid gap-4 " + (flow ? "grid-cols-1 md:grid-cols-3" : "grid-cols-3")}>
        {stages.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet/10 text-[13px] font-medium text-violet">
              {i + 1}
            </span>
            <span className="text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink">
              {s}
            </span>
          </li>
        ))}
      </ol>
    </Shell>
  )
}

/* -------------------------------------------------------- regional proof --- */

/** LH-035 — geography stated plainly, with no fabricated local presence. */
export function RegionalProof({ flow = false }: { flow?: boolean }) {
  return (
    <Shell id="regional" flow={flow} labelledBy="regional-title">
      <H2 id="regional-title" flow={flow}>
        {REGIONAL.h2}
      </H2>
      <Lead flow={flow}>{REGIONAL.body}</Lead>
    </Shell>
  )
}

/* --------------------------------------------------------- blog teaser --- */

/**
 * LH-074 — three current articles before the footer, so the homepage passes
 * internal weight to /blog/.
 *
 * Renders NOTHING while `BLOG_POSTS` is empty. The brief's acceptance criterion
 * is "three REAL published articles are visible"; three cards pointing at pages
 * that do not exist would be dead links (LH-048) and thin content, so the
 * section appears the moment the cluster is published and not before.
 */
export function BlogTeaser({ flow = false }: { flow?: boolean }) {
  const posts = BLOG_POSTS.slice(0, 3)
  if (posts.length < 3) return null

  return (
    <Shell id="blog-teaser" flow={flow} dark labelledBy="blog-teaser-title">
      <H2 id="blog-teaser-title" flow={flow} dark>
        {BLOG_TEASER.h2}
      </H2>
      <Lead flow={flow} dark>
        {BLOG_TEASER.lead}
      </Lead>

      <ul className={"mt-8 grid gap-5 " + (flow ? "grid-cols-1 md:grid-cols-3" : "grid-cols-3")}>
        {posts.map((p) => (
          <li key={p.slug}>
            <a
              href={`/blog/${p.slug}/`}
              onClick={() => track("blog_click", { slug: p.slug })}
              className="flex h-full flex-col rounded-lg border border-gray-650 p-6 transition-colors hover:border-violet/60"
            >
              <span className="text-[13px] font-medium leading-[18px] text-violet-300">
                {p.category}
              </span>
              <h3 className="mt-2 text-[20px] font-medium leading-[28px] tracking-[-0.02em] text-white">
                {p.title}
              </h3>
              <p className="mt-3 flex-1 text-[15px] font-medium leading-[22px] text-[rgba(255,255,255,0.65)]">
                {p.excerpt}
              </p>
              <span className="mt-5 text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.45)]">
                Updated {p.updated}
              </span>
              <span className="mt-2 text-[14px] font-medium leading-[20px] text-violet-300">
                {BLOG_TEASER.cta}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Shell>
  )
}

/* ---------------------------------------------------------- sticky CTA --- */

/**
 * LH-067 — compact sticky trial CTA on the flow layout, shown after the hero
 * leaves the screen and hidden again near the pricing and final CTA blocks so
 * it never competes with them. Fixed positioning reserves no layout space, so
 * CLS stays 0.
 */
export function StickyMobileCta({ visible }: { visible: boolean }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden"
      style={{
        transform: visible ? "translateY(0)" : "translateY(120%)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
      }}
      aria-hidden={!visible}
    >
      <div className="mx-auto w-full max-w-[440px] px-5 md:max-w-[768px] md:px-8">
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener"
          tabIndex={visible ? 0 : -1}
          onClick={() => track("hero_trial_click", { placement: "sticky" })}
          className="pointer-events-auto flex h-[56px] w-full items-center justify-center rounded-full bg-violet text-[16px] font-medium leading-[20px] tracking-[-0.02em] text-white shadow-[0px_10px_30px_-8px_rgba(111,81,151,0.6)]"
        >
          Start free trial
        </a>
      </div>
    </div>
  )
}
