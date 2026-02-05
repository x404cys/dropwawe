'use client';
import Link from 'next/link';
import { Facebook, Instagram, Phone } from 'lucide-react';
import { BsTelegram, BsWhatsapp } from 'react-icons/bs';
import { useProducts } from '@/app/(page)/s/context/products-context';

export default function StoreFooter() {
  const { store } = useProducts();
  return (
    <footer dir="rtl" className="mt-2 border-t-2 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-bold">{store.name}</h3>
            <p className="text-sm leading-relaxed">{store.description} </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/s/themes/theme1/discount" className="">
                  خصومات
                </Link>
              </li>
              <li>
                <Link href="/s/themes/theme1/ofers" className="">
                  عروض{' '}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">تواصل معنا</h4>

            <div className="mt-4 flex items-center gap-4">
              <a href={`https://wa.me/${store.phone}`} className="">
                <BsWhatsapp size={22} />
              </a>
              <a href={`${store.telegram}`} className="">
                <BsTelegram size={22} />
              </a>
              <a href={`${store.instaLink}`} className="">
                <Instagram size={22} />
              </a>
              <a href={`${store.facebookLink}`} className="">
                <Facebook size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="my-8 border-t" />

        <div className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} جميع الحقوق محفوظة — {store.name}
        </div>
      </div>
    </footer>
  );
}
