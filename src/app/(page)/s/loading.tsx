// Purpose: Skeleton loading UI for the storefront page.
// Matches the layout of the actual page with pulse animation.

export default function StorefrontLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar skeleton */}
      <div className="h-14 border-b border-border px-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-muted/50 animate-pulse" />
          <div className="w-24 h-4 rounded-lg bg-muted/50 animate-pulse" />
        </div>
        <div className="hidden sm:flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-14 h-3 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
        <div className="w-9 h-9 rounded-xl bg-muted/50 animate-pulse" />
      </div>

      {/* Banner skeleton */}
      <div className="w-full h-48 sm:h-72 bg-muted/50 animate-pulse" />

      {/* Hero skeleton */}
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-40 h-6 bg-muted/50 rounded-full animate-pulse mx-auto" />
        <div className="w-64 h-10 bg-muted/50 rounded-xl animate-pulse mx-auto" />
        <div className="w-48 h-4 bg-muted/50 rounded-lg animate-pulse mx-auto" />
        <div className="flex justify-center gap-3 mt-6">
          <div className="w-32 h-12 rounded-2xl bg-muted/50 animate-pulse" />
          <div className="w-32 h-12 rounded-2xl bg-muted/50 animate-pulse" />
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-muted/50 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
