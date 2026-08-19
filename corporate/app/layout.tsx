import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { SITE_URL } from "@/content/home"
import { SmoothScroll } from "@/components/SmoothScroll"
import "./globals.css"

/**
 * Inter is the brand face, taken from the Figma token set the extension landing
 * already ships. Two weights only: 500 carries every heading and control the
 * way the brand file specifies, 400 is added for long-form body, which a
 * 47-page corporate site has and a one-screen landing did not.
 *
 * Geist Mono is the second family, and it earns its place: TZ §25.3 wants the
 * page to read as route linework with coordinates, statuses and checkpoints, so
 * every figure that is data rather than prose is set in tabular mono.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-geist-mono",
  display: "swap",
})

/**
 * Metadata, from tab 01's SEO section verbatim. The only edit is the trailing
 * period on the title, which is the document's own sentence punctuation in
 * "Title: ... . Description: ..." rather than part of the title.
 *
 * Master §27.17 carries a different pair ("Trucking Dispatch & Freight
 * Operations Software | LoadHunter"). The page tab wins here, like the rest of
 * this page; the conflict is logged in the TZ README for the owner to settle.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "LoadHunter - One Operating System for Freight Operations",
  description:
    "Connect load discovery, dispatch, driver workflows, payments and operational intelligence in one modular freight ecosystem.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LoadHunter",
    /* Same page, not the same sentence: the tab requires title, description and
       H1 to describe one page without repeating each other word for word. */
    title: "Run freight as one connected operation",
    description:
      "Five focused products for load discovery, dispatch, driver workflows, invoicing and operational visibility.",
  },
}

/**
 * Organization and WebSite only, and only fields that are visible on the page
 * or already public. TZ §10.3 forbids markup describing anything the visitor
 * cannot see, and the legal entity, contacts and social profiles belong to the
 * Brand Registry (§14.3), which does not exist yet.
 */
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LoadHunter",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-icon.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LoadHunter",
    url: SITE_URL,
  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* The inline script below stamps data-js on this element before React
       hydrates, which is a deliberate server/client difference. */
    <html
      lang="en-US"
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint, so the staged CTAs start closed for anyone who
            can actually open them and stay open for anyone who cannot. */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.dataset.js="on"` }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-small focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <SmoothScroll />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
