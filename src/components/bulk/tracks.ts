// B2B buyer tracks — shared by the /bulk hub, its enquiry form and the homepage entry block.
// Copy describes what each buyer can ask for; it makes no capacity, MOQ or pricing claims
// (none have been approved — add them here once the business confirms figures).

export type TrackId = "super-stockist" | "distributor" | "horeca" | "corporate-gifting";

export type Track = {
  id: TrackId;
  title: string;
  who: string;
  askFor: string[];
  /** Stored as the enquiry's business type, so the sales team can route it. */
  businessType: string;
  /** Extra field shown in the form for this track. */
  quantityLabel: string;
};

export const TRACKS: Track[] = [
  {
    id: "super-stockist",
    title: "Super Stockist",
    who: "Regional stockists supplying distributors across a district or state.",
    askFor: ["Territory availability", "Full-range price list", "Stock replenishment terms"],
    businessType: "Super Stockist",
    quantityLabel: "Expected monthly volume",
  },
  {
    id: "distributor",
    title: "Retail Distributor",
    who: "Distributors and wholesalers serving kirana stores and modern retail.",
    askFor: ["Retail pack range", "Distributor margins", "Display & merchandising support"],
    businessType: "Retail Distributor",
    quantityLabel: "Expected monthly volume",
  },
  {
    id: "horeca",
    title: "HoReCa",
    who: "Hotels, restaurants, caterers and institutional kitchens.",
    askFor: ["Larger kitchen packs", "Consistent blends for menus", "Regular supply schedule"],
    businessType: "HoReCa",
    quantityLabel: "Approximate monthly requirement",
  },
  {
    id: "corporate-gifting",
    title: "Festive & Corporate Gifting",
    who: "Companies and organisers ordering spice hampers and combos for festivals and events.",
    askFor: ["Hamper & combo options", "Quantity pricing", "Delivery timelines"],
    businessType: "Corporate Gifting",
    quantityLabel: "Number of hampers",
  },
];

export const trackById = (id: string | null | undefined): Track | undefined => TRACKS.find((t) => t.id === id);
