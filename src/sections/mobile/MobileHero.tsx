import { Img } from "@/components/site/Img"
import { RotatingHeadline } from "@/components/site/RotatingHeadline"
import { MobileHeroShader } from "./MobileHeroShader"
import { Container, PillButton, Stars } from "./ui"

// explicit w+h: these SVGs carry no intrinsic size, so `w-auto` would fall
// back to the 300×150 replaced-element default (ratios from the desktop strip)
const PARTNERS = [
  { src: "/figma/partner-123loadboard.svg", w: 100, h: 17 },
  { src: "/figma/partner-trucksmarter.svg", w: 99, h: 24 },
  { src: "/figma/partner-truckstop.svg", w: 101, h: 18 },
  { src: "/figma/partner-dat.svg", w: 102, h: 22 },
]

/**
 * Mobile hero: the desktop copy column reflowed — eyebrow pill, rotating
 * headline (mobile type scale), trust line, two stacked full-width 48px CTAs,
 * and a CSS-keyframe partner marquee (no scaled canvas on mobile, so plain
 * CSS animations are safe). Background: static violet radial tints on var(--color-hero)
 * paint instantly; on WebGPU-capable devices MobileHeroShader cross-fades the
 * autonomous drift shader over them (see that file for the gating).
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
            "linear-gradient(to bottom, rgba(250,250,250,0) 75%, var(--color-bg-light) 100%)",
        }}
      />
      <MobileHeroShader />

      <Container className="relative flex flex-col items-center pb-28 pt-[180px] text-center">
        {/* eyebrow pill — desktop skin: soft white gradient, no border */}
        <span
          className="inline-flex w-fit items-center rounded-full px-4 py-1.5 text-[14px] font-medium leading-[20px] tracking-[-0.56px] text-ink"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
          }}
        >
          The AI copilot for smarter dispatching.
        </span>

        {/* rotating headline + sub (fixed box so the cycle can't shift layout) */}
        <div className="mt-12 flex min-h-[180px] flex-col items-center">
          <RotatingHeadline
            h1ClassName="-mx-2 -my-[10px] px-2 py-[10px] text-[clamp(34px,9.7vw,60px)] font-medium leading-[1.12] tracking-[-0.04em]"
            subClassName="text-[clamp(19px,5.4vw,24px)] font-medium leading-[1.6] tracking-[-0.04em] text-ink"
          />
        </div>

        {/* trust line — desktop copy, stacked in two rows for 390px */}
        <p className="mt-8 flex flex-col items-center gap-1.5 text-[14px] font-medium leading-[20px] tracking-[-0.56px] text-ink opacity-60">
          Trusted by 6,000+ users
          <span className="flex items-center gap-2">
            <span className="hidden" aria-hidden>
              ·
            </span>
            <Stars score={4.4} className="text-[13px]" />
            4.4 on Google &amp; Trustpilot
          </span>
        </p>

        {/* CTAs — stacked, full width, 48px; desktop order and skins */}
        <div className="mx-auto mt-12 flex w-full max-w-[400px] flex-col gap-3">
          <PillButton href="#pricing" variant="glass" className="">
            Start 14-day free trial
          </PillButton>
          <PillButton
            href="#start"
            variant="violet-radial"
            className=""
          >
            <Img src="/figma/icon-diamond.svg" alt="" className="size-6" />
            Start booking in seconds
          </PillButton>
        </div>
      </Container>

      {/* partner marquee — two copies of the row, translated -50% on loop */}
      <div className="relative bg-bg-light py-10" aria-label="Supported load boards">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10"
          style={{ background: "linear-gradient(to right, var(--color-bg-light), rgba(250,250,250,0))" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10"
          style={{ background: "linear-gradient(to left, var(--color-bg-light), rgba(250,250,250,0))" }}
        />
        <div className="overflow-hidden">
          <div className="animate-lh-marquee flex w-max items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {PARTNERS.map((p) => (
                  <img
                    key={`${copy}-${p.src}`}
                    src={p.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="mx-6 opacity-60"
                    style={{ width: p.w, height: p.h }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
