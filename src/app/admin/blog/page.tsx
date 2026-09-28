import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminArticles } from "@/lib/shopify/admin-blog";
import { AdminShell } from "../layout";
import { Plus, ExternalLink } from "lucide-react";

export default async function AdminBlogPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) redirect("/admin/login");

  let articles: Awaited<ReturnType<typeof getAdminArticles>> = [];
  let error = "";
  try {
    articles = await getAdminArticles();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load articles";
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-text">All Posts</h1>
        <Link
          href="/admin/blog/create"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {error && (
        <div className="card-ruchi p-4 mb-4 border-brand-red/20 bg-red-50">
          <p className="text-sm text-brand-red">{error}</p>
        </div>
      )}

      {articles.length === 0 && !error ? (
        <div className="card-ruchi p-12 text-center">
          <p className="font-serif text-xl font-bold text-text mb-2">No articles yet</p>
          <p className="text-sm text-muted-text mb-6">Create your first blog article to get started.</p>
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="card-ruchi overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-soft-neutral/50">
                <th className="text-left p-3 font-semibold text-text">Title</th>
                <th className="text-left p-3 font-semibold text-text hidden sm:table-cell">Category</th>
                <th className="text-left p-3 font-semibold text-text hidden md:table-cell">Status</th>
                <th className="text-left p-3 font-semibold text-text hidden lg:table-cell">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border last:border-0 hover:bg-soft-neutral/30">
                  <td className="p-3">
                    <p className="font-medium text-text truncate max-w-xs">{article.title}</p>
                    <p className="text-xs text-muted-text mt-0.5 sm:hidden">{article.blog.title}</p>
                  </td>
                  <td className="p-3 hidden sm:table-cell text-muted-text">{article.blog.title}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      article.publishedAt
                        ? "bg-soft-green text-primary-green"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {article.publishedAt ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-muted-text text-xs">
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
                      : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/blog/${encodeURIComponent(article.id)}/edit`}
                        className="text-xs font-medium text-primary-green hover:underline"
                      >
                        Edit
                      </Link>
                      {article.publishedAt && (
                        <Link
                          href={`/blog/${article.handle}`}
                          target="_blank"
                          className="text-muted-text hover:text-text"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
