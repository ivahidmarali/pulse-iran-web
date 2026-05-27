import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import NewsCard from "@/components/news/NewsCard";
import { searchNews } from "@/lib/api";
import { NewsItem } from "@/lib/types";

const RECENT_SEARCHES = ["دلار", "مجلس", "بورس تهران", "هوش مصنوعی", "ایران آمریکا"];

async function fetchSearch(query: string): Promise<{ items: NewsItem[]; total: number }> {
  if (!query) return { items: [], total: 0 };
  try {
    return await searchNews(query);
  } catch {
    return { items: [], total: 0 };
  }
}

export const metadata: Metadata = {
  title: "جستجو در اخبار",
  description: "جستجو در میان هزاران خبر ایران و جهان از منابع مختلف",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const { items, total } = await fetchSearch(q ?? "");

  return (
    <div className="min-h-screen cyber-grid">
      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-24">
          {/* Search header */}
          <div className="bg-surface-container/80 backdrop-blur-xl sticky top-0 z-50 px-container-margin pt-12 pb-4">
            <form method="get" action="/search">
              <div className="relative">
                <input
                  name="q"
                  defaultValue={q}
                  autoFocus={!q}
                  dir="rtl"
                  className="w-full bg-surface-container-high border-none rounded-full px-6 py-3 pr-12 text-sm focus:ring-2 focus:ring-secondary-fixed-dim outline-none"
                  placeholder="جستجو در اخبار..."
                />
                <button type="submit" className="absolute right-4 top-3 text-on-surface-variant">🔍</button>
                {q && (
                  <Link href="/search" className="absolute left-4 top-3 text-on-surface-variant text-lg">✕</Link>
                )}
              </div>
            </form>
          </div>

          <div className="px-container-margin pt-4">
            {!q ? (
              <>
                <div className="mb-section-gap">
                  <h3 className="text-label-sm font-label-sm text-on-surface-variant mb-3">جستجوهای اخیر</h3>
                  <div className="flex flex-wrap gap-2">
                    {RECENT_SEARCHES.map((s) => (
                      <Link
                        key={s}
                        href={`/search?q=${encodeURIComponent(s)}`}
                        className="px-4 py-1.5 bg-surface-container rounded-full text-label-sm font-label-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-row-reverse items-center justify-between mb-4">
                  <span className="text-label-sm text-on-surface-variant">{total.toLocaleString("fa-IR")} نتیجه برای &quot;{q}&quot;</span>
                </div>
                <div className="space-y-3">
                  {items.length === 0 ? (
                    <div className="text-center py-16 text-on-surface-variant">
                      <span className="text-[48px] block mb-3">🔍</span>
                      <p>نتیجه‌ای یافت نشد</p>
                    </div>
                  ) : (
                    items.map((item) => <NewsCard key={item.item_id} item={item} variant="horizontal" />)
                  )}
                </div>
              </>
            )}
          </div>
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-7xl mx-auto px-container-margin py-section-gap">
          <form method="get" action="/search" className="mb-section-gap">
            <div className="relative max-w-2xl mx-auto">
              <input
                name="q"
                defaultValue={q}
                dir="rtl"
                className="w-full bg-surface-container-high border border-white/10 rounded-full px-8 py-4 pr-16 text-body-md focus:ring-2 focus:ring-secondary-fixed-dim outline-none"
                placeholder="جستجو در اخبار..."
              />
              <button type="submit" className="absolute right-5 top-4 text-on-surface-variant">🔍</button>
            </div>
          </form>

          {!q ? (
            <div className="text-center py-16">
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <h3 className="w-full text-on-surface-variant mb-4">جستجوهای پیشنهادی</h3>
                {RECENT_SEARCHES.map((s) => (
                  <Link key={s} href={`/search?q=${encodeURIComponent(s)}`} className="px-6 py-2 bg-surface-container rounded-full text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <p className="text-on-surface-variant mb-section-gap">{total.toLocaleString("fa-IR")} نتیجه برای &quot;{q}&quot;</p>
              <div className="grid grid-cols-3 gap-gutter">
                {items.length === 0 ? (
                  <div className="col-span-3 text-center py-16 text-on-surface-variant">
                    <span className="text-[64px] block mb-4">🔍</span>
                    <p>نتیجه‌ای یافت نشد</p>
                  </div>
                ) : (
                  items.map((item) => <NewsCard key={item.item_id} item={item} />)
                )}
              </div>
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
