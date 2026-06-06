import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
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
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: { "@id": SITE_URL, name: "صفحه اصلی" } },
    { "@type": "ListItem", position: 2, name: "تحریریه", item: { "@id": `${SITE_URL}/editorial`, name: "تحریریه" } },
  ],
};

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

          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-secondary-fixed-dim" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <p className="text-sm text-on-surface font-semibold">مقالات تحلیلی به زودی</p>
            <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">تیم تحریریه پالس ایران در حال آماده‌سازی محتوای تحلیلی است. به زودی مقالات، تفسیرها و گزارش‌های ویژه در این بخش منتشر می‌شود.</p>
            <Link
              href="/"
              className="mt-2 px-5 py-2 bg-surface-container rounded-full text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              بازگشت به صفحه اصلی
            </Link>
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

          <div className="flex flex-col items-center justify-center py-32 text-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-surface-container flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-10 h-10 text-secondary-fixed-dim" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-on-surface">مقالات تحلیلی به زودی</p>
            <p className="text-sm text-on-surface-variant max-w-md leading-relaxed">
              تیم تحریریه پالس ایران در حال آماده‌سازی محتوای تحلیلی و تفسیری است. به زودی مقالات، گزارش‌های ویژه و تحلیل‌های عمیق از رویدادهای ایران در این بخش منتشر خواهد شد.
            </p>
            <div className="flex gap-3 mt-2">
              <Link
                href="/"
                className="px-6 py-2.5 bg-surface-container rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-high transition-colors"
              >
                بازگشت به صفحه اصلی
              </Link>
              <Link
                href="/about/editorial-policy"
                className="px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
              >
                سیاست تحریریه
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
