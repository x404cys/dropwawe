'use client';
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  FileSpreadsheet,
  ShoppingBag,
  SearchCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '../../Data/context/products/ProductsContext';
import { Command } from 'cmdk';
import { TbFilter } from 'react-icons/tb';
import { LuShoppingCart } from 'react-icons/lu';
import { BsList } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import { IoIosHeartEmpty } from 'react-icons/io';
import { CiFilter, CiSearch } from 'react-icons/ci';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/app/lib/context/CartContext';
import { useFavorite } from '@/app/lib/context/FavContext';
import { AnimatePresence, motion } from 'framer-motion';
import { IoClose, IoCloseOutline, IoHeart } from 'react-icons/io5';
import Link from 'next/link';
import { calculateDiscountedPrice, formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { Home, Package, Gift, Percent } from 'lucide-react';
import { RiSearchLine } from 'react-icons/ri';
import { VscSettings } from 'react-icons/vsc';
import { HiOutlineShoppingCart } from 'react-icons/hi';
interface NavLink {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
export default function StoreNavBarTheme1() {
  const { store, setSearch, filteredProduct, search, categories, setCategory, selectedCategory } =
    useProducts();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenList, setIsMenuOpenList] = useState(false);
  const { getTotalQuantityByKey, getTotalPriceAfterDiscountByKey } = useCart();
  const { getFavoritesByKey, getTotalFavoritesByKey } = useFavorite();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const KEY_CART = `cart/${store?.id}`;
  const KEY_FAV = `fav/${store?.id}`;
  const favTotal = getTotalFavoritesByKey(KEY_FAV);
  const cartItems = getTotalQuantityByKey(KEY_CART);
  const navLinks: NavLink[] = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'المنتجات', href: '/products', icon: Package },
    { name: 'العروض', href: '/storev2/ofers', icon: Gift },
    { name: 'الخصومات', href: '/storev2/discount', icon: Percent },
    { name: 'السلة', href: `/storev2/cart/${store?.id}`, icon: ShoppingBag },
    { name: 'المفضلة', href: `/storev2/favorits/${store?.id}`, icon: IoHeart },
  ];
  const navLinks2: NavLink[] = [
    { name: 'الرئيسية', href: '/', icon: Home },
    { name: 'المنتجات', href: '/products', icon: Package },
    { name: 'العروض', href: '/storev2/ofers', icon: Gift },
    { name: 'الخصومات', href: '/storev2/discount', icon: Percent },
  ];

  const filterBycategory = ['الكل', ...categories];

  return (
    <nav
      dir="rtl"
      className={`bg-navbar ${
        pathname !== '/storev2' && pathname !== '/' ? 'border-b' : 'border-none'
      } sticky px-1.5 top-0 z-50 md:border-b`}
    >
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <div className="text-navbar-foreground font-arabic text-lg font-semibold">
              <Link href={`/`}> {store?.name?.split(' ').slice(0, 3).join(' ')}</Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              {navLinks2.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-navbar-foreground hover:bg-navbar-hover font-arabic rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 hover:inline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="mx-8 hidden max-w-lg flex-1 items-center md:flex">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="text-muted-foreground h-5 w-5" />
              </div>

              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                className="bg-background border-navbar-border font-arabic w-full pr-10 text-right"
                dir="rtl"
                onChange={e => setSearch(e.target.value)}
              />

              {selectedCategory && (
                <div className="absolute top-1/2 left-3 flex h-6 -translate-y-1/2 transform items-center justify-center rounded-md bg-gray-950 px-2 text-xs font-bold text-white">
                  {selectedCategory === 'الكل' ? 'جميع التصنيفات' : selectedCategory}
                </div>
              )}

              {search && filteredProduct.length > 0 && (
                <div className="absolute top-full left-0 z-50 mt-2 max-h-96 w-full max-w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {filteredProduct.map(product => (
                    <a
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-100"
                    >
                      <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{product.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatIQD(product.price)} د.ع
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {search && filteredProduct.length === 0 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-lg">
                  لا يوجد منتجات مطابقة للبحث
                </div>
              )}
            </div>

            <div className="relative">
              <div
                onClick={() => setIsMenuOpenList(!isMenuOpenList)}
                className="ms-1 flex cursor-pointer items-center rounded-lg border border-gray-300 px-2 py-1.5 transition hover:bg-gray-100"
              >
                <CiFilter size={20} />
              </div>

              {isMenuOpenList && (
                <div
                  dir="rtl"
                  className="absolute left-0 mt-2 w-52 rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                  <h1 className="border-b border-gray-200 px-3 py-2 text-sm font-medium">
                    اختار نوع التصنيف للبحث
                  </h1>
                  <div className="max-h-60 space-y-2 overflow-y-auto p-3">
                    {filterBycategory.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          if (cat === 'الكل') {
                            setCategory(null);
                          } else {
                            setCategory(cat);
                          }
                          setIsMenuOpenList(false);
                        }}
                        className={`w-full cursor-pointer rounded-lg border-b border-gray-200 px-3 py-2 text-left text-sm font-medium transition-colors ${
                          cat === (selectedCategory ?? 'الكل')
                            ? 'bg-black font-bold text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        } `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden items-center gap-4 pl-2 md:flex rtl:space-x-reverse">
            <div className="relative">
              <ShoppingBag
                onClick={() => router.push(`/storev2/cart/${store?.id}`)}
                className="relative h-5 w-5 cursor-pointer duration-100 hover:text-rose-300"
              />
              {cartItems > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {cartItems}
                </span>
              )}
            </div>

            <div className="relative">
              <IoIosHeartEmpty
                onClick={() => router.push(`/storev2/favorits/${store?.id}`)}
                size={22}
                className="cursor-pointer duration-100 hover:text-rose-300"
              />
              {favTotal > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {favTotal}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4 md:hidden">
            <div className="relative rounded-full border border-gray-400 p-1">
              <HiOutlineShoppingCart
                onClick={() => router.push(`/storev2/cart/${store?.id}`)}
                className="relative h-5 w-5 cursor-pointer text-[#292526] duration-100 hover:text-rose-300"
              />
              {cartItems > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {cartItems}
                </span>
              )}
            </div>
          </div>
        </div>
        {isOpen && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-5 rounded border border-gray-600 bg-white md:hidden"
            >
              <div className="flex flex-col space-y-2 p-4">
                {navLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    onClick={() => setIsOpen(false)}
                  >
                    <div> {link.name}</div>
                    {link.icon && <link.icon className="h-5 w-5" />}{' '}
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {(pathname === '/storev2' || pathname === '/') && (
        <div className="md:hidden">
          <div className="mx-auto flex w-full items-center gap-2">
            <button
              onClick={() => setIsMenuOpenList(!isMenuOpenList)}
              className="flex items-center justify-center rounded-md border border-gray-300 bg-[#292526] px-3 py-2 text-white hover:bg-gray-100"
            >
              <VscSettings size={20} />
              <span className="sr-only">ابحث عن المنتجات</span>
            </button>

            <div className="relative flex w-full overflow-visible rounded-md border border-gray-300">
              <input
                onChange={e => setSearch(e.target.value)}
                type="search"
                className="block w-full border-0 p-1.5 font-medium text-gray-900 focus:ring-0"
                placeholder="ابحث عن المنتجات ..."
                required
              />
              <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center gap-2">
                {selectedCategory && (
                  <div className="items-center rounded-lg border bg-[#292526] px-2 py-1 text-xs text-teal-50">
                    {selectedCategory}
                  </div>
                )}
                <CiSearch />
              </div>

              {search && filteredProduct.length > 0 && (
                <div className="absolute top-full left-0 z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {filteredProduct.map(product => (
                    <a
                      key={product.id}
                      href={`/storev2/productOverviews/${product.id}`}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-100"
                    >
                      <img
                        src={product.image || '/placeholder.png'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{product.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatIQD(product.price)} د.ع
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {search && filteredProduct.length === 0 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-lg">
                  لا يوجد منتجات مطابقة للبحث
                </div>
              )}
            </div>

            {isMenuOpenList && (
              <div
                dir="rtl"
                className="absolute top-12 right-0 mt-14 w-52 rounded-lg border border-gray-950 bg-white shadow-lg"
              >
                <h1 className="border-b border-gray-200 px-3 py-2 text-sm font-medium">
                  اختار نوع التصنيف للبحث
                </h1>
                <div className="max-h-60 space-y-2 overflow-y-auto p-3">
                  {filterBycategory.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat === 'الكل' ? null : cat);
                        setIsMenuOpenList(false);
                      }}
                      className={`w-full cursor-pointer rounded-lg border-b border-gray-200 px-3 py-2 text-left text-sm font-medium transition-colors ${
                        cat === (selectedCategory ?? 'الكل')
                          ? 'bg-black font-bold text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
