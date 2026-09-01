import type { PageArt } from "@/content/art"
import type { TzPage } from "@/content/tz"
import { pageHasLiveCta } from "@/content/cta"
import { Cta } from "@/components/blocks/kit"
import { Motif } from "./Motif"
import { Reveal } from "./Reveal"
import { WordReveal } from "./WordReveal"

/**
 * The last thing on the page before the footer.
 *
 * Both references end the same way and it is the right ending: one sentence at
 * display size, one action, nothing else - cosmoq centres it over the star
 * burst, Vestora runs a three-line statement above the giant wordmark. Here it
 * restates the page's own primary CTA from the passport, so a visitor who
 * scrolled the whole page is offered the same action the first screen offered,
 * rather than a new one invented at the bottom.
 */
export function PageCloser({ page, art }: { page: TzPage; art: PageArt }) {
  const cta = page.passport.primaryCta || page.hero.ctaPrimary
  const closing = page.hero.supporting || page.hero.h1
  if (!cta || !closing) return null

  return (
    <section className="relative -mx-5 overflow-hidden px-5 py-28 md:-mx-10 md:px-10 md:py-40">
      <div aria-hidden className="aurora absolute inset-0" />
      <div aria-hidden className="dust absolute inset-0 opacity-50" />
      <Motif
        kind={art.motif}
        className="pointer-events-none absolute -bottom-20 left-1/2 size-[24rem] -translate-x-1/2 opacity-45 md:size-[32rem]"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* The page's own supporting sentence, not the passport's goal. The
            goal is written to the team - "Максимизировать qualified installs
            while making value understandable" - and putting it at display size
            ends every page on an internal objective, half of them in Russian.
            The supporting line is the approved sentence for the reader. */}
        <WordReveal
          as="h2"
          text={closing}
          className="display max-w-[24ch] text-balance"
        />
        <Reveal delay={140} className="mt-10">
          <Cta label={cta} page={page} tone="primary" exit={!pageHasLiveCta(page)} />
        </Reveal>
        {page.passport.secondaryCta ? (
          <Reveal delay={190}>
            <p className="mt-5 text-small text-ink-3">or {page.passport.secondaryCta}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
