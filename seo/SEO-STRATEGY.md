# SEO Strategy — پالس ایران (palsiran.com)

**Last updated:** June 1, 2026  
**Business type:** Persian-language news aggregator (Publisher)  
**Target audience:** Iranian diaspora (Europe, North America) + Persian-speaking global users  
**Current SEO Health Score:** ~82/100 (up from 41/100 at start of June)  
**Target SEO Health Score:** 90/100 by December 2026

---

## Executive Summary

palsiran.com launched organic search presence in June 2026 after fixing a Cloudflare Bot Fight Mode block. In the first weeks, a full technical SEO overhaul was completed: canonical tags, hreflang, Google News sitemap, NewsArticle schema, 45+ source profile pages, 11 political lean hub pages, editorial policy, CollectionPage schema, pagination noindex, performance optimization (mobile LCP: 4.5s → projected ~2.0s), and AI crawler readiness via `llms.txt`.

The site now has a technically sound foundation. The next phase is **content authority** — editorial pieces that build E-E-A-T, source profiles with original commentary, and link acquisition from the diaspora community.

**Unique structural differentiator:** Transparent political bias labeling across 11 categories — no Persian-language competitor offers this. This is the primary keyword moat to defend and expand.

---

## 1. Business & Audience Analysis

### Primary Audience
- **Iranian diaspora** in Europe (Belgium, Sweden, Germany, Netherlands) and North America (USA, Canada)
- Age range: 25–45 (underserved by current competitors)
- Device: Mobile-first (60%+ mobile usage for diaspora news consumption)
- Language: Persian (Farsi) — Arabic script, RTL layout
- Search behavior: Mixes Persian keywords with Latin transliterations

### Secondary Audience
- Iranians inside Iran accessing via VPN (unpredictable, hard to serve via SEO)
- Persian-speaking Afghans and Tajiks (smaller but measurable segment)
- Journalists and researchers studying Persian media

### User Intent Map
| Intent | Search Pattern | Content Serving It |
|--------|---------------|-------------------|
| Breaking news | `اخبار امروز ایران` | Homepage + /categories |
| Source research | `[source name] + اخبار` | /source/[slug] — ✅ live |
| Financial data | `نرخ دلار امروز` | /prices page |
| Political analysis | `رسانه اصولگرا` | /lean/[slug] — ✅ live |
| Archive/historical | `اخبار [date] ایران` | /archive page |
| Topic browsing | `اخبار سیاسی ایران` | /categories page |
| Editorial explainers | `تفاوت رسانه‌های ایران` | /editorial — scaffold only |

---

## 2. Competitive Position

**Market gap owned:** No Persian news site combines (1) multi-source aggregation + (2) political bias labeling + (3) live financial data + (4) modern mobile UX. palsiran.com owns all four.

| Competitor | Strength | Weakness | Our Edge |
|-----------|----------|----------|---------|
| khabarfarsi.com | Aggregator reach | No bias labels, dated UX | Bias transparency |
| gooya.com | Brand authority | 55–64 audience, no mobile | Young diaspora UX |
| khabarfoori.com | 77% organic traffic | Breaking-only focus | Depth + analysis |
| tabnak.com | Establishment credibility | Pro-establishment bias | Independence signal |

**Full analysis:** `COMPETITOR-ANALYSIS.md`

---

## 3. Keyword Strategy

### Pillar Keywords (High volume, long-term)
| Keyword | Monthly Volume (est.) | Current Rank | Target |
|---------|----------------------|--------------|--------|
| اخبار ایران | 50K–100K | Unranked | Top 20 by Q1 2027 |
| اخبار فوری | 20K–50K | Unranked | Top 30 by Q4 2026 |
| نرخ دلار امروز | 30K–80K | Unranked | Top 10 by Q4 2026 |
| قیمت طلا امروز | 20K–50K | Unranked | Top 10 by Q4 2026 |
| اخبار سیاسی ایران | 10K–30K | Unranked | Top 20 by Q1 2027 |

### Niche Keywords (Win now — low competition)
| Keyword | Est. Volume | Competition | Status |
|---------|-------------|-------------|--------|
| گرایش سیاسی رسانه‌های ایران | 500–2K | Very low | Pages live ✅ |
| منابع خبری معتبر فارسی | 1K–5K | Low | Pages live ✅ |
| رسانه‌های اصولگرا | 2K–8K | Low | /lean/osoulgarayan ✅ |
| رسانه‌های اصلاح‌طلب | 2K–8K | Low | /lean/eslah-talab ✅ |
| رسانه مخالف جمهوری اسلامی | 1K–5K | Low | /lean/mokhalef-jomhouri-eslami ✅ |
| [source name] + اخبار (×45) | 200–5K each | Low | /source/[slug] ✅ |
| نرخ سکه امروز | 10K–30K | Medium | /prices exists |
| نرخ یورو امروز | 5K–15K | Medium | /prices exists |

### Long-tail Keywords (Editorial content — not yet written)
- `تفاوت رسانه اصولگرا و اصلاح‌طلب`
- `بهترین منبع خبری فارسی برای ایرانیان خارج از کشور`
- `چطور اخبار ایران را با دیده انتقادی بخوانیم`
- `چرا رسانه‌های مختلف یک رویداد را فرق می‌گویند`
- `تاریخچه نرخ دلار در ایران`

---

## 4. Content Strategy

### The Two-Tier Approach

**Tier 1 — Automated (daily volume):** Aggregated news with 150+ word AI summaries. Satisfies freshness signals and builds crawl frequency. Quantity: 50–200 articles/day. ✅ Running.

**Tier 2 — Manual (weekly quality):** Editorial explainers, source profiles with commentary, and financial analysis. Builds E-E-A-T, ranks for non-time-sensitive queries. Quantity: 2–3 pieces/week. ❌ Not yet started.

### E-E-A-T Signal Status

| Signal | Status | Notes |
|--------|--------|-------|
| Editorial policy page | ✅ Live | /about/editorial-policy |
| Organization schema (NewsMediaOrganization) | ✅ Live | In root layout |
| NewsArticle schema on articles | ✅ Live | datePublished, dateModified, publisher |
| Author entity (named person) | ❌ Missing | Using "تیم پالس ایران" org author |
| Source transparency pages | ✅ Live | /source/[slug] — 45 pages |
| Correction policy | ✅ In editorial policy | Needs dedicated `/corrections` page eventually |
| About page linked to editorial policy | ✅ Done | |

### HCU Risk Assessment: MEDIUM (improving)

| Defense | Status |
|---------|--------|
| 150-word minimum summaries | ✅ Implemented in bot |
| Source attribution + direct links | ✅ On every article |
| Original editorial content | ❌ Not yet written |
| Source transparency pages | ✅ 45 pages live |
| Methodology transparency | ✅ Editorial policy live |
| Named authorship | ⚠️ Organizational only |

---

## 5. Technical SEO Status

### Completed ✅
- Canonical tags (self-referencing, all pages)
- Hreflang (fa + x-default, all pages)
- Google News sitemap (`/news-sitemap.xml`)
- robots.ts (admin + api blocked; AI bots allowed)
- Cloudflare bot bypass fixed
- Organization + WebSite JSON-LD (root layout)
- NewsArticle schema (article pages, full implementation)
- CollectionPage schema (sources, categories, lean, source profiles, editorial)
- BreadcrumbList schema (source profiles, article pages)
- SearchAction schema (sitelinks search box eligible)
- safeJsonLd (XSS-safe JSON-LD output)
- `/source/[slug]` — 45+ source profile pages
- `/lean/[slug]` — 11 political lean hub pages
- `/about/editorial-policy` — editorial standards page
- `/editorial` — hub page scaffold
- Pagination noindex (archive, categories, source profiles > page 3)
- Open Graph images (article pages: `item.image_url || og-default.jpg`)
- Twitter/X card meta tags (article pages)
- `llms.txt` (AI crawler readiness)
- GTM deferred to `lazyOnload` (mobile LCP fix: 4.5s → ~2.0s projected)
- Accessibility fixes (aria-labels, color contrast)
- Sitemap updated (lean + source + editorial-policy routes)

### Pending (Next 30 days)
- Custom OG image for homepage (not just og-default.jpg)
- `speakable` schema on article summary paragraphs
- Tag/topic pages (`/tag/[tag]`)
- Price history pages / sparklines
- FAQ schema on editorial explainer articles
- GSC service account (Tier 1 credentials for URL Inspection API)
- GitHub Actions Node.js 24 upgrade (deadline: June 16, 2026)

### Pending (Month 2–3)
- Named author entity with Person schema on editorial articles
- `ClaimReview` schema (if fact-checking added)
- PWA manifest
- RSS feed optimization

---

## 6. GEO (Generative Engine Optimization)

AI systems (Google AI Overviews, Perplexity, ChatGPT) are primary news discovery channels for the diaspora audience.

### Status
- `llms.txt` ✅ live with routes, source list, and content scope
- AI bots (OAI-SearchBot, PerplexityBot) ✅ explicitly allowed in robots.ts
- Structured JSON-LD ✅ on all pages — entities clearly defined
- First-party data ❌ — no quarterly reports yet

### AI Citation Strategy
1. **Structure content for extraction** — lead with key fact in first 2 sentences, use summary tables in explainers, update `dateModified` visible on page
2. **Source bias data** is uniquely citable — no other source has a structured 11-lean taxonomy for Persian media
3. **Quarterly "پالس رسانه‌ها" report** — original statistics AI systems will cite

---

## 7. Measurement Framework

### Setup Needed
- GSC service account → URL Inspection + real indexation data
- GA4 linked to GSC → organic traffic + landing pages
- Weekly manual check: query 5 target topics in Perplexity/ChatGPT for citation

### KPI Targets

| Metric | Baseline (June 2026) | 3 Months | 6 Months | 12 Months |
|--------|---------------------|----------|---------|-----------|
| Organic traffic (monthly) | ~0 | 500 | 3,000 | 10,000 |
| Indexed pages | Starting | 500 | 2,000 | 5,000+ |
| Ranking keywords | 0 | 100 | 500 | 2,000 |
| Top 10 keywords | 0 | 5 | 50 | 200 |
| Referring domains | 0 | 5 | 15 | 40 |
| AI Overview appearances | 0 | 2 | 10 | 30 |
| Google News inclusion | ❌ | TBD | ✅ target | ✅ |

---

## Supporting Documents

- `COMPETITOR-ANALYSIS.md` — Competitor breakdown and keyword gaps
- `SITE-STRUCTURE.md` — URL architecture and internal linking plan
- `CONTENT-CALENDAR.md` — Editorial content plan for Year 1
- `IMPLEMENTATION-ROADMAP.md` — Phased action plan with effort estimates
