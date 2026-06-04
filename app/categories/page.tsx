import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import CategoryTabs from "@/components/layout/CategoryTabs";
import NewsCard from "@/components/news/NewsCard";
import { getNews, getSources, getCategories } from "@/lib/api";
import { getCategoryFilter, CATEGORY_GROUPS } from "@/lib/categories";
import { NewsItem, SourceInfo } from "@/lib/types";
import { toPersianNum, SITE_URL, safeJsonLd, sourceHref } from "@/lib/utils";

const PAGE_SIZE = 33;

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

async function fetchData(categories?: string[], source?: string, page = 1) {
  try {
    const [filteredData, sources, activeCats] = await Promise.all([
      getNews(page, PAGE_SIZE, categories, source),
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
      sources,
      activeGroups,
      page: filteredData.page,
      pages: filteredData.pages ?? 1,
    };
  } catch {
    return {
      news: [] as NewsItem[],
      sources: [] as SourceInfo[],
      activeGroups: undefined as string[] | undefined,
      page: 1,
      pages: 1,
    };
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; group?: string; source?: string; page?: string }>;
}): Promise<Metadata> {
  const { cat, group, source, page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1", 10) || 1;
  const label = cat || group || source;
  const q = new URLSearchParams();
  if (cat) q.set("cat", cat);
  if (group) q.set("group", group);
  if (source) q.set("source", source);
  const qs = q.toString();
  const canonical = `${SITE_URL}/categories${qs ? `?${qs}` : ""}`;
  return {
    title: label ? `اخبار ${label} | پالس ایران` : "دسته‌بندی اخبار ایران | پالس ایران",
    description: label
      ? `آخرین اخبار ${label} از منابع معتبر داخلی و خارجی — به‌روزرسانی زنده در پالس ایران`
      : "مرور اخبار ایران بر اساس دسته‌بندی — سیاسی، اقتصادی، بین‌الملل، ورزشی، اجتماعی، تکنولوژی",
    alternates: { canonical, languages: { fa: canonical, "x-default": canonical } },
    ...(page > 3 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; group?: string; source?: string; page?: string }>;
}) {
  const { cat, group, source, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const categories = getCategoryFilter(cat, group);
  const { news, sources, activeGroups, page, pages } = await fetchData(
    categories.length ? categories : undefined,
    source,
    currentPage,
  );

  function pageUrl(p: number) {
    const q = new URLSearchParams();
    if (cat) q.set("cat", cat);
    if (group) q.set("group", group);
    if (source) q.set("source", source);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/categories?${qs}` : "/categories";
  }

  // Sidebar: highlight active group's sub-categories
  const activeGroupCats = cat
    ? [cat]
    : group ? (CATEGORY_GROUPS[group]?.categories ?? []) : [];

  const label = cat || group || "دسته‌بندی اخبار";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: label,
    description: `مرور اخبار ایران بر اساس دسته‌بندی: ${label}`,
    url: `${SITE_URL}/categories`,
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* ── Mobile ── */}
      <div className="md:hidden">
        {/* Sticky category tabs */}
        <div className="sticky top-16 z-30 bg-background border-b border-white/5 px-container-margin py-2">
          <CategoryTabs selectedCat={cat} selectedGroup={group} baseUrl="/categories" visibleGroups={activeGroups} />
        </div>

        <main className="pb-4 px-container-margin pt-4">
          {!cat && !group && !source ? (
            <h1 className="text-base font-bold text-on-surface text-right mb-4">دسته‌بندی اخبار ایران</h1>
          ) : (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-on-surface">
                {source ? `اخبار ${source}` : `اخبار ${group || cat}`}
              </span>
              <Link href="/categories" className="text-xs text-secondary-fixed-dim">× حذف فیلتر</Link>
            </div>
          )}

          {news.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant text-sm">خبری یافت نشد</div>
          ) : (
            <div className="space-y-3">
              {news.map((item) => (
                <NewsCard key={item.item_id} item={item} variant="horizontal" />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                  ← قبلی
                </Link>
              )}
              <span className="text-sm text-on-surface-variant">
                صفحه {toPersianNum(page)} از {toPersianNum(pages)}
              </span>
              {page < pages && (
                <Link href={pageUrl(page + 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                  بعدی →
                </Link>
              )}
            </div>
          )}

          {/* Sources section */}
          <section className="mt-10">
            <h2 className="text-base font-bold border-r-4 border-secondary-fixed-dim pr-3 mb-4">منابع خبری</h2>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((src) => {
                const isActive = source === src.name;
                return (
                  <Link
                    key={src.name}
                    href={isActive ? "/categories" : `/categories?source=${encodeURIComponent(src.name)}`}
                    className={`p-3 rounded-xl text-sm font-medium flex justify-between items-center transition-all ${
                      isActive
                        ? "bg-secondary-fixed-dim/15 ring-1 ring-secondary-fixed-dim text-secondary-fixed-dim"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    <span className="truncate">{src.name}</span>
                    <span className="text-secondary-fixed-dim text-xs shrink-0 mr-1">
                      {toPersianNum(src.count ?? 0)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
        <MobileFooter />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">

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
                        : sourceHref(src.name)
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
              {!cat && !group && !source ? (
                <h1 className="text-title-md font-title-md text-right mb-6">دسته‌بندی اخبار ایران</h1>
              ) : (
                <div className="mb-4 flex items-center gap-2">
                  <h1 className="text-title-md font-title-md">
                    اخبار {source || group || cat}
                  </h1>
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
                <>
                  <div className="grid grid-cols-3 gap-gutter">
                    {news.map((item) => (
                      <NewsCard key={item.item_id} item={item} />
                    ))}
                  </div>
                  {pages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-8">
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
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
