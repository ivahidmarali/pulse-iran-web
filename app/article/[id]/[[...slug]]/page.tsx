import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import BreakingTicker from "@/components/layout/BreakingTicker";
import ArticleActions from "@/components/article/ArticleActions";
import TelegramEmbed from "@/components/article/TelegramEmbed";
import ArticleImage from "@/components/article/ArticleImage";
import { getNewsById, getNews } from "@/lib/api";
import { articleHref, articleUrl, SITE_URL } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

// Cache article fetch so generateMetadata and the page share one request
const getArticle = cache(async (id: string): Promise<NewsItem | null> => {
  try {
    return await getNewsById(id);
  } catch {
    return null;
  }
});

async function fetchRelated(excludeId: string): Promise<NewsItem[]> {
  try {
    const data = await getNews(1, 6);
    return (data.items ?? []).filter((n) => n.item_id !== excludeId);
  } catch {
    return [];
  }
}

function categoryName(category?: string): string {
  if (!category) return "اخبار";
  // Strip leading emoji/symbols — use a simple space split since categories
  // are in the format "EMOJI text"
  const spaceIdx = category.indexOf(" ");
  if (spaceIdx > 0) return category.slice(spaceIdx + 1).trim();
  return category;
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getArticle(decodeURIComponent(id));
  if (!item) return { title: "خبر یافت نشد" };

  const description =
    item.summary && item.summary.length > 30
      ? item.summary.slice(0, 160)
      : item.title.slice(0, 160);
  const imageUrl = item.image_url || `${SITE_URL}/og-default.jpg`;
  const canonical = articleUrl(item.item_id, item.title);
  const catName = categoryName(item.category);

  return {
    title: item.title,
    description,
    keywords: [catName, "اخبار ایران", item.source, "پالس ایران"],
    openGraph: {
      title: item.title,
      description,
      url: canonical,
      siteName: "پالس ایران",
      locale: "fa_IR",
      type: "article",
      publishedTime: item.posted_at,
      modifiedTime: item.posted_at,
      authors: [item.source],
      section: catName,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: [imageUrl],
    },
    alternates: { canonical },
    other: {
      news_keywords: `${catName}, اخبار ایران, ${item.source}`,
      ...(item.link
        ? { "syndication-source": item.link, "original-source": item.link }
        : {}),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string; slug?: string[] }>;
}) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const [item, related] = await Promise.all([
    getArticle(decodedId),
    fetchRelated(decodedId),
  ]);

  if (!item) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center text-on-surface-variant">
        <div className="text-center">
          <span className="text-[64px] block mb-4">📰</span>
          <p>خبر یافت نشد</p>
          <Link href="/" className="mt-4 inline-block text-secondary-fixed-dim hover:underline">
            بازگشت به خانه
          </Link>
        </div>
      </div>
    );
  }

  const ago = timeAgo(item.posted_at);
  const canonical = articleUrl(item.item_id, item.title);
  const imageUrl = item.image_url || `${SITE_URL}/og-default.jpg`;
  const catName = categoryName(item.category);

  // Build JSON-LD from trusted server-only data
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description:
      item.summary && item.summary.length > 30
        ? item.summary.slice(0, 160)
        : item.title.slice(0, 160),
    image: imageUrl,
    datePublished: item.posted_at,
    dateModified: item.posted_at,
    author: { "@type": "Organization", name: item.source },
    publisher: {
      "@type": "Organization",
      name: "پالس ایران",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: canonical,
    inLanguage: "fa",
    ...(catName !== "اخبار" ? { articleSection: catName } : {}),
    ...(item.link ? { url: item.link } : {}),
  };

  return (
    <div className="min-h-screen cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <TopBarMobile />
        <main className="pb-24">
          {item.is_breaking && <BreakingTicker items={[item.title]} />}

          <article className="px-container-margin py-section-gap">
            <div className="flex flex-row-reverse items-center justify-between mb-4 text-label-sm text-on-surface-variant">
              <span className="text-secondary-fixed-dim font-bold">{item.source}</span>
              <span>🕐 {ago}</span>
            </div>

            {item.is_breaking && (
              <span className="inline-block mb-3 px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold rounded-full">
                🚨 فوری
              </span>
            )}
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface leading-snug mb-6">
              {item.title}
            </h1>

            {item.video_url ? (
              <TelegramEmbed videoUrl={item.video_url} />
            ) : item.image_url ? (
              <ArticleImage src={item.image_url} alt={item.title} className="mb-6" />
            ) : null}

            <div className="flex flex-row-reverse items-center justify-between py-4 border-y border-white/5 mb-6">
              <ArticleActions title={item.title} itemId={item.item_id} source={item.source} />
            </div>

            <div className="bg-surface-container/30 p-6 rounded-2xl border border-white/5 space-y-4 leading-relaxed">
              {item.summary && item.summary !== item.title && item.summary.length > 30 ? (
                <p className="font-body-lg text-body-lg text-on-surface leading-8">
                  {item.summary}
                </p>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p className="text-on-surface-variant text-sm">
                    متن کامل خبر در منبع اصلی موجود است
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 text-secondary-fixed-dim rounded-lg text-sm hover:bg-secondary-fixed-dim/30 transition-colors"
                    >
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

          {related.length > 0 && (
            <section className="px-container-margin">
              <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4">
                📰 اخبار مرتبط
              </h2>
              <div className="flex flex-row-reverse gap-3 overflow-x-auto pb-2 no-scrollbar">
                {related.map((rel) => (
                  <Link
                    key={rel.item_id}
                    href={articleHref(rel.item_id, rel.title)}
                    className="shrink-0 w-52 bg-surface-container-low rounded-lg p-3 border border-white/5"
                  >
                    {!rel.source.startsWith("@") && (
                      <div className="text-label-sm text-secondary-fixed-dim mb-1 text-right">
                        {rel.source}
                      </div>
                    )}
                    <p className="text-sm font-medium line-clamp-3 text-right">{rel.title}</p>
                    <span className="text-[10px] text-outline mt-2 block text-right">
                      🕐 {timeAgo(rel.posted_at)}
                    </span>
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
          <aside className="col-span-3 h-fit sticky top-24">
            <div className="flex flex-col gap-gutter p-gutter bg-surface-container-low border-l border-white/5 shadow-md rounded-xl">
              <div className="mb-2">
                <h2 className="font-title-md text-title-md text-secondary-fixed-dim leading-none">
                  اطلاعات خبر
                </h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  🕐 {ago}
                </p>
              </div>

              <div className="mt-2">
                <h3 className="font-title-md text-title-md mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-secondary-fixed-dim rounded-full" />
                  اخبار مرتبط
                </h3>
                <div className="space-y-4">
                  {related.slice(0, 4).map((rel) => (
                    <Link
                      key={rel.item_id}
                      href={articleHref(rel.item_id, rel.title)}
                      className="group block"
                    >
                      <p className="font-body-md text-body-md text-on-surface-variant group-hover:text-secondary-fixed-dim transition-colors line-clamp-2">
                        {rel.title}
                      </p>
                      <span className="text-label-sm text-outline mt-1 block">
                        🕐 {timeAgo(rel.posted_at)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <article className="col-span-9 flex flex-col gap-gutter">
            <nav className="flex text-on-surface-variant font-label-sm text-label-sm gap-2">
              <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-secondary-fixed-dim">اخبار</Link>
              <span>/</span>
              <span className="text-secondary-fixed-dim">{item.source}</span>
            </nav>

            <header>
              <div className="flex items-center gap-2 mb-4">
                {item.is_breaking && (
                  <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-label-sm font-label-sm rounded-full">
                    🚨 فوری
                  </span>
                )}
                <span className="text-outline font-label-sm text-label-sm">🕐 {ago}</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface leading-snug mb-6">
                {item.title}
              </h1>
              <div className="flex items-center justify-between py-4 border-y border-white/5 text-on-surface-variant">
                <div className="flex items-center gap-4 text-sm">
                  <span>📰 منبع: <span className="text-secondary-fixed-dim">{item.source}</span></span>
                  <span>🕐 {ago}</span>
                </div>
                <ArticleActions title={item.title} itemId={item.item_id} source={item.source} />
              </div>
            </header>

            {item.video_url ? (
              <TelegramEmbed videoUrl={item.video_url} />
            ) : item.image_url ? (
              <ArticleImage src={item.image_url} alt={item.title} />
            ) : null}

            <div className="bg-surface-container/30 p-8 rounded-2xl border border-white/5 space-y-6 leading-relaxed">
              {item.summary && item.summary !== item.title && item.summary.length > 30 ? (
                <p className="font-body-lg text-body-lg text-on-surface leading-8">
                  {item.summary}
                </p>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-on-surface-variant text-sm">
                    متن کامل خبر در منبع اصلی موجود است
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 text-secondary-fixed-dim rounded-lg text-sm hover:bg-secondary-fixed-dim/30 transition-colors"
                    >
                      مطالعه در منبع اصلی 🔗
                    </a>
                  )}
                </div>
              )}
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3 text-on-surface-variant text-label-sm">
                <span>منبع اصلی:</span>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary-fixed-dim hover:underline"
                  >
                    {item.source} 🔗
                  </a>
                ) : (
                  <span className="text-secondary-fixed-dim">{item.source}</span>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <section className="mt-section-gap">
                <h2 className="font-headline-lg text-headline-lg text-on-surface flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                  <span>📰</span>
                  اخبار مرتبط
                </h2>
                <div className="grid grid-cols-3 gap-6">
                  {related.slice(0, 3).map((rel) => (
                    <Link
                      key={rel.item_id}
                      href={articleHref(rel.item_id, rel.title)}
                      className="bg-surface-container-low p-4 rounded-xl border border-white/5 hover:border-secondary-fixed-dim/30 transition-all group"
                    >
                      {!rel.source.startsWith("@") && (
                        <div className="text-label-sm text-on-surface-variant mb-2">
                          {rel.source}
                        </div>
                      )}
                      <h3 className="font-body-md text-body-md text-on-surface group-hover:text-secondary-fixed-dim transition-colors line-clamp-3">
                        {rel.title}
                      </h3>
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

      {/* NewsArticle JSON-LD — all values from trusted server data */}
      <JsonLd data={jsonLdData} />
    </div>
  );
}

// Separate component to avoid inline dangerouslySetInnerHTML lint warnings
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from trusted API response data — no user input
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
