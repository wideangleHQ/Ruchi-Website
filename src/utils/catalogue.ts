import type { ProductVariant } from "@/lib/shopify/types";

export type RuchiCatalogue = {
  sku: string | null;
  itemCode: string | null;
  materialDescription: string | null;
  itemWeight: string | null;
  keySpecifications: string[];
  keyFeatures: string[];
  formFactor: string | null;
  ingredients: string | null;
  countryOfOrigin: string | null;
  shelfLife: string | null;
  storageInstructions: string | null;
  fssai: string | null;
  containerType: string | null;
  packOf: string | null;
  totalWeight: string | null;
  mrp: string | null;
  ean: string | null;
  hsn: string | null;
  foodType: string | null;
  manufacturer: string | null;
  marketedBy: string | null;
  address: string | null;
  unit: string | null;
  manufacture: string | null;
  discountPercentage: string | null;
  includedItems: string[];
};

export function productMetafield(
  product: { metafields?: Array<{ key: string; value: string } | null> },
  key: string
): string | null {
  const hit = product.metafields?.find((m) => m?.key === key);
  return clean(hit?.value);
}

export function productKeyFeatures(product: { metafields?: Array<{ key: string; value: string } | null> }): string[] {
  return splitBullets(productMetafield(product, "key_features"));
}

function parseIncludedItems(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Array<{ label?: string }>;
    return parsed.map((i) => i.label ?? "").filter(Boolean);
  } catch {
    return [];
  }
}

function clean(value: string | undefined | null): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "-" ? null : trimmed;
}

function splitBullets(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "" && line !== "-");
}

export function normalizeVariantCatalogue(variant: ProductVariant): RuchiCatalogue {
  const values = new Map<string, string>();
  for (const entry of variant.metafields ?? []) {
    if (entry) values.set(entry.key, entry.value);
  }
  const get = (key: string) => clean(values.get(key));

  return {
    sku: get("sku"),
    itemCode: get("item_code"),
    materialDescription: get("material_description"),
    itemWeight: get("item_weight"),
    keySpecifications: [
      get("key_specification_1"),
      get("key_specification_2"),
      get("key_specification_3"),
    ].filter((v): v is string => v !== null),
    keyFeatures: splitBullets(get("key_features")),
    formFactor: get("form_factor"),
    ingredients: get("ingredients"),
    countryOfOrigin: get("country_of_origin"),
    shelfLife: get("shelf_life"),
    storageInstructions: get("storage_instructions"),
    fssai: get("fssai"),
    containerType: get("container_type"),
    packOf: get("pack_of"),
    totalWeight: get("total_weight"),
    mrp: get("mrp"),
    ean: get("ean"),
    hsn: get("hsn"),
    foodType: get("food_type"),
    manufacturer: get("manufacturer"),
    marketedBy: get("marketed_by"),
    address: get("address"),
    unit: get("unit"),
    manufacture: get("manufacture"),
    discountPercentage: get("discount_percentage"),
    includedItems: parseIncludedItems(get("included_items")),
  };
}

type ProductWithVariants = {
  metafields?: Array<{ key: string; value: string } | null>;
  variants?: { edges: Array<{ node: ProductVariant }> };
};

/**
 * Key features for display, exactly as stored in Shopify (from the Excel / combo catalogue).
 * Order: the selected pack's ruchi.key_features, the product-level ones (combos), then another pack of the
 * SAME product that has catalogue rows (the Excel has no row for every pack size). Pure heading-only lines
 * (e.g. "Useful Cooking Tips:") carry no feature text and are skipped. Never invents text.
 */
export function getKeyFeatures(product: ProductWithVariants, variant?: ProductVariant | null): string[] {
  const clean2 = (l: string[]) => l.filter((x) => !/:\s*$/.test(x));
  const own = variant ? clean2(normalizeVariantCatalogue(variant).keyFeatures) : [];
  if (own.length > 0) return own;
  const prod = clean2(productKeyFeatures(product));
  if (prod.length > 0) return prod;
  for (const e of product.variants?.edges ?? []) {
    const f = clean2(normalizeVariantCatalogue(e.node).keyFeatures);
    if (f.length > 0) return f;
  }
  return [];
}

/** Key specifications (Excel "Key Specification 1-3") for the pack, falling back to another pack of the same product. */
export function getKeySpecs(product: ProductWithVariants, variant?: ProductVariant | null): string[] {
  const own = variant ? normalizeVariantCatalogue(variant).keySpecifications : [];
  if (own.length > 0) return own;
  for (const e of product.variants?.edges ?? []) {
    const s = normalizeVariantCatalogue(e.node).keySpecifications;
    if (s.length > 0) return s;
  }
  return [];
}

/** Splits "Heading: sentence" so the heading can be emphasised; text stays verbatim. */
export function splitFeature(line: string): { head: string | null; body: string } {
  const i = line.indexOf(":");
  if (i > 0 && i <= 60) return { head: line.slice(0, i + 1), body: line.slice(i + 1).trim() };
  return { head: null, body: line };
}

const INTRINSIC_FIELDS = [
  "formFactor", "ingredients", "countryOfOrigin", "shelfLife", "storageInstructions", "fssai",
  "containerType", "foodType", "manufacturer", "marketedBy", "address", "manufacture", "hsn",
] as const;

/**
 * Catalogue for the selected pack. Pack-specific fields (SKU, EAN, MRP, weights, pack of) come only from that
 * pack; product-intrinsic fields (ingredients, storage, compliance...) fall back to another pack of the SAME
 * product when the Excel has no row for the selected size. Nothing is borrowed across products.
 */
export function getPackCatalogue(product: ProductWithVariants, variant?: ProductVariant | null): RuchiCatalogue | null {
  if (!variant) return null;
  const base = normalizeVariantCatalogue(variant);
  const siblings = (product.variants?.edges ?? []).map((e) => normalizeVariantCatalogue(e.node));
  const merged = { ...base };
  for (const f of INTRINSIC_FIELDS) {
    if (merged[f] == null) merged[f] = siblings.find((s) => s[f] != null)?.[f] ?? null;
  }
  return merged;
}
