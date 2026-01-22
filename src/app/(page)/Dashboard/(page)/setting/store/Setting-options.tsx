'use client';

import { useSession } from 'next-auth/react';
import { ChevronLeft, DollarSign } from 'lucide-react';
import type { ElementType } from 'react';
import { LuUserRoundPen } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdOutlineStyle } from 'react-icons/md';
import { PiShootingStarThin } from 'react-icons/pi';
import { FaCrown, FaUsersCog } from 'react-icons/fa';

import { useDashboardData } from '../../../context/useDashboardData';
import PlanCard from '../../../_components/PlanCard';
import { useSubscriptions } from '../../../context/useSubscription';
import { PlanType } from '@/types/plans/Plans';
import { SectionType } from '@/types/setting/Section';

interface Section {
  id: SectionType;
  label: string;
  icon: ElementType;
  requiredPlan?: PlanType;
  color?: string;
}

interface SettingOptionsProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export default function SettingOptions({ activeSection, onSectionChange }: SettingOptionsProps) {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
  const { traderBasic, traderPro, dropBasic, dropPro, hasAccess } = useSubscriptions();

  const planNames: Record<PlanType, string> = {
    'trader-basic': traderBasic?.name || 'Trader Basic',
    'trader-pro': traderPro?.name || 'Trader Pro',
    'drop-basics': dropBasic?.name || 'Drop Basics',
    'drop-pro': dropPro?.name || 'Drop Pro',
    'multi-basics': '',
    'multi-pro': 'الباقة الاحترافية',
    'multi-drop': ' للدروب شيبر فقط',
    'multi-trader': '',
  };

  const sections: Section[] = [
    { id: 'basic', label: 'الإعدادات الأساسية', icon: LuUserRoundPen },
    { id: 'shipping', label: 'إعدادات التوصيل', icon: LiaShippingFastSolid },
    { id: 'social', label: 'الروابط ووسائل التواصل', icon: IoShareSocialOutline },
    { id: 'users', label: 'اضافة حساب اخر للمتجر', icon: FaUsersCog },
    {
      id: 'theme',
      label: 'إعدادات القالب والمظهر',
      icon: MdOutlineStyle,
      requiredPlan: 'multi-basics',
    },
    { id: 'pixel', label: 'بيكسل والتتبع', icon: PiShootingStarThin, requiredPlan: 'multi-pro' },
    { id: 'withdraw', label: 'سحب الارباح', icon: DollarSign, requiredPlan: 'multi-drop' },
  ];

  return (
    <div className="md mb-42 flex h-screen w-full flex-col items-center py-2 md:flex">
      <div dir="rtl" className="w-full max-w-xl space-y-5 rounded-lg bg-white">
        <PlanCard />
      </div>

      <div className="border-accent mt-8 h-screen w-full max-w-xl divide-y rounded-lg border">
        {sections.map(({ id, label, icon: Icon, color, requiredPlan }) => {
          const isActive = activeSection === id;
          const allowed: boolean = requiredPlan ? hasAccess(requiredPlan) : true;

          const badgeLabel = requiredPlan ? `متاح  ${planNames[requiredPlan]}` : '';

          return (
            <button
              key={id}
              disabled={!allowed}
              onClick={() => allowed && onSectionChange(id)}
              className={`flex w-full items-center justify-between px-5 py-4 text-sm transition-all duration-200 ${
                !allowed
                  ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                  : isActive
                    ? 'bg-gray-50 font-medium text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    allowed ? 'bg-sky-700' : 'bg-gray-300'
                  }`}
                >
                  <Icon size={18} className="text-white" />
                </div>

                <span className="text-sm">{label}</span>

                {!allowed && badgeLabel && (
                  <>
                    <FaCrown className="ml-2 text-orange-500" size={14} />
                    <span className="rounded-full border-blue-400 bg-blue-200 px-2 text-xs text-blue-400">
                      {badgeLabel}
                    </span>
                  </>
                )}
              </div>

              <ChevronLeft
                size={18}
                className={`transition-transform ${isActive ? 'translate-x-0.5' : ''} ${
                  allowed ? 'text-gray-400' : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
