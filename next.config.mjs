/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // Fallback for any other sources
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
