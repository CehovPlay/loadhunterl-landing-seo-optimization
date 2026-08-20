"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { SELECTOR } from "@/content/home"
import { PRODUCTS_WITH_STATUS, type ProductKey, type ProductWithStatus } from "@/content/registry"

/**
 * The route selector's answers, shared between block 6 and block 8.
 *
 * Block 6 asks the three questions; block 8 has to end on a CTA that reflects
 * the role the visitor gave, so the answers cannot live inside block 6. They
 * stay in memory only: TZ's analytics rule for this page sends the chosen
 * scenario, never the person, and nothing here is written to storage or to a
 * cookie, which keeps the selector outside the consent gate entirely.
 */
type Answers = { role?: string; job?: string; size?: string }

type StackValue = {
  answers: Answers
  answer: (key: keyof Answers, value: string) => void
  reset: () => void
  complete: boolean
  recommended: ProductWithStatus | null
  label: (key: keyof Answers) => string | undefined
}

const StackCtx = createContext<StackValue | null>(null)

export function StackProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>({})

  const value = useMemo<StackValue>(() => {
    const complete = Boolean(answers.role && answers.job && answers.size)
    /* The urgent job IS the routing: master §2.3 maps each of these sentences
       to exactly one product, so the recommendation is a lookup, not a scoring
       model the page would then have to justify. Role and team size are asked
       because the tab asks for them and because they qualify the lead, not
       because they secretly override the job. */
    const recommended = complete
      ? (PRODUCTS_WITH_STATUS.find((product) => product.key === (answers.job as ProductKey)) ?? null)
      : null

    return {
      answers,
      complete,
      recommended,
      answer: (key, next) => setAnswers((prev) => ({ ...prev, [key]: next })),
      reset: () => setAnswers({}),
      label: (key) => {
        const id = answers[key]
        if (!id) return undefined
        return SELECTOR[key].options.find((option) => option.id === id)?.label
      },
    }
  }, [answers])

  return <StackCtx.Provider value={value}>{children}</StackCtx.Provider>
}

export function useStack() {
  const value = useContext(StackCtx)
  if (!value) throw new Error("useStack must be used inside StackProvider")
  return value
}
