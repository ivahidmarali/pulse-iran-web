"use client";

import { useEffect, useState } from "react";

export default function TehranClock() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [date, setDate] = useState("");
  const [colon, setColon] = useState(true);

  useEffect(() => {
    // Only run the interval if this component is visible (not hidden by responsive classes)
    const el = document.getElementById("tehran-clock");
    if (el && el.offsetParent === null) return;

    const update = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("fa-IR", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      const parts = formatted.split(":");
      setHours(parts[0] ?? "");
      setMinutes(parts[1] ?? "");
      setDate(
        new Intl.DateTimeFormat("fa-IR", {
          timeZone: "Asia/Tehran",
          month: "long",
          day: "numeric",
        }).format(now)
      );
      setColon((c) => !c);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!hours) return <div className="w-16 h-8" aria-hidden />;

  return (
    <div id="tehran-clock" className="text-right leading-tight">
      <div className="text-sm font-bold text-secondary-fixed-dim tabular-nums flex items-center gap-0" dir="ltr">
        <span>{hours}</span>
        <span className={`transition-opacity duration-100 ${colon ? "opacity-100" : "opacity-20"}`}>:</span>
        <span>{minutes}</span>
      </div>
      <div className="text-[10px] text-on-surface-variant">{date}</div>
    </div>
  );
}
