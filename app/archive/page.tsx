import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import NewsCard from "@/components/news/NewsCard";
import { getArchive, getSources } from "@/lib/api";
import { NewsItem, SourceInfo } from "@/lib/types";

export const metadata: Metadata = {
  title: "آرشیو اخبار",
  description:
    "مرور آرشیو کامل اخبار ایران و جهان از بیش از ۴۵ منبع خبری — فیلتر بر اساس تاریخ، منبع و موضوع",
  keywords: ["آرشیو اخبار", "اخبار قدیمی", "بایگانی اخبار", "اخبار ایران"],
};

async function fetchData(date?: string, source?: string, page = 1) {
  try {
    const [archiveData, sources] = await Promise.all([
      getArchive({ date, source, page }),
      getSources(),
    ]);
    return { items: archiveData.items, total: archiveData.total, sources };
  } catch {
    return { items: [] as NewsItem[], total: 0, sources: [] as SourceInfo[] };
  }
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; source?: string; page?: string }>;
}) {
  const { date, source, page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1", 10);
  const { items, total, sources } = await fetchData(date, source, page);
  const hero = items[0];
  const rest = items.slice(1);

  return (
    <div className="cyber-grid">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-4 px-container-margin py-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 mb-section-gap">
            <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3">آرشیو اخبار</h2>
            <form method="get" action="/archive" className="flex flex-col gap-3">
              <input
                name="date"
                type="date"
                defaultValue={date}
                className="bg-surface-container-high border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-secondary-fixed-dim outline-none"
              />
              <select
                name="source"
                defaultValue={source ?? ""}
                className="bg-surface-container-high border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-secondary-fixed-dim outline-none"
              >
                <option value="">همه منابع</option>
                {sources.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <button type="submit" className="bg-secondary-container text-on-secondary-container rounded-lg px-4 py-2 text-sm font-bold">
                اعمال فیلتر
              </button>
            </form>
          </div>

          <p className="text-label-sm text-on-surface-variant mb-4">{total.toLocaleString("fa-IR")} خبر</p>

          <div className="space-y-3">
            {items.map((item) => <NewsCard key={item.item_id} item={item} variant="horizontal" />)}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-8">
            {page > 1 && (
              <Link href={`/archive?${new URLSearchParams({ ...(date ? { date } : {}), ...(source ? { source } : {}), page: String(page - 1) })}`} className="px-4 py-2 bg-surface-container rounded-lg text-sm">قبلی</Link>
            )}
            {items.length > 0 && (
              <Link href={`/archive?${new URLSearchParams({ ...(date ? { date } : {}), ...(source ? { source } : {}), page: String(page + 1) })}`} className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold">بعدی</Link>
            )}
          </div>
        </main>
        <MobileFooter />
        <BottomNav />
      </div>

      {/* Desktop — bento layout from _6 */}
      <div className="hidden md:block">
        <TopBarDesktop />
        <main className="max-w-[1600px] mx-auto px-container-margin py-section-gap">
          {/* Filters bar */}
          <form method="get" action="/archive" className="flex flex-row-reverse gap-4 mb-section-gap items-end">
            <div className="flex flex-col gap-1">
              <label className="text-label-sm text-on-surface-variant">تاریخ</label>
              <input name="date" type="date" defaultValue={date} className="bg-surface-container-high border-none rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary-fixed-dim" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-label-sm text-on-surface-variant">منبع</label>
              <select name="source" defaultValue={source ?? ""} className="bg-surface-container-high border-none rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary-fixed-dim">
                <option value="">همه منابع</option>
                {sources.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <button type="submit" className="bg-secondary-container text-on-secondary-container rounded-lg px-6 py-2 text-sm font-bold hover:opacity-90">اعمال</button>
            <span className="text-on-surface-variant text-sm mr-auto self-end">{total.toLocaleString("fa-IR")} خبر</span>
          </form>

          {/* Bento grid */}
          <div className="grid grid-cols-8 gap-gutter mb-section-gap">
            {/* Featured (5 cols) */}
            {hero && (
              <div className="col-span-5">
                <NewsCard item={hero} variant="hero" />
              </div>
            )}
            {/* Side (3 cols) — mini cards */}
            <div className="col-span-3 flex flex-col gap-gutter">
              {rest.slice(0, 3).map((item) => (
                <NewsCard key={item.item_id} item={item} variant="compact" />
              ))}
            </div>
          </div>

          {/* Grid of cards */}
          <div className="grid grid-cols-4 gap-gutter">
            {rest.slice(3).map((item) => (
              <NewsCard key={item.item_id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-10">
            {page > 1 && (
              <Link href={`/archive?${new URLSearchParams({ ...(date ? { date } : {}), ...(source ? { source } : {}), page: String(page - 1) })}`} className="px-6 py-2 bg-surface-container rounded-lg text-sm hover:bg-surface-container-high">صفحه قبل</Link>
            )}
            {items.length > 0 && (
              <Link href={`/archive?${new URLSearchParams({ ...(date ? { date } : {}), ...(source ? { source } : {}), page: String(page + 1) })}`} className="px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:opacity-90">صفحه بعد</Link>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
