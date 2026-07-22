/**
 * Footer social icons — Telegram, Instagram, YouTube, X(simple-icons
 * paths, fill=currentColor). Muted gray, brighten on hover; shared by the
 * desktop and flow footers. Each svg carries a TIGHT per-glyph viewBox and
 * a uniform 16px rendered height — the raw 24-box glyphs have different ink
 * heights and read as differently sized ("сделай их все одной высоты"). Telegram/YouTube/X URLs mirror PROD loadhunter.io
 * (checked 2026-07-21).
 */
export function SocialLinks() {
  return (
    <div className="flex items-center gap-[16px] text-[rgba(255,255,255,0.45)]">
      <a
        href="https://t.me/loadhunterextension"
        target="_blank"
        rel="noopener"
        aria-label="LoadHunter on Telegram"
        className="transition-colors hover:text-white"
      >
        <svg width="17.2" height="16" viewBox="2.3 2.87 20.67 19.18" fill="currentColor" aria-hidden>
          <path d="M9.04 15.51l-.38 5.36c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.66.25 1.92-.9L22.9 4.6c.31-1.42-.51-1.98-1.45-1.63L3.36 9.94c-1.38.54-1.36 1.31-.24 1.66l4.62 1.44L18.5 6.28c.5-.33.96-.15.58.18L9.04 15.51z" />
        </svg>
      </a>
      <a
        href="https://www.instagram.com/loadhunter.io/"
        target="_blank"
        rel="noopener"
        aria-label="LoadHunter on Instagram"
        className="transition-colors hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072C2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
        </svg>
      </a>
      <a
        href="https://www.youtube.com/channel/UC5-wNvj8HpG-9fZgFa88SXw"
        target="_blank"
        rel="noopener"
        aria-label="LoadHunter on YouTube"
        className="transition-colors hover:text-white"
      >
        <svg width="22.7" height="16" viewBox="0 3.55 24 16.91" fill="currentColor" aria-hidden>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </a>
      <a
        href="https://x.com/load_hunt"
        target="_blank"
        rel="noopener"
        aria-label="LoadHunter on X"
        className="transition-colors hover:text-white"
      >
        <svg width="17.7" height="16" viewBox="0 1.15 24 21.69" fill="currentColor" aria-hidden>
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
      </a>
    </div>
  )
}
