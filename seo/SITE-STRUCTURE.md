# Site Structure & URL Architecture — palsiran.com

**Date:** June 2026

---

## Current Structure (Implemented)

```
/                          → Homepage (breaking news + bento layout)
/article/[id]/[[slug]]     → Article detail
/categories                → Category browser (filter: cat/group/source)
/prices                    → Live exchange rates + gold prices
/archive                   → Date/source filtered archive
/sources                   → Source directory with political lean
/search                    → Full-text search
/saved                     → Client-side saved articles (noindex)
/about                     → About page
/privacy                   → Privacy policy
/terms                     → Terms of use
/admin                     → Admin panel (noindex)
/sitemap.xml               → Standard sitemap
/news-sitemap.xml          → Google News sitemap
```

---

## Recommended Structure Additions (Priority Order)

### Priority 1 — Source Authority Pages (High SEO value)
These pages transform the existing `/sources` directory into indexable, rankable topic hubs.

```
/source/[slug]             → Individual source profile page
```

**Example URLs:**
- `/source/bbc-persian` → BBC فارسی — profile, political lean, credibility, recent articles
- `/source/irna` → ایرنا — description, political lean (رسمی دولتی), article feed
- `/source/iran-international` → ایران اینترناشنال — profile + article feed

**Each page should contain:**
- Source name, description, political lean badge
- Credibility score visualization
- When source was added / how many articles published
- Paginated article feed from this source
- `CollectionPage` + `Organization` schema
- Canonical: `/source/[slug]`

**Target keywords:** `[source name]` + `اخبار` (e.g., "اخبار بی‌بی‌سی فارسی")

---

### Priority 2 — Political Lean Category Pages (Unique differentiator)

```
/lean/[slug]               → Articles grouped by political lean
```

**Example URLs:**
- `/lean/osoulgarayan` → اخبار اصولگرایان
- `/lean/eslahat-talab` → اخبار اصلاح‌طلبان
- `/lean/mokhalf-jomhouri-eslami` → رسانه‌های مخالف
- `/lean/rasmi-dolati` → رسانه‌های رسمی دولتی

**Target keywords:** `رسانه‌های اصولگرا`, `اخبار اصلاح‌طلبان`, `رسانه مخالف ایران`

These pages are **completely uncovered by competitors** and map directly to what makes palsiran.com unique.

---

### Priority 3 — Topic/Tag Pages

```
/tag/[slug]                → Articles grouped by tag/keyword
```

**Example URLs:**
- `/tag/barjam` → اخبار برجام
- `/tag/dollar` → اخبار دلار
- `/tag/entekhabat` → اخبار انتخابات

**Rules:**
- Only generate a tag page when 10+ articles exist for that tag
- Use `CollectionPage` + `ItemList` schema
- Canonical: self (not noindex)
- These should be auto-generated from article tagging in the bot pipeline

---

### Priority 4 — Editorial Content Section

```
/editorial/                → Editorial hub (future)
/editorial/[slug]          → Individual analysis/explainer
```

**Examples:**
- `/editorial/rahnamaye-rasaneh-ha` → راهنمای منابع خبری ایران (evergreen)
- `/editorial/chetor-khabar-bekhanim` → چطور اخبار ایران را با دیده انتقادی بخوانیم

These are long-form evergreen pieces that build E-E-A-T and rank for navigational queries.

---

### Priority 5 — Enhanced Prices

```
/prices/dollar             → تاریخچه نرخ دلار (future)
/prices/gold               → تاریخچه قیمت طلا (future)
```

Price history pages can rank for `نرخ دلار سال ۱۴۰۴` type long-tail queries with historical charts.

---

## URL Design Rules

| Rule | Rationale |
|------|-----------|
| Use Persian-transliterated slugs, not Arabic numerals | Better readability in share links |
| Max 3 path segments | Keeps crawl depth shallow |
| Never use query params in canonical URLs for indexable pages | Avoid duplicate content |
| Categories page: canonical includes `?cat=` or `?group=` when filtered | Each filter = unique content |
| Article slug: `[item_id]/[persian-title-slug]` | Already implemented |

---

## Internal Linking Architecture

```
Homepage
  ├── → Breaking news articles (direct links in ticker)
  ├── → Category sections (political, economic, social)
  └── → /prices (live prices widget links)

/categories
  ├── → Individual articles
  ├── → Source profile pages (sidebar sources → /source/[slug])
  └── → Political lean pages (filter labels → /lean/[slug])

/sources
  └── → /source/[slug] (each source card links to profile)

Article pages
  ├── → Source profile (/source/[slug])
  ├── → Related articles (same source, same category)
  └── → /categories?source=X (all articles from this source)

/prices
  └── → /archive?date=today (news context for price moves)
```

---

## Sitemap Structure

```
/sitemap.xml (index)
  ├── /sitemap-static.xml     → Static pages (about, prices, sources, etc.)
  ├── /sitemap-articles.xml   → Latest articles (1000 most recent)
  ├── /sitemap-sources.xml    → Source profile pages (when built)
  └── /news-sitemap.xml       → Google News (last 48 hours)
```

**Implementation note:** Current `sitemap.ts` combines static + articles. Split into separate sitemaps when total article count exceeds 5,000 URLs.

---

## Crawl Budget Considerations

- `/saved` → `noindex` ✅ (already implemented)
- `/admin` → `noindex` + blocked in robots.txt
- `/archive?page=N` → `noindex` for pages > 3 (thin paginated content)
- `/categories?page=N` → `noindex` for pages > 3
- API routes (`/api/*`) → blocked in robots.txt
- `/news-sitemap.xml` → submitted to GSC + listed in robots.txt ✅
