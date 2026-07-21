import { useEffect, useState } from "react"
import { Img } from "@/components/site/Img"
import { LINKS } from "@/sections/Navbar"
import { PILL_SHADOW, PillButton } from "./ui"

/**
 * Mobile/tablet navbar: fixed frosted pill bar (logo + 48px hamburger) that
 * folds into a small round button in the top-right corner while scrolling
 * down and expands back on any upward scroll, and a
 * full-screen dropdown menu — 56px-tall link rows (comfortably above the
 * 44px touch minimum), CTA buttons pinned at the bottom above the home
 * indicator (safe-area padding). Body scroll is locked while open; the menu
 * closes on any anchor tap so the smooth-scroll can take over.
 */
export function MobileNavbar() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // scroll-direction collapse: scrolling DOWN past the hero folds the bar into
  // a small pill (just the menu button) in the top-right corner; any upward
  // scroll (or being near the top) expands it back to full width.
  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        // laptops (≥1024) show the full inline nav bar — never collapse there
        if (window.innerWidth >= 1024) {
          setCollapsed(false)
          return
        }
        const y = window.scrollY
        const dy = y - lastY
        if (Math.abs(dy) < 6) return
        setCollapsed(y > 140 && dy > 0)
        lastY = y
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100]"
      style={{ paddingTop: "max(10px, env(safe-area-inset-top))" }}
    >
      <div className="mx-auto flex w-full max-w-[440px] justify-end px-4 md:max-w-[768px] md:px-8">
        <div
          className={`flex h-14 items-center justify-between overflow-hidden rounded-full border border-border-light bg-white/85 backdrop-blur-[10px] transition-[width,padding] duration-500 ease-out ${
            collapsed && !open ? "px-[3px]" : "pl-4 pr-1.5"
          }`}
          style={{ boxShadow: PILL_SHADOW, width: collapsed && !open ? 56 : "100%" }}
        >
          <a
            href="#"
            className={`flex items-center gap-2 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-500 ${
              collapsed && !open
                ? "pointer-events-none max-w-0 opacity-0"
                : "max-w-[160px] opacity-100"
            }`}
            aria-label="LoadHunter — home"
          >
            <Img src="/figma/logo-icon.svg" alt="" className="h-[26px] w-[27px] max-w-none" />
            <Img src="/figma/logo-text.svg" alt="LoadHunter" className="h-[15px] w-[94px] max-w-none" />
          </a>

          {/* laptop: inline nav links (desktop treatment) */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 px-4">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                className="whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium leading-[20px] tracking-[-0.6px] text-ink transition-colors hover:bg-black/[0.04]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* laptop: compact CTA on the right */}
          <a
            href="#start"
            className="hidden h-10 shrink-0 items-center gap-2 rounded-full bg-violet px-5 text-[15px] font-medium leading-[20px] tracking-[-0.6px] text-white transition-transform active:scale-[0.98]"
          >
            Add to Chrome
          </a>

          {/* phone/tablet: hamburger ⇄ cross */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex size-12 items-center justify-center rounded-full"
          >
            <span
              className="absolute h-[2px] w-5 rounded-full bg-ink transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "translateY(-3.5px)" }}
            />
            <span
              className="absolute h-[2px] w-5 rounded-full bg-ink transition-transform duration-300"
              style={{ transform: open ? "rotate(-45deg)" : "translateY(3.5px)" }}
            />
          </button>
        </div>
      </div>

      {/* full-screen menu */}
      <div
        className={`fixed inset-0 -z-10 flex flex-col bg-white transition-[opacity,visibility] duration-300 md:bottom-auto md:rounded-b-3xl md:pb-8 md:shadow-[0px_24px_48px_-12px_rgba(0,0,0,0.18)] ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{
          paddingTop: "calc(max(10px, env(safe-area-inset-top)) + 72px)",
          paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        }}
        aria-hidden={!open}
      >
        <nav className="mx-auto flex w-full max-w-[440px] flex-1 flex-col overflow-y-auto px-5 md:max-w-[768px] md:flex-none md:px-8">
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
              style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              onClick={() => {
                // unlock scroll synchronously — the anchor smooth-scroll fires
                // in this same tick, before the effect cleanup would run
                document.body.style.overflow = ""
                setOpen(false)
              }}
              className={`flex h-14 items-center border-b border-gray-75 text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-ink transition-[opacity,transform] duration-300 ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mx-auto flex w-full max-w-[440px] flex-col gap-3 px-5 pt-4 md:max-w-[768px] md:px-8">
          <PillButton
            href="https://t.me/loadhunterextension"
            target="_blank"
            rel="noopener"
            variant="white"
          >
            Get Demo
          </PillButton>
          <PillButton href="#start" variant="violet">
            Add to Chrome
          </PillButton>
        </div>
      </div>
    </header>
  )
}
