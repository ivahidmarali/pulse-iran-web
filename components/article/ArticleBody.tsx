import type { ReactNode } from "react";
import Image from "next/image";

// Renders the article body. Bot summaries are plain paragraphs; editorial
// articles additionally use a small Markdown subset: "## " / "### " headings,
// **bold**, [text](https://…) links, and block images on their own line:
//   ![alt text](https://host/photo.jpg =1280x720 "optional caption")
// Built as React nodes — never innerHTML.

const INLINE_RE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of Array.from(text.matchAll(INLINE_RE))) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    if (m[1] !== undefined) {
      out.push(<strong key={idx} className="font-bold text-on-surface">{m[1]}</strong>);
    } else {
      out.push(
        <a
          key={idx}
          href={m[3]}
          target="_blank"
          rel="noopener"
          className="text-secondary-fixed-dim underline underline-offset-4 hover:text-secondary"
        >
          {m[2]}
        </a>
      );
    }
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Block image: whole line. Only hosts we control, so an editorial body can't
// hotlink arbitrary third-party images. Size is optional but avoids layout shift.
const IMAGE_RE = /^!\[([^\]]+)\]\((https:\/\/[^\s)]+?)(?:\s+=(\d+)x(\d+))?(?:\s+"([^"]*)")?\)$/;
const IMAGE_HOSTS = new Set(["palsiran.com", "rezaianam.ir"]);

type BodyImage = { alt: string; url: string; width?: number; height?: number; caption?: string };

function parseImage(line: string): BodyImage | null {
  const m = line.trim().match(IMAGE_RE);
  if (!m) return null;
  try {
    if (!IMAGE_HOSTS.has(new URL(m[2]).hostname)) return null;
  } catch {
    return null;
  }
  return {
    alt: m[1],
    url: m[2],
    ...(m[3] && m[4] ? { width: Number(m[3]), height: Number(m[4]) } : {}),
    ...(m[5] ? { caption: m[5] } : {}),
  };
}

/** Images placed in a body, in order (for the NewsArticle `image` list). */
export function bodyImages(body: string): BodyImage[] {
  return body.split(/\n+/).map(parseImage).filter((i): i is BodyImage => i !== null);
}

/** Plain-text version of a body (for JSON-LD, meta description, reading time). */
export function bodyPlainText(body: string): string {
  return body
    .replace(/^!\[[^\]]*\]\([^)]*\)\s*$/gm, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*/g, "");
}

export default function ArticleBody({ paragraphs }: { paragraphs: string[] }) {
  let firstParaSeen = false;
  return (
    <>
      {paragraphs.map((para, i) => {
        const h = para.match(/^(#{2,3})\s+(.+)$/);
        if (h) {
          const cls = "font-bold text-on-surface pt-2";
          return h[1] === "##" ? (
            <h2 key={i} className={`${cls} text-xl`}>{renderInline(h[2])}</h2>
          ) : (
            <h3 key={i} className={`${cls} text-lg`}>{renderInline(h[2])}</h3>
          );
        }
        const img = parseImage(para);
        if (img) {
          return (
            <figure key={i} className="m-0 my-2">
              {img.width && img.height ? (
                <Image
                  src={img.url}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(max-width: 768px) 100vw, 720px"
                  // Never upscale past the photo's real width (small portraits go soft).
                  style={{ maxWidth: img.width }}
                  className="mx-auto h-auto w-full rounded-xl"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img.url} alt={img.alt} loading="lazy" decoding="async" className="h-auto w-full rounded-xl" />
              )}
              {img.caption && (
                <figcaption className="mt-2 text-center text-sm text-on-surface-variant">{img.caption}</figcaption>
              )}
            </figure>
          );
        }
        const speakable = !firstParaSeen;
        firstParaSeen = true;
        return (
          <p key={i} data-speakable={speakable || undefined} className="font-body-lg text-body-lg text-on-surface leading-8">
            {renderInline(para)}
          </p>
        );
      })}
    </>
  );
}
