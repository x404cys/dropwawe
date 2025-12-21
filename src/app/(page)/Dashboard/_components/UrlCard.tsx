'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiCopy, FiEdit2 } from 'react-icons/fi';
import { Eye, Link, Rocket } from 'lucide-react';
import { LuPackagePlus } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '../_utils/useDashboardData';
import { MdOutlineStyle, MdTimeToLeave } from 'react-icons/md';
import { PiSubtitles } from 'react-icons/pi';
import { RiLinksFill } from 'react-icons/ri';

interface UrlCardProps {
  storeUrl: string;
  copyToClipboard: () => void;
  theme: string;
  storeName: string;
}

export default function UrlCard({ storeUrl, copyToClipboard, storeName, theme }: UrlCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data, loading } = useDashboardData(userId);

  return (
    <motion.div
      dir="ltr"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-lg border bg-white px-4 py-4 shadow-md shadow-gray-200/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/60"
    >
      <div className="mb-2 flex items-center justify-between gap-2 py-1 font-bold text-gray-800">
        <RiLinksFill size={35} className="rounded-md border p-1" />
        <span>متجرك</span>
      </div>

      <div className="mb-4 grid grid-cols-1 items-end gap-3 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <Link size={15} />
          <div className="flex flex-col items-end">
            <span className="text-gray-500">رابط المتجر</span>
            <span className="truncate font-semibold text-gray-800">{storeUrl}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <PiSubtitles className="h-4 w-4" />
          <div className="flex flex-col items-end">
            <span className="text-gray-500">اسم المتجر</span>
            <span className="truncate font-semibold text-gray-800">{storeName}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <MdOutlineStyle className="h-4 w-4" />
          <div className="flex flex-col items-end">
            <span className="text-gray-500">نوع الثيم</span>
            <span className="truncate font-semibold text-gray-800">{theme === 'MODERN' ? 'الكلاسيكي' : 'العصري'}</span>
          </div>
        </div>
      </div>

      <hr className="my-3 border-gray-200" />

      <div
        dir="rtl"
        className="flex items-center justify-between text-xs font-medium text-gray-600"
      >
        <button
          onClick={copyToClipboard}
          className="flex flex-1 cursor-pointer flex-col items-center gap-1 transition-colors"
        >
          <FiCopy className="h-5 w-5" />
          <span>نسخ الرابط</span>
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <button
          onClick={() => router.push(storeUrl)}
          className="flex flex-1 cursor-pointer flex-col items-center gap-1 transition-colors"
        >
          <Eye className="h-5 w-5" />
          <span>عرض المتجر</span>
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <button
          onClick={() => router.push('/Dashboard/setting/store')}
          className="flex flex-1 cursor-pointer flex-col items-center gap-1 transition-colors"
        >
          <FiEdit2 className="h-5 w-5" />
          <span>تعديل</span>
        </button>
      </div>
    </motion.div>
  );
}
