import type { Metadata, Viewport } from "next";
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
  verification: {
    google: "MyeZy2Q1Qqg8R6n0hYFxvgnF6kMM-ZwUKmZMO7DPQCk",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const editorJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#editor`,
  name: "Vahid Marali",
  alternateName: "وحید مارالی",
  jobTitle: "Founder & Editor-in-Chief",
  description: "وحید مارالی بنیان‌گذار و سردبیر پالس ایران — پلتفرم تجمیع اخبار فارسی با طبقه‌بندی گرایش سیاسی منابع",
  worksFor: { "@id": `${SITE_URL}/#organization` },
  email: "info@palsiran.com",
  url: `${SITE_URL}/about/vahid-marali`,
  sameAs: [
    "https://t.me/palsiran",
    "https://x.com/palsiran_news",
    "https://www.youtube.com/@palsiran",
  ],
  knowsAbout: [
    "Persian media analysis",
    "Iranian politics",
    "News aggregation",
    "Political bias in media",
    "Middle East news",
  ],
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
  sameAs: ["https://t.me/palsiran", "https://x.com/palsiran_news", "https://www.youtube.com/@palsiran"],
  publishingPrinciples: `${SITE_URL}/about/editorial-policy`,
  correctionsPolicy: `${SITE_URL}/corrections`,
  diversityPolicy: `${SITE_URL}/about/editorial-policy`,
  ethicsPolicy: `${SITE_URL}/about/editorial-policy`,
  editor: { "@id": `${SITE_URL}/#editor` },
  founder: { "@id": `${SITE_URL}/#editor` },
  masthead: `${SITE_URL}/about`,
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@palsiran.com",
    contactType: "customer service",
    availableLanguage: "fa",
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
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://region1.google-analytics.com" />
        <link rel="alternate" type="application/rss+xml" title="پالس ایران" href={`${SITE_URL}/feed.xml`} />
        {/* safeJsonLd escapes <, >, & — prevents </script> injection from data values */}
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} />
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(editorJsonLd) }} />
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
          <div className="md:hidden h-[104px]" aria-hidden="true" />
          <BottomNav />
        </NonAdminOnly>
        {children}
      </body>
    </html>
  );
}
