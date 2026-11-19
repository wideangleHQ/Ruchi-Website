import type { MetadataRoute } from "next";
import { getSitemapSource } from "@/lib/seo/sitemap-data";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";

// Regenerated at most hourly (the Shopify data behind it is cached for the same window).
export const revalidate = 3600;

/**
 * /sitemap.xml — one sitemap: the catalogue is a few hundred URLs, far below the 50,000-URL limit, so a sitemap index
 * would add a file without adding value. See docs/seo/XML_SITEMAP_AND_CRAWLER_CONFIGURATION.md for the split plan.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries(await getSitemapSource()).map((e) => ({ url: e.url, ...(e.lastModified ? { lastModified: e.lastModified } : {}) }));
}
