import { Img } from "@/components/site/Img"
import { RotatingHeadline } from "@/components/site/RotatingHeadline"
import { ShaderBand } from "@/components/site/ShaderBand"
import { APP_URL, CHROME_STORE_URL } from "@/sections/Navbar"
import diamondIcon from "/figma/icon-diamond.svg"

/**
 * Product-SaaS hero (2026-07-27): centered copy column over the shader band,
 * then the app dashboard screenshot sitting on the fold — 1680px wide, i.e. the
 * page's content grid and the native half of the 3360px 2× export, so it renders
 * pixel-for-pixel at canvas scale 1.
 *
 * The export is fully OPAQUE and its content already fades out into #fafafa at
 * the bottom (baked in Figma) = var(--color-bg-light) = the Features section
 * below. So the hero band itself fades to the same #fafafa over the screenshot's
 * lower half (`bottomFade`, full-bleed inside the shader portal): the mockup's
 * bottom and side edges dissolve instead of ending on a visible rectangle, and
 * the hero → Features seam disappears.
 */
const MOCK_TOP = 970
const MOCK_H = 718 // 1680 × (1436/3360)

export function Hero() {
  return (
    <section className="relative h-[1740px] w-full">
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

      {/* copy — centered */}
      <div className="absolute inset-x-0 top-[203px] z-20 flex flex-col items-center gap-[70px] px-[120px] text-center">
        {/* eyebrow pill */}
        <span
          className="inline-flex w-fit items-center rounded-full px-[20px] py-[4px] text-[20px] font-medium leading-[32px] tracking-[-0.8px] text-ink"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
          }}
        >
          The AI copilot for smarter dispatching.
        </span>

        <div className="flex flex-col items-center gap-[60px]">
          {/* rotating typed H1 + matching sub-headline badge */}
          <RotatingHeadline />

          {/* trust line: 6K+ users + weighted rating across Google (4.6/28) and
              Trustpilot (3.8/9) = 4.4 */}
          <p className="flex items-center gap-[10px] text-[17px] font-medium leading-[24px] tracking-[-0.68px] text-ink opacity-60">
            Trusted by 6,000+ users
            <span aria-hidden className="text-gray-250">·</span>
            <span
              className="relative inline-flex text-[15px] leading-none tracking-[2px]"
              role="img"
              aria-label="Rated 4.4 out of 5 on Google and Trustpilot"
            >
              <span className="text-gray-150">★★★★★</span>
              <span
                className="absolute inset-0 overflow-hidden whitespace-nowrap text-violet"
                style={{ width: `${(4.4 / 5) * 100}%` }}
              >
                ★★★★★
              </span>
            </span>
            4.4 on Google &amp; Trustpilot
          </p>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-[12px]">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener"
            data-lift
            className="flex h-[42px] w-[288px] items-center justify-center whitespace-nowrap rounded-full border border-white text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-ink backdrop-blur-[10px]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, var(--color-white), rgba(255,255,255,0.5))",
              boxShadow:
                "var(--shadow-pill)",
            }}
          >
            Start 14-day free trial
          </a>
          <a
            href={CHROME_STORE_URL}
            target="_blank"
            rel="noopener"
            data-lift
            className="flex h-[42px] w-[288px] items-center justify-center gap-[8px] overflow-hidden whitespace-nowrap rounded-full border border-white py-[4px] pl-[9px] pr-[12px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white"
            style={{
              backgroundImage:
                "radial-gradient(60% 140% at 50% 110%, rgba(111,81,151,1) 0%, rgba(111,81,151,0) 100%)",
              boxShadow:
                "var(--shadow-pill), 0px 34px 74px -20px rgba(111,81,151,0.5)",
            }}
          >
            <Img src={diamondIcon} alt="" decoding="async" className="size-[25px]" />
            Start booking in seconds
          </a>
        </div>
      </div>

      {/* product screenshot — content grid (x120, w1680), native 2× export */}
      <div
        className="absolute left-[120px] z-10 w-[1680px]"
        style={{ top: MOCK_TOP, height: MOCK_H }}
      >
        <Img
          src="/figma/hero-dashboard-2x.png"
          alt="LoadHunter dashboard: e-mail templates, factoring, drivers, release notes and tutorials"
          fetchPriority="high"
          decoding="async"
          width={1680}
          height={MOCK_H}
          className="block h-full w-full"
        />
      </div>
    </section>
  )
}
