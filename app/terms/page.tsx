import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export const metadata: Metadata = {
  title: "شرایط استفاده",
  description: "شرایط و قوانین استفاده از سایت پالس ایران — حقوق و مسئولیت‌های کاربران",
};

export default function TermsPage() {
  return (
    <div className="cyber-grid" dir="rtl">
      <main className="max-w-3xl mx-auto px-container-margin py-section-gap">
        <h1 className="text-headline-lg font-headline-lg text-on-surface mb-8">شرایط استفاده</h1>
        <div className="prose-invert space-y-6 text-on-surface-variant leading-relaxed text-sm">
          <p>
            با استفاده از وبسایت پالس ایران (<Link href="/" className="text-secondary-fixed-dim hover:underline">palsiran.com</Link>) شما شرایط زیر را می‌پذیرید.
          </p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">ماهیت خدمات</h2>
          <p>پالس ایران یک سامانه تجمیع اخبار است که محتوا را از بیش از ۴۵ منبع خبری داخلی و خارجی جمع‌آوری و بازنشر می‌کند. ما تولیدکننده محتوای اصلی نیستیم و مسئولیت صحت محتوای منابع اصلی بر عهده ما نیست.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">مالکیت محتوا</h2>
          <p>حقوق هر خبر متعلق به منبع اصلی آن است. پالس ایران صرفا نقش واسطه اطلاع‌رسانی را ایفا می‌کند. طراحی سایت، سیستم دسته‌بندی و تحلیل گرایش سیاسی منابع، مالکیت معنوی پالس ایران است.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">استفاده مجاز</h2>
          <ul className="list-disc pr-6 space-y-2">
            <li>مطالعه و اشتراک‌گذاری اخبار برای مصارف شخصی و غیرتجاری مجاز است.</li>
            <li>اسکرپ کردن خودکار محتوا بدون مجوز کتبی ممنوع است.</li>
            <li>استفاده از محتوا برای آموزش مدل‌های هوش مصنوعی ممنوع است.</li>
          </ul>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">سلب مسئولیت</h2>
          <p>اخبار و نرخ‌های ارز به صورت «همان‌طور که هست» ارائه می‌شوند. پالس ایران هیچ تضمینی درباره صحت، کامل بودن یا به‌روز بودن اطلاعات نمی‌دهد. تصمیمات مالی بر اساس نرخ‌های نمایش‌داده‌شده بر عهده خود کاربر است.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">تغییرات</h2>
          <p>پالس ایران حق تغییر این شرایط را در هر زمان برای خود محفوظ می‌دارد. ادامه استفاده از سایت به منزله پذیرش شرایط جدید است.</p>

          <h2 className="text-title-md font-title-md text-on-surface pt-4">تماس</h2>
          <p>برای هرگونه سوال، با ما از طریق ایمیل <a href="mailto:info@palsiran.com" className="text-secondary-fixed-dim hover:underline">info@palsiran.com</a> تماس بگیرید.</p>

          <p className="text-xs text-on-surface-variant/60 pt-6">آخرین به‌روزرسانی: خرداد ۱۴۰۵</p>
        </div>
      </main>

      <div className="md:hidden"><MobileFooter /></div>
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}
