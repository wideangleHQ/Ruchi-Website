"use client";

import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import type { BlogComment } from "@/types/blog";
import { BlogReviewForm } from "./blog-review-form";

export function CommentsSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(() => {
    if (!articleId) return;
    fetch(`/api/blog-reviews?article_id=${encodeURIComponent(articleId)}`)
      .then((r) => r.json())
      .then((data) => {
        setComments(data.reviews || data.comments || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [articleId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-text">
          Reviews & Comments{" "}
          {comments.length > 0 && (
            <span className="text-lg text-muted-text font-normal">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Connected Review Form */}
      <div className="mb-10">
        <BlogReviewForm articleId={articleId} onSuccess={fetchReviews} />
      </div>

      {/* Review & Comment List */}
      <div className="space-y-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-text">
          Community Feedback
        </h3>

        {comments.length > 0 ? (
          <div className="space-y-6 divide-y divide-border/60">
            {comments.map((comment) => (
              <div key={comment.id} className="pt-6 first:pt-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-sm text-text">
                      {comment.name || "Verified Reader"}
                    </p>
                    {Boolean(comment.rating) && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= (comment.rating || 0)
                                ? "fill-accent-gold text-accent-gold"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-text whitespace-nowrap">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-text/85 leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="p-6 rounded-lg bg-surface border border-border/60 text-center">
              <p className="text-sm text-muted-text">
                No reviews yet. Be the first to share your thoughts and rating!
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
