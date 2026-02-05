'use client';
import { useMemo, useState } from 'react';
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
import { Command } from 'cmdk';
import { TbFilter } from 'react-icons/tb';
import { LuShoppingCart } from 'react-icons/lu';
import { BsList } from 'react-icons/bs';
import { PiBagLight, PiListBold } from 'react-icons/pi';
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
import Image from 'next/image';
import { GoSearch } from 'react-icons/go';
import HeroBanner from '@/app/(page)/store/_components/HeroBanner/HeroBanner';
import CartPreviewDialog from '@/app/(page)/store/(page)/cart/CartPreviewDialog';
import { useProducts } from '../../../context/products-context';
interface NavLink {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}
export default function NavBarTheme2() {
  const {
    store,
    setSearch,
    filteredProducts,
    products,
    search,
    categories,
    setCategory,
    selectedCategory,
  } = useProducts();
  const pathname = usePathname();

  const [searchInput, setSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const { getTotalQuantityByKey, getTotalPriceAfterDiscountByKey } = useCart();
  const { getFavoritesByKey, getTotalFavoritesByKey, removeFromFavoriteByKey } = useFavorite();
  const [isOpen, setIsOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

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

  return (
    <>
      <nav
        dir="ltr"
        className={`bg-navbar ${
          pathname !== '/storev2' && pathname !== '/' ? 'border-b' : 'border-none'
        } sticky top-0 z-50 px-2 md:border-b`}
      >
        <div className="mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-shrink-0">
              <div className="text-navbar-foreground font-arabic text-lg font-semibold">
                <Link href={`/`}>{store?.name}</Link>
              </div>
            </div>

            <div className="mx-8 hidden max-w-lg flex-1 items-center font-light md:flex">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center pr-3">
                  <Search className="text-muted-foreground h-5 w-5" />
                </div>

                <Input
                  type="text"
                  placeholder="ابحث عن المنتجات..."
                  className="w-full rounded-none border border-gray-300 bg-white text-right text-sm focus:border-black focus:ring-0"
                  dir="rtl"
                  onChange={e => setSearch(e.target.value)}
                />

                {search && (
                  <div
                    dir="rtl"
                    className="absolute top-full right-0 z-50 mt-1 w-full overflow-hidden border border-gray-200 bg-white shadow-xl"
                  >
                    {filteredProducts.length > 0 ? (
                      <ul className="max-h-80 divide-y overflow-y-auto">
                        {filteredProducts.map(product => (
                          <li key={product.id}>
                            <a
                              href={`/storev2/product-overview/${product.id}`}
                              className="flex items-center gap-3 px-4 py-3 transition hover:bg-gray-50"
                            >
                              <img
                                src={product.image || '/placeholder.png'}
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover"
                              />

                              <div className="flex flex-col text-right">
                                <span className="text-sm font-semibold text-gray-900">
                                  {product.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatIQD(product.price)} د.ع
                                </span>
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-4 py-3 text-center text-sm text-gray-500">
                        لا يوجد منتجات مطابقة للبحث
                      </div>
                    )}
                  </div>
                )}

                {search && filteredProducts.length === 0 && (
                  <div className="absolute top-full right-0 left-0 z-50 mt-2 border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-lg">
                    لا يوجد منتجات مطابقة للبحث
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 pl-2 rtl:space-x-reverse">
              <div className="md:hidden">
                <CiSearch
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="relative h-7 w-7 cursor-pointer duration-100 hover:text-rose-500"
                />
                {searchOpen && (
                  <div className="bg-white">
                    <div className="md:hidden">
                      <CiSearch
                        onClick={() => setSearchOpen(true)}
                        className="h-6 w-6 cursor-pointer duration-100 hover:text-rose-500"
                      />

                      <AnimatePresence>
                        {searchOpen && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 z-[999] bg-black/40 py-12 backdrop-blur-sm"
                          >
                            <div className="flex items-center gap-3 border-b px-4 py-3">
                              <button onClick={() => setSearchOpen(false)}>
                                <IoClose className="text-white" size={22} />
                              </button>

                              <div className="relative flex-1">
                                <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  autoFocus
                                  dir="rtl"
                                  placeholder="ابحث عن المنتجات..."
                                  className="h-10 w-full rounded-md border border-gray-300 pr-9 font-light text-white placeholder:text-white focus:border-black focus:ring-0"
                                  onChange={e => setSearch(e.target.value)}
                                />
                              </div>
                            </div>

                            <div dir="rtl" className="max-h-[calc(100vh-60px)] overflow-y-auto">
                              {search && filteredProducts.length > 0 ? (
                                <ul className="divide-y bg-white">
                                  {filteredProducts.map(product => (
                                    <li key={product.id}>
                                      <a
                                        href={`/store/product-overview/${product.id}`}
                                        onClick={() => setSearchOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3"
                                      >
                                        <img
                                          src={product.image || '/placeholder.png'}
                                          alt={product.name}
                                          className="h-12 w-12 rounded object-cover"
                                        />

                                        <div className="flex flex-col">
                                          <span className="text-sm font-semibold">
                                            {product.name}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {formatIQD(product.price)} د.ع
                                          </span>
                                        </div>
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : search ? (
                                <div className="px-4 py-6 text-center text-sm text-gray-500">
                                  لا يوجد منتجات مطابقة للبحث
                                </div>
                              ) : (
                                <div className="px-4 py-6 text-center text-sm text-gray-400">
                                  ابدأ بكتابة اسم المنتج
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <PiBagLight
                  onClick={() => setCartOpen(true)}
                  className="h-7 w-7 cursor-pointer hover:text-rose-500"
                />

                {cartItems > 0 && (
                  <span className="bg-primary text-primary-foreground ll absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center text-xs">
                    {cartItems}
                  </span>
                )}
              </div>

              <div className="relative">
                <IoIosHeartEmpty
                  onClick={() => setFavOpen(true)}
                  size={22}
                  className="h-7 w-7 cursor-pointer duration-100 hover:text-rose-500"
                />
                {favTotal > 0 && (
                  <span className="bg-primary text-primary-foreground ll absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center text-xs">
                    {favTotal}
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
                transition={{ duration: 0.4 }}
                className="rder mb-5 border-gray-600 bg-white md:hidden"
              >
                <div className="flex flex-col space-y-2 p-4">
                  {navLinks.map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="flex items-center justify-between gap-2 border px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
        <AnimatePresence>
          {favOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
              onClick={() => setFavOpen(false)}
            >
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
                dir="rtl"
                className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl"
              >
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <h2 className="text-sm font-bold">المفضلة ({favTotal})</h2>
                  <button onClick={() => setFavOpen(false)}>
                    <IoClose size={22} />
                  </button>
                </div>

                <div className="max-h-[calc(100vh-56px)] overflow-y-auto">
                  {getFavoritesByKey(KEY_FAV).length > 0 ? (
                    <ul className="divide-y">
                      {getFavoritesByKey(KEY_FAV).map(product => (
                        <li key={product.id} className="flex items-center gap-3 px-4 py-3">
                          <img
                            src={product.image || '/placeholder.png'}
                            alt={product.name}
                            className="h-14 w-14 rounded object-cover"
                          />

                          <div className="flex flex-1 flex-col">
                            <span className="text-sm font-semibold">{product.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatIQD(product.price)} د.ع
                            </span>
                          </div>

                          <button
                            onClick={() => removeFromFavoriteByKey(product.id, KEY_FAV)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <IoCloseOutline size={20} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-10 text-center text-sm text-gray-500">
                      لا توجد منتجات في المفضلة
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartPreviewDialog open={cartOpen} onClose={() => setCartOpen(false)} cartKey={KEY_CART} />
    </>
  );
}
//
