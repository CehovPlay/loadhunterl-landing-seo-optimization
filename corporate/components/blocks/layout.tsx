import { Reveal } from "@/components/system/Reveal"
import { WordReveal } from "@/components/system/WordReveal"
import { Motif } from "@/components/system/Motif"
import {
  BlockAction,
  BlockIntro,
  BlockSection,
  Card,
  BuildNote,
  isBuildNote,
  enumeration,
  ProofSlot,
  SpecCaption,
  untranslated,
  Wireframe,
  type BlockProps,
} from "./kit"

/**
 * The static archetypes: shapes that arrange copy and one proof, with no state.
 * Between them they carry most of the 245 blocks in the specification.
 */

/**
 * Copy one side, proof the other.
 *
 * The workhorse. It mirrors on odd indexes, which is the single cheapest thing
 * that stops a page of six blocks from reading as one template repeated six
 * times - both references alternate sides for exactly this reason and neither
 * ever runs three in a row on the same side.
 */
export function SplitBlock({ block, motif, page, total }: BlockProps) {
  /* No mirroring. The blocks used to alternate sides so six of them would not
     read as one repeated template; the numbered rule does that job now, and a
     column that changes sides fights the single left edge every other section
     on the site keeps. */
  return (
    <BlockSection id={`block-${block.n}`}>
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <BlockIntro block={block} total={total} wide />
          <BlockAction block={block} page={page} />
        </div>
        <Reveal delay={80} className="md:col-span-7">
          <ProofSlot motif={motif} spec={block.visual} />
        </Reveal>
      </div>
    </BlockSection>
  )
}

/**
 * Asymmetric card grid.
 *
 * cosmoq's "What sets COSMOQ apart": two wide cards, then one narrow card left
 * alone on its row. The empty half of that second row is the point - it gives
 * the section somewhere to breathe and stops the grid from reading as a table
 * of equal claims.
 */
export function BentoBlock({ block, motif, page, total }: BlockProps) {
  /* Cards come from a list the document announces, never from prose cut at
     the commas - that produced cards reading "truck" and "imported or
     integrated". With no list the grid keeps its shape and says so: three
     slots, wireframed, captioned as slots. */
  const parsed = enumeration(block.text)
  const items = parsed && parsed.items.length >= 3 ? parsed.items.slice(0, 5) : ["", "", ""]
  const intro = parsed ? { ...block, text: parsed.rest } : block

  return (
    <BlockSection id={`block-${block.n}`}>
      <BlockIntro block={intro} total={total} wide className="max-w-[52ch]" />
      <div className="mt-12 grid gap-5 md:grid-cols-6">
        {items.map((item, i) => (
          <Reveal
            key={item || `slot-${i}`}
            delay={i * 60}
            className={i < 2 ? "md:col-span-3" : "md:col-span-2"}
          >
            <Card tone={i === 0 && item ? "wash" : "plain"} className="h-full">
              <div className="relative mb-8 overflow-hidden rounded-[14px] border border-rule-soft bg-paper-3/70 p-4">
                <div aria-hidden className="dust absolute inset-0 opacity-50" />
                <Motif
                  kind={motif}
                  className="pointer-events-none absolute -right-8 -bottom-10 size-36 opacity-50"
                />
                <div className="relative">
                  <Wireframe rows={2} />
                </div>
              </div>
              <p className="text-body first-letter:uppercase">
                {item || <span className="text-meta tracking-[0.06em] text-ink-4">Content slot</span>}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
      <BlockAction block={block} page={page} />
    </BlockSection>
  )
}

/**
 * One capability, orb-centred, nothing else on screen.
 *
 * cosmoq gives its sphere a whole card to itself once per page. Used here for
 * the block that carries a page's single strongest claim - it works because it
 * is the only section that gives up its second column.
 */
export function OrbBlock({ block, motif, page, total }: BlockProps) {
  return (
    <BlockSection id={`block-${block.n}`}>
      <div className="relative overflow-hidden rounded-card-lg border border-rule bg-paper-2 px-6 py-20 shadow-[var(--shadow-lift-lg)] md:px-16 md:py-28">
        <div aria-hidden className="aurora absolute inset-0" />
        <div aria-hidden className="dust absolute inset-0 opacity-50" />
        {/* The object sits behind the sentence rather than above it. Stacked,
            a 224px motif left a third of the card empty before the reader
            reached a word; at this size it is the card's ground and the block
            is one composition instead of two. */}
        {motif === "orb" ? (
          <div
            aria-hidden
            className="orb absolute top-1/2 left-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 md:size-[34rem]"
          />
        ) : (
          <Motif
            kind={motif}
            className="pointer-events-none absolute top-1/2 left-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-30 md:size-[34rem]"
          />
        )}
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal delay={80}>
            <p {...untranslated(block.name)} className="text-meta tracking-[0.06em] text-ink-3">
              {block.name}
            </p>
            <h3 {...untranslated(block.h3)} className="display mt-5 text-balance">
              {block.h3}
            </h3>
          </Reveal>
          {block.text ? (
            <Reveal delay={140}>
              {isBuildNote(block.text) ? (
                <BuildNote>{block.text}</BuildNote>
              ) : (
                <p className="mt-5 max-w-[52ch] text-body text-ink-2">{block.text}</p>
              )}
            </Reveal>
          ) : null}
          <BlockAction block={block} page={page} />
        </div>
      </div>
    </BlockSection>
  )
}

/**
 * A chapter break.
 *
 * Vestora puts a single large sentence between product sections, resolving
 * word by word, and the page's rhythm comes almost entirely from those pauses:
 * claim, evidence, breath. Here the sentence is the block's H3 and the block's
 * copy sits under it small, which keeps the pause from becoming another
 * content section.
 */
export function StatementBlock({ block, motif, page, total }: BlockProps) {
  return (
    <BlockSection id={`block-${block.n}`} className="py-28 md:py-40">
      <div className="relative">
        <Motif
          kind={motif}
          className="pointer-events-none absolute -top-16 right-0 size-56 opacity-40 md:size-72"
        />
        <Reveal>
          <p className="text-meta tracking-[0.06em] text-ink-3">{block.name}</p>
        </Reveal>
        <WordReveal
          as="h3"
          text={block.h3}
          className="display-hero mt-8 max-w-[18ch] text-balance"
        />
        {block.text ? (
          <Reveal delay={120}>
            {isBuildNote(block.text) ? (
              <BuildNote>{block.text}</BuildNote>
            ) : (
              <p className="mt-10 max-w-[56ch] text-lead text-ink-2">{block.text}</p>
            )}
          </Reveal>
        ) : null}
        <BlockAction block={block} page={page} />
      </div>
    </BlockSection>
  )
}

/**
 * Ordered prose under hairlines.
 *
 * Legal, policy, accessibility and press bodies. Neither reference has a page
 * like this, which is the point: these pages get no motif, no proof slot and
 * no cards, because on a privacy page ornament reads as evasion. The only
 * inherited device is the hairline rule from the section head.
 */
export function DocumentBlock({ block, page, total }: BlockProps) {
  const paragraphs = block.text.split(/(?<=\.)\s+(?=[A-ZА-Я])/).filter(Boolean)
  return (
    <BlockSection id={`block-${block.n}`} className="py-0">
      <div className="grid gap-8 border-t border-rule py-10 md:grid-cols-12 md:py-14">
        <div className="md:col-span-4">
          <Reveal>
            <p className="figures text-meta text-ink-4">
              {String(block.n).padStart(2, "0")}
            </p>
            <h3
              {...untranslated(block.name)}
              className="mt-3 text-h3 font-medium tracking-[-0.035em] text-ink"
            >
              {block.name}
            </h3>
          </Reveal>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Reveal delay={60}>
            <p {...untranslated(block.h3)} className="text-lead text-ink">
              {block.h3}
            </p>
          </Reveal>
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={100 + i * 40}>
              <p {...untranslated(p)} className="mt-4 text-body text-ink-2">
                {p}
              </p>
            </Reveal>
          ))}
          {block.visual ? (
            <Reveal delay={200}>
              <SpecCaption className="mt-6 border-l-2 border-rule pl-4">
                {block.visual}
              </SpecCaption>
            </Reveal>
          ) : null}
          <BlockAction block={block} page={page} />
        </div>
      </div>
    </BlockSection>
  )
}

/**
 * Marks over a burst.
 *
 * cosmoq's integrations section: a grid of rounded icon tiles with a light
 * source behind them, so the grid reads as one object lit from a point rather
 * than as scattered logos. Inverted, the burst is a warm wash and the tiles
 * are white with hairlines.
 */
export function ConstellationBlock({ block, motif, page, total }: BlockProps) {
  const tiles = Array.from({ length: 6 })
  return (
    <BlockSection id={`block-${block.n}`}>
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <BlockIntro block={block} total={total} wide />
          <BlockAction block={block} page={page} />
        </div>
        <Reveal delay={80} className="md:col-span-6 md:col-start-7">
          <div className="relative overflow-hidden rounded-card-lg border border-rule bg-paper-2 p-8 md:p-12">
            <div aria-hidden className="aurora absolute inset-0" />
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,179,82,0.5) 0%, rgba(255,179,82,0) 68%)",
              }}
            />
            <div className="relative grid grid-cols-3 gap-4">
              {tiles.map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-[16px] border border-rule bg-paper-2/90 shadow-[var(--shadow-lift)] backdrop-blur"
                >
                  <Motif kind={motif} className="size-8 opacity-70" />
                </div>
              ))}
            </div>
            <SpecCaption className="relative mt-8">{block.visual}</SpecCaption>
          </div>
        </Reveal>
      </div>
    </BlockSection>
  )
}
