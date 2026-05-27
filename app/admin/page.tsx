import { cookies } from "next/headers";
import { getAdminStats } from "@/lib/api";
import { AdminStats } from "@/lib/types";

async function fetchStats(token: string): Promise<AdminStats | null> {
  try {
    return await getAdminStats(token);
  } catch {
    return null;
  }
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value ?? "";
  const stats = await fetchStats(token);

  if (!stats) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-[48px] block mb-3">error</span>
        <p>خطا در بارگذاری آمار</p>
      </div>
    );
  }

  const cards = [
    { label: "پست امروز", value: stats.today_posts, icon: "check_circle", color: "text-green-400" },
    { label: "کل پست‌ها", value: stats.total_posts, icon: "inventory", color: "text-secondary-fixed-dim" },
    { label: "منابع فعال", value: stats.sources_active, icon: "hub", color: "text-tertiary" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-title-md font-title-md text-on-surface">داشبورد</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon, color }) => (
          <div key={label} className="glass-card rounded-xl p-6 flex items-center gap-4">
            <span className={`material-symbols-outlined text-[36px] ${color}`}>{icon}</span>
            <div>
              <div className="text-2xl font-black text-on-surface">{value.toLocaleString("fa-IR")}</div>
              <div className="text-label-sm text-on-surface-variant">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source breakdown */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-title-md font-title-md mb-4 border-r-4 border-secondary-fixed-dim pr-3">توزیع امروز</h2>
          <div className="space-y-3">
            {stats.source_breakdown.map(({ source, count }) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm text-on-surface">{source}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-fixed-dim/60 rounded-full"
                      style={{ width: `${Math.min(100, (count / stats.today_posts) * 100)}%` }}
                    />
                  </div>
                  <span className="text-label-sm text-on-surface-variant w-6 text-left">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily history */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-title-md font-title-md mb-4 border-r-4 border-secondary-fixed-dim pr-3">تاریخچه ۷ روز</h2>
          <div className="flex items-end gap-2 h-32">
            {stats.daily_history.slice(-7).map(({ date, post_count }) => {
              const max = Math.max(...stats.daily_history.slice(-7).map((d) => d.post_count), 1);
              const pct = (post_count / max) * 100;
              return (
                <div key={date} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full bg-secondary-fixed-dim/40 rounded-t hover:bg-secondary-fixed-dim/60 transition-colors cursor-default"
                    style={{ height: `${pct}%` }}
                    title={`${date}: ${post_count} پست`}
                  />
                  <span className="text-[10px] text-on-surface-variant">{post_count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
