import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest border-t border-white/10 w-full py-section-gap px-container-margin">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-section-gap text-right">
        {/* Logo + tagline */}
        <div className="space-y-4">
          <div className="text-headline-lg font-headline-lg text-secondary-fixed-dim">پالس ایران</div>
          <p className="text-on-surface-variant text-sm leading-loose">
            مرجع اخبار فوری<br />بی‌طرف از همه منابع
          </p>
        </div>

        {/* Quick access */}
        <div className="space-y-3">
          <h3 className="text-white font-bold mb-4">دسترسی سریع</h3>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            {[
              ["صفحه اصلی", "/"],
              ["قیمت ارز", "/prices"],
              ["آرشیو", "/archive"],
              ["درباره ما", "/about"],
              ["حریم خصوصی", "/privacy"],
              ["شرایط استفاده", "/terms"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-on-surface transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-white font-bold mb-4">دسته‌بندی‌ها</h3>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            {[
              ["سیاسی", "سیاسی"],
              ["اقتصادی", "اقتصادی"],
              ["ورزشی", "ورزشی"],
              ["جنگ و بحران", "جنگ و بحران"],
            ].map(([label, cat]) => (
              <li key={cat}>
                <Link href={`/categories?cat=${encodeURIComponent(cat)}`} className="hover:text-on-surface transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Telegram */}
        <div className="space-y-4">
          <h3 className="text-white font-bold mb-4">کانال تلگرام</h3>
          <p className="text-on-surface-variant text-sm">@palsiran</p>
          <a
            href="https://t.me/palsiran"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#229ED9] text-white px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            عضویت در کانال
          </a>
        </div>
      </div>

      <div className="text-center mt-8 pt-6 border-t border-white/5">
        <p className="text-outline text-xs opacity-80">© ۱۴۰۴ پالس ایران — تمامی حقوق محفوظ است | <a href="mailto:info@palsiran.com" className="hover:text-on-surface-variant transition-colors">info@palsiran.com</a></p>
      </div>
    </footer>
  );
}
