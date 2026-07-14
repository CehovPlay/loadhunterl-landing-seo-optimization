/**
 * Figma: footer region — page y 18556–19624 (h=1068).
 * Logo/subscribe row 1680x40 @ (120,120) (914:23856), full-bleed separator
 * @ y=191, links/socials row 1680x18 @ (120,224) (914:23887), gradient
 * hairline "Line 17" @ y=274, orbit graphic Group 926:101887 rebuilt as
 * vectors: three rings tangent at (960,377), tick fading up from the tangent,
 * logomark 914:23912 @ (908.33,558), © caption @ (848,1005). The rings run
 * past the page bottom, so they sit in their own overflow-hidden layer — the
 * section itself must NOT clip (the dividers bleed into the >1920 gutters),
 * and it has no own bg: the PNG's baked backdrop is gone, the root gray-800
 * shows through.
 */

const SOCIALS = ["/figma/tail/social-1.png", "/figma/tail/social-2.png", "/figma/tail/social-3.png"]

const RINGS = [928, 713, 460] // Ellipse 64 / 62 / 63, all tangent at the top

export function Footer() {
  return (
    <footer id="token" className="relative h-[1068px]">
      {/* orbit rings + logomark + caption (clipped at the section bounds) */}
      <div className="absolute inset-0 overflow-hidden">
        {RINGS.map((d) => (
          <div
            key={d}
            className="absolute rounded-full border border-[rgba(150,150,150,0.2)]"
            style={{ left: 960 - d / 2, top: 377, width: d, height: d }}
          />
        ))}
        {/* tick above the rings' tangent point, fading upward */}
        <div
          className="absolute left-[960px] top-[345px] h-[32px] w-px"
          style={{
            background:
              "linear-gradient(0deg, rgba(150,150,150,0.5) 0%, rgba(150,150,150,0) 100%)",
          }}
        />
        <img loading="lazy" decoding="async"
          src="/figma/tail/footer-logo.svg"
          alt=""
          className="absolute left-[908.33px] top-[558px] h-[98px] w-[103.65px] max-w-none"
        />
        <p className="absolute left-[848px] top-[1005px] w-[224px] whitespace-nowrap text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
          © 2026 loadhunt Corp. All rights reserved.
        </p>
      </div>

      {/* logo + subscribe row */}
      <div className="absolute left-[120px] top-[120px] h-[40px] w-[1680px]">
        <div className="absolute left-0 top-[8px] h-[24px] w-[151px]">
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-icon-white.svg"
            alt=""
            className="absolute left-0 top-0 size-[24px] max-w-none"
          />
          <img loading="lazy" decoding="async"
            src="/figma/tail/logo-text-white.svg"
            alt="loadhunter"
            className="absolute left-[34px] top-[2.56px] h-[18.88px] w-[116.44px] max-w-none"
          />
        </div>

        <form
          className="absolute right-0 top-0 flex h-[40px] items-center gap-[6px] rounded-full bg-[rgba(54,56,61,0.5)] py-[6px] pl-[8px] pr-[6px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your e-mail address"
            className="h-[24px] w-[241px] rounded-full bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.05)] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] placeholder:text-ink-2 focus:outline-none"
          />
          <button className="flex h-[28px] items-center justify-center rounded-full border border-white bg-[#6f5197] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] transition-opacity hover:opacity-90">
            Subscribe
          </button>
        </form>
      </div>

      {/* full-bleed separator — spans the whole viewport, past the >1920
          gutters (the DesignFrame wrapper clips it at the window edge) */}
      <div className="absolute left-1/2 top-[191px] h-px w-[6000px] -translate-x-1/2 bg-[#33353a]" />

      {/* links + socials row */}
      <div className="absolute left-[120px] top-[224px] h-[18px] w-[1680px]">
        <div className="absolute left-0 top-0 flex h-full items-center gap-[32px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
          <a href="#" className="hover:text-gray-100">Privacy Policy</a>
          <a href="#" className="hover:text-gray-100">Terms of Service</a>
        </div>
        <div className="absolute right-0 top-0 flex h-full items-center gap-[4px]">
          {SOCIALS.map((src) => (
            <a key={src} href="#" className="block size-[18px]">
              <img loading="lazy" decoding="async" src={src} alt="" className="size-[18px] max-w-none" />
            </a>
          ))}
        </div>
      </div>

      {/* gradient hairline above the orbit graphic — full viewport width */}
      <div
        className="absolute left-1/2 top-[274px] h-px w-[6000px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.268) 50%, rgba(255,255,255,0.03) 100%)",
        }}
      />
    </footer>
  )
}
