import { ImageResponse } from "next/og"
import { BRAND } from "@/content/registry"

/**
 * The social card, generated rather than exported.
 *
 * §10.1 makes a social image part of every indexable page's metadata set, and
 * §11.1 forbids the decorative-gradient SaaS card: "вместо декоративных
 * иллюстраций используются реальные или честно смоделированные фрагменты
 * продукта". A photographic or illustrative card would also need an approved
 * asset, and §18.3 puts partner and product imagery behind sign-off.
 *
 * So the card is the one thing that needs no approval and is true on every
 * page: the brand, the category §1.1 defines, and the route linework §25.3 uses
 * as the site's visual language. Per-page images are a CMS field by §10.1 and
 * override this the moment an editor sets one.
 *
 * Prerendered once at build time - it is a static file in the output, not a
 * function call per request.
 */

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${BRAND.name} - ${BRAND.category}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0F",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* The road: one line, five checkpoints - the five products, in the
            order the homepage walks them. */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: i === 4 ? "#7C5CFF" : "#3A3A46",
                }}
              />
              {i < 4 ? <div style={{ width: 168, height: 2, background: "#26262E" }} /> : null}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 26, color: "#8A8A99", letterSpacing: 0.4 }}>{BRAND.category}</div>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.08,
              color: "#F5F5F7",
              marginTop: 20,
              maxWidth: 900,
            }}
          >
            Run freight as one connected operation.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div style={{ fontSize: 34, color: "#F5F5F7" }}>{BRAND.name}</div>
          <div style={{ fontSize: 24, color: "#8A8A99" }}>
            {BRAND.domain.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
