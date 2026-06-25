import type { Metadata } from "next";
import { SITE_URL, safeJsonLd } from "@/lib/utils";
import { getWorldCupStandings, getWorldCupNews } from "@/lib/api";
import WorldCupClient from "./WorldCupClient";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export const revalidate = 120;

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";

async function fetchInitialLiveScore() {
  try {
    const r = await fetch(`${INTERNAL_API}/livescore`, { next: { revalidate: 30 } });
    if (!r.ok) return null;
    return r.json();
  } catch { return null; }
}

export const metadata: Metadata = {
  title: { absolute: "جام جهانی ۲۰۲۶ | نتایج زنده، جدول گروه‌ها، اخبار تیم ملی ایران | پالس ایران" },
  description:
    "پوشش کامل جام جهانی ۲۰۲۶: نتایج زنده بازی‌ها، جدول گروه‌ها، اخبار تیم ملی ایران در گروه G با بلژیک، مصر و نیوزیلند. به‌روزرسانی لحظه‌ای.",
  alternates: {
    canonical: `${SITE_URL}/جام-جهانی`,
    languages: { fa: `${SITE_URL}/جام-جهانی`, "x-default": `${SITE_URL}/جام-جهانی` },
  },
  openGraph: {
    title: "جام جهانی ۲۰۲۶ | پالس ایران",
    description: "نتایج زنده، جدول گروه‌ها و اخبار تیم ملی ایران در جام جهانی ۲۰۲۶",
    url: `${SITE_URL}/جام-جهانی`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "جام جهانی ۲۰۲۶ | پالس ایران",
    description: "نتایج زنده، جدول گروه‌ها و اخبار تیم ملی ایران",
  },
  keywords: [
    "جام جهانی ۲۰۲۶", "جام جهانی فوتبال", "تیم ملی ایران جام جهانی",
    "نتایج جام جهانی", "جدول گروه G", "ایران بلژیک", "ایران مصر",
    "جام جهانی آمریکا کانادا مکزیک", "FIFA World Cup 2026",
    "world cup 2026 iran", "نتایج زنده فوتبال", "پالس ایران ورزشی",
    "جدول گروه‌های جام جهانی", "برنامه بازی‌های ایران",
  ],
};

const wcEventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "@id": `${SITE_URL}/جام-جهانی`,
  name: "جام جهانی فوتبال ۲۰۲۶",
  alternateName: "FIFA World Cup 2026",
  startDate: "2026-06-11",
  endDate: "2026-07-19",
  eventStatus: "https://schema.org/EventScheduled",
  location: [
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "Canada" },
    { "@type": "Country", name: "Mexico" },
  ],
  organizer: { "@type": "Organization", name: "FIFA", url: "https://www.fifa.com" },
  description: "۴۸ تیم از سرتاسر جهان در جام جهانی ۲۰۲۶ رقابت می‌کنند. تیم ملی ایران در گروه G قرار دارد.",
  url: `${SITE_URL}/جام-جهانی`,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "جام جهانی ۲۰۲۶ کجا برگزار می‌شود؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "جام جهانی ۲۰۲۶ به میزبانی مشترک ایالات متحده آمریکا، کانادا و مکزیک برگزار می‌شود. رقابت‌ها از ۱۱ ژوئن تا ۱۹ ژوئیه ۲۰۲۶ در ۱۶ شهر برگزار می‌شود.",
      },
    },
    {
      "@type": "Question",
      name: "ایران در کدام گروه جام جهانی ۲۰۲۶ است؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "تیم ملی ایران در گروه G جام جهانی ۲۰۲۶ قرار دارد و رقبای آن بلژیک، مصر و نیوزیلند هستند.",
      },
    },
    {
      "@type": "Question",
      name: "جام جهانی ۲۰۲۶ چند تیم دارد؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "برای اولین بار در تاریخ، ۴۸ تیم در جام جهانی ۲۰۲۶ شرکت می‌کنند. رقابت‌ها در قالب ۱۲ گروه چهارتایی آغاز می‌شود.",
      },
    },
    {
      "@type": "Question",
      name: "برنامه بازی‌های تیم ملی ایران در جام جهانی چیست؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "تیم ملی ایران در گروه G جام جهانی ۲۰۲۶ در برابر بلژیک، مصر و نیوزیلند بازی می‌کند. برنامه دقیق بازی‌ها در صفحه جام جهانی پالس ایران به‌روز نمایش داده می‌شود.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "پالس ایران", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "جام جهانی ۲۰۲۶", item: `${SITE_URL}/جام-جهانی` },
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/جام-جهانی`,
  name: "جام جهانی ۲۰۲۶ — نتایج، جدول و اخبار",
  url: `${SITE_URL}/جام-جهانی`,
  inLanguage: "fa",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  dateModified: new Date().toISOString(),
  about: { "@type": "SportsOrganization", name: "FIFA World Cup 2026", sport: "Football" },
  speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "h2"] },
};

export default async function WorldCupPage() {
  const [initialLiveData, initialStandings, initialNewsData] = await Promise.all([
    fetchInitialLiveScore(),
    getWorldCupStandings().catch(() => ({ groups: [], ok: false, ts: 0 })),
    getWorldCupNews(15).catch(() => ({ items: [] })),
  ]);

  return (
    <div className="cyber-grid" dir="rtl">
      {/* Structured data */}
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(wcEventSchema) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }} />
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageSchema) }} />

      <WorldCupClient
        initialLiveData={initialLiveData}
        initialStandings={initialStandings}
        initialNews={initialNewsData.items ?? []}
      />

      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileFooter />
    </div>
  );
}
