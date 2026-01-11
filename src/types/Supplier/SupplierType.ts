import { Product } from '../Products';
import { StoreProps } from '../store/StoreType';

export type Supplier = {
  id: string;
  userId: string;
  name?: string;
  image?: string;
  Header?: string;
  description?: string;
  facebookLink?: string;
  instaLink?: string;
  telegram?: string;
  methodPayment?: string;
  hasReturnPolicy?: string;
  shippingPrice?: number;
  shippingType?: string;
  theme?: string;
  active?: boolean;
  address?: string;
  paymentInfo?: string;
  phone?: string;
  rating?: number;
  commission?: number;
  user?: {
    name?: string;
    email?: string;
    subLink?: string;
    Product: Product[];
    Store: StoreProps[];
  };
};
