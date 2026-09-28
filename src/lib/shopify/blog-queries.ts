export const articleFragment = /* GraphQL */ `
  fragment ArticleFields on Article {
    id
    handle
    title
    content
    contentHtml
    excerpt
    excerptHtml
    image {
      url
      altText
      width
      height
    }
    authorV2 {
      name
      bio
    }
    publishedAt
    tags
    blog {
      id
      handle
      title
    }
    seo {
      title
      description
    }
  }
`;

export const getArticlesQuery = /* GraphQL */ `
  ${articleFragment}
  query GetArticles($first: Int!, $query: String, $sortKey: ArticleSortKeys, $reverse: Boolean, $after: String) {
    articles(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
      edges {
        node {
          ...ArticleFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
    }
  }
`;

export const getArticleByHandleQuery = /* GraphQL */ `
  ${articleFragment}
  query GetArticleByHandle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        ...ArticleFields
      }
    }
  }
`;

export const getBlogsQuery = /* GraphQL */ `
  query GetBlogs($first: Int!) {
    blogs(first: $first) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`;

export const getBlogArticlesQuery = /* GraphQL */ `
  ${articleFragment}
  query GetBlogArticles($handle: String!, $first: Int!, $query: String, $sortKey: ArticleSortKeys, $reverse: Boolean, $after: String) {
    blog(handle: $handle) {
      articles(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse, after: $after) {
        edges {
          node {
            ...ArticleFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  }
`;
