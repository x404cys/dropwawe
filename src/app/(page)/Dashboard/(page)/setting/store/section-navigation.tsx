'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CircleDollarSign, Rocket } from 'lucide-react';
import type { ElementType } from 'react';
import { LuUserRoundPen } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdOutlineStyle } from 'react-icons/md';
import { PiShootingStarThin } from 'react-icons/pi';
import { CiCircleInfo } from 'react-icons/ci';
import { FaCrown } from 'react-icons/fa';

type SectionType = 'basic' | 'shipping' | 'social' | 'theme' | 'pixel' | 'subscriptions' | 'about';

interface Section {
  id: SectionType;
  label: string;
  icon: ElementType;
  color?: string;
}

interface SectionNavigationProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export default function SectionNavigation({
  activeSection,
  onSectionChange,
}: SectionNavigationProps) {
  const { data: session } = useSession();

  const sections: Section[] = [
    { id: 'basic', label: 'الإعدادات الأساسية', icon: LuUserRoundPen },
    { id: 'shipping', label: 'إعدادات التوصيل', icon: LiaShippingFastSolid },
    { id: 'social', label: 'الروابط ووسائل التواصل', icon: IoShareSocialOutline },
    { id: 'theme', label: 'إعدادات القالب والمظهر', icon: MdOutlineStyle },
    { id: 'pixel', label: 'بيكسل والتتبع', icon: PiShootingStarThin },
    {
      id: 'subscriptions',
      label: 'الاشتراكات والخطط',
      icon: CircleDollarSign,
      color: 'text-orange-500',
    },
    { id: 'about', label: 'من نحن', icon: CiCircleInfo },
  ];

  return (
    <div className="py- flex h-screen w-full flex-col items-center">
      <div dir="rtl" className="w-full max-w-xl space-y-5 rounded-lg bg-white">
        <div className="rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold">باقة الانطلاق 🚀</p>
              <p className="mt-1 text-xs leading-snug text-gray-300">
                مناسبة للتجار المبتدئين، مع مزايا ممتازة واحترافية.
              </p>
            </div>
            <Rocket size={22} className="text-blue-400" />
          </div>
        </div>

        <div className="flex flex-wrap-reverse gap-3 sm:flex-row">
          <Button className="w-full rounded-lg bg-gray-900 text-white hover:bg-gray-800">
            <span> اشترك بالباقة الاحترافية</span>
            <FaCrown />
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-lg border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <span> تجديد الاشتراك</span>
          </Button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-xl divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow-sm">
        {sections.map(({ id, label, icon: Icon, color }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`flex w-full items-center justify-between px-5 py-4 text-sm transition-all duration-200 ${
                isActive ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    isActive ? 'bg-gray-200' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? 'text-gray-900' : color || 'text-gray-500'}
                  />
                </div>
                <span className="text-sm">{label}</span>
              </div>
              <ChevronLeft
                size={18}
                className={`transition-transform ${
                  isActive ? 'translate-x-0.5 text-gray-900' : 'text-gray-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
