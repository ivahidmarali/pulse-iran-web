import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import ArticleActions from "@/components/article/ArticleActions";
import { getNewsById, getNews } from "@/lib/api";
import { NewsItem } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "دیروز";
  return `${days} روز پیش`;
}

async function fetchData(id: string) {
  try {
    const [item, relatedData] = await Promise.all([
      getNewsById(id),
      getNews(1, 6),
    ]);
    return { item, related: relatedData.items.filter((n) => n.item_id !== id) };
  } catch {
    return { item: null as NewsItem | null, related: [] as NewsItem[] };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { item, related } = await fetchData(decodeURIComponent(id));

  if (!item) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center text-on-surface-variant">
        <div className="text-center">
          <span className="text-[64px] block mb-4">📰</span>
          <p>خبر یافت نشد</p>
          <Link href="/" className="mt-4 inline-block text-secondary-fixed-dim hover:underline">بازگشت به خانه</Link>
        </div>
      </div>
    );
  }

  const ago = timeAgo(item.posted_at);

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24">
          {item.is_breaking && <BreakingTicker items={[item.title]} />}

          <article className="px-container-margin py-section-gap">
            {/* Source + time */}
            <div className="flex flex-row-reverse items-center justify-between mb-4 text-label-sm text-on-surface-variant">
              <span className="text-secondary-fixed-dim font-bold">{item.source}</span>
              <span>🕐 {ago}</span>
            </div>

            {/* Headline */}
            {item.is_breaking && (
              <span className="inline-block mb-3 px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold rounded-full">🚨 فوری</span>
            )}
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface leading-snug mb-6">{item.title}</h1>

            {/* Action bar */}
            <div className="flex flex-row-reverse items-center justify-between py-4 border-y border-white/5 mb-6">
              <ArticleActions title={item.title} itemId={item.item_id} source={item.source} />
            </div>

            {/* Body */}
            <div className="bg-surface-container/30 p-6 rounded-2xl border border-white/5 space-y-4 leading-relaxed">
              {item.summary && item.summary !== item.title && item.summary.length > 30 ? (
                <p className="font-body-lg text-body-lg text-on-surface leading-8">{item.summary}</p>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p className="text-on-surface-variant text-sm">متن کامل خبر در منبع اصلی موجود است</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                       className="inline-block px-4 py-2 bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 text-secondary-fixed-dim rounded-lg text-sm hover:bg-secondary-fixed-dim/30 transition-colors">
                      مطالعه در منبع اصلی 🔗
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4 text-label-sm text-on-surface-variant">
                <span>منبع:</span>
                <span className="text-secondary-fixed-dim">{item.source}</span>
              </div>
            </div>
          </article>

          {/* Related news */}
          {related.length > 0 && (
            <section className="px-container-margin">
              <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4">📰 اخبار مرتبط</h2>
              <div className="flex flex-row-reverse gap-3 overflow-x-auto pb-2 no-scrollbar">
                {related.map((rel) => (
                  <Link key={rel.item_id} href={`/article/${encodeURIComponent(rel.item_id)}`} className="shrink-0 w-52 bg-surface-container-low rounded-lg p-3 border border-white/5">
                    {!rel.source.startsWith("@") && (
                      <div className="text-label-sm text-secondary-fixed-dim mb-1 text-right">{rel.source}</div>
                    )}
                    <p className="text-sm font-medium line-clamp-3 text-right">{rel.title}</p>
                    <span className="text-[10px] text-outline mt-2 block text-right">🕐 {timeAgo(rel.posted_at)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
        <BottomNav />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        {item.is_breaking && <BreakingTicker items={[item.title]} />}
        <TopBarDesktop />

        <main className="max-w-7xl mx-auto px-container-margin py-section-gap grid grid-cols-12 gap-gutter">
          {/* Right sidebar */}
          <aside className="col-span-3 h-fit sticky top-24">
            <div className="flex flex-col gap-gutter p-gutter bg-surface-container-low border-l border-white/5 shadow-md rounded-xl">
              <div className="mb-2">
                <h2 className="font-title-md text-title-md text-secondary-fixed-dim leading-none">اطلاعات خبر</h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">🕐 {ago}</p>
              </div>

              <div className="mt-2">
                <h3 className="font-title-md text-title-md mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-secondary-fixed-dim rounded-full" />
                  اخبار مرتبط
                </h3>
                <div className="space-y-4">
                  {related.slice(0, 4).map((rel) => (
                    <Link key={rel.item_id} href={`/article/${encodeURIComponent(rel.item_id)}`} className="group block">
                      <p className="font-body-md text-body-md text-on-surface-variant group-hover:text-secondary-fixed-dim transition-colors line-clamp-2">{rel.title}</p>
                      <span className="text-label-sm text-outline mt-1 block">🕐 {timeAgo(rel.posted_at)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main article */}
          <article className="col-span-9 flex flex-col gap-gutter">
            {/* Breadcrumbs */}
            <nav className="flex text-on-surface-variant font-label-sm text-label-sm gap-2">
              <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-secondary-fixed-dim">اخبار</Link>
              <span>/</span>
              <span className="text-secondary-fixed-dim">{item.source}</span>
            </nav>

            {/* Headline */}
            <header>
              <div className="flex items-center gap-2 mb-4">
                {item.is_breaking && (
                  <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-label-sm font-label-sm rounded-full">🚨 فوری</span>
                )}
                <span className="text-outline font-label-sm text-label-sm">🕐 {ago}</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface leading-snug mb-6">{item.title}</h1>
              <div className="flex items-center justify-between py-4 border-y border-white/5 text-on-surface-variant">
                <div className="flex items-center gap-4 text-sm">
                  <span>📰 منبع: <span className="text-secondary-fixed-dim">{item.source}</span></span>
                  <span>🕐 {ago}</span>
                </div>
                <ArticleActions title={item.title} itemId={item.item_id} source={item.source} />
              </div>
            </header>

            {/* Content */}
            <div className="bg-surface-container/30 p-8 rounded-2xl border border-white/5 space-y-6 leading-relaxed">
              {item.summary && item.summary !== item.title && item.summary.length > 30 ? (
                <p className="font-body-lg text-body-lg text-on-surface leading-8">{item.summary}</p>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-on-surface-variant text-sm">متن کامل خبر در منبع اصلی موجود است</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                       className="inline-block px-4 py-2 bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 text-secondary-fixed-dim rounded-lg text-sm hover:bg-secondary-fixed-dim/30 transition-colors">
                      مطالعه در منبع اصلی 🔗
                    </a>
                  )}
                </div>
              )}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 text-on-surface-variant text-label-sm">
                <span>منبع اصلی:</span>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer"
                     className="text-secondary-fixed-dim hover:underline">{item.source} 🔗</a>
                ) : (
                  <span className="text-secondary-fixed-dim">{item.source}</span>
                )}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-section-gap">
                <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                  <span>📰</span>
                  اخبار مرتبط
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  {related.slice(0, 3).map((rel) => (
                    <Link key={rel.item_id} href={`/article/${encodeURIComponent(rel.item_id)}`} className="bg-surface-container-low p-4 rounded-xl border border-white/5 hover:border-secondary-fixed-dim/30 transition-all group">
                      {!rel.source.startsWith("@") && (
                        <div className="text-label-sm text-on-surface-variant mb-2">{rel.source}</div>
                      )}
                      <h3 className="font-body-md text-body-md text-on-surface group-hover:text-secondary-fixed-dim transition-colors line-clamp-3">{rel.title}</h3>
                      <div className="mt-4 text-outline text-label-sm">
                        🕐 {timeAgo(rel.posted_at)}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </div>
  );
}
