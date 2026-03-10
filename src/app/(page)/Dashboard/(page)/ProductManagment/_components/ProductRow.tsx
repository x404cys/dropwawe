'use client';
import { useLanguage } from '../../../context/LanguageContext';

import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Package, AlertTriangle } from 'lucide-react';
import type { Product } from '@/types/Products';
import Link from 'next/link';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useRouter } from 'next/navigation';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const finalPrice =
    product.discount != null && product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const isLowStock =
    !product.unlimited &&
    product.quantity !== undefined &&
    product.quantity <= 5 &&
    product.quantity > 0;
  const isOutOfStock = !product.unlimited && product.quantity === 0;

  return (
    <TableRow className="group hover:bg-muted transition-colors">
      {/* Product image + name */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Link
            href={`/Dashboard/products/${product.id}`}
            className="border-border bg-muted relative block h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border"
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <Package className="h-5 w-5" />
              </div>
            )}
            {/* Discount badge on image */}
            {product.discount != null && product.discount > 0 && (
              <span className="absolute top-0 right-0 rounded-bl bg-red-500 px-1 py-0.5 text-[9px] font-bold text-white">
                -{product.discount}%
              </span>
            )}
          </Link>

          <div className="min-w-0">
            <Link
              href={`/Dashboard/products/${product.id}`}
              className="text-foreground block max-w-[160px] truncate text-sm font-semibold transition-colors hover:text-[#04BAF6]"
            >
              {product.name}
            </Link>
            {product.category && (
              <span className="text-muted-foreground text-[11px]">{product.category}</span>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#04BAF6] tabular-nums">
            {formatIQD(finalPrice)} {t.currency || 'د.ع'}
          </span>
          {product.discount != null && product.discount > 0 && (
            <span className="text-muted-foreground text-[11px] tabular-nums line-through">
              {product.price.toLocaleString('ar-IQ')}
            </span>
          )}
        </div>
      </TableCell>

      {/* Quantity / stock */}
      <TableCell>
        {product.unlimited ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-medium text-green-700">
            {' '}
            {t.inventory.unlimited}{' '}
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            {(isLowStock || isOutOfStock) && (
              <AlertTriangle
                className={`h-3.5 w-3.5 flex-shrink-0 ${isOutOfStock ? 'text-red-500' : 'text-yellow-500'}`}
              />
            )}
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                isOutOfStock
                  ? 'bg-red-100 text-red-600'
                  : isLowStock
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {isOutOfStock ? t.inventory?.outOfStock || 'نفد' : `${product.quantity}`}
            </span>
          </div>
        )}
      </TableCell>

      {/* Category */}
      <TableCell>
        <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
          {product.category || '—'}
        </span>
      </TableCell>

      {/* Colors (replaces old image column) */}
      <TableCell>
        {product.colors && product.colors.length > 0 ? (
          <div className="flex gap-0.5">
            {product.colors.slice(0, 5).map(c => (
              <span
                key={c.id}
                className="border-border h-4 w-4 rounded-full border"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/Dashboard/edit/${product.id}`)}
            className="text-muted-foreground h-8 w-8 p-0 transition-colors hover:bg-[#04BAF6]/10 hover:text-[#04BAF6]"
            aria-label={t.inventory?.editProduct || 'تعديل'}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(product.id)}
            className="text-muted-foreground h-8 w-8 p-0 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label={t.inventory?.deleteProduct || 'حذف'}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
