"use client";

import { useState } from "react";
import { NewsItem } from "@/lib/types";
import NewsCard from "@/components/news/NewsCard";
import { CATEGORY_GROUPS } from "@/lib/categories";

interface Props {
  allNews: NewsItem[];
}

const ALL_LABEL = "همه";

export default function MobileCategoryFeed({ allNews }: Props) {
  const [activeGroup, setActiveGroup] = useState<string>(ALL_LABEL);

  const groups = [ALL_LABEL, ...Object.keys(CATEGORY_GROUPS).filter((g) => g !== "همه")];

  const filtered =
    activeGroup === ALL_LABEL
      ? allNews
      : allNews.filter((item) => {
          if (!item.category) return false;
          const groupCats = CATEGORY_GROUPS[activeGroup]?.categories ?? [];
          return groupCats.some((cat) => {
            const prefix = cat.indexOf(" ") > 0 ? cat.slice(0, cat.indexOf(" ")) : cat;
            return item.category?.startsWith(prefix);
          });
        });

  return (
    <>
      {/* Scrollable category tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar mb-4">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm shrink-0 transition-all font-medium ${
              activeGroup === g
                ? "bg-[#3cd7ff] text-black font-bold"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* News feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <p>خبری یافت نشد</p>
          </div>
        ) : (
          filtered.map((item) => (
            <NewsCard key={item.item_id} item={item} variant="horizontal" />
          ))
        )}
      </div>
    </>
  );
}
