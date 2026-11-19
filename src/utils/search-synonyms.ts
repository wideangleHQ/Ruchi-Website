/**
 * Regional / everyday names for the same ingredient, so "haldi" finds Turmeric and "dalama" finds Dalma.
 * Each group lists equivalent spellings; any member expands to all the others.
 */
export const SYNONYM_GROUPS: readonly (readonly string[])[] = [
  ["turmeric", "haldi", "halud"],
  ["cumin", "jeera", "jira", "zeera"],
  ["black cumin", "kala jeera", "shahi jeera"],
  ["coriander", "dhania", "dhaniya"],
  ["chilli", "chili", "mirchi", "mirch", "lanka"],
  ["black pepper", "kali mirch", "pepper", "gol mirch"],
  ["cardamom", "elaichi", "ilaichi", "elachi"],
  ["clove", "laung", "lavang"],
  ["cinnamon", "dalchini", "darchini"],
  ["fenugreek", "methi"],
  ["fennel", "saunf", "sounf"],
  ["carom", "ajwain", "ajowan"],
  ["mustard", "rai", "sarson", "sorisa"],
  ["asafoetida", "hing", "hingu"],
  ["nigella", "kalonji"],
  ["tamarind", "imli", "tentuli"],
  ["gram flour", "besan"],
  ["semolina", "sooji", "suji", "rava"],
  ["tea", "chai"],
  ["vermicelli", "sewai", "seviyan", "semiya"],
  ["dalma", "dalama"],
  ["dry mango", "amchur", "amchoor"],
  ["bay leaf", "tej patta", "tejpatta"],
  ["saffron", "kesar"],
  ["chana", "chole", "chhole"],
  ["biryani", "biriyani", "biriani"],
  ["pakoda", "pakora"],
  ["sambar", "sambhar"],
  ["pani puri", "golgappa", "gupchup"],
  ["garam masala", "garam"],
  ["noodles", "chowmein", "chow mein"],
  ["hamper", "combo", "gift", "kit"],
];

const clean = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Edit distance ≤ 1 (one insert/delete/substitute) — enough for common misspellings like "turmric" or "jeerra". */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** The query itself plus every equivalent name it mentions (typo-tolerant for words of 5+ letters). Original first. */
export function expandSearchTerms(query: string): string[] {
  const q = clean(query);
  if (!q) return [];
  const words = q.split(" ");
  const terms = new Set<string>([q]);
  for (const group of SYNONYM_GROUPS) {
    const hit = group.some((name) => {
      if (name.includes(" ")) return ` ${q} `.includes(` ${name} `);
      return words.some((w) => w === name || (w.length >= 5 && name.length >= 5 && withinOneEdit(w, name)));
    });
    if (hit) group.forEach((name) => terms.add(name));
  }
  return [...terms].slice(0, 8);
}

/** Shopify Storefront search string: prefix match for single words, exact phrase for multi-word names. */
export function toShopifyQuery(terms: string[]): string {
  return terms.map((t) => (t.includes(" ") ? `"${t}"` : `${t}*`)).join(" OR ");
}
