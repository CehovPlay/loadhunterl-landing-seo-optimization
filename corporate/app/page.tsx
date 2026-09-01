import { BLOCKS, FAQ } from "@/content/home"
import { PRODUCTS_WITH_STATUS, SITE_URL, statusAnswerText } from "@/content/registry"
import { Block } from "@/components/Block"
import { Destination } from "@/components/Destination"
import { EntryPoint } from "@/components/EntryPoint"
import { Faq } from "@/components/Faq"
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { Rail } from "@/components/Rail"
import { Road } from "@/components/scene/Road"
import { StackProvider } from "@/components/StackContext"
import { StickyCta } from "@/components/StickyCta"
import { CommandProof } from "@/components/proofs/CommandProof"
import { PayProof } from "@/components/proofs/PayProof"
import { ProofRail } from "@/components/proofs/ProofRail"
import { StageDrive } from "@/components/stages/StageDrive"
import { StageLoadHunter } from "@/components/stages/StageLoadHunter"
import { StageTms } from "@/components/stages/StageTms"

/**
 * Homepage.
 *
 * The sequence is the one tab 01 specifies and nothing else: hero, then the
 * eight blocks in order, then the FAQ. Blocks 1 to 5 are the road - the same
 * sample load handed from product to product - block 6 is where the visitor
 * picks an entry point, block 7 is the proof, block 8 is the destination.
 *
 * Everything sits inside one padded container so the rail, the nodes and every
 * section share a single left edge. That shared edge is the page: §25.1 asks
 * for one road the load travels rather than a stack of unrelated blocks, and
 * the only way that reads is if the geometry is literally continuous.
 *
 * The header floats over the page rather than sitting in the flow, and the
 * footer is a full-bleed dark band, so both live outside the padded container:
 * the rail is the paper's spine and it ends where the paper does.
 *
 * The route selector's answers are shared between block 6 and block 8, which is
 * why the provider wraps the whole road rather than one section.
 */
/**
 * Page-level markup. Organization and WebSite are global and live in the
 * layout; WebPage and BreadcrumbList are the tab's page-level pair, and
 * FAQPage is emitted only because the FAQ is visible to the visitor, which is
 * the condition both the tab and §10.3 attach to it. Every answer below is the
 * text the page actually renders - including the availability answer, which is
 * assembled from the same ledger the section displays.
 *
 * SoftwareApplication is deliberately absent: the tab allows it only for a real
 * product, and this is the umbrella page, not a product page.
 */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: "LoadHunter - One Operating System for Freight Operations",
    description:
      "Connect load discovery, dispatch, driver workflows, payments and operational intelligence in one modular freight ecosystem.",
    inLanguage: "en-US",
    isPartOf: { "@id": `${SITE_URL}/#website` },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.render === "status-ledger" ? statusAnswerText(PRODUCTS_WITH_STATUS) : item.a,
      },
    })),
  },
]

export default function HomePage() {
  return (
    <StackProvider>
      <Header />
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[1400px] px-5 md:px-10">
        <Rail />
        <main id="main">
          <Hero />

          {/* Stops 01-05. The scene is pinned and the stops ride the scroll
              through it; without WebGL or with reduced motion the same five
              render as a document, in order. */}
          <Road />

          <EntryPoint />

          <Block block={BLOCKS.seven} stickProof>
            <ProofRail />
          </Block>

          <Destination />

          <Faq />
        </main>
      </div>
      <Footer />
      <StickyCta />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </StackProvider>
  )
}
