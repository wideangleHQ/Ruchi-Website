import type { Collection, Product } from "./types";

export const MOCK_COLLECTIONS: Collection[] = [
  {
    handle: "basic-spices",
    title: "Basic Spices",
    description: "Pure ground turmeric, chilli, coriander, and cumin crafted for everyday Indian cooking.",
    seo: { title: "Basic Spices | Ruchi Foodline", description: "Pure Indian basic spices" },
    image: {
      url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
      altText: "Basic Spices",
      width: 800,
      height: 800,
    },
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "blended-masalas",
    title: "Blended Masalas",
    description: "Authentic spice blends for Biryani, Chicken Curry, Garam Masala, and Chole.",
    seo: { title: "Blended Masalas | Ruchi Foodline", description: "Authentic Indian blended masalas" },
    image: {
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
      altText: "Blended Masalas",
      width: 800,
      height: 800,
    },
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "sattvik-collection",
    title: "Sattvik Collection",
    description: "Pure spices prepared without onion or garlic for sacred, authentic vegetarian cooking.",
    seo: { title: "Sattvik Collection | Ruchi Foodline", description: "No onion, no garlic spice collection" },
    image: {
      url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
      altText: "Sattvik Collection",
      width: 800,
      height: 800,
    },
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "pasta-vermicelli",
    title: "Pasta & Vermicelli",
    description: "Premium durum wheat pasta and roasted vermicelli for healthy, tasty family meals.",
    seo: { title: "Pasta & Vermicelli | Ruchi Foodline", description: "Durum wheat pasta and roasted vermicelli" },
    image: {
      url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=800&auto=format&fit=crop",
      altText: "Pasta & Vermicelli",
      width: 800,
      height: 800,
    },
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "ready-mix",
    title: "Ready Mixes",
    description: "Instant, traditional Indian breakfast and snack mixes for quick gourmet cooking.",
    seo: { title: "Ready Mixes | Ruchi Foodline", description: "Instant Indian mixes" },
    image: {
      url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop",
      altText: "Ready Mixes",
      width: 800,
      height: 800,
    },
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "gid://shopify/Product/1",
    handle: "ruchi-biryani-masala",
    title: "Ruchi Biryani Masala",
    availableForSale: true,
    description: "A rich aromatic spice blend of cardamom, mace, nutmeg, and cinnamon crafted for authentic royal Biryani.",
    descriptionHtml: "<p>A rich aromatic spice blend crafted for royal Biryani.</p>",
    options: [
      { id: "opt-1", name: "Pack Size", values: ["100g", "200g", "500g"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "66.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "125.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
      altText: "Ruchi Biryani Masala",
      width: 800,
      height: 800,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
            altText: "Ruchi Biryani Masala Pack",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/101",
            title: "100g",
            availableForSale: true,
            quantityAvailable: 50,
            selectedOptions: [{ name: "Pack Size", value: "100g" }],
            price: { amount: "66.00", currencyCode: "INR" },
            compareAtPrice: { amount: "75.00", currencyCode: "INR" },
          },
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/102",
            title: "200g",
            availableForSale: true,
            quantityAvailable: 30,
            selectedOptions: [{ name: "Pack Size", value: "200g" }],
            price: { amount: "125.00", currencyCode: "INR" },
            compareAtPrice: { amount: "140.00", currencyCode: "INR" },
          },
        },
      ],
    },
    seo: { title: "Ruchi Biryani Masala", description: "Authentic Indian Biryani spice blend." },
    tags: ["bestseller", "blended-masalas", "spices"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gid://shopify/Product/2",
    handle: "ruchi-turmeric-powder",
    title: "Ruchi Pure Turmeric Powder",
    availableForSale: true,
    description: "High curcumin content turmeric powder ground from sun-dried select Salem turmeric roots for vibrant golden colour and immunity.",
    descriptionHtml: "<p>High curcumin turmeric powder from Salem turmeric roots.</p>",
    options: [
      { id: "opt-2", name: "Pack Size", values: ["200g", "500g"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "55.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "130.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
      altText: "Ruchi Turmeric Powder",
      width: 800,
      height: 800,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=800&auto=format&fit=crop",
            altText: "Ruchi Turmeric Powder",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/201",
            title: "200g",
            availableForSale: true,
            quantityAvailable: 100,
            selectedOptions: [{ name: "Pack Size", value: "200g" }],
            price: { amount: "55.00", currencyCode: "INR" },
            compareAtPrice: null,
          },
        },
      ],
    },
    seo: { title: "Ruchi Turmeric Powder", description: "Pure Salem turmeric powder." },
    tags: ["bestseller", "basic-spices"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gid://shopify/Product/3",
    handle: "ruchi-chicken-masala",
    title: "Ruchi Chicken Masala",
    availableForSale: true,
    description: "A signature recipe of roasted spices formulated to bring out deep savory, spicy chicken curry gravies.",
    descriptionHtml: "<p>Signature roasted chicken spice blend.</p>",
    options: [
      { id: "opt-3", name: "Pack Size", values: ["100g", "200g"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "72.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "138.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
      altText: "Ruchi Chicken Masala",
      width: 800,
      height: 800,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
            altText: "Ruchi Chicken Masala",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/301",
            title: "100g",
            availableForSale: true,
            quantityAvailable: 45,
            selectedOptions: [{ name: "Pack Size", value: "100g" }],
            price: { amount: "72.00", currencyCode: "INR" },
            compareAtPrice: { amount: "80.00", currencyCode: "INR" },
          },
        },
      ],
    },
    seo: { title: "Ruchi Chicken Masala", description: "Rich chicken curry spice blend." },
    tags: ["bestseller", "blended-masalas"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gid://shopify/Product/4",
    handle: "ruchi-meat-masala",
    title: "Ruchi Meat Masala",
    availableForSale: true,
    description: "Balanced spice blend for mutton, lamb, and rich gravies, bringing slow-cooked traditional flavor.",
    descriptionHtml: "<p>Balanced spice blend for mutton and lamb gravies.</p>",
    options: [
      { id: "opt-4", name: "Pack Size", values: ["100g"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "78.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "78.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
      altText: "Ruchi Meat Masala",
      width: 800,
      height: 800,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=800&auto=format&fit=crop",
            altText: "Ruchi Meat Masala",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/401",
            title: "100g",
            availableForSale: true,
            quantityAvailable: 60,
            selectedOptions: [{ name: "Pack Size", value: "100g" }],
            price: { amount: "78.00", currencyCode: "INR" },
            compareAtPrice: null,
          },
        },
      ],
    },
    seo: { title: "Ruchi Meat Masala", description: "Traditional meat spice masala." },
    tags: ["bestseller", "blended-masalas"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gid://shopify/Product/5",
    handle: "ruchi-sattvik-gift-box",
    title: "Ruchi Sattvik Spice Gift Box",
    availableForSale: true,
    description: "Limited Edition Sattvik Collection box including 6 essential pure spices crafted strictly without onion or garlic.",
    descriptionHtml: "<p>Limited Edition Sattvik Collection box.</p>",
    options: [
      { id: "opt-5", name: "Set", values: ["Box of 6"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "399.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "399.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
      altText: "Ruchi Sattvik Spice Gift Box",
      width: 800,
      height: 800,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop",
            altText: "Ruchi Sattvik Box",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/501",
            title: "Box of 6",
            availableForSale: true,
            quantityAvailable: 25,
            selectedOptions: [{ name: "Set", value: "Box of 6" }],
            price: { amount: "399.00", currencyCode: "INR" },
            compareAtPrice: { amount: "499.00", currencyCode: "INR" },
          },
        },
      ],
    },
    seo: { title: "Ruchi Sattvik Spice Gift Box", description: "Pure sattvik spice box." },
    tags: ["featured", "sattvik-collection"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gid://shopify/Product/6",
    handle: "ruchi-durum-pasta-fusilli",
    title: "Ruchi Premium Pasta Fusilli",
    availableForSale: true,
    description: "100% durum wheat semolina pasta. Non-sticky, rich in protein, perfect for Italian and Indian fusion recipes.",
    descriptionHtml: "<p>100% durum wheat semolina fusilli pasta.</p>",
    options: [
      { id: "opt-6", name: "Weight", values: ["500g"] }
    ],
    priceRange: {
      minVariantPrice: { amount: "95.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "95.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=800&auto=format&fit=crop",
      altText: "Ruchi Premium Pasta Fusilli",
      width: 800,
      height: 800,
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?q=80&w=800&auto=format&fit=crop",
            altText: "Ruchi Pasta Fusilli",
            width: 800,
            height: 800,
          },
        },
      ],
    },
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/601",
            title: "500g",
            availableForSale: true,
            quantityAvailable: 80,
            selectedOptions: [{ name: "Weight", value: "500g" }],
            price: { amount: "95.00", currencyCode: "INR" },
            compareAtPrice: null,
          },
        },
      ],
    },
    seo: { title: "Ruchi Premium Pasta Fusilli", description: "Durum wheat semolina fusilli pasta." },
    tags: ["pasta-vermicelli"],
    updatedAt: new Date().toISOString(),
  },
];
