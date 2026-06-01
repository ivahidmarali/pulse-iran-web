import type { Metadata } from "next";
import Link from "next/link";
import CategoryTabs from "@/components/layout/CategoryTabs";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import NewsCard from "@/components/news/NewsCard";
import LoadMoreFeed from "@/components/news/LoadMoreFeed";
import CurrencyRow from "@/components/prices/CurrencyRow";
import { getNews, getPrices, getBreakingNews, getCategories } from "@/lib/api";
import { getCategoryFilter, CATEGORY_GROUPS } from "@/lib/categories";
import { NewsItem, PriceItem } from "@/lib/types";
import { articleHref, articleUrl, toPersianNum, SITE_URL, safeJsonLd } from "@/lib/utils";

export const revalidate = 120; // regenerate every 2 min for dynamic date + fresh schema

function getPersianDate(): string {
  return new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export async function generateMetadata(): Promise<Metadata> {
  const today = getPersianDate();
  return {
    title: `اخبار ایران امروز — ${today} | پالس ایران`,
    description: `آخرین اخبار روز ایران و جهان در ${today}. پوشش زنده سیاست، اقتصاد، بین‌الملل، ارز و بورس — بی‌طرف از ۴۵+ منبع.`,
    openGraph: {
      title: `اخبار ایران امروز — ${today} | پالس ایران`,
      description: `آخرین اخبار روز ایران و جهان در ${today}. پوشش زنده بی‌طرف از ۴۵+ منبع خبری.`,
    },
    twitter: {
      title: `اخبار ایران امروز — ${today} | پالس ایران`,
      description: `آخرین اخبار روز ایران و جهان در ${today}`,
    },
  };
}

const PAGE_SIZE = 33;

async function fetchData(categories?: string[], page = 1) {
  try {
    const [newsData, prices, breaking, cats] = await Promise.all([
      getNews(page, PAGE_SIZE, categories?.length ? categories : undefined),
      getPrices(),
      getBreakingNews(),
      getCategories(),
    ]);
    // Derive which CATEGORY_GROUPS have at least one article
    const catNames = new Set(cats.map((c) => c.name));
    const activeGroups = Object.entries(CATEGORY_GROUPS)
      .filter(([, g]) => g.categories.some((c) => catNames.has(c)))
      .map(([name]) => name);
    return {
      news: newsData.items.filter((item) => item.title && item.title.trim().length > 5),
      prices,
      breaking,
      activeGroups,
      page: newsData.page,
      pages: newsData.pages ?? 1,
    };
  } catch {
    return { news: [] as NewsItem[], prices: [] as PriceItem[], breaking: [] as NewsItem[], activeGroups: [] as string[], page: 1, pages: 1 };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; group?: string; page?: string }>;
}) {
  const { cat, group, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const categories = getCategoryFilter(cat, group);
  const { news, prices, breaking, activeGroups, page, pages } = await fetchData(categories, currentPage);

  function pageUrl(p: number) {
    const q = new URLSearchParams();
    if (cat) q.set("cat", cat);
    if (group) q.set("group", group);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/?${qs}` : "/";
  }
  const hero = news.find((a) => a.image_url && a.image_url.trim() !== "") ?? news[0];
  const rest = news.filter((a) => a.item_id !== hero?.item_id);
  const priceMap = Object.fromEntries(prices.map((p) => [p.key, p]));
  const HOME_PRICE_KEYS = ["price_dollar_rl", "price_eur", "geram18", "sekeb"];
  const currencyPrices = HOME_PRICE_KEYS.map((k) => priceMap[k]).filter(Boolean);
  const CURRENCY_KEYS = ["price_dollar_rl", "price_eur", "price_gbp"];
  const widgetPrices = CURRENCY_KEYS.map((k) => priceMap[k]).filter(Boolean);

  const today = getPersianDate();
  const nowIso = new Date().toISOString();

  // LiveBlogPosting schema — signals to Google this is a live breaking-news feed
  const liveBlogJsonLd = breaking.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    "@id": `${SITE_URL}/#liveblog`,
    headline: `اخبار فوری ایران امروز — ${today}`,
    name: "پالس ایران — اخبار لحظه به لحظه",
    url: SITE_URL,
    datePublished: new Date(breaking[breaking.length - 1]?.posted_at ?? nowIso).toISOString(),
    dateModified: new Date(breaking[0]?.posted_at ?? nowIso).toISOString(),
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
    coverageStartTime: new Date(breaking[breaking.length - 1]?.posted_at ?? nowIso).toISOString(),
    coverageEndTime: nowIso,
    liveBlogUpdate: breaking.slice(0, 5).map((item) => ({
      "@type": "BlogPosting",
      "@id": articleUrl(item.item_id, item.title),
      headline: item.title,
      url: articleUrl(item.item_id, item.title),
      datePublished: new Date(item.posted_at).toISOString(),
      author: { "@id": `${SITE_URL}/#organization` },
    })),
  } : null;

  // ItemList schema — structured list of top articles for AI/Google indexing
  const itemListJsonLd = news.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `آخرین اخبار ایران — ${today}`,
    url: SITE_URL,
    numberOfItems: Math.min(news.length, 10),
    itemListElement: news.slice(0, 10).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: articleUrl(item.item_id, item.title),
      name: item.title,
    })),
  } : null;

  return (
    <div className="cyber-grid" dir="rtl">
      {/* Structured data — LiveBlogPosting + ItemList */}
      {liveBlogJsonLd && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(liveBlogJsonLd) }} />
      )}
      {itemListJsonLd && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }} />
      )}

      {/* ── Mobile ── */}
      <div className="md:hidden">
        {/* Sticky category tabs */}
        <div className="sticky top-[104px] z-30 bg-background border-b border-white/5 px-container-margin py-2">
          <div className="relative">
            <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/" visibleGroups={activeGroups} />
            <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          </div>
        </div>

        <main className="pb-4 pt-3">
          {/* Page h1 — visible to crawlers, styled as section label */}
          <div className="px-container-margin mb-3">
            <h1 className="text-xs font-bold text-secondary-fixed-dim/70 tracking-widest">
              اخبار ایران امروز — {today}
            </h1>
          </div>

          {/* Hero */}
          {hero && (
            <div className="px-container-margin mb-4">
              <NewsCard item={hero} variant="hero" priority />
            </div>
          )}

          {/* Currency strip — horizontal scroll */}
          {currencyPrices.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between px-container-margin mb-2">
                <Link href="/prices" className="text-[11px] text-secondary-fixed-dim font-medium">مشاهده همه ←</Link>
                <span className="text-xs font-bold text-on-surface-variant">قیمت‌ها</span>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-container-margin">
                {currencyPrices.map((p) => {
                  const up = p.trend === "up";
                  const down = p.trend === "down";
                  const META: Record<string, { symbol: string; name: string }> = {
                    price_dollar_rl: { symbol: "$", name: "دلار" },
                    price_eur: { symbol: "€", name: "یورو" },
                    price_aed: { symbol: "د", name: "درهم" },
                    price_gbp: { symbol: "£", name: "پوند" },
                    price_try: { symbol: "₺", name: "لیر" },
                    geram18: { symbol: "Au", name: "طلا ۱۸" },
                    sekeb: { symbol: "⬡", name: "سکه" },
                    sekke: { symbol: "⬡", name: "سکه" },
                    nim: { symbol: "½", name: "نیم سکه" },
                    rob: { symbol: "¼", name: "ربع سکه" },
                    mesghal: { symbol: "Au", name: "مثقال" },
                  };
                  const meta = META[p.key] ?? { symbol: "؟", name: p.key };
                  return (
                    <Link
                      key={p.key}
                      href="/prices"
                      className="shrink-0 bg-surface-container rounded-xl px-3 py-2.5 flex flex-col gap-1 min-w-[90px] border border-white/5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold tabular-nums ${up ? "text-emerald-400" : down ? "text-red-400" : "text-on-surface-variant"}`}>
                          {p.change_pct && p.change_pct !== 0 ? `${up ? "▲" : "▼"}${Math.abs(p.change_pct).toFixed(1)}٪` : "—"}
                        </span>
                        <span className="text-xs font-black text-secondary-fixed-dim">{meta.symbol}</span>
                      </div>
                      <span className="text-xs text-on-surface-variant text-right">{meta.name}</span>
                      <span className="text-sm font-bold text-on-surface tabular-nums text-right">
                        {p.price.toLocaleString("fa-IR")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* News feed with load-more */}
          <LoadMoreFeed
            initialItems={rest}
            initialPage={page}
            initialPages={pages}
            cat={cat}
            group={group}
          />
        </main>
        <MobileFooter />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">

        <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-gutter px-container-margin pt-gutter pb-section-gap">
          {/* Left: 6 cols */}
          <section className="col-span-6 flex flex-col gap-section-gap">
            {/* Desktop category tabs */}
            <div className="sticky top-[72px] z-30 bg-background/80 backdrop-blur-md border-b border-white/5 py-2">
              <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/" visibleGroups={activeGroups} />
            </div>

            {/* Page h1 — keyword + live date signal for Google */}
            <h1 className="text-sm font-bold text-secondary-fixed-dim/70 tracking-widest -mb-2">
              اخبار ایران امروز — {today}
            </h1>

            {hero && <NewsCard item={hero} variant="hero" priority />}

            <div className="grid grid-cols-2 gap-gutter">
              {rest.slice(0, 2).map((item) => (
                <NewsCard key={item.item_id} item={item} />
              ))}
            </div>

            <div className="space-y-gutter">
              <h2 className="font-headline-lg text-headline-lg border-r-4 border-secondary-fixed-dim pr-4 mb-4">آخرین اخبار</h2>
              {rest.length === 0 && (
                <p className="text-on-surface-variant text-center py-8">خبری در این دسته‌بندی یافت نشد</p>
              )}
              {rest.slice(2, 8).map((item) => (
                <NewsCard key={item.item_id} item={item} variant="horizontal" />
              ))}
            </div>
          </section>

          {/* Middle: 3 cols */}
          <section className="col-span-3 flex flex-col gap-gutter">
            <h2 className="font-headline-lg text-headline-lg border-r-4 border-secondary-fixed-dim pr-4 mb-2">گزارش روز</h2>
            {rest.slice(8, 14).map((item) => (
              <div key={item.item_id} className="bg-surface-container-low p-4 rounded-lg border border-white/5 hover:border-secondary-fixed-dim/20 transition-all">
                <NewsCard item={item} variant="compact" />
              </div>
            ))}
          </section>

          {/* Right sidebar: 3 cols */}
          <aside className="col-span-3 flex flex-col gap-gutter">
            <section className="bg-surface-container-low border-l border-white/5 shadow-md p-gutter rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-title-md text-title-md text-secondary-fixed-dim">مانیتورینگ زنده</h2>
                <span className="text-secondary-fixed-dim text-xl">💰</span>
              </div>
              <p className="text-[10px] text-on-surface-variant/60 mb-3 text-right">
                نرخ بازار آزاد — هر ۵ دقیقه به‌روز
              </p>
              <div className="space-y-3 min-h-[200px]">
                {widgetPrices.map((p) => (
                  <CurrencyRow key={p.key} item={p} />
                ))}
              </div>
              <Link href="/prices" className="block w-full mt-4 py-2 border border-secondary-fixed-dim/30 text-secondary-fixed-dim rounded-lg text-xs font-bold hover:bg-secondary-fixed-dim/10 transition-colors text-center">
                مشاهده همه قیمت‌ها
              </Link>
            </section>

            <section className="bg-surface-container-low p-gutter rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-title-md text-title-md">🔥 داغ‌ترین خبرها</h2>
              </div>
              <div className="space-y-4">
                {breaking.slice(0, 5).map((item, i) => (
                  <Link key={item.item_id} href={articleHref(item.item_id, item.title)} className="flex gap-3 group cursor-pointer">
                    <span className="text-2xl font-black text-secondary-fixed-dim/20 group-hover:text-secondary-fixed-dim transition-colors shrink-0">
                      {(i + 1).toLocaleString("fa-IR")}
                    </span>
                    <p className="text-sm font-medium leading-relaxed group-hover:text-secondary-fixed-dim transition-colors line-clamp-2">{item.title}</p>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </main>

        {/* Desktop pagination */}
        {pages > 1 && (
          <div className="max-w-[1600px] mx-auto px-container-margin pb-section-gap flex justify-center items-center gap-3">
            {page > 1 && (
              <Link href={pageUrl(page - 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                ← قبلی
              </Link>
            )}
            <span className="text-sm text-on-surface-variant">
              صفحه {toPersianNum(page)} از {toPersianNum(pages)}
            </span>
            {page < pages && (
              <Link href={pageUrl(page + 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                بعدی →
              </Link>
            )}
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}
