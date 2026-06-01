import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "حریم خصوصی",
  description: "سیاست حریم خصوصی پالس ایران — نحوه جمع‌آوری، استفاده و حفاظت از داده‌های کاربران",
  alternates: { canonical: `${SITE_URL}/privacy`, languages: { fa: `${SITE_URL}/privacy`, "x-default": `${SITE_URL}/privacy` } },
};

export default function PrivacyPage() {
  return (
    <div className="cyber-grid" dir="rtl">
      <main className="max-w-3xl mx-auto px-container-margin py-section-gap">
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-8">سیاست حریم خصوصی</h1>
        <div className="prose-invert space-y-6 text-on-surface-variant leading-relaxed text-sm">
          <p>
            پالس ایران (<Link href="/" className="text-secondary-fixed-dim hover:underline">palsiran.com</Link>) به حفاظت از حریم خصوصی کاربران خود متعهد است. این سند نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات شما را شرح می‌دهد.
          </p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">اطلاعات جمع‌آوری‌شده</h2>
          <p>ما هیچ اطلاعات شخصی شناسایی‌کننده‌ای از کاربران جمع‌آوری نمی‌کنیم. سایت نیازی به ثبت‌نام یا ورود ندارد.</p>
          <ul className="list-disc pr-6 space-y-2">
            <li><strong>داده‌های تحلیلی:</strong> از Google Analytics (GA4) برای درک الگوهای بازدید استفاده می‌شود. این داده‌ها ناشناس و تجمیعی هستند.</li>
            <li><strong>ذخیره‌سازی محلی:</strong> اخبار ذخیره‌شده شما فقط در مرورگر خودتان (localStorage) نگهداری می‌شود و به سرور ارسال نمی‌شود.</li>
            <li><strong>کوکی‌ها:</strong> فقط کوکی‌های فنی ضروری (Cloudflare و GA4) استفاده می‌شود.</li>
          </ul>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">استفاده از داده‌ها</h2>
          <p>داده‌های تحلیلی صرفا برای بهبود تجربه کاربری و درک محتوای پرمخاطب استفاده می‌شوند. هیچ داده‌ای به اشخاص ثالث فروخته یا به اشتراک گذاشته نمی‌شود.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">محتوای تجمیع‌شده</h2>
          <p>اخبار منتشرشده در پالس ایران از منابع عمومی تلگرام و خبرگزاری‌ها تجمیع می‌شود. هر خبر با ذکر منبع اصلی و لینک به آن منتشر می‌شود.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">حقوق کاربران</h2>
          <p>شما حق دارید اخبار ذخیره‌شده خود را در هر زمان از مرورگر پاک کنید. چون هیچ حساب کاربری وجود ندارد، داده شخصی قابل حذف از سرور نیز وجود ندارد.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">تماس</h2>
          <p>برای هرگونه سوال درباره حریم خصوصی، با ما از طریق ایمیل <a href="mailto:info@palsiran.com" className="text-secondary-fixed-dim hover:underline">info@palsiran.com</a> تماس بگیرید.</p>

          <p className="text-xs text-on-surface-variant/60 pt-6">آخرین به‌روزرسانی: خرداد ۱۴۰۵</p>
        </div>
      </main>

      <div className="md:hidden"><MobileFooter /></div>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}
