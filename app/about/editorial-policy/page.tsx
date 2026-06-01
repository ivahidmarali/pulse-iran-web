import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { SITE_URL, safeJsonLd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "اصول تحریریه",
  description:
    "اصول و روش‌شناسی تحریریه پالس ایران — نحوه انتخاب منابع، طبقه‌بندی گرایش سیاسی، خلاصه‌سازی با هوش مصنوعی، و سیاست اصلاح اخبار",
  alternates: {
    canonical: `${SITE_URL}/about/editorial-policy`,
    languages: {
      fa: `${SITE_URL}/about/editorial-policy`,
      "x-default": `${SITE_URL}/about/editorial-policy`,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/about/editorial-policy`,
  name: "اصول تحریریه پالس ایران",
  description: "روش‌شناسی انتخاب منابع، طبقه‌بندی گرایش سیاسی، و سیاست تحریریه پالس ایران",
  url: `${SITE_URL}/about/editorial-policy`,
  inLanguage: "fa",
  publisher: { "@id": `${SITE_URL}/#organization` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "صفحه اصلی", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "درباره ما", item: `${SITE_URL}/about` },
      { "@type": "ListItem", position: 3, name: "اصول تحریریه" },
    ],
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <main className="max-w-3xl mx-auto px-container-margin py-section-gap">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8">
          <Link href="/" className="hover:text-secondary-fixed-dim">صفحه اصلی</Link>
          <span>/</span>
          <Link href="/about" className="hover:text-secondary-fixed-dim">درباره ما</Link>
          <span>/</span>
          <span className="text-on-surface">اصول تحریریه</span>
        </nav>

        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-8">اصول تحریریه</h1>

        <div className="prose-invert space-y-8 text-on-surface-variant leading-relaxed text-sm">

          <p>
            پالس ایران یک سامانه تجمیع اخبار است، نه یک رسانه خبری با تحریریه سنتی. با این حال، برای اطمینان از شفافیت و اعتماد کاربران، این سند روش‌شناسی دقیق ما در انتخاب منابع، طبقه‌بندی گرایش سیاسی، و پردازش محتوا را توضیح می‌دهد.
          </p>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۱. معیارهای انتخاب منابع</h2>
            <p className="mb-3">منابع خبری پالس ایران بر اساس معیارهای زیر انتخاب می‌شوند:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li><strong className="text-on-surface">انتشار منظم:</strong> منبع باید به صورت فعال و مستمر اخبار منتشر کند.</li>
              <li><strong className="text-on-surface">شناسایی‌پذیری:</strong> هویت منبع باید قابل شناسایی باشد — کانال تلگرامی شناخته‌شده، خبرگزاری ثبت‌شده، یا رسانه با سابقه مشخص.</li>
              <li><strong className="text-on-surface">تنوع گرایش:</strong> برای حفظ تعادل، از هر طیف سیاسی حداقل چند منبع انتخاب می‌شود.</li>
              <li><strong className="text-on-surface">کیفیت محتوا:</strong> منابعی که صرفاً شایعات یا محتوای بدون منبع منتشر می‌کنند، در فهرست قرار نمی‌گیرند.</li>
            </ul>
            <p className="mt-3">
              منابع جدید به صورت دوره‌ای بررسی و اضافه می‌شوند. فهرست کامل منابع فعال را می‌توانید در صفحه <Link href="/sources" className="text-secondary-fixed-dim hover:underline">منابع خبری</Link> مشاهده کنید.
            </p>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۲. طبقه‌بندی گرایش سیاسی</h2>
            <p className="mb-3">
              هر منبع بر اساس بررسی سابقه تحریریه، مواضع رسمی مدیران و صاحبان رسانه، الگوی پوشش رویدادهای کلیدی، و منبع تأمین مالی در یکی از ۱۱ دسته گرایش سیاسی طبقه‌بندی می‌شود:
            </p>
            <ul className="list-disc pr-6 space-y-1.5">
              {[
                ["رسمی دولتی", "rasmi-dolati"],
                ["اصولگرا", "osoulgarayan"],
                ["محافظه‌کار میانه", "mohafezeh-kar-mianeh"],
                ["اصلاح‌طلب", "eslah-talab"],
                ["اصلاح‌طلب میانه", "eslah-talab-mianeh"],
                ["مستقل", "mostaghel"],
                ["لیبرال غربی", "liberal-gharbi"],
                ["لیبرال آمریکایی", "liberal-amrikai"],
                ["چپ لیبرال", "chap-liberal"],
                ["مخالف جمهوری اسلامی", "mokhalef-jomhouri-eslami"],
                ["محافظه‌کار عربی", "mohafezeh-kar-arabi"],
              ].map(([name, slug]) => (
                <li key={slug}>
                  <Link href={`/lean/${slug}`} className="text-secondary-fixed-dim hover:underline">{name}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              این طبقه‌بندی توصیفی است، نه ارزش‌گذارانه. هدف آن کمک به کاربران برای شناخت زاویه دید هر منبع است، نه قضاوت درباره کیفیت یا درستی آن. طبقه‌بندی‌ها به صورت دوره‌ای بازبینی می‌شوند.
            </p>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۳. خلاصه‌سازی با هوش مصنوعی</h2>
            <p className="mb-3">
              خلاصه اخبار با استفاده از مدل‌های زبانی بزرگ (LLM) تولید می‌شود. فرایند کار به این شکل است:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>متن کامل خبر از منبع اصلی استخراج می‌شود.</li>
              <li>مدل هوش مصنوعی یک خلاصه حداقل ۱۵۰ کلمه‌ای تولید می‌کند.</li>
              <li>خلاصه باید اطلاعات اصلی خبر را بدون افزودن تفسیر یا نظر منعکس کند.</li>
              <li>لینک مستقیم به متن کامل در منبع اصلی همیشه حفظ می‌شود.</li>
            </ul>
            <p className="mt-3 text-xs text-on-surface-variant/70">
              توجه: خلاصه‌ها توسط هوش مصنوعی تولید می‌شوند و ممکن است خطا داشته باشند. همیشه منبع اصلی را برای اطمینان مطالعه کنید.
            </p>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۴. امتیاز اعتبار منابع</h2>
            <p>
              هر منبع یک امتیاز اعتبار از ۰ تا ۱۰۰ دریافت می‌کند که بر اساس ثبات انتشار، دقت تاریخی خبرهای تأیید‌شده، و شفافیت درباره هویت صاحبان رسانه تعیین می‌شود. این امتیاز در صفحه هر منبع قابل مشاهده است و به کاربران کمک می‌کند اخبار را در زمینه اعتبار منبع ارزیابی کنند.
            </p>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۵. تأیید چندمنبعه</h2>
            <p>
              وقتی یک خبر از سه یا بیشتر منبع مستقل تأیید شود، نشانه «تأیید شده» در صفحه مقاله نمایش داده می‌شود. این سیستم به کاربران کمک می‌کند اخباری را که پشتوانه خبری بیشتری دارند از اخبار تک‌منبعی تشخیص دهند. تأیید چندمنبعه به معنای صحت قطعی خبر نیست.
            </p>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۶. آنچه منتشر نمی‌کنیم</h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>محتوای تبلیغاتی یا اسپانسرشده بدون برچسب مشخص</li>
              <li>اخبار صرفاً مبتنی بر شایعه بدون منبع قابل شناسایی</li>
              <li>محتوایی که آشکارا نفرت‌پراکنی یا تحریک به خشونت می‌کند</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۷. سیاست اصلاح و حذف</h2>
            <p>
              اگر خبری که از طریق پالس ایران منتشر شده حاوی اطلاعات نادرست است یا نقض حریم خصوصی می‌کند، می‌توانید از طریق ایمیل <a href="mailto:info@palsiran.com" className="text-secondary-fixed-dim hover:underline">info@palsiran.com</a> با ما تماس بگیرید. درخواست‌های معتبر ظرف ۴۸ ساعت بررسی می‌شوند.
            </p>
          </section>

          <section>
            <h2 className="text-title-md font-title-md text-on-surface pt-2 mb-3">۸. استقلال از منابع</h2>
            <p>
              پالس ایران هیچ‌گونه وابستگی مالی، سیاسی، یا سازمانی به هیچ‌یک از منابع خبری موجود در سیستم ندارد. منابع جدید صرفاً بر اساس معیارهای ذکرشده اضافه می‌شوند، نه بر اساس درخواست یا پرداخت مالی. این استقلال، پایه اعتماد ما با کاربران است.
            </p>
          </section>

          <p className="text-xs text-on-surface-variant/60 pt-4">
            آخرین به‌روزرسانی: خرداد ۱۴۰۵ — برای سؤال یا بازخورد: <a href="mailto:info@palsiran.com" className="text-secondary-fixed-dim hover:underline">info@palsiran.com</a>
          </p>
        </div>
      </main>

      <div className="md:hidden"><MobileFooter /></div>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}
