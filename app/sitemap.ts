export const revalidate = 3600;

import { articleUrl, generateSlug, SITE_URL } from "@/lib/utils";
import { ARTICLES } from "@/lib/editorial-articles";
import type { NewsItem, SourceInfo } from "@/lib/types";
import type { MetadataRoute } from "next";

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";
const PAGE_SIZE = 100;

const LEAN_SLUGS = [
  "osoulgarayan", "rasmi-dolati", "eslah-talab", "eslah-talab-mianeh",
  "mohafezeh-kar-mianeh", "liberal-gharbi", "liberal-amrikai", "chap-liberal",
  "mokhalef-jomhouri-eslami", "mohafezeh-kar-arabi", "mostaghel",
];

const TAG_SLUGS = [
  "siasi", "beinolmelal", "eqtesadi", "ejtemai", "varzeshi", "technology", "hashiye",
];

async function fetchAllArticles(): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      `${INTERNAL_API}/news?page=${page}&per_page=${PAGE_SIZE}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) break;
    const data = await res.json();
    const batch: NewsItem[] = data.items ?? [];
    items.push(...batch);
    if (!data.has_more || batch.length < PAGE_SIZE) break;
    page++;
  }
  return items;
}

async function fetchSources(): Promise<SourceInfo[]> {
  try {
    const res = await fetch(`${INTERNAL_API}/sources`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let newsItems: NewsItem[] = [];
  let sources: SourceInfo[] = [];
  try {
    [newsItems, sources] = await Promise.all([fetchAllArticles(), fetchSources()]);
  } catch {}

  // Deduplicate by item_id — keep the first (most recent) occurrence
  const seen = new Set<string>();
  const uniqueItems = newsItems.filter((item) => {
    if (seen.has(item.item_id)) return false;
    seen.add(item.item_id);
    return true;
  });

  // lastModified = most recent article's publication date, not current wall-clock time.
  // Constantly emitting `new Date()` for pages whose content hasn't changed trains
  // Googlebot to distrust our lastmod values across the entire sitemap.
  const latestArticleDate = newsItems[0]?.posted_at
    ? new Date(newsItems[0].posted_at)
    : new Date("2026-01-01");

  // Google ignores <changefreq> and <priority> since ~2017 — omit them entirely.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: latestArticleDate },
    { url: `${SITE_URL}/livescore`, lastModified: new Date() },
    { url: `${SITE_URL}/prices`, lastModified: latestArticleDate },
    { url: `${SITE_URL}/categories`, lastModified: latestArticleDate },
    { url: `${SITE_URL}/archive`, lastModified: latestArticleDate },
    // /search is noindex — exclude from sitemap to avoid contradiction
    { url: `${SITE_URL}/sources`, lastModified: latestArticleDate },
    { url: `${SITE_URL}/editorial`, lastModified: new Date("2026-06-09") },
    { url: `${SITE_URL}/about`, lastModified: new Date("2026-06-09") },
    { url: `${SITE_URL}/about/editorial-policy`, lastModified: new Date("2026-06-01") },
    { url: `${SITE_URL}/about/vahid-marali`, lastModified: new Date("2026-06-09") },
    { url: `${SITE_URL}/prices/dollar`, lastModified: new Date() },
    { url: `${SITE_URL}/prices/euro`, lastModified: new Date() },
    { url: `${SITE_URL}/prices/gold`, lastModified: new Date() },
    { url: `${SITE_URL}/prices/coin`, lastModified: new Date() },
    { url: `${SITE_URL}/corrections`, lastModified: new Date("2026-06-01") },
    { url: `${SITE_URL}/privacy`, lastModified: new Date("2026-05-29") },
    { url: `${SITE_URL}/terms`, lastModified: new Date("2026-05-29") },
  ];

  const leanRoutes: MetadataRoute.Sitemap = LEAN_SLUGS.map((slug) => ({
    url: `${SITE_URL}/lean/${slug}`,
    lastModified: latestArticleDate,
  }));

  const tagRoutes: MetadataRoute.Sitemap = TAG_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tag/${slug}`,
    lastModified: latestArticleDate,
  }));

  // Exclude removed/inappropriate sources (chekhabarre) from sitemap
  const EXCLUDED_SOURCE_SLUGS = new Set(["chekhabarre"]);
  const sourceRoutes: MetadataRoute.Sitemap = sources
    .filter((src) => !EXCLUDED_SOURCE_SLUGS.has(generateSlug(src.name)))
    .map((src) => ({
      url: `${SITE_URL}/source/${generateSlug(src.name)}`,
      lastModified: latestArticleDate,
    }));

  // Use articleUrl() so sitemap URLs exactly match the canonical tags in metadata
  // Exclude articles from removed/inappropriate sources
  const articleRoutes: MetadataRoute.Sitemap = uniqueItems
    .filter((item) => !EXCLUDED_SOURCE_SLUGS.has(generateSlug(item.source ?? "")))
    .map((item) => ({
      url: articleUrl(item.item_id, item.title),
      lastModified: item.posted_at ? new Date(item.posted_at) : new Date(),
    }));

  const editorialRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}/editorial/${a.slug}`,
    lastModified: new Date(a.dateModified),
  }));

  return [...staticRoutes, ...leanRoutes, ...tagRoutes, ...editorialRoutes, ...sourceRoutes, ...articleRoutes];
}
