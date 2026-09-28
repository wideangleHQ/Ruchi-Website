import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminArticles, getComments, moderateComment } from "@/lib/shopify/admin-blog";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articles = await getAdminArticles();
    const articlesWithComments = await Promise.all(
      articles.map(async (article) => {
        const comments = await getComments(article.id);
        return {
          articleId: article.id,
          articleTitle: article.title,
          comments,
        };
      })
    );

    return NextResponse.json({
      articles: articlesWithComments.filter((a) => a.comments.length > 0),
    });
  } catch (error) {
    console.error("[api/admin/comments] GET failed:", error);
    return NextResponse.json({ articles: [] });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { articleId, commentId, status } = await request.json();
  if (!articleId || !commentId || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await moderateComment(articleId, commentId, status);
  return NextResponse.json({ success: true });
}
