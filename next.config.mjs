/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://telegram.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' https: data:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com; frame-src https://t.me https://telegram.org;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
