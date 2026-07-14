/**
 * Figma: Group 2085665221 (926:105044) — 390x1305 @ phone-frame y=6882 (x=-2).
 * White orbit graphic (Group 2085665057, 926:101890) exported @2x (renders 388
 * wide — the design content column sits at x −2..388, leaving a 2px dark strip
 * on the right edge, as in the reference render). The light "ecosystem
 * products" card (Frame 2147238589) overlaps the orbit from y=462.
 *
 * The card is the pin stage: initEcosystemPin() (src/lib/ecosystemPin.ts)
 * pins it at the viewport centre, expands it to fullscreen (corners → 0) and
 * scrolls the product list through the window below the heading, then
 * releases. Section height = card bottom (1305) + the 2700px pinned runway
 * (expand 400 + listScroll 2300).
 *
 * Card 1 is the Figma 2x export; cards 2–6 are hidden (unrenderable) in the
 * phone frame, so they're rebuilt in HTML from the desktop ecosystem assets
 * following the exported card's layout.
 */

const ECO_DESC =
  "Comprehensive transport management system providing a single platform to manage all aspects."

const ECO_PRODUCTS = [
  { name: "huntTMS", logo: "/figma/eco/logo2.png", logoW: 113, mockup: "/figma/eco/row2.png", live: true },
  { name: "huntPAY", logo: "/figma/eco/logo3.png", logoW: 109, mockup: "/figma/eco/row3.png" },
  { name: "huntDRIVE", logo: "/figma/eco/logo4.png", logoW: 130, mockup: "/figma/eco/row4.png" },
  { name: "fleetHUNT", logo: "/figma/eco/logo5.png", logoW: 126, mockup: "/figma/eco/row5.png" },
  { name: "huntONE", logo: "/figma/eco/logo6.png", logoW: 114, mockup: "/figma/eco/row6.png" },
]

function EcoCardP({ p }: { p: (typeof ECO_PRODUCTS)[number] }) {
  return (
    <div className="relative h-[450px] w-[362px] shrink-0 overflow-hidden rounded-[12px] bg-white">
      <img loading="lazy" decoding="async"
        src={p.logo}
        alt={p.name}
        className="absolute left-[24px] top-[24px] h-[24px] max-w-none"
        style={{ width: p.logoW }}
      />
      <p className="absolute left-[24px] top-[88px] w-[314px] text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-ink-2">
        {ECO_DESC}
      </p>
      {!p.live && (
        <div className="absolute left-[24px] top-[172px] inline-flex h-[28px] items-center justify-center rounded-[99px] border border-white bg-[#6f5197] px-[12px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
            Coming soon
          </span>
        </div>
      )}
      {/* clip the export's baked top hairline and dark rounded-corner pixels */}
      <img loading="lazy" decoding="async"
        src={p.mockup}
        alt={`${p.name} product preview`}
        className="absolute left-[24px] top-[230px] w-[400px] max-w-none"
        style={{ clipPath: "inset(2px 2px 0 0 round 0 14px 0 0)" }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e8e8e8]" />
    </div>
  )
}

export function PhoneOrbitEco() {
  return (
    <section
      data-eco-pin='{"sectionW":390,"cardH":843,"cardTop":462,"cardLeft":-2,"cardW":390,"radius":12,"expand":400,"listContent":3132,"listScroll":2300}'
      className="relative bg-gray-800"
      style={{ height: 4005 }}
    >
      {/* white orbit rings + "Start free trial 14 days" pills — decorative 2x export */}
      <img loading="lazy" decoding="async"
        src="/figma/phone/orbit.png"
        alt=""
        aria-hidden
        className="absolute left-0 top-0 w-[388px] max-w-none"
      />

      {/* ecosystem products card — the pin stage */}
      <div
        data-eco-stage
        data-no-reveal
        className="absolute left-[-2px] top-[462px] h-[843px] w-[390px] overflow-hidden rounded-[12px] bg-[#ebeaec] will-change-transform"
      >
        <div data-eco-inner className="absolute inset-0 will-change-transform">
          {/* the window spans the whole card: the heading is part of the
              scrolled content (it drifts away with the list) and cards clip
              only at the card/viewport edge, not at a mid-screen boundary */}
          <div
            data-eco-window
            className="absolute inset-0 overflow-hidden will-change-[transform,height]"
          >
            <div data-eco-list className="relative will-change-transform">
              <div className="relative h-[292px]">
                {/* icon — desktop ecosystem vector composite (plate + glyph) */}
                <div
                  data-float
                  className="absolute left-[163px] top-[40px] size-[64px] overflow-hidden rounded-[16px]"
                  style={{ boxShadow: "0px 6px 16px -6px rgba(146,92,255,0.48)" }}
                >
                  <img loading="lazy" decoding="async"
                    src="/figma/eco/icon-plate.png"
                    alt=""
                    className="absolute inset-0 size-full"
                  />
                  <img loading="lazy" decoding="async"
                    src="/figma/eco/icon-glyph.svg"
                    alt=""
                    className="absolute inset-0 size-full"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[16px]"
                    style={{
                      boxShadow:
                        "inset 0px 0px 1px 0px #925cff, inset 0px 0px 3px 0px rgba(146,92,255,0.24), inset 0px 0px 12px 0px rgba(146,92,255,0.12)",
                    }}
                  />
                </div>
                <h2 className="absolute left-[14px] top-[144px] w-[362px] text-center text-[24px] font-medium leading-[32px] tracking-[-0.96px] text-ink">
                  Our ecosystem products
                </h2>
                <p className="absolute left-[14px] top-[200px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink">
                  Everything you need to find, evaluate, and book loads — faster,
                  smarter, and in one place.
                </p>
              </div>
              <div className="ml-[14px] flex w-[362px] flex-col gap-[20px] pb-[40px]">
                <img loading="lazy" decoding="async"
                  src="/figma/phone/eco-card-1.png"
                  alt="LoadHunter Extension is a AI browser tool that enhances the load booking process on major LoadBoards (DAT, Truckstop, etc.)."
                  className="w-[362px] max-w-none"
                />
                {ECO_PRODUCTS.map((p) => (
                  <EcoCardP key={p.name} p={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
