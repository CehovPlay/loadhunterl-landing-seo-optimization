import { Img } from "@/components/site/Img"
import { ProofBadges } from "@/components/site/ProofBadges"
import { HERO } from "@/content/copy"
import { track } from "@/lib/analytics"
import { APP_URL } from "@/sections/Navbar"
import { MobileHeroShader } from "./MobileHeroShader"
import { Container, HERO_BOTTOM_FADE, PillButton } from "./ui"

/**
 * Mobile hero: the desktop copy column reflowed — eyebrow pill, the single
 * static approved H1 (LH-002: readable with animation off), lead, proof
 * badges, one dominant primary CTA plus a demo secondary, and the risk
 * reversal microcopy. Background: static violet radial tints on
 * var(--color-hero) paint instantly; on WebGPU-capable devices
 * MobileHeroShader cross-fades the autonomous drift shader over them.
 */
export function MobileHero() {
  return (
    <section className="relative overflow-hidden bg-hero">
      {/* static echo of the desktop ChromaFlow shader */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 60% at 85% -5%, rgba(156,102,229,0.16) 0%, rgba(156,102,229,0) 60%)," +
            "radial-gradient(90% 50% at 0% 30%, rgba(111,81,151,0.10) 0%, rgba(111,81,151,0) 65%)," +
            HERO_BOTTOM_FADE,
        }}
      />
      <MobileHeroShader />

      <Container className="relative flex flex-col items-center pb-14 pt-[160px] text-center">
        {/* LH-001 eyebrow — compact pill, no glow */}
        <span
          className="inline-flex w-fit items-center rounded-full px-4 py-1.5 text-[14px] font-medium leading-[20px] tracking-[-0.56px] text-ink"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
          }}
        >
          {HERO.eyebrow}
        </span>

        {/* LH-002 / SEO-004 — the page's single H1, static and always in the DOM */}
        <h1 className="mt-8 text-[clamp(32px,8.6vw,44px)] font-medium leading-[1.14] tracking-[-0.04em] text-ink">
          {HERO.h1}
        </h1>

        {/* LH-003 / SEO-005 */}
        <p className="mt-5 text-[clamp(16px,4.2vw,18px)] font-medium leading-[1.55] tracking-[-0.03em] text-ink/80">
          {HERO.lead}
        </p>

        {/* LH-004 — source-attributed proof badges */}
        <ProofBadges compact className="mt-8 items-center [&_ul]:justify-center" />

        {/* CTAs — LH-005 primary dominant, LH-006 secondary to the demo */}
        <div className="mx-auto mt-10 flex w-full max-w-[400px] flex-col gap-3">
          <PillButton
            href={APP_URL}
            target="_blank"
            rel="noopener"
            variant="violet"
            onClick={() => track("hero_trial_click")}
            className=""
          >
            {HERO.primaryCta}
          </PillButton>
          <PillButton
            href="#demo"
            variant="white"
            onClick={() => track("hero_chrome_click")}
            className=""
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="currentColor">
              <path d="M8.5 5.6a1 1 0 0 1 1.52-.85l8.1 5.15a1 1 0 0 1 0 1.69l-8.1 5.15a1 1 0 0 1-1.52-.85V5.6z" />
            </svg>
            {HERO.secondaryCta}
          </PillButton>
        </div>

        {/* LH-007 */}
        <p className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium leading-[18px] tracking-[-0.02em] text-ink/70">
          <svg viewBox="0 0 24 24" aria-hidden className="size-4 text-violet" fill="currentColor">
            <path d="M12 2.2 4.5 5.3v6.1c0 4.6 3.2 8.9 7.5 10.4 4.3-1.5 7.5-5.8 7.5-10.4V5.3L12 2.2zm-1.1 13.2-3.2-3.2 1.3-1.3 1.9 1.9 4.6-4.6 1.3 1.3-5.9 5.9z" />
          </svg>
          {HERO.microcopy}
        </p>
      </Container>

      {/* product screenshot — the desktop hero mockup is 2.34:1, so fitting its
          full width into the 350px column would leave 150px of unreadable UI.
          Instead it renders at a FIXED width (1110 = 0.66 of the desktop 1680,
          the smallest scale where the sidebar and card labels stay legible) and
          is cropped: LEFT edge flush with the content column, the crop happening
          at the screen edge itself, so the cut is invisible and the app reads as
          continuing off-screen. Never cropped at the top/left.
          The width MUST NOT be a percentage: the wrapper's content box grows
          with the viewport between 440 and 768 (left padding only half-tracks
          it), so `w-[300%]` scaled the mockup up to 1650px at 700px wide and
          then snapped back to 1104 at the md: breakpoint — a visible jump, and
          the hero grew to 1667px with it. Fixed px = constant scale, and a wider
          screen simply reveals more of the dashboard.
          Height is uncropped, so the export's baked bottom fade into #fafafa
          still lands on the (already #fafafa) hero bottom — see HERO_BOTTOM_FADE. */}
      <div className="relative overflow-hidden pl-[max(20px,calc((100vw-440px)/2+20px))] md:pl-[max(32px,calc((100vw-768px)/2+32px))]">
        <Img
          src="/figma/mobile/hero-dashboard.png"
          alt="LoadHunter workspace inside the load board: broker email templates, factoring signals, driver list and load details in one view"
          decoding="async"
          className="block w-[1110px] max-w-none"
        />
      </div>

      {/* LH-008 — caption naming what the visual actually shows */}
      <Container className="relative">
        <p className="pb-10 text-center text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-ink/70">
          {HERO.caption}
        </p>
      </Container>

      {/* The partner marquee that used to sit here is gone: LH-016 bans
          infinite marquees and LH-071 replaces it with the static
          MobileCompatibility section rendered right after this one. */}
    </section>
  )
}
