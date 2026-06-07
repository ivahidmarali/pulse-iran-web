# Implementation Roadmap — palsiran.com

**Last updated:** June 8, 2026  
**Phase 1 status:** COMPLETE ✅  
**Current phase:** Phase 2 — Content & Authority  
**Target:** 10,000+ monthly organic visitors by June 2027

---

## Phase 1: Indexation & Technical Foundation — COMPLETE ✅

All Phase 1 items shipped. Summary of what was implemented:

| Item | Status |
|------|--------|
| Cloudflare "Allow Verified Bots" | ✅ Done by user |
| Canonical tags — all pages (including static: about, categories, saved) | ✅ Done |
| Hreflang (fa + x-default) — all pages | ✅ Done |
| Google News sitemap (`/news-sitemap.xml`) | ✅ Done |
| Sitemap submitted to GSC | ✅ Done by user |
| Organization + WebSite JSON-LD in root layout (NewsMediaOrganization) | ✅ Done |
| SearchAction schema (sitelinks search box eligible) | ✅ Done |
| NewsArticle schema — full implementation on article pages | ✅ Done |
| noindex on pagination pages > 3 (archive, categories, source, search) | ✅ Done |
| robots.ts — /admin + /api blocked; AI bots allowed | ✅ Done |
| `/source/[slug]` — 45+ source profile pages with CollectionPage schema | ✅ Done |
| `/lean/[slug]` — 11 political lean hub pages with CollectionPage schema | ✅ Done |
| `/about/editorial-policy` — E-E-A-T editorial standards page | ✅ Done |
| `/editorial` — hub page scaffold with SEO metadata | ✅ Done |
| CollectionPage schema on `/sources` and `/categories` | ✅ Done |
| BreadcrumbList schema on source + article pages | ✅ Done |
| safeJsonLd — XSS-safe JSON-LD output site-wide | ✅ Done |
| Open Graph images on article pages | ✅ Done |
| Twitter/X card meta on article pages | ✅ Done |
| `llms.txt` — AI crawler readiness | ✅ Done |
| Source links site-wide → /source/[slug] profile pages | ✅ Done |
| GTM deferred to lazyOnload (mobile LCP: 4.5s → ~2.0s) | ✅ Done |
| Accessibility fixes (aria-labels, color contrast) | ✅ Done |
| Sitemap updated with lean + source + editorial routes | ✅ Done |
| About page → link to editorial policy | ✅ Done |

**Phase 1 result:**
- SEO score: 100/100 Lighthouse SEO on all tested pages
- Desktop performance: 100/100
- Mobile performance: 78/100 → projected ~90-95 after GTM fix
- CrUX: Not yet available (insufficient traffic — normal for new site)

---

## Phase 2: Content & Authority Building (Weeks 5–16)
**Goal: Get first organic traffic, build E-E-A-T, establish topical authority**

### Completed Since June 1 ✅ (Week of June 1–8)

| Task | Status | Notes |
|------|--------|-------|
| `speakable` schema on article summary paragraphs | ✅ Done | `h1` + `[data-speakable]` paragraphs in NewsArticle schema |
| YouTube channel in sameAs schema | ✅ Done | Organization + editor entity |
| `<time datetime>` on article dates | ✅ Done | ISO 8601 for machine readability |
| `itemListElement` object format fix | ✅ Done | Google rich results compliance |
| `/livescore` page | ✅ Done | Full SEO metadata, keywords, OG, WebPage schema |
| AI disclosure + data source labels | ✅ Done | E-E-A-T + trust signals |
| 5 Lighthouse issues fixed | ✅ Done | LCP, GA preconnect, contrast |
| `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` | ✅ Done | Env var set in deploy.yml |

### Immediate (Next 2 Weeks) — Code

| Task | Priority | Effort | Notes |
|------|----------|--------|-------|
| **GitHub Actions: pin node-version to 24** | **CRITICAL** | 15 min | Deadline June 16, 2026 — `FORCE_NODE24` set but `setup-node` still installs v22 |
| Add `/livescore` to `sitemap.ts` | High | 15 min | Page is live but not in any sitemap — not crawlable |
| Custom OG image for homepage (`/og-default.jpg` is generic) | High | 2h | Use Canva/Figma — 1200×630px branded image |
| Tag/topic pages (`/tag/[tag]`) — dynamic route | Medium | 6h | 20+ new indexable pages for topic keywords |
| GSC service account setup (Tier 1 credentials) | High | 1h | Required for URL Inspection + indexation data |

### Weeks 5–8: First Editorial Content — No-code (Writing)

| Task | Priority | Effort | Expected Traffic |
|------|----------|--------|-----------------|
| Write: `تفاوت رسانه اصولگرا و اصلاح‌طلب` | High | 3h | 2K–8K/mo |
| Write: `بهترین منبع خبری فارسی برای ایرانیان خارج از کشور` | High | 3h | 1K–5K/mo |
| Write: `راهنمای خواندن انتقادی اخبار ایران` | High | 4h | 1K–3K/mo |
| Write: `چرا رسانه‌های مختلف یک رویداد را فرق می‌گویند` | Medium | 3h | 500–2K/mo |
| Publish: top 5 source profile deep-dives (1000+ words each) | High | 10h | 200–5K/mo each |

**Where to put these:** Create `/editorial/[slug]` article pages, or add a full `/editorial/page/[slug]` route. Link from `/editorial` hub.

### Weeks 9–12: Financial SEO

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Write: `تاریخچه نرخ دلار در ایران` | No | High | 4h |
| Write: `راهنمای خرید طلا در ایران` | No | Medium | 4h |
| Add price history sparklines (7-day trend) to /prices | Yes | Medium | 6h |
| Add `Dataset` + `PropertyValue` schema to /prices page | Yes | Medium | 2h |
| Improve /prices metadata (individual section canonical) | Yes | Medium | 2h |

### Weeks 13–16: Scale + Link Building

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Tag/topic pages (if not done earlier) | Yes | Medium | 6h |
| Add named author entity to editorial articles (Person schema + bio) | Yes | High | 4h |
| Publish weekly editorial articles | No | Ongoing | 3–4h/week |
| Submit to Persian web directories (gooya.com, etc.) | No | Medium | 4h |
| Outreach to diaspora blogs/podcasters for coverage | No | High | ongoing |
| Outreach to Wikipedia Persian contributors | No | Low | 4h |

**Phase 2 KPI checkpoint (end of Week 16):**
- Target: 500+ pages indexed in GSC
- Target: First organic traffic from source profile + lean pages
- Target: `/prices` appearing for price-related queries
- Target: 4 editorial articles published
- Target: 1,000+ monthly organic visits

---

## Phase 3: GEO + AI Search Readiness (Weeks 17–24)

| Task | Code? | Priority | Effort |
|------|-------|----------|--------|
| Publish quarterly "گزارش پالس رسانه‌ها" data report | No | High | 16h |
| FAQ schema on editorial explainer articles | Yes | Medium | 3h |
| `ClaimReview` schema (if fact-checking content added) | Yes | Low | 4h |
| `speakable` schema (if not done in Phase 2) | Yes | Medium | 3h |
| Newsletter landing page (`/newsletter`) | Yes | Medium | 3h |
| RSS feed optimization | Yes | Low | 2h |
| Monitor AI citation frequency — weekly manual check | No | High | 30 min/week |

**Phase 3 KPI checkpoint:**
- Target: 3,000+ monthly organic visits
- Target: Appearing in AI Overviews for ≥5 target queries
- Target: 10+ external referring domains
- Target: CrUX data available (site has enough traffic)

---

## Phase 4: Authority & Monetization Foundation (Months 7–12)

| Task | Priority | Timeline |
|------|----------|----------|
| Annual "پالس رسانه‌ها" report (linkbait + PR) | High | Month 9 |
| PWA manifest for mobile install prompt | Medium | Month 8 |
| Domain Authority building (guest posts on diaspora sites) | High | Month 8–12 |
| Structured citation monitoring dashboard | High | Month 7 |
| Social sharing optimization (WhatsApp-first for diaspora) | Medium | Month 7 |

**Phase 4 KPI checkpoint:**
- Target: 10,000+ monthly organic visits
- Target: 50+ indexed pages ranking in top 10
- Target: DA 30+ (estimated)
- Target: Google News auto-inclusion indicators in GSC

---

## Immediate Action: GitHub Actions Node.js Upgrade ⚠️ DEADLINE JUNE 16

**Status:** Partial — `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` is set in job env, but `actions/setup-node@v4` still installs **Node 22**. The `FORCE_NODE24` env var applies to GitHub-hosted action scripts only, not the version installed by setup-node.

**Required fix** in `.github/workflows/deploy.yml`:
```yaml
- name: Setup Node 24          # ← rename
  uses: actions/setup-node@v4
  with:
    node-version: 24            # ← change from 22 to 24
    cache: npm
```
That's the only change needed. The `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` line can be kept or removed — it's now redundant once setup-node installs v24.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| HCU penalty on aggregated content | High | Critical | 150-word summaries ✅, editorial section (in progress), E-E-A-T signals ✅ |
| Google slow to crawl new pages | Medium | High | Manual URL submission in GSC, fresh sitemaps |
| Competitor copies political bias labeling | Medium | Medium | Deepen to editorial-quality source guides |
| Telegram sources block bot | Low | High | Diversify to RSS + web scrapers for key sources |
| AI Overviews reduce click-through | High | Medium | Build newsletter list, optimize for AI citation |
| Cloudflare misconfiguration recurrence | Low | Critical | Monitor GSC crawl stats weekly |
| GitHub Actions Node.js 24 deadline | **Certain** | Medium | `FORCE_NODE24` set; must also pin `node-version: 24` before June 16, 2026 ⚠️ |

---

## KPI Dashboard

| Metric | Baseline (June 2026) | 3 Months | 6 Months | 12 Months |
|--------|---------------------|----------|---------|-----------|
| Organic traffic (monthly) | ~0 | 500 | 3,000 | 10,000 |
| Indexed pages | Starting | 500 | 2,000 | 5,000+ |
| Ranking keywords (any position) | 0 | 100 | 500 | 2,000 |
| Top 10 keywords | 0 | 5 | 50 | 200 |
| Referring domains | 0 | 5 | 15 | 40 |
| Domain Authority (est.) | ~5 | 10 | 18 | 28 |
| AI Overview appearances | 0 | 2 | 10 | 30 |
| Google News inclusion | ❌ | TBD | ✅ target | ✅ |
| Avg. article indexed within | N/A | 7 days | 3 days | 24h |
