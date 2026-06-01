import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI search & retrieval bots — allowed for live citations and AI Overviews
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' }, // training bot — blocked per ai-train=no Content-Signal
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'AI2Bot', allow: '/' },
      { userAgent: 'YouBot', allow: '/' },
      // Training-only scrapers — blocked (no real-time citation value)
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
      { userAgent: 'Amazonbot', disallow: '/' },
      { userAgent: 'meta-externalagent', disallow: '/' },
    ],
    sitemap: [
      'https://palsiran.com/sitemap.xml',
      'https://palsiran.com/news-sitemap.xml',
    ],
  }
}
