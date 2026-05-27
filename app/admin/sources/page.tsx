import { getSources } from "@/lib/api";
import { SourceInfo } from "@/lib/types";

async function fetchSources(): Promise<SourceInfo[]> {
  try {
    return await getSources();
  } catch {
    return [];
  }
}

const LEAN_BADGE: Record<string, string> = {
  "اصول‌گرا": "bg-green-500/20 text-green-400",
  "اصلاح‌طلب": "bg-blue-500/20 text-blue-400",
  "لیبرال غربی": "bg-red-500/20 text-red-400",
  "مستقل": "bg-outline/20 text-outline",
};

export default async function AdminSourcesPage() {
  const sources = await fetchSources();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-title-md font-title-md text-on-surface">منابع خبری</h1>
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-on-surface-variant">
              <th className="text-right p-4 font-label-sm text-label-sm">منبع</th>
              <th className="text-right p-4 font-label-sm text-label-sm">کانال تلگرام</th>
              <th className="text-right p-4 font-label-sm text-label-sm">جهت‌گیری</th>
              <th className="text-right p-4 font-label-sm text-label-sm">اعتبار</th>
              <th className="text-right p-4 font-label-sm text-label-sm">سقف روزانه</th>
              <th className="text-right p-4 font-label-sm text-label-sm">امروز</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((src) => {
              const leanCls = LEAN_BADGE[src.political_lean ?? ""] ?? "bg-outline/20 text-outline";
              return (
                <tr key={src.name} className="border-b border-white/5 hover:bg-surface-container-high transition-colors">
                  <td className="p-4 font-medium text-on-surface">{src.name}</td>
                  <td className="p-4 text-on-surface-variant">{src.telegram_channel ?? "—"}</td>
                  <td className="p-4">
                    {src.political_lean ? (
                      <span className={`px-2 py-0.5 rounded text-label-sm font-label-sm ${leanCls}`}>{src.political_lean}</span>
                    ) : (
                      <span className="text-outline">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-fixed-dim/60 rounded-full" style={{ width: `${(src.credibility ?? 5) * 10}%` }} />
                      </div>
                      <span className="text-on-surface-variant">{src.credibility ?? 5}/۱۰</span>
                    </div>
                  </td>
                  <td className="p-4 text-on-surface-variant">{src.max_per_day ?? 3}</td>
                  <td className="p-4">
                    <span className={`font-bold ${(src.today_count ?? 0) >= (src.max_per_day ?? 3) ? "text-error" : "text-green-400"}`}>
                      {src.today_count ?? 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
