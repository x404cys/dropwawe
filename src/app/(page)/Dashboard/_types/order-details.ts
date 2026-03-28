export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export type OrderSource = 'ORDER' | 'TRADER_ORDER';

export type OrderProduct = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  category: string | null;
  price: number;
  discount: number | null;
  isFromSupplier: boolean;
};

export type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  wholesalePrice?: number | null;
  traderProfit?: number | null;
  supplierProfit?: number | null;
  product?: OrderProduct | null;
};

export type PaymentOrderDetails = {
  id: string;
  cartId: string;
  tranRef: string | null;
  amount: number;
  currency: string;
  status: string;
  respCode: string | null;
  respMessage: string | null;
  customerEmail: string | null;
  createdAt: string;
};

export type CouponDetails = {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';
  value: number;
  scope: 'GLOBAL' | 'STORE' | 'PRODUCT';
  maxDiscount: number | null;
  expiresAt: string | null;
  isActive: boolean;
};

export type StoreDetails = {
  id: string;
  name: string | null;
  subLink: string | null;
  phone: string | null;
  shippingPrice: number | null;
  shippingType: string | null;
  methodPayment: string | null;
  description: string | null;
};

export type RelatedUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  storeName?: string | null;
};

export type SupplierDetails = {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  paymentInfo: string | null;
  methodPayment: string | null;
};

export type OrderDetails = {
  id: string;
  orderId?: string | null;
  orderSource?: OrderSource;
  fullName: string | null;
  email?: string | null;
  location: string | null;
  phone: string | null;
  createdAt: string;
  status: OrderStatus;
  total: number;
  discount?: number | null;
  finalTotal?: number | null;
  paymentMethod?: string | null;
  items: OrderItem[];
  paymentOrder?: PaymentOrderDetails | null;
  coupon?: CouponDetails | null;
  store?: StoreDetails | null;
  user?: RelatedUser | null;
  trader?: RelatedUser | null;
  supplier?: SupplierDetails | null;
};
