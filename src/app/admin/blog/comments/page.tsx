"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "../../layout";
import { Check, X, Trash2 } from "lucide-react";
import type { BlogComment } from "@/types/blog";

type ArticleComments = {
  articleId: string;
  articleTitle: string;
  comments: BlogComment[];
};

export default function CommentsPage() {
  const [data, setData] = useState<ArticleComments[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState("");

  useEffect(() => {
    fetch("/api/admin/comments")
      .then((r) => r.json())
      .then((d) => setData(d.articles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const moderate = async (articleId: string, commentId: string, status: string) => {
    setActionInProgress(commentId);
    try {
      await fetch("/api/admin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, commentId, status }),
      });
      setData((prev) =>
        prev.map((a) =>
          a.articleId === articleId
            ? { ...a, comments: a.comments.map((c) => c.id === commentId ? { ...c, status: status as BlogComment["status"] } : c) }
            : a
        )
      );
    } catch { /* noop */ }
    setActionInProgress("");
  };

  if (loading) {
    return (
      <AdminShell>
        <h1 className="font-serif text-2xl font-bold text-text mb-6">Comments</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-ruchi p-4 animate-pulse">
              <div className="h-4 w-48 bg-soft-neutral rounded mb-3" />
              <div className="h-3 w-full bg-soft-neutral rounded" />
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  const allComments = data.flatMap((a) =>
    a.comments.map((c) => ({ ...c, articleId: a.articleId, articleTitle: a.articleTitle }))
  );
  const pending = allComments.filter((c) => c.status === "pending");
  const approved = allComments.filter((c) => c.status === "approved");
  const rejected = allComments.filter((c) => c.status === "rejected" || c.status === "spam");

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-bold text-text mb-6">Comments</h1>

      {allComments.length === 0 ? (
        <div className="card-ruchi p-12 text-center">
          <p className="text-sm text-muted-text">No comments yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-text mb-3">
                Pending Review ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((c) => (
                  <CommentCard
                    key={c.id}
                    comment={c}
                    articleTitle={c.articleTitle}
                    onApprove={() => moderate(c.articleId, c.id, "approved")}
                    onReject={() => moderate(c.articleId, c.id, "rejected")}
                    onSpam={() => moderate(c.articleId, c.id, "spam")}
                    disabled={actionInProgress === c.id}
                  />
                ))}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-text mb-3">
                Approved ({approved.length})
              </h2>
              <div className="space-y-3">
                {approved.map((c) => (
                  <CommentCard
                    key={c.id}
                    comment={c}
                    articleTitle={c.articleTitle}
                    onReject={() => moderate(c.articleId, c.id, "rejected")}
                    disabled={actionInProgress === c.id}
                  />
                ))}
              </div>
            </div>
          )}

          {rejected.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-text mb-3">
                Rejected / Spam ({rejected.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {rejected.map((c) => (
                  <CommentCard
                    key={c.id}
                    comment={c}
                    articleTitle={c.articleTitle}
                    onApprove={() => moderate(c.articleId, c.id, "approved")}
                    disabled={actionInProgress === c.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}

function CommentCard({
  comment,
  articleTitle,
  onApprove,
  onReject,
  onSpam,
  disabled,
}: {
  comment: BlogComment;
  articleTitle: string;
  onApprove?: () => void;
  onReject?: () => void;
  onSpam?: () => void;
  disabled: boolean;
}) {
  return (
    <div className="card-ruchi p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-sm font-semibold text-text">{comment.name}</p>
          <p className="text-xs text-muted-text">on {articleTitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {onApprove && (
            <button
              onClick={onApprove}
              disabled={disabled}
              className="p-1.5 rounded text-primary-green hover:bg-soft-green disabled:opacity-50"
              title="Approve"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              disabled={disabled}
              className="p-1.5 rounded text-brand-red hover:bg-red-50 disabled:opacity-50"
              title="Reject"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {onSpam && (
            <button
              onClick={onSpam}
              disabled={disabled}
              className="p-1.5 rounded text-muted-text hover:bg-soft-neutral disabled:opacity-50"
              title="Mark as spam"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-text/85 leading-relaxed">{comment.content}</p>
      <p className="text-[11px] text-muted-text mt-2">
        {new Date(comment.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  );
}
