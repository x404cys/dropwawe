import { Store } from '@/app/axios/products/getProductByStore';
import ProductCard from '@/components/Product/ProductDesign';
import SkeletonProduct from '@/components/SkeletonProduct';
import { Product } from '@/types/Products';

export default function StoreProductGrid({
  loading,
  error,
  user,
  userId,
  storeSlug,
  products,
}: {
  loading: boolean;
  error: string | null;
  products: Product[];
  user: Store;
  userId: string;
  storeSlug?: string;
}) {
  if (loading)
    return (
      <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <SkeletonProduct />
        <SkeletonProduct />
        <SkeletonProduct />
        <SkeletonProduct />
      </div>
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (products.length === 0)
    return <p className="text-center text-gray-500">لا توجد منتجات مطابقة للبحث.</p>;

  return (
    <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map(product => (
        <ProductCard
          key={product.id}
          {...product}
          user={user}
          userId={userId}
          storeSlug={storeSlug}
        />
      ))}
      <br />
      <br />
    </div>
  );
}
