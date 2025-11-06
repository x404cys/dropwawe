 import { prisma } from '../../db';

export interface ProductData {
  name: string;
  description?: string;
  sku?: string;
  price: number;
  discount?: number;
  quantity?: number;
  category: string;
  available: boolean;
  imageUrl?: string | null;
}

export async function addProduct(data: ProductData) {
  return await prisma.user.create({
    data: {
      name: data.name,

      image: data.imageUrl || null,
    },
  });
}
