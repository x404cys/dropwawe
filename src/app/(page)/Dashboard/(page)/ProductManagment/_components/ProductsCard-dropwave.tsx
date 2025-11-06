'use client';

import { Button } from '@/components/ui/button';
import type { Product } from '@/types/dropwave/Products';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductsCardDropWaveProps {
  product: Product;
}

export default function ProductsCardDropWave({ product }: ProductsCardDropWaveProps) {
  const imageUrl =
    product.cover_image_url || product.cover_image_url || product.cover_image_url?.[0];
  const hasSale = product.sale_price && product.sale_price < product.price;
  const displayPrice = hasSale ? product.sale_price : product.price;
  const reouter = useRouter();
  const formatIQD = (price: number) => {
    return new Intl.NumberFormat('ar-IQ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group border-border/40 bg-card hover:border-border relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-sm">
      <div className="bg-muted/20 relative aspect-square w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="bg-muted/40 h-16 w-16 rounded-full" />
          </div>
        )}

        {hasSale && (
          <div className="bg-foreground/90 text-background absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
            تخفيض
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4" dir="rtl">
        <h3 className="text-foreground mb-3 line-clamp-2 min-h-[2.5rem] text-sm leading-snug font-medium">
          {product.name}
        </h3>

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
              product.stock_status === 'in_stock' ||
              (product.product_stock !== undefined && product.product_stock > 0)
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {product.stock_status === 'in_stock' || product.stock_status ? 'متوفر' : 'غير متوفر'}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1 rounded-lg text-xs font-medium"
            onClick={() => {
              reouter.push(`/Dashboard/products-dropwave/produt-overview/${product.id}`);
            }}
          >
            التفاصيل
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hover:bg-accent rounded-xl bg-transparent p-2 transition-colors"
            onClick={() => {
              console.log('Add to favorites:', product.id);
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
