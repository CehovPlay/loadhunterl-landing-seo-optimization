import { TabletNavbar } from "./TabletNavbar"
import { TabletHero } from "./TabletHero"
import { TabletFeatures } from "./TabletFeatures"
import { TabletMain } from "./TabletMain"
import { TabletBottom } from "./TabletBottom"

/** Figma: Tablet (768) frame 916:70003 — 768x19032 */
export function TabletLanding() {
  return (
    <div className="relative bg-gray-800 text-dark-text">
      <TabletNavbar />
      <main>
        <TabletHero />
        <TabletFeatures />
        <TabletMain />
      </main>
      <TabletBottom />
    </div>
  )
}
