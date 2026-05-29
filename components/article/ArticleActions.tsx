"use client";

import { useState, useEffect } from "react";

interface SavedNews {
  id: string;
  title: string;
  source: string;
  url: string;
}

interface Props {
  title: string;
  itemId: string;
  source: string;
}

export default function ArticleActions({ title, itemId, source }: Props) {
  const [saved, setSaved] = useState(false);
  const [saveLabel, setSaveLabel] = useState("ذخیره");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const list: SavedNews[] = JSON.parse(localStorage.getItem("saved_news") || "[]");
    setSaved(list.some((n) => n.id === itemId));
    setSaveLabel(list.some((n) => n.id === itemId) ? "حذف از ذخیره‌شده‌ها" : "ذخیره");
  }, [itemId]);

  const toggleSave = () => {
    const existing: SavedNews[] = JSON.parse(localStorage.getItem("saved_news") || "[]");
    if (saved) {
      const updated = existing.filter((n) => n.id !== itemId);
      localStorage.setItem("saved_news", JSON.stringify(updated));
      setSaved(false);
      setSaveLabel("ذخیره");
    } else {
      const updated = [...existing, { id: itemId, title, source, url: window.location.href }].slice(-50);
      localStorage.setItem("saved_news", JSON.stringify(updated));
      setSaved(true);
      setSaveLabel("ذخیره شد ✓");
      setTimeout(() => setSaveLabel("حذف از ذخیره‌شده‌ها"), 2000);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = { title, url };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or error — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("لینک را کپی کنید:", url);
    }
  };

  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleShare}
        className="px-3 py-2 bg-gray-800 rounded text-sm text-gray-300 hover:bg-gray-700 transition-colors"
      >
        {copied ? "✓ کپی شد" : "اشتراک‌گذاری"}
      </button>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-2 bg-cyan-700 rounded text-sm text-white hover:bg-cyan-600 transition-colors"
      >
        ارسال در تلگرام
      </a>
      <button
        onClick={toggleSave}
        className={`px-3 py-2 rounded text-sm transition-colors ${
          saved
            ? "bg-green-800 text-green-200 hover:bg-red-800 hover:text-red-200"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        {saveLabel}
      </button>
      <button
        onClick={() => window.print()}
        className="px-3 py-2 bg-gray-800 rounded text-sm text-gray-300 hover:bg-gray-700 transition-colors"
      >
        چاپ
      </button>
    </div>
  );
}
