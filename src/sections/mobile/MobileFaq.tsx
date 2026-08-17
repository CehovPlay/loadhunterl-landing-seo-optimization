import { FaqAccordion } from "@/components/site/FaqAccordion"
import { FAQ_INTRO } from "@/content/copy"
import { Container, SectionHeader } from "./ui"

/**
 * FAQ on the flow layout — the same eight approved Q&A as desktop, rendered by
 * the shared FaqAccordion so question text, answer text, anchors and the
 * FAQPage schema can never drift between breakpoints (QA-005 content parity).
 */
export function MobileFaq() {
  return (
    <section id="faq" className="bg-gray-800 py-16">
      <Container>
        <SectionHeader
          icon="/figma/tail/faq-icon.png"
          title={FAQ_INTRO.h2}
          sub={FAQ_INTRO.lead}
        />
        <FaqAccordion className="mt-10" />
      </Container>
    </section>
  )
}
