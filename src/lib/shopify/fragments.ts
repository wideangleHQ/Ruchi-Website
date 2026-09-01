// Shared GraphQL fragments, reused across queries/mutations to avoid duplicated field sets.

export const moneyFragment = /* GraphQL */ `
  fragment money on MoneyV2 {
    amount
    currencyCode
  }
`;

export const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

export const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    title
    description
  }
`;

export const productVariantFragment = /* GraphQL */ `
  fragment productVariant on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      ...money
    }
    compareAtPrice {
      ...money
    }
  }
  ${moneyFragment}
`;

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      minVariantPrice {
        ...money
      }
      maxVariantPrice {
        ...money
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          ...productVariant
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    collections(first: 10) {
      edges {
        node {
          handle
          title
        }
      }
    }
  }
  ${imageFragment}
  ${productVariantFragment}
  ${seoFragment}
`;

export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    seo {
      ...seo
    }
    image {
      ...image
    }
    updatedAt
  }
  ${seoFragment}
  ${imageFragment}
`;

export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...money
      }
      totalAmount {
        ...money
      }
      totalTaxAmount {
        ...money
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...money
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...image
                }
              }
            }
          }
        }
      }
    }
  }
  ${moneyFragment}
  ${imageFragment}
`;
