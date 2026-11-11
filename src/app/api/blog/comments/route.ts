import { NextRequest, NextResponse } from "next/server";
import { getApprovedComments, addComment } from "@/lib/shopify/admin-blog";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { sanitizeInput } from "@/lib/shopify/contact-submissions";
import {
  ShopifyConfigError,
  ShopifyAuthError,
  ShopifyPermissionError,
  ShopifyRateLimitError,
} from "@/lib/shopify/admin-client";

export async function GET(request: NextRequest) {
  const articleId =
    request.nextUrl.searchParams.get("articleId") ||
    request.nextUrl.searchParams.get("article_id");
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });

  const comments = await getApprovedComments(articleId);
  return NextResponse.json({ comments, reviews: comments });
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, 30);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many comments. Please wait a few minutes before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const articleId = body.articleId || body.article_id;
    const rawName = body.name || "Verified Reader";
    const rawContent = body.content || body.comments;
    const rawRating = body.rating ?? body.ratings;
    const rating = rawRating !== null && rawRating !== undefined ? Number(rawRating) : null;

    if (!articleId || !rawContent?.trim()) {
      return NextResponse.json({ error: "Article ID and comment are required" }, { status: 400 });
    }
    if (rawName.length > 100 || rawContent.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const comment = await addComment(articleId, {
      name: sanitizeInput(rawName),
      content: sanitizeInput(rawContent),
      rating: rating || null,
    });

    return NextResponse.json(
      {
        success: true,
        comment,
        message: "Thank you. Your review was received.",
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("[api/blog/comments] POST failed:", error);

    if (error instanceof ShopifyConfigError) {
      return NextResponse.json(
        {
          error: "Shopify integration configuration missing: SHOPIFY_ADMIN_ACCESS_TOKEN is not configured on the server.",
          code: "CONFIGURATION_ERROR",
        },
        { status: 503 }
      );
    }

    if (error instanceof ShopifyAuthError) {
      return NextResponse.json(
        {
          error: "Shopify Admin authentication failed: invalid or expired access token.",
          code: "AUTHENTICATION_ERROR",
        },
        { status: 502 }
      );
    }

    if (error instanceof ShopifyPermissionError) {
      return NextResponse.json(
        {
          error: "Shopify permissions error: token lacks write_metaobjects scope.",
          code: "PERMISSION_ERROR",
        },
        { status: 502 }
      );
    }

    if (error instanceof ShopifyRateLimitError) {
      return NextResponse.json(
        {
          error: "Shopify API is temporarily busy. Please try again in a few moments.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
