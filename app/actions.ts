"use server";

import { getNews } from "@/lib/api";
import { getCategoryFilter } from "@/lib/categories";

export async function fetchMoreNews(page: number, cat?: string, group?: string) {
  const categories = getCategoryFilter(cat, group);
  return getNews(page, 33, categories?.length ? categories : undefined);
}
