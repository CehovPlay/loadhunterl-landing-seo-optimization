import { Img } from "@/components/site/Img"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const LINKS = [
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
 * HD (1440) navigation bar — Figma 916:73863. Identical to the 1920 Navbar
 * except the default bar's side padding is px-32 (vs px-120) and the portalled
 * compact pill scales by clientWidth/1440 (vs /1920), uncapped within the hd
 * band (1024–1919) so it tracks the hd canvas as it scales to fill.
 */
export function HdNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 60
      setScrolled((prev) => (prev === s ? prev : s))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    // hd canvas fills 1024–1919 by scaling vw/1440 (uncapped) — the portalled
    // pill lives outside the scaled canvas and must reapply the same factor.
    const onResize = () =>
      setScale(document.documentElement.clientWidth / 1440)
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
        className="absolute inset-x-0 top-0 z-50 flex items-center px-[32px] py-[16px]"
        style={{
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? "translateY(-40px) scale(0.96)" : "translateY(0) scale(1)",
          pointerEvents: scrolled ? "none" : "auto",
          transition:
            "opacity 0.3s ease, transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="relative flex flex-1 items-center justify-between rounded-[2000px] py-[6px] pl-[6px] pr-[12px]">
          {/* pill backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[2000px] bg-[rgba(54,56,61,0.5)] backdrop-blur-[7px]"
          />

          {/* logo */}
          <div className="relative flex w-[212px] items-center">
            <a
              href="#"
              className="flex h-[34px] items-center gap-[8px] rounded-[99px] border border-white py-[4px] pl-[4px] pr-[8px] backdrop-blur-[10px]"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
                boxShadow: PILL_SHADOW,
              }}
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
          <nav
            className="relative flex items-center justify-center gap-[2px] rounded-[99px] backdrop-blur-[10px]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
              boxShadow: PILL_SHADOW,
            }}
          >
            {LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                className={
                  "flex h-[28px] items-center justify-center px-[20px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white" +
                  (i === 0 ? " rounded-l-[99px]" : "") +
                  (i === LINKS.length - 1 ? " rounded-r-[99px]" : "")
                }
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* inner shadow ring */}
          <div className="pointer-events-none absolute inset-0 rounded-[2000px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]" />
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
              isolation: "isolate",
              opacity: scrolled ? 1 : 0,
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
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[2000px] bg-[rgba(54,56,61,0.5)] backdrop-blur-[7px]"
            />
            {/* logo mark pill */}
            <a
              href="#"
              className="relative flex h-[34px] items-center rounded-[99px] border border-white px-[4px]"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
                boxShadow: PILL_SHADOW,
              }}
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
                className="flex h-[28px] items-center justify-center rounded-[99px] border border-white px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
                  boxShadow: PILL_SHADOW,
                }}
              >
                Get Demo
              </a>
              <a
                href="#start"
                data-magnetic="0.2"
                className="flex h-[28px] items-center justify-center rounded-[99px] border border-white bg-[#6f5197] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white"
                style={{ boxShadow: PILL_SHADOW }}
              >
                Add to Chrome
              </a>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-[2000px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]" />
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
