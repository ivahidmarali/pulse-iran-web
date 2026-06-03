"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  telegramUrl: string;
  imageUrl?: string;
  title: string;
  variant?: "card" | "list";
}

export default function TelegramVideoCard({ telegramUrl, imageUrl, title, variant = "card" }: Props) {
  const [playing, setPlaying] = useState(false);

  const embedUrl = telegramUrl.includes("?")
    ? `${telegramUrl}&embed=1&single=1`
    : `${telegramUrl}?embed=1&single=1`;

  if (variant === "list") {
    return (
      <div>
        {playing ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="420"
            frameBorder="0"
            scrolling="no"
            allowTransparency
            className="w-full rounded-lg block"
          />
        ) : (
          <button onClick={() => setPlaying(true)} className="flex gap-3 group w-full text-right">
            <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container-highest">
              {imageUrl ? (
                <Image src={imageUrl} alt={title} fill className="object-cover" sizes="80px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl opacity-20">📹</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current ml-0.5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed group-hover:text-secondary-fixed-dim transition-colors line-clamp-2">{title}</p>
          </button>
        )}
      </div>
    );
  }

  // card variant — used in mobile vertical list
  return (
    <div className="rounded-xl overflow-hidden bg-surface-container border border-white/5">
      {playing ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="420"
          frameBorder="0"
          scrolling="no"
          allowTransparency
          className="w-full block"
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="w-full text-right">
          <div className="relative w-full h-44">
            {imageUrl ? (
              <Image src={imageUrl} alt={title} fill className="object-cover" sizes="100vw" />
            ) : (
              <div className="absolute inset-0 bg-surface-container-high flex items-center justify-center">
                <span className="text-4xl opacity-20">📹</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-[12px] font-medium p-3 line-clamp-2 leading-relaxed">{title}</p>
        </button>
      )}
    </div>
  );
}
