import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import CategoryTabs from "@/components/layout/CategoryTabs";
import NewsCard from "@/components/news/NewsCard";
import MobileCategoryFeed from "@/components/news/MobileCategoryFeed";
import { getNews, getSources, getCategories } from "@/lib/api";
import { getCategoryFilter, CATEGORY_GROUPS } from "@/lib/categories";
import { NewsItem, SourceInfo } from "@/lib/types";

function filterValid(items: NewsItem[]): NewsItem[] {
  return items.filter((item) => item.title && item.title.trim().length > 5);
}

const LEAN_COLOR: Record<string, string> = {
  "اصولگرا": "bg-green-500/50",
  "اصلاح‌طلب": "bg-blue-500/50",
  "اصلاح‌طلب میانه": "bg-blue-400/40",
  "محافظه‌کار میانه": "bg-yellow-500/40",
  "لیبرال غربی": "bg-purple-500/40",
  "مخالف جمهوری اسلامی": "bg-red-500/40",
  "لیبرال آمریکایی": "bg-purple-400/40",
  "چپ لیبرال": "bg-indigo-400/40",
  "محافظه‌کار عربی": "bg-yellow-600/40",
  "مستقل": "bg-outline/50",
  "رسمی دولتی": "bg-green-600/50",
};
const LEAN_LABEL_COLOR: Record<string, string> = {
  "اصولگرا": "text-green-400/80",
  "اصلاح‌طلب": "text-blue-400/80",
  "اصلاح‌طلب میانه": "text-blue-300/80",
  "محافظه‌کار میانه": "text-yellow-400/80",
  "لیبرال غربی": "text-purple-400/80",
  "مخالف جمهوری اسلامی": "text-red-400/80",
  "لیبرال آمریکایی": "text-purple-300/80",
  "چپ لیبرال": "text-indigo-300/80",
  "محافظه‌کار عربی": "text-yellow-500/80",
  "مستقل": "text-outline/80",
  "رسمی دولتی": "text-green-500/80",
};

async function fetchData(categories?: string[], source?: string) {
  try {
    const [filteredData, allData, sources, activeCats] = await Promise.all([
      getNews(1, 30, categories, source),
      getNews(1, 50),
      getSources(),
      getCategories(),
    ]);
    // Compute which groups have at least one article in the DB
    const activeCatNames = new Set(activeCats.map((c) => c.name));
    const activeGroups = Object.entries(CATEGORY_GROUPS)
      .filter(([, g]) => g.categories.some((c) => activeCatNames.has(c)))
      .map(([name]) => name);
    return {
      news: filterValid(filteredData.items),
      allNews: filterValid(allData.items),
      sources,
      activeGroups,
    };
  } catch {
    return {
      news: [] as NewsItem[],
      allNews: [] as NewsItem[],
      sources: [] as SourceInfo[],
      activeGroups: undefined as string[] | undefined,
    };
  }
}

export const metadata: Metadata = {
  title: "دسته‌بندی اخبار",
  description: "مرور اخبار ایران بر اساس دسته‌بندی: سیاسی، اقتصادی، بین‌الملل، ورزشی، اجتماعی و بیشتر",
  keywords: ["دسته‌بندی اخبار", "اخبار سیاسی", "اخبار اقتصادی", "اخبار ورزشی", "اخبار ایران"],
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; group?: string; source?: string }>;
}) {
  const { cat, group, source } = await searchParams;
  const categories = getCategoryFilter(cat, group);
  const { news, allNews, sources, activeGroups } = await fetchData(
    categories.length ? categories : undefined,
    source,
  );

  // Sidebar: highlight active group's sub-categories
  const activeGroupCats = cat
    ? [cat]
    : group ? (CATEGORY_GROUPS[group]?.categories ?? []) : [];

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* ── Mobile ── */}
      <div className="md:hidden">
        <TopBarMobile />

        <main className="pb-24 px-container-margin pt-3">
          <MobileCategoryFeed allNews={allNews} />
        </main>
        <BottomNav />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <TopBarDesktop />

        <main className="max-w-7xl mx-auto px-container-margin py-section-gap">
          {/* Category tabs */}
          <div className="mb-section-gap">
            <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/categories" visibleGroups={activeGroups} />
          </div>

          <div className="grid grid-cols-12 gap-gutter">
            {/* Sources sidebar (3 cols) */}
            <aside className="col-span-3">
              <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4">منابع</h2>
              <div className="space-y-2">
                {sources.map((src) => {
                  const leanColor = LEAN_COLOR[src.political_lean ?? ""] ?? "bg-outline/50";
                  const leanLabelColor = LEAN_LABEL_COLOR[src.political_lean ?? ""] ?? "text-outline/80";
                  const isActive = source === src.name;
                  return (
                    <Link
                      key={src.name}
                      href={isActive
                        ? `/categories${cat ? `?cat=${encodeURIComponent(cat)}` : group ? `?group=${encodeURIComponent(group)}` : ""}`
                        : `/categories?source=${encodeURIComponent(src.name)}`
                      }
                      className={`glass-card rounded-xl p-3 flex items-center justify-between transition-all hover:ring-1 hover:ring-secondary-fixed-dim/40 ${
                        isActive ? "ring-1 ring-secondary-fixed-dim" : ""
                      }`}
                    >
                      <div>
                        <div className="text-sm font-medium text-on-surface">{src.name}</div>
                        {src.political_lean && (
                          <div className={`text-[10px] mt-0.5 ${leanLabelColor}`}>{src.political_lean}</div>
                        )}
                      </div>
                      <span className={`w-1.5 h-8 ${leanColor} rounded-full`} />
                    </Link>
                  );
                })}

                {/* Active group sub-categories sidebar */}
                {activeGroupCats.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-label-sm font-label-sm text-on-surface-variant mb-2 pr-1">دسته‌بندی‌ها</h3>
                    {activeGroupCats.map((c) => (
                      <Link
                        key={c}
                        href={`/categories?cat=${encodeURIComponent(c)}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${
                          cat === c
                            ? "text-secondary-fixed-dim font-bold bg-secondary-fixed-dim/10"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                        }`}
                      >
                        {c}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* News grid (9 cols) */}
            <div className="col-span-9">
              {source && (
                <div className="mb-4 flex items-center gap-2">
                  <h2 className="text-title-md font-title-md">اخبار {source}</h2>
                  <Link href="/categories" className="text-xs text-on-surface-variant hover:text-secondary-fixed-dim">
                    × پاک کردن فیلتر
                  </Link>
                </div>
              )}
              {news.length === 0 ? (
                <div className="text-center py-32 text-on-surface-variant">
                  <p>خبری در این دسته‌بندی یافت نشد</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-gutter">
                  {news.map((item) => (
                    <NewsCard key={item.item_id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
