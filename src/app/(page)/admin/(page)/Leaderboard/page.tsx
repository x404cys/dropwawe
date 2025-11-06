'use client';

import { useMemo } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { useAdmin } from '../../context/DataContext';
import Loader from '@/components/Loader';

export default function TopStoresList() {
  const { stores, loading, err } = useAdmin();

  const topStores = useMemo(() => {
    return [...stores].sort((a, b) => b.totalProfit - a.totalProfit).slice(0, 10);
  }, [stores]);

  if (err) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-4 text-4xl">⚠️</div>
          <p className="text-destructive">{err}</p>
        </div>
      </div>
    );
  }
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="mx-auto max-w-fit py-8">
      <div className="mb-8 text-center">
        <div className="mb-2 inline-flex items-center gap-2">
          <Trophy className="text-primary h-6 w-6" />
          <h1 className="text-foreground text-2xl font-bold">أفضل المتاجر ربحاً</h1>
        </div>
        <p className="text-muted-foreground">قائمة بأعلى المتاجر ربحية في المنصة</p>
      </div>
      <div className="mt-8 mb-4 text-center">
        <div className="bg-muted text-muted-foreground inline-flex items-center gap-4 rounded-full px-4 py-2 text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="bg-border h-4 w-px" />
          <div>
            د.ع{topStores.reduce((sum, store) => sum + store.totalProfit, 0).toLocaleString()}{' '}
            إجمالي الأرباح
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {topStores.map((store, index) => (
          <div
            key={store.id}
            className="group bg-card relative rounded-lg border p-4 transition-all hover:shadow-md md:w-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : index === 1
                        ? 'bg-gray-100 text-gray-800'
                        : index === 2
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>

                <div>
                  <h3 className="text-card-foreground font-semibold">{store.storeName}</h3>
                  <p className="text-muted-foreground text-sm">
                    التاجر: <span className="font-medium">{store.name}</span>
                  </p>
                </div>
              </div>

              {/* Right side - Profit Display */}
              <div className="text-right">
                <div className="text-primary text-lg font-bold">
                  د.ع{store.totalProfit.toLocaleString()}
                </div>
                <div className="text-muted-foreground text-xs">إجمالي الربح</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer stats */}
    </div>
  );
}
