'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '../utils/Logo';
const Navbar = () => {
  const [openNavbar, setOpenNavbar] = useState(false);
  const toggleNavbar = () => {
    setOpenNavbar(openNavbar => !openNavbar);
  };
  const closeNavbar = () => {
    setOpenNavbar(false);
  };
  return (
    <header dir="rtl" className="absolute inset-x-0 top-0 z-50 py-6">
      <div className="mx-auto w-full px-5 sm:px-10 md:px-12 lg:max-w-7xl lg:px-5">
        <nav className="relative flex w-full justify-between gap-6">
          <div className="relative inline-flex min-w-max">
           <Logo />
          </div>
          <div
            onClick={() => {
              closeNavbar();
            }}
            aria-hidden="true"
            className={`bg-opacity-50 fixed inset-0 bg-gray-800/60 backdrop-blur-xl backdrop-filter ${openNavbar ? 'flex lg:hidden' : 'hidden'} `}
          />
          <div
            className={`absolute top-full flex w-full flex-col gap-x-4 gap-y-6 overflow-hidden border-x border-x-gray-100 bg-white duration-300 ease-linear lg:relative lg:top-0 lg:flex-row lg:items-center lg:justify-between lg:border-x-0 lg:!bg-transparent dark:border-x-gray-900 dark:bg-gray-950 ${openNavbar ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-10 opacity-0 lg:visible lg:-translate-y-0 lg:opacity-100'} `}
          >
            <ul className="flex w-full flex-col gap-x-3 gap-y-4 border-t border-gray-100 px-6 pt-6 text-lg text-gray-700 lg:flex-row lg:items-center lg:justify-center lg:border-t-0 lg:px-0 lg:pt-0 dark:border-gray-900 dark:text-gray-300">
              <li>
                <Link
                  href="#"
                  className="py-3 font-medium duration-300 ease-linear hover:text-blue-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="py-3 font-medium duration-300 ease-linear hover:text-blue-600"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="py-3 font-medium duration-300 ease-linear hover:text-blue-600"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="py-3 font-medium duration-300 ease-linear hover:text-blue-600"
                >
                  Features
                </Link>
              </li>
            </ul>
            <div className="flex w-full items-center border-b border-gray-100 px-6 pb-6 sm:w-max lg:min-w-max lg:border-0 lg:px-0 lg:pb-0 dark:border-gray-900">
              <Link
                href="#"
                className="relative flex h-12 w-full items-center justify-center overflow-hidden rounded-full border border-transparent bg-blue-600 px-6 duration-300 ease-linear outline-none after:absolute after:inset-x-0 after:top-0 after:left-0 after:aspect-square after:origin-center after:scale-0 after:rounded-full after:bg-[#172554] after:opacity-70 after:duration-300 after:ease-linear hover:border-[#172554] hover:after:scale-[2.5] hover:after:opacity-100 sm:w-max"
              >
                <span className="relative z-10 text-white">Get Started</span>
              </Link>
            </div>
          </div>
          <div className="flex min-w-max items-center gap-x-3">
            <button className="relative flex rounded-full border border-gray-100 p-2 text-gray-700 outline-none lg:p-3 dark:border-gray-900 dark:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="hidden h-6 w-6 dark:flex"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6 dark:hidden"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
              <span className="sr-only">switch theme</span>
            </button>
            <button
              onClick={() => {
                toggleNavbar();
              }}
              className="relative flex h-auto w-7 flex-col outline-none lg:invisible lg:hidden"
            >
              <span className="sr-only">toggle navbar</span>
              <span
                className={`h-0.5 w-6 rounded-full bg-gray-700 transition-transform duration-300 ease-linear dark:bg-gray-300 ${openNavbar ? 'translate-y-1.5 rotate-[40deg]' : ''} `}
              />
              <span
                className={`mt-1 h-0.5 w-6 origin-center rounded-full bg-gray-700 transition-all duration-300 ease-linear dark:bg-gray-300 ${openNavbar ? 'scale-x-0 opacity-0' : ''} `}
              />
              <span
                className={`mt-1 h-0.5 w-6 rounded-full bg-gray-700 transition-all duration-300 ease-linear dark:bg-gray-300 ${openNavbar ? '-translate-y-1.5 -rotate-[40deg]' : ''} `}
              />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
