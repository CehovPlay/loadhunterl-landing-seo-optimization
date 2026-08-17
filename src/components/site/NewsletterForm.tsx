import { useId, useState } from "react"
import { NEWSLETTER } from "@/content/copy"
import { track } from "@/lib/analytics"

type State = "idle" | "sending" | "success" | "error"

/**
 * LH-051 + LH-069 — newsletter block with value copy, all three form states,
 * inline validation, consent note and a keyboard-submittable form.
 *
 * BACKEND: the subscribe endpoint is still owned by backend. Set
 * `VITE_NEWSLETTER_ENDPOINT` to a URL that accepts `{ email }` as JSON and the
 * form posts to it for real (double opt-in must be enforced server side, per
 * the brief). WITHOUT that env var the form keeps the repo's existing stub
 * behaviour and shows the success state without sending anything — do not ship
 * to production in that mode.
 */
export function NewsletterForm({
  className = "",
  dark = true,
}: {
  className?: string
  dark?: boolean
}) {
  const id = useId()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<State>("idle")

  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined
  const invalid = state === "error"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === "sending") return // no duplicate submit
    const value = email.trim()
    // deliberately permissive: the server is the authority on deliverability
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setState("error")
      return
    }
    track("newsletter_submit")
    if (!endpoint) {
      setState("success")
      return
    }
    setState("sending")
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      })
      setState(res.ok ? "success" : "error")
    } catch {
      setState("error")
    }
  }

  const label = dark ? "text-white" : "text-ink"
  const body = dark ? "text-[rgba(255,255,255,0.55)]" : "text-ink/70"
  const fieldSkin = dark
    ? "bg-[rgba(255,255,255,0.06)] text-white placeholder:text-[rgba(255,255,255,0.4)]"
    : "bg-white text-ink placeholder:text-ink/40"

  return (
    <section className={className} aria-labelledby={`${id}-title`}>
      <h2
        id={`${id}-title`}
        className={`text-[16px] font-medium leading-[24px] tracking-[-0.02em] ${label}`}
      >
        {NEWSLETTER.h3}
      </h2>
      <p className={`mt-[6px] text-[14px] font-medium leading-[20px] tracking-[-0.02em] ${body}`}>
        {NEWSLETTER.body}
      </p>

      {state === "success" ? (
        <p
          role="status"
          className="mt-[16px] flex items-center gap-[8px] text-[14px] font-medium leading-[20px] text-violet-300"
        >
          <svg viewBox="0 0 24 24" aria-hidden className="size-[16px]" fill="currentColor">
            <path d="M9.6 16.2 5.4 12l1.4-1.4 2.8 2.8 7.6-7.6L18.6 7 9.6 16.2z" />
          </svg>
          {NEWSLETTER.success}
        </p>
      ) : (
        <form className="mt-[16px]" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-[10px] sm:flex-row">
            <label htmlFor={`${id}-email`} className="sr-only">
              {NEWSLETTER.placeholder}
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (state === "error") setState("idle")
              }}
              aria-invalid={invalid}
              aria-describedby={invalid ? `${id}-error` : `${id}-consent`}
              placeholder={NEWSLETTER.placeholder}
              className={
                `h-[44px] min-w-0 flex-1 rounded-full border px-[16px] text-[14px] font-medium leading-[20px] tracking-[-0.02em] outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${fieldSkin} ` +
                (invalid ? "border-rose-400" : "border-[rgba(255,255,255,0.14)]")
              }
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="h-[44px] shrink-0 rounded-full bg-violet px-[22px] text-[14px] font-medium leading-[20px] tracking-[-0.02em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {state === "sending" ? "Sending..." : NEWSLETTER.cta}
            </button>
          </div>

          {invalid && (
            <p
              id={`${id}-error`}
              role="alert"
              className="mt-[8px] flex items-center gap-[6px] text-[13px] font-medium leading-[18px] text-rose-400"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="size-[14px]" fill="currentColor">
                <path d="M12 2 1 21h22L12 2zm1 14h-2v2h2v-2zm0-8h-2v6h2V8z" />
              </svg>
              {NEWSLETTER.error}
            </p>
          )}

          <p
            id={`${id}-consent`}
            className={`mt-[10px] text-[12px] font-medium leading-[17px] ${body}`}
          >
            {NEWSLETTER.consent.replace(" See our Privacy Policy.", " ")}
            <a href="/privacy.html" className="underline underline-offset-2 hover:text-white">
              See our Privacy Policy.
            </a>
          </p>
        </form>
      )}
    </section>
  )
}
