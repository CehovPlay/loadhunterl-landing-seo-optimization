import { HdNavbar } from "./HdNavbar"
import { HdHero } from "./HdHero"

/**
 * HD (1440) desktop canvas — Figma frame 916:73794. Serves the 1024–1919 band
 * (DesignFrame scales it to fill). A horizontal reflow of the 1920 DesktopLanding
 * (different container widths / side paddings / grid columns; heights + most
 * assets reused). Built section-by-section against the Figma 1440 frame.
 */
export function HdLanding() {
  return (
    <div className="relative bg-gray-800 text-dark-text">
      <HdNavbar />
      <main>
        <HdHero />
      </main>
    </div>
  )
}
