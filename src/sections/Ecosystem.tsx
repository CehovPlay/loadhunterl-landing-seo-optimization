import { LogoMark } from "@/components/site/Logo"
import shotLoadhunter from "/figma/eco/loadhunter.png"
import shotTms from "/figma/eco/hunttms.png"
import shotPay from "/figma/eco/huntpay.png"

const PRODUCTS = [
  {
    suffix: "hunter",
    body: "LoadHunter Extension is an AI browser tool that enhances the load booking process on major LoadBoards (DAT, Truckstop, etc.).",
    shot: shotLoadhunter,
  },
  {
    suffix: "TMS",
    body: "Comprehensive transport management system providing a single platform to manage all aspects.",
    shot: shotTms,
  },
  {
    suffix: "PAY",
    body: "Comprehensive transport management system providing a single platform to manage all aspects.",
    shot: shotPay,
  },
]

export function Ecosystem() {
  return (
    <section id="offers" className="bg-[#fafafa] px-[120px] py-[60px]">
      <div className="mx-auto grid max-w-[1680px] grid-cols-[560px_1fr] gap-10 rounded-[24px] border border-[#e8e8e8] bg-white p-10">
        {/* heading */}
        <div>
          <span
            className="flex size-12 items-center justify-center rounded-[14px] bg-[#f3f0fb] text-violet-600"
            style={{ boxShadow: "inset 0px 0px 1px 0px #6f5197, inset 0px 0px 12px 0px rgba(111,81,151,0.12)" }}
          >
            <LogoMark className="size-5" />
          </span>
          <h2 className="mt-6 text-[30px] font-medium leading-[40px] tracking-[-1.2px] text-[#454545]">
            Our ecosystem products
          </h2>
          <p className="mt-3 max-w-[300px] text-[14px] leading-[20px] tracking-[-0.56px] text-[#686b6f]">
            Everything you need to find, evaluate, and book loads — faster,
            smarter, and in one place.
          </p>
        </div>

        {/* products */}
        <div className="divide-y divide-[#e8e8e8]">
          {PRODUCTS.map((p) => (
            <div
              key={p.suffix}
              className="grid grid-cols-[300px_1fr] items-center gap-8 py-6 first:pt-0 last:pb-0"
            >
              <div>
                <div className="flex items-center gap-2 text-[16px] font-medium tracking-[-0.64px] text-[#454545]">
                  <LogoMark className="size-4 text-[#454545]" />
                  <span>
                    <span className="text-[#9a9a9a]">{p.suffix === "hunter" ? "load" : "hunt"}</span>
                    <span>{p.suffix}</span>
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-[18px] tracking-[-0.48px] text-[#686b6f]">
                  {p.body}
                </p>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[#e8e8e8]">
                <img src={p.shot} alt="" className="w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
