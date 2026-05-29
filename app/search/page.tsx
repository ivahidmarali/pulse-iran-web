import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { searchNews } from "@/lib/api";
import { NewsItem } from "@/lib/types";
import { articleHref } from "@/lib/utils";

const SUGGESTIONS = [
  "دلار", "مجلس", "بورس", "روحانی", "پزشکیان",
  "اسرائیل", "هسته‌ای", "تورم", "نفت", "انتخابات",
];

async function fetchSearch(query: string): Promise<{ items: NewsItem[]; total: number }> {
  if (!query) return { items: [], total: 0 };
  try {
    return await searchNews(query);
  } catch {
    return { items: [], total: 0 };
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  return `${Math.floor(hrs / 24)} روز پیش`;
}

function SearchResultRow({ item }: { item: NewsItem }) {
  const importanceColor =
    item.importance === "high"
      ? "border-r-secondary-fixed-dim"
      : item.importance === "medium"
      ? "border-r-white/20"
      : "border-r-transparent";

  return (
    <Link
      href={articleHref(item.item_id, item.title)}
      className={`flex flex-col gap-1.5 p-4 rounded-xl bg-surface-container border border-white/5 border-r-2 ${importanceColor} hover:bg-surface-container-high hover:border-secondary-fixed-dim/20 transition-all`}
      dir="rtl"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-on-surface-variant">{timeAgo(item.posted_at)}</span>
        <span className="text-xs text-secondary-fixed-dim font-medium">{item.source}</span>
      </div>
      <p className="text-sm font-semibold text-on-surface leading-relaxed line-clamp-2">{item.title}</p>
      {item.summary && item.summary !== item.title && item.summary.length > 30 && (
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{item.summary}</p>
      )}
      {item.category && (
        <span className="text-[10px] text-on-surface-variant mt-0.5">{item.category}</span>
      )}
    </Link>
  );
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
  const query = q?.trim() ?? "";
  const { items, total } = await fetchSearch(query);

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* ── Mobile ── */}
      <div className="md:hidden">
        <main className="pb-24">
          {/* sticky search bar */}
          <div className="sticky top-0 z-50 bg-surface border-b border-white/5 px-4 py-3">
            <form method="get" action="/search">
              <div className="relative flex items-center">
                <input
                  name="q"
                  defaultValue={query}
                  autoFocus={!query}
                  dir="rtl"
                  className="w-full bg-surface-container rounded-2xl px-4 py-2.5 pr-10 text-sm outline-none focus:ring-1 focus:ring-secondary-fixed-dim/60 placeholder:text-on-surface-variant"
                  placeholder="جستجو در اخبار..."
                />
                <button type="submit" className="absolute right-3 text-on-surface-variant">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </button>
                {query && (
                  <Link href="/search" className="absolute left-3 text-on-surface-variant">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </Link>
                )}
              </div>
            </form>
          </div>

          <div className="px-4 pt-4">
            {!query ? (
              <div>
                <p className="text-xs text-on-surface-variant mb-3">جستجوهای پیشنهادی</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <Link
                      key={s}
                      href={`/search?q=${encodeURIComponent(s)}`}
                      className="px-3 py-1.5 bg-surface-container rounded-full text-sm text-on-surface-variant hover:bg-secondary-fixed-dim/10 hover:text-secondary-fixed-dim transition-colors"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-on-surface-variant mb-4">
                  {total.toLocaleString("fa-IR")} نتیجه برای «{query}»
                </p>
                {items.length === 0 ? (
                  <div className="text-center py-20 text-on-surface-variant space-y-3">
                    <svg viewBox="0 0 24 24" className="w-12 h-12 mx-auto opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                    </svg>
                    <p className="text-sm">نتیجه‌ای یافت نشد</p>
                    <p className="text-xs opacity-60">کلمه دیگری امتحان کنید</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <SearchResultRow key={item.item_id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <MobileFooter />
        <BottomNav />
      </div>

      {/* ── Desktop ── */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-3xl mx-auto px-container-margin py-10">
          {/* search bar */}
          <form method="get" action="/search" className="mb-8">
            <div className="relative">
              <input
                name="q"
                defaultValue={query}
                autoFocus={!query}
                dir="rtl"
                className="w-full bg-surface-container rounded-2xl px-5 py-3.5 pr-12 text-sm outline-none focus:ring-2 focus:ring-secondary-fixed-dim/60 placeholder:text-on-surface-variant border border-white/5 focus:border-secondary-fixed-dim/30"
                placeholder="جستجو در اخبار..."
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </button>
              {query && (
                <Link href="/search" className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </Link>
              )}
            </div>
          </form>

          {!query ? (
            <div>
              <p className="text-xs text-on-surface-variant mb-4">جستجوهای پیشنهادی</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <Link
                    key={s}
                    href={`/search?q=${encodeURIComponent(s)}`}
                    className="px-4 py-2 bg-surface-container rounded-full text-sm text-on-surface-variant hover:bg-secondary-fixed-dim/10 hover:text-secondary-fixed-dim transition-colors border border-white/5"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-on-surface-variant mb-5">
                {total.toLocaleString("fa-IR")} نتیجه برای «{query}»
              </p>
              {items.length === 0 ? (
                <div className="text-center py-24 text-on-surface-variant space-y-3">
                  <svg viewBox="0 0 24 24" className="w-14 h-14 mx-auto opacity-20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <p>نتیجه‌ای یافت نشد</p>
                  <p className="text-xs opacity-60">کلمه دیگری امتحان کنید</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item) => (
                    <SearchResultRow key={item.item_id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
