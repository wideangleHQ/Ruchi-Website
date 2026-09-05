export function ShopProductsSkeleton() {
  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Square Category Cards Skeleton */}
        <div className="flex gap-3 sm:gap-4 lg:gap-5 mb-5 overflow-hidden py-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center w-[98px] sm:w-[120px] md:w-[136px] lg:w-[148px] flex-shrink-0">
              <div className="aspect-square w-full rounded-[14px] bg-soft-green animate-pulse" />
              <div className="h-3 w-16 bg-soft-green rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
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
