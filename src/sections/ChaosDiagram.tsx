import diagram from "/figma/misc/chaos-diagram.png"

/**
 * Figma: heading Frame 1618875000 (914:23227) @ (418,13136), inner text 760 @ x=580;
 * diagram Group 2085665202 (914:23232) 1680x551 @ (120,13302).
 * Section spans page y 13136–14097 (h=961).
 */
export function ChaosDiagram() {
  return (
    <section className="relative h-[961px] bg-gray-800">
      <h2 className="absolute left-[580px] top-0 w-[760px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-white">
        From chaos to AI-Powered dispatch
      </h2>
      <p className="absolute left-[580px] top-[78px] w-[760px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Stop refreshing load boards, rewriting emails, and calculating profits
        by hand. LoadHunter automates the busywork so your team can find better
        loads, respond faster, and book with confidence.
      </p>

      {/* rings + icons + pill — decorative 2x export */}
      <img
        src={diagram}
        alt=""
        aria-hidden
        data-parallax="0.04"
        className="absolute left-[120px] top-[166px] w-[1681px] max-w-none"
      />
    </section>
  )
}
