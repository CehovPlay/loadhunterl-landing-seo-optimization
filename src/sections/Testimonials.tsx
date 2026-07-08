/**
 * Figma: header Frame 1618873946 (914:23696) 1920x320 @ y=15559,
 * reviews strip (914:23713) 643x42 @ (638.5, +278),
 * cards Group 2085665201 (914:23741) — export clipped to canvas: 1920x544,
 * matched to page (0, 15979) by correlation; cursor (914:23796) @ (958.5, 16194).
 * Section spans page y 15559–16643 (h=1084).
 */
export function Testimonials() {
  return (
    <section id="contact" className="relative h-[1084px] overflow-hidden bg-gray-800">
      {/* heading */}
      <div className="absolute left-[928px] top-0 size-[64px]">
        <img
          src="/figma/tools/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>
      <h2 className="absolute left-[418px] top-[124px] w-[1084px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        What client says
      </h2>
      <p className="absolute left-[418px] top-[202px] w-[1084px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Our clients appreciate our attention to their needs and professionalism.
        Here are some of their testimonials
      </p>

      {/* trust strip: 5,000+ users, 4.7 rating, Google Reviews / Trustpilot / G2 */}
      <img
        src="/figma/reviews-strip.png"
        alt="5,000+ trusted users, 4.7 from 100+ reviews on Google, Trustpilot and G2"
        className="absolute left-[638.5px] top-[278px] w-[643.5px] max-w-none"
      />

      {/* testimonial cards marquee (decorative export, clipped at canvas edges) */}
      <img
        src="/figma/testimonial-cards.png"
        alt="Client testimonials"
        className="absolute left-0 top-[420px] w-[1920px] max-w-none"
      />
      <img
        src="/figma/testimonial-cursor.png"
        alt=""
        aria-hidden
        className="absolute left-[958.5px] top-[635px] w-[27px] max-w-none"
      />
    </section>
  )
}
