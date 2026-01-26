'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Logo from '../utils/Logo';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [openNavbar, setOpenNavbar] = useState(false);
  const router = useRouter();
  const toggleNavbar = () => {
    setOpenNavbar(prev => !prev);
  };
  const NavItem = [
    { name: 'الأسئلة', href: 'FAQ' },
    { name: 'التواصل', href: 'ContactSection' },
    { name: 'الباقات', href: 'PricingSection' },
  ];
  const closeNavbar = () => {
    setOpenNavbar(false);
  };

  return (
    <header dir="rtl" className="absolute inset-x-0 top-0 z-50 py-6">
      <div className="mx-auto w-full px-3 lg:max-w-7xl lg:px-5">
        <nav className="relative flex w-full justify-between gap-6 rounded-2xl px-4 py-3 backdrop-blur-xl">
          <div className="relative inline-flex min-w-max">
            <div className="flex items-center gap-2">
              <Image
                src="/Logo-Matager/Matager-logo22.png"
                alt="Matager Logo"
                width={46}
                height={46}
                className="object-contain"
              />
              <h1 className="text-base font-bold text-white md:text-xl">Matager</h1>
            </div>
          </div>

          <div
            aria-hidden="true"
            onClick={closeNavbar}
            className={`fixed inset-0 backdrop-blur-lg transition-opacity ${
              openNavbar ? 'flex lg:hidden' : 'hidden'
            }`}
          />

          <div
            className={`absolute top-full left-1/2 mt-6 flex w-[92%] -translate-x-1/2 flex-col gap-y-4 overflow-hidden rounded-2xl bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-black/10 backdrop-blur-2xl transition-all duration-300 ease-out lg:static lg:mt-0 lg:w-auto lg:translate-x-0 lg:flex-row lg:items-center lg:justify-center lg:bg-transparent lg:shadow-none lg:ring-0 dark:bg-gray-950/95 lg:dark:bg-transparent ${
              openNavbar
                ? 'visible translate-y-0 opacity-100'
                : 'invisible translate-y-6 opacity-0 lg:visible lg:translate-y-0 lg:opacity-100'
            } `}
          >
            <ul className="flex w-full flex-col gap-y-1 px-6 py-4 text-base text-gray-800 lg:flex-row lg:items-center lg:gap-x-10 lg:px-0 lg:py-0 lg:text-white/90 dark:text-gray-200">
              {NavItem.map(item => (
                <li key={item.name}>
                  <Link
                    onClick={() => {
                      const checkoutSection = document.getElementById(item.href);
                      if (checkoutSection) {
                        checkoutSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    href={`#${item.href}`}
                    className="relative block rounded-lg px-4 py-2 font-medium transition-all duration-300 hover:bg-sky-50 hover:text-sky-600 lg:hover:bg-transparent lg:hover:text-white dark:hover:bg-white/5"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="w-full px-2 py-2">
              {' '}
              <button
                onClick={() => router.push('https://login.matager.store')}
                className="relative w-full cursor-pointer rounded-full bg-gradient-to-l from-sky-400/80 from-5% via-sky-200/80 via-60% to-sky-200/90 to-80% px-8 py-2 font-bold text-sky-900 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),_0_6px_20px_rgba(0,150,200,0.35)] ring-2 ring-white/70 backdrop-blur-lg transition-all duration-300 hover:scale-105 md:hidden"
              >
                سجل الان
              </button>
            </div>
          </div>

          <div className="flex min-w-max items-center gap-x-3">
            <button
              onClick={() => router.push('https://login.matager.store')}
              className="relative hidden cursor-pointer rounded-full bg-white/10 px-4 py-2 text-white ring-1 ring-white/30 transition hover:bg-white/20 md:block"
            >
              سجل الان
            </button>

            <button
              onClick={toggleNavbar}
              className="relative flex h-auto w-7 flex-col outline-none lg:hidden"
            >
              <span className="sr-only">toggle navbar</span>

              <span
                className={`h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                  openNavbar ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`mt-1 h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                  openNavbar ? 'scale-x-0 opacity-0' : ''
                }`}
              />
              <span
                className={`mt-1 h-0.5 w-6 rounded-full bg-white transition-all duration-300 ${
                  openNavbar ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
