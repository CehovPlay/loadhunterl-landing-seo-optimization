"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { List, X } from "@phosphor-icons/react/dist/ssr"
import { CTA, DEMO_CTA } from "@/content/home"
import { DesktopMenu, MobileMenu } from "./nav/Menus"

/**
 * Global header, in the shape the extension landing already ships (Figma
 * "Navigation bar", 482:51856):
 *
 *  - at rest, a white pill that hugs its content and centres over the page
 *  - after 60px of scroll it swaps for the compact pill: logo mark, the sales
 *    path and the primary action
 *
 * The landing renders the compact pill through a portal with a manual scale,
 * because there it has to escape a transform-scaled 1920 canvas. This site is
 * a flow layout, so `fixed` behaves and neither the portal nor the scale
 * factor is needed.
 *
 * TZ §5.3 wants the header sticky only after a meaningful scroll and never
 * covering content, which is exactly what the swap does. §27.3 makes install
 * the homepage's primary action, and the compact pill keeps one sales path
 * beside it rather than a second label for the same intent.
 *
 * Seven top-level destinations stop fitting the pill below 1024px, so under lg
 * the bar collapses to a disclosure. Nothing is dropped silently: every entry
 * in §5.1 is a required top-level destination.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Threshold guard, not a per-frame comparison: state only changes when the
    // page crosses 60px. Lenis performs real window scrolling, so the native
    // passive listener is enough and no rAF loop has to stay alive.
    const onScroll = () => {
      const s = window.scrollY > 60
      setScrolled((prev) => (prev === s ? prev : s))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      {/* Full pill, page top. Absolute so it sits over the hero rather than
          reserving a band of its own. */}
      <header
        className="absolute inset-x-0 top-0 z-50 flex justify-center px-5 md:px-10"
        style={{
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? "translateY(-40px) scale(0.96)" : "translateY(0) scale(1)",
          pointerEvents: scrolled ? "none" : "auto",
          transition:
            "opacity 0.3s ease, transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div className="w-full p-3 md:p-4 lg:w-auto">
          {/* The landing sits this pill on a dark page, where plain white is enough
              separation. On paper it needs the hairline and the pill shadow to
              still read as a floating object rather than a lighter patch. */}
          <div className="relative flex items-center gap-4 rounded-full border border-rule bg-paper-2 p-[5px] shadow-[var(--shadow-pill)]">
            <Link
              href="/"
              aria-label="LoadHunter home"
              className="flex h-[34px] shrink-0 items-center gap-2 rounded-full border border-rule bg-paper-2 py-1 pr-2 pl-1 shadow-[var(--shadow-pill)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-icon.svg" alt="" width={28} height={26} className="h-[26px] w-[28px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-text.svg" alt="LoadHunter" width={97} height={16} className="h-4 w-[97px]" />
            </Link>

            <DesktopMenu />

            {/* §5.1 lists Log in as a top-level destination and §15.3 keeps it
                away from the marketing action, so it sits at the pill's end,
                quiet, rather than beside the install button. */}
            <Link
              href={CTA.login.href}
              className="hidden h-7 shrink-0 items-center justify-center rounded-full px-3 text-small leading-4 font-medium text-ink-3 transition-colors duration-150 hover:text-ink lg:flex"
            >
              {CTA.login.label}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="primary-menu"
              className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-paper-3 lg:hidden"
            >
              {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Compact pill. Fixed, frosted, isolated so the backdrop filter samples
          the strip behind the pill instead of the whole scrolling page. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-5 md:px-10">
        <div
          className="relative mt-4 flex max-w-full items-center gap-4 rounded-full py-1.5 pr-2.5 pl-1.5 lg:gap-[60px]"
          style={{
            isolation: "isolate",
            opacity: scrolled ? 1 : 0,
            // Hidden only AFTER the fade out, so the pill and its backdrop
            // filter are never composited while parked above the viewport.
            visibility: scrolled ? "visible" : "hidden",
            transform: scrolled ? "translateY(0) scale(1)" : "translateY(-48px) scale(0.9)",
            pointerEvents: scrolled ? "auto" : "none",
            transition:
              "opacity 0.3s ease, transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), visibility 0s linear " +
              (scrolled ? "0s" : "0.65s"),
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full border border-rule bg-paper-2/80 shadow-[var(--shadow-pill)] backdrop-blur-[10px]"
          />

          <Link
            href="/"
            aria-label="LoadHunter home"
            className="relative flex h-[34px] shrink-0 items-center rounded-full border border-rule bg-paper-2 px-1 shadow-[var(--shadow-pill)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-icon.svg" alt="" width={28} height={26} className="h-[26px] w-[28px]" />
          </Link>

          <div className="relative flex min-w-0 items-center gap-1.5">
            {/* Below lg the compact pill carries navigation, not the action:
                the mobile sticky bar owns the CTA from the first proof on, and
                two live conversion surfaces at once is the aggressive pattern
                the homepage spec rules out. */}
            <Link
              href={DEMO_CTA.href}
              className="hidden h-7 items-center justify-center rounded-full border border-rule bg-paper-2 px-3 text-small leading-4 font-medium whitespace-nowrap text-ink-2 shadow-[var(--shadow-pill)] transition-colors duration-150 hover:text-ink lg:flex"
            >
              {DEMO_CTA.label}
            </Link>
            <Link
              href={CTA.primary.href}
              className="hidden h-7 items-center justify-center rounded-full bg-violet px-3 text-small leading-4 font-medium whitespace-nowrap text-white shadow-[var(--shadow-pill)] transition-colors duration-150 hover:bg-violet-ink lg:flex"
            >
              {CTA.primary.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="primary-menu"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors duration-150 hover:bg-paper-3 lg:hidden"
            >
              {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          id="primary-menu"
          className="fixed inset-x-0 top-[70px] bottom-0 z-[90] overflow-y-auto border-t border-rule bg-paper px-5 py-8 md:px-10 lg:hidden"
        >
          <MobileMenu onNavigate={() => setOpen(false)} />
          <Link
            href={CTA.primary.href}
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-violet px-6 text-body font-medium text-white"
          >
            {CTA.primary.label}
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href={DEMO_CTA.href}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center text-body text-ink-2"
            >
              {DEMO_CTA.label}
            </Link>
            <Link
              href={CTA.login.href}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center text-body text-ink-3"
            >
              {CTA.login.label}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  )
}
