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

const ARTICLES: EditorialArticle[] = [
  {
    slug: "taafovot-resane-osoulgarayan",
    title: "تفاوت رسانه‌های اصولگرا و اصلاح‌طلب در ایران",
    description:
      "بررسی تفاوت‌های اساسی در رویکرد تحریریه‌ای، انتخاب رویداد، و قاب‌بندی خبر میان رسانه‌های اصولگرا و اصلاح‌طلب — راهنمایی برای خواندن هوشمندانه‌تر اخبار ایران",
    datePublished: "2026-06-01T12:00:00Z",
    dateModified: "2026-06-01T12:00:00Z",
    keywords: [
      "رسانه اصولگرا",
      "رسانه اصلاح‌طلب",
      "تحلیل رسانه",
      "جریان خبری ایران",
      "گرایش سیاسی",
      "قاب‌بندی خبر",
    ],
    body: (
      <div className="space-y-5">
        <p>
          وقتی یک رویداد مهم در ایران رخ می‌دهد — نتیجه یک انتخابات، تصمیم اقتصادی دولت، یا یک حادثه اجتماعی — خواندن صرفاً یک منبع خبری کافی نیست. رسانه‌های مختلف، با توجه به گرایش سیاسی‌شان، همان رویداد را به شکل‌های متفاوتی روایت می‌کنند. پالس ایران منابع خود را در ۱۱ دسته طبقه‌بندی می‌کند؛ دو دسته پررنگ در این طیف <strong className="text-on-surface">اصولگرایان</strong> و <strong className="text-on-surface">اصلاح‌طلبان</strong> هستند. درک تفاوت این دو جریان، کلید خواندن آگاهانه‌تر اخبار ایران است.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">رسانه‌های اصولگرا چه می‌گویند؟</h2>
        <p>
          رسانه‌های <Link href="/lean/osoulgarayan" className="text-secondary-fixed-dim hover:underline">اصولگرا</Link> عموماً نزدیک به جناح راست سیاسی ایران هستند و بر ارزش‌های انقلاب اسلامی، مقاومت در برابر فشار خارجی، و حفظ ساختارهای موجود تأکید می‌کنند. ویژگی‌های مشترک این رسانه‌ها:
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>سیاست‌های دولت را اغلب از زاویه «تهدیدات خارجی» توجیه می‌کنند</li>
          <li>روابط با آمریکا و اسرائیل را از منظر تقابل بازنمایی می‌کنند</li>
          <li>موفقیت‌های نظامی، موشکی، و دیپلماتیک منطقه‌ای را پررنگ می‌کنند</li>
          <li>اعتراضات داخلی را اغلب به دخالت خارجی نسبت می‌دهند</li>
          <li>دستاوردهای اقتصادی را در برابر تحریم‌ها برجسته می‌کنند</li>
        </ul>
        <p className="text-xs text-on-surface-variant/60">
          نمونه‌هایی از این دسته: فارس نیوز، تسنیم، مشرق نیوز، رجانیوز
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">رسانه‌های اصلاح‌طلب چه می‌گویند؟</h2>
        <p>
          رسانه‌های <Link href="/lean/eslah-talab" className="text-secondary-fixed-dim hover:underline">اصلاح‌طلب</Link> تمایل به نقد ساختارهای قدرت از درون نظام دارند. این رسانه‌ها بیشتر به حقوق مدنی، تعامل با غرب، و آزادی‌های اجتماعی توجه می‌کنند:
        </p>
        <ul className="list-disc pr-6 space-y-1.5">
          <li>مطالبات اجتماعی و اقتصادی مردم را برجسته‌تر می‌کنند</li>
          <li>دیپلماسی و مذاکره با جهان را به عنوان راه‌حل اصلی می‌بینند</li>
          <li>نقد سیاست‌های اقتصادی دولت را با صراحت بیشتری مطرح می‌کنند</li>
          <li>صدای منتقدان درون‌نظامی را بیشتر منتقل می‌کنند</li>
          <li>نتایج انتخابات را از زاویه مشارکت مردمی و رقابت واقعی تحلیل می‌کنند</li>
        </ul>
        <p className="text-xs text-on-surface-variant/60">
          نمونه‌هایی از این دسته: اعتماد آنلاین، آرمان ملی، شرق
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">یک خبر، دو روایت</h2>
        <p>
          برای درک عملی این تفاوت، فرض کنید دولت تصمیم می‌گیرد قیمت بنزین را افزایش دهد:
        </p>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-3 text-on-surface font-semibold">جنبه</th>
                <th className="text-right py-3 px-3 text-secondary-fixed-dim font-semibold">رسانه اصولگرا</th>
                <th className="text-right py-3 px-3 text-[#a2e7ff] font-semibold">رسانه اصلاح‌طلب</th>
              </tr>
            </thead>
            <tbody className="text-on-surface-variant">
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">تیتر</td>
                <td className="py-2.5 px-3">«گام مثبت دولت برای کنترل قاچاق سوخت»</td>
                <td className="py-2.5 px-3">«فشار جدید بر معیشت خانوارهای کم‌درآمد»</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">منابع نقل‌قول</td>
                <td className="py-2.5 px-3">مقامات دولتی و کارشناسان موافق</td>
                <td className="py-2.5 px-3">اقتصاددانان منتقد و نهادهای مدنی</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">چارچوب تحلیل</td>
                <td className="py-2.5 px-3">مصلحت اقتصاد کلان و مبارزه با رانت</td>
                <td className="py-2.5 px-3">تبعات اجتماعی برای اقشار آسیب‌پذیر</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-on-surface/60 text-xs">واکنش پیش‌بینی‌شده</td>
                <td className="py-2.5 px-3">تأکید بر آرامش و انتظار تطابق عمومی</td>
                <td className="py-2.5 px-3">هشدار درباره نارضایتی اجتماعی</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-bold text-on-surface pt-2">هیچ‌کدام لزوماً دروغ نمی‌گویند</h2>
        <p>
          نکته مهم اینجاست: هیچ‌کدام از این رسانه‌ها لزوماً «دروغ» نمی‌گویند — آن‌ها حقیقت را از زاویه دید خود روایت می‌کنند. هر دو ممکن است اطلاعات دقیق داشته باشند، اما در <em>انتخاب</em> اینکه کدام اطلاعات را برجسته کنند تفاوت اساسی دارند.
        </p>
        <p>
          این پدیده را در علم رسانه «قاب‌بندی» (Framing) می‌نامند. خبرنگار انتخاب می‌کند با چه کلماتی، با نقل‌قول از چه کسی، و با تأکید بر کدام جنبه، خبر را روایت کند. این انتخاب‌ها بی‌طرفانه نیستند — آن‌ها محصول جهان‌بینی و سیاست تحریریه‌ای هر رسانه هستند.
        </p>

        <h2 className="text-lg font-bold text-on-surface pt-2">چطور هوشمندانه‌تر بخوانیم؟</h2>
        <p>
          پالس ایران این تفاوت‌ها را شفاف می‌کند: در کنار هر خبر، گرایش سیاسی منبع مشخص است و اخبار از طیف‌های مختلف کنار هم می‌آیند. چند راهکار عملی:
        </p>
        <ul className="list-disc pr-6 space-y-2">
          <li>
            <strong className="text-on-surface">برای رویدادهای مهم:</strong> هر دو جناح را بخوانید. جایی که روایت‌ها همپوشانی دارند، احتمالاً به واقعیت نزدیک‌تر است.
          </li>
          <li>
            <strong className="text-on-surface">به «سکوت» توجه کنید:</strong> هر رسانه چه چیزی را <em>نمی‌گوید</em>؟ اغلب حذف‌ها آموزنده‌تر از آن چیزی هستند که گفته می‌شود.
          </li>
          <li>
            <strong className="text-on-surface">منبع نقل‌قول‌ها را بررسی کنید:</strong> «کارشناس مستقل» چه سابقه‌ای دارد؟ آیا همیشه در یک جهت اظهارنظر می‌کند؟
          </li>
          <li>
            <strong className="text-on-surface">اعداد را جدا دنبال کنید:</strong> آمارهای اقتصادی و اجتماعی از منابع رسمی مثل مرکز آمار ایران را مستقیم بخوانید و با روایت رسانه‌ها مقایسه کنید.
          </li>
        </ul>

        <p>
          در صفحه هر منبع در پالس ایران، گرایش سیاسی آن را می‌بینید. این برچسب‌ها قضاوت درباره کیفیت یا صداقت آن رسانه نیستند — ابزاری برای خواندن آگاهانه‌تر هستند. هدف ما کمک به شما برای ساختن تصویری کامل‌تر از واقعیت است، نه اینکه به جای شما تصمیم بگیریم کدام رسانه «خوب» است.
        </p>
      </div>
    ),
  },
];

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
