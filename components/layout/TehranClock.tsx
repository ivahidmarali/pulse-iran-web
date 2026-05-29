"use client";

import { useEffect, useState } from "react";

export default function TehranClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("fa-IR", {
          timeZone: "Asia/Tehran",
          hour: "2-digit",
          minute: "2-digit",
        }).format(now)
      );
      setDate(
        new Intl.DateTimeFormat("fa-IR", {
          timeZone: "Asia/Tehran",
          month: "long",
          day: "numeric",
        }).format(now)
      );
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div className="text-right leading-tight">
      <div className="text-sm font-bold text-secondary-fixed-dim tabular-nums">{time}</div>
      <div className="text-[10px] text-on-surface-variant">{date}</div>
    </div>
  );
}
