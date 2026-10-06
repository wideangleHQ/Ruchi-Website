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
};

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
  };
}
