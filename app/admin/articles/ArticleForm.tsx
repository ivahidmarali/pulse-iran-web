"use client";
import { useState } from "react";
import { articleHref } from "@/lib/utils";

const INPUT =
  "w-full bg-surface-container border border-white/10 rounded-lg px-4 py-2.5 text-on-surface text-sm focus:outline-none focus:border-secondary-fixed-dim transition-colors";

export default function ArticleForm({ token }: { token: string }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("🎭 فرهنگ و هنر");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string; href?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, summary, body, category, image_url: imageUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus({ ok: true, msg: "مقاله منتشر شد", href: articleHref(data.item_id, title) });
      } else {
        setStatus({ ok: false, msg: data.detail ?? `خطا (${res.status})` });
      }
    } catch {
      setStatus({ ok: false, msg: "خطا در ارتباط با سرور" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} dir="rtl" className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-on-surface">انتشار مقاله جدید</h1>
      <input className={INPUT} placeholder="تیتر" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea
        className={`${INPUT} h-24`}
        placeholder="لید / خلاصه کوتاه (اختیاری — در صورت خالی بودن از پاراگراف اول ساخته می‌شود)"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <textarea
        className={`${INPUT} h-96 font-mono leading-7`}
        placeholder={"متن مقاله — پشتیبانی از: ## تیتر دوم، ### تیتر سوم، **پررنگ**، [متن لینک](https://...)"}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <div className="grid md:grid-cols-2 gap-4">
        <input className={INPUT} placeholder="دسته‌بندی" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className={INPUT} dir="ltr" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="px-6 py-2.5 bg-secondary-container text-on-secondary-container rounded-lg text-sm font-bold disabled:opacity-40"
      >
        {busy ? "در حال انتشار…" : "انتشار"}
      </button>
      {status && (
        <p className={status.ok ? "text-secondary-fixed-dim text-sm" : "text-error text-sm"}>
          {status.msg}
          {status.href && (
            <>
              {" — "}
              <a href={status.href} target="_blank" className="underline">مشاهده</a>
            </>
          )}
        </p>
      )}
    </form>
  );
}
