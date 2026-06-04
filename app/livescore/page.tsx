import type { Metadata } from "next";
import { SITE_URL, safeJsonLd } from "@/lib/utils";
import LiveScoreClient from "./LiveScoreClient";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export const metadata: Metadata = {
  title: "نتایج زنده فوتبال | پالس ایران",
  description:
    "نتایج زنده فوتبال لیگ قهرمانان، لیگ برتر ایران، جام جهانی، و لیگ‌های بزرگ اروپایی — به‌روزرسانی خودکار هر ۳۰ ثانیه در پالس ایران",
  alternates: {
    canonical: `${SITE_URL}/livescore`,
    languages: { fa: `${SITE_URL}/livescore`, "x-default": `${SITE_URL}/livescore` },
  },
  openGraph: {
    title: "نتایج زنده فوتبال | پالس ایران",
    description:
      "نتایج زنده فوتبال لیگ‌های بزرگ و تیم ملی ایران — به‌روزرسانی خودکار",
    url: `${SITE_URL}/livescore`,
    type: "website",
  },
  keywords: [
    "نتایج زنده فوتبال",
    "نتایج فوتبال امروز",
    "لایو اسکور",
    "livescore",
    "نتایج لیگ برتر ایران",
    "نتایج جام جهانی",
    "نتایج لیگ قهرمانان",
    "تیم ملی ایران نتیجه",
    "پالس ایران ورزشی",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/livescore`,
  name: "نتایج زنده فوتبال",
  description:
    "نتایج زنده فوتبال لیگ‌های بزرگ جهان و ایران — به‌روزرسانی خودکار",
  url: `${SITE_URL}/livescore`,
  inLanguage: "fa",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  publisher: { "@id": `${SITE_URL}/#organization` },
  about: {
    "@type": "SportsOrganization",
    name: "فوتبال",
    sport: "Football",
  },
};

export default function LiveScorePage() {
  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <LiveScoreClient />
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileFooter />
    </div>
  );
}
