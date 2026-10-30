// Global Business & Exports page — copy and facts in one place so the business can review and edit them.
//
// SOURCING (confirm before publishing):
//  • "Since 1976", Cuttack (Odisha), ISO 22000:2018, the export country list and the dealer / super-stockist
//    network come from the company profile (Documents/About_Us.pdf) and the certificates in src/assets/Certifications.
//  • Export awards come from "Laurels & Awards bagged by Ruchi" (src/assets/Awards).
//  • Pack formats (pouch, box, jar, sachet) come from the product catalogue.
//  • Nothing here promises private label, custom packaging, volumes or lead times — those are left to the enquiry.

export const GB_COLORS = {
  maroon: "#6e1418",
  maroonDeep: "#3f0a0d",
  red: "#9f1f24", // --color-deep-red
  greenLight: "#6fdc9a", // green for dark backgrounds
  green: "#168a4a", // secondary green (--color-primary-green)
  ivory: "#faf6ef",
  charcoal: "#1f1a17",
};

export const HERO = {
  eyebrow: "Global Business & Exports",
  // Rendered with "Indian authenticity" in gold.
  headlineLead: "Delivering",
  headlineAccent: "Indian authenticity",
  headlineTail: "to global markets",
  support:
    "Bringing authentic Indian flavours to international markets through meaningful business partnerships, quality-focused products, and reliable supply relationships.",
  cta: "Discuss an Export Partnership",
};

export const TRUST = {
  eyebrow: "Global Business",
  heading: "Growing Across Borders with Trust",
  story:
    "From local Indian roots to global shelves, our products continue to bring authentic flavours to diverse markets around the world.",
  // Content themes, not certifications. Facts (1976, Cuttack, ISO 22000:2018, pack formats) are from the company profile.
  pillars: [
    { title: "Indian Heritage", text: "A food business from Cuttack, Odisha, making everyday Indian staples since 1976." },
    { title: "Product Portfolio", text: "Spices, pasta, vermicelli, noodles, tea and ready mixes, sold under one brand: RUCHI." },
    { title: "Quality Practices", text: "Our food safety management system is certified to ISO 22000:2018." },
    { title: "Packaging", text: "Retail-ready packs in pouches, boxes, jars and sachets, as listed in our product catalogue." },
    {
      title: "Business Partnerships",
      text: "We welcome long-term relationships with distributors, importers, retailers and bulk buyers.",
    },
  ],
};

export const CAPABILITIES = {
  heading: "Built for business. Ready for partnerships.",
  support: "Explore the opportunities to work with RUCHI Foodline across product supply, packaging, and distribution partnerships.",
};

export const ENQUIRY = {
  heading: "Let's bring Indian flavours to your market.",
  support:
    "Looking to explore a business partnership with RUCHI Foodline? Share your requirements with us, and our team can connect with you to discuss potential opportunities.",
  submit: "Submit Business Enquiry",
  // Stored through the existing /api/contact pipeline (Shopify metaobject "contact_submission").
  businessType: "International import / distribution (export enquiry)",
};

/** Catalogue categories (Excel catalogue sheets + Hampers) — used when the live Shopify collections can't be read. */
export const FALLBACK_CATEGORIES = [
  "Basic Spices",
  "Blended Spices",
  "Whole Spices",
  "Pasta",
  "Vermicelli",
  "Noodles",
  "Tea",
  "Flour & Ready Mixes",
  "Hampers",
];

export const CATALOGUE_PDF = "/documents/Ruchi-Foodline-Product-Catalogue.pdf";
