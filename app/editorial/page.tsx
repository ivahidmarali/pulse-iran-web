import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { ARTICLES } from "@/lib/editorial-articles";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "تحریریه پالس ایران",
  description: "مقالات تحلیلی و تفسیری تحریریه پالس ایران — بررسی رویدادهای سیاسی، اقتصادی و اجتماعی ایران",
  alternates: {
    canonical: `${SITE_URL}/editorial`,
    languages: { fa: `${SITE_URL}/editorial`, "x-default": `${SITE_URL}/editorial` },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/editorial`,
  name: "تحریریه پالس ایران",
  description: "مقالات تحلیلی و تفسیری تحریریه پالس ایران",
  url: `${SITE_URL}/editorial`,
  inLanguage: "fa",
  publisher: { "@id": `${SITE_URL}/#organization` },
  hasPart: ARTICLES.map((a) => ({
    "@type": "NewsArticle",
    headline: a.title,
    url: `${SITE_URL}/editorial/${a.slug}`,
    datePublished: a.datePublished,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: { "@id": SITE_URL } },
    { "@type": "ListItem", position: 2, name: "تحریریه", item: { "@id": `${SITE_URL}/editorial` } },
  ],
};

function ArticleCard({ slug, title, description, datePublished }: {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
}) {
  const date = new Date(datePublished).toLocaleDateString("fa-IR", {
    year: "numeric", month: "long", day: "numeric",
  });
  return (
    <Link
      href={`/editorial/${slug}`}
      className="block rounded-2xl bg-surface-container border border-white/5 p-5 hover:border-secondary-fixed-dim/30 transition-colors group"
    >
      <p className="text-xs text-on-surface-variant mb-2">{date}</p>
      <h2 className="text-base font-bold text-on-surface mb-2 group-hover:text-secondary-fixed-dim transition-colors leading-snug">
        {title}
      </h2>
      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">{description}</p>
      <span className="inline-block mt-3 text-xs text-secondary-fixed-dim">بیشتر بخوانید ←</span>
    </Link>
  );
}

export default function EditorialPage() {
  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-6">
          <div className="mb-6">
            <div role="heading" aria-level={1} className="text-xl font-bold text-on-surface mb-1">تحریریه</div>
            <p className="text-xs text-on-surface-variant">تحلیل و تفسیر رویدادهای ایران</p>
          </div>
          <div className="flex flex-col gap-4">
            {ARTICLES.map((a) => (
              <ArticleCard key={a.slug} slug={a.slug} title={a.title} description={a.description} datePublished={a.datePublished} />
            ))}
          </div>
        </main>
        <MobileFooter />
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="max-w-4xl mx-auto px-container-margin py-10">
          <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
            <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
            <span>/</span>
            <span className="text-on-surface">تحریریه</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-on-surface mb-2">تحریریه</h1>
            <p className="text-on-surface-variant">تحلیل و تفسیر رویدادهای سیاسی، اقتصادی و اجتماعی ایران</p>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {ARTICLES.map((a) => (
              <ArticleCard key={a.slug} slug={a.slug} title={a.title} description={a.description} datePublished={a.datePublished} />
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <Link href="/about/editorial-policy" className="text-sm text-on-surface-variant hover:text-secondary-fixed-dim">
              سیاست تحریریه پالس ایران ←
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
