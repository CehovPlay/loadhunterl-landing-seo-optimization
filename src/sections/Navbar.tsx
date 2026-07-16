import { Img } from "@/components/site/Img"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

export const LINKS = [
  { label: "Why us", href: "#why" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
  { label: "Our offers", href: "#offers" },
  { label: "$LHUNT", href: "#token" },
]

const PILL_SHADOW =
  "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)"

/**
 * Figma component 482:51856 "Navigation bar":
 *  - Default: full-width pill with logo + section links (top of page)
 *  - Variant2: compact centred pill (logo mark + Get Demo + Add to Chrome),
 *    shown after scrolling. Rendered through a portal because `fixed`
 *    doesn't escape the scaled DesignFrame canvas; the portal applies the
 *    same canvas scale so it stays visually consistent.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // passive scroll listener with a threshold guard — dispatches state only
    // when crossing 60px, instead of the old self-perpetuating rAF that ran a
    // comparison + setState every single frame for the life of the page.
    // (Lenis performs real window scrolling, so native scroll events fire.)
    const onScroll = () => {
      const s = window.scrollY > 60
      setScrolled((prev) => (prev === s ? prev : s))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    // Cap at 1× to match DesignFrame: above the 1920 artboard the canvas stops
    // scaling up and centers, so this portalled pill must too (transformOrigin
    // top-center keeps it centered), otherwise it balloons on 2K/4K screens.
    const onResize = () =>
      setScale(Math.min(document.documentElement.clientWidth / 1920, 1))
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <>
      {/* Default full-width bar (page top) */}
      <header
        className="absolute inset-x-0 top-0 z-50 flex justify-center"
        style={{
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? "translateY(-40px) scale(0.96)" : "translateY(0) scale(1)",
          pointerEvents: scrolled ? "none" : "auto",
          transition:
            "opacity 0.3s ease, transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* experiment: compact white pill navbar, hugs its content and centers */}
        <div className="p-[12px]">
        <div className="relative flex items-center gap-[16px] rounded-full bg-white p-[5px]">

          {/* logo */}
          <div className="relative flex items-center">
            <a
              href="#"
              className="flex h-[34px] items-center gap-[8px] rounded-[99px] border border-[#ececec] bg-white py-[4px] pl-[4px] pr-[8px]"
              style={{ boxShadow: PILL_SHADOW }}
            >
              <Img
                src="/figma/logo-icon.svg"
                alt=""
                className="h-[26.173px] w-[27.679px]"
              />
              <Img
                src="/figma/logo-text.svg"
                alt="loadhunter"
                className="h-[15.736px] w-[97.034px]"
              />
            </a>
          </div>

          {/* nav links */}
          <nav className="relative flex items-center justify-center gap-[2px] rounded-[99px]">
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                className={
                  "flex h-[28px] items-center justify-center px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#454545] transition-colors hover:text-black" +
                  (i === 0 ? " rounded-l-[99px]" : "") +
                  (i === LINKS.length - 1 ? " rounded-r-[99px]" : "")
                }
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        </div>
      </header>

      {/* Compact pill (Variant2) — portal above the scaled canvas */}
      {createPortal(
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center"
          style={{ transformOrigin: "top center", transform: `scale(${scale})` }}
        >
          <div
            className="relative mt-[16px] flex items-center gap-[60px] rounded-[2000px] py-[6px] pl-[6px] pr-[10px]"
            style={{
              // isolate so the surviving backdrop-filter samples a small region,
              // not the whole scrolling page behind the fixed pill
              isolation: "isolate",
              opacity: scrolled ? 1 : 0,
              // visibility flips to hidden AFTER the fade-out so the pill (and
              // its backdrop-filter) isn't painted/composited while parked at the
              // top of the page; flips to visible instantly on the way in
              visibility: scrolled ? "visible" : "hidden",
              transform: scrolled
                ? "translateY(0) scale(1)"
                : "translateY(-48px) scale(0.9)",
              pointerEvents: scrolled ? "auto" : "none",
              transition:
                "opacity 0.3s ease, transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), visibility 0s linear " +
                (scrolled ? "0s" : "0.65s"),
            }}
          >
            {/* frosted white pill — same style family as the top navbar */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2000px] bg-white/70 backdrop-blur-[10px]"
            />
            {/* logo mark pill */}
            <a
              href="#"
              className="relative flex h-[34px] items-center rounded-[99px] border border-[#ececec] bg-white px-[4px]"
              style={{ boxShadow: PILL_SHADOW }}
            >
              <Img
                src="/figma/logo-icon.svg"
                alt="loadhunter"
                className="h-[26.173px] w-[27.679px]"
              />
            </a>
            {/* actions */}
            <div className="relative flex h-[28px] items-center gap-[6px]">
              <a
                href="#contact"
                data-magnetic="0.2"
                className="flex h-[28px] items-center justify-center rounded-[99px] border border-[#ececec] bg-white px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#454545] transition-colors hover:text-black"
                style={{ boxShadow: PILL_SHADOW }}
              >
                Get Demo
              </a>
              <a
                href="#start"
                data-magnetic="0.2"
                className="flex h-[28px] items-center justify-center rounded-[99px] bg-[#6f5197] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white"
                style={{ boxShadow: PILL_SHADOW }}
              >
                Add to Chrome
              </a>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
