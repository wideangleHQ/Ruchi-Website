// Types mirroring the shape of data we request from the Shopify Storefront API.
// Only fields actually queried in queries.ts / mutations.ts are modeled here.

export type Connection<T> = {
  edges: Array<{ node: T }>;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type SEO = {
  title: string | null;
  description: string | null;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: Array<{ name: string; value: string }>;
  price: Money;
  compareAtPrice: Money | null;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: Image | null;
  images: Connection<Image>;
  variants: Connection<ProductVariant>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  image: Image | null;
  updatedAt: string;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{ name: string; value: string }>;
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: Connection<CartLine>;
};

export type ShopifyErrorLike = {
  status: number;
  message: string;
};

// ---- Raw GraphQL operation response shapes ----

export type ShopifyProductOperation = {
  data: { product: Product | null };
  variables: { handle: string };
};

export type ShopifyProductsOperation = {
  data: { products: Connection<Product> };
  variables: { first: number; sortKey?: string; reverse?: boolean; query?: string };
};

export type ShopifyCollectionOperation = {
  data: { collection: Collection | null };
  variables: { handle: string };
};

export type ShopifyCollectionsOperation = {
  data: { collections: Connection<Collection> };
  variables: { first: number };
};

export type ShopifyCollectionProductsOperation = {
  data: { collection: { products: Connection<Product> } | null };
  variables: { handle: string; first: number; sortKey?: string; reverse?: boolean };
};

export type ShopifyCartOperation = {
  data: { cart: Cart | null };
  variables: { cartId: string };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: Cart } };
};

export type ShopifyAddToCartOperation = {
  data: { cartLinesAdd: { cart: Cart } };
  variables: { cartId: string; lines: Array<{ merchandiseId: string; quantity: number }> };
};

export type ShopifyUpdateCartOperation = {
  data: { cartLinesUpdate: { cart: Cart } };
  variables: {
    cartId: string;
    lines: Array<{ id: string; quantity: number }>;
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: { cartLinesRemove: { cart: Cart } };
  variables: { cartId: string; lineIds: string[] };
};
