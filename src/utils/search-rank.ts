/** Stable sort: products whose title names a search term come first (earlier terms win), the rest keep Shopify's order. */
export function rankByTitle<T extends { title: string }>(products: T[], terms: string[]): T[] {
  const score = (title: string) => {
    const t = title.toLowerCase();
    const i = terms.findIndex((term) => t.includes(term));
    return i === -1 ? terms.length : i;
  };
  return products
    .map((p, i) => ({ p, i, s: score(p.title) }))
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .map((x) => x.p);
}
