export function ShopProductsSkeleton() {
  return (
    <section className="py-16 sm:py-24 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="h-3 w-32 bg-soft-green rounded mx-auto mb-3 animate-pulse" />
          <div className="h-8 w-64 bg-soft-green rounded mx-auto animate-pulse" />
        </div>

        <div className="flex gap-2 mb-8 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 flex-shrink-0 rounded-[12px] bg-soft-green animate-pulse"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[12px] border border-border bg-white p-3.5"
            >
              <div className="aspect-square w-full rounded-[8px] bg-soft-green animate-pulse mb-3" />
              <div className="h-2.5 w-1/3 bg-soft-green rounded animate-pulse mb-2" />
              <div className="h-3.5 w-3/4 bg-soft-green rounded animate-pulse mb-3" />
              <div className="h-6 w-1/2 bg-soft-green rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
