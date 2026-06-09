"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  categoryEmoji?: string;
  priority?: boolean;
}

export default function HeroImage({ src, alt, categoryEmoji, priority }: Props) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface-container to-background flex items-center justify-center">
        <span className="text-5xl opacity-20" aria-hidden="true">{categoryEmoji}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
      priority={priority}
      onError={() => setBroken(true)}
    />
  );
}
