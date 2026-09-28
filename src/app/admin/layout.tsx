import Link from "next/link";
import { FileText, FolderOpen, MessageSquare, LogOut, Home } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-soft-neutral flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border hidden md:flex flex-col shrink-0">
        <div className="p-5 border-b border-border">
          <Link href="/admin/blog" className="font-serif text-lg font-bold text-primary-green">
            Ruchi Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <AdminNavLink href="/admin/blog" icon={<FileText className="w-4 h-4" />}>All Posts</AdminNavLink>
          <AdminNavLink href="/admin/blog/create" icon={<FileText className="w-4 h-4" />}>Create Post</AdminNavLink>
          <AdminNavLink href="/admin/blog/categories" icon={<FolderOpen className="w-4 h-4" />}>Categories</AdminNavLink>
          <AdminNavLink href="/admin/blog/comments" icon={<MessageSquare className="w-4 h-4" />}>Comments</AdminNavLink>
        </nav>
        <div className="p-3 border-t border-border space-y-0.5">
          <AdminNavLink href="/" icon={<Home className="w-4 h-4" />}>View Site</AdminNavLink>
          <form action="/api/admin/logout" method="POST">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-text hover:bg-soft-neutral transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border">
          <span className="font-serif text-lg font-bold text-primary-green">Ruchi Admin</span>
          <div className="flex gap-2">
            <Link href="/admin/blog" className="p-2 text-muted-text"><FileText className="w-5 h-5" /></Link>
            <Link href="/admin/blog/comments" className="p-2 text-muted-text"><MessageSquare className="w-5 h-5" /></Link>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

function AdminNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text hover:bg-soft-green hover:text-primary-green transition-colors">
      {icon}
      {children}
    </Link>
  );
}
