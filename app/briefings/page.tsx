import type { Metadata } from "next";
import Link from "next/link";
import { getBriefings } from "@/lib/api";
import type { Briefing } from "@/lib/types";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "خلاصه روزانه اخبار ایران | پالس ایران",
  description: "خلاصه هوش مصنوعی از مهم‌ترین اخبار ایران — هر روز صبح و شب بر اساس پوشش ۴۵+ منبع خبری.",
  alternates: { canonical: `${SITE_URL}/briefings` },
};

export const revalidate = 300;

function persianDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Tehran",
    }).format(new Date(/[Zz]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : iso + "T00:00:00"));
  } catch {
    return iso;
  }
}

function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\d۰-۹]+[.\-\)]\s*/, "").trim())
    .filter((l) => l.length > 4);
}

function BriefingItem({ briefing }: { briefing: Briefing }) {
  const isNightly = briefing.type === "nightly";
  const lines = parseLines(briefing.content);

  return (
    <article className="bg-surface-container-low rounded-xl p-6 border border-white/5 hover:border-secondary-fixed-dim/20 transition-colors">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{isNightly ? "🌙" : "☀️"}</span>
          <h2 className="font-title-md text-title-md">
            {isNightly ? "خلاصه شبانه" : "خبرهای مهم صبح"}
          </h2>
        </div>
        <span className="text-xs text-on-surface-variant/50 tabular-nums">
          {persianDate(briefing.date)}
        </span>
      </header>
      <ol className="space-y-3" dir="rtl">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="text-secondary-fixed-dim/40 font-black text-sm shrink-0 mt-0.5">
              {(i + 1).toLocaleString("fa-IR")}
            </span>
            <p className="text-sm leading-relaxed text-on-surface/80">{line}</p>
          </li>
        ))}
      </ol>
    </article>
  );
}

export default async function BriefingsPage() {
  let briefings: Briefing[] = [];
  try {
    briefings = await getBriefings(40);
  } catch {
    /* show empty state */
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-container-margin py-section-gap">
      <header className="mb-8">
        <Link href="/" className="text-xs text-on-surface-variant/50 hover:text-on-surface-variant mb-4 inline-block">
          ← بازگشت
        </Link>
        <h1 className="font-headline-lg text-headline-lg border-r-4 border-secondary-fixed-dim pr-4">
          خلاصه روزانه
        </h1>
        <p className="text-sm text-on-surface-variant mt-2">
          خلاصه هوش مصنوعی از مهم‌ترین اخبار — هر روز صبح (۸:۰۰) و شب (۲۲:۰۰)
        </p>
      </header>

      {briefings.length === 0 ? (
        <p className="text-on-surface-variant text-center py-16">خلاصه‌ای هنوز ثبت نشده.</p>
      ) : (
        <div className="space-y-6">
          {briefings.map((b) => (
            <BriefingItem key={b.id} briefing={b} />
          ))}
        </div>
      )}
    </div>
  );
}
