import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "سیاست تصحیح اخبار — پالس ایران",
  description: "رویه پالس ایران برای اصلاح خطاهای احتمالی در اخبار و خلاصه‌های منتشرشده",
  alternates: {
    canonical: `${SITE_URL}/corrections`,
    languages: { fa: `${SITE_URL}/corrections`, "x-default": `${SITE_URL}/corrections` },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/corrections`,
  name: "سیاست تصحیح اخبار پالس ایران",
  description: "رویه پالس ایران برای اصلاح خطاهای احتمالی",
  url: `${SITE_URL}/corrections`,
  inLanguage: "fa",
  publisher: { "@id": `${SITE_URL}/#organization` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "درباره ما", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: "سیاست تصحیح", item: `${SITE_URL}/corrections` },
    ],
  },
};

export default function CorrectionsPage() {
  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-6">
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant mb-5">
            <Link href="/" className="hover:text-secondary-fixed-dim">خانه</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-secondary-fixed-dim">درباره ما</Link>
            <span>/</span>
            <span className="text-on-surface">تصحیح اخبار</span>
          </nav>

          <h1 className="text-xl font-bold text-on-surface mb-1">سیاست تصحیح اخبار</h1>
          <p className="text-xs text-on-surface-variant mb-6">آخرین بروزرسانی: خرداد ۱۴۰۵</p>

          <div className="space-y-6 text-sm text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">تعهد به دقت</h2>
              <p>پالس ایران تلاش می‌کند خلاصه‌های اخبار را با دقت کامل و بر اساس محتوای منابع اصلی تهیه کند. در صورت بروز هرگونه خطا در خلاصه‌سازی یا دسته‌بندی، آماده‌ایم آن را به سرعت اصلاح کنیم.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">چه چیزی را تصحیح می‌کنیم؟</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>خطا در خلاصه‌سازی خودکار که معنا را تحریف کرده باشد</li>
                <li>انتساب نادرست خبر به منبع اشتباه</li>
                <li>طبقه‌بندی گرایش سیاسی منبع که با واقعیت مطابقت نداشته باشد</li>
                <li>تاریخ یا زمان اشتباه در انتشار خبر</li>
                <li>خطاهای فنی که باعث نمایش اشتباه محتوا شده باشد</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">چه چیزی را تصحیح نمی‌کنیم؟</h2>
              <p>پالس ایران محتوای منابع خبری اصلی را تغییر نمی‌دهد. اگر خطا در خبر اصلی منبع است، باید مستقیماً با آن منبع تماس بگیرید. ما فقط مسئول خلاصه‌سازی و دسته‌بندی هستیم.</p>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">نحوه گزارش خطا</h2>
              <p className="mb-3">برای گزارش هرگونه خطا، لطفاً با ذکر لینک خبر مربوطه با ما تماس بگیرید:</p>
              <a
                href="mailto:info@palsiran.com?subject=گزارش خطا در خبر"
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
              >
                info@palsiran.com
              </a>
            </section>

            <section>
              <h2 className="text-base font-bold text-on-surface mb-2">زمان پاسخگویی</h2>
              <p>تمام گزارش‌های خطا ظرف ۴۸ ساعت بررسی می‌شوند. در صورت تأیید خطا، اصلاح انجام می‌شود و تاریخ بروزرسانی مقاله به‌روز می‌گردد.</p>
            </section>

            <div className="pt-4 border-t border-white/10">
              <Link href="/about/editorial-policy" className="text-secondary-fixed-dim text-sm hover:underline">
                ← مشاهده سیاست کامل تحریریه
              </Link>
            </div>
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
            <Link href="/about" className="hover:text-secondary-fixed-dim">درباره ما</Link>
            <span>/</span>
            <span className="text-on-surface">سیاست تصحیح</span>
          </nav>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-on-surface mb-2">سیاست تصحیح اخبار</h1>
            <p className="text-sm text-on-surface-variant">آخرین بروزرسانی: خرداد ۱۴۰۵</p>
          </div>

          <div className="space-y-8 text-on-surface-variant leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-on-surface mb-3 border-r-4 border-secondary-fixed-dim pr-3">تعهد به دقت</h2>
              <p>پالس ایران تلاش می‌کند خلاصه‌های اخبار را با دقت کامل و بر اساس محتوای منابع اصلی تهیه کند. در صورت بروز هرگونه خطا در خلاصه‌سازی یا دسته‌بندی، آماده‌ایم آن را به سرعت اصلاح کنیم.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-on-surface mb-3 border-r-4 border-secondary-fixed-dim pr-3">چه چیزی را تصحیح می‌کنیم؟</h2>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>خطا در خلاصه‌سازی خودکار که معنا را تحریف کرده باشد</li>
                <li>انتساب نادرست خبر به منبع اشتباه</li>
                <li>طبقه‌بندی گرایش سیاسی منبع که با واقعیت مطابقت نداشته باشد</li>
                <li>تاریخ یا زمان اشتباه در انتشار خبر</li>
                <li>خطاهای فنی که باعث نمایش اشتباه محتوا شده باشد</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-on-surface mb-3 border-r-4 border-secondary-fixed-dim pr-3">چه چیزی را تصحیح نمی‌کنیم؟</h2>
              <p>پالس ایران محتوای منابع خبری اصلی را تغییر نمی‌دهد. اگر خطا در خبر اصلی منبع است، باید مستقیماً با آن منبع تماس بگیرید. ما فقط مسئول خلاصه‌سازی و دسته‌بندی هستیم.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-on-surface mb-3 border-r-4 border-secondary-fixed-dim pr-3">نحوه گزارش خطا</h2>
              <p className="mb-4">برای گزارش هرگونه خطا، لطفاً با ذکر لینک خبر مربوطه با ما تماس بگیرید:</p>
              <a
                href="mailto:info@palsiran.com?subject=گزارش خطا در خبر"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
              >
                info@palsiran.com — گزارش خطا
              </a>
            </section>

            <section>
              <h2 className="text-lg font-bold text-on-surface mb-3 border-r-4 border-secondary-fixed-dim pr-3">زمان پاسخگویی</h2>
              <p>تمام گزارش‌های خطا ظرف ۴۸ ساعت بررسی می‌شوند. در صورت تأیید خطا، اصلاح انجام می‌شود و تاریخ بروزرسانی مقاله به‌روز می‌گردد.</p>
            </section>

            <div className="pt-6 border-t border-white/10 flex gap-6">
              <Link href="/about/editorial-policy" className="text-secondary-fixed-dim text-sm hover:underline">
                ← سیاست کامل تحریریه
              </Link>
              <Link href="/about" className="text-on-surface-variant text-sm hover:underline">
                ← درباره پالس ایران
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
