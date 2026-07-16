/**
 * Static mobile take on the desktop ChaosZoom: the phrase on the light band,
 * then a HARD cut into the dark Tools section (no gradient), all words in the
 * same ink color — per design feedback.
 */
export function MobileChaos() {
  return (
    <section className="bg-[#fafafa]">
      <div className="mx-auto w-full max-w-[440px] px-5 py-16">
        <p className="text-center text-[clamp(30px,8.5vw,38px)] font-medium leading-[1.15] tracking-[-0.04em] text-[#1a1a1a]">
          From chaos to AI-Powered dispatch
        </p>
      </div>
    </section>
  )
}
