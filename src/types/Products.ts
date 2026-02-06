import { ChangeEvent, JSX } from 'react';
import { StoreProps } from './store/StoreType';
import { User } from './users/User';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  discount: number;
  image?: string;
  description?: string;
  selectedColor?: string;
  selectedSize?: string;
  hasReturnPolicy?: string;
  shippingType?: string;
  images?: { id: string; url: string }[];
  sizes?: { id: string; size: string; stock: number }[];
  colors?: { id: string; name: string; hex: string; stock: number }[];
  unlimited?: boolean;
  isFromSupplier?: boolean;
  user?: {
    id: string;
    storeName?: string;
    storeSlug?: string;
    shippingPrice?: number;
    stores?: { store: StoreProps }[];
  };
  pricingDetails?: ProductPricing;
  subInfo?: subInfo;
}
export interface ProductPricing {
  id: string;
  productId: string;
  supplierId?: string;
  wholesalePrice: number;
  minPrice: number;
  maxPrice: number;
  minQuantity?: number;
  createdAt: string;
}
export interface subInfo {
  telegram?: string;
  facebookLink?: string;
  instaLink?: string;
  whasapp?: string;
  videoLink?: string;
}

export interface PropsProduct {
  products: Product[];
  editingId: string | null;
  editData: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setEditData: React.Dispatch<
    React.SetStateAction<Partial<Product> & { imageFile?: File; imagePreview?: string }>
  >;
  startEditing: (product: Product) => void;
  cancelEditing: () => void;
  onEditImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  saveEdit: () => void;
  deleteProduct: (id: string) => void;
}
export interface PropsProductForm {
  newProduct: Partial<Product> & { imageFile?: File; imagePreview?: string };
  setNewProduct: React.Dispatch<
    React.SetStateAction<Partial<Product> & { imageFile?: File; imagePreview?: string }>
  >;
  onNewImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addProduct: () => void;
  loading: boolean;
}

export interface Order {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  status?: string;
  fullName?: string;
  total?: number;
  location: string;
  phone: string;
  storeId: string;

  items: {
    id: string;
    quantity: number;
    price: number;
    orderId: string;
    color: string;
    size: string;
    productId: string;
  };
  store?: StoreProps;
  user?: User;
}

export interface UserProps {
  id?: string;
  image?: string;
  storeName?: string;
  email: string;
  storeSlug?: string;
  facebookLink?: string;
  instaLink?: string;
  phone?: string;
  telegram?: string;
  name?: string;
  description?: string;
  shippingPrice?: number;
  role?: 'GUEST' | 'SUPPLIER' | 'DROPSHIPPER' | 'TRADER' | 'A';
}
