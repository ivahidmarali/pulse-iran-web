export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://palsiran.com";

/** Generate a URL-safe Persian slug from a title */
export function generateSlug(title: string): string {
  return title
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\w-]/g, "")
    .slice(0, 60);
}

/** Internal href for an article page (with optional slug for SEO) */
export function articleHref(itemId: string, title?: string): string {
  const slug = title ? generateSlug(title) : "";
  if (!slug) return `/article/${encodeURIComponent(itemId)}`;
  return `/article/${encodeURIComponent(itemId)}/${slug}`;
}

/** Full canonical URL for an article */
export function articleUrl(itemId: string, title?: string): string {
  return `${SITE_URL}${articleHref(itemId, title)}`;
}
