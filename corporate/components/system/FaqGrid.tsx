import { Plus } from "@phosphor-icons/react/dist/ssr"
import type { TzPage } from "@/content/tz"
import { untranslated } from "@/components/blocks/kit"
import { Reveal } from "./Reveal"
import { SectionHead } from "./SectionHead"

/**
 * FAQ in two columns.
 *
 * cosmoq splits its FAQ into two columns filled left-to-right, with a plus on
 * the right of each row and a hairline under it. That is worth taking: at five
 * questions a single column leaves half the page empty, and at fourteen -
 * which /pricing has - a single column is a scroll of its own.
 *
 * Native details/summary rather than a scripted accordion, matching the
 * homepage: it opens without JavaScript, it is already in the keyboard order,
 * screen readers announce the state, and find-in-page reaches closed answers.
 * The plus rotates into a minus with CSS on the open state, no script.
 *
 * The block only renders when the page has questions, because FAQPage markup is
 * permitted solely when the FAQ is visible to the visitor.
 *
 * Split in two: `FaqList` is the two-column disclosure, `FaqGrid` is the
 * specification page's framing around it. The directory has questions too but
 * no page tab and no spec-derived heading, so it renders the list directly
 * rather than inheriting a header that talks about the document.
 */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  if (!items.length) return null
  return (
    <div className="grid gap-x-12 md:grid-cols-2">
      {items.map((item, i) => (
          <Reveal key={item.q} delay={Math.min(i, 6) * 40}>
            <details className="group border-b border-rule">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-body text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                <span {...untranslated(item.q)} className="max-w-[42ch]">
                  {item.q}
                </span>
                <Plus
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-ink-4 transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p {...untranslated(item.a)} className="max-w-[54ch] pb-6 text-small text-ink-2">
                {item.a}
              </p>
            </details>
        </Reveal>
      ))}
    </div>
  )
}

export function FaqGrid({ page }: { page: TzPage }) {
  if (!page.faq.length) return null

  return (
    <section id="faq" className="scroll-mt-28 py-20 md:py-28">
      <SectionHead
        label="FAQ"
        title="Questions this page has to answer."
        supporting={`${page.faq.length} answers, published as written in the specification.`}
        rule="full"
      />
      <FaqList items={page.faq} />
    </section>
  )
}
