export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-brand bg-soft-green" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-soft-green" />
          <div className="h-5 w-1/4 animate-pulse rounded bg-soft-green" />
          <div className="h-10 w-1/3 animate-pulse rounded bg-soft-green" />
        </div>
      </div>
    </div>
  );
}
