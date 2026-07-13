import { Img } from "@/components/site/Img"
/**
 * Figma: Group 2085665214 (924:101381) — 390x4030 @ phone-frame y=11567.
 * Stacked: testimonials (Frame 2147238672 @ y0), FAQ (Frame 2147238594 @
 * y926), CTA (Group 2085665213 @ y2482, automation panel baked @ y2438),
 * footer (Frame 2147238693 @ y3218, orbit graphic baked @ y3442).
 * The testimonial collage (cards at x −464..856, 30px gaps) marquees leftward
 * with period 1350 (collage width + gap), like the desktop strip; the initial
 * frame matches the design (violet "AJ Cargo" card centered).
 */
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { gateLoops, prefersReducedMotion, willChangeInView } from "@/lib/inview"

const CARD_SHADOW_INSET = "inset 0px -1px 1px 0px rgba(0,0,0,0.25)"
const PILL_SHADOW =
  "0px 1px 0px rgba(0,0,0,0.05), 0px 4px 4px rgba(0,0,0,0.05), 0px 10px 10px rgba(0,0,0,0.1)"

/** radial-tint card background exactly as in Figma (gradientTransform kept) */
function radialBg(w: number, h: number, matrix: string, color: string): string {
  return `url("data:image/svg+xml;utf8,<svg viewBox='0 0 ${w} ${h}' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23g)'/><defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(${matrix})'><stop stop-color='${color}' offset='0'/><stop stop-color='${color.replace("1)", "0)")}' offset='1'/></radialGradient></defs></svg>")`
}

type Review = {
  quote: string
  initials: string
  name: string
  left: number
  top: number
  h: number
  matrix: string
  violet?: boolean
  blur?: number
}

const REVIEWS: Review[] = [
  {
    quote:
      "This tool is saving so much time and makes everything so much more comfortable in daily dispatching routing.",
    initials: "FH",
    name: "Filip Hristovschi",
    left: -464,
    top: 0,
    h: 158,
    matrix: "-10.386 -14.876 10.386 -14.876 120.29 171.87",
    blur: 17,
  },
  {
    quote:
      "Ugh, It Seems To Be A Powerful and helpful Tool for booking loads ,makes everything so easier. Recommend To Taste It, And keep quality of the loads as high is possible with this tool",
    initials: "NC",
    name: "Nicolae Cojocari",
    left: -194,
    top: 202,
    h: 218,
    matrix: "24 21.599 -5.7569 37.203 0.31998 0",
    blur: 17,
  },
  {
    quote:
      "Top-notch platform for managing logistics. It's user-friendly and simplifies the process of finding and handling loads. Highly recommend for anyone in transportation!",
    initials: "AC",
    name: "AJ Cargo",
    left: 76,
    top: 0,
    h: 218,
    matrix: "-10.386 -20.524 10.386 -20.524 120.29 237.13",
    violet: true,
  },
  {
    quote:
      "Huge time saver and makes finding loads a lot easier! Also super attentive developer team that can add features on request.",
    initials: "FL",
    name: "FleetMax LLC",
    left: 346,
    top: 282,
    h: 178,
    matrix: "-24.768 17.359 -22.37 -21.228 240.32 4.4786",
    blur: 100,
  },
  {
    quote:
      "Great tool for dispatchers who are looking to save their time and book better loads. 1 click to email broker, 1 email to call, open maps with truck location load origin and destination, really useful!",
    initials: "MA",
    name: "Mason Aleksic",
    left: 616,
    top: 120,
    h: 218,
    matrix: "-24 21.8 -24.898 -20.025 240.32 0",
    blur: 17,
  },
]

function ReviewCard({ r }: { r: Review }) {
  const color = r.violet ? "rgba(111,81,151,1)" : "rgba(53,50,70,1)"
  return (
    <div
      data-card
      className={
        "absolute flex w-[240px] flex-col gap-[12px] rounded-[12px] p-[12px] " +
        (r.violet
          ? "overflow-hidden shadow-[0px_34px_74px_-20px_rgba(111,81,151,0.5)]"
          : "")
      }
      style={{ left: r.left, top: r.top }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px]"
        style={{
          backgroundImage: radialBg(240, r.h, r.matrix, color),
        }}
      />
      <span
        aria-hidden
        className={
          "pointer-events-none absolute inset-0 rounded-[12px] border " +
          (r.violet ? "border-[rgba(111,81,151,0.8)]" : "border-[rgba(229,229,229,0.1)]")
        }
      />
      <p className="relative w-full text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#e8e8e8]">
        {r.quote}
      </p>
      <div className="relative flex w-full items-center gap-[12px]">
        <div
          className="flex size-[42px] items-center justify-center rounded-[12px] border border-white bg-gradient-to-b from-[rgba(255,255,255,0.6)] to-[rgba(255,255,255,0.5)]"
          style={{ boxShadow: PILL_SHADOW }}
        >
          <span className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
            {r.initials}
          </span>
        </div>
        <span className="text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-white">
          {r.name}
        </span>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px]"
        style={{ boxShadow: CARD_SHADOW_INSET }}
      />
    </div>
  )
}

/* ---------------------------------------------------------------- FAQ --- */

type FaqRow = {
  top: number
  q: React.ReactNode
  aTop: number
  a: React.ReactNode
  dTop: number
  d: React.ReactNode
}

/* line breaks match the Figma render exactly */
const FAQ_ROWS: FaqRow[] = [
  {
    top: 0,
    q: "How do I install and set up LoadHunter?",
    aTop: 56,
    a: (
      <>
        The installation process is simple! Just go to the
        <br />
        Chrome Web Store, find &quot;LoadHunter&quot; and
        <br />
        click &quot;Add to Chrome&quot;.
      </>
    ),
    dTop: 128,
    d: (
      <>
        Once installed, click on the puzzle icon in the top-right
        <br />
        corner and pin LoadHunter. Log in with your email, visit
        <br />
        your Load Board, and you&rsquo;ll immediately see all the
        <br />
        LoadHunter features!
      </>
    ),
  },
  {
    top: 272,
    q: "Do you offer a free trial?",
    aTop: 56,
    a: (
      <>
        Yes! Try an unlimited version of LoadHunter with
        <br />a 14-day free trial.
      </>
    ),
    dTop: 108,
    d: (
      <>
        You can explore all the features and see how it can
        <br />
        optimize your dispatching work — no credit card
        <br />
        required. Enjoy full access without any obligations!
      </>
    ),
  },
  {
    top: 508,
    q: (
      <>
        Can I connect my factoring company
        <br />
        account to LoadHunter?
      </>
    ),
    aTop: 80,
    a: (
      <>
        Yes! With LoadHunter, you can integrate your
        <br />
        Factoring Company account directly into the
        <br />
        dashboard.
      </>
    ),
    dTop: 152,
    d: (
      <>
        This allows you to see factoring ratings right on your
        <br />
        LoadBoard, making it easier to evaluate brokers and
        <br />
        streamline decision-making.
      </>
    ),
  },
  {
    top: 788,
    q: (
      <>
        Does LoadHunter work with
        <br />
        VOIP for SMS and calls?
      </>
    ),
    aTop: 80,
    a: "Absolutely!",
    dTop: 112,
    d: (
      <>
        You can connect your VOIP service and use LoadHunter to
        <br />
        send pre-built SMS templates and make calls directly from
        <br />
        the extension.
      </>
    ),
  },
  {
    top: 1028,
    q: (
      <>
        Can I cancel my LoadHunter
        <br />
        subscription anytime?
      </>
    ),
    aTop: 80,
    a: (
      <>
        Yes, you can cancel your LoadHunter subscription
        <br />
        at any time.
      </>
    ),
    dTop: 132,
    d: (
      <>
        Even after cancellation, the extension will continue to work
        <br />
        until the end of your current subscription period.
      </>
    ),
  },
]

const FAQ_LINES = [232, 468, 748, 988]

/* --------------------------------------------------------------- shell --- */

function SectionIcon({ top }: { top: number }) {
  return (
    <div data-float className="absolute left-[163px] size-[64px]" style={{ top }}>
      <Img
        src="/figma/phone/icon-figma.png"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute left-[-10px] top-[-4px] w-[84px] max-w-none"
      />
    </div>
  )
}

const REVIEW_PERIOD = 1350 // collage width 1320 + 30 gap

export function PhoneTail() {
  const sectionRef = useRef<HTMLElement>(null)
  const reviewsTrack = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const track = reviewsTrack.current
    if (!track) return
    if (prefersReducedMotion()) return
    const tween = gsap.to(track, {
      x: -REVIEW_PERIOD, // one collage period → seamless wrap
      duration: 39, // ≈ desktop testimonials speed (34.6 px/s)
      ease: "none",
      repeat: -1,
    })
    const stopGate = gateLoops(sectionRef.current, tween)
    const stopWC = willChangeInView(track, sectionRef.current)
    return () => {
      stopWC()
      stopGate()
      tween.kill()
    }
  }, [])

  return (
    <footer ref={sectionRef} className="relative overflow-hidden bg-gray-800" style={{ height: 4030 }}>
      {/* ================= Testimonials (y 0..806) ================= */}
      <div id="contact" className="absolute left-0 top-0 h-[806px] w-full">
        <SectionIcon top={0} />
        <h2 className="absolute left-[14px] top-[104px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-white">
          What client says
        </h2>
        <p className="absolute left-[14px] top-[152px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
          Our clients appreciate our attention to their needs and
          <br />
          professionalism. Here are some of their testimonials
        </p>

        {/* trust strip */}
        <div className="absolute left-[63px] top-[224px] h-[42px] w-[264px]">
          <div className="absolute left-0 top-0 flex h-[42px] w-[90px] flex-col items-center justify-between">
            <p data-countup className="whitespace-nowrap text-center text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#e8e8e8]">
              5,000 +
            </p>
            <p className="whitespace-nowrap text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#e8e8e8]">
              Trusted by users
            </p>
          </div>
          <div className="absolute left-[114px] top-[8.5px] h-[25px] w-px bg-[#e8e8e9] opacity-50" />
          <div className="absolute left-[138px] top-0 flex h-[42px] w-[126px] flex-col items-center justify-between">
            <div className="flex w-full items-center justify-between">
              <Img
                src="/figma/phone/stars.svg"
                alt="4.7 star rating"
                loading="lazy"
                decoding="async"
                className="h-[16px] w-[100px] max-w-none"
              />
              <span data-countup className="text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-[#e8e8e8]">
                4.7
              </span>
            </div>
            <p className="whitespace-nowrap text-center text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-[#e8e8e8]">
              from 100 + reviews
            </p>
          </div>
        </div>

        {/* card marquee (initial frame shows the violet card centered) */}
        <div className="absolute left-0 top-[346px] h-[460px] w-full overflow-hidden">
          <div
            ref={reviewsTrack}
            data-marquee-track
            className="absolute inset-0"
          >
            {[0, 1, 2].map((copy) =>
              REVIEWS.map((r) => (
                <div
                  key={`${copy}-${r.name}`}
                  className="absolute top-0 h-full"
                  style={{ left: (copy - 1) * REVIEW_PERIOD }}
                >
                  <ReviewCard r={r} />
                </div>
              )),
            )}
          </div>
        </div>
      </div>

      {/* ================= FAQ (y 926..2406) ================= */}
      <div id="faq" className="absolute left-0 top-[926px] h-[1480px] w-full">
        <SectionIcon top={0} />
        <h2 className="absolute left-[14px] top-[124px] w-[362px] text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-[#e8e8e8]">
          Frequently Asked Questions
        </h2>
        <p className="absolute left-[14px] top-[160px] w-[362px] text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2">
          Access a wealth of information and resources to ensure
          <br />
          you find the solutions you need quickly and effectively,
          <br />
          empowering you to make informed decisions Contact us.
        </p>

        <div className="absolute left-[14px] top-[288px] h-[1192px] w-[362px]">
          {FAQ_ROWS.map((r, i) => (
            <div key={i} className="absolute left-0 w-full" style={{ top: r.top }}>
              {/* row 1's question box is 350 wide, left-aligned in the design */}
              <h3
                className="absolute top-0 text-center text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-[#e8e8e8]"
                style={i === 0 ? { left: 0, width: 350 } : { left: 0, width: "100%" }}
              >
                {r.q}
              </h3>
              <p
                className="absolute left-0 w-full text-center text-[16px] font-medium leading-[20px] tracking-[-0.64px] text-[#e8e8e8]"
                style={{ top: r.aTop }}
              >
                {r.a}
              </p>
              <p
                className="absolute left-0 w-full text-center text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-ink-2"
                style={{ top: r.dTop }}
              >
                {r.d}
              </p>
            </div>
          ))}
          {FAQ_LINES.map((y) => (
            <Img
              key={y}
              src="/figma/phone/faq-line.svg"
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute left-0 h-px w-full max-w-none"
              style={{ top: y - 0.5 }}
            />
          ))}
        </div>
      </div>

      {/* ================= CTA (y 2438..3142) ================= */}
      <div id="start" className="absolute left-0 top-[2438px] h-[704px] w-full">
        {/* automation panel + rings + glow — 2x export (card region re-drawn live on top) */}
        <Img
          src="/figma/phone/cta.png"
          alt="One click automation — book faster, miss less, earn more"
          loading="lazy"
          decoding="async"
          className="absolute left-0 top-0 w-[390px] max-w-none"
        />

        {/* violet gradient card */}
        <div
          className="absolute left-[14px] top-[44px] h-[302px] w-[362px] overflow-hidden rounded-[12px]"
          style={{
            backgroundImage: "linear-gradient(108.99deg, #6f5197 0%, #9779bf 100%)",
          }}
        >
          <div className="absolute left-[12px] top-[20px] h-[16px] w-[101px]">
            <Img
              src="/figma/tail/logo-icon-white.svg"
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute left-0 top-0 size-[16px] max-w-none"
            />
            <Img
              src="/figma/tail/logo-text-white.svg"
              alt="loadhunter"
              loading="lazy"
              decoding="async"
              className="absolute left-[22.67px] top-[1.7px] h-[12.59px] w-[77.62px] max-w-none"
            />
          </div>

          <h2 className="absolute left-[12px] top-[116px] w-[338px] text-[20px] font-medium leading-[24px] tracking-[-0.8px] text-white">
            Start your experience with LoadHunter
          </h2>
          <p className="absolute left-[12px] top-[176px] w-[338px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white">
            Search loads with efficiency and speed you never
            <br />
            had before. LoadHunter: Ai-powered tool.
          </p>

          <button
            type="button"
            className="absolute left-[12px] top-[248px] flex h-[42px] items-center gap-[8px] rounded-[99px] border border-white bg-white px-[24px] backdrop-blur-[10px]"
            style={{ boxShadow: PILL_SHADOW }}
          >
            <Img src="/figma/tail/cta-chrome.svg" alt="" loading="lazy" decoding="async" className="size-[16px] max-w-none" />
            <span
              className="bg-clip-text text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-transparent"
              style={{
                backgroundImage: "linear-gradient(149.61deg, #6f5197 0%, #9779bf 100%)",
              }}
            >
              Add to Chrome
            </span>
          </button>
        </div>
      </div>

      {/* ================= Footer (y 3218..4030) ================= */}
      <div id="token" className="absolute left-0 top-[3218px] h-[812px] w-full">
        {/* logo */}
        <div className="absolute left-[119.78px] top-0 h-[24px] w-[150.44px]">
          <Img
            src="/figma/tail/logo-icon-white.svg"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-0 size-[24px] max-w-none"
          />
          <Img
            src="/figma/tail/logo-text-white.svg"
            alt="loadhunter"
            loading="lazy"
            decoding="async"
            className="absolute left-[34px] top-[2.56px] h-[18.88px] w-[116.44px] max-w-none"
          />
        </div>

        {/* subscribe row */}
        <form
          className="absolute left-[14px] top-[84px] flex h-[52px] w-[362px] items-center gap-[6px] rounded-full py-[6px] pl-[8px] pr-[6px]"
          onSubmit={(e) => e.preventDefault()}
        >
          <span className="pointer-events-none absolute inset-0 rounded-full bg-[rgba(54,56,61,0.5)] shadow-[inset_0px_0px_4px_0px_rgba(0,0,0,0.1)] backdrop-blur-[7px]" />
          <input
            type="email"
            placeholder="Enter your e-mail address"
            className="relative h-[40px] min-w-px flex-1 rounded-[99px] bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.05)] px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white placeholder:text-ink-2 focus:outline-none"
            style={{ boxShadow: PILL_SHADOW }}
          />
          <button
            type="submit"
            className="relative flex h-[40px] items-center justify-center rounded-[99px] border border-white bg-violet px-[12px] text-[14px] font-medium leading-[16px] tracking-[-0.56px] text-white backdrop-blur-[10px] transition-opacity hover:opacity-90"
            style={{ boxShadow: PILL_SHADOW }}
          >
            Subscribe
          </button>
        </form>

        {/* separator */}
        <div className="absolute left-0 top-[168px] h-px w-full bg-[#33353a]" />

        {/* links + socials */}
        <div className="absolute left-0 top-[200px] flex h-[24px] w-full items-center justify-between px-[14px]">
          <div className="flex items-center gap-[32px] text-[12px] font-medium leading-[14px] tracking-[-0.48px] text-ink-2">
            <a href="#" className="hover:text-gray-100">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-100">
              Terms of Service
            </a>
          </div>
          <div className="flex items-center gap-[4px]">
            {["/figma/tail/social-1.png", "/figma/tail/social-2.png", "/figma/tail/social-3.png"].map(
              (src) => (
                <a key={src} href="#" className="block size-[18px]">
                  <Img src={src} alt="" loading="lazy" decoding="async" className="size-[18px] max-w-none" />
                </a>
              ),
            )}
          </div>
        </div>

        {/* orbit rings graphic (decorative, © caption baked in) */}
        <Img
          src="/figma/phone/footer-orbit.png"
          alt="© 2026 loadhunt Corp. All rights reserved."
          loading="lazy"
          decoding="async"
          className="absolute left-0 top-[224px] h-[588px] w-[390px] max-w-none"
        />
      </div>
    </footer>
  )
}
