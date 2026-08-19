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

/* TZ §27.17 - approved metadata for the homepage. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Trucking Dispatch & Freight Operations Software | LoadHunter",
  description:
    "Find and evaluate loads, manage dispatch, coordinate drivers and documents, and connect invoicing and payments across five LoadHunter products.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "LoadHunter",
    title: "Run your entire freight operation, from load search to payment",
    description:
      "Five connected products for load discovery, dispatch, driver workflows, invoicing and operational visibility.",
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
    <html lang="en-US" className={`${inter.variable} ${geistMono.variable}`}>
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
