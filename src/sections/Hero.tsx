import { Img } from "@/components/site/Img"
import { ProofBadges } from "@/components/site/ProofBadges"
import { ShaderBand } from "@/components/site/ShaderBand"
import { HERO } from "@/content/copy"
import { track } from "@/lib/analytics"
import { APP_URL } from "@/sections/Navbar"

/**
 * Product-SaaS hero — SPLIT layout (2026-07-31): copy column left on the
 * content grid (x120), the app screenshot right, deliberately oversized so its
 * right half runs off the canvas/viewport edge (the classic "app peeking in"
 * SaaS hero). Replaces the earlier centered-copy + full-width-mockup-below
 * composition, which pushed the product 970px down the page.
 *
 * DesignFrame's inner canvas does not clip (only the outer viewport wrapper
 * does), so the overflow simply falls off the right edge — and above 1920 it
 * bleeds into the side gutter instead of ending on a hard cut, same as the
 * other full-bleed decor.
 *
 * The export is fully OPAQUE and its content already fades out into #fafafa at
 * the bottom (baked in Figma) = var(--color-bg-light) = the Features section
 * below. So the hero band itself fades to the same #fafafa over the screenshot's
 * lower half (`bottomFade`, full-bleed inside the shader portal): the mockup's
 * bottom and side edges dissolve instead of ending on a visible rectangle, and
 * the hero → Features seam disappears.
 */
const HERO_H = 920
const COPY_TOP = 200
const COPY_W = 820 // x120 → x940; the 64px H1 wraps to exactly two lines here
const MOCK_LEFT = 1000
const MOCK_W = 1500 // ~580px of it lives past the canvas edge
const MOCK_TOP = 176
const MOCK_H = Math.round(MOCK_W * (1436 / 3360)) // 641

export function Hero() {
  return (
    <section className="relative w-full" style={{ height: HERO_H }}>
      {/* animated shader background (experiment) — portalled full-bleed behind
          the page; also paints the hero's var(--color-hero) base into the side gutters.
          The static fallback echoes the flow-layout hero tints so Safari
          (no working WebGPU) gets a composed band, not bare gray. */}
      <ShaderBand
        baseColor="#efefef"
        bottomFade={
          "linear-gradient(to bottom, rgba(250,250,250,0) 55%, var(--color-bg-light) 88%)"
        }
        fallback={
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 60% at 85% -5%, rgba(156,102,229,0.16) 0%, rgba(156,102,229,0) 60%)," +
                "radial-gradient(90% 50% at 0% 30%, rgba(111,81,151,0.10) 0%, rgba(111,81,151,0) 65%)",
            }}
          />
        }
      />

      {/* copy — left column on the content grid.
          Static, SSR-visible text: LH-002 requires the H1 to be readable
          without any animation, so the old RotatingHeadline (6 typed phrases)
          is gone and a single approved H1 stays in the DOM. */}
      <div
        className="absolute left-[120px] z-20 flex flex-col items-start text-left"
        style={{ top: COPY_TOP, width: COPY_W }}
      >
        {/* LH-001 eyebrow — compact pill, no glow */}
        <span
          className="inline-flex w-fit items-center rounded-full px-[16px] py-[5px] text-[16px] font-medium leading-[24px] tracking-[-0.48px] text-ink"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
          }}
        >
          {HERO.eyebrow}
        </span>

        {/* LH-002 / SEO-004 — the page's single H1 (type scale LH-014: 64/68) */}
        <h1 className="mt-[28px] text-[64px] font-medium leading-[68px] tracking-[-0.03em] text-ink">
          {HERO.h1}
        </h1>

        {/* LH-003 / SEO-005 — lead, capped at 720px per the brief */}
        <p className="mt-[24px] max-w-[720px] text-[20px] font-medium leading-[30px] tracking-[-0.03em] text-ink/80">
          {HERO.lead}
        </p>

        {/* LH-004 — source-attributed proof badges */}
        <ProofBadges className="mt-[28px]" />

        {/* CTAs — LH-005 one dominant primary, LH-006 a differently-shaped
            secondary that leads to the demo section rather than a second
            "start here" */}
        <div className="mt-[28px] flex items-center gap-[12px]">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener"
            data-lift
            onClick={() => track("hero_trial_click")}
            className="flex h-[52px] items-center justify-center whitespace-nowrap rounded-full bg-violet px-[28px] text-[17px] font-medium leading-[24px] tracking-[-0.03em] text-white"
            style={{
              boxShadow: "var(--shadow-pill), 0px 34px 74px -20px rgba(111,81,151,0.5)",
            }}
          >
            {HERO.primaryCta}
          </a>
          <a
            href="#demo"
            data-lift
            onClick={() => track("hero_chrome_click")}
            className="flex h-[52px] items-center justify-center gap-[10px] whitespace-nowrap rounded-full border border-border-light bg-white px-[24px] text-[17px] font-medium leading-[24px] tracking-[-0.03em] text-ink transition-colors hover:text-black"
            style={{ boxShadow: "var(--shadow-pill)" }}
          >
            <svg viewBox="0 0 24 24" aria-hidden className="size-[20px]" fill="currentColor">
              <path d="M8.5 5.6a1 1 0 0 1 1.52-.85l8.1 5.15a1 1 0 0 1 0 1.69l-8.1 5.15a1 1 0 0 1-1.52-.85V5.6z" />
            </svg>
            {HERO.secondaryCta}
          </a>
        </div>

        {/* LH-007 — risk reversal microcopy, out of the FAQ and under the CTA */}
        <p className="mt-[14px] flex items-center gap-[8px] text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-ink/70">
          <svg viewBox="0 0 24 24" aria-hidden className="size-[16px] text-violet" fill="currentColor">
            <path d="M12 2.2 4.5 5.3v6.1c0 4.6 3.2 8.9 7.5 10.4 4.3-1.5 7.5-5.8 7.5-10.4V5.3L12 2.2zm-1.1 13.2-3.2-3.2 1.3-1.3 1.9 1.9 4.6-4.6 1.3 1.3-5.9 5.9z" />
          </svg>
          {HERO.microcopy}
        </p>
      </div>

      {/* product screenshot — right of the copy, running off the canvas edge.
          The export is opaque and its baked bottom fade lands on #fafafa, which
          used to read as a light rectangle now that it no longer spans the full
          width — so the box is masked out over its lower third and dissolves
          into the band instead of ending on a straight cut. */}
      <div
        className="absolute z-10"
        style={{
          top: MOCK_TOP,
          left: MOCK_LEFT,
          width: MOCK_W,
          height: MOCK_H,
          maskImage: "linear-gradient(to bottom, #000 58%, transparent 97%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent 97%)",
        }}
      >
        <Img
          src="/figma/hero-dashboard-2x.png"
          alt="LoadHunter workspace inside the load board: broker email templates, factoring signals, driver list and load details in one view"
          fetchPriority="high"
          decoding="async"
          width={MOCK_W}
          height={MOCK_H}
          className="block h-full w-full max-w-none"
        />
      </div>

      {/* LH-008 — caption naming what the visual actually shows */}
      <p
        className="absolute z-20 text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-ink/70"
        style={{ top: MOCK_TOP + MOCK_H + 20, left: MOCK_LEFT, width: 640 }}
      >
        {HERO.caption}
      </p>
    </section>
  )
}
