import { toMetaDescription } from "./site.ts";

export type LlmsInput = {
  collections: Array<{ title: string; path: string; description?: string | null }>;
  articles: Array<{ title: string; path: string }>;
  url: (path: string) => string;
};

/** First sentence of a description, capped — enough to say what a collection is, with no marketing claims added. */
function oneLine(raw?: string | null): string {
  const text = toMetaDescription(raw, 140);
  const first = text.split(/(?<=[.!?])\s/)[0];
  return first ?? "";
}

/**
 * Plain markdown in the llms.txt layout: H1 name, blockquote summary, then link lists.
 * Every fact here is already published on the site (footer, About, contact pages).
 */
export function buildLlmsTxt({ collections, articles, url }: LlmsInput): string {
  const lines: string[] = [
    "# Ruchi Foodline",
    "",
    "> Ruchi Foodline, from Om Oil & Flour Mills Ltd. in Cuttack, Odisha, India, makes and sells spices, blended masalas, tea, pasta and other food products (brand established 1976). Products can be bought online in India; businesses can send bulk, distributor and export enquiries through the contact forms.",
    "",
    "## Shop",
    `- [All products](${url("/products")}): the full catalogue with prices and pack sizes`,
  ];
  for (const c of collections) {
    const desc = oneLine(c.description);
    lines.push(`- [${c.title}](${url(c.path)})${desc ? `: ${desc}` : ""}`);
  }
  lines.push(
    `- [Tea](${url("/tea")}): RUCHI tea range`,
    "",
    "## Company",
    `- [About Ruchi Foodline](${url("/about")}): history, leadership, certifications and awards`,
    `- [Global business & exports](${url("/global-business")}): export partnership enquiries`,
    "",
    "## Business enquiries",
    `- [Bulk order enquiry](${url("/contact/bulk-order")})`,
    `- [Distributor / partner enquiry](${url("/contact/partner")})`,
    `- [General queries](${url("/contact/queries")})`,
    "",
    "## Contact",
    "- Email: info@ruchifoodline.com",
    "- Toll-free: 1800 345 4439",
    "- Address: Industrial Estate, Madhupatna, Cuttack - 753010, Odisha, India",
    ""
  );
  if (articles.length) {
    lines.push("## Recipes and guides", ...articles.map((a) => `- [${a.title}](${url(a.path)})`), "");
  }
  lines.push("## Optional", `- [Sitemap](${url("/sitemap.xml")})`, "");
  return lines.join("\n");
}
