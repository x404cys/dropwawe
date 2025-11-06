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

export default async function getProductsByStorev2({
  slug,
}: {
  slug: string;
}): Promise<ProductsResponse> {
  try {
    const res = await axiosInstance.get<ProductsResponse>(slug);
    const data = res.data;

    if (!data.store?.id) {
      throw new Error('storeId is missing in store data');
    }

    return data;
  } catch (error) {
    console.error(` Error fetching products (${slug}):`, error);
    throw error;
  }
}
