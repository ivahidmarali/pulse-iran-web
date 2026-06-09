# SEO Action Plan — palsiran.com

**Generated:** June 8, 2026 | **Current Score:** 58/100 | **Target:** 80/100 by September 2026

---

## CRITICAL — Fix Today (P0)

### C1 — Disable Cloudflare Bot Fight Mode
**Impact: Unblocks ALL search engine and AI crawler access**  
**Effort:** 15 minutes (dashboard config only)  
**Score impact: +14 pts** (Technical SEO from 45 → ~84)

1. Go to Cloudflare Dashboard → your palsiran.com zone
2. Security → Bots → Bot Fight Mode: **Off**
3. If on Pro plan: Security → Bots → Super Bot Fight Mode → "Definitely automated" → **Allow**
4. Verify immediately: `curl -I -A "Googlebot" https://palsiran.com/` must return `200 OK`
5. GSC → URL Inspection → test live URL → Request indexing for:
   - `https://palsiran.com/`
   - `https://palsiran.com/sitemap.xml`
   - `https://palsiran.com/news-sitemap.xml`

### C2 — Disable Cloudflare Managed robots.txt
**Impact: Resolves GPTBot/ClaudeBot/Google-Extended undefined state**  
**Effort:** 5 minutes  

1. Cloudflare Dashboard → Crawlers & Bots (or Security → Bots)
2. Disable "AI Bot Blocking" / "Managed robots.txt" feature
3. Verify: `curl https://palsiran.com/robots.txt` should show only your `robots.ts` output (no Cloudflare-injected section)

---

## HIGH — Fix This Week

### H1 — Write First 2 Editorial Articles
**Impact: Activates E-E-A-T; removes "coming soon" negative signal**  
**Effort:** 3-4 hours each  

Priority order from CONTENT-CALENDAR.md Batch 1:
1. `تفاوت رسانه اصولگرا و اصلاح‌طلب` → `/editorial/taafovot-resane-osoulgarayan`
   - 1,000 words minimum
   - Include comparison table (11-lean taxonomy)
   - Internal links to all lean pages
   - Target keyword: `رسانه اصولگرا` (4K-16K/mo, low competition)
2. `بهترین منبع خبری فارسی برای ایرانیان خارج از کشور` → `/editorial/behtarin-manba-khabari`

**Also:** Update `editorial/page.tsx` to render the article list (remove "coming soon" placeholder).

---

### H2 — Write World Cup 2026 Guide (TIME-SENSITIVE)
**Impact: 50K-100K/mo keyword; tournament is underway NOW**  
**Effort:** 2-3 hours  
**Deadline: June 12, 2026**

Title: `جام جهانی ۲۰۲۶: برنامه و نتایج تیم ملی ایران`  
URL: `/editorial/jame-jahani-2026`  
Structure: Iran group stage schedule → link to `/livescore` → news from sports category  
Schema: `Article` with `author` pointing to `#editor` Person entity

---

### H3 — Add Political Lean Badge to Article Pages
**Impact: Highest per-effort E-E-A-T differentiator; also HCU mitigation**  
**Effort:** 30 minutes  

In `app/article/[id]/[[...slug]]/page.tsx`:
- Look up `item.source` in the lean classification data
- Add a lean badge component next to the source name in the article header
- Style consistent with the lean badges on source profile pages

---

### H4 — Add `masthead` to NewsMediaOrganization Schema
**Impact: Google News eligibility signal**  
**Effort:** 2 minutes  

In `app/layout.tsx`, `organizationJsonLd`:
```typescript
"masthead": `${SITE_URL}/about`,
```

---

### H5 — Fix Prices Page Schema
**Impact: Enables Product/Offer rich results instead of no-op Dataset schema**  
**Effort:** 1 hour  

Replace `Dataset` + `PropertyValue` in `/app/prices/page.tsx` with `WebPage` + `ItemList` of `Product`/`Offer` nodes per currency. Keep FAQPage schema (already correct).

---

### H6 — Add SSR Match Shell to /livescore
**Impact: Makes livescore content crawlable by Googlebot**  
**Effort:** 2-3 hours  

In `app/livescore/page.tsx`: Add `export const revalidate = 120` and server-render a static `<table>` of today's matches (fetched from the livescore API). The `LiveScoreClient` component hydrates over it for real-time updates.

---

### H7 — Add FAQPage Schema to /about
**Impact: Highest-leverage schema type for AI Overview inclusion**  
**Effort:** 1 hour  

Use the 4 Q&A blocks from `public/llms.txt`:
1. "What is Pulse Iran?" / "پالس ایران چیست؟"
2. "How does Pulse Iran classify sources?" / "گرایش سیاسی منابع چگونه تعیین می‌شود؟"
3. "What are the live prices?" / "قیمت‌های لحظه‌ای چیست؟"
4. "What does multi-source verified mean?" / "تأیید چندمنبعه یعنی چه؟"

Also add FAQPage to `/about/editorial-policy` for the 8 numbered methodology sections.

---

### H8 — Create Branded Homepage OG Image
**Impact: Top Stories rich result visual differentiation**  
**Effort:** 2 hours (design + deploy)  

Create 1200×630px branded image: palsiran.com logo + `#101415` background + `#3cd7ff` accent. Replace `og-default.jpg` in `public/`.

---

## MEDIUM — Next 2 Weeks

### M1 — Remove Hardcoded Hreflang from layout.tsx
**Effort:** 1 minute  

Delete line 163 in `layout.tsx`:
```tsx
// DELETE this line:
<link rel="alternate" hrefLang="fa" href={SITE_URL} />
```

---

### M2 — Fix Schema Minor Issues
**Effort:** 15 minutes total  

All in `layout.tsx` `organizationJsonLd` / `editorPersonJsonLd`:
```typescript
// Fix 1: contactType
"contactType": "customer service"  // was: "editorial"

// Fix 2: availableLanguage
"availableLanguage": "fa"  // was: "Persian"

// Fix 3: Person sameAs — remove (brand accounts, not personal)
// Delete sameAs from editorPersonJsonLd
```

---

### M3 — Add articleSection to NewsArticle Schema
**Effort:** 5 minutes  

In `app/article/[id]/[[...slug]]/page.tsx`, add to NewsArticle JSON-LD:
```typescript
"articleSection": item.category ?? "اخبار",
```

---

### M4 — Build /prices/[currency] Sub-Pages
**Impact: Unlocks نرخ دلار امروز, قیمت طلا امروز, نرخ یورو امروز keyword clusters**  
**Effort:** 6-8 hours  

Create dynamic route `/app/prices/[currency]/page.tsx`:
- Individual pages for: dollar, euro, gold, coin
- Dedicated title/description/canonical per asset
- Migrate FAQPage schema from /prices to per-page
- Add 7-day sparkline component
- Add `Product`/`Offer` schema per currency

---

### M5 — Fix IndexNow Over-Pinging
**Effort:** 1 hour  

In `/app/news-sitemap.xml/route.ts`:
1. Store timestamp of last IndexNow ping (in Redis, KV, or file)
2. Filter submitted URLs to only those with `published_at > lastPingTimestamp`
3. Update timestamp after successful ping

---

### M6 — Create Author Page /about/vahid-marali
**Effort:** 1-2 hours  

Create `app/about/vahid-marali/page.tsx`:
- Person schema with `@id: "…/#editor"`, `sameAs`, `knowsAbout`
- 200-300 word bio in Persian
- Link to editorial policy + first editorial article
- Update `editorPersonJsonLd` in layout.tsx: `url` → `${SITE_URL}/about/vahid-marali`

---

### M7 — Fix sitemap.ts Fetch Caching
**Effort:** 5 minutes  

In `sitemap.ts` `fetchAllArticles()`:
```typescript
// Change:
{ cache: "no-store" }
// To:
{ next: { revalidate: 3600 } }
```

---

### M8 — Add SportsEvent Schema to /livescore
**Effort:** 4-6 hours (dependent on M6 SSR work)  

Per match in SSR shell:
```json
{ "@type": "SportsEvent",
  "name": "استقلال در برابر پرسپولیس",
  "startDate": "2026-06-08T18:00:00+03:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "competitor": [
    { "@type": "SportsTeam", "name": "استقلال" },
    { "@type": "SportsTeam", "name": "پرسپولیس" }
  ] }
```

---

### M9 — Add 301 Redirect for Articles Without Slug
**Effort:** 30 minutes  

In `app/article/[id]/[[...slug]]/page.tsx`, if no slug params, fetch the title and redirect:
```typescript
if (!slug) redirect(`/article/${id}/${generateSlug(item.title)}`);
```

---

## LOW — Backlog

### L1 — Remove `unsafe-eval` from CSP
Verify Next.js 14 doesn't require it; remove if possible.

### L2 — WebSite-Level speakable
Remove `speakable` from the WebSite JSON-LD node in layout.tsx (no Google value).

### L3 — Add Cross-Origin-Opener-Policy Header
Add `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin` to `next.config.mjs` headers.

### L4 — Mobile Native h1
Replace `<div role="heading" aria-level={1}>` with a native `<h1>` on article and tag pages (requires CSS refactor to avoid dual h1 issues).

### L5 — Corrections Log
Add at least a minimal history table to `/corrections` page.

### L6 — Verify IndexNow Key File
Check `https://palsiran.com/palsiran2026indexnow.txt` returns 200.

### L7 — RSS Feed Enhancement
Add `<summary>` tags with AI summaries and `<category>` tags with political lean to `/feed.xml`.

### L8 — Wikipedia Entity
Draft a Persian-language `fa.wikipedia.org` article about the 11-lean political bias taxonomy.

---

## Content Calendar — Priority Queue

| Week | Article | Keyword | Volume |
|------|---------|---------|--------|
| Jun 8–12 | جام جهانی ۲۰۲۶ راهنمای کامل | جام جهانی ۲۰۲۶ | 50K–100K |
| Jun 8–12 | تفاوت رسانه اصولگرا و اصلاح‌طلب | رسانه اصولگرا | 4K–16K |
| Jun 15–19 | بهترین منبع خبری فارسی | منبع خبری فارسی | 2K–8K |
| Jun 22–26 | راهنمای خواندن انتقادی اخبار | اخبار انتقادی | 1K–3K |
| Jul | BBC Persian profile deep-dive | بی‌بی‌سی فارسی | 2K–10K |
| Jul | Iran International profile deep-dive | ایران اینترنشنال | 3K–10K |
| Sep | تاریخچه نرخ دلار در ایران | تاریخچه دلار ایران | 5K–15K |
| Sep | Q2 گزارش فصلی پالس رسانه‌ها | (linkbait) | — |

---

## Score Projection

| Milestone | Score | Condition |
|-----------|-------|-----------|
| Fix Cloudflare 403 | ~72/100 | C1 + C2 done |
| + First 2 editorial articles + schema fixes | ~76/100 | H1–H5 done |
| + Prices sub-pages + livescore SSR + FAQ schema | ~80/100 | M4 + H6 + H7 done |
| + External backlinks + quarterly report | ~84/100 | Target by Sep 2026 |

---

*Generated: June 8, 2026 — FULL-AUDIT-REPORT.md for detailed findings*
