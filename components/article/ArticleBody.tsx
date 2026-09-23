import type { ReactNode } from "react";

// Renders the article body. Bot summaries are plain paragraphs; editorial
// articles additionally use a small Markdown subset: "## " / "### " headings,
// **bold** and [text](https://…) links. Built as React nodes — never innerHTML.

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

/** Plain-text version of a body (for JSON-LD, meta description, reading time). */
export function bodyPlainText(body: string): string {
  return body
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
