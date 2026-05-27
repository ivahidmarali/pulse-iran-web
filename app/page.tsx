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

async function fetchData(categories?: string[]) {
  try {
    const [newsData, prices, breaking, cats] = await Promise.all([
      getNews(1, 20, categories?.length ? categories : undefined),
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
    };
  } catch {
    return { news: [] as NewsItem[], prices: [] as PriceItem[], breaking: [] as NewsItem[], activeGroups: [] as string[] };
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; group?: string }>;
}) {
  const { cat, group } = await searchParams;
  const categories = getCategoryFilter(cat, group);
  const { news, prices, breaking, activeGroups } = await fetchData(categories);
  const hero = news[0];
  const rest = news.slice(1);
  const breakingTitles = breaking.slice(0, 5).map((b) => b.title);
  const currencyPrices = prices.slice(0, 4);

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* ── Mobile ── */}
      <div className="md:hidden">
        <TopBarMobile />
        {breakingTitles.length > 0 && <BreakingTicker items={breakingTitles} />}

        {/* Sticky category tabs */}
        <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-white/5 px-container-margin py-2">
          <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/" visibleGroups={activeGroups} />
        </div>

        <main className="pb-24 pt-2">
          {/* Hero */}
          {hero && (
            <div className="px-container-margin mb-section-gap mt-3">
              <NewsCard item={hero} variant="hero" />
            </div>
          )}

          {/* Currency scroll */}
          {currencyPrices.length > 0 && (
            <div className="px-container-margin mb-section-gap">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3">قیمت‌ها</h2>
                <Link href="/prices" className="text-secondary-fixed-dim text-label-sm font-label-sm">مشاهده همه</Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {currencyPrices.map((p) => (
                  <div key={p.key} className="shrink-0 w-40">
                    <CurrencyRow item={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News feed */}
          <div className="px-container-margin space-y-3">
            <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4">آخرین اخبار</h2>
            {rest.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant">
                <p>خبری در این دسته‌بندی یافت نشد</p>
              </div>
            )}
            {rest.map((item) => (
              <NewsCard key={item.item_id} item={item} variant="horizontal" />
            ))}
          </div>
        </main>
        <BottomNav />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">
        {breakingTitles.length > 0 && <BreakingTicker items={breakingTitles} />}
        <TopBarDesktop />

        <main className="max-w-[1600px] mx-auto grid grid-cols-12 gap-gutter px-container-margin pt-gutter pb-section-gap">
          {/* Left: 6 cols */}
          <section className="col-span-6 flex flex-col gap-section-gap">
            {/* Desktop category tabs */}
            <div className="sticky top-[72px] z-30 bg-background/80 backdrop-blur-md py-2 -mx-2 px-2 rounded-xl">
              <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/" visibleGroups={activeGroups} />
            </div>

            {hero && <NewsCard item={hero} variant="hero" />}

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
              <div className="space-y-3">
                {prices.slice(0, 3).map((p) => (
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
                  <Link key={item.item_id} href={`/article/${encodeURIComponent(item.item_id)}`} className="flex gap-3 group cursor-pointer">
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
        <Footer />
      </div>
    </div>
  );
}
