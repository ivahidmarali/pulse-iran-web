import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import NewsCard from "@/components/news/NewsCard";
import { getSources, getNews } from "@/lib/api";
import { generateSlug, safeJsonLd, SITE_URL, toPersianNum } from "@/lib/utils";
import type { SourceInfo, NewsItem } from "@/lib/types";

export const revalidate = 3600;

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

async function getSourceBySlug(slug: string): Promise<SourceInfo | null> {
  try {
    const sources = await getSources();
    return sources.find((s) => generateSlug(s.name) === slug) ?? null;
  } catch {
    return null;
  }
}

async function fetchArticles(sourceName: string, page = 1): Promise<{ items: NewsItem[]; pages: number }> {
  try {
    const data = await getNews(page, 20, undefined, sourceName);
    return { items: data.items ?? [], pages: data.pages ?? 1 };
  } catch {
    return { items: [], pages: 1 };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const src = await getSourceBySlug(decodeURIComponent(slug));
  if (!src) return { title: "منبع یافت نشد" };

  const lean = src.political_lean ?? "منبع خبری";
  const canonical = `${SITE_URL}/source/${encodeURIComponent(slug)}`;
  return {
    title: `اخبار ${src.name}`,
    description: `اخبار و گزارش‌های ${src.name} — ${lean}. مشاهده آخرین اخبار از این منبع در پالس ایران.`,
    alternates: {
      canonical,
      languages: { fa: canonical, "x-default": canonical },
    },
    openGraph: {
      title: `اخبار ${src.name} | پالس ایران`,
      description: `آخرین اخبار ${src.name} از طیف ${lean}`,
      url: canonical,
      siteName: "پالس ایران",
      locale: "fa_IR",
      type: "website",
    },
  };
}

function CredibilityBar({ value }: { value?: number }) {
  if (value == null) return null;
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-on-surface-variant">اعتبار:</span>
      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-on-surface-variant tabular-nums">{toPersianNum(pct)}٪</span>
    </div>
  );
}

export default async function SourceProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const decodedSlug = decodeURIComponent(slug);
  const src = await getSourceBySlug(decodedSlug);
  if (!src) notFound();

  const { items, pages } = await fetchArticles(src.name, page);
  const meta = LEAN_META[src.political_lean ?? ""];

  const pageUrl = (p: number) => {
    const q = new URLSearchParams();
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return `/source/${slug}${qs ? `?${qs}` : ""}`;
  };

  const canonical = `${SITE_URL}/source/${encodeURIComponent(decodedSlug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    name: `اخبار ${src.name}`,
    description: `آخرین اخبار و گزارش‌های ${src.name}`,
    url: canonical,
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: {
      "@type": "Organization",
      name: src.name,
      ...(src.telegram_channel ? { sameAs: [`https://t.me/${src.telegram_channel.replace(/^@/, "")}`] } : {}),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "منابع خبری", item: `${SITE_URL}/sources` },
      { "@type": "ListItem", position: 3, name: src.name },
    ],
  };

  return (
    <div className="cyber-grid" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-4">
          {/* Back */}
          <Link href="/sources" className="inline-flex items-center gap-1 text-sm text-on-surface-variant mb-4">
            <svg viewBox="0 0 16 16" className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 3l5 5-5 5" />
            </svg>
            منابع خبری
          </Link>

          {/* Header */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl border border-white/5 mb-6 ${meta?.bg ?? "bg-surface-container"}`}>
            <div className={`w-1.5 h-12 rounded-full shrink-0 ${meta?.bar ?? "bg-white/20"}`} />
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold text-on-surface">{src.name}</h1>
              {src.political_lean && (
                <p className={`text-xs mt-0.5 ${meta?.text ?? "text-on-surface-variant"}`}>{src.political_lean}</p>
              )}
              {src.telegram_channel && (
                <a
                  href={`https://t.me/${src.telegram_channel.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-secondary-fixed-dim mt-1 block"
                >
                  {src.telegram_channel}
                </a>
              )}
              <CredibilityBar value={src.credibility} />
            </div>
            <span className="text-lg font-black text-secondary-fixed-dim tabular-nums shrink-0">
              {toPersianNum(src.count ?? 0)}
            </span>
          </div>

          <p className="text-xs text-on-surface-variant mb-4">
            آخرین اخبار از {src.name}
          </p>

          <div className="space-y-2.5">
            {items.map((item) => (
              <NewsCard key={item.item_id} item={item} variant="horizontal" />
            ))}
            {items.length === 0 && (
              <p className="text-center py-12 text-on-surface-variant text-sm">خبری یافت نشد</p>
            )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                  قبلی
                </Link>
              )}
              <span className="text-sm text-on-surface-variant">{toPersianNum(page)} / {toPersianNum(pages)}</span>
              {page < pages && (
                <Link href={pageUrl(page + 1)} className="px-4 py-2 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                  بعدی
                </Link>
              )}
            </div>
          )}
        </main>
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="max-w-4xl mx-auto px-container-margin py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
            <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/sources" className="hover:text-secondary-fixed-dim">منابع خبری</Link>
            <span>/</span>
            <span className="text-on-surface">{src.name}</span>
          </nav>

          {/* Source card */}
          <div className={`flex items-center gap-5 p-6 rounded-2xl border border-white/5 mb-10 ${meta?.bg ?? "bg-surface-container"}`}>
            <div className={`w-2 h-16 rounded-full shrink-0 ${meta?.bar ?? "bg-white/20"}`} />
            <div className="flex-1">
              <h1 className="text-2xl font-black text-on-surface mb-1">{src.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                {src.political_lean && (
                  <span className={`text-sm font-medium ${meta?.text ?? "text-on-surface-variant"}`}>
                    {src.political_lean}
                  </span>
                )}
                {src.telegram_channel && (
                  <a
                    href={`https://t.me/${src.telegram_channel.replace(/^@/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-secondary-fixed-dim hover:underline"
                  >
                    {src.telegram_channel}
                  </a>
                )}
                <CredibilityBar value={src.credibility} />
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-black text-secondary-fixed-dim tabular-nums">
                {toPersianNum(src.count ?? 0)}
              </div>
              <div className="text-xs text-on-surface-variant mt-1">خبر منتشرشده</div>
            </div>
          </div>

          <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-6">
            آخرین اخبار از {src.name}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {items.map((item) => (
              <NewsCard key={item.item_id} item={item} variant="compact" />
            ))}
            {items.length === 0 && (
              <p className="col-span-2 text-center py-16 text-on-surface-variant">خبری یافت نشد</p>
            )}
          </div>

          {pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="px-6 py-2 bg-surface-container rounded-lg text-sm hover:bg-surface-container-high">
                  صفحه قبل
                </Link>
              )}
              <span className="text-sm text-on-surface-variant">
                صفحه {toPersianNum(page)} از {toPersianNum(pages)}
              </span>
              {page < pages && (
                <Link href={pageUrl(page + 1)} className="px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:opacity-90">
                  صفحه بعد
                </Link>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
