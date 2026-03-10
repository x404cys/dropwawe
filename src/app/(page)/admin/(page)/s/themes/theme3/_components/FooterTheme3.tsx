'use client';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';
import { BsTelegram, BsWhatsapp } from 'react-icons/bs';
import { useProducts } from '@/app/(page)/s/context/products-context';

export default function StoreFooterTheme3() {
  const { store } = useProducts();

  return (
    <footer dir="rtl" className="mt-2 border-t border-[#a45c5d] bg-[#f9f6f3] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#a45c5d]">{store.name}</h3>
            <p className="text-sm leading-relaxed text-[#a45c5d]">{store.description}</p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-[#a45c5d]">تواصل معنا</h4>

            <div className="mt-4 flex items-center gap-4 text-[#a45c5d]">
              <a
                href={`https://wa.me/${store.phone}`}
                className="transition hover:scale-110 hover:text-[#25D366]"
              >
                <BsWhatsapp size={22} />
              </a>

              <a
                href={`${store.telegram}`}
                className="transition hover:scale-110 hover:text-[#0088cc]"
              >
                <BsTelegram size={22} />
              </a>

              <a
                href={`${store.instaLink}`}
                className="transition hover:scale-110 hover:text-[#E1306C]"
              >
                <Instagram size={22} />
              </a>

              <a
                href={`${store.facebookLink}`}
                className="transition hover:scale-110 hover:text-[#1877F2]"
              >
                <Facebook size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-[#a45c5d]" />

        <div className="text-center text-xs text-[#a45c5d]">
          © {new Date().getFullYear()} جميع الحقوق محفوظة — {store.name}
        </div>
      </div>
    </footer>
  );
}
