import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { ARTICLES, getArticle } from "@/lib/editorial-articles";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const revalidate = 86400;

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
    keywords: article.keywords.join(", "),
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#editor`,
      name: "Vahid Marali",
      url: `${SITE_URL}/about/vahid-marali`,
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: "تحریریه",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: { "@id": SITE_URL } },
      { "@type": "ListItem", position: 2, name: "تحریریه", item: { "@id": `${SITE_URL}/editorial` } },
      { "@type": "ListItem", position: 3, name: article.title },
    ],
  };

  // FAQPage schema — generated from Q&A blocks inside the article body where applicable
  const faqItems =
    slug === "jame-jahani-2026"
      ? [
          { q: "جام جهانی ۲۰۲۶ کجا برگزار می‌شود؟", a: "در سه کشور آمریکا (میزبان اصلی)، کانادا و مکزیک. فینال در استادیوم متلایف، نیوجرسی برگزار می‌شود." },
          { q: "چند تیم در جام جهانی ۲۰۲۶ شرکت می‌کنند؟", a: "برای اولین بار ۴۸ تیم ملی. سهمیه آسیا از ۴.۵ به ۸ تیم رسیده است." },
          { q: "ایران چند بار در جام جهانی شرکت کرده است؟", a: "جام جهانی ۲۰۲۶ هفتمین حضور ایران است — پس از ۱۹۷۸، ۱۹۹۸، ۲۰۰۶، ۲۰۱۴، ۲۰۱۸، ۲۰۲۲." },
          { q: "کجا می‌توان نتایج بازی‌های ایران را زنده دنبال کرد؟", a: "صفحه نتایج زنده پالس ایران هر ۳۰ ثانیه به‌روز می‌شود و تمام بازی‌های جام جهانی را پوشش می‌دهد." },
        ]
      : slug === "behtarin-manba-khabari"
      ? [
          { q: "آیا BBC فارسی کاملاً بی‌طرف است؟", a: "BBC فارسی استانداردهای بالایی دارد اما به‌عنوان رسانه دولت بریتانیا ممکن است در برخی موضوعات سوگیری داشته باشد." },
          { q: "چطور بفهمیم یک خبر معتبر است؟", a: "اگر چند منبع مختلف با گرایش‌های متفاوت آن را تأیید کنند، احتمال صحت بالاتر است. پالس ایران اخبار تأیید چندمنبعه را مشخص می‌کند." },
        ]
      : slug === "akhbar-iran-az-koja-donbal-konim"
      ? [
          { q: "اخبار ایران را از کجا دنبال کنیم؟", a: "هیچ رسانه واحدی همه اخبار را پوشش نمی‌دهد. ترکیب ایرنا، ایسنا، تسنیم، خبرآنلاین و یک منبع خارج از کشور تصویر کامل می‌دهد — یا پالس ایران که اخبار ۴۵+ منبع را یک‌جا با برچسب گرایش سیاسی نمایش می‌دهد." },
          { q: "سریع‌ترین راه دنبال کردن اخبار فوری ایران چیست؟", a: "خبرگزاری‌های تسنیم و ایسنا معمولاً سریع‌ترین هستند. پالس ایران اخبار فوری همه منابع را لحظه‌ای تجمیع و در کانال تلگرام منتشر می‌کند." },
          { q: "آیا Google News برای اخبار ایران کافی است؟", a: "Google News فارسی منابع را تجمیع می‌کند اما گرایش سیاسی آن‌ها را نشان نمی‌دهد و پوشش منابع خارج از ایران محدود است." },
        ]
      : null;

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {faqItems && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }} />
      )}

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
            <div role="heading" aria-level={1} className="text-xl font-bold text-on-surface leading-tight mb-3">{article.title}</div>
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
              <Link href="/about/vahid-marali" className="font-medium hover:text-secondary-fixed-dim">
                وحید مارالی
              </Link>
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
