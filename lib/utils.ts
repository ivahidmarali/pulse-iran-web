export function toPersianNum(n: number): string {
  return n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://palsiran.com";

/** Generate a URL-safe Persian slug from a title */
export function generateSlug(title: string): string {
  let slug = title
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\w-]/g, "")
    .replace(/^[-]+/, "")
    .replace(/[-]+$/, "");
  // Break at last hyphen before position 60 for clean word boundary
  if (slug.length > 60) {
    const lastHyphen = slug.lastIndexOf("-", 60);
    slug = lastHyphen > 10 ? slug.slice(0, lastHyphen) : slug.slice(0, 60);
  }
  return slug || "خبر";
}

/** Returns the clean URL-safe ID for a news item (url_id when available, else item_id) */
export function articleId(item: { url_id?: string; item_id: string }): string {
  return item.url_id || item.item_id;
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

/** URL-safe slug for a source name (Persian-safe, mirrors generateSlug) */
export function sourceSlug(name: string): string {
  return generateSlug(name);
}

/** Internal href for a source profile page */
export function sourceHref(name: string): string {
  return `/source/${generateSlug(name)}`;
}

/**
 * Serialize an object to a JSON-LD string safe for inline <script> embedding.
 * JSON.stringify alone does not escape < > &, which can allow </script> injection.
 */
export function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
