'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../NavBar/NavBar';

export default function HeroSection() {
  return (
    <>
      <Navbar />
      <section dir="rtl" className="relative pt-32 lg:pt-36">
        <div className="mx-auto flex w-full flex-col gap-10 px-5 sm:px-10 md:px-12 lg:max-w-7xl lg:flex-row-reverse lg:gap-12 lg:px-5">
          <div className="absolute inset-y-0 hidden w-full lg:left-0 lg:block lg:w-1/2">
            <span className="absolute top-24 -right-6 hidden h-24 w-24 rotate-90 skew-x-12 rounded-3xl bg-sky-400 opacity-60 blur-xl md:right-4 lg:top-28 lg:block lg:opacity-95" />
            <span className="absolute bottom-12 left-4 h-24 w-24 rounded-3xl bg-sky-400 opacity-80 blur-xl" />
          </div>
          <span className="absolute -top-5 aspect-square w-4/12 rotate-90 skew-x-12 skew-y-12 rounded-full bg-gradient-to-tr from-sky-200 to-sky-400 opacity-40 blur-3xl lg:right-0 lg:w-2/12" />
          <div className="relative mx-auto flex flex-1">
            <Image
              src="/HeroSection.png"
              alt="Hero image"
              fill  
              // className="w-full rounded-xl object-cover"
              priority
            />
          </div>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center lg:mx-0 lg:w-1/2 lg:max-w-none lg:flex-1 lg:items-end lg:py-7 lg:text-right xl:py-8">
            <div>
              <h1 className="flex flex-col text-3xl/tight font-bold text-gray-900 sm:text-4xl/tight md:text-5xl/tight xl:text-6xl/tight dark:text-white">
                <span> ضغطة واحدة تفصلك عن</span>{' '}
                <span className="bg-gradient-to-br from-sky-300 from-20% via-sky-400 via-30% to-sky-300 bg-clip-text text-transparent">
                  النجاح
                </span>
                في التجارة الالكترونية
              </h1>

              <p className="mt-8 text-gray-500 dark:text-gray-300">
                طلق مشروعك خلال دقائق فقط، أو ارتقِ بمشروعك واستقبل طلباتك على متجرك الالكتروني مع
                بوابة دفع آمنة وربط مع شركات التوصيل.
              </p>
            </div>

            <div className="my-12 flex flex-col items-center justify-center gap-5 md:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-sky-400 px-6 py-2 text-center text-white transition hover:bg-sky-700"
              >
                سجل الآن
              </Link>
              <Link
                href="/test"
                className="rounded-full border border-sky-400 px-6 py-2 text-center text-sky-400 transition hover:bg-blue-50"
              >
                جرب المنصة
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
