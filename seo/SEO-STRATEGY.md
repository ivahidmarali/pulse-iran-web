# SEO Strategy — پالس ایران (palsiran.com)

**Date:** June 2026  
**Business type:** Persian-language news aggregator (Publisher)  
**Target audience:** Iranian diaspora (Europe, North America) + Persian-speaking global users  
**Current SEO Health Score:** 41/100  
**Target SEO Health Score:** 75/100 by December 2026

---

## Executive Summary

palsiran.com is a technically sound, mobile-first news aggregator with a **unique structural differentiator**: transparent political bias labeling across 11 categories — something no Persian-language competitor offers. The site was completely invisible to Google until June 2026 due to a Cloudflare Bot Fight Mode misconfiguration. With that now fixed, the site is starting from zero but with **no legacy technical debt** to clean up.

The SEO opportunity is clear: capture the 25–45 year old diaspora audience that competitors like gooya.com (55–64 year old audience) are aging out of, while owning the niche keyword territory of source transparency, political media analysis, and live financial data.

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

### User Intent Categories
| Intent | Search Pattern | Content to Serve |
|--------|---------------|-----------------|
| Breaking news | `اخبار امروز ایران` | Homepage + breaking news |
| Source research | `[source name] + اخبار` | Source profile pages |
| Financial data | `نرخ دلار امروز` | /prices page |
| Political analysis | `رسانه اصولگرا`, `رسانه اصلاح‌طلب` | Lean pages + editorial |
| Archive/historical | `اخبار [date] ایران` | /archive page |
| Topic browsing | `اخبار سیاسی ایران` | /categories page |

---

## 2. Competitive Position

**Market gap:** No Persian news site combines (1) multi-source aggregation + (2) political bias labeling + (3) live financial data + (4) modern mobile UX. palsiran.com owns all four.

**Key competitors:**
- `khabarfarsi.com` — aggregator, no bias labels, dated UX
- `gooya.com` — portal, aging audience (55–64), no mobile optimization
- `khabarfoori.com` — breaking news focus, 77% organic traffic, diaspora-heavy

**Full analysis:** See `COMPETITOR-ANALYSIS.md`

---

## 3. Keyword Strategy

### Pillar Keywords (High volume, competitive)
| Keyword | Monthly Volume (est.) | Current Rank | Target |
|---------|----------------------|--------------|--------|
| اخبار ایران | 50K–100K | Unranked | Top 20 |
| اخبار فوری | 20K–50K | Unranked | Top 30 |
| نرخ دلار امروز | 30K–80K | Unranked | Top 10 |
| قیمت طلا امروز | 20K–50K | Unranked | Top 10 |
| اخبار سیاسی ایران | 10K–30K | Unranked | Top 20 |

### Niche Keywords (Lower volume, low competition — WIN FIRST)
| Keyword | Est. Volume | Competition | Target |
|---------|-------------|-------------|--------|
| گرایش سیاسی رسانه‌های ایران | 500–2K | Very low | Top 3 |
| منابع خبری معتبر فارسی | 1K–5K | Low | Top 5 |
| رسانه‌های اصولگرا | 2K–8K | Low | Top 5 |
| رسانه‌های اصلاح‌طلب | 2K–8K | Low | Top 5 |
| رسانه مخالف جمهوری اسلامی | 1K–5K | Low | Top 5 |
| [source name] + اخبار (×45) | 200–5K each | Low | Top 3 each |
| نرخ سکه امروز | 10K–30K | Medium | Top 10 |
| نرخ یورو امروز | 5K–15K | Medium | Top 10 |

### Long-tail Keywords (Editorial content)
- `چطور اخبار ایران را با دیده انتقادی بخوانیم`
- `تفاوت رسانه اصولگرا و اصلاح‌طلب`
- `بهترین منبع خبری فارسی برای ایرانیان خارج از کشور`
- `چرا رسانه‌های مختلف یک رویداد را فرق می‌گویند`

---

## 4. Content Strategy

### The Two-Tier Approach

**Tier 1 — Automated (daily volume):** Aggregated news with 150+ word AI summaries. Satisfies Google's freshness signals and builds crawl frequency. Quantity: 50–200 articles/day.

**Tier 2 — Manual (weekly quality):** Editorial explainers + source profiles that build E-E-A-T and rank for non-time-sensitive queries. Quantity: 2–4 pieces/week.

### E-E-A-T Signal Building

palsiran.com has an E-E-A-T gap: it is "faceless" — no author names, no editorial team, no transparency about who runs it. For a news publisher, this is a significant ranking risk post-HCU.

**Required additions:**
1. **Editorial policy page** at `/about/editorial-policy`:
   - How sources are selected
   - How political lean is classified (the methodology)
   - How summaries are generated (AI-assisted, human reviewed)
   - Correction/update policy

2. **Publisher identity on About page:**
   - Organization name, founding date, mission
   - Contact information (already has email)
   - Physical presence (country of operation)

3. **Author/Editor entity** on editorial articles:
   - Even "تیم پالس ایران" with `Organization` schema is better than no author
   - Eventually: named editor with `Person` schema + bio page

4. **`Organization` JSON-LD** in root layout:
   ```json
   {
     "@type": "NewsMediaOrganization",
     "@id": "https://palsiran.com/#organization",
     "name": "پالس ایران",
     "alternateName": "Pals Iran",
     "url": "https://palsiran.com",
     "logo": "https://palsiran.com/logo.png",
     "foundingDate": "2024",
     "description": "سامانه تجمیع اخبار ایران از بیش از ۴۵ منبع خبری",
     "email": "info@palsiran.com",
     "publishingPrinciples": "https://palsiran.com/about/editorial-policy",
     "sameAs": ["https://t.me/palsiran", "https://x.com/palsiran_news"]
   }
   ```

### HCU Risk Management

palsiran.com aggregates content from 45+ sources. Google's HCU has targeted aggregators that add little value beyond collection. Our defenses:

1. ✅ **150-word minimum summaries** (already implemented)
2. ✅ **Source attribution + direct links** on every article
3. ❌ **Original editorial content** (must build — see Content Calendar)
4. ❌ **Source transparency pages** (must build — source profiles)
5. ❌ **Methodology transparency** (must build — editorial policy)
6. ❌ **Named authorship** (must add — even organizational authorship)

---

## 5. Technical SEO Priorities

### Completed ✅
- Canonical tags (self-referencing on all pages)
- Hreflang (fa + x-default)
- Google News sitemap (`/news-sitemap.xml`)
- CSP for Telegram widget
- Cloudflare bot bypass fixed
- sitemap.xml deduplication

### Immediate (Week 2–4)
- `Organization` + `NewsArticle` schema (full implementation)
- `/llms.txt` for AI crawler readiness
- Pagination noindex (pages > 3)
- `/source/[slug]` pages (45 new indexed pages)
- Open Graph images (article pages)

### Medium-term (Month 2–3)
- Tag/topic pages with `CollectionPage` schema
- Price history pages
- Sitemap split (static / articles / sources)
- `speakable` schema on key article passages

### Long-term (Month 4+)
- `ClaimReview` schema for fact-checked content
- PWA manifest (mobile install)
- AMP consideration (deferred — no longer required for Top Stories)

**Full technical details:** See `IMPLEMENTATION-ROADMAP.md`

---

## 6. GEO (Generative Engine Optimization)

AI systems (Google AI Overviews, Perplexity, ChatGPT) are becoming primary news discovery channels, especially for the diaspora audience that trusts AI-generated summaries.

### AI Citation Strategy

1. **Structure content for extraction:**
   - Lead with the key fact/answer in the first 2 sentences
   - Use definition-style openings: "X is a Y that..."
   - Include summary tables in explainer articles
   - Update content with `dateModified` visible on page

2. **llms.txt implementation:**
   ```
   # پالس ایران
   > سامانه تجمیع اخبار ایران از بیش از ۴۵ منبع خبری با گرایش‌های سیاسی مختلف
   
   ## درباره
   پالس ایران اخبار سیاسی، اقتصادی و اجتماعی ایران را از منابع رسمی دولتی، 
   اصولگرا، اصلاح‌طلب، و مستقل جمع‌آوری می‌کند.
   
   ## منابع اصلی
   - /sources : فهرست کامل منابع با گرایش سیاسی
   - /prices : نرخ زنده ارز و طلا
   - /about : درباره پالس ایران و روش‌شناسی
   ```

3. **First-party data reports** — quarterly data journalism pieces are highly citable by AI systems because they contain unique statistics no other source has.

4. **Named entities in content** — every article page should have properly tagged source, political lean, category, and date so AI systems can extract structured facts.

---

## 7. Local/Diaspora SEO Considerations

The target audience is geographically dispersed (not local SEO), but some diaspora-specific tactics apply:

- **Belgium + Sweden + Germany + USA + Canada** are the top 5 geographic markets
- No Google Business Profile needed (not a local business)
- **hreflang `fa` is sufficient** — no need for country-specific variants (fa-IR, fa-US etc.) since the content is language-specific, not region-specific
- **Server location:** Frankfurt is good for European diaspora (primary market)

---

## 8. Link Building Strategy

### Tier 1: Directory Listings (Easy wins, immediate)
- Submit to gooya.com Persian site directory
- Submit to Iranian diaspora organization websites
- Submit to Wikipedia Persian links (where relevant as a source)

### Tier 2: Content-Driven Links
- Quarterly data reports → outreach to diaspora journalists + bloggers
- "Political lean methodology" piece → outreach to media studies academics
- Source profiles → many sources may link back to their own profiles

### Tier 3: PR + Community
- Outreach to Iranian podcast hosts (prominent diaspora podcasters)
- Twitter/X outreach to Iranian journalists citing palsiran.com data
- Telegram channel — already running at `@palsiran` — should consistently share editorial content

### Tier 4: Guest Content
- Write for Persian-language diaspora publications about media literacy
- Each published piece links back to palsiran.com

---

## 9. Measurement Framework

### Weekly Monitoring (GSC)
- Pages indexed (target: +10% week over week initially)
- Crawl errors (should be zero after Cloudflare fix)
- Top impressions and clicks

### Monthly Monitoring
- Organic sessions (GA4)
- Keyword rankings for top 50 target keywords
- New referring domains
- Core Web Vitals (CrUX data)
- AI citation frequency (manual check: query 10 target topics in Perplexity/ChatGPT)

### Quarterly Review
- Full SEO audit vs. this strategy
- Competitor ranking comparison
- Content performance (which editorial pieces drove traffic)
- Adjust content calendar based on what's ranking

---

## 10. Success Milestones

| Milestone | Target Date | KPI |
|-----------|-------------|-----|
| First 100 pages indexed | July 2026 | GSC Coverage |
| First organic click | July 2026 | GSC Performance |
| `/prices` in top 10 for `نرخ دلار امروز` | September 2026 | GSC |
| Source profile pages indexed (all 45) | September 2026 | GSC Coverage |
| 1,000 monthly organic visits | October 2026 | GA4 |
| First Google AI Overview mention | October 2026 | Manual check |
| 3,000 monthly organic visits | December 2026 | GA4 |
| Google News auto-inclusion signals | December 2026 | GSC Search Type filter |
| 10,000 monthly organic visits | June 2027 | GA4 |

---

## Supporting Documents

- `COMPETITOR-ANALYSIS.md` — Full competitor breakdown and keyword gaps
- `SITE-STRUCTURE.md` — URL architecture and internal linking plan
- `CONTENT-CALENDAR.md` — Editorial content plan for Year 1
- `IMPLEMENTATION-ROADMAP.md` — Phased technical + content action plan with effort estimates
