/**
 * Per-article extras for hand-written editorial articles ("ed-" ids), which
 * live in the database without these fields:
 *  - slug: a short, meaningful URL slug instead of one generated from the
 *    (long) title. Old title-slug URLs 301 to it (see the article page).
 *  - about: the schema.org entity the article is about, so Google can tie the
 *    article to that person's own site and profiles.
 */
export type EditorialMeta = {
  slug?: string;
  about?: Record<string, unknown>;
};

export const EDITORIAL_META: Record<string, EditorialMeta> = {
  "ed-defce21bbc6a": {
    slug: "محمد-رضاییان",
    about: {
      "@type": "Person",
      "@id": "https://rezaianam.ir/#artist",
      name: "محمد رضاییان",
      alternateName: ["DEON", "دیون", "Mohammad Rezaian", "محمد رضائیان"],
      jobTitle: "رپر، آهنگساز و تهیه‌کننده موسیقی",
      nationality: { "@type": "Country", name: "Iran" },
      url: "https://rezaianam.ir/fa",
      image: "https://rezaianam.ir/uploads/site/mohammad-rezaian.jpg",
      sameAs: [
        "https://rezaianam.ir",
        "https://play.radiojavan.com/artist/Deon",
        "https://open.spotify.com/artist/3iLlpr0RYNYgaAiUTIQRvW",
        "https://music.apple.com/nl/artist/deon/1582264487",
        "https://www.youtube.com/@mohammadrezaian1188",
        "https://www.instagram.com/mohammad_rezaian_/",
      ],
    },
  },
};
