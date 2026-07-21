import { Img } from "@/components/site/Img"

type Product = {
  name: string
  description: string
  /** baked wordmark export; when absent, `logoText` composes glyph + text */
  logo?: string
  logoWidth?: number
  logoText?: string
  mockup: string
  /** % of card width to pull the mockup up — hides a baked-in sliced top edge
   *  (some desktop exports were pre-cropped for the desktop row window; the
   *  mock must only ever read as cropped at its bottom/right) */
  mockupShift?: number
  comingSoon?: boolean
}

const PRODUCTS: Product[] = [
  {
    name: "loadhunter",
    description:
      "LoadHunter Extension is an AI browser tool that enhances the load booking process on major load boards (DAT, Truckstop, etc.).",
    logo: "/figma/eco/logo1.png",
    logoWidth: 150.5,
    mockup: "/figma/eco/row1.png",
    mockupShift: 2.5,
  },
  {
    name: "huntTMS",
    description:
      "A complete transport management system — dispatch, driver timelines and operations on one platform.",
    logo: "/figma/eco/logo2.png",
    logoWidth: 113,
    mockup: "/figma/eco/row2.png",
    mockupShift: 0.8,
  },
  {
    name: "huntPAY",
    description:
      "Faster settlements and factoring — automated invoicing and payment tracking so you get paid sooner.",
    logo: "/figma/eco/logo3.png",
    logoWidth: 109,
    mockup: "/figma/eco/row3.png",
    comingSoon: true,
  },
  {
    name: "huntDRIVE",
    description:
      "The driver companion app — trips, documents and dispatch chat, right from the cab.",
    logo: "/figma/eco/logo4.png",
    logoWidth: 130,
    mockup: "/figma/eco/row4.png",
    comingSoon: true,
  },
  {
    name: "huntOS",
    description:
      "One operating system for your whole trucking business — every load board, your fleet and daily operations in a single workspace.",
    logoText: "huntOS",
    mockup: "/figma/eco/row6.png",
    comingSoon: true,
  },
]

/**
 * Mobile Ecosystem: the desktop light panel (var(--color-gray-50)) reflowed — same
 * icon-plate with the violet glow, same left-aligned ink heading/sub type,
 * and the product rows as WHITE cards (the logo exports carry a baked white
 * background, so rows must stay white like desktop) in a horizontal snap
 * carousel. Desktop row typography: description 14/16 ink-2, violet
 * "Coming soon" chip.
 */
export function MobileEcosystem() {
  return (
    <section id="offers" className="bg-gray-50 py-16">
      <div className="mx-auto w-full max-w-[440px] px-5 md:max-w-[768px] md:px-8">
        {/* icon plate — desktop composition */}
        <div
          data-float
          className="relative size-[56px] overflow-hidden rounded-[14px]"
          style={{ boxShadow: "0px 6px 16px -6px rgba(146,92,255,0.48)" }}
        >
          <Img src="/figma/eco/icon-plate.png" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full" />
          <Img src="/figma/eco/icon-glyph.svg" alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full" />
          <div
            className="pointer-events-none absolute inset-0 rounded-[14px]"
            style={{
              boxShadow:
                "inset 0px 0px 1px 0px var(--color-violet-glow), inset 0px 0px 3px 0px rgba(146,92,255,0.24), inset 0px 0px 12px 0px rgba(146,92,255,0.12)",
            }}
          />
        </div>

        <h2 className="mt-8 text-[clamp(28px,7.7vw,34px)] font-medium leading-[1.2] tracking-[-0.04em] text-ink md:text-[40px] md:leading-[48px]">
          Our ecosystem products
        </h2>
        <p className="mt-4 max-w-[640px] text-[16px] font-medium leading-[21px] tracking-[-0.64px] text-ink">
          Everything you need to find, evaluate, and book loads — faster, smarter, and in one
          place.
        </p>
      </div>

      {/* product rows — white cards like the desktop list, snap carousel */}
      <div className="lh-snap mt-10 flex gap-4 overflow-x-auto pb-2 px-[max(20px,calc((100vw-440px)/2+20px))] md:px-[max(32px,calc((100vw-768px)/2+32px))]">
        {PRODUCTS.map((p) => (
          <article
            key={p.name}
            data-card
            className="relative flex w-[82vw] max-w-[380px] shrink-0 flex-col overflow-hidden rounded-lg border border-border-light bg-white p-6 md:w-[420px] md:max-w-[420px]"
          >
            {p.logo ? (
              <Img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="h-6 max-w-none"
                style={{ width: p.logoWidth }}
              />
            ) : (
              <div className="flex h-6 items-center gap-[9px]">
                <img src="/figma/logo-icon.svg" alt="" loading="lazy" decoding="async" className="size-6 max-w-none" />
                <span className="text-[23px] font-semibold leading-6 tracking-[-0.92px] text-ink">
                  {p.logoText}
                </span>
              </div>
            )}
            <p className="mt-4 min-h-[64px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
              {p.description}
            </p>
            {p.comingSoon ? (
              <div className="mt-1 inline-flex h-[28px] w-fit items-center justify-center rounded-full border border-white bg-violet px-[12px] shadow-pill">
                <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
                  Coming soon
                </span>
              </div>
            ) : (
              <div className="mt-1 h-[28px]" aria-hidden />
            )}
            {/* mockup — clipped by the card edge like the desktop row; the export
                carries a thin baked gray-800 strip on its right/top edges, so the
                image is oversized ~2% and the wrapper clips it away */}
            <div className="-mx-6 -mb-6 mt-4 overflow-hidden">
              <Img
                src={p.mockup}
                alt={`${p.name} product preview`}
                loading="lazy"
                decoding="async"
                className="block w-[102%] max-w-none"
                style={{ marginTop: p.mockupShift ? `-${p.mockupShift}%` : -1 }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
