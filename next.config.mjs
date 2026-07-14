/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // /worldcup → canonical Persian URL (308 for SEO)
      { source: "/worldcup", destination: "/%D8%AC%D8%A7%D9%85-%D8%AC%D9%87%D8%A7%D9%86%DB%8C", permanent: true },
      // ASCII internal route → canonical Persian URL (keeps URLs clean for users)
      { source: "/jame-jahani", destination: "/%D8%AC%D8%A7%D9%85-%D8%AC%D9%87%D8%A7%D9%86%DB%8C", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Persian URL rewrites to ASCII internal route — avoids Unicode directory issues on Linux
      // Both the decoded Unicode form and the percent-encoded form are covered
      { source: "/جام-جهانی", destination: "/jame-jahani" },
      { source: "/%D8%AC%D8%A7%D9%85-%D8%AC%D9%87%D8%A7%D9%86%DB%8C", destination: "/jame-jahani" },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.khabaronline.ir" },
      { protocol: "https", hostname: "**.mehrnews.com" },
      { protocol: "https", hostname: "**.irna.ir" },
      { protocol: "https", hostname: "**.tasnimnews.com" },
      { protocol: "https", hostname: "**.bbc.co.uk" },
      { protocol: "https", hostname: "**.iranintl.com" },
      { protocol: "https", hostname: "**.radiofarda.com" },
      { protocol: "https", hostname: "cdn*.telesco.pe" },
      { protocol: "https", hostname: "palsiran.com" },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      {
        // Vazirmatn is fully self-hosted via next/font — no googleapis/gstatic needed
        key: "Content-Security-Policy",
        // connect-src must include analytics.google.com, stats.g.doubleclick.net and
        // www.google.com — gtag.js sends /g/collect beacons there; blocking them
        // silently drops all GA4 data (confirmed via CSP violation console errors)
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://telegram.org; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://www.google.com https://www.googletagmanager.com https://api.indexnow.org https://www.bing.com https://ssl.bing.com; frame-src https://t.me https://telegram.org;",
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Homepage: CDN cache matches ISR revalidate=120 to avoid unnecessary origin hits
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=120, stale-while-revalidate=240" }],
      },
      // Article pages: longer CDN cache (5 min) — content rarely changes after publish
      {
        source: "/article/:path*",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=600" }],
      },
      // World Cup hub: matches ISR revalidate=120 — cover both the Persian URL and ASCII internal route
      {
        source: "/(jame-jahani|%D8%AC%D8%A7%D9%85-%D8%AC%D9%87%D8%A7%D9%86%DB%8C)",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=120, stale-while-revalidate=240" }],
      },
      // Listing pages: 60s CDN cache. One rule per path — path-to-regexp does not
      // match ":param*" alternatives inside a group, so the old combined pattern
      // silently skipped lean/tag/source/editorial/about and they shipped with
      // "private, no-store" (zero CDN caching on indexable pages).
      ...[
        "/prices",
        "/prices/:path*",
        "/categories",
        "/archive",
        "/search",
        "/sources",
        "/lean/:path*",
        "/tag/:path*",
        "/source/:path*",
        "/editorial/:path*",
        "/editorial",
        "/about/:path*",
        "/about",
      ].map((source) => ({
        source,
        headers: [{ key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=120" }],
      })),
      // Sitemaps set their own Cache-Control inside the route handlers — a second
      // rule here produced duplicate conflicting Cache-Control headers (RFC 9110).
    ];
  },
};

export default nextConfig;
