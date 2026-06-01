"use client";

import { useEffect, useId } from "react";

export default function TelegramPostWidget({ url }: { url: string }) {
  const uid = useId().replace(/:/g, "");
  const post = url.replace("https://t.me/", "");
  const containerId = `tg-widget-${uid}`;

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.replaceChildren();
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-post", post);
    script.setAttribute("data-width", "100%");
    script.setAttribute("data-color", "1C93E3");
    script.setAttribute("data-dark", "1");
    script.async = true;
    container.appendChild(script);
    return () => { container.replaceChildren(); };
  }, [post, containerId]);

  return (
    <div
      id={containerId}
      className="w-full max-w-lg mx-auto rounded-xl overflow-hidden mb-6"
    />
  );
}
