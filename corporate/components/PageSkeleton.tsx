import type { Metadata } from "next"
import { BRAND } from "@/content/registry"
import { artFor, type Archetype } from "@/content/art"
import { byNum, NOINDEX, SITE_URL_FALLBACK } from "@/content/tz/meta"
import type { TzPage } from "@/content/tz"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { FaqGrid } from "@/components/system/FaqGrid"
import { PageCloser } from "@/components/system/PageCloser"
import { PageHero } from "@/components/system/PageHero"
import {
  BentoBlock,
  ConstellationBlock,
  DocumentBlock,
  OrbBlock,
  SplitBlock,
  StatementBlock,
} from "@/components/blocks/layout"
import {
  JourneyBlock,
  RailBlock,
  SelectorBlock,
  StepsBlock,
} from "@/components/blocks/interactive"
import { FormBlock, InversionBlock, MatrixBlock } from "@/components/blocks/data"
import type { BlockProps } from "@/components/blocks/kit"

/**
 * One page, assembled from its specification and its art direction.
 *
 * The 47 routes are all this component with a different tab number. That is
 * deliberate and it is the only way a 47-page skeleton stays reviewable: when
 * the block archetypes improve, every page improves, and when the document
 * changes, re-running the parser changes the pages. Nothing here decides what a
 * page says - `content/tz` owns the words and `content/art` owns the shapes.
 *
 * The page's own geometry follows the homepage: one padded container so every
 * section shares a left edge, the header floating above it, the footer as a
 * full-bleed dark band below it.
 */

const ARCHETYPES: Record<Archetype, (props: BlockProps) => React.ReactElement> = {
  split: SplitBlock,
  selector: SelectorBlock,
  steps: StepsBlock,
  journey: JourneyBlock,
  bento: BentoBlock,
  statement: StatementBlock,
  inversion: InversionBlock,
  matrix: MatrixBlock,
  rail: RailBlock,
  form: FormBlock,
  constellation: ConstellationBlock,
  orb: OrbBlock,
  document: DocumentBlock,
}

export function PageSkeleton({ num }: { num: number }) {
  const page = byNum(num)
  const art = artFor(num)

  /* One inversion per page, at most. The art map is hand-written and a second
     dark band on one page would read as a theme switch rather than as the
     page's middle, so any later one degrades to a statement. Resolved up front
     rather than while mapping, so the rhythm is a value and not a side effect
     of render order. */
  const firstInversion = art.rhythm.indexOf("inversion")
  const rhythm: Archetype[] = page.blocks.map((_, i) => {
    const kind = art.rhythm[i] ?? "split"
    return kind === "inversion" && i !== firstInversion ? "statement" : kind
  })

  return (
    <>
      <Header />
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[1400px] px-5 md:px-10">
        <main id="main">
          <PageHero page={page} art={art} />

          {page.blocks.map((block, i) => {
            const Archetype = ARCHETYPES[rhythm[i]]
            return (
              <Archetype
                key={block.n}
                block={block}
                index={i}
                total={page.blocks.length}
                motif={art.motif}
                page={page}
              />
            )
          })}

          <FaqGrid page={page} />
          <PageCloser page={page} art={art} />
        </main>
      </div>
      <Footer />
      <PageJsonLd page={page} />
    </>
  )
}

/**
 * Page-level markup.
 *
 * Organization and WebSite are global and already emitted by the layout, so a
 * page adds WebPage and BreadcrumbList, and FAQPage only when it renders a
 * visible FAQ - the condition every tab attaches to it. SoftwareApplication is
 * never emitted from here: the tabs allow it only for a real product, which is
 * a per-page decision rather than a template one.
 *
 * Nothing is emitted for a noindex route.
 */
function PageJsonLd({ page }: { page: TzPage }) {
  if (NOINDEX.has(page.url)) return null
  const url = page.seo.canonical || `${SITE_URL_FALLBACK}${page.url}`

  const graph: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.seo.title,
      description: page.seo.description,
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL_FALLBACK },
        { "@type": "ListItem", position: 2, name: page.name, item: url },
      ],
    },
  ]

  if (page.faq.length) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

/**
 * Metadata from the tab's own SEO section.
 *
 * The canonical is the document's, not a computed one, because five tabs print
 * a canonical that differs from their URL and those are conflicts the owner has
 * to settle rather than differences a template should paper over. The one
 * exception is /404: an indexable self-canonical on an error page is forbidden
 * by the URL registry, so noindex wins there regardless of what the tab prints.
 */
const snippet = (text: string, max = 155): string => {
  if (!text || text.length <= max) return text
  const cut = text.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "\u2026"
}

export function pageMetadata(num: number): Metadata {
  const page = byNum(num)
  const noindex = NOINDEX.has(page.url)

  /* Four tabs (43, 44, 45 and 34) give a title but no meta description. The
     supporting line under the H1 is approved copy for that same page and says
     what the page is, so it stands in rather than a sentence invented here -
     trimmed at a word to the length a result snippet shows. */
  const description = page.seo.description || snippet(page.hero.supporting)

  return {
    title: page.seo.title || page.name,
    description,
    alternates: noindex ? undefined : { canonical: page.seo.canonical || page.url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: noindex
      ? undefined
      : {
          type: "website",
          url: page.seo.canonical || page.url,
          siteName: "LoadHunter",
          title: page.hero.h1,
          description: page.hero.supporting,
          /* Declaring an openGraph object here replaces the one Next builds
             from app/opengraph-image.tsx, so the image is named explicitly.
             §10.1 requires every indexable page to carry one. */
          images: [
            {
              ...BRAND.socialImage,
              alt: `${BRAND.name} - ${BRAND.category}`,
            },
          ],
        },
  }
}
