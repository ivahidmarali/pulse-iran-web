# Implementation Roadmap — palsiran.com

**Date:** June 2026  
**Starting point:** Zero Google indexation (Cloudflare just fixed), SEO Health Score 41/100  
**Target:** 10,000+ monthly organic visitors by June 2027

---

## Phase 1: Indexation & Technical Foundation (Weeks 1–4)
**Goal: Get Google to index the site and establish crawl authority**

### Week 1 (Current — Complete ✅ / In Progress)

| Task | Status | Priority |
|------|--------|----------|
| Cloudflare "Allow Verified Bots" enabled | ✅ Done | Critical |
| Canonical tags on all pages | ✅ Done | Critical |
| Hreflang (fa + x-default) on all pages | ✅ Done | Critical |
| Google News sitemap (`/news-sitemap.xml`) | ✅ Done | Critical |
| CSP fixed (Telegram widget loads) | ✅ Done | High |
| Sitemap URL encoding consistency | ✅ Done | High |
| Sitemap submitted to GSC | ✅ Verified by user | Critical |

### Week 2

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Submit homepage + 10 key URLs for manual indexing via GSC URL Inspection | No | Critical | 30 min |
| Add `Organization` JSON-LD to root layout (WebSite + publisher entity) | **Yes** | High | 2h |
| Add `NewsArticle` schema to article pages (complete implementation) | **Yes** | High | 4h |
| Add `noindex` to `/archive?page=N` (N > 3) and `/categories?page=N` (N > 3) | **Yes** | Medium | 1h |
| Verify robots.txt blocks `/admin` and `/api` routes | **Yes** | High | 30 min |

### Week 3

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Build `/source/[slug]` dynamic route with source profile pages | **Yes** | High | 8h |
| Add `CollectionPage` schema to `/categories` and `/sources` | **Yes** | Medium | 2h |
| Add `WebSite` schema with `SearchAction` (sitelinks search box) | **Yes** | Medium | 2h |
| Set up Google Analytics 4 properly — verify events firing | No | High | 2h |
| Configure GSC property and link to GA4 | No | Medium | 30 min |

### Week 4

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Build 11 political lean pages (`/lean/[slug]`) | **Yes** | High | 6h |
| Add `CollectionPage` + `ItemList` schema to lean pages | **Yes** | Medium | 2h |
| Open Graph images for key pages (article + homepage og:image) | **Yes** | High | 4h |
| Twitter/X card meta tags on article pages | **Yes** | Medium | 1h |
| Create `/editorial` section route | **Yes** | Medium | 3h |

**Phase 1 KPI checkpoint:**
- Target: 100+ pages indexed in GSC
- Target: NewsArticle schema validated in Rich Results Test
- Target: No Critical errors in GSC Coverage report

---

## Phase 2: Content & Authority Building (Weeks 5–16)

### Weeks 5–8: Source Profiles + First Editorial Content

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Write + publish 10 source profile pages (top sources) | No | High | 10h |
| Publish 4 editorial articles (political lean explainers) | No | High | 8h |
| Add author/publisher entity to editorial articles | **Yes** | High | 3h |
| Add editorial policy page (`/about/editorial-policy`) | No | High | 2h |
| Link from article pages to source profile pages | **Yes** | Medium | 2h |
| Add "آخرین اخبار از [source]" section to each source profile | **Yes** | Medium | 4h |

### Weeks 9–12: Financial Data SEO

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Improve `/prices` page metadata (keyword-rich titles per section) | **Yes** | High | 2h |
| Add price history sparklines (7-day trend per item) | **Yes** | Medium | 6h |
| Add `Dataset` + `PropertyValue` schema to prices (already partial) | **Yes** | Medium | 2h |
| Write "تاریخچه نرخ دلار" editorial page | No | High | 4h |
| Write "راهنمای سرمایه‌گذاری طلا" editorial page | No | Medium | 4h |
| Internal link prices page from homepage widget | **Yes** | Medium | 1h |

### Weeks 13–16: Scale Source Profiles

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Complete remaining 35 source profiles | No | Medium | 35h |
| Add tag/topic pages for top 20 tags | **Yes** | Medium | 8h |
| Build sitemap-sources.xml (source profile pages) | **Yes** | Medium | 2h |
| Publish weekly editorial articles | No | Ongoing | 4h/week |

**Phase 2 KPI checkpoint:**
- Target: 500+ pages indexed
- Target: First organic traffic from source profile pages
- Target: `/prices` page appearing for price-related queries
- Target: 1,000+ monthly organic visits

---

## Phase 3: GEO + AI Search Readiness (Weeks 17–24)

### Weeks 17–20: AI Search Optimization

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Create `/llms.txt` file with site description and content scope | **Yes** | High | 1h |
| Add `speakable` schema to key article passages | **Yes** | Medium | 4h |
| Ensure article summaries are quotable 1–3 sentence answers | Bot | High | ongoing |
| Add FAQ schema to editorial explainer pages | **Yes** | Medium | 3h |
| Add `ClaimReview` schema to fact-check context (if applicable) | **Yes** | Low | 4h |

### Weeks 21–24: Link Building + PR

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Publish quarterly data report ("گزارش فصلی پالس") | No | High | 16h |
| Outreach to diaspora blogs/podcasts for coverage | No | High | ongoing |
| Submit site to Persian web directories (gooya.com, etc.) | No | Medium | 4h |
| Reach out to Wikipedia Persian contributors for citation | No | Low | 4h |
| Create shareable social graphics for price data | No | Medium | 4h |

**Phase 3 KPI checkpoint:**
- Target: 3,000+ monthly organic visits
- Target: Appearing in AI Overviews for at least 5 target queries
- Target: 10+ external referring domains

---

## Phase 4: Authority & Monetization Foundation (Months 7–12)

| Task | Priority | Timeline |
|------|----------|----------|
| Annual "پالس رسانه‌ها" report (linkbait + PR) | High | Month 9 |
| PWA / app manifest for mobile install prompt | Medium | Month 8 |
| Newsletter integration (`/newsletter`) | Medium | Month 7 |
| RSS feed optimization for readers | Low | Month 7 |
| Structured citation monitoring (track AI citations) | High | Month 7 |
| Domain Authority building (guest posts on diaspora sites) | High | Month 8–12 |

**Phase 4 KPI checkpoint:**
- Target: 10,000+ monthly organic visits
- Target: 50+ indexed pages ranking in top 10
- Target: DA 30+ (estimated)
- Target: Google News auto-inclusion indicators visible in GSC

---

## KPI Dashboard

| Metric | Baseline (June 2026) | 3 Months | 6 Months | 12 Months |
|--------|---------------------|----------|---------|-----------|
| Organic traffic (monthly) | ~0 | 500 | 3,000 | 10,000 |
| Indexed pages | ~0 | 500 | 2,000 | 5,000+ |
| Ranking keywords (any position) | 0 | 100 | 500 | 2,000 |
| Top 10 keywords | 0 | 5 | 50 | 200 |
| Referring domains | 0 | 5 | 15 | 40 |
| Domain Authority (est.) | ~5 | 10 | 18 | 28 |
| AI Overview appearances | 0 | 2 | 10 | 30 |
| Google News inclusion | ❌ | TBD | ✅ target | ✅ |
| Avg. article indexed within | N/A | 7 days | 3 days | 24h |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| HCU penalty on aggregated content | High | Critical | 150-word summaries, editorial section, E-E-A-T signals |
| Google slow to re-crawl after Cloudflare fix | Medium | High | Manual URL submission in GSC, fresh XML sitemaps |
| Competitor copies political bias labeling | Medium | Medium | Deepen to editorial-quality source guides |
| Telegram sources go quiet / block bot | Low | High | Diversify to RSS + web scrapers for key sources |
| AI Overviews reduce click-through | High | Medium | Build newsletter list, optimize for AI citation rather than fighting it |
| Cloudflare misconfiguration recurrence | Low | Critical | Monitor GSC crawl stats weekly |

---

## Code Implementation Priority Stack

Listed by SEO impact / effort ratio (highest first):

1. **`Organization` JSON-LD in layout** — foundational for all other schema
2. **`NewsArticle` schema completion** — required for Google News
3. **`/source/[slug]` pages** — 45 new indexable pages, branded keyword capture
4. **`/lean/[slug]` pages** — unique keyword territory, 11 new pages
5. **Open Graph images** — critical for social sharing (diaspora shares on WhatsApp/Twitter)
6. **`/llms.txt`** — 1 hour, AI search ready
7. **Pagination noindex** — prevents thin content crawl waste
8. **Tag pages** — topical depth at scale
9. **Price history data** — long-tail financial keywords
10. **`speakable` schema** — AI Overviews/Google Assistant
