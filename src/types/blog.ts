export type BlogArticle = {
  id: string;
  handle: string;
  title: string;
  content: string;
  contentHtml: string;
  excerpt: string | null;
  excerptHtml: string | null;
  image: {
    url: string;
    altText: string | null;
    width: number;
    height: number;
  } | null;
  author: {
    name: string;
    bio: string | null;
  };
  publishedAt: string;
  tags: string[];
  blog: {
    id: string;
    handle: string;
    title: string;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
};

export type BlogCategory = {
  id: string;
  handle: string;
  title: string;
};

export type BlogComment = {
  id: string;
  name: string;
  content: string;
  rating: number | null;
  status: "pending" | "approved" | "rejected" | "spam";
  createdAt: string;
};

export type BlogRating = {
  sessionId: string;
  score: number;
  createdAt: string;
};

export type BlogRatingData = {
  ratings: BlogRating[];
  average: number;
  count: number;
};

export const BLOG_CATEGORIES = [
  "All",
  "Recipes",
  "Manufacturing",
  "Our History",
  "Spices & Ingredients",
  "Food & Wellness",
  "Ruchi Stories",
] as const;

export type BlogCategoryName = (typeof BLOG_CATEGORIES)[number];
