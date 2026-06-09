# Full SEO Audit Report — palsiran.com

**Date:** June 8, 2026  
**Audited by:** Claude Code SEO Audit (multi-agent: technical, schema, content, GEO, SXO)  
**Stack:** Next.js 14 App Router, Cloudflare CDN, nginx, FastAPI backend, Frankfurt  
**Business type:** Persian-language news aggregator + editorial publisher  
**Audience:** Iranian diaspora, Europe + North America, age 25–45  

---

## Overall SEO Health Score: 58 / 100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 45/100 | 9.9 |
| Content Quality / E-E-A-T | 23% | 54/100 | 12.4 |
| On-Page SEO | 20% | 72/100 | 14.4 |
| Schema / Structured Data | 10% | 75/100 | 7.5 |
| Performance (CWV) | 10% | 70/100 | 7.0 |
| AI Search Readiness | 10% | 41/100 | 4.1 |
| Images | 5% | 58/100 | 2.9 |
| **Total** | | | **58.2** |

> **Without Cloudflare 403:** estimated ~72/100. The 403 is a temporary regression on an otherwise solid Phase 1 foundation.

---

## Executive Summary

palsiran.com has a strong technical foundation built in Phase 1. Schema, sitemaps, hreflang, robots, and performance are correctly implemented. The site has one unique structural differentiator no Persian competitor offers: **11-category transparent political bias labeling across 45+ sources**.

**However, the site is currently completely invisible to all search engines and AI crawlers.** Every page except `robots.txt` returns HTTP 403 Forbidden. Cloudflare Bot Fight Mode has been re-enabled (or a WAF managed rule activated), blocking Googlebot, Bingbot, and all AI crawlers at the edge. This is a P0 issue that must be fixed today before any other SEO work matters.

### Top 5 Critical Issues
1. HTTP 403 on all pages — Cloudflare blocking every crawler (P0)
2. robots.txt conflict — Cloudflare managed block contradicts custom bot permissions
3. Zero editorial content — `/editorial` shows "coming soon", 0 articles published
4. Political lean label not surfaced at article page level — main differentiator is invisible where users land
5. /livescore fully client-rendered — Googlebot sees no match content

### Top 5 Quick Wins (< 2 hours each)
1. Disable Cloudflare Bot Fight Mode / WAF AI-blocking rule (15 min)
2. Disable Cloudflare's managed robots.txt injection (5 min)
3. Add `masthead` to NewsMediaOrganization schema (1 line, 2 min)
4. Fix `contactPoint.contactType` from `"editorial"` → `"customer service"` (1 line)
5. Remove hardcoded hreflang `<link>` from `layout.tsx` line 163 (1 line)

---

## Section 1: Technical SEO — 45/100

### 1.1 HTTP 403 Blocking ALL Crawlers ⚠️ CRITICAL (P0)

Every page except `robots.txt` returns 403 Forbidden. Cloudflare Bot Fight Mode or a WAF managed rule is intercepting bot user-agents at the edge. Practical consequence: the site is effectively deindexed in real-time.

- Googlebot cannot fetch any page
- Google News inclusion is at risk of being revoked
- IndexNow pings register but Bingbot gets 403 on follow-up — budget wasted
- All JSON-LD (NewsArticle, NewsMediaOrganization, etc.) is invisible to Google
- GSC logs crawl anomalies; coverage counts will drop

**Fix (15 min):**
1. Cloudflare Dashboard → Security → Bots → **Bot Fight Mode: Off**
2. Or: Security → Custom Rules → add a "Skip" rule (bypass managed rules) for known bot UAs: `Googlebot`, `Bingbot`, `GPTBot`, `PerplexityBot`, `OAI-SearchBot`
3. Verify: `curl -A "Googlebot" https://palsiran.com/` → should return 200
4. After unblocking: GSC URL Inspection → Test live URL → Request indexing for `/`, `/sitemap.xml`, `/news-sitemap.xml`

---

### 1.2 robots.txt Conflict — AI Bot Permissions Undefined ⚠️ HIGH

Cloudflare injects a managed block at the top of `robots.txt` disallowing `GPTBot`, `ClaudeBot`, `Google-Extended`. The custom section from `robots.ts` below re-allows them. When the same user-agent appears in multiple groups, crawler behavior is implementation-defined:

| Bot | Cloudflare Block | Custom | Net Result |
|-----|-----------------|--------|------------|
| GPTBot | `Disallow: /` | `Allow: /` | **UNDEFINED — likely blocked** |
| ClaudeBot | `Disallow: /` | `Allow: /` | **UNDEFINED — likely blocked** |
| Google-Extended | `Disallow: /` | `Allow: /` | **UNDEFINED — likely blocked** |
| OAI-SearchBot | — | `Allow: /` | Allowed ✅ |
| PerplexityBot | — | `Allow: /` | Allowed ✅ |
| Googlebot | — | `Allow: /` | Allowed ✅ |
| Bingbot | — | `Allow: /` | Allowed ✅ |

**Fix:** Disable Cloudflare's "Managed robots.txt" / "AI Bot Blocking" feature (Cloudflare → Crawlers & Bots settings). `robots.ts` becomes the single source of truth.

---

### 1.3 Hardcoded Hreflang in Root Layout ⚠️ MEDIUM

`layout.tsx` line 163: `<link rel="alternate" hrefLang="fa" href={SITE_URL} />` emits the homepage URL on every page — including article pages and source profiles. The per-page `generateMetadata.alternates` already emits the correct URL. The hardcoded line creates a conflicting signal on non-home pages.

**Fix:** Remove line 163. Next.js `alternates.languages` handles this correctly per page.

---

### 1.4 Article Slug Duplication (optional catch-all) ⚠️ MEDIUM

`[[...slug]]` means both `/article/abc123` and `/article/abc123/some-title` are valid routes. Canonical resolves duplication, but both variants get crawled, doubling crawl cost.

**Fix:** 301 redirect from `/article/{id}` (no slug) → `/article/{id}/{slug}`.

---

### 1.5 IndexNow Over-Pinging ⚠️ MEDIUM

The IndexNow ping in `news-sitemap.xml/route.ts` fires every 5 minutes and submits all recent articles — not just newly published ones. Same URLs are pinged repeatedly, wasting quota.

**Fix:** Track last-pinged timestamp. Only submit articles newer than the previous run.

Also verify: `https://palsiran.com/palsiran2026indexnow.txt` returns 200. If missing, all IndexNow submissions fail silently.

---

### 1.6 sitemap.ts fetchAllArticles Uses cache: "no-store" ⚠️ MEDIUM

Every sitemap regeneration triggers a full paginated API scan with no caching. As the database grows, this risks ISR timeout.

**Fix:** Change to `next: { revalidate: 3600 }` to match sitemap's revalidation interval.

---

### 1.7 /livescore Is Fully Client-Rendered ⚠️ HIGH

`LiveScoreClient.tsx` renders all match data client-side. Googlebot sees only the metadata shell — no match content, team names, or competition keywords are in the initial HTML.

**Fix:** Add an SSR match list shell (static `<table>` of today's matches with `export const revalidate = 120`). The client component hydrates over it for real-time updates.

---

### Technical Pass/Fail Summary

| Check | Status |
|-------|--------|
| HTTP 403 resolved | ❌ FAIL |
| robots.txt conflict | ❌ FAIL |
| Canonical tags | ✅ PASS |
| Hreflang implementation | ⚠️ PARTIAL |
| Dual sitemap (main + Google News) | ✅ PASS |
| Security headers | ✅ PASS |
| Pagination noindex (>page 3) | ✅ PASS |
| SSR/ISR rendering | ✅ PASS |
| Mobile implementation | ✅ PASS |
| URL structure + redirects | ✅ PASS |
| IndexNow implementation | ⚠️ PARTIAL |
| Livescore SSR | ❌ FAIL |

---

## Section 2: Content Quality & E-E-A-T — 54/100

### 2.1 Zero Tier 2 Editorial Content ⚠️ CRITICAL

`/editorial` renders "مقالات تحلیلی به زودی". Zero articles published. A "coming soon" page indexed by Google is a trust-negative signal. The full E-E-A-T infrastructure (editorial policy, person schema, corrections page) exists but has no demonstrated content to anchor it.

**Fix:** Publish first 2 editorial articles this week. Update hub page to render article list instead of placeholder.

---

### 2.2 Political Lean Label Missing at Article Level ⚠️ HIGH

The site's primary differentiator (transparent bias labeling) is visible on source profiles and lean hub pages but **not** on individual articles where users land from search. The lean data exists per source in the database — this is a 30-minute code change.

**Fix:** Add lean badge next to source name in article header (`LEAN_META[item.source]`).

---

### 2.3 HCU Risk: MEDIUM-HIGH ⚠️ HIGH

150-word AI summaries are the minimum defensible length for aggregated news. The primary mitigations (isBasedOn schema, AI disclosure, source attribution) are in place, but without the lean label at article level (see 2.2), the per-article value add is thin.

**Fix:**
1. Surface lean label on article pages (resolves the main differentiation gap)
2. Update AI summary prompt: two paragraphs (event + cross-source context + diaspora relevance)
3. Increase target length to 200-250 words

---

### 2.4 Named Author Attribution Gap ⚠️ MEDIUM

Editorial articles use "تیم پالس ایران" as author. Person entity for Vahid Marali exists in schema but is disconnected from authorship. No dedicated author bio page.

**Fix:**
1. Change editorial article `author` to `{ "@type": "Person", "@id": "…/#editor", "name": "وحید مارالی" }`
2. Add visible byline on editorial articles
3. Create `/about/vahid-marali` as canonical author page

---

### 2.5 Zero External Referring Domains ⚠️ HIGH

Authoritativeness requires external validation. The political bias taxonomy is uniquely citable, but zero outreach has been done.

**Fix:** Pitch 11-lean taxonomy as a news story to Persian journalism outlets. Publish quarterly data report as linkbait. Add a Wikipedia Persian article about the methodology.

---

### E-E-A-T Signal Inventory

| Signal | Status |
|--------|--------|
| Named editor (Person schema) | ✅ |
| Editorial policy page | ✅ |
| NewsMediaOrganization schema | ✅ |
| Publishing principles + corrections + ethics policy URLs | ✅ |
| AI disclosure on articles | ✅ |
| isBasedOn schema (aggregation) | ✅ |
| 45+ source profile pages | ✅ |
| 11 political lean taxonomy | ✅ |
| Editorial articles published | ❌ 0 |
| Named author on articles | ❌ |
| Author bio page | ❌ |
| External citations / backlinks | ❌ 0 |
| Lean label at article level | ❌ |

---

## Section 3: On-Page SEO — 72/100

**PASS:** Title tags, meta descriptions, canonical strategy, internal linking, pagination.

**Tag pages:** Confirmed fully built with Persian descriptions, CollectionPage + BreadcrumbList + ItemList schema, `generateStaticParams`. Not 404s.

**Issues:**
- Mobile: `<div role="heading">` instead of native `<h1>` on article and tag pages
- No WhatsApp share button (critical for diaspora)
- No "follow on Telegram" CTA
- No newsletter signup

---

## Section 4: Schema & Structured Data — 75/100

### 4.1 NewsMediaOrganization Missing `masthead` ⚠️ HIGH

Google News Publisher Center explicitly evaluates `masthead`. Missing → reduced Google News eligibility.

**Fix (1 line in layout.tsx organizationJsonLd):**
```typescript
"masthead": `${SITE_URL}/about`,
```

---

### 4.2 Prices Page: Wrong Schema Type ⚠️ HIGH

`Dataset` + `PropertyValue` produces no rich results in Google web search. Correct pattern for a live price page:

```json
{ "@type": "WebPage",
  "mainEntity": { "@type": "ItemList",
    "itemListElement": [{ "@type": "ListItem", "position": 1,
      "item": { "@type": "Product", "name": "دلار آمریکا",
        "offers": { "@type": "Offer", "priceCurrency": "IRR",
          "price": "915000", "priceValidUntil": "2026-06-08",
          "availability": "https://schema.org/InStock" }}}]}}
```

---

### 4.3 SportsEvent Not on /livescore ⚠️ MEDIUM

Only `WebPage` schema. SportsEvent per match enables rich results for match queries.

---

### 4.4–4.6 Minor Schema Fixes ⚠️ MEDIUM

| Issue | Fix |
|-------|-----|
| `contactType: "editorial"` | → `"customer service"` |
| `availableLanguage: "Persian"` | → `"fa"` |
| Person `sameAs` = brand accounts | Remove or replace with personal profiles |
| NewsArticle missing `articleSection` | Add `item.category` |

---

### 4.7 FAQPage Schema Not Implemented ⚠️ HIGH

FAQPage has highest correlation with Google AI Overview inclusion. The Q&A blocks in llms.txt should be rendered as structured FAQ schema on `/about`.

---

## Section 5: Performance — 70/100

*(Lab data only — CrUX unavailable, insufficient traffic)*

| Signal | Assessment |
|--------|------------|
| Desktop Lighthouse | 100/100 ✅ |
| Mobile Lighthouse | ~90/100 (projected) ✅ |
| LCP (lab) | ~2.0s projected ✅ |
| Font loading (Vazirmatn via next/font) | Self-hosted ✅ |
| GA4 strategy | lazyOnload ✅ |
| ISR revalidation | 120s home, 300s articles ✅ |
| Telegram widgets (CLS risk above fold) | ⚠️ |
| CSP `unsafe-eval` | ⚠️ Low risk |

---

## Section 6: AI Search Readiness — 41/100

| Platform | Score | Primary Blocker |
|----------|-------|----------------|
| Google AI Overviews | 35/100 | 403 + no editorial content |
| Perplexity | 30/100 | 403 + llms.txt inaccessible |
| ChatGPT Search | 38/100 | robots.txt conflict on GPTBot |
| Bing Copilot | 42/100 | 403 (Bingbot allowed in robots.txt) |

**Key findings:**
- llms.txt is well-constructed (RSL 1.0, route inventory, Q&A) but returns 403
- No FAQ schema on any page
- Zero original citable content (no editorial articles, no quarterly reports)
- 11-lean taxonomy IS unique and citable — but no named author attached to definitions
- No Wikipedia entity
- YouTube in `sameAs` is the strongest existing AI signal (~0.737 correlation with citation rate)

---

## Section 7: Images — 58/100

| Issue | Severity |
|-------|----------|
| Homepage OG image is generic `og-default.jpg` | HIGH |
| Many articles fall back to generic OG (no source image) | MEDIUM |
| ImageObject schema on articles (dimensions included) | ✅ |
| No VideoObject on Telegram video embeds | LOW |

---

## Section 8: SXO — Page-Type & Intent Analysis

### Critical Page-Type Mismatches

| Keyword | Volume | Issue | Fix |
|---------|--------|-------|-----|
| نرخ دلار امروز | 30K–80K | Multi-asset page can't rank for single-asset query | Build `/prices/dollar` |
| قیمت طلا امروز | 20K–50K | Same | Build `/prices/gold` |
| جام جهانی ۲۰۲۶ | 50K–100K | No page — tournament happening NOW | Write guide urgently |
| نتایج زنده فوتبال | 20K–60K | No SSR content; no SportsEvent schema | SSR shell + schema |

### World Cup 2026 — Time-Sensitive Opportunity

The FIFA World Cup 2026 is underway (June–July 2026). palsiran.com has a unique angle — live scores + news from 45+ sources — that no Persian competitor has. A World Cup 2026 guide should be written this week, not in October (current content calendar timing).

---

## Confirmed Correct Items (Previously Flagged as Issues)

| Item | Status |
|------|--------|
| `/tag/[slug]` pages | ✅ Built — CollectionPage + BreadcrumbList + ItemList schema |
| `/livescore` in sitemap.ts | ✅ Present — line 73 |
| Node.js 24 GitHub Actions | ✅ Deployed June 8, 2026 |
| `speakable` schema on articles | ✅ Done |
| YouTube in organization `sameAs` | ✅ Done |

---

*Generated: June 8, 2026 | Agents: seo-technical, seo-schema, seo-content, seo-geo, seo-sxo*
