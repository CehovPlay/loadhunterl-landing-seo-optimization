import { Img } from "@/components/site/Img"
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
  logoWidth?: number
  /** baked wordmark export; when absent, `logoText` composes glyph + text */
  logo?: string
  /** products without a baked wordmark render the site glyph + this text */
  logoText?: string
  mockup: string
  /** px to sink the mock below the row bottom — hides an awkward half-cut
   *  last row baked into the export (crop stays bottom-only) */
  mockDrop?: number
  comingSoon?: boolean
}

const PRODUCTS: Product[] = [
  {
    name: 'loadhunter',
    description:
      'LoadHunter Extension is an AI browser tool that enhances the load booking process on major load boards (DAT, Truckstop, etc.).',
    logoWidth: 150.5,
    logo: '/figma/eco/logo1.png',
    mockup: '/figma/desk/eco-loadhunter.png',
  },
  {
    name: 'huntTMS',
    description:
      'A complete transport management system — dispatch, driver timelines and operations on one platform.',
    logoWidth: 113,
    logo: '/figma/eco/logo2.png',
    mockup: '/figma/desk/eco-tms.png',
  },
  {
    name: 'huntPAY',
    description:
      'Faster settlements and factoring — automated invoicing and payment tracking so you get paid sooner.',
    logoWidth: 109,
    logo: '/figma/eco/logo3.png',
    mockup: '/figma/desk/eco-pay.png',
    comingSoon: true,
  },
  {
    name: 'huntDRIVE',
    description:
      'The driver companion app — trips, documents and dispatch chat, right from the cab.',
    logoWidth: 130,
    logo: '/figma/eco/logo4.png',
    mockup: '/figma/desk/eco-drive.png',
    comingSoon: true,
  },
  {
    name: 'huntOS',
    description:
      'One operating system for your whole trucking business — every load board, your fleet and daily operations in a single workspace.',
    logoText: 'huntOS',
    mockup: '/figma/desk/eco-os.png',
    mockDrop: 26,
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
    <div className="group relative h-[320px] w-[954px] shrink-0 overflow-hidden rounded-lg bg-white">
      {/* product mockup — scaled to the row height minus a 20px top inset, pinned to the window's
          BOTTOM-LEFT corner; the row's overflow-hidden crops only the right
          (the white exports are composed for a bottom-left anchor) */}
      <Img
        src={product.mockup}
        alt={`${product.name} product preview`}
        loading="lazy"
        decoding="async"
        className="absolute left-[343px] h-[300px] w-auto max-w-none"
        style={{ bottom: -(product.mockDrop ?? 0) }}
      />

      {/* text panel (344 wide, transparent over the white row) */}
      {product.logo ? (
        <Img
          src={product.logo}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="absolute left-[32px] top-[32px] h-[24px] max-w-none"
          style={{ width: `${product.logoWidth}px` }}
        />
      ) : (
        <div className="absolute left-[32px] top-[32px] flex h-[24px] items-center gap-[9px]">
          <img
            src="/figma/logo-icon.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="size-[24px] max-w-none"
          />
          <span className="text-[23px] font-semibold leading-[24px] tracking-[-0.92px] text-ink">
            {product.logoText}
          </span>
        </div>
      )}
      <div
        className={`absolute left-[32px] w-[280px] transition-[top] duration-300 ease-out ${descTop}`}
      >
        <p className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
          {product.description}
        </p>
        {product.comingSoon && (
          <div className="mt-[24px] inline-flex h-[28px] items-center justify-center rounded-full border border-white bg-violet px-[12px] shadow-pill">
            <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
              Coming soon
            </span>
          </div>
        )}
      </div>

      {/* row border above the clipped mockup, as in Figma */}
      <div className="pointer-events-none absolute inset-0 rounded-lg border border-border-light" />
    </div>
  )
}

export function Ecosystem() {
  // h-[2077px] = the card's 377px footprint + a 1700px scroll runway
  // (600px fullscreen-expand + 1100px inner-list overflow). initEcosystemPin()
  // pins the card at viewport centre and consumes the runway expanding the card
  // to the full viewport and then scrolling the list; see src/lib/ecosystemPin.ts.
  //
  // NO content-visibility on this section: it implies paint containment, which
  // clips children to the section box — but the ecosystem panel deliberately
  // hangs 623px ABOVE this section, floating over the orbit rings (Figma: panel
  // 1680x1000 @ page y 11018, section starts 11641), and the pin later grows it
  // to cover the whole viewport. Containment was cutting off the panel's
  // heading + loadhunter row.
  return (
    <section id="offers" data-eco-pin className="relative h-[2077px]">
      {/* dark bg starts BELOW the hang-over zone (card bottom = y 377): the
          top strip stays transparent so the Orbit shader band — extended past
          its section (see Orbit EXTEND) — stays visible around the card until
          the pin expands it to full screen */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 top-[1377px] bg-gray-800" />
      {/* data-no-reveal: the card runs its own pin/expand/list-scroll
          choreography, so it opts out of the global fade-rise cascade (which
          would otherwise fight the pin and could leave rows stuck hidden). */}
      <div
        data-eco-stage
        data-no-reveal
        className="absolute left-[120px] top-[-623px] h-[1000px] w-[1680px] overflow-hidden rounded-lg bg-gray-50 will-change-transform"
      >
        {/* Inner content layer: the panel expands symmetrically around it, so
            this is counter-translated by the pin to keep the content fixed —
            never shifting left/right as the card widens. */}
        <div data-eco-inner className="absolute inset-0 will-change-transform">
        {/* left column — icon rebuilt from the original Figma vector layers:
            everything (grid, ring, glyph) is centered by construction */}
        <div
          data-float
          className="absolute left-[60px] top-[60px] size-[64px] overflow-hidden rounded-xl"
          style={{ boxShadow: "0px 6px 16px -6px rgba(146,92,255,0.48)" }}
        >
          <Img
            src="/figma/eco/icon-plate.png"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full"
          />
          <Img
            src="/figma/eco/icon-glyph.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full"
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{
              boxShadow:
                "inset 0px 0px 1px 0px var(--color-violet-glow), inset 0px 0px 3px 0px rgba(146,92,255,0.24), inset 0px 0px 12px 0px rgba(146,92,255,0.12)",
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
