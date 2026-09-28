export default function BlogArticleLoading() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-4 w-48 bg-soft-neutral rounded animate-pulse mb-6" />
      <div className="max-w-3xl space-y-4 mb-10">
        <div className="h-3 w-24 bg-soft-neutral rounded animate-pulse" />
        <div className="h-10 w-full bg-soft-neutral rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-soft-neutral rounded animate-pulse" />
        <div className="h-5 w-full bg-soft-neutral rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-soft-neutral rounded animate-pulse" />
          <div className="h-4 w-24 bg-soft-neutral rounded animate-pulse" />
          <div className="h-4 w-20 bg-soft-neutral rounded animate-pulse" />
        </div>
      </div>
      <div className="aspect-[2/1] max-w-4xl bg-soft-neutral rounded-[var(--radius-brand)] animate-pulse mb-10" />
      <div className="max-w-3xl space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-soft-neutral rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
    </div>
  );
}
