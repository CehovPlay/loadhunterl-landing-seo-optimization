import { useEffect, useState } from "react"
import { Img } from "@/components/site/Img"
import { LINKS } from "@/sections/Navbar"
import { PILL_SHADOW, PillButton } from "./ui"

/**
 * Mobile navbar: fixed frosted pill bar (logo + 48px hamburger) and a
 * full-screen dropdown menu — 56px-tall link rows (comfortably above the
 * 44px touch minimum), CTA buttons pinned at the bottom above the home
 * indicator (safe-area padding). Body scroll is locked while open; the menu
 * closes on any anchor tap so the smooth-scroll can take over.
 */
export function MobileNavbar() {
  const [open, setOpen] = useState(false)

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
      <div className="mx-auto w-full max-w-[440px] px-4">
        <div
          className="flex h-14 items-center justify-between rounded-full border border-[#ececec] bg-white/85 pl-4 pr-1.5 backdrop-blur-[10px]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <a href="#" className="flex items-center gap-2" aria-label="LoadHunter — home">
            <Img src="/figma/logo-icon.svg" alt="" className="h-[26px] w-[27px]" />
            <Img src="/figma/logo-text.svg" alt="loadhunter" className="h-[15px] w-[94px]" />
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex size-12 items-center justify-center rounded-full"
          >
            {/* hamburger ⇄ cross, two bars */}
            <span
              className="absolute h-[2px] w-5 rounded-full bg-[#454545] transition-transform duration-300"
              style={{ transform: open ? "rotate(45deg)" : "translateY(-3.5px)" }}
            />
            <span
              className="absolute h-[2px] w-5 rounded-full bg-[#454545] transition-transform duration-300"
              style={{ transform: open ? "rotate(-45deg)" : "translateY(3.5px)" }}
            />
          </button>
        </div>
      </div>

      {/* full-screen menu */}
      <div
        className={`fixed inset-0 -z-10 flex flex-col bg-white transition-[opacity,visibility] duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{
          paddingTop: "calc(max(10px, env(safe-area-inset-top)) + 72px)",
          paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        }}
        aria-hidden={!open}
      >
        <nav className="mx-auto flex w-full max-w-[440px] flex-1 flex-col overflow-y-auto px-5">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => {
                // unlock scroll synchronously — the anchor smooth-scroll fires
                // in this same tick, before the effect cleanup would run
                document.body.style.overflow = ""
                setOpen(false)
              }}
              className="flex h-14 items-center border-b border-[#f0f0f0] text-[17px] font-medium tracking-[-0.02em] text-[#454545]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mx-auto flex w-full max-w-[440px] flex-col gap-3 px-5 pt-4">
          <PillButton href="#contact" variant="light">
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
