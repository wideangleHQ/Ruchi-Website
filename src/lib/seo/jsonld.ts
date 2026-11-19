import { absoluteUrl, BRAND_NAME, LEGAL_NAME, SITE_NAME, siteUrl, toMetaDescription } from "./site.ts";
import { RUCHI_SOCIAL_URLS } from "../../config/social-links.ts";

/**
 * Schema.org builders. Every value comes from real site or Shopify data; optional fields are omitted when unknown.
 * Deliberately NOT emitted: aggregateRating / review (no verified review data source), LocalBusiness (the site is an
 * online store + manufacturer, and a storefront address would imply walk-in trade), Recipe (articles are free text,
 * not structured recipes — the required ingredient/step fields can't be extracted reliably).
 */

type Json = Record<string, unknown>;

const orgId = (env?: Record<string, string | undefined>) => `${siteUrl(env)}/#organization`;
const clean = <T extends Json>(o: T): T => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "")) as T;

export function organizationJsonLd(env: Record<string, string | undefined> = process.env): Json {
  return clean({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId(env),
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: absoluteUrl("/", env),
    logo: absoluteUrl("/apple-touch-icon.png", env),
    description:
      "Ruchi Foodline, from Om Oil & Flour Mills Ltd., makes and sells spices, blended masalas, tea, pasta and other food products from Cuttack, Odisha, India.",
    foundingDate: "1976",
    // Published in the site footer and contact pages.
    address: {
      "@type": "PostalAddress",
      streetAddress: "Industrial Estate, Madhupatna",
      addressLocality: "Cuttack",
      addressRegion: "Odisha",
      postalCode: "753010",
      addressCountry: "IN",
    },
    contactPoint: [
      clean({
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "info@ruchifoodline.com",
        telephone: "1800 345 4439",
        areaServed: "IN",
      }),
    ],
    sameAs: Object.values(RUCHI_SOCIAL_URLS),
  });
}

export function websiteJsonLd(env: Record<string, string | undefined> = process.env): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl(env)}/#website`,
    name: SITE_NAME,
    url: absoluteUrl("/", env),
    publisher: { "@id": orgId(env) },
    inLanguage: "en-IN",
    // /products?query= is a working search results page (see header search).
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl(env)}/products?query={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[], env: Record<string, string | undefined> = process.env): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.path, env) })),
  };
}

// ---- Product ----

export type SeoVariant = {
  title: string;
  sku: string | null;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  image?: { url: string } | null;
  ean?: string | null;
};

export type SeoProduct = {
  handle: string;
  title: string;
  description: string;
  images: string[];
  variants: SeoVariant[];
};

const isDefaultTitle = (t: string) => !t || t.toLowerCase() === "default title";
const GTIN = /^(\d{8}|\d{12,14})$/;

function offerFor(v: SeoVariant, url: string, env?: Record<string, string | undefined>): Json {
  const price = Number(v.price.amount);
  return clean({
    "@type": "Offer",
    url,
    price: Number.isFinite(price) ? price.toFixed(2) : undefined,
    priceCurrency: v.price.currencyCode,
    availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": orgId(env) },
  });
}

/**
 * One Product for a single-variant item; a ProductGroup with a Product per pack size otherwise (Google's variant model).
 * Price and availability come from each variant, so they always match the pack size a shopper can select.
 * Offers with no valid price are dropped (never emit price 0 or NaN).
 */
export function productJsonLd(p: SeoProduct, env: Record<string, string | undefined> = process.env): Json {
  const url = absoluteUrl(`/products/${p.handle}`, env);
  const description = toMetaDescription(p.description, 5000) || undefined;
  const brand = { "@type": "Brand", name: BRAND_NAME };
  const images = p.images.slice(0, 8);
  const valid = p.variants.filter((v) => Number.isFinite(Number(v.price.amount)) && Number(v.price.amount) > 0);

  const variantProduct = (v: SeoVariant): Json => {
    const label = isDefaultTitle(v.title) ? undefined : v.title;
    return clean({
      "@type": "Product",
      name: label ? `${p.title} ${label}` : p.title,
      sku: v.sku ?? undefined,
      gtin: v.ean && GTIN.test(v.ean.trim()) ? v.ean.trim() : undefined,
      size: label,
      image: v.image?.url ? [v.image.url] : images,
      brand,
      offers: offerFor(v, url, env),
    });
  };

  if (valid.length > 1) {
    return clean({
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      "@id": `${url}#product`,
      name: p.title,
      description,
      url,
      image: images,
      brand,
      productGroupID: p.handle,
      variesBy: ["https://schema.org/size"],
      hasVariant: valid.map(variantProduct),
    });
  }
  const only = valid[0];
  return clean({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.title,
    description,
    url,
    image: images,
    brand,
    sku: only?.sku ?? undefined,
    gtin: only?.ean && GTIN.test(only.ean.trim()) ? only.ean.trim() : undefined,
    offers: only ? offerFor(only, url, env) : undefined,
  });
}

// ---- Article ----

export type SeoArticle = {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  authorName?: string | null;
  publishedAt: string;
  path: string;
};

export function articleJsonLd(a: SeoArticle, env: Record<string, string | undefined> = process.env): Json {
  const url = absoluteUrl(a.path, env);
  return clean({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: a.title.slice(0, 110),
    description: a.description ? toMetaDescription(a.description) : undefined,
    image: a.imageUrl ? [a.imageUrl] : undefined,
    author: a.authorName ? { "@type": "Person", name: a.authorName } : { "@id": orgId(env) },
    // Shopify exposes only the publish date, so dateModified is intentionally omitted rather than guessed.
    datePublished: a.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: { "@id": orgId(env) },
  });
}

/** Serialises for an inline <script>: "<" is escaped so content can never close the tag. */
export function serializeJsonLd(data: Json | Json[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
