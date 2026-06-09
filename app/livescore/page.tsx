import type { Metadata } from "next";
import { SITE_URL, safeJsonLd } from "@/lib/utils";
import LiveScoreClient from "./LiveScoreClient";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export const revalidate = 120;

const INTERNAL_API = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8000";

interface LiveScoreData {
  leagues: {
    title: string;
    date_groups: {
      jalali_key: string;
      date_label: string;
      matches: {
        id: number;
        team1: string;
        team2: string;
        score1: number | null;
        score2: number | null;
        minute: string;
        status: string;
        status_code: number;
        is_live: boolean;
        is_final: boolean;
        match_time: string;
        start_utc: string;
        has_details: boolean;
        team1_logo?: string | null;
        team2_logo?: string | null;
      }[];
    }[];
  }[];
  ts: number;
  ok: boolean;
}

async function fetchInitialLiveScore(): Promise<LiveScoreData | null> {
  try {
    const res = await fetch(`${INTERNAL_API}/livescore`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

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

const webPageJsonLd = {
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

function buildSportsEventSchema(data: LiveScoreData | null) {
  if (!data) return null;
  const events: object[] = [];
  for (const league of data.leagues ?? []) {
    for (const group of league.date_groups ?? []) {
      for (const m of group.matches ?? []) {
        if (!m.start_utc) continue;
        const status = m.is_live
          ? "https://schema.org/EventScheduled"
          : m.is_final
          ? "https://schema.org/EventScheduled"
          : "https://schema.org/EventScheduled";
        const event: Record<string, unknown> = {
          "@type": "SportsEvent",
          name: `${m.team1} در برابر ${m.team2}`,
          startDate: m.start_utc,
          eventStatus: status,
          location: { "@type": "Place", name: league.title },
          competitor: [
            { "@type": "SportsTeam", name: m.team1 },
            { "@type": "SportsTeam", name: m.team2 },
          ],
        };
        if (m.is_final && m.score1 !== null && m.score2 !== null) {
          event.description = `نتیجه نهایی: ${m.team1} ${m.score1}–${m.score2} ${m.team2}`;
        }
        events.push(event);
      }
    }
  }
  if (events.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "نتایج زنده فوتبال",
    itemListElement: events.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: e,
    })),
  };
}

export default async function LiveScorePage() {
  const initialData = await fetchInitialLiveScore();
  const sportsEventsSchema = buildSportsEventSchema(initialData);

  return (
    <div className="cyber-grid" dir="rtl">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }} />
      {sportsEventsSchema && (
        // eslint-disable-next-line react/no-danger
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(sportsEventsSchema) }} />
      )}
      <LiveScoreClient initialData={initialData} />
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileFooter />
    </div>
  );
}
