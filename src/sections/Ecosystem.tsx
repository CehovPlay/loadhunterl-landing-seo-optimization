/**
 * Figma: Frame 2147238581 (914:26048) — light card 1680x1000 @ (120, 11018).
 * The card floats over the orbit section (which ends at y=11641) and hangs
 * 377px into the dark region below; this section provides those 377px and
 * pulls the card up with a negative offset.
 * Right column (914:26049, 1034x1000 @ x=646) is an internally scrollable
 * list of six product rows (954x320, 20px gaps — list 914:26050). Row card
 * states (default/hovered) from "Ecosystemproducts card states" (935:69290):
 * on hover the description block moves from the bottom of the text panel to
 * the vertical center of the space below the logo, and the lh/tms mockups
 * pan (cross-faded via a second baked export).
 */

interface Product {
  name: string
  description: string
  /** logo box width in px (height is always 24, at (32,32)) */
  logoWidth: number
  logo: string
  mockup: string
  /** lh/tms mockups pan on hover — separate baked export */
  mockupHover?: string
  comingSoon?: boolean
}

const PRODUCTS: Product[] = [
  {
    name: 'loadhunter',
    description:
      'LoadHunter Extension is a AI browser tool that enhances the load booking process on major LoadBoards (DAT, Truckstop, etc.).',
    logoWidth: 150.5,
    logo: '/figma/eco/logo1.png',
    mockup: '/figma/eco/row1.png',
    mockupHover: '/figma/eco/row1-hover.png',
  },
  {
    name: 'huntTMS',
    description:
      'Comprehensive transport management system providing a single platform to manage all aspects.',
    logoWidth: 113,
    logo: '/figma/eco/logo2.png',
    mockup: '/figma/eco/row2.png',
    mockupHover: '/figma/eco/row2-hover.png',
  },
  {
    name: 'huntPAY',
    description:
      'Comprehensive transport management system providing a single platform to manage all aspects.',
    logoWidth: 109,
    logo: '/figma/eco/logo3.png',
    mockup: '/figma/eco/row3.png',
    comingSoon: true,
  },
  {
    name: 'huntDRIVE',
    description:
      'Comprehensive transport management system providing a single platform to manage all aspects.',
    logoWidth: 130,
    logo: '/figma/eco/logo4.png',
    mockup: '/figma/eco/row4.png',
    comingSoon: true,
  },
  {
    name: 'fleetHUNT',
    description:
      'Comprehensive transport management system providing a single platform to manage all aspects.',
    logoWidth: 126,
    logo: '/figma/eco/logo5.png',
    mockup: '/figma/eco/row5.png',
    comingSoon: true,
  },
  {
    name: 'huntONE',
    description:
      'Comprehensive transport management system providing a single platform to manage all aspects.',
    logoWidth: 114,
    logo: '/figma/eco/logo6.png',
    mockup: '/figma/eco/row6.png',
    comingSoon: true,
  },
]

function ProductRow({ product }: { product: Product }) {
  // Description block: bottom of the panel by default; on hover it centers in
  // the space between the logo (ends y=56) and the panel bottom padding
  // (y=288). With chip the block is 100px tall (188 -> 122), without 48px
  // (240 -> 148). Measured from Figma card-state variants.
  const descTop = product.comingSoon
    ? 'top-[188px] group-hover:top-[122px]'
    : 'top-[240px] group-hover:top-[148px]'

  return (
    <div className="group relative h-[320px] w-[954px] shrink-0 overflow-hidden rounded-[12px] bg-white">
      {/* product mockup (baked export, clipped by the row) */}
      <img loading="lazy" decoding="async"
        src={product.mockup}
        alt={`${product.name} product preview`}
        className="absolute left-[343px] top-0 h-[320px] w-[611px] max-w-none"
      />
      {product.mockupHover && (
        <img loading="lazy" decoding="async"
          src={product.mockupHover}
          alt=""
          aria-hidden="true"
          data-no-reveal
          className="absolute left-[343px] top-0 h-[320px] w-[611px] max-w-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}

      {/* text panel (344 wide, transparent over the white row) */}
      <img loading="lazy" decoding="async"
        src={product.logo}
        alt={product.name}
        className="absolute left-[32px] top-[32px] h-[24px] max-w-none"
        style={{ width: `${product.logoWidth}px` }}
      />
      <div
        className={`absolute left-[32px] w-[280px] transition-[top] duration-300 ease-out ${descTop}`}
      >
        <p className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
          {product.description}
        </p>
        {product.comingSoon && (
          <div className="mt-[24px] inline-flex h-[28px] items-center justify-center rounded-[99px] border border-white bg-[#6f5197] px-[12px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
            <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
              Coming soon
            </span>
          </div>
        )}
      </div>

      {/* row border above the clipped mockup, as in Figma */}
      <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-[#e8e8e8]" />
    </div>
  )
}

export function Ecosystem() {
  // h-[2077px] = the card's 377px footprint + a 1700px scroll runway
  // (600px fullscreen-expand + 1100px inner-list overflow). initEcosystemPin()
  // pins the card at viewport centre and consumes the runway expanding the card
  // to the full viewport and then scrolling the list; see src/lib/ecosystemPin.ts.
  return (
    <section id="offers" data-eco-pin className="relative h-[2077px] bg-gray-800">
      {/* data-no-reveal: the card runs its own pin/expand/list-scroll
          choreography, so it opts out of the global fade-rise cascade (which
          would otherwise fight the pin and could leave rows stuck hidden). */}
      <div
        data-eco-stage
        data-no-reveal
        className="absolute left-[120px] top-[-623px] h-[1000px] w-[1680px] overflow-hidden rounded-[12px] bg-[#e9e9eb] will-change-transform"
      >
        {/* Inner content layer: the panel expands symmetrically around it, so
            this is counter-translated by the pin to keep the content fixed —
            never shifting left/right as the card widens. */}
        <div data-eco-inner className="absolute inset-0 will-change-transform">
        {/* left column — icon rebuilt from the original Figma vector layers:
            everything (grid, ring, glyph) is centered by construction */}
        <div
          data-float
          className="absolute left-[60px] top-[60px] size-[64px] overflow-hidden rounded-[16px]"
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
        <h2 className="absolute left-[60px] top-[184px] w-[526px] text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-ink">
          Our ecosystem products
        </h2>
        <p className="absolute left-[60px] top-[266px] w-[566px] text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-ink">
          Everything you need to find, evaluate, and book loads —
          <br />
          faster, smarter, and in one place.
        </p>

        {/* right column — product list, scrolled by the pin (not native
            overflow): the page scroll drives data-eco-list's translateY while
            the section is pinned. The window's height/y are also driven by the
            pin so it stretches with the card as it expands to fullscreen.
            See src/lib/ecosystemPin.ts. */}
        <div
          data-eco-window
          className="absolute left-[646px] top-0 h-[1000px] w-[1034px] overflow-hidden will-change-[transform,height]"
        >
          <div
            data-eco-list
            className="ml-[40px] flex w-[954px] flex-col gap-[20px] py-[40px] will-change-transform"
          >
            {PRODUCTS.map((product) => (
              <ProductRow key={product.name} product={product} />
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
