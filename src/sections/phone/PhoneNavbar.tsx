import { Img } from "@/components/site/Img"
/**
 * Figma: Navigation bar 916:71553 — 390x74 absolute overlay.
 * Outer padding 14, pill 362x46 (py-6 pl-6 pr-10), logo pill 34px, Menu 76x28.
 */
export function PhoneNavbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center p-[14px]">
      <div className="relative flex flex-1 items-center justify-between rounded-[2000px] py-[6px] pl-[6px] pr-[10px]">
        {/* pill backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2000px] bg-[rgba(54,56,61,0.5)] backdrop-blur-[7px]"
        />

        {/* logo */}
        <div className="relative flex w-[212px] items-center">
          <a
            href="#"
            className="relative flex h-[34px] items-center gap-[8px] rounded-[99px] border border-transparent py-[4px] pl-[4px] pr-[8px] backdrop-blur-[10px]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.5))",
              backgroundOrigin: "border-box",
              backgroundClip: "border-box",
              boxShadow:
                "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
            }}
          >
            {/* 1px border ring fading downward (Figma renders the white
                stroke strongest at the top edge) */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[-1px] rounded-[99px] p-px"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(255,255,255,0.85), rgba(255,255,255,0.05))",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
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

        {/* menu button */}
        <button
          className="relative flex h-[28px] w-[76px] items-center justify-center rounded-[99px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white backdrop-blur-[10px]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(255,255,255,0.05))",
            boxShadow:
              "0px 1px 0px 0px rgba(0,0,0,0.05), 0px 4px 4px 0px rgba(0,0,0,0.05), 0px 10px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          Menu
        </button>

        {/* inner shadow ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[2000px] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)]" />
      </div>
    </header>
  )
}
