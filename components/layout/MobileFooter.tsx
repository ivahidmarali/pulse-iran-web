import Link from "next/link";

export default function MobileFooter() {
  return (
    <footer className="bg-surface-container border-t border-white/5 px-container-margin pt-6 pb-24 md:hidden">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] text-outline">@palsiran</span>
        <span className="text-sm font-bold text-secondary-fixed-dim">پالس ایران</span>
      </div>
      <div className="flex flex-row-reverse flex-wrap gap-x-4 gap-y-1 text-[11px] text-on-surface-variant">
        <Link href="/" className="hover:text-on-surface transition-colors">خانه</Link>
        <Link href="/categories" className="hover:text-on-surface transition-colors">دسته‌بندی</Link>
        <Link href="/prices" className="hover:text-on-surface transition-colors">نرخ ارز</Link>
        <Link href="/about" className="hover:text-on-surface transition-colors">درباره ما</Link>
      </div>
      <p className="text-[10px] text-outline/60 mt-3 text-center">تمامی حقوق محفوظ است</p>
    </footer>
  );
}
