import { Logo } from "@/components/site/Logo"
import { Container } from "@/components/site/Container"

const LINKS = [
  { label: "Why us", href: "#why" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "Our offers", href: "#offers" },
  { label: "$LHUNT", href: "#token" },
]

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-5">
      <Container className="flex items-center justify-between">
        <a
          href="#"
          className="inline-flex items-center rounded-full border border-line bg-gray-800/80 px-4 py-2.5 backdrop-blur-md"
        >
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 rounded-full border border-line bg-gray-800/80 px-1.5 py-1.5 backdrop-blur-md lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-small text-gray-200 transition-colors hover:bg-white/5 hover:text-dark-text"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  )
}
