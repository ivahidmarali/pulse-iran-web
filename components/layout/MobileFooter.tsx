import Link from "next/link";

export default function MobileFooter() {
  return (
    <footer className="bg-surface-container border-t border-white/5 px-container-margin pt-6 pb-24 md:hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <a href="https://t.me/palsiran" target="_blank" rel="noopener noreferrer" className="text-[10px] text-outline hover:text-on-surface-variant transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">تلگرام</a>
          <a href="https://x.com/palsiran_news" target="_blank" rel="noopener noreferrer" className="text-[10px] text-outline hover:text-on-surface-variant transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">𝕏</a>
          <a href="https://www.youtube.com/@palsiran" target="_blank" rel="noopener noreferrer" className="text-[10px] text-outline hover:text-on-surface-variant transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">یوتیوب</a>
          <a href="/feed.xml" className="text-[10px] text-outline hover:text-on-surface-variant transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">RSS</a>
        </div>
        <span className="text-sm font-bold text-secondary-fixed-dim">پالس ایران</span>
      </div>
      <div className="flex flex-row-reverse flex-wrap gap-x-4 gap-y-1 text-[11px] text-on-surface-variant">
        <Link href="/" className="hover:text-on-surface transition-colors">خانه</Link>
        <Link href="/categories" className="hover:text-on-surface transition-colors">دسته‌بندی</Link>
        <Link href="/prices" className="hover:text-on-surface transition-colors">نرخ ارز</Link>
        <Link href="/about" className="hover:text-on-surface transition-colors">درباره ما</Link>
        <Link href="/privacy" className="hover:text-on-surface transition-colors">حریم خصوصی</Link>
        <Link href="/terms" className="hover:text-on-surface transition-colors">شرایط</Link>
      </div>
      <p className="text-[10px] text-on-surface-variant mt-3 text-center">تمامی حقوق محفوظ است | info@palsiran.com</p>
    </footer>
  );
}
