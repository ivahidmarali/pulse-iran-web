import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { getSources } from "@/lib/api";
import { safeJsonLd, sourceHref, SITE_URL, toPersianNum } from "@/lib/utils";
import type { SourceInfo } from "@/lib/types";

export const revalidate = 3600;

interface LeanInfo {
  name: string;
  description: string;
  bar: string;
  text: string;
  bg: string;
}

const LEAN_SLUGS: Record<string, LeanInfo> = {
  "osoulgarayan": {
    name: "اصولگرا",
    description: "رسانه‌های اصولگرا از مواضع ارزشی و انقلابی حمایت می‌کنند. این رسانه‌ها به حفظ اصول انقلاب اسلامی، مقابله با نفوذ فرهنگی غرب، و تقویت جبهه مقاومت پایبندند. پوشش خبری این رسانه‌ها به طور معمول دولت‌های غربی و رسانه‌های خارجی را با دیده انتقاد می‌نگرد و بر اهمیت ارزش‌های اسلامی و استقلال ملی تأکید دارد. از جمله رسانه‌های شاخص این جریان می‌توان به خبرگزاری فارس، روزنامه کیهان، و تسنیم اشاره کرد.",
    bar: "bg-green-500", text: "text-green-400", bg: "bg-green-500/10",
  },
  "rasmi-dolati": {
    name: "رسمی دولتی",
    description: "رسانه‌های رسمی دولتی تحت نظارت یا مدیریت مستقیم نهادهای حکومتی فعالیت می‌کنند. این رسانه‌ها دیدگاه رسمی نظام جمهوری اسلامی ایران را بازتاب می‌دهند و اخبار را از منظر سیاست‌های دولتی پوشش می‌دهند. ایرنا (خبرگزاری جمهوری اسلامی ایران)، صداوسیما، روزنامه ایران، و خبرگزاری ایسنا از جمله مهم‌ترین رسانه‌های این دسته‌اند.",
    bar: "bg-green-600", text: "text-green-500", bg: "bg-green-600/10",
  },
  "eslah-talab": {
    name: "اصلاح‌طلب",
    description: "رسانه‌های اصلاح‌طلب خواهان اصلاح ساختارهای سیاسی در چارچوب نظام جمهوری اسلامی هستند. این رسانه‌ها از توسعه سیاسی، حاکمیت قانون، آزادی مطبوعات، و گفتگو با جهان حمایت می‌کنند. پوشش خبری آن‌ها اغلب بر مسائل حقوق بشر، رفاه اجتماعی، و لزوم بازنگری در سیاست‌های داخلی تمرکز دارد. روزنامه شرق، روزنامه اعتماد، و برخی رسانه‌های مستقل از این جریان‌اند.",
    bar: "bg-blue-500", text: "text-blue-400", bg: "bg-blue-500/10",
  },
  "eslah-talab-mianeh": {
    name: "اصلاح‌طلب میانه",
    description: "رسانه‌های اصلاح‌طلب میانه رویکردی میانه بین اصلاح‌طلبی و محافظه‌کاری دارند. این رسانه‌ها اغلب از مذاکره و تعامل با طرف‌های مختلف داخلی و خارجی حمایت کرده و از دوقطبی‌شدن فضای سیاسی پرهیز می‌کنند. موضع آن‌ها در مسائل اقتصادی و دیپلماتیک انعطاف بیشتری نسبت به اصلاح‌طلبان سنتی نشان می‌دهد.",
    bar: "bg-blue-400", text: "text-blue-300", bg: "bg-blue-400/10",
  },
  "mohafezeh-kar-mianeh": {
    name: "محافظه‌کار میانه",
    description: "رسانه‌های محافظه‌کار میانه از ارزش‌های محافظه‌کارانه دفاع می‌کنند اما در مقایسه با اصولگرایان سنتی، رویکردی معتدل‌تر در مسائل اقتصادی و دیپلماتیک دارند. این رسانه‌ها اغلب در موضوعاتی مانند مذاکرات هسته‌ای یا روابط خارجی انعطاف بیشتری نشان می‌دهند و بر اقتصاد رقابتی و مشارکت محدود با نهادهای بین‌المللی تأکید دارند.",
    bar: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10",
  },
  "liberal-gharbi": {
    name: "لیبرال غربی",
    description: "رسانه‌های لیبرال غربی از دیدگاه لیبرال دموکراسی غربی اخبار ایران را پوشش می‌دهند. این رسانه‌ها عمدتاً خارج از ایران مستقر هستند و از استانداردهای روزنامه‌نگاری غربی پیروی می‌کنند. تأکید آن‌ها بر حقوق بشر، آزادی بیان، و جامعه مدنی است. بی‌بی‌سی فارسی، یورونیوز فارسی، و رادیو فردا از برجسته‌ترین این رسانه‌هایند.",
    bar: "bg-purple-500", text: "text-purple-400", bg: "bg-purple-500/10",
  },
  "liberal-amrikai": {
    name: "لیبرال آمریکایی",
    description: "رسانه‌های آمریکایی با گرایش لیبرال که پوشش فارسی‌زبان از ایران دارند. این رسانه‌ها با بودجه دولت آمریکا یا نهادهای آمریکایی فعالیت می‌کنند و سیاست خارجی آمریکا در قبال ایران را از منظر لیبرال پوشش می‌دهند. صدای آمریکا فارسی (VOA Persian) از برجسته‌ترین این رسانه‌هاست.",
    bar: "bg-purple-400", text: "text-purple-300", bg: "bg-purple-400/10",
  },
  "chap-liberal": {
    name: "چپ لیبرال",
    description: "رسانه‌هایی با ترکیبی از ارزش‌های چپ اجتماعی و لیبرالیسم سیاسی. این رسانه‌ها بر حقوق اقلیت‌ها، عدالت اجتماعی، برابری جنسیتی، و آزادی‌های مدنی تأکید دارند. پوشش خبری آن‌ها اغلب به مسائل محیط‌زیستی، کارگری، و اجتماعی می‌پردازد و از حرکت‌های اعتراضی و مدنی حمایت می‌کند.",
    bar: "bg-indigo-400", text: "text-indigo-300", bg: "bg-indigo-400/10",
  },
  "mokhalef-jomhouri-eslami": {
    name: "مخالف جمهوری اسلامی",
    description: "رسانه‌هایی که آشکارا خواهان تغییر نظام جمهوری اسلامی ایران هستند. این رسانه‌ها طیف متنوعی از سلطنت‌طلبان، جمهوری‌خواهان، و گروه‌های سیاسی مخالف را دربر می‌گیرند. پوشش خبری آن‌ها به شدت انتقادی نسبت به سیاست‌های داخلی و خارجی جمهوری اسلامی است. ایران اینترناشنال از شاخص‌ترین این رسانه‌هاست.",
    bar: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10",
  },
  "mohafezeh-kar-arabi": {
    name: "محافظه‌کار عربی",
    description: "رسانه‌های عربی با گرایش محافظه‌کار که پوشش فارسی‌زبان از منظر کشورهای عربی دارند. این رسانه‌ها اخبار ایران و منطقه را از زاویه دید کشورهای عربی خلیج فارس پوشش می‌دهند و اغلب رویکردی انتقادی نسبت به سیاست‌های منطقه‌ای ایران دارند. العربیه فارسی و الجزیره فارسی از این دسته‌اند.",
    bar: "bg-yellow-600", text: "text-yellow-500", bg: "bg-yellow-600/10",
  },
  "mostaghel": {
    name: "مستقل",
    description: "رسانه‌هایی که بر اساس شواهد موجود، دسته‌بندی دقیق در یکی از جریان‌های سیاسی شناخته‌شده برایشان دشوار است یا ادعای استقلال از جریان‌های سیاسی اصلی دارند. این رسانه‌ها ممکن است در موضوعات مختلف مواضع متفاوتی اتخاذ کنند و معیار یکسانی برای طبقه‌بندی آن‌ها وجود نداشته باشد.",
    bar: "bg-slate-400", text: "text-slate-400", bg: "bg-slate-400/10",
  },
};

function CredibilityBar({ value }: { value?: number }) {
  if (value == null) return null;
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5" title={`اعتبار: ${pct}%`}>
      <div className="w-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[9px] text-on-surface-variant tabular-nums">{toPersianNum(pct)}٪</span>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lean = LEAN_SLUGS[slug];
  if (!lean) return { title: "گرایش یافت نشد" };
  const canonical = `${SITE_URL}/lean/${slug}`;
  return {
    title: `رسانه‌های ${lean.name}`,
    description: lean.description.slice(0, 160),
    alternates: { canonical, languages: { fa: canonical, "x-default": canonical } },
    openGraph: {
      title: `رسانه‌های ${lean.name} | پالس ایران`,
      description: lean.description.slice(0, 160),
      url: canonical,
      siteName: "پالس ایران",
      locale: "fa_IR",
      type: "website",
    },
  };
}

export default async function LeanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lean = LEAN_SLUGS[slug];
  if (!lean) notFound();

  let sources: SourceInfo[] = [];
  try {
    const all = await getSources();
    sources = all.filter((s) => s.political_lean === lean.name);
  } catch {}

  const totalArticles = sources.reduce((sum, s) => sum + (s.count ?? 0), 0);
  const canonical = `${SITE_URL}/lean/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": canonical,
    name: `رسانه‌های ${lean.name}`,
    description: lean.description,
    url: canonical,
    inLanguage: "fa",
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: { "@type": "Thing", name: lean.name },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "منابع خبری", item: `${SITE_URL}/sources` },
      { "@type": "ListItem", position: 3, name: `رسانه‌های ${lean.name}`, item: canonical },
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
          <Link href="/sources" className="inline-flex items-center gap-1 text-sm text-on-surface-variant mb-4">
            <svg viewBox="0 0 16 16" className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M6 3l5 5-5 5" />
            </svg>
            منابع خبری
          </Link>

          <div className={`p-4 rounded-2xl border border-white/5 mb-6 ${lean.bg}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-1.5 h-10 rounded-full ${lean.bar}`} />
              <div role="heading" aria-level={1} className="text-lg font-bold text-on-surface">رسانه‌های {lean.name}</div>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">{lean.description}</p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-on-surface-variant">
              <span>{toPersianNum(sources.length)} منبع</span>
              <span>{toPersianNum(totalArticles)} خبر</span>
            </div>
          </div>

          <h2 className="text-sm font-bold text-on-surface border-r-4 border-secondary-fixed-dim pr-3 mb-4">
            منابع این جریان
          </h2>

          <div className="space-y-2">
            {sources.map((src) => (
              <Link
                key={src.name}
                href={sourceHref(src.name)}
                className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-white/5 hover:border-secondary-fixed-dim/30 transition-all"
              >
                <div className={`w-1.5 h-8 rounded-full shrink-0 ${lean.bar} opacity-70`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface">{src.name}</p>
                  {src.telegram_channel && (
                    <p className="text-[10px] text-on-surface-variant">{src.telegram_channel}</p>
                  )}
                  <CredibilityBar value={src.credibility} />
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-secondary-fixed-dim tabular-nums">
                    {toPersianNum(src.count ?? 0)}
                  </span>
                  <svg viewBox="0 0 16 16" className="w-3 h-3 text-on-surface-variant/40 mx-auto mt-1" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M10 4L6 8l4 4" />
                  </svg>
                </div>
              </Link>
            ))}
            {sources.length === 0 && (
              <p className="text-center py-10 text-on-surface-variant text-sm">منبعی یافت نشد</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-sm font-bold text-on-surface mb-3">سایر گرایش‌ها</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LEAN_SLUGS).filter(([s]) => s !== slug).map(([s, l]) => (
                <Link
                  key={s}
                  href={`/lean/${s}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 ${l.text} hover:border-white/30 transition-colors`}
                >
                  {l.name}
                </Link>
              ))}
            </div>
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
            <Link href="/sources" className="hover:text-secondary-fixed-dim">منابع خبری</Link>
            <span>/</span>
            <span className="text-on-surface">{lean.name}</span>
          </nav>

          <div className={`p-8 rounded-2xl border border-white/5 mb-10 ${lean.bg}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-2 h-14 rounded-full shrink-0 mt-1 ${lean.bar}`} />
              <div>
                <h1 className="text-2xl font-black text-on-surface mb-2">رسانه‌های {lean.name}</h1>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-2xl">{lean.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-sm text-on-surface-variant">
              <span>{toPersianNum(sources.length)} منبع فعال</span>
              <span>{toPersianNum(totalArticles)} خبر منتشرشده</span>
            </div>
          </div>

          <h2 className="text-title-md font-title-md border-r-4 border-secondary-fixed-dim pr-3 mb-6">
            منابع این جریان سیاسی
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {sources.map((src) => (
              <Link
                key={src.name}
                href={sourceHref(src.name)}
                className="flex items-center gap-3 p-4 bg-surface-container rounded-2xl border border-white/5 hover:border-secondary-fixed-dim/30 transition-all"
              >
                <div className={`w-1 h-10 rounded-full shrink-0 ${lean.bar} opacity-70`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">{src.name}</p>
                  {src.telegram_channel && (
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{src.telegram_channel}</p>
                  )}
                  <CredibilityBar value={src.credibility} />
                </div>
                <span className="text-xs font-bold text-secondary-fixed-dim tabular-nums shrink-0">
                  {toPersianNum(src.count ?? 0)}
                </span>
              </Link>
            ))}
            {sources.length === 0 && (
              <p className="col-span-2 text-center py-16 text-on-surface-variant">منبعی یافت نشد</p>
            )}
          </div>

          <div className="pt-8 border-t border-white/5">
            <h3 className="text-sm font-bold text-on-surface mb-4">سایر گرایش‌های سیاسی</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(LEAN_SLUGS).filter(([s]) => s !== slug).map(([s, l]) => (
                <Link
                  key={s}
                  href={`/lean/${s}`}
                  className={`px-4 py-2 rounded-full text-xs font-medium border border-white/10 ${l.text} hover:border-white/30 transition-colors`}
                >
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
