import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import BreakingTicker from "@/components/layout/BreakingTicker";
import CategoryTabs from "@/components/layout/CategoryTabs";
import Footer from "@/components/layout/Footer";
import NewsCard from "@/components/news/NewsCard";
import CurrencyRow from "@/components/prices/CurrencyRow";
import { getNews, getPrices, getBreakingNews, getCategories } from "@/lib/api";
import { getCategoryFilter, CATEGORY_GROUPS } from "@/lib/categories";
import { NewsItem, PriceItem } from "@/lib/types";
import { articleHref, toPersianNum } from "@/lib/utils";

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
  const breakingTitles = breaking.slice(0, 5).map((b) => b.title);
  const currencyPrices = prices.slice(0, 4);
  const CURRENCY_KEYS = ["price_dollar_rl", "price_eur", "price_gbp"];
  const priceMap = Object.fromEntries(prices.map((p) => [p.key, p]));
  const widgetPrices = CURRENCY_KEYS.map((k) => priceMap[k]).filter(Boolean);

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* ── Mobile ── */}
      <div className="md:hidden">
        <TopBarMobile />
        {breakingTitles.length > 0 && <BreakingTicker items={breakingTitles} />}

        {/* Sticky category tabs */}
        <div className="sticky top-[104px] z-30 bg-background/90 backdrop-blur-md border-b border-white/5 px-container-margin py-2">
          <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/" visibleGroups={activeGroups} />
        </div>

        <main className="pb-24 pt-3">
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
                  const SYMBOLS: Record<string, string> = {
                    price_dollar_rl: "$", price_eur: "€", price_aed: "د", price_gbp: "£", price_try: "₺",
                  };
                  return (
                    <Link
                      key={p.key}
                      href="/prices"
                      className="shrink-0 bg-surface-container rounded-xl px-3 py-2.5 flex flex-col gap-1 min-w-[90px] border border-white/5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold tabular-nums ${up ? "text-emerald-400" : down ? "text-red-400" : "text-on-surface-variant"}`}>
                          {p.change_pct && p.change_pct !== 0 ? `${up ? "▲" : "▼"}${Math.abs(p.change_pct).toFixed(1)}٪` : "—"}
                        </span>
                        <span className="text-xs font-black text-secondary-fixed-dim">{SYMBOLS[p.key] ?? "؟"}</span>
                      </div>
                      <span className="text-sm font-bold text-on-surface tabular-nums text-right">
                        {p.price.toLocaleString("fa-IR")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* News feed */}
          <div className="px-container-margin space-y-2.5">
            {rest.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant text-sm">
                خبری در این دسته‌بندی یافت نشد
              </div>
            )}
            {rest.map((item) => (
              <NewsCard key={item.item_id} item={item} variant="horizontal" />
            ))}
          </div>

          {/* Mobile pagination */}
          {pages > 1 && (
            <div className="px-container-margin flex justify-center items-center gap-3 mt-6 mb-2">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                  ← قبلی
                </Link>
              )}
              <span className="text-sm text-on-surface-variant">
                {toPersianNum(page)} / {toPersianNum(pages)}
              </span>
              {page < pages && (
                <Link href={pageUrl(page + 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                  بعدی →
                </Link>
              )}
            </div>
          )}
        </main>
        <BottomNav />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">
        {breakingTitles.length > 0 && <BreakingTicker items={breakingTitles} topOffset="top-0" />}
        <TopBarDesktop />

        <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-gutter px-container-margin pt-gutter pb-section-gap">
          {/* Left: 6 cols */}
          <section className="col-span-6 flex flex-col gap-section-gap">
            {/* Desktop category tabs */}
            <div className="sticky top-[72px] z-30 bg-background/80 backdrop-blur-md py-2 -mx-2 px-2 rounded-xl">
              <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/" visibleGroups={activeGroups} />
            </div>

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
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-title-md text-title-md text-secondary-fixed-dim">مانیتورینگ زنده</h2>
                <span className="text-secondary-fixed-dim text-xl">💰</span>
              </div>
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
