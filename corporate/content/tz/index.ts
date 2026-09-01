/**
 * The specification, as data.
 *
 * Every word of copy on this site comes from `LoadHunter_TOR_корпоративный_сайт`
 * (48 tabs, Google Docs). `pages.json` is that document parsed - one entry per
 * page tab, with the passport, hero, numbered blocks, FAQ, SEO and analytics
 * events kept in the shape the tabs are written in. The parser lives in
 * `scripts/parse-tz.mjs`; re-run it when the document changes rather than
 * editing the JSON, and never retype copy into a component.
 *
 * Tab 47 (/login) is the one tab written to a different skeleton - it specifies
 * a public sign-in screen plus a private /account cabinet, in numbered sections
 * rather than blocks - so its spec is transcribed here by hand.
 */

import raw from "./pages.json"

export type TzBlock = {
  n: number
  /** The block's own name in the document, e.g. "Name the bottleneck". */
  name: string
  h3: string
  /** "Точный текст" - what the block has to say, verbatim. */
  text: string
  /** "Визуал и интеракция" - what the document asks the block to look like. */
  visual: string
  cta: string
  trigger: string
}

export type TzPage = {
  num: number
  file: string
  name: string
  url: string
  passport: {
    url?: string
    audience?: string
    goal?: string
    primaryCta?: string
    secondaryCta?: string
    lang?: string
    p0?: string
  }
  hypothesis: string
  hero: {
    h1: string
    supporting: string
    ctaPrimary: string
    ctaSecondary: string
    microcopy: string
    layout: string
  }
  blocks: TzBlock[]
  faq: { q: string; a: string }[]
  seo: { title: string; description: string; canonical: string }
  events: string[]
  acceptance: string[]
}

/**
 * Tab 47, transcribed. Section 3.1 gives the sign-in screen's exact strings;
 * sections 3.2 to 5.10 describe the cabinet behind it. Only the public screen
 * is a page on this site - the cabinet is an application surface - so the
 * cabinet sections become the block list, which is what the skeleton needs to
 * show that the route exists and what sits behind it.
 */
const LOGIN: TzPage = {
  num: 47,
  file: "47-login-login.md",
  name: "Login",
  url: "/login",
  passport: {
    url: "/login",
    audience:
      "Существующие пользователи, новые покупатели после выбора тарифа, приглашённые участники команды и пользователи Preview.",
    goal:
      "Безопасно авторизовать пользователя, восстановить его контекст, показать доступные продукты и дать возможность управлять подпиской, оплатой, командой и компанией.",
    primaryCta: "Continue",
    secondaryCta: "Create an Account",
    lang: "US English. Первый коммерческий регион: США.",
  },
  hypothesis:
    "/login отвечает за вход, регистрацию, восстановление доступа и безопасное перенаправление. /account отвечает за продукты, подписку, оплату, команду, компанию и безопасность аккаунта. Обе страницы получают noindex, nofollow и отсутствуют в sitemap.",
  hero: {
    h1: "Sign in to your LoadHunter account.",
    supporting:
      "Access your products, company, team and billing from one secure place.",
    ctaPrimary: "Continue",
    ctaSecondary: "Create an Account",
    microcopy: "Forgot Password?",
    layout:
      "Eyebrow «Five Products. One Secure Account.», H1, subhead, форма входа. Показывать только те методы входа, которые поддерживает backend; ошибка не раскрывает, существует ли email.",
  },
  blocks: [
    {
      n: 1,
      name: "Форма входа",
      h3: "Only the sign-in methods the backend actually supports.",
      text:
        "Email обязателен и проверяется по формату. Show Password не сбрасывает введённое значение. Google Sign-In или SSO появляются только после реального подключения. Ошибка не раскрывает, существует ли указанный email. Защита от перебора работает на сервере.",
      visual: "Форма входа с видимым фокусом и ошибками, привязанными к полям.",
      cta: "Continue",
      trigger: "",
    },
    {
      n: 2,
      name: "Возврат после входа",
      h3: "Return the visitor to the context they came from.",
      text:
        "Из /pricing или Checkout — вернуть к выбранному продукту и тарифу. Из приглашения — открыть компанию и роль. Из продукта — вернуть на разрешённый исходный адрес. При прямом входе — Overview кабинета. Возврат разрешён только на адреса из белого списка.",
      visual: "Маршрутизация без интерфейса; проверяется тестами на open redirect.",
      cta: "",
      trigger: "",
    },
    {
      n: 3,
      name: "Регистрация и восстановление",
      h3: "Four steps, with consent kept separate.",
      text:
        "Шаг 1: рабочий email и подтверждение. Шаг 2: имя, компания, роль, страна. Шаг 3: начальная задача или продукт. Шаг 4: обязательное согласие с Terms и Privacy; маркетинговое согласие отдельное и не выбрано заранее.",
      visual: "Пошаговая форма; восстановление доступа отдельным маршрутом.",
      cta: "Create an Account",
      trigger: "",
    },
    {
      n: 4,
      name: "Кабинет /account",
      h3: "Overview, Products, Billing, Team, Company, Integrations, Notifications, Security, Support.",
      text:
        "Девять разделов кабинета за авторизацией. Рабочие операции выполняются в приложениях продуктов; кабинет открывает их через подтверждённые адреса.",
      visual: "Оболочка кабинета с постоянной навигацией по девяти разделам.",
      cta: "",
      trigger: "",
    },
    {
      n: 5,
      name: "Онлайн-оплата",
      h3: "Server-side price, verified webhook, no false access.",
      text:
        "Checkout использует серверную цену и подтверждённый тариф. Подписка активируется только после проверенного webhook. Ошибка оплаты не создаёт ложный доступ и не теряет выбранный тариф. Данные карты обрабатывает Stripe; LoadHunter хранит только безопасные идентификаторы.",
      visual: "Checkout и состояния оплаты; huntPAY в этом потоке не участвует.",
      cta: "",
      trigger: "",
    },
  ],
  faq: [],
  seo: {
    title: "Sign in to LoadHunter",
    description:
      "Access your products, company, team and billing from one secure place.",
    // Section 2 puts /login behind noindex, nofollow and out of the sitemap,
    // so it gets no self-canonical - see NOINDEX below.
    canonical: "",
  },
  events: [
    "login_viewed",
    "login_started",
    "login_succeeded",
    "login_failed",
    "signup_completed",
    "password_reset_requested",
    "account_viewed",
    "product_opened",
    "team_invited",
    "checkout_started",
    "checkout_completed",
    "checkout_failed",
    "subscription_activated",
    "plan_changed",
    "billing_portal_opened",
    "logout",
  ],
  acceptance: [
    "Пользователь может войти, восстановить доступ и безопасно выйти.",
    "После входа открываются правильная компания, роль и продукты.",
    "Изменение URL или запроса не даёт доступ к другой компании.",
    "Checkout использует серверную цену и подтверждённый тариф.",
    "Подписка активируется только после проверенного webhook.",
    "Ошибка оплаты не создаёт ложный доступ и не теряет выбранный тариф.",
  ],
}

/**
 * The sentence the block actually says.
 *
 * Six blocks write their copy as an instruction wrapping a quote - `Exact
 * copy: "huntTMS brings the active load, assigned resources and next
 * operational action into one working view."` The quoted half is the page's
 * words; the half before the colon is addressed to whoever builds the page.
 * Printing both puts "Exact copy:" on the live site, so the wrapper is
 * unwrapped once here rather than in eight renderers. The JSON stays verbatim:
 * it is the record of the document.
 */
const QUOTED = /^([^:.]{0,28}):\s*[\u201c"\u00ab](.+?)[\u201d"\u00bb]\.?\s*$/s

const unwrap = (text: string): string => text.match(QUOTED)?.[2].trim() ?? text

export const PAGES: TzPage[] = (raw as TzPage[])
  .map((p) => (p.num === 47 ? LOGIN : p))
  .map((p) => ({ ...p, blocks: p.blocks.map((b) => ({ ...b, text: unwrap(b.text) })) }))
  .sort((a, b) => a.num - b.num)

/**
 * Routes the document keeps out of the index.
 *
 * /login and /account by tab 47 §2; /404 because a self-canonical on an error
 * page is an indexable 404, which the URL registry in the master spec forbids
 * even though tab 39 prints a canonical for it. That conflict is item 5 in
 * `~/loadhunter-tz/README.md` and is resolved here in favour of the master.
 */
export const NOINDEX = new Set(["/login", "/account", "/404"])

/** Tabs 40-42 are templates for generated routes, not pages themselves. */
export const TEMPLATES = new Set(["/{article-slug}", "/{case-slug}", "/{compare-slug}"])

export const byNum = (num: number): TzPage => {
  const page = PAGES.find((p) => p.num === num)
  if (!page) throw new Error(`No TZ page ${num}`)
  return page
}

export const byUrl = (url: string): TzPage => {
  const page = PAGES.find((p) => p.url === url)
  if (!page) throw new Error(`No TZ page at ${url}`)
  return page
}
