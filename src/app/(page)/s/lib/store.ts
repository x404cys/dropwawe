import { headers } from 'next/headers';
import { prisma } from '@/app/lib/db';
import { StoreProps } from '@/types/store/StoreType';

export async function getStoreFromSubdomain(): Promise<StoreProps> {
  const host = (await headers()).get('host') || '';
  const subdomain = host.split('.')[0];

  const store = await prisma.store.findUnique({
    where: { subLink: subdomain },
  });

  if (!store) {
    return {
      id: 'ali12',
      name: 'Default Store',
      theme: 'RAMADAN',
      domain: 'example.com',
      subLink: 'ali12',
    };
  }

  return store as StoreProps;
}
