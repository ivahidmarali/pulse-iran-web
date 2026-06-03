import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import NewsCard from "@/components/news/NewsCard";
import { getNews } from "@/lib/api";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { SITE_URL, safeJsonLd, toPersianNum } from "@/lib/utils";
import type { NewsItem } from "@/lib/types";

export const revalidate = 1800;

// Latin slug → Persian group name
const TAG_SLUGS: Record<string, { name: string; description: string; emoji: string }> = {
  "siasi":       { name: "سیاسی",     emoji: "🏛",  description: "اخبار سیاست داخلی ایران، احزاب، مجلس، دولت و رویدادهای سیاسی" },
  "beinolmelal": { name: "بین‌الملل", emoji: "🌍",  description: "اخبار بین‌الملل، روابط خارجی ایران، جنگ و بحران‌های جهانی" },
  "eqtesadi":   { name: "اقتصادی",   emoji: "💰",  description: "اخبار اقتصاد ایران، بازار ارز، بورس، مسکن و تجارت" },
  "ejtemai":    { name: "اجتماعی",   emoji: "👥",  description: "اخبار اجتماعی ایران، اعتراضات، محیط زیست و رویدادهای مدنی" },
  "varzeshi":   { name: "ورزشی",     emoji: "⚽️", description: "اخبار ورزش ایران و جهان، فوتبال، لیگ برتر و رقابت‌های بین‌المللی" },
  "technology": { name: "تکنولوژی",  emoji: "💻",  description: "اخبار فناوری، هوش مصنوعی، موبایل و گجت در ایران و جهان" },
  "hashiye":    { name: "حاشیه",     emoji: "👀",  description: "اخبار فرهنگ، هنر، حاشیه‌های اجتماعی و رویدادهای جنجالی" },
};

function getTagBySlug(slug: string) {
  return TAG_SLUGS[slug] ?? null;
}

async function fetchTagNews(groupName: string, page = 1): Promise<{ items: NewsItem[]; pages: number }> {
  const categories = CATEGORY_GROUPS[groupName]?.categories ?? [];
  if (!categories.length) return { items: [], pages: 1 };
  try {
    const data = await getNews(page, 24, categories);
    return { items: data.items ?? [], pages: data.pages ?? 1 };
  } catch {
    return { items: [], pages: 1 };
  }
}

export async function generateStaticParams() {
  return Object.keys(TAG_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return { title: "دسته‌بندی یافت نشد" };

  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1", 10) || 1;
  const canonical = `${SITE_URL}/tag/${slug}`;

  return {
    title: `اخبار ${tag.name} ایران امروز | پالس ایران`,
    description: `آخرین اخبار ${tag.name} ایران امروز. ${tag.description}`,
    alternates: { canonical, languages: { fa: canonical, "x-default": canonical } },
    openGraph: {
      title: `اخبار ${tag.name} ایران امروز | پالس ایران`,
      description: `آخرین اخبار ${tag.name} ایران امروز. ${tag.description}`,
      url: canonical,
      siteName: "پالس ایران",
      locale: "fa_IR",
      type: "website",
    },
    ...(page > 3 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const { items, pages } = await fetchTagNews(tag.name, page);

  const pageUrl = (p: number) => {
    const q = new URLSearchParams();
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return `/tag/${slug}${qs ? `?${qs}` : ""}`;
  };

  const canonical = `${SITE_URL}/tag/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    name: `اخبار ${tag.name} ایران امروز`,
    description: tag.description,
    url: canonical,
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@type": "Thing", name: tag.name },
    ...(items.length > 0 ? {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.slice(0, 10).map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/article/${item.item_id}`,
          name: item.title,
        })),
      },
    } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "دسته‌بندی‌ها", item: `${SITE_URL}/categories` },
      { "@type": "ListItem", position: 3, name: `اخبار ${tag.name}` },
    ],
  };

  const otherTags = Object.entries(TAG_SLUGS).filter(([s]) => s !== slug);

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-4">
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm text-on-surface-variant mb-4">
            <svg viewBox="0 0 16 16" className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 3l5 5-5 5" />
            </svg>
            دسته‌بندی‌ها
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-3xl">{tag.emoji}</span>
            <div>
              <div role="heading" aria-level={1} className="text-lg font-bold text-on-surface">اخبار {tag.name} ایران امروز</div>
              <p className="text-xs text-on-surface-variant mt-0.5">{tag.description}</p>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-center py-16 text-on-surface-variant text-sm">خبری یافت نشد</p>
          ) : (
            <div className="space-y-2.5">
              {items.map((item) => (
                <NewsCard key={item.item_id} item={item} variant="horizontal" />
              ))}
            </div>
          )}

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

          {/* Other tag links */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-on-surface-variant mb-3">سایر دسته‌بندی‌ها</p>
            <div className="flex flex-wrap gap-2">
              {otherTags.map(([s, t]) => (
                <Link key={s} href={`/tag/${s}`} className="px-3 py-1.5 bg-surface-container rounded-full text-sm text-on-surface-variant hover:text-secondary-fixed-dim transition-colors">
                  {t.emoji} {t.name}
                </Link>
              ))}
            </div>
          </div>
        </main>
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="max-w-6xl mx-auto px-container-margin py-10">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
            <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-secondary-fixed-dim">دسته‌بندی‌ها</Link>
            <span>/</span>
            <span className="text-on-surface">{tag.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl">{tag.emoji}</span>
            <div>
              <h1 className="text-2xl font-black text-on-surface">اخبار {tag.name} ایران امروز</h1>
              <p className="text-sm text-on-surface-variant mt-1">{tag.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-gutter">
            {/* Main news grid */}
            <div className="col-span-9">
              {items.length === 0 ? (
                <p className="text-center py-24 text-on-surface-variant">خبری یافت نشد</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-gutter">
                    {items.map((item) => (
                      <NewsCard key={item.item_id} item={item} />
                    ))}
                  </div>
                  {pages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      {page > 1 && (
                        <Link href={pageUrl(page - 1)} className="px-6 py-2 bg-surface-container rounded-lg text-sm hover:bg-surface-container-high">
                          ← قبلی
                        </Link>
                      )}
                      <span className="text-sm text-on-surface-variant">
                        صفحه {toPersianNum(page)} از {toPersianNum(pages)}
                      </span>
                      {page < pages && (
                        <Link href={pageUrl(page + 1)} className="px-6 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:opacity-90">
                          بعدی →
                        </Link>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar: other tags */}
            <aside className="col-span-3">
              <h2 className="text-sm font-bold text-on-surface mb-4 border-r-4 border-secondary-fixed-dim pr-3">سایر دسته‌بندی‌ها</h2>
              <div className="space-y-1.5">
                {otherTags.map(([s, t]) => (
                  <Link
                    key={s}
                    href={`/tag/${s}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high hover:border-secondary-fixed-dim/30 border border-white/5 transition-all text-sm text-on-surface"
                  >
                    <span>{t.emoji}</span>
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
