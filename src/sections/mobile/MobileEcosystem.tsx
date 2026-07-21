import { Img } from "@/components/site/Img"
import { Container } from "./ui"

type Product = {
  name: string
  description: string
  /** baked wordmark export; when absent, `logoText` composes glyph + text */
  logo?: string
  logoWidth?: number
  logoText?: string
  mockup: string
  comingSoon?: boolean
}

/* Mobile mockups are dedicated light exports (public/figma/mobile/eco-*.png)
   drawn for the phone card — bottom/right bleed is baked into the art. */
const PRODUCTS: Product[] = [
  {
    name: "loadhunter",
    description:
      "LoadHunter Extension is an AI browser tool that enhances the load booking process on major load boards (DAT, Truckstop, etc.).",
    logo: "/figma/eco/logo1.png",
    logoWidth: 150.5,
    mockup: "/figma/mobile/eco-loadhunter.png",
  },
  {
    name: "huntTMS",
    description:
      "Comprehensive transport management system providing a single platform to manage all aspects.",
    logo: "/figma/eco/logo2.png",
    logoWidth: 113,
    mockup: "/figma/mobile/eco-tms.png",
  },
  {
    name: "huntPAY",
    description:
      "Faster settlements and factoring — automated invoicing and payment tracking so you get paid sooner.",
    logo: "/figma/eco/logo3.png",
    logoWidth: 109,
    mockup: "/figma/mobile/eco-pay.png",
    comingSoon: true,
  },
  {
    name: "huntDRIVE",
    description:
      "An innovative solution that gives carriers and drivers complete visibility and control over their routes and loads.",
    logo: "/figma/eco/logo4.png",
    logoWidth: 130,
    mockup: "/figma/mobile/eco-drive.png",
    comingSoon: true,
  },
  {
    name: "huntOS",
    description:
      "One operating system for your whole trucking business — every load board, your fleet and daily operations in a single workspace.",
    logoText: "huntOS",
    mockup: "/figma/mobile/eco-os.png",
    comingSoon: true,
  },
]

/**
 * Mobile Ecosystem — the user's own mobile structure (Figma 1263:84768):
 * centred section header, then the product cards STACKED vertically (no
 * carousel). Card: logo row (wordmark left, violet "Coming soon" pill
 * right), description, and the mockup filling the card's bottom edge.
 */
export function MobileEcosystem() {
  return (
    <section id="offers" className="bg-gray-50 py-16">
      <Container>
        {/* centred icon plate — desktop composition */}
        <div className="flex flex-col items-center text-center">
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

        {/* product cards — stacked, one under another */}
        <div className="mx-auto mt-10 flex max-w-[560px] flex-col gap-5">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              data-card
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border-light bg-white pt-6"
            >
              <div className="px-6">
              {/* no justify-between: Img's <picture class="contents"> exposes
                  its zero-width <source> children as flex items, which shoves
                  the img to flex-end — ml-auto on the pill instead */}
              <div className="flex items-center gap-3">
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
                {p.comingSoon && (
                  <span className="ml-auto flex h-[28px] shrink-0 items-center rounded-full border border-white bg-violet px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white shadow-pill">
                    Coming soon
                  </span>
                )}
              </div>
              <p className="mt-6 text-[14px] font-medium leading-[18px] tracking-[-0.56px] text-ink-2">
                {p.description}
              </p>
              </div>
              {/* the mockup export carries its own bottom/right bleed */}
              <Img
                src={p.mockup}
                alt={`${p.name} product preview`}
                loading="lazy"
                decoding="async"
                className="mt-5 block w-full"
              />
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}
