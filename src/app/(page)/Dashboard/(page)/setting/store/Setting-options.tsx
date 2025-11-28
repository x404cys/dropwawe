'use client';

import { useSession } from 'next-auth/react';
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
import { useDashboardData } from '../../../_utils/useDashboardData';
import { formatIQD } from '@/app/lib/utils/CalculateDiscountedPrice';
import { IoBusinessOutline } from 'react-icons/io5';
import PlanCard from '../../../_components/PlanCard';
import { PiCurrencyDollarLight } from 'react-icons/pi';

type SectionType =
  | 'basic'
  | 'shipping'
  | 'social'
  | 'theme'
  | 'pixel'
  | 'subscriptions'
  | 'about'
  | 'profit';

interface Section {
  id: SectionType;
  label: string;
  icon: ElementType;
  color?: string;
}

interface SettingOptionsProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export default function SettingOptions({ activeSection, onSectionChange }: SettingOptionsProps) {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const sections: Section[] = [
    { id: 'basic', label: 'الإعدادات الأساسية', icon: LuUserRoundPen },
    { id: 'shipping', label: 'إعدادات التوصيل', icon: LiaShippingFastSolid },
    { id: 'profit', label: 'سحب العوائد', icon: PiCurrencyDollarLight },
    { id: 'social', label: 'الروابط ووسائل التواصل', icon: IoShareSocialOutline },
    { id: 'theme', label: 'إعدادات القالب والمظهر', icon: MdOutlineStyle },
    { id: 'pixel', label: 'بيكسل والتتبع', icon: PiShootingStarThin },

    { id: 'about', label: 'من نحن', icon: CiCircleInfo },
  ];

  return (
    <div className="md mb-42 flex h-screen w-full flex-col items-center py-2 md:flex">
      <div dir="rtl" className="w-full max-w-xl space-y-5 rounded-lg bg-white">
        <PlanCard />
      </div>

      <div className="border-accent mt-8 h-screen w-full max-w-xl divide-y rounded-lg border">
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
                  className={`p-5' } flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 transition-colors`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : color || 'text-white'} />
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
