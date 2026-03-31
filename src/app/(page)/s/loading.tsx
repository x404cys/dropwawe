// Purpose: Skeleton loading UI for the storefront page.
// Matches the layout of the actual page with pulse animation.

export default function StorefrontLoading() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navbar skeleton */}
      <div className="border-border mx-auto flex h-14 w-full max-w-5xl items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <div className="bg-muted/50 h-8 w-8 animate-pulse rounded-xl" />
          <div className="bg-muted/50 h-4 w-24 animate-pulse rounded-lg" />
        </div>
        <div className="hidden gap-4 sm:flex">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted/50 h-3 w-14 animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="bg-muted/50 h-9 w-9 animate-pulse rounded-xl" />
      </div>

      {/* Banner skeleton */}
      <div className="bg-muted/50 h-48 w-full animate-pulse sm:h-72" />

      {/* Hero skeleton */}
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-16 text-center">
        <div className="bg-muted/50 mx-auto h-6 w-40 animate-pulse rounded-full" />
        <div className="bg-muted/50 mx-auto h-10 w-64 animate-pulse rounded-xl" />
        <div className="bg-muted/50 mx-auto h-4 w-48 animate-pulse rounded-lg" />
        <div className="mt-6 flex justify-center gap-3">
          <div className="bg-muted/50 h-12 w-32 animate-pulse rounded-2xl" />
          <div className="bg-muted/50 h-12 w-32 animate-pulse rounded-2xl" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="mx-auto max-w-5xl px-4 pb-12">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted/50 h-48 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
