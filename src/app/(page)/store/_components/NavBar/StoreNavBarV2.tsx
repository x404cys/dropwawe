import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, FileSpreadsheet, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProducts } from '../../Data/context/products/ProductsContext';
import { Command } from 'cmdk';
import { TbFilter } from 'react-icons/tb';
import { LuShoppingCart } from 'react-icons/lu';
import { BsList } from 'react-icons/bs';
import { PiListBold } from 'react-icons/pi';
import { IoIosHeartEmpty } from 'react-icons/io';
import { CiFilter } from 'react-icons/ci';

const Navbar = () => {
  const { store, setSearch, filteredProduct, search } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenList, setIsMenuOpenList] = useState(false);
  const [cartItems] = useState(3);
  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المنتجات', href: '/products' },
    { name: 'من نحن', href: '/about' },
    { name: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <nav dir="rtl" className="bg-navbar border-navbar-border sticky top-0 z-50 md:border-b">
      <div className="mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <div className="text-navbar-foreground font-arabic text-xl font-bold">
              {store?.name}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
              {navLinks.map(link => (
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
            </div>
            <div className="ms-1 rounded-lg border border-gray-300 p-1.5">
              <CiFilter
                size={22}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer font-light transition hover:bg-gray-100"
              />
            </div>
          </div>
          {search && filteredProduct.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-2 max-h-96 max-w-90 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
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
                    <span className="text-sm text-gray-500">{product.price} د.ع</span>
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

          <div className="hidden items-center gap-4 pl-2 md:flex rtl:space-x-reverse">
            <div className="relative">
              <ShoppingBag className="relative h-5 w-5 cursor-pointer duration-100 hover:text-rose-300" />
              {cartItems > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-3 -right-3 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                  {cartItems}
                </span>
              )}
            </div>

            <IoIosHeartEmpty
              size={22}
              className="cursor-pointer duration-100 hover:text-rose-300"
            />
          </div>

          <div className="flex gap-3 md:hidden">
            <ShoppingBag size={22} className="" />
            <PiListBold size={22} />
          </div>
        </div>
      </div>

      {/* for mobille */}
      <div className="block md:hidden">
        <div className="mx-auto flex items-center">
          <label className="sr-only">Search</label>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
              <svg
                className="h-4 w-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <input
              onChange={e => setSearch(e.target.value)}
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="ابحث عن المنتجات ..."
              required
            />
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ms-2 rounded-lg border border-gray-950 bg-gray-950 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <TbFilter />
            <span className="sr-only">ابحث عن المنتجات</span>
          </button>
        </div>
        {isMenuOpen && <div>Hi</div>}
      </div>
    </nav>
  );
};

export default Navbar;
