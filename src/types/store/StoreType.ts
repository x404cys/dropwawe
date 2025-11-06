export type StoreProps = {
  id: string;
  name?: string;
  subLink?: string;
  shippingPrice?: number;
  shippingType?: string;
  hasReturnPolicy?: string;
  facebookLink?: string;
  instaLink?: string;
  telegram?: string;
  phone?: string;
  description?: string;
  active?: boolean;
  createdAt?: Date;
  userId?: string;
  facebookPixel?: string;
  instagramPixel?: string;
  tiktokPixel?: string;
  googlePixel?: string;
  theme: 'MODERN' | 'NORMAL';
};

export type StatsProps = {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalStoreActived: number;
  totalStores: number;
};

export type APIResponse = {
  stores: StoreProps[];
  todayCount: number;
  weekCount: number;
  monthCount: number;
  totalStoreActived: number;
  totalStores: number;
};
