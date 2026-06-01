import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const revalidate = 86400;

// Article registry — add entries here as editorial content is written
export type EditorialArticle = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  body: React.ReactNode;
};

// Empty registry — populated as articles are written
const ARTICLES: EditorialArticle[] = [];

function getArticle(slug: string): EditorialArticle | null {
  return ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "مقاله یافت نشد" };

  const canonical = `${SITE_URL}/editorial/${slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical, languages: { fa: canonical, "x-default": canonical } },
    openGraph: {
      title: `${article.title} | پالس ایران`,
      description: article.description,
      url: canonical,
      siteName: "پالس ایران",
      locale: "fa_IR",
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  };
}

export default async function EditorialArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const canonical = `${SITE_URL}/editorial/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": canonical,
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    url: canonical,
    inLanguage: "fa",
    author: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "پالس ایران",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "تحریریه", item: `${SITE_URL}/editorial` },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-4">
          <Link href="/editorial" className="inline-flex items-center gap-1 text-sm text-on-surface-variant mb-4">
            <svg viewBox="0 0 16 16" className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 3l5 5-5 5" />
            </svg>
            تحریریه
          </Link>

          <article>
            <h1 className="text-xl font-bold text-on-surface leading-tight mb-3">{article.title}</h1>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-6">
              <span>تیم پالس ایران</span>
              <span>·</span>
              <time dateTime={article.datePublished}>
                {new Date(article.datePublished).toLocaleDateString("fa-IR")}
              </time>
            </div>
            <div className="prose prose-sm prose-invert max-w-none leading-relaxed text-on-surface-variant">
              {article.body}
            </div>
          </article>

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link href="/about/editorial-policy" className="text-xs text-on-surface-variant hover:text-secondary-fixed-dim">
              سیاست تحریریه پالس ایران ←
            </Link>
          </div>
        </main>
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="max-w-3xl mx-auto px-container-margin py-10">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
            <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
            <span>/</span>
            <Link href="/editorial" className="hover:text-secondary-fixed-dim">تحریریه</Link>
            <span>/</span>
            <span className="text-on-surface">{article.title.slice(0, 50)}</span>
          </nav>

          <article>
            <h1 className="text-3xl font-black text-on-surface leading-tight mb-4">{article.title}</h1>
            <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-8 pb-6 border-b border-white/10">
              <span className="font-medium">تیم پالس ایران</span>
              <span>·</span>
              <time dateTime={article.datePublished}>
                {new Date(article.datePublished).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              {article.dateModified !== article.datePublished && (
                <>
                  <span>·</span>
                  <span className="text-xs">
                    بروزرسانی: {new Date(article.dateModified).toLocaleDateString("fa-IR")}
                  </span>
                </>
              )}
            </div>
            <div className="prose prose-invert max-w-none leading-8 text-on-surface-variant">
              {article.body}
            </div>
          </article>

          <div className="mt-10 pt-6 border-t border-white/10 flex gap-6">
            <Link href="/editorial" className="text-sm text-on-surface-variant hover:text-secondary-fixed-dim">
              ← بازگشت به تحریریه
            </Link>
            <Link href="/about/editorial-policy" className="text-sm text-on-surface-variant hover:text-secondary-fixed-dim">
              سیاست تحریریه ←
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
