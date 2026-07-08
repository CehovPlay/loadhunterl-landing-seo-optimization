/**
 * Figma: Frame 1618875000 (914:23996) — 1680x1080 @ x=120, first child of the
 * dark tools mega-frame (page y=2194). Icon 64px @ (808,410), H2 @ y=514,
 * subtitle @ y=654.
 */
export function DispatchIntro() {
  return (
    <section className="relative h-[1080px] bg-gray-800">
      {/* icon — 64x64 box, PNG render 84x84 incl. shadow (offset -10/-4) */}
      <div className="absolute left-[928px] top-[410px] size-[64px]">
        <img
          src="/figma/tools/intro-icon.png"
          alt=""
          className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
        />
      </div>

      <h2 className="absolute left-[120px] top-[514px] w-[1680px] text-center text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-gray-50">
        Book better loads faster — without missing opportunities with
        <br />
        game-changing tools for dispatchers
      </h2>

      <p className="absolute left-[120px] top-[654px] w-[1680px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
        LoadHunter finds high-RPM loads in real-time, filters the noise, and
        lets you contact brokers instantly — all in one place. Real-time load
        scanning, smart filters, and instant outreach — built for dispatchers
        who want results, not dashboards.
      </p>
    </section>
  )
}
