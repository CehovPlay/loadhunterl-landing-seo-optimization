import diagram from "/figma/misc/chaos-diagram.png"

export function ChaosDiagram() {
  return (
    <section className="relative flex flex-col items-center overflow-hidden bg-[#18191f] pb-[180px] pt-[80px]">
      <h2 className="text-[48px] font-medium leading-[58px] tracking-[-1.92px] text-[#e8e8e8]">
        From chaos to AI-Powered dispatch
      </h2>
      <p className="mt-4 max-w-[640px] text-center text-[14px] font-medium leading-[20px] tracking-[-0.56px] text-[#8c8d8f]">
        Stop refreshing load boards, rewriting emails, and calculating profits by
        hand. LoadHunter automates the busywork so your team can find better
        loads, respond faster, and book with confidence.
      </p>

      <div className="relative mt-[80px] w-full max-w-[1400px]">
        <img src={diagram} alt="" className="w-full" />
        <div className="-mt-6 flex justify-center">
          <span className="rounded-[12px] border border-[#ffffff1f] bg-[#1d1f24] px-6 py-3.5 text-[16px] font-medium tracking-[-0.64px] text-[#e8e8e8] shadow-lg shadow-black/40">
            Logistics is moving to AI. Don't get left behind.
          </span>
        </div>
      </div>
    </section>
  )
}
