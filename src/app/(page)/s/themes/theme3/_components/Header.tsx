'use client';
import Image from 'next/image';
import { LuShoppingBasket } from 'react-icons/lu';
import { CiSearch } from 'react-icons/ci';
import { useProducts } from '../../../context/products-context';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { useCart } from '@/app/lib/context/CartContext';
import { usePathname, useRouter } from 'next/navigation';

export default function HeaderSectionTheme3() {
  const { filteredProducts, store, setSearch, search } = useProducts();
  const { getTotalQuantityByKey, getTotalPriceAfterDiscountByKey } = useCart();
  const KEY_CART = `cart/${store?.id}`;
  const cartItems = getTotalQuantityByKey(KEY_CART);
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div dir="rtl" className="w-full bg-[#7f2d2f] font-sans">
      <div className="relative bg-[#f9f6f3] pt-8 pb-10 text-center">
        <div className="absolute top-0 -left-3 flex text-3xl">
          <Image
            src={'/img-theme/IMG_8473-removebg-preview.png'}
            alt="al"
            width={100}
            height={200}
          />
        </div>
        <button
          onClick={() => router.push('/s/themes/theme3/cart/checkout')}
          className="absolute top-18 right-5 z-50 cursor-pointer rounded-lg border border-[#d9b3b4] p-2 text-2xl"
        >
          <LuShoppingBasket
            onClick={() => router.push('/s/themes/theme3/cart/checkout')}
            className="text-[#d9b3b4]"
          />
          {cartItems > 0 && (
            <span className="text-primary-foreground absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#7f2d2f] text-xs">
              {cartItems}
            </span>
          )}
        </button>
        <div
          className={`absolute -right-52 flex rotate-30 gap-2 text-3xl ${pathname.includes('/s') ? 'hidden' : 'block'}`}
        >
          <Image
            src={'/img-theme/IMG_8474-removebg-preview.png'}
            alt="al"
            width={260}
            height={200}
          />
        </div>
        <div className="relative pt-19 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <Image
              src={'/img-theme/IMG_8476-removebg-preview.png'}
              alt="logo"
              width={100}
              height={100}
            />
          </div>

          <h2 className="text-[#7f2d2f]">{store?.name}</h2>
        </div>

        <div className="relative mx-auto mt-6 max-w-sm">
          <div className={`relative ${pathname.includes('/s') ? 'hidden' : 'block'}`}>
            <input
              type="text"
              value={search || ''}
              placeholder="ابحث عن منتج"
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#d9b3b4] bg-white/70 py-3 pr-12 pl-10 text-[#7f2d2f] placeholder-[#b8898a] transition outline-none focus:border-[#7f2d2f] focus:ring-1 focus:ring-[#7f2d2f]"
            />

            <CiSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-xl text-[#b8898a]" />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-1/2 left-4 -translate-y-1/2 font-medium text-[#7f2d2f] hover:underline"
              >
                حذف
              </button>
            )}
          </div>

          {search && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-3 w-full overflow-hidden rounded-xl border border-[#e5d6d6] bg-white shadow-xl">
              <div className="max-h-80 overflow-y-auto">
                {filteredProducts.map(product => (
                  <a
                    key={product.id}
                    href={`/s/themes/theme3/product-overview/${product.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-[#f8f3f3]"
                  >
                    <Image
                      src={product?.image as string}
                      alt={product.name}
                      width={20}
                      height={20}
                      className="h-12 w-12 rounded-lg border border-gray-100 object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="line-clamp-1 text-right text-sm font-semibold text-gray-800">
                        {product.name}
                      </span>
                      <span className="text-right text-xs text-[#7f2d2f]">
                        {formatIQD(product.price)} د.ع
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
