'use client';

import { Supplier } from '@/types/Supplier/SupplierType';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTelegram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../context/LanguageContext';

type SupplierCardProps = {
  supplier: Supplier;
  totalProducts?: number;
  store: string;
};

const isValidUrl = (url: string | null | undefined) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default function SupplierCard({ supplier, totalProducts, store }: SupplierCardProps) {
  const { t, dir, lang } = useLanguage();
  const pageT = t.dashboardPages.supplierList.card;
  const categories = supplier.user?.Product?.map(p => p.category).filter(Boolean) ?? [];

  const uniqueCategories = Array.from(new Set(categories));

  const router = useRouter();
  const locale = lang === 'en' ? 'en-US' : 'ar-IQ';

  return (
    <motion.div
      dir={dir}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25 }}
      className="group border-border bg-card relative mx-auto flex w-full max-w-[380px] flex-col overflow-hidden rounded-2xl border"
    >
      <div className="bg-muted relative h-40 w-full">
        {isValidUrl(supplier?.Header) ? (
          <Image src={supplier.Header!} alt="Supplier Banner" fill className="object-cover" />
        ) : (
          <div className="text-muted-foreground flex h-full w-full items-center justify-center">
            {pageT.noImage}
          </div>
        )}

        <div className="absolute right-0 bottom-0 translate-x-[-10%] translate-y-[50%]">
          <div className="bg-card relative h-18 w-18 overflow-hidden rounded-full border-2 border-white shadow-md">
            {isValidUrl(supplier?.image) ? (
              <Image src={supplier.image!} alt="Supplier Logo" fill className="object-fill" />
            ) : (
              <div className="text-muted-foreground flex h-full w-full items-center justify-center text-lg font-bold">
                {supplier.user?.name?.charAt(0) ?? pageT.nameFallback.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-1 flex-col justify-between px-5 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-foreground text-lg font-semibold">
            {supplier?.name ?? pageT.nameFallback}
          </h2>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {supplier.description ?? pageT.noDescription}
          </p>
        </div>

        {uniqueCategories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {uniqueCategories.map((cat, i) => (
              <span
                key={i}
                className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs"
              >
                {cat}
              </span>
            ))}

            {uniqueCategories.length > 4 && (
              <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                {pageT.otherCategories.replace('{count}', String(uniqueCategories.length - 4))}
              </span>
            )}
          </div>
        )}

        <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-3 text-xs">
          <div className="border-border bg-muted rounded-full border px-3 py-1">
            📦 {pageT.productsCount.replace('{count}', (totalProducts ?? 0).toLocaleString(locale))}
          </div>
        </div>

        <div className="text-muted-foreground mt-4 flex items-center gap-3">
          {supplier.facebookLink && (
            <a href={supplier.facebookLink} target="_blank" rel="noopener noreferrer">
              <FaFacebook className="h-5 w-5 transition hover:text-blue-600" />
            </a>
          )}

          {supplier.instaLink && (
            <a href={supplier.instaLink} target="_blank" rel="noopener noreferrer">
              <FaInstagram className="h-5 w-5 transition hover:text-pink-600" />
            </a>
          )}

          {supplier.telegram && (
            <a href={supplier.telegram} target="_blank" rel="noopener noreferrer">
              <FaTelegram className="h-5 w-5 transition hover:text-sky-500" />
            </a>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(() => {
            try {
              const methods = JSON.parse(supplier.methodPayment || '[]');
              return methods.map((method: string, index: number) => (
                <span
                  key={index}
                  className="border-border bg-muted text-foreground rounded-full border px-3 py-1 text-xs"
                >
                  {method}
                </span>
              ));
            } catch {
              return (
                <span className="text-muted-foreground text-sm">{pageT.noPaymentMethods}</span>
              );
            }
          })()}
        </div>

        <div className="mt-5 flex justify-between">
          <button
            onClick={() => router.push(`/Dashboard/supplier/supplier-overview/${store}`)}
            className="border-border text-foreground hover:bg-muted rounded-lg border px-4 py-1.5 text-sm font-medium transition"
          >
            {pageT.viewProducts}
          </button>

          <a
            href={`https://wa.me/${supplier.phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-card rounded-lg px-4 py-1.5 text-sm font-medium text-white transition hover:bg-orange-600">
              {pageT.contactNow}
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
