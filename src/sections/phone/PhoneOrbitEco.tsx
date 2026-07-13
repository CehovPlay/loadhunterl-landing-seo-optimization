import { Img } from "@/components/site/Img"
/**
 * Figma: Group 2085665221 (926:105044) — 390x1305 @ phone-frame y=6882 (x=-2).
 * White orbit graphic (Group 2085665057, 926:101890) exported @2x (renders 388
 * wide — the design content column sits at x −2..388, leaving a 2px dark strip
 * on the right edge, as in the reference render). The light "ecosystem
 * products" card (Frame 2147238589) overlaps the orbit from y=462 and clips
 * its product list at 843px; the two visible product cards are 2x exports.
 * Section height 1324 leaves a 19px dark strip below the card.
 */
export function PhoneOrbitEco() {
  return (
    <section className="relative overflow-hidden bg-gray-800 [content-visibility:auto] [contain-intrinsic-size:390px_1324px]" style={{ height: 1324 }}>
      {/* white orbit rings + "Start free trial 14 days" pills — decorative 2x export */}
      <Img
        src="/figma/phone/orbit.png"
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute left-0 top-0 w-[388px] max-w-none"
      />

      {/* ecosystem products card */}
      <div className="absolute left-[-2px] top-[462px] h-[843px] w-[390px] overflow-hidden rounded-[12px] bg-[#ebeaec]">
        {/* figma icon — 64x64 box, 84px render incl. glow (desktop export reused) */}
        <div data-float className="absolute left-[163px] top-[40px] size-[64px]">
          <Img
            src="/figma/feat-icon-2x.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
          />
        </div>

        <h2 className="absolute left-[14px] top-[144px] w-[362px] text-center text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-ink">
          Our ecosystem products
        </h2>
        <p className="absolute left-[14px] top-[200px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink">
          Everything you need to find, evaluate, and book loads — faster,
          smarter, and in one place.
        </p>

        {/* product cards — 2x exports (Flex 926:102303 / 926:102931, clipped) */}
        <Img
          src="/figma/phone/eco-card-1.png"
          alt="LoadHunter Extension is a AI browser tool that enhances the load booking process on major LoadBoards (DAT, Truckstop, etc.)."
          loading="lazy"
          decoding="async"
          className="absolute left-[14px] top-[292px] w-[362px] max-w-none"
        />
        <Img
          src="/figma/phone/eco-card-2.png"
          alt="huntTMS"
          loading="lazy"
          decoding="async"
          className="absolute left-[14px] top-[762px] w-[362px] max-w-none"
        />
      </div>
    </section>
  )
}
