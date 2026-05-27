"use client";

interface Props {
  title: string;
  sourceUrl?: string;
  source: string;
}

export default function ArticleActions({ title, sourceUrl, source }: Props) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("لینک کپی شد");
    }
  };

  const handleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem("saved_articles") || "[]");
      if (!saved.includes(window.location.pathname)) {
        saved.push(window.location.pathname);
        localStorage.setItem("saved_articles", JSON.stringify(saved));
      }
      alert("ذخیره شد");
    } catch {
      alert("ذخیره شد");
    }
  };

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.href : ""
  )}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary-fixed-dim transition-colors text-sm"
      >
        <span>📤</span>
        <span className="hidden sm:inline">اشتراک‌گذاری</span>
      </button>
      <button
        onClick={handleBookmark}
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary-fixed-dim transition-colors text-sm"
      >
        <span>🔖</span>
        <span className="hidden sm:inline">ذخیره</span>
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary-fixed-dim transition-colors text-sm"
      >
        <span>🖨</span>
        <span className="hidden sm:inline">چاپ</span>
      </button>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary-fixed-dim transition-colors text-sm"
      >
        <span>📨</span>
        <span className="hidden sm:inline">تلگرام</span>
      </a>
    </div>
  );
}
