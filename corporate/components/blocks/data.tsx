import { Reveal } from "@/components/system/Reveal"
import { WordReveal } from "@/components/system/WordReveal"
import { Motif } from "@/components/system/Motif"
import { Ordinal } from "@/components/system/atoms"
import {
  BlockAction,
  BlockIntro,
  BlockSection,
  Cta,
  enumeration,
  isBuildNote,
  SpecCaption,
  untranslated,
  type BlockProps,
} from "./kit"

/**
 * The archetypes that carry structured content: a table, a form, and the one
 * inverted band each long page is allowed.
 */

/**
 * A table.
 *
 * Neither reference has a real one - cosmoq's pricing is three cards - but the
 * specification asks for comparison and capability matrices repeatedly, and
 * three cards cannot answer "which of these two supports my workflow". The
 * table therefore borrows only the surface treatment: hairline rules, one
 * washed column for the recommended option, tabular figures.
 */
/**
 * Splits an enumerating sentence into its items. "Name, provider, purpose,
 * duration and category." becomes five columns - which is what several tabs
 * are literally specifying when they write an H3 like that, and reading them
 * out of the copy beats inventing headers.
 */
function enumerate(sentence: string): string[] {
  return sentence
    .replace(/\.$/, "")
    .split(/,\s*|\s+and\s+|\s*\/\s*/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && s.length < 34)
}

export function MatrixBlock({ block, page, total }: BlockProps) {
  const fromHeading = enumerate(block.h3)
  const columns = fromHeading.length >= 3 && fromHeading.length <= 6
    ? fromHeading.slice(1)
    : ["Scope", "Owner", "Status"]

  /* Rows come from a list the document announces. Sentences are not rows:
     cutting the paragraph at every full stop used to fill the table with half
     of a thought per line. Where there is no list, the table holds its shape
     with placeholder rows instead - the shape is the point of a skeleton, the
     invented rows never were. */
  const listed = enumeration(block.text)
  const rows = listed && listed.items.length >= 2 ? listed.items.slice(0, 6) : ["", "", ""]
  const intro = listed ? { ...block, text: listed.rest } : block

  return (
    <BlockSection id={`block-${block.n}`}>
      <BlockIntro block={intro} total={total} wide className="max-w-[52ch]" />
      <Reveal delay={80} className="mt-12">
        <div className="overflow-x-auto rounded-card border border-rule bg-paper-2 shadow-[var(--shadow-lift)]">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="w-2/5 px-6 py-4 text-meta font-normal tracking-[0.06em] text-ink-3">
                  {fromHeading.length >= 3 ? fromHeading[0] : block.name}
                </th>
                {columns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={
                      "px-6 py-4 text-meta font-normal tracking-[0.06em] text-ink-3 " +
                      (i === 1 ? "bg-violet-wash" : "")
                    }
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="border-b border-rule-soft last:border-0">
                  <th scope="row" className="px-6 py-5 text-body font-normal text-ink first-letter:uppercase">
                    {row || (
                      <span
                        aria-hidden
                        className="block h-2 rounded-full bg-paper-3"
                        style={{ width: ["62%", "48%", "56%"][r % 3] }}
                      />
                    )}
                    {row ? null : <span className="sr-only">Row not written yet</span>}
                  </th>
                  {columns.map((c, i) => (
                    <td
                      key={c}
                      className={"px-6 py-5 text-small text-ink-3 " + (i === 1 ? "bg-violet-wash" : "")}
                    >
                      <span aria-hidden className="block h-2 w-12 rounded-full bg-paper-3" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SpecCaption className="mt-4">{block.visual}</SpecCaption>
      </Reveal>
      <BlockAction block={block} page={page} />
    </BlockSection>
  )
}

/**
 * Recap beside a form.
 *
 * Every audience page in the specification ends the same way: the visitor has
 * made selections and the form must arrive carrying them - "send context, not
 * a blank contact form". So the left column is the recap of what the page
 * collected and the right column is the form, and the recap is not decoration:
 * it is what distinguishes this from the generic contact block the TZ forbids.
 *
 * The fields are inert here. Wiring them means CRM routing, consent capture
 * and an error contract, none of which a skeleton should fake.
 */
export function FormBlock({ block, page, total }: BlockProps) {
  const recap = [
    ["Audience", page.passport.audience ?? "—"],
    ["Job", page.hypothesis || "—"],
    ["Entry point", page.url],
  ] as const

  return (
    <BlockSection id={`block-${block.n}`}>
      <div className="grid gap-10 rounded-card-lg border border-rule bg-paper-2 p-6 shadow-[var(--shadow-lift-lg)] md:grid-cols-12 md:p-12">
        <div className="md:col-span-5">
          <BlockIntro block={block} total={total} />
          <dl className="mt-10 border-t border-rule">
            {recap.map(([term, value]) => (
              <div key={term} className="border-b border-rule-soft py-4">
                <dt className="text-meta tracking-[0.06em] text-ink-3">{term}</dt>
                <dd {...untranslated(value)} className="mt-1.5 text-small text-ink-2">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <form className="flex flex-col gap-4" aria-label={block.name}>
            {[
              ["Work email", "email"],
              ["Company", "text"],
              ["Current tools", "text"],
            ].map(([label, type]) => (
              <label key={label} className="flex flex-col gap-2">
                <span className="text-small text-ink-2">{label}</span>
                <input
                  type={type}
                  disabled
                  placeholder="Not wired yet"
                  className="rounded-chip border border-rule bg-paper px-4 py-3 text-body text-ink placeholder:text-ink-4 disabled:cursor-not-allowed"
                />
              </label>
            ))}
            <SpecCaption>{block.visual}</SpecCaption>
            <p className="text-meta text-ink-4">
              Fields are inert in the skeleton. Consent capture, CRM routing and error
              states are specified for this block and are not built.
            </p>
            <BlockAction block={block} page={page} />
          </form>
        </div>
      </div>
    </BlockSection>
  )
}

/**
 * The one inversion.
 *
 * Vestora turns exactly one section of an otherwise black page bright yellow,
 * roughly halfway down, and that single reversal is what gives the scroll a
 * middle. Ours runs the other way - one near-black band on a paper page - and
 * it appears at most once per page, which `PageSkeleton` enforces.
 *
 * It reuses the footer's surface deliberately. On this site dark means "the
 * road pauses here", and having two different dark surfaces would make it mean
 * nothing.
 */
export function InversionBlock({ block, motif, page, total }: BlockProps) {
  return (
    <BlockSection id={`block-${block.n}`} bleed className="bg-night py-24 md:py-32">
      <div className="mx-auto max-w-[76rem] px-6 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <div className="flex items-center gap-3">
                <Ordinal n={block.n} />
                <span className="text-meta tracking-[0.06em] text-night-ink-2">{block.name}</span>
              </div>
            </Reveal>
            <WordReveal
              as="h3"
              tone="night"
              text={block.h3}
              className="mt-7 max-w-[20ch] text-balance text-[clamp(1.9rem,1.2rem+2vw,3rem)] leading-[1.1] font-medium tracking-[-0.04em]"
            />
            {block.text ? (
              <Reveal delay={120}>
                {isBuildNote(block.text) ? (
                  <p className="mt-6 max-w-[54ch] border-l-2 border-progress-night/60 py-2 pl-4 text-small text-night-ink-2">
                    <span className="mr-2 text-meta tracking-[0.06em] text-progress-night">
                      Copy not written
                    </span>
                    {block.text}
                  </p>
                ) : (
                  <p className="mt-6 max-w-[54ch] text-body text-night-ink-2">{block.text}</p>
                )}
              </Reveal>
            ) : null}
            {block.cta ? (
              <Reveal delay={180} className="mt-9">
                <Cta label={block.cta} page={page} tone="night" />
              </Reveal>
            ) : null}
          </div>

          <Reveal delay={100} className="md:col-span-4 md:col-start-9">
            <div className="relative flex aspect-square items-center justify-center rounded-card-lg border border-night-edge bg-night-field">
              <div
                aria-hidden
                className="absolute inset-0 rounded-card-lg"
                style={{
                  background:
                    "radial-gradient(60% 60% at 30% 25%, rgba(199,159,253,0.28) 0%, transparent 70%), radial-gradient(50% 50% at 78% 80%, rgba(255,179,82,0.22) 0%, transparent 72%)",
                }}
              />
              {motif === "orb" ? (
                <div aria-hidden className="orb relative size-40 rounded-full md:size-48" />
              ) : (
                <Motif kind={motif} className="relative size-48 opacity-90 md:size-56" />
              )}
            </div>
            <SpecCaption tone="night" className="mt-4">
              {block.visual}
            </SpecCaption>
          </Reveal>
        </div>
      </div>
    </BlockSection>
  )
}
