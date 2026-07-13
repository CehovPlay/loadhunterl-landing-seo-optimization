import { Img } from "@/components/site/Img"
/**
 * Figma: Group 2085665223 (926:113308) — 1680 wide, clipped to 390 by the
 * phone frame; section spans frame y 9095..9785 (h=690).
 * Heading (Frame 1618873946 @ (-2,9095), inner x=14 → canvas x=12) is live
 * text; the diagram (Group 2085665215, 924:101382, incl. the glassy caption
 * pill) is a clipped 2x export placed at y=216 (390x354). 120px dark below.
 */
export function PhoneChaos() {
  return (
    <section className="relative overflow-hidden bg-gray-800 [content-visibility:auto] [contain-intrinsic-size:390px_690px]" style={{ height: 690 }}>
      <h2 className="absolute left-[12px] top-0 w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-white">
        From chaos to
        <br />
        AI-Powered dispatch
      </h2>
      <p className="absolute left-[12px] top-[72px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        Stop refreshing load boards, rewriting emails, and calculating profits
        by hand. LoadHunter automates the busywork so your team can find better
        loads, respond faster, and book with confidence.
      </p>

      {/* rings + icon nodes + caption pill — decorative 2x export (clipped render) */}
      <Img
        src="/figma/phone/chaos.png"
        data-parallax="0.04"
        alt="Turn manual dispatching into a faster, cleaner workflow powered by AI. LoadHunter helps your team find better loads."
        loading="lazy"
        decoding="async"
        className="absolute left-0 top-[216px] w-[390px] max-w-none"
      />
    </section>
  )
}
