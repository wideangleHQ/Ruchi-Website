"use client";

import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";
import type { BlogComment } from "@/types/blog";

export function CommentsSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blog/comments?articleId=${encodeURIComponent(articleId)}`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => {});
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          name: name.trim(),
          content: content.trim(),
          rating: rating || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit comment");
        return;
      }

      setSubmitted(true);
      setName("");
      setContent("");
      setRating(0);
    } catch {
      setError("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days > 30) return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    const hours = Math.floor(diff / 3600000);
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <h2 className="font-serif text-2xl font-bold text-text mb-6">
        Comments {comments.length > 0 && <span className="text-lg text-muted-text font-normal">({comments.length})</span>}
      </h2>

      {/* Comment Form */}
      {submitted ? (
        <div className="card-ruchi p-6 mb-8 bg-soft-green/50 border-primary-green/20">
          <p className="text-sm font-medium text-primary-green">
            Thank you for your comment! It will appear after review.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card-ruchi p-5 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={100}
              required
              className="px-4 py-2.5 rounded-lg border border-border text-sm text-text placeholder:text-muted-text/60 focus:outline-none focus:border-primary-green/40"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-text mr-1">Rating</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(rating === s ? 0 : s)}
                  className="p-0.5"
                >
                  <Star className={`w-5 h-5 ${s <= rating ? "fill-accent-gold text-accent-gold" : "text-border"}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            maxLength={2000}
            rows={3}
            required
            className="w-full px-4 py-2.5 rounded-lg border border-border text-sm text-text placeholder:text-muted-text/60 focus:outline-none focus:border-primary-green/40 resize-none mb-4"
          />
          {error && <p className="text-sm text-brand-red mb-3">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !name.trim() || !content.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting…" : "Submit Comment"}
          </button>
        </form>
      )}

      {/* Comment List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold text-sm text-text">{comment.name}</p>
                  {comment.rating && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= comment.rating! ? "fill-accent-gold text-accent-gold" : "text-border"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-text whitespace-nowrap">{timeAgo(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-text/85 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        !submitted && (
          <p className="text-sm text-muted-text">No comments yet. Be the first to share your thoughts!</p>
        )
      )}
    </section>
  );
}
