'use client';

import { useEffect, useState } from 'react';
import Logo from '@/components/utils/Logo';
import { Search } from 'lucide-react';
import { MdOutlineNotificationsNone, MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineUser, AiOutlineShop } from 'react-icons/ai';
import { PiShoppingCart } from 'react-icons/pi';
import { TbCategory } from 'react-icons/tb';

const NavItems = [
  { name: 'ملابس', href: '/clothing' },
  { name: 'ساعات', href: '/watches' },
  { name: 'اكسسوارات', href: '/accessories' },
  { name: 'عدد منزلية', href: '/home-tools' },
  { name: 'كتب', href: '/books' },
  { name: 'عطور', href: '/perfumes' },
  { name: 'ألعاب', href: '/games' },
  { name: 'هدايا', href: '/gifts' },
  { name: 'أجهزة إلكترونية', href: '/electronics' },
  { name: 'أحذية', href: '/shoes' },
  { name: 'حقائب', href: '/bags' },
  { name: 'نظارات', href: '/glasses' },
  { name: 'منتجات العناية بالبشرة', href: '/skincare' },
  { name: 'منتجات العناية بالشعر', href: '/haircare' },
  { name: 'أجهزة المطبخ', href: '/kitchen-appliances' },
  { name: 'ديكور منزلي', href: '/home-decor' },
  { name: 'مستلزمات مكتبية', href: '/office-supplies' },
  { name: 'مستلزمات مدرسية', href: '/school-supplies' },
  { name: 'معدات رياضية', href: '/sports' },
  { name: 'مأكولات ومشروبات', href: '/food-drinks' },
];

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
<>
    <div dir="rtl" className="mx-auto max-w-screen-xl px-4">
      <nav
        className={`z-50 transition-all duration-300 ${
          isScrolled
            ? '  md:fixed md:top-0 md:right-0 md:left-0 md:mx-auto md:max-w-6xl md:rounded-xl md:border md:bg-white md:px-3 md:py-3 md:pl-2 lg:fixed lg:top-0 lg:right-0 lg:left-0 lg:mx-auto lg:max-w-6xl lg:rounded-xl lg:border lg:bg-white lg:px-3 lg:py-3 lg:pl-2'
            : 'relative mx-auto mt-6 max-w-screen-xl rounded-xl border bg-white px-3 py-3'
        }`}
      >
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex w-full items-center justify-between md:w-auto">
            <Logo />
            <AiOutlineUser className="hover:text-primary block cursor-pointer text-xl text-gray-600 md:hidden" />
          </div>

          <div className="mt-2 flex w-full max-w-md items-center gap-2 md:mt-0">
            <TbCategory className="mr-2 hidden text-2xl text-gray-600 md:block" />
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                className="w-full rounded-lg border border-gray-300 py-2 pr-10 pl-4 text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none"
              />
              <Search
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
            <TbCategory className="mr-2 block text-2xl text-gray-600 md:hidden" />
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <AiOutlineUser className="hover:text-primary cursor-pointer text-xl text-gray-600" />
            <MdOutlineNotificationsNone className="hover:text-primary cursor-pointer text-xl text-gray-600" />
            <MdFavoriteBorder className="hover:text-primary cursor-pointer text-xl text-gray-600" />
            <PiShoppingCart className="hover:text-primary cursor-pointer text-xl text-gray-600" />
            <AiOutlineShop className="hover:text-primary cursor-pointer text-xl text-gray-600" />
          </div>
        </div>
      </nav>

      <div className="fixed inset-x-4 bottom-0 z-50 flex justify-around rounded border bg-white py-4 drop-shadow-xs md:hidden">
        <AiOutlineShop className="hover:text-primary text-2xl text-black" />
        <MdFavoriteBorder className="hover:text-primary text-2xl text-black" />
        <PiShoppingCart className="hover:text-primary text-2xl text-black" />
        <MdOutlineNotificationsNone className="hover:text-primary text-2xl text-black" />
        <AiOutlineUser className="hover:text-primary text-2xl text-black" />
      </div>
          <div className="relative mt-2 mb-4">
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-1 py-1 whitespace-nowrap">
          {NavItems.map((item, idx) => (
            <button
              key={idx}
              className="flex-shrink-0 cursor-pointer rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-green-50 hover:text-green-600"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
 
</>
    
  );
}
