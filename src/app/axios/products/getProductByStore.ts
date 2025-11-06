import axiosInstance from '../axiosInstance';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  discount: number;
  image?: string;
  description?: string;
  images: string;
  gallery?: string[];
}

export interface Store {
  id: string;
  shippingPrice?: number;
  storeSlug: string;
  storeName?: string;
  active: boolean;
}

export interface ProductsResponse {
  products: Product[];
  store: Store;
}

export default async function getProductsByStore({
  slug,
}: {
  slug?: string;
}): Promise<ProductsResponse> {
  if (!slug) throw new Error('Slug is required');

  try {
    const res = await axiosInstance.get<ProductsResponse>(`/api/store/${slug}/products`);
    const data = res.data;

    if (!data.store?.id) {
      throw new Error('userId is missing in store data');
    }

    return data;
  } catch (error) {
    console.error(`Error get products (${slug}):`, error);
    throw error;
  }
}
