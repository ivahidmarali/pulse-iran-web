import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Script from "next/script";
import { SITE_URL, safeJsonLd } from "@/lib/utils";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import NonAdminOnly from "@/components/layout/NonAdminOnly";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "پالس ایران | اخبار فوری ایران و جهان",
    template: "%s | پالس ایران",
  },
  description:
    "اخبار فوری ایران و جهان، پوشش زنده سیاست، اقتصاد، بین‌الملل، ارز و بورس — بی‌طرف از همه منابع.",
  keywords: [
    "اخبار ایران",
    "اخبار فوری",
    "اخبار امروز",
    "ایران",
    "سیاست",
    "اقتصاد",
    "ارز",
    "دلار",
    "بورس",
    "پالس ایران",
  ],
  authors: [{ name: "پالس ایران", url: SITE_URL }],
  creator: "پالس ایران",
  publisher: "پالس ایران",
  openGraph: {
    title: "پالس ایران | اخبار فوری ایران و جهان",
    description:
      "اخبار فوری ایران و جهان، پوشش زنده سیاست، اقتصاد، بین‌الملل، ارز و بورس.",
    url: SITE_URL,
    siteName: "پالس ایران",
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@palsiran_news",
    creator: "@palsiran_news",
    title: "پالس ایران | اخبار فوری ایران و جهان",
    description:
      "اخبار فوری ایران و جهان، پوشش زنده سیاست، اقتصاد، بین‌الملل، ارز و بورس.",
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
  other: {
    "linkedin:owner": "palsiran",
  },
  alternates: {
    canonical: SITE_URL,
    languages: { fa: SITE_URL, "x-default": SITE_URL },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "پالس ایران",
  url: SITE_URL,
  description: "اخبار فوری ایران و جهان، بی‌طرف از همه منابع",
  inLanguage: "fa",
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: "پالس ایران",
  alternateName: "Pals Iran",
  url: SITE_URL,
  foundingDate: "2024-03-01",
  email: "info@palsiran.com",
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  sameAs: ["https://t.me/palsiran", "https://x.com/palsiran_news"],
  publishingPrinciples: `${SITE_URL}/about/editorial-policy`,
  editor: { "@id": `${SITE_URL}/#editor` },
  founder: { "@id": `${SITE_URL}/#editor` },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@palsiran.com",
    contactType: "editorial",
    availableLanguage: "Persian",
  },
  knowsAbout: [
    "Iran news",
    "Persian politics",
    "Iranian economy",
    "Middle East",
    "Currency exchange rates",
    "Tehran Stock Exchange",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`dark ${vazirmatn.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn1.khabaronline.ir" />
        <link rel="preconnect" href="https://media.mehrnews.com" />
        <link rel="preconnect" href="https://newsmedia.tasnimnews.com" />
        <link rel="alternate" hrefLang="fa" href={SITE_URL} />
        <link rel="alternate" type="application/rss+xml" title="پالس ایران" href={`${SITE_URL}/feed.xml`} />
        {/* safeJsonLd escapes <, >, & — prevents </script> injection from data values */}
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PMJG9DYRN3"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PMJG9DYRN3');
          `}
        </Script>
      </head>
      <body className="bg-background text-on-surface antialiased">
        <NonAdminOnly>
          <Header />
          <BottomNav />
        </NonAdminOnly>
        {children}
      </body>
    </html>
  );
}
