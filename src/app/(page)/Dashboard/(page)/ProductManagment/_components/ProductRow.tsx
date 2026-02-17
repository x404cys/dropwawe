'use client';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash, Package, ShieldCheck, XCircle } from 'lucide-react';
import type { Product } from '@/types/Products';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: Props) {
  const router = useRouter();

  return (
    <TableRow className="group hover:bg-muted/50 transition-colors">
      <TableCell className="w-20">
        <Link
          href={`/Dashboard/products/${product.id}`}
          className="ring-offset-background hover:ring-ring relative block overflow-hidden rounded-sm transition-all hover:ring-2 hover:ring-offset-2"
        >
          <Image
            src={`${product.image}`}
            alt={product.name}
            width={64}
            height={64}
            className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
      </TableCell>

      <TableCell>
        <Link
          href={`/Dashboard/products/${product.id}`}
          className="text-foreground hover:text-primary font-medium transition-colors"
        >
          {product.name}
        </Link>
      </TableCell>

      <TableCell>
        <span className="text-lg font-semibold tabular-nums">{product.price}</span>
        <span className="text-muted-foreground mr-1"> د.ع</span>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <Package className="text-muted-foreground h-4 w-4" />
          <span className="font-medium tabular-nums">{product.quantity}</span>
          {product.quantity < 10 && (
            <Badge variant="warning" className="text-xs">
              مخزون منخفض
            </Badge>
          )}
        </div>
      </TableCell>

      <TableCell className="max-w-xs">
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {product.description}
        </p>
      </TableCell>

      <TableCell>
        <Badge variant="secondary" className="font-normal">
          {product.category}
        </Badge>
      </TableCell>

      <TableCell className="whitespace-nowrap">
        <div className="flex items-center gap-2 rtl:flex-row-reverse">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/Dashboard/edit/${product.id}`)}
            className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            aria-label="تعديل المنتج"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
