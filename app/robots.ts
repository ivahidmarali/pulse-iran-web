import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Search bots explicitly allowed
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      // Training bots managed by Cloudflare (GPTBot, ClaudeBot, CCBot, Google-Extended)
    ],
    sitemap: [
      'https://palsiran.com/sitemap.xml',
      'https://palsiran.com/news-sitemap.xml',
    ],
  }
}
