/**
 * Figma: Frame 2147238581 (914:26048) — light card 1680x1000 @ (120, 11018).
 * The card floats over the orbit section (which ends at y=11641) and hangs
 * 377px into the dark region below; this section provides those 377px and
 * pulls the card up with a negative offset.
 * Right column (product showcase, 1034x1000) is a single 2x export.
 */
export function Ecosystem() {
  return (
    <section id="offers" className="relative h-[377px] bg-gray-800">
      <div className="absolute left-[120px] top-[-623px] h-[1000px] w-[1680px] overflow-hidden rounded-[12px] bg-[#e9e9eb]">
        {/* left column */}
        <div className="absolute left-[60px] top-[60px] size-[64px]">
          <img
            src="/figma/feat-icon-2x.png"
            alt=""
            className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
          />
        </div>
        <h2 className="absolute left-[60px] top-[184px] w-[526px] text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-ink">
          Our ecosystem products
        </h2>
        <p className="absolute left-[60px] top-[266px] w-[566px] text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-ink">
          Everything you need to find, evaluate, and book loads — faster,
          smarter, and in one place.
        </p>

        {/* right column — product showcase export */}
        <img
          src="/figma/eco-right.png"
          alt="LoadHunter ecosystem products: loadhunter extension, huntTMS, huntPAY"
          className="absolute left-[646px] top-0 w-[1034px] max-w-none"
        />
      </div>
    </section>
  )
}
