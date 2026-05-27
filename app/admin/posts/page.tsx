import { cookies } from "next/headers";
import Link from "next/link";
import { getNews } from "@/lib/api";
import { NewsItem } from "@/lib/types";

async function fetchPosts(token: string, page: number): Promise<{ items: NewsItem[]; has_more: boolean }> {
  try {
    const data = await getNews(page, 50);
    return data;
  } catch {
    return { items: [], has_more: false };
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  return `${Math.floor(hrs / 24)} روز پیش`;
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1", 10);
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value ?? "";
  const { items, has_more } = await fetchPosts(token, page);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-row-reverse items-center justify-between">
        <h1 className="text-title-md font-title-md text-on-surface">پست‌های منتشر شده</h1>
        <span className="text-on-surface-variant text-sm">صفحه {page.toLocaleString("fa-IR")}</span>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-on-surface-variant">
              <th className="text-right p-4 font-label-sm text-label-sm">عنوان</th>
              <th className="text-right p-4 font-label-sm text-label-sm">منبع</th>
              <th className="text-right p-4 font-label-sm text-label-sm">زمان</th>
              <th className="text-right p-4 font-label-sm text-label-sm">نوع</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id} className="border-b border-white/5 hover:bg-surface-container-high transition-colors">
                <td className="p-4">
                  <Link href={`/article/${encodeURIComponent(item.item_id)}`} target="_blank" className="text-on-surface hover:text-secondary-fixed-dim transition-colors line-clamp-1">
                    {item.title || item.item_id}
                  </Link>
                </td>
                <td className="p-4 text-on-surface-variant">{item.source}</td>
                <td className="p-4 text-on-surface-variant whitespace-nowrap">{timeAgo(item.posted_at)}</td>
                <td className="p-4">
                  {item.is_breaking ? (
                    <span className="px-2 py-0.5 bg-secondary-fixed-dim/20 text-secondary-fixed-dim text-label-sm font-label-sm rounded">فوری</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-label-sm font-label-sm rounded">عادی</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4">
        {page > 1 && (
          <Link href={`/admin/posts?page=${page - 1}`} className="px-4 py-2 bg-surface-container rounded-lg text-sm hover:bg-surface-container-high">قبلی</Link>
        )}
        {has_more && (
          <Link href={`/admin/posts?page=${page + 1}`} className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold">بعدی</Link>
        )}
      </div>
    </div>
  );
}
