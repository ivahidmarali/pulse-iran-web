import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL } from "@/lib/utils";
import "./globals.css";

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
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "پالس ایران — اخبار فوری ایران و جهان",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "پالس ایران | اخبار فوری ایران و جهان",
    description:
      "اخبار فوری ایران و جهان، پوشش زنده سیاست، اقتصاد، بین‌الملل، ارز و بورس.",
    images: ["/og-default.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: { fa: SITE_URL },
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

// WebSite JSON-LD — content is static trusted data, not user input
const websiteJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "پالس ایران",
  url: SITE_URL,
  description: "اخبار فوری ایران و جهان، بی‌طرف از همه منابع",
  inLanguage: "fa",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <head>
        <meta charSet="utf-8" />
        <link rel="alternate" hrefLang="fa" href={SITE_URL} />
        {/* JSON-LD content is static trusted server data — no XSS risk */}
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: websiteJsonLd }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PMJG9DYRN3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PMJG9DYRN3');
          `}
        </Script>
      </head>
      <body className="bg-background text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
