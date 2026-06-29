import { Container } from "@/components/site/Container"
import { IconBadge } from "@/components/site/IconBadge"
import { Settings2 } from "lucide-react"

export function DispatchIntro() {
  return (
    <section className="bg-gray-900 py-28">
      <Container className="text-center">
        <IconBadge>
          <Settings2 className="size-5" />
        </IconBadge>
        <h2 className="mx-auto mt-8 max-w-3xl text-h2 font-medium leading-[1.14] tracking-[-0.02em] text-dark-text">
          Book better loads faster — without missing opportunities with
          game-changing tools for dispatchers
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-small leading-relaxed text-gray-200">
          LoadHunter finds high-RPM loads in real-time, filters the noise, and
          lets you contact brokers instantly — all in one place. Real-time load
          scanning, smart filters, and instant outreach — built for dispatchers
          who want results, not dashboards.
        </p>
      </Container>
    </section>
  )
}
