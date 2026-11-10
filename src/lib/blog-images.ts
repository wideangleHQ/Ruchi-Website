import chanaImg from "@/assets/Images/Blogs Pictures/Chann Massala.jpg";
import chaiImg from "@/assets/Images/Blogs Pictures/Elaichi Chai.jpg";
import wholeVsGroundImg from "@/assets/Images/Blogs Pictures/Grounded Vs Whole.jpg";
import pastaImg from "@/assets/Images/Blogs Pictures/Pasta.jpg";

export interface BlogImageData {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

const BLOG_IMAGES_BY_HANDLE: Record<string, BlogImageData> = {
  // 1. Chana Masala Recipe
  "chana-masala-recipe-restaurant-style-chole-at-home": {
    url: chanaImg.src,
    altText: "Chana Masala Recipe: Restaurant-Style Chole at Home",
    width: chanaImg.width,
    height: chanaImg.height,
  },
  // 2. Elaichi Chai
  "how-to-make-perfect-elaichi-chai": {
    url: chaiImg.src,
    altText: "How to Make Perfect Elaichi Chai: A Step-by-Step Guide",
    width: chaiImg.width,
    height: chaiImg.height,
  },
  // 3. Whole Spices vs Ground Spices
  "whole-spices-vs-ground-spices-which-to-use": {
    url: wholeVsGroundImg.src,
    altText: "Whole Spices vs Ground Spices: Which Should You Use and When?",
    width: wholeVsGroundImg.width,
    height: wholeVsGroundImg.height,
  },
  // 4. Easy Pasta Recipes
  "easy-pasta-recipes-busy-weeknights": {
    url: pastaImg.src,
    altText: "Easy Pasta Recipes for Busy Weeknights (Ready in 20 Minutes)",
    width: pastaImg.width,
    height: pastaImg.height,
  },
  // 5. Everyday Indian Spices
  "everyday-indian-spices-balanced-diet": {
    url: wholeVsGroundImg.src,
    altText: "5 Everyday Indian Spices: What They Taste Like and How to Use Them",
    width: wholeVsGroundImg.width,
    height: wholeVsGroundImg.height,
  },
};

export function getLocalBlogImage(
  handle: string,
  title = "",
  blogHandle = ""
): BlogImageData {
  // Direct handle match
  if (BLOG_IMAGES_BY_HANDLE[handle]) {
    return BLOG_IMAGES_BY_HANDLE[handle];
  }

  // Keyword-based fallback matching
  const key = `${handle} ${title} ${blogHandle}`.toLowerCase();

  if (key.includes("pasta") || key.includes("noodle") || key.includes("macaroni") || key.includes("spaghetti")) {
    return {
      url: pastaImg.src,
      altText: title || "Ruchi Pasta & Noodles",
      width: pastaImg.width,
      height: pastaImg.height,
    };
  }

  if (key.includes("chai") || key.includes("tea") || key.includes("elaichi")) {
    return {
      url: chaiImg.src,
      altText: title || "Ruchi Chai & Tea",
      width: chaiImg.width,
      height: chaiImg.height,
    };
  }

  if (key.includes("chana") || key.includes("chole") || key.includes("curry") || key.includes("recipe")) {
    return {
      url: chanaImg.src,
      altText: title || "Ruchi Recipe",
      width: chanaImg.width,
      height: chanaImg.height,
    };
  }

  // Default spice fallback
  return {
    url: wholeVsGroundImg.src,
    altText: title || "Ruchi Spices",
    width: wholeVsGroundImg.width,
    height: wholeVsGroundImg.height,
  };
}

