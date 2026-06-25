import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect, permanentRedirect } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import ArticleActions from "@/components/article/ArticleActions";
import ArticleNavBar from "@/components/article/ArticleNavBar";
import TelegramEmbed from "@/components/article/TelegramEmbed";
import TelegramPostWidget from "@/components/article/TelegramPostWidget";
import ArticleImage from "@/components/article/ArticleImage";
import { getNewsById, getNews } from "@/lib/api";
import { articleHref, articleUrl, articleId, safeJsonLd, sourceHref, SITE_URL } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export const revalidate = 300;

// Cache article fetch so generateMetadata and the page share one request
const getArticle = cache(async (id: string): Promise<NewsItem | null> => {
  try {
    return await getNewsById(id);
  } catch {
    return null;
  }
});

async function fetchRelated(excludeId: string, category?: string): Promise<NewsItem[]> {
  try {
    const cats = category ? [category] : undefined;
    const data = await getNews(1, 6, cats);
    return (data.items ?? []).filter((n) => n.item_id !== excludeId);
  } catch {
    return [];
  }
}

function categoryName(category?: string): string {
  if (!category) return "اخبار";
  // Strip all leading emoji/non-Persian characters regardless of spacing
  const stripped = category.replace(/^[^؀-ۿݐ-ݿ\w]*/, "").trim();
  return stripped || "اخبار";
}

// Returns a meaningful title for display and SEO.
// Telegram channels often post with minimal titles like "🔴فوری" or "⚡خبر" —
// when the substantive text is under 12 chars we derive the title from the summary instead.
function effectiveTitle(item: { title: string; summary?: string; category?: string }): string {
  const substantive = item.title.replace(/[^؀-ۿa-zA-Z0-9‌]/g, "").trim();
  if (substantive.length >= 12) return item.title;

  if (item.summary && item.summary.length > 30) {
    // First complete sentence up to 90 chars, else just slice
    const m = item.summary.match(/^.{20,90}[.!؟\n]/);
    const derived = m ? m[0].trim().replace(/[.!؟]$/, "") : item.summary.slice(0, 80).trim();
    if (derived.length >= 15) return derived;
  }

  // Last resort: prepend category label
  const cat = categoryName(item.category);
  const bare = item.title.replace(/[^؀-ۿa-zA-Z0-9\s]/g, "").trim();
  return cat !== "اخبار" && bare ? `${cat}: ${bare}` : item.title;
}

// Map known source names to their canonical homepage URL for schema author.url
const SOURCE_URLS: Record<string, string> = {
  "ایرنا": "https://www.irna.ir",
  "IRNA": "https://www.irna.ir",
  "خبرگزاری تسنیم": "https://tasnimnews.ir",
  "تسنیم": "https://tasnimnews.ir",
  "خبرگزاری مهر": "https://mehrnews.com",
  "مهر": "https://mehrnews.com",
  "خبرآنلاین": "https://www.khabaronline.ir",
  "ایران اینترنشنال": "https://www.iranintl.com",
  "Iran International": "https://www.iranintl.com",
  "بی‌بی‌سی فارسی": "https://www.bbc.com/persian",
  "BBC فارسی": "https://www.bbc.com/persian",
  "رادیو فردا": "https://www.radiofarda.com",
  "زومیت": "https://www.zoomit.ir",
  "فردانیوز": "https://www.fardanews.com",
  "ایسنا": "https://www.isna.ir",
  "ISNA": "https://www.isna.ir",
  "آفتاب‌نیوز": "https://aftabnews.ir",
  "دیپلماسی ایرانی": "https://irdiplomacy.ir",
  "اقتصاد آنلاین": "https://eghtesadonline.com",
  "دنیای اقتصاد": "https://www.donya-e-eqtesad.com",
  "شبکه خبر": "https://www.irinn.ir",
  "پایگاه اطلاع‌رسانی دولت": "https://dolat.ir",
  "انتخاب": "https://www.entekhab.ir",
  "ایران": "https://www.ion.ir",
  "رویترز": "https://www.reuters.com",
  "Reuters": "https://www.reuters.com",
  "AP": "https://apnews.com",
  "Associated Press": "https://apnews.com",
  // Extended coverage
  "ایلنا": "https://www.ilna.news",
  "ILNA": "https://www.ilna.news",
  "خبرگزاری فارس": "https://www.farsnews.ir",
  "فارس": "https://www.farsnews.ir",
  "Fars News": "https://www.farsnews.ir",
  "ایران آنلاین": "https://ion.ir",
  "روزنامه شرق": "https://sharghdaily.com",
  "شرق": "https://sharghdaily.com",
  "روزنامه اعتماد": "https://www.etemadnewspaper.ir",
  "اعتماد": "https://www.etemadnewspaper.ir",
  "روزنامه همشهری": "https://www.hamshahri.net",
  "همشهری": "https://www.hamshahri.net",
  "روزنامه جمهوری اسلامی": "https://jomhourieslami.com",
  "الف": "https://alef.ir",
  "جماران": "https://www.jamaran.news",
  "مشرق نیوز": "https://www.mashreghnews.ir",
  "مشرق": "https://www.mashreghnews.ir",
  "خبرگزاری دانشجویان ایران": "https://isna.ir",
  "باشگاه خبرنگاران": "https://www.yjc.ir",
  "YJC": "https://www.yjc.ir",
  "Euronews فارسی": "https://fa.euronews.com",
  "یورونیوز": "https://fa.euronews.com",
  "VOA فارسی": "https://www.voanews.com/persian",
  "صدای آمریکا": "https://www.voanews.com/persian",
  "الجزیره": "https://www.aljazeera.com/persian",
  "Al Jazeera": "https://www.aljazeera.com",
  "AFP": "https://www.afp.com",
  "DW فارسی": "https://www.dw.com/fa",
  "Deutsche Welle": "https://www.dw.com/fa",
};

const LEAN_META: Record<string, { bar: string; text: string; bg: string }> = {
  "اصولگرا":              { bar: "bg-green-500",   text: "text-green-400",   bg: "bg-green-500/10" },
  "رسمی دولتی":           { bar: "bg-green-600",   text: "text-green-500",   bg: "bg-green-600/10" },
  "اصلاح‌طلب":            { bar: "bg-blue-500",    text: "text-blue-400",    bg: "bg-blue-500/10" },
  "اصلاح‌طلب میانه":      { bar: "bg-blue-400",    text: "text-blue-300",    bg: "bg-blue-400/10" },
  "محافظه‌کار میانه":     { bar: "bg-yellow-500",  text: "text-yellow-400",  bg: "bg-yellow-500/10" },
  "لیبرال غربی":          { bar: "bg-purple-500",  text: "text-purple-400",  bg: "bg-purple-500/10" },
  "لیبرال آمریکایی":     { bar: "bg-purple-400",  text: "text-purple-300",  bg: "bg-purple-400/10" },
  "چپ لیبرال":            { bar: "bg-indigo-400",  text: "text-indigo-300",  bg: "bg-indigo-400/10" },
  "مخالف جمهوری اسلامی": { bar: "bg-red-500",     text: "text-red-400",     bg: "bg-red-500/10" },
  "محافظه‌کار عربی":      { bar: "bg-yellow-600",  text: "text-yellow-500",  bg: "bg-yellow-600/10" },
  "مستقل":                { bar: "bg-slate-400",   text: "text-slate-400",   bg: "bg-slate-400/10" },
};

function toPersianNum(n: number): string {
  return n.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
}

const VERIFICATION_STATUS = {
  verified: { emoji: '✅', text: 'تأیید شده', color: 'text-green-400', bg: 'bg-green-500/15' },
  reviewing: { emoji: '🔄', text: 'در حال بررسی', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  unverified: { emoji: '⚠️', text: 'تأیید نشده', color: 'text-gray-400', bg: 'bg-gray-500/15' },
};

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

function readingTime(text: string): number {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getArticle(decodeURIComponent(id));
  if (!item) return { title: "خبر یافت نشد" };

  const seoTitle = effectiveTitle(item);
  const rawDesc = item.summary && item.summary.length > 30 ? item.summary : seoTitle;
  const description = rawDesc.length > 155
    ? (rawDesc.lastIndexOf(" ", 155) > 10
        ? rawDesc.slice(0, rawDesc.lastIndexOf(" ", 155)) + "…"
        : rawDesc.slice(0, 155) + "…")
    : rawDesc;
  const imageUrl = item.image_url || `${SITE_URL}/og-default.jpg`;
  const canonical = articleUrl(articleId(item), item.title);
  const catName = categoryName(item.category);
  // OG spec requires ISO 8601; item.posted_at from the API may be space-separated.
  const publishedIso = new Date(item.posted_at).toISOString();
  // Thin articles (no AI summary → page shows only a link to the source) don't offer
  // original value to Google. Noindex them to concentrate crawl budget on good content.
  const hasContent = Boolean(item.summary && item.summary !== item.title && item.summary.length > 30);

  return {
    title: seoTitle,
    description,
    ...(!hasContent ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: seoTitle,
      description,
      url: canonical,
      siteName: "پالس ایران",
      locale: "fa_IR",
      type: "article",
      publishedTime: publishedIso,
      modifiedTime: publishedIso,
      authors: SOURCE_URLS[item.source] ? [SOURCE_URLS[item.source]] : [item.source],
      section: catName,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
      images: [imageUrl],
    },
    alternates: { canonical, languages: { fa: canonical, "x-default": canonical } },
    ...(item.link
      ? {
          other: {
            "syndication-source": item.link,
            "original-source": item.link,
          },
        }
      : {}),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string; slug?: string[] }>;
}) {
  const { id, slug } = await params;
  const decodedId = decodeURIComponent(id);
  const article = await getArticle(decodedId);

  if (!article) notFound();

  const cleanId = articleId(article);

  // 308 permanent redirect: legacy Telegram IDs (tg:@...) → clean MD5 hash URL
  if (decodedId !== cleanId) {
    permanentRedirect(articleUrl(cleanId, article.title));
  }

  // 301 redirect from /article/{id} (no slug) → /article/{id}/{slug}
  // Only redirect when the target URL actually differs (article has a non-empty title).
  if (!slug) {
    const target = articleHref(cleanId, article.title);
    const bare = `/article/${encodeURIComponent(cleanId)}`;
    if (target !== bare) redirect(`${SITE_URL}${target}`);
  }

  const related = await fetchRelated(decodedId, article?.category);
  const item = article;

  const ago = timeAgo(item.posted_at);
  const publishedIso = new Date(item.posted_at).toISOString();
  const canonical = articleUrl(cleanId, item.title);
  const imageUrl = item.image_url || `${SITE_URL}/og-default.jpg`;
  const catName = categoryName(item.category);
  const displayTitle = effectiveTitle(item);

  // Derive the category group name for breadcrumb (e.g. "اقتصادی" from "💵 دلار و ارز")
  const CATEGORY_GROUP_MAP: Record<string, string> = {
    "🏛 سیاست داخلی": "سیاسی", "🎙 ترامپ": "سیاسی", "🇮🇷🇺🇸 ایران و آمریکا": "سیاسی",
    "🔵 اصلاح‌طلبان": "سیاسی", "🔴 اصولگرایان": "سیاسی",
    "⚔️ جنگ و بحران": "بین‌الملل", "💥 اسرائیل و غزه": "بین‌الملل",
    "🇷🇺🇺🇦 روسیه و اوکراین": "بین‌الملل", "🇸🇦 عربستان": "بین‌الملل",
    "🇹🇷 ترکیه": "بین‌الملل", "🇨🇳 چین": "بین‌الملل",
    "💵 دلار و ارز": "اقتصادی", "🚫 تحریم": "اقتصادی",
    "📈 بورس": "اقتصادی", "🏠 مسکن": "اقتصادی", "🛢 نفت و انرژی": "اقتصادی",
    "🌐 اینترنت و فضای مجازی": "اجتماعی", "✊ اعتراضات": "اجتماعی",
    "🚨 حوادث": "اجتماعی", "☢️ هسته‌ای": "اجتماعی",
    "⚽️ فوتبال ایران": "ورزشی", "🏆 جام جهانی": "ورزشی", "🥇 ورزش جهانی": "ورزشی",
    "💻 تکنولوژی": "تکنولوژی", "📱 موبایل و گجت": "تکنولوژی",
  };
  const groupName = item.category ? (CATEGORY_GROUP_MAP[item.category] ?? catName) : "اخبار";
  const groupUrl = item.category
    ? `${SITE_URL}/categories?group=${encodeURIComponent(groupName)}`
    : `${SITE_URL}/categories`;

  // Build JSON-LD from trusted server-only data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: { "@id": SITE_URL, name: "صفحه اصلی" } },
      { "@type": "ListItem", position: 2, name: groupName, item: { "@id": groupUrl, name: groupName } },
      { "@type": "ListItem", position: 3, name: displayTitle.slice(0, 60) || "مقاله", item: { "@id": canonical, name: displayTitle.slice(0, 60) || "مقاله" } },
    ],
  };

  // Resolve author URL: use known source URL, fall back to palsiran organization
  const authorUrl = SOURCE_URLS[item.source];
  const authorNode = item.source.startsWith("@") || !authorUrl
    ? { "@id": `${SITE_URL}/#organization` }
    : { "@type": "Organization", name: item.source, url: authorUrl };

  // Image: use real dimensions only for og-default fallback; skip dimensions for external images
  const imageNode = imageUrl === `${SITE_URL}/og-default.jpg`
    ? { "@type": "ImageObject", url: imageUrl, width: 1200, height: 630 }
    : { "@type": "ImageObject", url: imageUrl };

  function truncateAtWord(text: string, max = 155): string {
    if (text.length <= max) return text;
    const cut = text.lastIndexOf(" ", max);
    return (cut > 10 ? text.slice(0, cut) : text.slice(0, max)) + "…";
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": canonical,
    url: canonical,
    headline: displayTitle.slice(0, 110),
    description: truncateAtWord(
      item.summary && item.summary.length > 30 ? item.summary : item.title
    ),
    image: imageNode,
    datePublished: new Date(item.posted_at).toISOString(),
    dateModified: new Date(item.posted_at).toISOString(),
    author: authorNode,
    editor: { "@id": `${SITE_URL}/#editor` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable]"],
    },
    inLanguage: "fa",
    ...(catName !== "اخبار" ? { articleSection: catName } : {}),
    // isBasedOn: signals to Google this is an aggregated summary of an upstream
    // source — disambiguates aggregation from duplication.
    ...(item.link
      ? {
          isBasedOn: {
            "@type": "NewsArticle",
            url: item.link,
            ...(item.source ? { publisher: { "@type": "Organization", name: item.source } } : {}),
          },
        }
      : {}),
  };

  return (
    <div className="cyber-grid" dir="rtl">
      {/* Mobile */}
      <div className="md:hidden">
        <ArticleNavBar title={displayTitle} />
        <main className="pb-4">
          <article className="px-container-margin py-section-gap">
            <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-[11px] text-on-surface-variant mb-4 flex-wrap">
              <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
              <span aria-hidden="true">/</span>
              <Link href={groupUrl} className="hover:text-secondary-fixed-dim">{groupName}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-on-surface truncate max-w-[160px]">{displayTitle.slice(0, 40)}{displayTitle.length > 40 ? "…" : ""}</span>
            </nav>
            <div className="flex flex-row-reverse items-center justify-between mb-4 text-label-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Link href={sourceHref(item.source)} className="text-secondary-fixed-dim font-bold hover:underline">{item.source}</Link>
                {item.political_lean && LEAN_META[item.political_lean] && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${LEAN_META[item.political_lean].text} ${LEAN_META[item.political_lean].bg}`}>
                    {item.political_lean}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {item.summary && item.summary.length > 30 && (
                  <span>{toPersianNum(readingTime(item.summary))} دقیقه</span>
                )}
                <time dateTime={publishedIso}>🕐 {ago}</time>
              </div>
            </div>

            {item.is_breaking && (
              <span className="inline-block mb-3 px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold rounded-full">
                🚨 فوری
              </span>
            )}
            {/* Single-h1 SEO: the desktop layout owns the real <h1>. Mobile uses
                role=heading so screen readers still announce heading level 1. */}
            <div
              role="heading"
              aria-level={1}
              className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface leading-snug mb-6"
            >
              {displayTitle}
            </div>

            {item.verification_status && item.verification_status !== "unverified" && item.source_count && item.source_count >= 2 && (() => {
              const vs = VERIFICATION_STATUS[item.verification_status];
              const sources = (item.confirming_sources || "").split(",").filter(Boolean).map(s => s.trim());
              return (
                <div className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-lg ${vs.bg}`}>
                  <span className={`text-xs font-bold ${vs.color}`}>
                    {vs.emoji} {vs.text} از {toPersianNum(item.source_count)} منبع
                  </span>
                  {sources.length > 0 && (
                    <span className="text-[11px] text-outline">
                      {sources.slice(0, 5).join(' • ')}
                    </span>
                  )}
                </div>
              );
            })()}

            {item.telegram_url ? (
              <TelegramPostWidget url={item.telegram_url} />
            ) : item.video_url ? (
              <TelegramEmbed videoUrl={item.video_url} />
            ) : item.image_url ? (
              <ArticleImage src={item.image_url} alt={displayTitle} className="mb-6" />
            ) : null}

            <div className="flex flex-row-reverse items-center justify-between py-4 border-y border-white/5 mb-6">
              <ArticleActions title={displayTitle} itemId={item.item_id} source={item.source} />
            </div>

            <div className="bg-surface-container/30 p-6 rounded-2xl border border-white/5 space-y-4 leading-relaxed">
              {item.summary && item.summary !== item.title && item.summary.length > 30 ? (
                <>
                  <p data-speakable className="font-body-lg text-body-lg text-on-surface leading-8">
                    {item.summary}
                  </p>
                  <p className="text-[11px] text-on-surface-variant/50 flex items-center gap-1 justify-end">
                    <span>🤖</span>
                    <span>این خلاصه با هوش مصنوعی تهیه شده</span>
                  </p>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p className="text-on-surface-variant text-sm">
                    متن کامل خبر در منبع اصلی موجود است
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-block px-4 py-2 bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 text-secondary-fixed-dim rounded-lg text-sm hover:bg-secondary-fixed-dim/30 transition-colors"
                    >
                      مطالعه در منبع اصلی 🔗
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4 text-label-sm text-on-surface-variant">
                <span>منبع:</span>
                <Link href={sourceHref(item.source)} className="text-secondary-fixed-dim hover:underline">{item.source}</Link>
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section className="px-container-margin">
              <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-4">
                <span aria-hidden="true">📰 </span>اخبار مرتبط
              </h2>
              <div className="flex flex-row-reverse gap-3 overflow-x-auto pb-2 no-scrollbar">
                {related.map((rel) => (
                  <Link
                    key={rel.item_id}
                    href={articleHref(articleId(rel), rel.title)}
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
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">

        <main className="max-w-7xl mx-auto px-container-margin py-section-gap grid grid-cols-12 gap-gutter">
          <aside className="col-span-3 h-fit sticky top-24">
            <div className="flex flex-col gap-gutter p-gutter bg-surface-container-low border-l border-white/5 shadow-md rounded-xl">
              <div className="mb-2">
                <h2 className="font-title-md text-title-md text-secondary-fixed-dim leading-none">
                  اطلاعات خبر
                </h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  <time dateTime={publishedIso}>🕐 {ago}</time>
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
                      href={articleHref(articleId(rel), rel.title)}
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
            <nav aria-label="breadcrumb" className="flex text-on-surface-variant font-label-sm text-label-sm gap-2 items-center flex-wrap">
              <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
              <span aria-hidden="true">/</span>
              <Link href={groupUrl} className="hover:text-secondary-fixed-dim">{groupName}</Link>
              <span aria-hidden="true">/</span>
              <span className="text-on-surface">{displayTitle.slice(0, 60)}{displayTitle.length > 60 ? "…" : ""}</span>
            </nav>

            <header>
              <div className="flex items-center gap-2 mb-4">
                {item.is_breaking && (
                  <span className="px-3 py-1 bg-secondary-fixed-dim text-on-secondary-fixed font-bold text-label-sm font-label-sm rounded-full">
                    🚨 فوری
                  </span>
                )}
                <time dateTime={publishedIso} className="text-outline font-label-sm text-label-sm">🕐 {ago}</time>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface leading-snug mb-6">
                {displayTitle}
              </h1>

              {item.verification_status && item.verification_status !== "unverified" && item.source_count && item.source_count >= 2 && (() => {
                const vs = VERIFICATION_STATUS[item.verification_status];
                const sources = (item.confirming_sources || "").split(",").filter(Boolean).map(s => s.trim());
                return (
                  <div className={`flex items-center gap-3 mb-6 px-4 py-2.5 rounded-lg ${vs.bg}`}>
                    <span className={`text-sm font-bold ${vs.color}`}>
                      {vs.emoji} {vs.text} از {toPersianNum(item.source_count)} منبع
                    </span>
                    {sources.length > 0 && (
                      <span className="text-xs text-outline">
                        {sources.slice(0, 5).join(' • ')}
                      </span>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-between py-4 border-y border-white/5 text-on-surface-variant">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    📰 منبع: <Link href={sourceHref(item.source)} className="text-secondary-fixed-dim hover:underline">{item.source}</Link>
                    {item.political_lean && LEAN_META[item.political_lean] && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${LEAN_META[item.political_lean].text} ${LEAN_META[item.political_lean].bg}`}>
                        {item.political_lean}
                      </span>
                    )}
                  </span>
                  <time dateTime={publishedIso}>🕐 {ago}</time>
                  {item.summary && item.summary.length > 30 && (
                    <span>{toPersianNum(readingTime(item.summary))} دقیقه مطالعه</span>
                  )}
                </div>
                <ArticleActions title={displayTitle} itemId={item.item_id} source={item.source} />
              </div>
            </header>

            {item.telegram_url ? (
              <TelegramPostWidget url={item.telegram_url} />
            ) : item.video_url ? (
              <TelegramEmbed videoUrl={item.video_url} />
            ) : item.image_url ? (
              <ArticleImage src={item.image_url} alt={displayTitle} />
            ) : null}

            <div className="bg-surface-container/30 p-8 rounded-2xl border border-white/5 space-y-6 leading-relaxed">
              {item.summary && item.summary !== item.title && item.summary.length > 30 ? (
                <>
                  <p data-speakable className="font-body-lg text-body-lg text-on-surface leading-8">
                    {item.summary}
                  </p>
                  <p className="text-[11px] text-on-surface-variant/50 flex items-center gap-1 justify-end">
                    <span>🤖</span>
                    <span>این خلاصه با هوش مصنوعی تهیه شده</span>
                  </p>
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <p className="text-on-surface-variant text-sm">
                    متن کامل خبر در منبع اصلی موجود است
                  </p>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
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
                    rel="nofollow noopener noreferrer"
                    className="text-secondary-fixed-dim hover:underline"
                  >
                    {item.source} 🔗
                  </a>
                ) : (
                  <Link href={sourceHref(item.source)} className="text-secondary-fixed-dim hover:underline">{item.source}</Link>
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
                      href={articleHref(articleId(rel), rel.title)}
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

      {/* BreadcrumbList JSON-LD — trusted server data */}
      <JsonLd data={breadcrumbJsonLd} />
      {/* NewsArticle JSON-LD — all values from trusted server data */}
      <JsonLd data={jsonLdData} />
    </div>
  );
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // safeJsonLd escapes <, >, & to prevent </script> injection
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
