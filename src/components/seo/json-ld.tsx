import { serializeJsonLd } from "@/lib/seo/jsonld";

/** Renders one or more schema.org entities as JSON-LD. Server component: the data is in the initial HTML. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
