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
      {/* TabletBottom stays inside <main>: the reveal system only scans
          main/footer subtrees, and its own FooterSection is a scoped <footer> */}
      <main>
        <TabletHero />
        <TabletFeatures />
        <TabletMain />
        <TabletBottom />
      </main>
    </div>
  )
}
