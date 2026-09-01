"use client"

import { useId, useState } from "react"
import { Check, Warning } from "@phosphor-icons/react/dist/ssr"
import { NEWSLETTER } from "@/content/home"

type State = "idle" | "sending" | "success" | "error" | "offline"

/**
 * Footer newsletter block, same three-state form the extension landing ships.
 *
 * BACKEND: set `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` to a URL that accepts
 * `{ email }` as JSON and this posts to it for real; double opt-in has to be
 * enforced server side.
 *
 * One deliberate difference from the landing: without that variable this form
 * says it is not connected instead of showing the success state. Telling a
 * visitor they are subscribed when nothing was sent is a claim the page cannot
 * back, and TZ §42.1 does not allow unverifiable claims on this site.
 */
export function NewsletterForm({ className = "" }: { className?: string }) {
  const id = useId()
  const [email, setEmail] = useState("")
  const [state, setState] = useState<State>("idle")

  const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT
  const invalid = state === "error"

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (state === "sending") return
    const value = email.trim()
    // Deliberately permissive: the server is the authority on deliverability.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setState("error")
      return
    }
    if (!endpoint) {
      setState("offline")
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

  return (
    <section className={className} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-body font-medium text-night-ink">
        {NEWSLETTER.title}
      </h2>
      <p className="mt-1.5 max-w-[42ch] text-small text-night-ink-2">{NEWSLETTER.body}</p>

      {state === "success" ? (
        <p role="status" className="mt-4 flex items-center gap-2 text-small text-preview-night">
          <Check size={16} weight="bold" />
          {NEWSLETTER.success}
        </p>
      ) : (
        <form className="mt-4" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-2.5 sm:flex-row">
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
              onChange={(event) => {
                setEmail(event.target.value)
                if (state === "error" || state === "offline") setState("idle")
              }}
              aria-invalid={invalid}
              aria-describedby={invalid ? `${id}-error` : `${id}-consent`}
              placeholder={NEWSLETTER.placeholder}
              className={
                "h-11 min-w-0 flex-1 rounded-full border bg-night-field px-4 text-small text-night-ink outline-none placeholder:text-night-ink-3 " +
                (invalid ? "border-progress-night" : "border-night-edge")
              }
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="h-11 shrink-0 rounded-full bg-violet px-6 text-small font-medium whitespace-nowrap text-white transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
            >
              {state === "sending" ? "Sending" : NEWSLETTER.cta}
            </button>
          </div>

          {(invalid || state === "offline") && (
            <p
              id={`${id}-error`}
              role="alert"
              className="mt-2 flex items-start gap-1.5 text-meta text-progress-night"
            >
              <Warning size={14} weight="bold" className="mt-0.5 shrink-0" />
              {invalid ? NEWSLETTER.error : NEWSLETTER.offline}
            </p>
          )}

          <p id={`${id}-consent`} className="mt-2.5 max-w-[46ch] text-meta text-night-ink-3">
            {NEWSLETTER.consent}
            <a href="/privacy" className="underline underline-offset-2 hover:text-night-ink">
              See our privacy policy.
            </a>
          </p>
        </form>
      )}
    </section>
  )
}
