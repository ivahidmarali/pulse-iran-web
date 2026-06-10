import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { ARTICLES } from "@/lib/editorial-articles";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

const canonical = `${SITE_URL}/about/vahid-marali`;

export const metadata: Metadata = {
  title: "وحید مارالی — بنیان‌گذار و سردبیر پالس ایران",
  description:
    "وحید مارالی بنیان‌گذار و سردبیر پالس ایران است — پلتفرم تجمیع اخبار فارسی با طبقه‌بندی گرایش سیاسی منابع",
  alternates: {
    canonical,
    languages: { fa: canonical, "x-default": canonical },
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#editor`,
  name: "Vahid Marali",
  alternateName: "وحید مارالی",
  jobTitle: "Founder & Editor-in-Chief",
  description: "وحید مارالی بنیان‌گذار و سردبیر پالس ایران — پلتفرم تجمیع اخبار فارسی با طبقه‌بندی گرایش سیاسی منابع",
  url: canonical,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  email: "info@palsiran.com",
  sameAs: [
    "https://t.me/palsiran",
    "https://x.com/palsiran_news",
    "https://www.youtube.com/@palsiran",
  ],
  knowsAbout: [
    "Persian media analysis",
    "Iranian politics",
    "News aggregation",
    "Political bias in media",
    "Iranian diaspora",
    "Middle East news",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: { "@id": SITE_URL } },
    { "@type": "ListItem", position: 2, name: "درباره ما", item: { "@id": `${SITE_URL}/about` } },
    { "@type": "ListItem", position: 3, name: "وحید مارالی" },
  ],
};

export default function VahidMaraliPage() {
  const editorialArticles = ARTICLES.slice(0, 3);

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-4 px-container-margin pt-6">
          <Link href="/about" className="inline-flex items-center gap-1 text-sm text-on-surface-variant mb-6">
            <svg viewBox="0 0 16 16" className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 3l5 5-5 5" />
            </svg>
            درباره ما
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-secondary-fixed-dim/10 flex items-center justify-center text-secondary-fixed-dim text-2xl font-black shrink-0">
              و
            </div>
            <div>
              <p role="heading" aria-level={1} className="text-xl font-black text-on-surface">وحید مارالی</p>
              <p className="text-xs text-on-surface-variant mt-0.5">بنیان‌گذار و سردبیر پالس ایران</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
            <p>
              وحید مارالی بنیان‌گذار و سردبیر پالس ایران است. پالس ایران در
              سال ۱۴۰۳ با هدف کمک به ایرانیان داخل و خارج از کشور برای
              دنبال کردن اخبار از منابع متنوع و با آگاهی از گرایش سیاسی
              هر رسانه راه‌اندازی شد.
            </p>
            <p>
              ایده اصلی پالس ایران از یک مشکل واقعی سرچشمه گرفت: منابع
              خبری فارسی سوگیری‌های سیاسی مشخصی دارند، اما این سوگیری‌ها
              معمولاً برای خوانندگان شفاف نیست. پالس ایران این شفافیت را
              با طبقه‌بندی ۱۱‌گانه گرایش سیاسی برای بیش از ۴۵ منبع خبری
              ایجاد می‌کند.
            </p>
            <p>
              پالس ایران یک سامانه تجمیع اخبار است — اخبار را از منابع
              مختلف جمع‌آوری می‌کند، دسته‌بندی می‌کند، و در کنار هر خبر
              گرایش سیاسی منبع را نمایش می‌دهد تا خوانندگان بتوانند
              هوشمندانه‌تر اخبار را دنبال کنند.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/5 flex flex-col gap-2">
            <Link href="/about/editorial-policy" className="text-sm text-secondary-fixed-dim hover:underline">
              سیاست تحریریه ←
            </Link>
            <a href="mailto:info@palsiran.com" className="text-sm text-on-surface-variant hover:text-secondary-fixed-dim">
              info@palsiran.com
            </a>
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
            <span className="text-on-surface">وحید مارالی</span>
          </nav>

          <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/10">
            <div className="w-20 h-20 rounded-3xl bg-secondary-fixed-dim/10 flex items-center justify-center text-secondary-fixed-dim text-3xl font-black shrink-0">
              و
            </div>
            <div>
              <h1 className="text-3xl font-black text-on-surface mb-1">وحید مارالی</h1>
              <p className="text-on-surface-variant mb-3">بنیان‌گذار و سردبیر — پالس ایران</p>
              <a href="mailto:info@palsiran.com" className="text-sm text-secondary-fixed-dim hover:underline">
                info@palsiran.com
              </a>
            </div>
          </div>

          <div className="space-y-5 text-on-surface-variant leading-8">
            <p>
              وحید مارالی بنیان‌گذار و سردبیر پالس ایران است. پالس ایران در
              سال ۱۴۰۳ (۲۰۲۴) با هدف کمک به ایرانیان داخل و خارج از کشور
              برای دنبال کردن اخبار از منابع متنوع — و با آگاهی از گرایش
              سیاسی هر منبع — راه‌اندازی شد.
            </p>
            <p>
              ایده اصلی از یک مشکل واقعی سرچشمه گرفت: منابع خبری فارسی
              سوگیری‌های سیاسی مشخصی دارند، اما این سوگیری‌ها معمولاً
              برای خوانندگان شفاف نیست — یا به آن فکر نمی‌کنند. پالس ایران
              با طبقه‌بندی ۱۱‌گانه گرایش سیاسی برای بیش از ۴۵ منبع خبری،
              این شفافیت را ایجاد می‌کند.
            </p>
            <p>
              پالس ایران یک رسانه خبری نیست — یک{" "}
              <strong className="text-on-surface">سامانه تجمیع اخبار</strong> است.
              اخبار را از منابع مختلف جمع‌آوری می‌کند، دسته‌بندی می‌کند،
              خلاصه هوش مصنوعی اضافه می‌کند، و در کنار هر خبر گرایش سیاسی
              منبع را نمایش می‌دهد. هدف کمک به خواندن آگاهانه‌تر — نه
              دیکته کردن اینکه کدام روایت درست است.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <Link
              href="/about/editorial-policy"
              className="rounded-xl bg-surface-container border border-white/5 p-4 hover:border-secondary-fixed-dim/30 transition-colors"
            >
              <p className="text-sm font-bold text-on-surface mb-1">سیاست تحریریه</p>
              <p className="text-xs text-on-surface-variant">روش‌شناسی، منابع، و اصول کار</p>
            </Link>
            <Link
              href="/about"
              className="rounded-xl bg-surface-container border border-white/5 p-4 hover:border-secondary-fixed-dim/30 transition-colors"
            >
              <p className="text-sm font-bold text-on-surface mb-1">درباره پالس ایران</p>
              <p className="text-xs text-on-surface-variant">مأموریت، طبقه‌بندی، و تیم</p>
            </Link>
          </div>

          {editorialArticles.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-on-surface mb-4">مقالات تحریریه</h2>
              <div className="flex flex-col gap-3">
                {editorialArticles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/editorial/${a.slug}`}
                    className="flex items-start gap-3 p-4 rounded-xl bg-surface-container border border-white/5 hover:border-secondary-fixed-dim/30 transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-on-surface group-hover:text-secondary-fixed-dim transition-colors">{a.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {new Date(a.datePublished).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                    <svg viewBox="0 0 16 16" className="w-4 h-4 text-on-surface-variant mt-0.5 rotate-180 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M6 3l5 5-5 5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
