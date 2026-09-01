import fs from 'node:fs'
import path from 'node:path'

const SRC = process.env.HOME + '/loadhunter-tz/tabs'
const OUT = process.env.HOME + '/loadhunter-corporate/corporate/content/tz'

const files = fs.readdirSync(SRC).filter(f => f !== '00-master-system.md').sort(
  (a, b) => parseInt(a) - parseInt(b),
)

/** Split "Key: value" once. */
const kv = (line, key) =>
  line.startsWith(key) ? line.slice(key.length).replace(/^[:\s]+/, '').trim() : null

/** Strip the smart quotes the doc wraps every CTA label in. */
const unquote = s => (s || '').replace(/^[“"']+|[”"']+$/g, '').trim()

// Tabs 01-42 are written in one house style; 43-46 use a Russian-labelled
// variant of the same skeleton. Both maps below feed one parser.
const HEAD = new Set([
  'Паспорт страницы', 'Продажная гипотеза', 'Hero - точный контент',
  'Пошаговая структура страницы', 'FAQ', 'Acceptance criteria',
  'Продажная и функциональная логика', 'Первый экран - точный текст',
  'Критерии приёмки',
])
const isSectionHead = l =>
  HEAD.has(l) ||
  /^SEO, GEO/.test(l) ||
  /^SEO и технические требования$/.test(l) ||
  /^Аналитика( и CRM)?$/.test(l) ||
  /^Analytics, governance and CMS$/.test(l) ||
  /^Mobile, performance, accessibility$/.test(l) ||
  /^Доступность и производительность$/.test(l)

const pages = []

for (const file of files) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8')
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)

  const header = lines[0] // "09 — Carriers /carriers"
  const num = parseInt(header)
  const m = header.match(/^\d+\s+—\s+(.+?)(?:\s+(\/\S*))?$/)
  const name = m ? m[1].trim() : header
  const urlFromHeader = m && m[2] ? m[2] : null

  const p = {
    num,
    file,
    name,
    url: urlFromHeader,
    passport: {},
    hypothesis: '',
    hero: { h1: '', supporting: '', ctaPrimary: '', ctaSecondary: '', microcopy: '', layout: '' },
    blocks: [],
    faq: [],
    seo: { title: '', description: '', canonical: '' },
    events: [],
    acceptance: [],
  }

  // Walk the body, tracking which named section we're inside.
  let section = null
  let block = null
  let field = null
  let faqQ = null

  const flushBlock = () => { if (block) p.blocks.push(block); block = null; field = null }

  for (let i = 2; i < lines.length; i++) {
    const l = lines[i]

    if (isSectionHead(l)) {
      flushBlock()
      faqQ = null
      section =
        l === 'Паспорт страницы' ? 'passport'
        : /^(Продажная гипотеза|Продажная и функциональная логика)$/.test(l) ? 'hypothesis'
        : /^(Hero - точный контент|Первый экран - точный текст)$/.test(l) ? 'hero'
        : l === 'Пошаговая структура страницы' ? 'blocks'
        : l === 'FAQ' ? 'faq'
        : /^(SEO, GEO|SEO и технические требования)/.test(l) ? 'seo'
        : /^(Аналитика( и CRM)?|Analytics, governance and CMS)$/.test(l) ? 'analytics'
        : /^(Acceptance criteria|Критерии приёмки)$/.test(l) ? 'acceptance'
        : 'other'
      continue
    }

    if (section === 'passport') {
      for (const [key, prop] of [
        ['URL', 'url'], ['Аудитория', 'audience'], ['Бизнес-цель', 'goal'],
        ['Primary CTA', 'primaryCta'], ['Secondary CTA', 'secondaryCta'],
        ['Основная кнопка', 'primaryCta'], ['Дополнительная кнопка', 'secondaryCta'],
        ['Канонический язык P0', 'lang'], ['Основной язык', 'lang'], ['P0', 'p0'],
      ]) {
        const v = kv(l, key)
        if (v !== null) { p.passport[prop] = v; break }
      }
      continue
    }

    if (section === 'hypothesis') { p.hypothesis = p.hypothesis ? p.hypothesis + ' ' + l : l; continue }

    if (section === 'hero') {
      if (l === 'H1') { field = 'h1'; continue }
      if (/^(Supporting copy|Пояснение)$/.test(l)) { field = 'supporting'; continue }
      if (l === 'CTA row') { field = 'cta'; continue }
      if (l === 'Кнопки') { field = 'buttons'; continue }
      if (l === 'Размещение и визуал') { field = 'layout'; continue }
      if (field === 'buttons') {
        // 43-46 list the two buttons as bare lines, primary first.
        if (!p.hero.ctaPrimary) p.hero.ctaPrimary = unquote(l)
        else if (!p.hero.ctaSecondary) p.hero.ctaSecondary = unquote(l)
        continue
      }
      if (field === 'cta') {
        const pr = kv(l, 'Primary'), se = kv(l, 'Secondary'), mi = kv(l, 'Microcopy')
        if (pr !== null) p.hero.ctaPrimary = unquote(pr)
        else if (se !== null) p.hero.ctaSecondary = unquote(se)
        else if (mi !== null) p.hero.microcopy = unquote(mi)
        continue
      }
      if (field) p.hero[field] = p.hero[field] ? p.hero[field] + ' ' + l : l
      continue
    }

    if (section === 'blocks') {
      const bm = l.match(/^Блок\s+(\d+)\.\s*(.*)$/)
      if (bm) {
        flushBlock()
        block = { n: +bm[1], name: bm[2].trim(), h3: '', text: '', visual: '', cta: '', trigger: '' }
        continue
      }
      if (!block) continue
      const h3 = kv(l, 'H3')
      if (h3 !== null) { block.h3 = h3; field = null; continue }
      if (/^(Точный текст|Что необходимо объяснить)$/.test(l)) { field = 'text'; continue }
      if (/^(Визуал и интеракция|Визуал и взаимодействие)$/.test(l)) { field = 'visual'; continue }
      if (/^(CTA|Кнопка)$/.test(l)) { field = 'cta'; continue }
      if (/^(Conversion trigger|Trigger)$/.test(l)) { field = 'trigger'; continue }
      if (field) {
        const value = field === 'cta' ? unquote(l) : l
        block[field] = block[field] ? block[field] + ' ' + value : value
      }
      continue
    }

    if (section === 'faq') {
      if (faqQ === null) { faqQ = l; continue }
      p.faq.push({ q: faqQ, a: l })
      faqQ = null
      continue
    }

    if (section === 'seo') {
      const t = l.match(/^Title:\s*(.+?)\.\s*Description:\s*(.+)$/)
      if (t) { p.seo.title = t[1].trim(); p.seo.description = t[2].trim(); continue }
      const st = kv(l, 'SEO title')
      if (st !== null) { p.seo.title = st.replace(/\.$/, ''); continue }
      const c = kv(l, 'Canonical')
      if (c !== null) { p.seo.canonical = c; continue }
      continue
    }

    if (section === 'analytics') {
      const e = kv(l, 'События') ?? kv(l, 'Events')
      if (e !== null) { p.events = e.split(/[,\s]+/).map(s => s.trim()).filter(Boolean); continue }
      continue
    }

    if (section === 'acceptance') { p.acceptance.push(l); continue }
  }
  flushBlock()

  if (!p.url) p.url = p.passport.url || null
  pages.push(p)
}

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 2))

// Report what parsed cleanly and what needs a human look.
const bad = pages.filter(p => !p.hero.h1 || !p.blocks.length || !p.seo.canonical)
console.log(`parsed ${pages.length} pages, ${pages.reduce((n, p) => n + p.blocks.length, 0)} blocks, ${pages.reduce((n, p) => n + p.faq.length, 0)} faq`)
console.log('needs attention:', bad.map(p => `${p.num}${!p.hero.h1 ? ' [no h1]' : ''}${!p.blocks.length ? ' [no blocks]' : ''}${!p.seo.canonical ? ' [no canonical]' : ''}`).join(', ') || 'none')
