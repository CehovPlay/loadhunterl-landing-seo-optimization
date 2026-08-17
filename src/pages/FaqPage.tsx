import { FAQ_ITEMS } from "@/content/copy"
import { FAQ_PAGE_GROUPS } from "@/content/pages"
import { Breadcrumbs, PageShell } from "./PageShell"

/**
 * LH-045 — the dedicated /faq/.
 *
 * The homepage keeps exactly the eight approved entity-first Q&A; the
 * support-flavoured questions (installation, factoring connection, mailboxes,
 * detailed billing) live here with UNIQUE answers, grouped, plus links back to
 * the homepage answers and the feature pages. Nothing is duplicated verbatim
 * between the two.
 */
export function FaqPage() {
  return (
    <PageShell>
      <Breadcrumbs trail={[{ label: "FAQ" }]} />

      <h1 className="text-[clamp(30px,6vw,44px)] font-medium leading-[1.15] tracking-[-0.03em] text-ink">
        LoadHunter support questions
      </h1>
      <p className="mt-6 text-[18px] font-medium leading-[28px] tracking-[-0.02em] text-ink/75">
        Setup, connections and billing, answered. For what LoadHunter is, which load boards it
        supports and how its profit and automation features work, see the answers on the{" "}
        <a href="/#faq" className="text-violet underline underline-offset-2">
          homepage FAQ
        </a>
        .
      </p>

      {FAQ_PAGE_GROUPS.map((g) => (
        <section key={g.title} className="mt-12">
          <h2 className="text-[24px] font-medium leading-[32px] tracking-[-0.02em] text-ink">
            {g.title}
          </h2>
          <dl className="mt-6 flex flex-col gap-7">
            {g.items.map((i) => (
              <div key={i.id} id={i.id} className="scroll-mt-24">
                <dt className="text-[17px] font-medium leading-[26px] tracking-[-0.02em] text-ink">
                  {i.q}
                </dt>
                <dd className="mt-2 text-[16px] font-medium leading-[26px] tracking-[-0.01em] text-ink/75">
                  {i.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="mt-14 rounded-lg border border-border-light bg-white p-6">
        <h2 className="text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-ink">
          Answered on the homepage
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {FAQ_ITEMS.map((f) => (
            <li key={f.id}>
              <a
                href={`/#${f.id}`}
                className="text-[15px] font-medium leading-[22px] tracking-[-0.02em] text-violet underline underline-offset-2"
              >
                {f.q}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  )
}
