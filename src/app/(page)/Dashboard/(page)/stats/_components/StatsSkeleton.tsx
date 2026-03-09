import { Skeleton } from '@/components/ui/skeleton';

export function StatsSkeleton() {
  return (
    <section dir="rtl" className="min-h-screen">
      <main className="flex-1 space-y-4 px-1 py-2 pb-16">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="bg-muted/50 flex gap-1 rounded-xl p-1">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </main>
    </section>
  );
}
