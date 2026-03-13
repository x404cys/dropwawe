// src/app/s/_lib/getStoreFromSubdomain.ts

import { headers } from 'next/headers';
import { prisma } from '@/app/lib/db';

export async function getStoreFromSubdomain() {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  let subdomain: string;

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const referer = headersList.get('referer') ?? '';

    try {
      const url = new URL(referer || `http://${host}`);
      subdomain = url.searchParams.get('store') ?? 'ali12';
    } catch {
      subdomain = 'ali12';
    }
  } else {
    subdomain = host.split('.')[0];
  }

  const store = await prisma.store.findUnique({
    where: { subLink: subdomain },
  });

  return store ?? null;
}
