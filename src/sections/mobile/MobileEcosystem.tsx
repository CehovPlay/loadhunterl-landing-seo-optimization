import { Img } from "@/components/site/Img"

type Product = {
  name: string
  description: string
  logo: string
  logoWidth: number
  mockup: string
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
  },
  {
    name: "huntTMS",
    description:
      "A complete transport management system — dispatch, driver timelines and operations on one platform.",
    logo: "/figma/eco/logo2.png",
    logoWidth: 113,
    mockup: "/figma/eco/row2.png",
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
    name: "fleetHUNT",
    description:
      "Fleet management at scale — track trucks, maintenance and utilization across your whole fleet.",
    logo: "/figma/eco/logo5.png",
    logoWidth: 126,
    mockup: "/figma/eco/row5.png",
    comingSoon: true,
  },
  {
    name: "huntONE",
    description:
      "Every load board in one place — unified search across DAT, Truckstop and more.",
    logo: "/figma/eco/logo6.png",
    logoWidth: 114,
    mockup: "/figma/eco/row6.png",
    comingSoon: true,
  },
]

/**
 * Mobile Ecosystem: the desktop light panel (#e9e9eb) reflowed — same
 * icon-plate with the violet glow, same left-aligned ink heading/sub type,
 * and the product rows as WHITE cards (the logo exports carry a baked white
 * background, so rows must stay white like desktop) in a horizontal snap
 * carousel. Desktop row typography: description 14/16 ink-2, violet
 * "Coming soon" chip.
 */
export function MobileEcosystem() {
  return (
    <section id="offers" className="bg-[#e9e9eb] py-16">
      <div className="mx-auto w-full max-w-[440px] px-5 md:max-w-[768px] md:px-8 lg:max-w-[1024px] lg:px-10 xl:max-w-[1200px] 2xl:max-w-[1320px]">
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
                "inset 0px 0px 1px 0px #925cff, inset 0px 0px 3px 0px rgba(146,92,255,0.24), inset 0px 0px 12px 0px rgba(146,92,255,0.12)",
            }}
          />
        </div>

        <h2 className="mt-8 text-[clamp(28px,7.7vw,34px)] font-medium leading-[1.2] tracking-[-0.04em] text-ink md:text-[40px] md:leading-[48px] lg:text-[48px] lg:leading-[56px] xl:text-[56px] xl:leading-[64px]">
          Our ecosystem products
        </h2>
        <p className="mt-4 max-w-[640px] text-[16px] font-medium leading-[21px] tracking-[-0.64px] text-ink lg:mt-5 lg:text-[18px] lg:leading-[24px]">
          Everything you need to find, evaluate, and book loads — faster, smarter, and in one
          place.
        </p>
      </div>

      {/* product rows — white cards like the desktop list, snap carousel */}
      <div className="lh-snap mt-10 flex gap-4 overflow-x-auto pb-2 px-[max(20px,calc((100vw-440px)/2+20px))] md:px-[max(32px,calc((100vw-768px)/2+32px))] lg:mt-12 lg:gap-6 lg:px-[max(40px,calc((100vw-1024px)/2+40px))] xl:px-[max(40px,calc((100vw-1200px)/2+40px))] 2xl:px-[max(40px,calc((100vw-1320px)/2+40px))]">
        {PRODUCTS.map((p) => (
          <article
            key={p.name}
            data-card
            className="relative flex w-[82vw] max-w-[380px] shrink-0 flex-col overflow-hidden rounded-[12px] border border-[#e8e8e8] bg-white p-6 md:w-[420px] md:max-w-[420px]"
          >
            <Img
              src={p.logo}
              alt={p.name}
              loading="lazy"
              decoding="async"
              className="h-6 max-w-none"
              style={{ width: p.logoWidth }}
            />
            <p className="mt-4 min-h-[64px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
              {p.description}
            </p>
            {p.comingSoon ? (
              <div className="mt-1 inline-flex h-[28px] w-fit items-center justify-center rounded-[99px] border border-white bg-[#6f5197] px-[12px] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.05),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]">
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
                className="-mt-px block w-[102%] max-w-none"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
