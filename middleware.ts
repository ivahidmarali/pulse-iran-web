import { NextResponse, type NextRequest } from "next/server";
import { EDITORIAL_META } from "@/lib/editorial-meta";
import { SITE_URL } from "@/lib/utils";

/**
 * Real 308s for editorial articles with a hand-picked slug. The article page
 * redirects too, but app/loading.tsx makes Next stream the page first, so a
 * redirect thrown while rendering arrives as a 200 with a meta refresh. Doing
 * it here, before rendering, sends a proper permanent redirect.
 */
export function middleware(req: NextRequest) {
  const [, section, rawId, ...rest] = req.nextUrl.pathname.split("/");
  if (section !== "article" || !rawId) return NextResponse.next();

  let id = rawId;
  let slug = rest.join("/");
  try {
    id = decodeURIComponent(rawId);
    slug = decodeURIComponent(slug);
  } catch {
    return NextResponse.next();
  }

  const fixed = EDITORIAL_META[id]?.slug;
  if (!fixed || slug === fixed) return NextResponse.next();

  // Absolute public URL: behind nginx, req.nextUrl can carry the internal host.
  const target = new URL(`/article/${encodeURIComponent(id)}/${encodeURIComponent(fixed)}`, SITE_URL);
  target.search = req.nextUrl.search;
  return NextResponse.redirect(target, 308);
}

export const config = { matcher: "/article/:path*" };
