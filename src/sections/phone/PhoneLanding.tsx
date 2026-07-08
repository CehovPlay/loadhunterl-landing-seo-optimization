import { PhoneNavbar } from "./PhoneNavbar"
import { PhoneHero } from "./PhoneHero"
import { PhoneFeatures } from "./PhoneFeatures"
import { PhoneTools } from "./PhoneTools"
import { PhoneOrbitEco } from "./PhoneOrbitEco"
import { PhoneWhy } from "./PhoneWhy"
import { PhoneChaos } from "./PhoneChaos"
import { PhonePricing } from "./PhonePricing"
import { PhoneTail } from "./PhoneTail"

/** Figma: Phone (390) frame 916:71549 — 390x15597 */
export function PhoneLanding() {
  return (
    <div className="relative bg-gray-800 text-dark-text">
      <PhoneNavbar />
      <main>
        <PhoneHero />
        <PhoneFeatures />
        <PhoneTools />
        <PhoneOrbitEco />
        <PhoneWhy />
        <PhoneChaos />
        <PhonePricing />
      </main>
      <PhoneTail />
    </div>
  )
}
