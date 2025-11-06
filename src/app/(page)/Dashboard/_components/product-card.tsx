'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    category: string;
    rating?: number;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden border border-gray-200 transition-shadow duration-300 hover:shadow-lg">
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 text-sm font-medium text-gray-900">
              {product.name}
            </h3>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {product.category}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">{product.price.toLocaleString()} IQD</p>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
