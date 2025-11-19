'use client';

import { Button } from '@/components/ui/button';
import { Product } from '@/types/Products';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductsCardDropWaveProps {
  product: Product;
}

export default function ProductsCardDropWave({ product }: ProductsCardDropWaveProps) {
  const router = useRouter();

  // السعر بعد الخصم (إن وجد)
  const hasSale = !!product.discount && product.discount > 0;

  const displayPrice = hasSale
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  // صورة المنتج
  const imageUrl = product.image || product.images?.[0]?.url || '/placeholder.svg';

  // تنسيق السعر العراقي
  const formatIQD = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // حالة المخزون (حسب التايب الحالي لا يوجد product_stock فنعتمد الكميات)
  const inStock = product.unlimited || (product.quantity && product.quantity > 0);

  return (
    <div className="group border-border/40 bg-card hover:border-border relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-sm">
      {/* IMAGE */}
      <div className="bg-muted/20 relative aspect-square w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* SALE BADGE */}
        {hasSale && (
          <div className="bg-foreground/90 text-background absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
            تخفيض
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-4" dir="rtl">
        <h3 className="text-foreground mb-3 line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-medium">
          {product.name}
        </h3>

        {/* PRICE + STOCK */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-foreground text-lg font-semibold">
            {formatIQD(displayPrice)} د.ع
          </span>

          {hasSale && (
            <span className="text-muted-foreground text-xs font-medium line-through">
              {formatIQD(product.price)} د.ع
            </span>
          )}

          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              inStock
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {inStock ? 'متوفر' : 'غير متوفر'}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 rounded-lg text-xs font-medium"
            onClick={() => {
              router.push(`/Dashboard/products-dropwave/produt-overview/${product.id}`);
            }}
          >
            التفاصيل
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hover:bg-accent rounded-xl bg-transparent p-2 transition-colors"
            onClick={() => {}}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
