'use client';

import { useRouter } from 'next/navigation';

export default function FloatingCTA() {
  const router = useRouter();

  return (
    <div className="fixed top-0 z-50 w-full bg-black px-4 py-3 text-white shadow-lg md:top-auto md:bottom-0">
      <div
        dir="rtl"
        className="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <p className="text-center text-sm font-medium md:text-right md:text-base">
          عجبتك التجربة ؟ اطلق متجرك الان وخلال دقائق فقط!
        </p>

        <button
          onClick={() => router.push('/pricing')}
          className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200"
        >
          ابدأ الآن
        </button>
      </div>
    </div>
  );
}
