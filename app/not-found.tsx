import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "صفحه یافت نشد",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="cyber-grid flex items-center justify-center min-h-[60vh]" dir="rtl">
      <div className="text-center px-6">
        <p className="text-6xl font-black text-secondary-fixed-dim mb-4">۴۰۴</p>
        <h1 className="text-xl font-bold text-on-surface mb-2">صفحه یافت نشد</h1>
        <p className="text-sm text-on-surface-variant mb-8">
          صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا جابه‌جا شده است.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary-fixed-dim text-on-secondary-fixed rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
