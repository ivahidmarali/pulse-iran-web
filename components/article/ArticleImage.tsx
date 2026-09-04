"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function ArticleImage({ src, alt, className, priority }: Props) {
  const [error, setError] = useState(false);
  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden ${className ?? ""}`}>
      <Image
        src={error ? "/og-default.jpg" : src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, 75vw"
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
      />
    </div>
  );
}
