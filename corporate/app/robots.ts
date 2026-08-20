import type { MetadataRoute } from "next"
import { SITE_URL } from "@/content/registry"

/**
 * Disallow only what is genuinely private. /login and /account are noindex by
 * tab 47 §2; /site-map is the build review surface and is not part of the site
 * at all - it is listed here as a second guard while it still exists, and both
 * the route and this line go before launch.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/login", "/account", "/site-map"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
