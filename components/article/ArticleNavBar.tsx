"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ArticleNavBar({ title }: { title: string }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  };

  return (
    <div className="sticky top-[104px] z-40 bg-background/95 backdrop-blur-sm border-b border-white/5 flex flex-row-reverse items-center justify-between px-4 py-2.5 md:hidden">
      <button
        onClick={handleBack}
        className="flex items-center gap-1 text-sm text-on-surface-variant active:text-on-surface"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
        برگشت
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 text-sm text-secondary-fixed-dim font-medium"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
        </svg>
        {copied ? "✓ کپی شد" : "اشتراک‌گذاری"}
      </button>
    </div>
  );
}
