import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import GlassCard from "@/components/ui/GlassCard";
import { getSources } from "@/lib/api";
import { SourceInfo } from "@/lib/types";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره پالس ایران",
  description:
    "پالس ایران سامانه تجمیع اخبار از بیش از ۴۵ منبع خبری ایرانی و بین‌المللی — روش‌شناسی، اصول تحریریه و نحوه دسته‌بندی گرایش سیاسی منابع",
  openGraph: {
    title: "درباره پالس ایران",
    description: "پالس ایران سامانه تجمیع اخبار از بیش از ۴۵ منبع خبری ایرانی و بین‌المللی",
    url: `${SITE_URL}/about`,
    siteName: "پالس ایران",
    locale: "fa_IR",
    type: "website",
    images: [{ url: `${SITE_URL}/og-default.jpg`, width: 1200, height: 630, alt: "پالس ایران — درباره ما" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "درباره پالس ایران",
    description: "پالس ایران سامانه تجمیع اخبار از بیش از ۴۵ منبع خبری ایرانی و بین‌المللی",
    images: [`${SITE_URL}/og-default.jpg`],
  },
  alternates: { canonical: `${SITE_URL}/about`, languages: { fa: `${SITE_URL}/about`, "x-default": `${SITE_URL}/about` } },
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/about/#webpage`,
  name: "درباره پالس ایران",
  description: "پالس ایران سامانه تجمیع اخبار از بیش از ۴۵ منبع خبری ایرانی و بین‌المللی — روش‌شناسی، اصول تحریریه و نحوه دسته‌بندی گرایش سیاسی منابع",
  url: `${SITE_URL}/about`,
  inLanguage: "fa",
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntity: { "@id": `${SITE_URL}/#organization` },
};

const editorPersonJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#editor`,
  name: "وحید مارالی",
  alternateName: "Vahid Marali",
  jobTitle: "بنیان‌گذار و سردبیر",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  email: "info@palsiran.com",
  url: `${SITE_URL}/about`,
};

const aboutFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "پالس ایران چیست؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "پالس ایران یک سامانه تجمیع اخبار فارسی است که اخبار را از بیش از ۴۵ منبع خبری ایرانی و بین‌المللی جمع‌آوری و به صورت لحظه‌ای نمایش می‌دهد. هر منبع با گرایش سیاسی شفاف برچسب‌گذاری شده تا خوانندگان زاویه دید هر خبر را بشناسند.",
      },
    },
    {
      "@type": "Question",
      name: "گرایش سیاسی منابع چگونه تعیین می‌شود؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "هر منبع خبری بر اساس سابقه تحریریه، مواضع رسمی و الگوی پوشش خبری در یکی از ۱۱ دسته گرایش سیاسی طبقه‌بندی شده است — از رسمی دولتی و اصولگرا تا لیبرال غربی و مخالف جمهوری اسلامی. این طبقه‌بندی به خوانندگان کمک می‌کند تا زاویه دید هر منبع را بشناسند.",
      },
    },
    {
      "@type": "Question",
      name: "قیمت‌های لحظه‌ای ارز و طلا چیست؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "پالس ایران نرخ زنده دلار، یورو، درهم، پوند، طلا و سکه را بر اساس بازار آزاد ایران هر ۵ دقیقه به‌روزرسانی می‌کند. این قیمت‌ها در صفحه /prices قابل مشاهده هستند.",
      },
    },
    {
      "@type": "Question",
      name: "تأیید چندمنبعه یعنی چه؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "سیستم تأیید چندمنبعی پالس ایران هر خبر را با منابع دیگر مقایسه می‌کند. خبری که توسط ۳ یا بیشتر منبع مستقل پوشش داده شده نشان تأیید شده دریافت می‌کند. منابع مستقل به معنای منابعی با گرایش سیاسی متفاوت است — تأیید توسط چند رسانه هم‌گرایش به عنوان چندمنبعه محاسبه نمی‌شود.",
      },
    },
  ],
};

const LEAN_COLOR: Record<string, string> = {
  "اصول‌گرا": "bg-green-500/50",
  "اصلاح‌طلب": "bg-blue-500/50",
  "لیبرال غربی": "bg-error/50",
  "مستقل": "bg-outline/50",
};
const LEAN_LABEL_COLOR: Record<string, string> = {
  "اصول‌گرا": "text-green-500/80",
  "اصلاح‌طلب": "text-blue-400/80",
  "لیبرال غربی": "text-error/80",
  "مستقل": "text-outline/80",
};

async function fetchSources(): Promise<SourceInfo[]> {
  try {
    return await getSources();
  } catch {
    return [];
  }
}

const STATS = [
  { value: "۴۵+", label: "منبع خبری فعال" },
  { value: "۲۴/۷", label: "پایش لحظه‌ای" },
  { value: "۰٪", label: "فیلترینگ محتوا" },
  { value: "۱۲ms", label: "تأخیر به‌روزرسانی" },
];

export default async function AboutPage() {
  const sources = await fetchSources();

  return (
    <div className="cyber-grid">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutPageJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(editorPersonJsonLd) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(aboutFaqJsonLd) }} />
      <main className="pb-4 md:pb-0">
        {/* Hero / Mission */}
        <section className="relative py-section-gap px-container-margin overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="w-[600px] h-[600px] bg-secondary-container blur-[120px] rounded-full mx-auto" />
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 rounded-full bg-secondary-fixed-dim/10 border border-secondary-fixed-dim/20">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
              <span className="text-label-sm font-label-sm text-secondary-fixed-dim">درباره پالس ایران</span>
            </div>
            <h1 className="text-display-lg font-display-lg text-on-surface mb-8 leading-tight">
              بی‌طرف، از همه منابع،{" "}
              <span className="text-secondary-fixed-dim">بدون سانسور</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-6 leading-relaxed">
              پالس ایران به عنوان یک مرکز پایش داده و اخبار، مأموریت دارد تا بدون پیش‌فرض‌های سیاسی، تمامی جریان‌های خبری را در یک قاب واحد به نمایش بگذارد. ما معتقدیم آگاهی کامل تنها از طریق دسترسی به تنوع آرا میسر است.
            </p>
            <p className="text-body-md font-body-md text-on-surface-variant mb-12 leading-relaxed" lang="en" dir="ltr">
              Palsiran (Pulse Iran) is an independent Persian-language news aggregator covering
              Iran and world news in real time from 45+ sources, with transparent political-lean
              labeling for every source.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="px-container-margin mb-section-gap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label }) => (
              <GlassCard key={label} className="p-6 text-center">
                <div className="text-headline-lg font-headline-lg text-secondary-container mb-1">{value}</div>
                <div className="text-label-sm font-label-sm text-on-surface-variant">{label}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section className="px-container-margin mb-section-gap">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-r-4 border-secondary-fixed-dim pr-4">
              <h2 className="text-title-md font-title-md text-on-surface">روش‌شناسی تحریریه</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">نحوه جمع‌آوری، پردازش و نمایش اخبار</p>
            </div>
            <div className="mt-4 mb-6">
              <Link
                href="/about/editorial-policy"
                className="inline-flex items-center gap-2 text-sm text-secondary-fixed-dim hover:underline"
              >
                مشاهده سیاست تحریریه کامل ←
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-on-surface-variant leading-relaxed">
              <div className="space-y-3">
                <h4 className="text-on-surface font-bold">جمع‌آوری اخبار</h4>
                <p>اخبار به‌صورت خودکار از بیش از ۴۵ کانال تلگرامی و خبرگزاری رسمی پایش و جمع‌آوری می‌شود. سیستم ما ۲۴ ساعته فعال است و اخبار جدید را در کمتر از ۱۲ میلی‌ثانیه شناسایی و منتشر می‌کند. هر خبر همراه با لینک مستقیم به منبع اصلی ارائه می‌شود.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-on-surface font-bold">دسته‌بندی گرایش سیاسی</h4>
                <p>هر منبع خبری بر اساس سابقه تحریریه، مواضع رسمی و الگوی پوشش خبری در یکی از ۱۱ دسته گرایش سیاسی طبقه‌بندی شده است — از «رسمی دولتی» و «اصولگرا» تا «لیبرال غربی» و «مخالف جمهوری اسلامی». این طبقه‌بندی به خوانندگان کمک می‌کند تا زاویه دید هر منبع را بشناسند.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-on-surface font-bold">خلاصه‌سازی هوشمند</h4>
                <p>خلاصه اخبار با کمک هوش مصنوعی تولید می‌شود تا خوانندگان بتوانند سریع‌تر به اصل مطلب دسترسی پیدا کنند. در هر مورد، انتساب به منبع اصلی حفظ می‌شود و لینک مستقیم به متن کامل خبر ارائه می‌گردد.</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-on-surface font-bold">اصل بی‌طرفی</h4>
                <p>پالس ایران هیچ فیلتر سیاسی بر محتوا اعمال نمی‌کند. اخبار از تمام طیف‌های سیاسی منتشر می‌شود تا خوانندگان خود بتوانند با دسترسی به تنوع آرا، قضاوت مستقل داشته باشند.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Credibility Badge System — E-E-A-T signal, explains differentiator */}
        <section className="px-container-margin mb-section-gap">
          <div className="max-w-4xl mx-auto">
            <div className="border-r-4 border-secondary-fixed-dim pr-4 mb-8">
              <h2 className="text-title-md font-title-md text-on-surface">سیستم تأیید چندمنبعی</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">چگونه صحت خبر را ارزیابی می‌کنیم</p>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              پالس ایران یک سیستم خودکار تأیید خبر بر اساس پوشش چندمنبعی دارد. هر خبر پس از انتشار، با منابع دیگر مقایسه می‌شود و بر اساس تعداد منابع مستقل تأییدکننده، یکی از سه نشان دریافت می‌کند:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">✅</span>
                  <h3 className="font-bold text-green-400 text-sm">تأیید شده</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">خبر توسط ۳ یا بیشتر منبع مستقل پوشش داده شده است. بالاترین درجه اطمینان. منابع تأییدکننده به نمایش درمی‌آیند.</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🔄</span>
                  <h3 className="font-bold text-yellow-400 text-sm">در حال بررسی</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">خبر توسط ۲ منبع مستقل پوشش داده شده اما هنوز در انتظار تأیید بیشتر است. احتیاط در اشتراک‌گذاری توصیه می‌شود.</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-bold text-gray-400 text-sm">تأیید نشده</h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">خبر تنها از یک منبع دریافت شده است. ممکن است اطلاعات اولیه یا ادعای تأییدنشده باشد. با احتیاط بخوانید.</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant/60 leading-relaxed">
              این سیستم کاملاً خودکار است و هیچ دخالت دستی در امتیازدهی وجود ندارد. «منابع مستقل» به معنای منابعی است که در طبقه‌بندی گرایش سیاسی ما در دسته‌های متفاوت قرار دارند — تأیید توسط چند رسانه هم‌گرایش، به عنوان چندمنبعه محاسبه نمی‌شود.
            </p>
          </div>
        </section>

        {/* Editorial Team — E-E-A-T signal for Google News */}
        <section className="px-container-margin mb-section-gap">
          <div className="max-w-4xl mx-auto">
            <div className="border-r-4 border-secondary-fixed-dim pr-4 mb-8">
              <h2 className="text-title-md font-title-md text-on-surface">تیم تحریریه</h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant">مسئولان محتوا و سیاست‌گذاری خبری</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-surface-container rounded-xl p-5 flex items-start gap-4 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim/10 flex items-center justify-center shrink-0 text-xl">
                  📰
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">وحید مارالی</p>
                  <p className="text-xs text-secondary-fixed-dim/80 mt-0.5">بنیان‌گذار و سردبیر پالس ایران</p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    نظارت بر سیاست انتشار، ارزیابی منابع و کنترل کیفیت محتوا. پایبند به اصول بی‌طرفی و شفافیت در تمام تصمیمات تحریریه.
                  </p>
                  <a href="mailto:info@palsiran.com" className="text-xs text-secondary-fixed-dim hover:underline mt-1 inline-block">
                    info@palsiran.com
                  </a>
                </div>
              </div>
              <div className="bg-surface-container rounded-xl p-5 flex items-start gap-4 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed-dim/10 flex items-center justify-center shrink-0 text-xl">
                  🤖
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">سیستم پردازش خودکار</p>
                  <p className="text-xs text-secondary-fixed-dim/80 mt-0.5">تجمیع و خلاصه‌سازی هوشمند</p>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    جمع‌آوری لحظه‌ای اخبار از ۴۵+ منبع، دسته‌بندی خودکار و تولید خلاصه با هوش مصنوعی — زیر نظر مستقیم تیم تحریریه.
                  </p>
                  <Link href="/about/editorial-policy" className="text-xs text-secondary-fixed-dim hover:underline mt-1 inline-block">
                    مشاهده سیاست تحریریه ←
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="px-container-margin mb-section-gap">
          <div className="max-w-4xl mx-auto">
            <GlassCard className="p-6 md:p-8 text-center">
              <h3 className="text-title-md font-title-md text-on-surface mb-3">تماس با ما</h3>
              <p className="text-sm text-on-surface-variant mb-4">برای پیشنهادات، انتقادات یا همکاری با ما تماس بگیرید</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:info@palsiran.com" className="inline-flex items-center gap-2 px-6 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                  info@palsiran.com
                </a>
                <a href="https://t.me/palsiran" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2 bg-[#229ED9] text-white rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  @palsiran
                </a>
                <a href="https://x.com/palsiran_news" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 text-white rounded-full text-sm font-bold hover:bg-white/20 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @palsiran_news
                </a>
                <a href="https://www.youtube.com/@palsiran" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF0000]/80 text-white rounded-full text-sm font-bold hover:bg-[#FF0000] transition-colors">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  یوتیوب
                </a>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Sources */}
        <section className="px-container-margin mb-section-gap">
          <div className="flex items-end justify-between mb-8 border-r-4 border-secondary-fixed-dim pr-4">
            <div>
              <h3 className="text-title-md font-title-md text-on-surface">منابع خبری تحت پوشش</h3>
              <p className="text-label-sm font-label-sm text-on-surface-variant">تنوع سیاسی و جهت‌گیری‌های رسانه‌ای</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sources.map((src) => {
              const leanColor = LEAN_COLOR[src.political_lean ?? ""] ?? "bg-outline/50";
              const leanLabelColor = LEAN_LABEL_COLOR[src.political_lean ?? ""] ?? "text-outline/80";
              return (
                <GlassCard key={src.name} className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">newspaper</span>
                    </div>
                    <div>
                      <div className="text-body-md font-body-md text-on-surface">{src.name}</div>
                      {src.telegram_channel && (
                        <div className="text-label-sm font-label-sm text-on-surface-variant">{src.telegram_channel}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`w-1.5 h-8 ${leanColor} rounded-full`} title={src.political_lean} />
                    {src.political_lean && (
                      <span className={`text-[10px] ${leanLabelColor} font-label-sm`}>{src.political_lean}</span>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="px-container-margin py-12">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-container/20 to-primary-container p-8 md:p-12 text-center border border-secondary-container/30">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary-container/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-secondary-container/10 blur-[80px] rounded-full" />
            <h4 className="text-headline-lg font-headline-lg text-on-surface mb-4">همراه با نبض اخبار</h4>
            <p className="text-body-md font-body-md text-on-surface-variant mb-8 max-w-xl mx-auto">
              برای دریافت فوری‌ترین خبرها، به کانال تلگرام پالس ایران بپیوندید. ما فیلتر نمی‌کنیم، شما انتخاب می‌کنید.
            </p>
            <a
              href="https://t.me/palsiran"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-bold hover:shadow-[0px_0px_20px_rgba(0,210,253,0.4)] transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">send</span>
              عضویت در کانال تلگرام
            </a>
          </div>
        </section>
      </main>

      <div className="md:hidden">
        <MobileFooter />
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
