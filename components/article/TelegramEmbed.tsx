"use client";

interface TelegramEmbedProps {
  videoUrl: string; // e.g. https://t.me/channel/123
}

export default function TelegramEmbed({ videoUrl }: TelegramEmbedProps) {
  const src = `${videoUrl}?embed=1&mode=tme`;
  return (
    <div className="w-full rounded-xl overflow-hidden bg-surface-container border border-white/10 mb-6">
      <iframe
        src={src}
        className="w-full"
        style={{ height: 360, border: "none" }}
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
      />
    </div>
  );
}
