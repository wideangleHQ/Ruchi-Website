/**
 * Descriptive alt text for product photos. Shopify's own alt text always wins. When it is missing, the label comes from
 * the catalogue's file naming ("...-fssai-license.jpg", "...-ingredients.jpg", "...-front.jpg") so the alt says what
 * the image actually shows — never generic repetition of the product title on every picture, and nothing invented.
 */
const LABELS: Array<[RegExp, string]> = [
  [/fssai/, "FSSAI licence details"],
  [/manufac/, "manufacturer details"],
  [/ingredient/, "ingredients"],
  [/nutrition/, "nutrition information"],
  [/veg-?logo/, "vegetarian mark"],
  [/contact|coontact/, "contact details"],
  [/-back(?:[_.-]|$)/, "pack – back"],
  [/-front(?:[_.-]|$)/, "pack – front"],
];

export function productImageAlt(
  product: { title: string },
  image: { url: string; altText?: string | null },
  position: number,
  packLabel?: string | null
): string {
  const given = image.altText?.trim();
  if (given) return given;
  const file = image.url.split("?")[0].split("/").pop()?.toLowerCase() ?? "";
  const label = LABELS.find(([re]) => re.test(file))?.[1];
  const base = packLabel ? `${product.title} ${packLabel}` : product.title;
  return label ? `${base} ${label}` : `${base} – photo ${position + 1}`;
}
