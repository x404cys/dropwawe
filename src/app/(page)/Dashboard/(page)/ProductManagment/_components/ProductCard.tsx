'use client';
import { useLanguage } from '../../../context/LanguageContext';

import { Trash2, Package, Edit2, AlertTriangle } from 'lucide-react';
import type { Product } from '@/types/Products';
import Link from 'next/link';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useRouter } from 'next/router';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const finalPrice =
    product.discount && product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const isLowStock =
    !product.unlimited &&
    product.quantity !== undefined &&
    product.quantity <= 5 &&
    product.quantity > 0;
  const isOutOfStock = !product.unlimited && product.quantity === 0;

  return (
    <div className="bg-card border-border flex h-24 flex-row overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      <Link
        href={`/Dashboard/products/${product.id}`}
        className="bg-muted relative block h-full w-24 flex-shrink-0"
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <Package className="h-6 w-6" />
          </div>
        )}

        {/* Discount badge */}
        {product.discount != null && product.discount > 0 && (
          <span className="absolute top-1 right-1 rounded bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            -{product.discount}%
          </span>
        )}

        {/* Low-stock / out-of-stock overlay */}
        {(isLowStock || isOutOfStock) && (
          <span className="absolute right-1 bottom-1 flex items-center gap-0.5 rounded bg-red-500/90 px-1 py-0.5 text-[9px] font-bold text-white">
            <AlertTriangle className="h-2.5 w-2.5" />
            {isOutOfStock ? t.inventory?.outOfStock || 'نفد' : product.quantity}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-center p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-foreground truncate text-sm font-semibold">{product.name}</h3>
            {product.category && (
              <span className="text-muted-foreground text-[11px]">{product.category}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={e => {
                e.stopPropagation();
                router.push(`/Dashboard/edit/${product.id}`);
              }}
              className="text-muted-foreground rounded p-1 transition-colors hover:text-[#04BAF6]"
              aria-label={t.edit || 'تعديل'}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            {onDelete && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="text-muted-foreground rounded p-1 transition-colors hover:text-red-500"
                aria-label={t.delete || 'حذف'}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Price row */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold text-[#04BAF6]">
            {formatIQD(finalPrice)} {t.currency || 'د.ع'}
          </span>
          {product.discount != null && product.discount > 0 && (
            <span className="text-muted-foreground text-[11px] line-through">
              {formatIQD(finalPrice)} {t.currency || 'د.ع'}
            </span>
          )}

          {/* Stock badge */}
          {product.unlimited ? (
            <span className="mr-auto rounded-md bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
              {' '}
              {t.inventory.unlimited}{' '}
            </span>
          ) : (
            <span
              className={`mr-auto rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                isOutOfStock
                  ? 'bg-red-100 text-red-600'
                  : isLowStock
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {isOutOfStock
                ? t.inventory?.outOfStock || 'نفد'
                : `${product.quantity} ${t.inventory?.pieces || 'قطعة'}`}
            </span>
          )}

          {/* Color swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-0.5">
              {product.colors.slice(0, 4).map(c => (
                <span
                  key={c.id}
                  className="border-border h-3.5 w-3.5 rounded-full border"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
