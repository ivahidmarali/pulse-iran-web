# Site Structure & URL Architecture — palsiran.com

**Last updated:** June 8, 2026  
**Legend:** ✅ Live | 🔧 Scaffold | ❌ Not built

---

## Current URL Map

```
palsiran.com/
├── /                         ✅ Homepage (dynamic, ISR)
├── /article/[id]/[[...slug]] ✅ Article pages (NewsArticle schema)
├── /categories               ✅ Category browser (CollectionPage schema)
├── /sources                  ✅ Source directory (CollectionPage + ItemList schema)
├── /source/[slug]            ✅ Source profile pages ×45+ (CollectionPage schema)
├── /lean/[slug]              ✅ Political lean hub pages ×11 (CollectionPage schema)
├── /prices                   ✅ Live financial data (prices schema partial)
├── /livescore                ✅ Live football scores (WebPage schema, keywords, OG)
├── /archive                  ✅ Date-based archive browser
├── /search                   ✅ Search (noindex)
├── /saved                    ✅ Saved articles (noindex, client-side)
├── /about                    ✅ About page (WebPage schema)
│   └── /about/editorial-policy ✅ Editorial standards (WebPage + Breadcrumb schema)
├── /editorial                🔧 Editorial hub (CollectionPage — scaffold, no articles yet)
├── /editorial/[slug]         ❌ Individual editorial articles (not yet built)
├── /tag/[tag]                ❌ Tag/topic pages (not yet built)
├── /admin                    ✅ Admin panel (noindex, disallowed in robots)
├── /sitemap.xml              ✅ Main sitemap (static + lean + source + article routes)
├── /news-sitemap.xml         ✅ Google News sitemap (last 48h articles)
├── /robots.txt               ✅ /admin + /api blocked; AI bots allowed
└── /llms.txt                 ✅ AI crawler content guide
```

---

## Schema Coverage

| URL Pattern | Schema Types | Status |
|-------------|-------------|--------|
| All pages (root layout) | WebSite, SearchAction, NewsMediaOrganization | ✅ |
| `/article/[id]` | NewsArticle, BreadcrumbList | ✅ |
| `/source/[slug]` | CollectionPage, BreadcrumbList | ✅ |
| `/lean/[slug]` | CollectionPage, BreadcrumbList | ✅ |
| `/sources` | CollectionPage, ItemList | ✅ |
| `/categories` | CollectionPage | ✅ |
| `/about/editorial-policy` | WebPage, BreadcrumbList | ✅ |
| `/editorial` | CollectionPage, BreadcrumbList | ✅ |
| `/editorial/[slug]` | NewsArticle (with author) | ❌ needs building |
| `/prices` | Dataset, PropertyValue | ⚠️ partial |
| `/livescore` | WebPage | ✅ (SportsEvent schema — pending) |
| `/tag/[tag]` | CollectionPage, ItemList | ❌ needs building |

---

## Internal Linking Structure

```
Homepage
  ├── → /categories (nav)
  ├── → /prices (nav)
  ├── → /sources (nav)
  ├── → /source/[slug] (per article source link ✅)
  └── → /article/[id] (article cards)

Article page
  ├── → /source/[slug] (source name ✅)
  ├── → /categories?cat=[cat] (category badge)
  └── → /about/editorial-policy (footer ✅)

/sources
  └── → /source/[slug] (all source cards ✅)

/categories sidebar
  └── → /source/[slug] (source filter links ✅)

/source/[slug]
  ├── → /sources (breadcrumb ✅)
  └── → /article/[id] (article list ✅)

/lean/[slug]
  ├── → /sources (breadcrumb ✅)
  ├── → /source/[slug] (source cards ✅)
  └── → other /lean/[slug] (cross-links ✅)

/about
  ├── → /about/editorial-policy ✅
  └── → /sources (source list ✅)

/editorial (scaffold)
  └── → /about/editorial-policy ✅
```

---

## Pages Needed (Next Priority Order)

### 1. `/editorial/[slug]` — Individual Editorial Articles
**Why:** Tier 2 content requires a route. The `/editorial` hub exists as a scaffold.  
**Schema:** `NewsArticle` with `Organization` author, `datePublished`, `dateModified`, `BreadcrumbList`  
**Effort:** 4–6h (dynamic route + MDX or DB-backed content)

### 2. `/tag/[tag]` — Tag/Topic Hub Pages
**Why:** 20+ new indexable pages for topical keywords (`اخبار سیاسی`, `اقتصادی`, etc.)  
**Schema:** `CollectionPage`, `ItemList`, `BreadcrumbList`  
**Effort:** 4–6h (already have category data in DB)

### 3. `/prices/[currency]` — Individual Price History Pages
**Why:** Long-tail financial keywords (`تاریخچه نرخ یورو`, `نمودار قیمت طلا`)  
**Schema:** `Dataset`, `PropertyValue`  
**Effort:** 6–8h

### 4. `/corrections` — Correction Policy Page
**Why:** E-E-A-T signal for publisher credibility (referenced in editorial policy but no dedicated page)  
**Effort:** 1h (static page)

### 5. `/livescore` — SportsEvent Schema Enhancement
**Why:** Page is live and has basic WebPage schema + keywords; adding `SportsEvent` or `SportsOrganization` schema could unlock rich results for match queries.  
**Schema:** `SportsEvent` per match (dynamically injected client-side or via SSR)  
**Effort:** 4–6h  
**Also needed:** Add `/livescore` to `sitemap.ts` (currently absent — not in any sitemap).

### 6. `/livescore/[league]` — Per-League Landing Pages (Future)
**Why:** Long-tail livescore keywords (`نتایج لیگ برتر ایران`, `نتایج لیگ قهرمانان آسیا`)  
**Effort:** 4h (static routes backed by livescore API filter)

---

## URL Conventions

- All URLs: lowercase, hyphenated, Persian/English mix OK
- Source slugs: `generateSlug(name)` — strips ZWNJ, replaces spaces with hyphens, caps at 60 chars
- Lean slugs: 11 hardcoded Latin slugs (see `/app/lean/[slug]/page.tsx`)
- Article URLs: `/article/[id]/[persian-title-slug]` — ID is canonical, slug is cosmetic
- Editorial URLs: `/editorial/[persian-title-slug]`
- No trailing slashes enforced by Next.js default

---

## Canonical Strategy

| Scenario | Canonical |
|---------|-----------|
| Article page (with slug) | `/article/[id]/[slug]` (the full URL) |
| Article page (without slug, redirect) | Redirects to version with slug |
| Categories with query params | `/categories?cat=X` (params included) |
| Search page | `/search` (noindex anyway) |
| Source profile page 1 | `/source/[slug]` |
| Source profile page N>1 | `/source/[slug]?page=N` (noindex if N>3) |
| Lean page | `/lean/[slug]` |
| All static pages | Self-referencing canonical set explicitly |
