import BottomNav from "@/components/layout/BottomNav";
import TopBarMobile from "@/components/layout/TopBarMobile";
import TopBarDesktop from "@/components/layout/TopBarDesktop";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import { getSources } from "@/lib/api";
import { SourceInfo } from "@/lib/types";

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
    <div className="min-h-screen cyber-grid">
      <div className="md:hidden">
        <TopBarMobile />
      </div>
      <div className="hidden md:block">
        <TopBarDesktop />
      </div>

      <main className="pb-24 md:pb-0">
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
            <h2 className="text-display-lg font-display-lg text-on-surface mb-8 leading-tight">
              بی‌طرف، از همه منابع،{" "}
              <span className="text-secondary-fixed-dim">بدون سانسور</span>
            </h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant mb-12 leading-relaxed">
              پالس ایران به عنوان یک مرکز پایش داده و اخبار، مأموریت دارد تا بدون پیش‌فرض‌های سیاسی، تمامی جریان‌های خبری را در یک قاب واحد به نمایش بگذارد. ما معتقدیم آگاهی کامل تنها از طریق دسترسی به تنوع آرا میسر است.
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
              href="https://t.me/pulse_iran"
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
        <BottomNav />
      </div>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
