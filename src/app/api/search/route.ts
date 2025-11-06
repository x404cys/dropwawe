import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';
import type { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get('search') || '';
  const slug = searchParams.get('slug') || '';
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const category = searchParams.get('category');

  if (!query || !slug) {
    return NextResponse.json([]);
  }

  const priceFilter: Prisma.IntFilter = {};
  if (minPrice) priceFilter.gte = Number(minPrice);
  if (maxPrice) priceFilter.lte = Number(maxPrice);

  const andConditions: Prisma.ProductWhereInput[] = [
    {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    {
      user: {
        storeSlug: slug,
      },
    },
  ];

  if (minPrice || maxPrice) {
    andConditions.push({
      price: priceFilter,
    });
  }

  if (category && category !== 'كل التصنيفات') {
    andConditions.push({
      category: category,
    });
  }

  const whereClause: Prisma.ProductWhereInput = {
    AND: andConditions,
  };

  const results = await prisma.product.findMany({
    where: whereClause,
  });

  return NextResponse.json(results);
}
