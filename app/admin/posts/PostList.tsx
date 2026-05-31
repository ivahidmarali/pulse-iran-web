"use client";
import { useState } from "react";
import Link from "next/link";

interface PostItem {
  item_id: string;
  title: string;
  source: string;
  posted_at: string;
  is_breaking?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ساعت پیش`;
  return `${Math.floor(hrs / 24)} روز پیش`;
}

function extractItemId(url: string): string | null {
  const match = url.match(/\/article\/([^/]+)/);
  if (match) return decodeURIComponent(match[1]);
  return null;
}

export default function PostList({
  initialItems,
  token,
  page,
  hasMore,
}: {
  initialItems: PostItem[];
  token: string;
  page: number;
  hasMore: boolean;
}) {
  const [items, setItems] = useState(initialItems);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlStatus, setUrlStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleDelete(itemId: string) {
    if (!confirm("این خبر حذف شود؟")) return;
    setDeleting(itemId);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(itemId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.item_id !== itemId));
      } else {
        alert("خطا در حذف");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setDeleting(null);
    }
  }

  async function handleUrlDelete() {
    const id = extractItemId(urlInput.trim());
    if (!id) {
      setUrlStatus({ ok: false, msg: "لینک نامعتبر — فرمت: /article/{id}/..." });
      return;
    }
    if (!confirm(`حذف خبر با شناسه:\n${id}`)) return;
    setDeleting(id);
    setUrlStatus(null);
    try {
      const res = await fetch(`/api/admin/posts/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.item_id !== id));
        setUrlInput("");
        setUrlStatus({ ok: true, msg: "حذف شد" });
      } else {
        setUrlStatus({ ok: false, msg: `خطا: ${res.status}` });
      }
    } catch {
      setUrlStatus({ ok: false, msg: "خطا در ارتباط با سرور" });
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-row-reverse items-center justify-between">
        <h1 className="text-title-md font-title-md text-on-surface">پست‌های منتشر شده</h1>
        <span className="text-on-surface-variant text-sm">صفحه {page.toLocaleString("fa-IR")}</span>
      </div>

      {/* URL delete box */}
      <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => { setUrlInput(e.target.value); setUrlStatus(null); }}
          placeholder="لینک خبر را paste کنید..."
          className="flex-1 bg-surface-container border border-white/10 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:border-secondary-fixed-dim transition-colors"
          dir="ltr"
        />
        <button
          onClick={handleUrlDelete}
          disabled={!urlInput.trim() || deleting !== null}
          className="px-5 py-2.5 bg-error/80 text-on-error rounded-lg text-sm font-bold hover:bg-error transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          حذف با لینک
        </button>
        {urlStatus && (
          <span className={`text-sm ${urlStatus.ok ? "text-green-400" : "text-error"}`}>
            {urlStatus.msg}
          </span>
        )}
      </div>

      {/* Posts table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-on-surface-variant">
              <th className="text-right p-4 font-label-sm text-label-sm">عنوان</th>
              <th className="text-right p-4 font-label-sm text-label-sm">منبع</th>
              <th className="text-right p-4 font-label-sm text-label-sm">زمان</th>
              <th className="text-right p-4 font-label-sm text-label-sm">نوع</th>
              <th className="text-center p-4 font-label-sm text-label-sm w-20">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id} className="border-b border-white/5 hover:bg-surface-container-high transition-colors">
                <td className="p-4">
                  <Link
                    href={`/article/${encodeURIComponent(item.item_id)}`}
                    target="_blank"
                    className="text-on-surface hover:text-secondary-fixed-dim transition-colors line-clamp-1"
                  >
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
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDelete(item.item_id)}
                    disabled={deleting === item.item_id}
                    className="px-3 py-1 bg-error/20 text-error rounded text-label-sm font-bold hover:bg-error/40 transition-colors disabled:opacity-40"
                  >
                    {deleting === item.item_id ? "..." : "حذف"}
                  </button>
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
        {hasMore && (
          <Link href={`/admin/posts?page=${page + 1}`} className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold">بعدی</Link>
        )}
      </div>
    </div>
  );
}
