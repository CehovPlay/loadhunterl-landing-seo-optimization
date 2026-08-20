import type { HeroKind, PageArt } from "@/content/art"
import type { TzPage } from "@/content/tz"
import { pageHasLiveCta } from "@/content/cta"
import { Cta, SpecCaption, untranslated } from "@/components/blocks/kit"
import { Motif } from "./Motif"
import { Reveal } from "./Reveal"
import { WordReveal } from "./WordReveal"

/**
 * The first screen.
 *
 * Five kinds, because 47 pages cannot all open the same way and because the
 * document itself asks for different things: product tabs specify "H1 and CTA
 * left, interactive product proof right", legal tabs specify nothing at all,
 * and the ecosystem pages want the whole thing centred.
 *
 * What every kind shares is the order the tabs require in the first viewport -
 * category label, H1, supporting copy, CTA, status cue - and the rule that
 * nothing above the fold may claim a number the governed source has not
 * verified. That is why no hero here carries a metric.
 */

function Eyebrow({ page }: { page: TzPage }) {
  return (
    <Reveal immediate>
      <p {...untranslated(page.name)} className="text-meta tracking-[0.06em] text-ink-3">
        {page.name}
      </p>
    </Reveal>
  )
}

function Actions({ page }: { page: TzPage }) {
  if (!page.hero.ctaPrimary && !page.hero.ctaSecondary) return null
  return (
    <Reveal immediate delay={160} className="mt-10 flex flex-wrap items-center gap-3">
      <Cta label={page.hero.ctaPrimary} page={page} tone="primary" exit={!pageHasLiveCta(page)} />
      <Cta label={page.hero.ctaSecondary} page={page} />
    </Reveal>
  )
}

function Microcopy({ page }: { page: TzPage }) {
  if (!page.hero.microcopy) return null
  return (
    <Reveal immediate delay={200}>
      <p className="mt-5 text-small text-ink-3">{page.hero.microcopy}</p>
    </Reveal>
  )
}

export function PageHero({ page, art }: { page: TzPage; art: PageArt }) {
  const kind: HeroKind = art.hero

  /* Centred over the dust field: cosmoq's opening, and the only hero that puts
     the motif behind the type rather than beside it. Reserved for pages that
     introduce the whole ecosystem rather than one product. */
  if (kind === "cosmic") {
    return (
      <section className="relative -mx-5 overflow-hidden px-5 pt-32 pb-24 md:-mx-10 md:px-10 md:pt-44 md:pb-32">
        <div aria-hidden className="dust absolute inset-0 opacity-80" />
        <div aria-hidden className="aurora absolute inset-0" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
          <Eyebrow page={page} />
          <Reveal immediate delay={60}>
            <h1 className="display-hero mt-6 text-balance">{page.hero.h1}</h1>
          </Reveal>
          <Reveal immediate delay={120}>
            <p className="mt-7 max-w-[58ch] text-lead text-ink-2">{page.hero.supporting}</p>
          </Reveal>
          <Actions page={page} />
          <Microcopy page={page} />
        </div>
        <Reveal immediate delay={220} className="relative mt-16 md:mt-24">
          <div className="relative mx-auto aspect-[16/10] max-w-5xl overflow-hidden rounded-card-lg border border-rule bg-paper-2 shadow-[var(--shadow-lift-lg)] md:aspect-[16/9]">
            <div aria-hidden className="dust absolute inset-0 opacity-60" />
            <div aria-hidden className="aurora-soft absolute inset-0" />
            <div className="absolute inset-0 grid place-items-center">
              {art.motif === "orb" ? (
                <div aria-hidden className="orb size-48 rounded-full md:size-64" />
              ) : (
                <Motif kind={art.motif} className="size-56 md:size-80" />
              )}
            </div>
            <span className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full border border-rule bg-paper-2/80 px-3 py-1.5 text-meta text-ink-3 backdrop-blur">
              <span aria-hidden className="size-1.5 rounded-full bg-violet-soft" />
              Proof slot
            </span>
            <div className="absolute inset-x-6 bottom-6">
              <SpecCaption>{page.hero.layout}</SpecCaption>
            </div>
          </div>
        </Reveal>
      </section>
    )
  }

  /* Copy left, proof right. The layout most product and audience tabs name
     explicitly, including the instruction that the proof drops below the CTA
     on mobile. */
  if (kind === "split") {
    return (
      <section className="relative -mx-5 overflow-hidden px-5 pt-32 pb-20 md:-mx-10 md:px-10 md:pt-40 md:pb-28">
        <div aria-hidden className="aurora-soft absolute inset-0" />
        <div className="relative grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <Eyebrow page={page} />
            <Reveal immediate delay={60}>
              <h1 className="display-hero mt-6 max-w-[15ch] text-balance">{page.hero.h1}</h1>
            </Reveal>
            <Reveal immediate delay={120}>
              <p className="mt-7 max-w-[50ch] text-lead text-ink-2">{page.hero.supporting}</p>
            </Reveal>
            <Actions page={page} />
            <Microcopy page={page} />
          </div>
          <Reveal immediate delay={180} className="md:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg border border-rule bg-paper-2 shadow-[var(--shadow-lift-lg)]">
              <div aria-hidden className="dust absolute inset-0 opacity-70" />
              <div className="absolute inset-0 grid place-items-center">
                <Motif kind={art.motif} className="size-56 md:size-72" />
              </div>
              <div className="absolute inset-x-6 bottom-6">
                <SpecCaption>{page.hero.layout}</SpecCaption>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    )
  }

  /* One sentence at display size, resolving word by word. Vestora's opening,
     used where the page's argument is a position rather than a product. */
  if (kind === "statement") {
    return (
      <section className="relative -mx-5 overflow-hidden px-5 pt-36 pb-24 md:-mx-10 md:px-10 md:pt-48 md:pb-32">
        <div aria-hidden className="aurora-soft absolute inset-0" />
        <Motif
          kind={art.motif}
          className="pointer-events-none absolute -top-6 right-4 size-64 opacity-50 md:right-16 md:size-96"
        />
        <div className="relative">
          <Eyebrow page={page} />
          <WordReveal
            as="h1"
            text={page.hero.h1}
            className="display-hero mt-8 max-w-[16ch] text-balance"
          />
          <Reveal immediate delay={140}>
            <p className="mt-10 max-w-[54ch] text-lead text-ink-2">{page.hero.supporting}</p>
          </Reveal>
          <Actions page={page} />
          <Microcopy page={page} />
        </div>
      </section>
    )
  }

  /* Copy over a full-bleed art field. For pages that carry an argument and have
     no product screen to show - partners, resources, careers. */
  if (kind === "field") {
    return (
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-rule bg-paper-2">
        <div aria-hidden className="aurora absolute inset-0" />
        <div aria-hidden className="dust absolute inset-0 opacity-60" />
        {/* Inset rather than bled off the corner: a motif cropped by the band's
            own edge reads as a mistake, and this band has a hard bottom edge
            because the page continues on paper below it. */}
        <Motif
          kind={art.motif}
          className="pointer-events-none absolute top-1/2 right-[4vw] hidden size-[22rem] -translate-y-1/2 opacity-70 lg:block xl:size-[26rem]"
        />
        <div className="relative mx-auto max-w-[1400px] px-5 pt-36 pb-24 md:px-10 md:pt-44 md:pb-28">
          {/* The copy stops short of the motif rather than running under it. */}
          <div className="lg:max-w-[58%]">
          <Eyebrow page={page} />
          <Reveal immediate delay={60}>
            <h1 className="display-hero mt-6 max-w-[16ch] text-balance">{page.hero.h1}</h1>
          </Reveal>
          <Reveal immediate delay={120}>
            <p className="mt-7 max-w-[52ch] text-lead text-ink-2">{page.hero.supporting}</p>
          </Reveal>
          <Actions page={page} />
          <Microcopy page={page} />
          </div>
        </div>
      </section>
    )
  }

  /* Narrow, centred, quiet. Legal, status and utility pages, where the first
     screen's job is to say what the document is and when it was last checked. */
  return (
    <section className="relative pt-32 pb-16 md:pt-44 md:pb-20">
      <div className="max-w-[46rem]">
        <Eyebrow page={page} />
        <Reveal immediate delay={60}>
          <h1 className="mt-6 text-[clamp(2rem,1.4rem+1.8vw,3rem)] leading-[1.08] font-medium tracking-[-0.045em] text-balance text-ink">
            {page.hero.h1}
          </h1>
        </Reveal>
        <Reveal immediate delay={120}>
          <p className="mt-6 text-lead text-ink-2">{page.hero.supporting}</p>
        </Reveal>
        <Actions page={page} />
        <Microcopy page={page} />
      </div>
    </section>
  )
}
