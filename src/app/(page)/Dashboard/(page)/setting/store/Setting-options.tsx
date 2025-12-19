'use client';

import { useSession } from 'next-auth/react';
import { ChevronLeft } from 'lucide-react';
import type { ElementType } from 'react';

import { LuUserRoundPen } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdOutlineStyle } from 'react-icons/md';
import { PiShootingStarThin } from 'react-icons/pi';
import { CiCircleInfo } from 'react-icons/ci';
import { FaCrown } from 'react-icons/fa';
import { PiCurrencyDollarLight } from 'react-icons/pi';

import { useDashboardData } from '../../../_utils/useDashboardData';
import PlanCard from '../../../_components/PlanCard';
import { SectionType } from '@/types/setting/Section';

 
const PLAN_TYPES = ['trader-basic', 'trader-pro', 'drop-basics', 'drop-pro'] as const;

type PlanType = (typeof PLAN_TYPES)[number];

 
function isPlanType(value: unknown): value is PlanType {
  return typeof value === 'string' && PLAN_TYPES.includes(value as PlanType);
}

 
interface Section {
  id: SectionType;
  label: string;
  icon: ElementType;
}

interface SettingOptionsProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

 
const SECTION_ACCESS: Record<SectionType, PlanType[]> = {
  basic: ['trader-basic', 'trader-pro', 'drop-basics', 'drop-pro'],
  shipping: ['trader-basic', 'trader-pro', 'drop-basics', 'drop-pro'],
  social: ['trader-basic', 'trader-pro', 'drop-basics', 'drop-pro'],
  about: ['trader-basic', 'trader-pro', 'drop-basics', 'drop-pro'],

   theme: ['trader-pro', 'drop-pro'],
  pixel: ['trader-pro', 'drop-pro'],
  profit: ['trader-pro', 'drop-pro'],
};

 
export default function SettingOptions({ activeSection, onSectionChange }: SettingOptionsProps) {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);

  const rawPlanType = data?.subscription?.subscription?.type;

  const currentPlan: PlanType | null = isPlanType(rawPlanType) ? rawPlanType : null;

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
    <div className="flex h-screen mb-50 w-full flex-col items-center py-2">
      
      <div dir="rtl" className="w-full max-w-xl space-y-5 rounded-lg bg-white">
        <PlanCard />
      </div>
 
      <div className="mt-8 w-full max-w-xl divide-y rounded-lg border">
        {sections.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          const isAllowed = currentPlan !== null && SECTION_ACCESS[id].includes(currentPlan);
          const isLocked = !isAllowed;

          return (
            <button
              key={id}
              disabled={isLocked}
              onClick={() => {
                if (isLocked) return;
                onSectionChange(id);
              }}
              className={`flex w-full items-center justify-between px-5 py-4 text-sm transition-all ${isActive ? 'bg-gray-50 font-medium text-gray-900' : 'text-gray-700'} ${
                isLocked ? 'cursor-not-allowed opacity-60 hover:bg-transparent' : 'hover:bg-gray-50'
              } `}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-700">
                  <Icon size={18} className="text-white" />
                </div>

                <div className="flex items-center gap-2">
                  <span>{label}</span>

                  {isLocked && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <FaCrown size={12} />
                      Pro
                    </span>
                  )}
                </div>
              </div>

              <ChevronLeft size={18} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
