# Backend handoff — что подключено и что осталось

Документ для бэкенда/владельца аккаунтов. Сайт полностью статический
(`npm run build` → `dist/`), сервера у лендинга нет — всё «подключение»
сводится к ссылкам, публичным ключам и одному API-вызову с фронта.
Актуально на 2026-07-22.

## Уже подключено (ничего делать не нужно)

| Что | Куда ведёт | Где в коде |
| --- | --- | --- |
| «Add to Chrome» (все инстансы) | Chrome Web Store | `CHROME_STORE_URL`, `src/sections/Navbar.tsx` |
| «Get Demo» (компактный навбар + моб. меню) | Calendly `loadhunterdev/30min` — то же событие, что прод встраивает на `/demo` | `CALENDLY_URL`, `src/sections/Navbar.tsx` |
| «Start 14-day free trial» (герой) и CTA тарифов Freemium/Basic/Standard/Pro | `https://app.loadhunter.io` | `APP_URL` в `Navbar.tsx`; `ctaHref` в `src/sections/planMatrix.tsx` |
| «Start booking in seconds» (герой) | Chrome Web Store | `src/sections/Hero.tsx`, `mobile/MobileHero.tsx` |
| «Add to wishlist» (план AI) | `https://t.me/loadhunterextension` | `planMatrix.tsx` |
| «Contact» в меню, соцсети футера | Telegram / Instagram / YouTube / X (зеркалят прод) | `Navbar.tsx`, `src/components/site/SocialLinks.tsx` |
| Privacy / Terms | статические `/privacy.html`, `/terms.html` (тексты с прода) | `public/privacy.html`, `public/terms.html`, `public/legal.css` |

Все внешние URL собраны константами в `src/sections/Navbar.tsx` — менять
адреса нужно только там.

## Осталось подключить

### 1. Форма Subscribe в футере (единственная заглушка)

Сейчас обе формы (desktop `src/sections/Footer.tsx:35`, mobile
`src/sections/mobile/MobileFooter.tsx:23`) делают `preventDefault()` и ничего
не отправляют.

Прод loadhunter.io своей формы подписки не имеет, но уже подключён к
**Klaviyo**: onsite-скрипт грузится с публичным
`company_id=UihK2v` (виден в исходнике прода, это не секрет). Поэтому
бэкенд-сервер не нужен — форму можно подключить фронтенд-запросом к
публичному клиентскому API Klaviyo. **Единственное, что требуется от вас —
`list_id`** (6-символьный ID списка рассылки: Klaviyo dashboard → Audience →
Lists & Segments → нужный список → Settings → List ID).

Готовый вызов, который фронт сделает по сабмиту (подставить `LIST_ID`):

```js
await fetch("https://a.klaviyo.com/client/subscriptions/?company_id=UihK2v", {
  method: "POST",
  headers: { "Content-Type": "application/json", revision: "2024-10-15" },
  body: JSON.stringify({
    data: {
      type: "subscription",
      attributes: {
        profile: { data: { type: "profile", attributes: { email } } },
      },
      relationships: {
        list: { data: { type: "list", id: "LIST_ID" } },
      },
    },
  }),
})
```

Передайте `list_id` — вставим и задеплоим. Если рассылки решите вести не в
Klaviyo, а другим сервисом — просто скажите каким, форма нейтральная.

### 2. Аналитика GA4 (опционально, 1 переменная)

Прод использует GA4 `G-VXPXV4HPCV`. Лендинг грузит GA только если при сборке
задан `VITE_GA_ID` (см. `src/lib/analytics.ts`), без переменной трекинга нет.
Чтобы включить ту же аналитику:

```bash
VITE_GA_ID=G-VXPXV4HPCV npx vercel --prod
```

или задать `VITE_GA_ID` в env проекта на Vercel (Production) — тогда любая
сборка подхватит его автоматически. Klaviyo-скрипт аналитики (onsite JS) на
лендинг пока сознательно не добавлен — скажите, если нужен.

### 3. Перенос на домен loadhunter.io

Хостинг — Vercel, проект `loadhunter-extension-landing` (деплой:
`npx vercel --prod`). Все SEO-артефакты уже считают домен продовым:
canonical/OG в `index.html`, `public/robots.txt`, `public/sitemap.xml`
(включая `/privacy.html` и `/terms.html`) указывают на `https://loadhunter.io`.
Достаточно привязать домен к проекту Vercel — менять в коде ничего не нужно.

Учесть при переключении:

- Прод-роут `/demo` (страница с инлайн-Calendly) в статике не воспроизведён —
  «Get Demo» ведёт на Calendly напрямую. Если на `/demo` есть внешние ссылки
  (реклама и т.п.), настройте redirect `/demo → https://calendly.com/loadhunterdev/30min`
  (можно в `vercel.json`) или попросите нас собрать статическую страницу.
- Прочие прод-роуты (`/privacy`, `/terms` без `.html` и т.д.) — при
  необходимости тоже редиректы в `vercel.json`.

## Контрольный список для запуска

- [ ] `list_id` Klaviyo → нам (подключим Subscribe)
- [ ] `VITE_GA_ID=G-VXPXV4HPCV` в env Vercel (или подтвердить, что аналитика не нужна)
- [ ] Домен `loadhunter.io` → Vercel-проект `loadhunter-extension-landing`
- [ ] Redirect `/demo` (если на него ссылаются извне)
