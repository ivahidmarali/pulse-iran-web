"use client";

import { useState, useTransition } from "react";
import NewsCard from "@/components/news/NewsCard";
import type { NewsItem } from "@/lib/types";
import { fetchMoreNews } from "@/app/actions";

interface Props {
  initialItems: NewsItem[];
  initialPage: number;
  initialPages: number;
  cat?: string;
  group?: string;
}

export default function LoadMoreFeed({ initialItems, initialPage, initialPages, cat, group }: Props) {
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(initialPages);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(async () => {
      const data = await fetchMoreNews(page + 1, cat, group);
      const newItems = data.items.filter((i) => i.title && i.title.trim().length > 5);
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.item_id));
        return [...prev, ...newItems.filter((i) => !seen.has(i.item_id))];
      });
      setPage((p) => p + 1);
      setPages(data.pages ?? initialPages);
    });
  };

  return (
    <>
      <div className="px-container-margin space-y-2.5">
        {items.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant text-sm">
            خبری در این دسته‌بندی یافت نشد
          </div>
        )}
        {items.map((item) => (
          <NewsCard key={item.item_id} item={item} variant="horizontal" />
        ))}
      </div>
      {page < pages && (
        <div className="px-container-margin mt-6 mb-2">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="w-full py-3 bg-surface-container rounded-xl text-sm text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "در حال بارگذاری..." : "اخبار بیشتر ↓"}
          </button>
        </div>
      )}
    </>
  );
}
