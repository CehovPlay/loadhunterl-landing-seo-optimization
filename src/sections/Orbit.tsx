/**
 * Figma: Group 2085665057 (914:23049) — 1920x2014 @ page y=9627.
 * White orbit region spans y 10252–11641 (h=1389); the group's top 625px
 * are hidden under the dark Tools section in the design, so we clip them.
 * Exported as a single 2x PNG (decorative graphic, no live text).
 */
export function Orbit() {
  return (
    <section className="relative h-[1389px] w-full overflow-hidden bg-white">
      <img
        src="/figma/orbit-full.png"
        alt=""
        aria-hidden
        className="absolute left-0 top-[-625px] w-[1920px] max-w-none"
      />
    </section>
  )
}
