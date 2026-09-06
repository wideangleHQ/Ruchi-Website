export default function ShopPageLoading() {
  return (
    <div className="bg-white py-5 sm:py-7">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-5">
          <div className="h-3 w-32 bg-soft-green rounded animate-pulse mb-2" />
          <div className="h-7 w-56 bg-soft-green rounded animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-[240px] shrink-0 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2.5">
                <div className="h-3 w-20 bg-soft-green rounded animate-pulse" />
                <div className="h-4 w-full bg-soft-green rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-soft-green rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-soft-green rounded animate-pulse" />
              </div>
            ))}
          </aside>

          {/* Main Column Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="mb-5 aspect-[16/5] w-full rounded-[12px] bg-soft-green animate-pulse" />

            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-soft-green rounded animate-pulse" />
              <div className="h-8 w-40 bg-soft-green rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-[12px] border border-border bg-white p-3.5">
                  <div className="aspect-square w-full rounded-[8px] bg-soft-green animate-pulse mb-3" />
                  <div className="h-2.5 w-1/3 bg-soft-green rounded animate-pulse mb-2" />
                  <div className="h-3.5 w-3/4 bg-soft-green rounded animate-pulse mb-3" />
                  <div className="h-6 w-1/2 bg-soft-green rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
