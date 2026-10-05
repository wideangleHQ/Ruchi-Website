import catalogue from "@/data/product-catalogue.json";

type CatalogueEntry = { sku: string; title: string; weight: string; specs: string[] };

function normalizeTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/ruchi/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function normalizeWeight(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// title -> weight -> specs. Built once at module load.
const specIndex = new Map<string, Map<string, string[]>>();
for (const entry of catalogue as CatalogueEntry[]) {
  const titleKey = normalizeTitle(entry.title);
  const weightKey = normalizeWeight(entry.weight);
  if (!titleKey) continue;
  let byWeight = specIndex.get(titleKey);
  if (!byWeight) {
    byWeight = new Map();
    specIndex.set(titleKey, byWeight);
  }
  byWeight.set(weightKey, entry.specs);
}

/**
 * Looks up 2-3 catalogue-sourced key specifications for a Shopify product
 * variant, matched by normalised product title + pack size (the catalogue's
 * own SKUs don't correspond to Shopify SKUs, so title+weight is the only
 * reliable join key available). Returns an empty array — never a guess —
 * when no confident match exists, rather than risk showing one product's
 * specs on another.
 */
export function getProductSpecs(productTitle: string, variantTitle?: string | null): string[] {
  const byWeight = specIndex.get(normalizeTitle(productTitle));
  if (!byWeight) return [];

  if (variantTitle && variantTitle.toLowerCase() !== "default title") {
    const exact = byWeight.get(normalizeWeight(variantTitle));
    if (exact) return exact.slice(0, 3);
    return [];
  }

  // Single-variant ("Default Title") product: only safe to use the
  // catalogue entry if every pack size of this product shares identical
  // specs — otherwise picking one weight's specs would be a guess.
  const allSpecs = Array.from(byWeight.values());
  const first = allSpecs[0];
  const allSame = allSpecs.every((s) => s.join("|") === first.join("|"));
  return allSame ? first.slice(0, 3) : [];
}
