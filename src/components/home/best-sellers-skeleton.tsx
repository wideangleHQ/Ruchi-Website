export function BestSellersSkeleton() {
  return (
    <section className="py-5 sm:py-7 lg:py-9 bg-transparent" aria-label="Best sellers loading">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6 lg:mb-7">
          <div>
            <div className="h-3 w-32 bg-soft-green rounded animate-pulse mb-3" />
            <div className="h-8 w-56 bg-soft-green rounded animate-pulse mb-2" />
            <div className="h-4 w-72 bg-soft-green rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="w-10 h-10 rounded-full bg-soft-green animate-pulse" />
            <div className="w-10 h-10 rounded-full bg-soft-green animate-pulse" />
          </div>
        </div>
        <div className="flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[240px] sm:w-[270px] md:w-[290px] lg:w-[310px] shrink-0 rounded-[15px] border border-gray-200/90 bg-white p-3.5 sm:p-4"
            >
              <div className="aspect-square w-full rounded-[10px] bg-soft-green animate-pulse mb-3.5" />
              <div className="h-2.5 w-1/3 bg-soft-green rounded animate-pulse mb-2" />
              <div className="h-3.5 w-3/4 bg-soft-green rounded animate-pulse mb-3.5" />
              <div className="h-8 w-full bg-soft-green rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

