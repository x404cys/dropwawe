'use client';

import { useSession } from 'next-auth/react';
import { ChevronLeft, DollarSign } from 'lucide-react';
import type { ElementType } from 'react';

import { LuUserRoundPen } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline, IoStorefrontOutline } from 'react-icons/io5';
import { MdOutlineStyle } from 'react-icons/md';
import { PiShootingStarThin } from 'react-icons/pi';
import { FaCrown, FaShippingFast, FaUsersCog } from 'react-icons/fa';

import PlanCard from '../../../_components/PlanCard';
import { useSubscriptions } from '../../../context/useSubscription';
import { useDashboardData } from '../../../context/useDashboardData';

import { PlanType } from '@/types/plans/Plans';
import { SectionType } from '@/types/setting/Section';
import { BiSolidDiscount } from 'react-icons/bi';

interface Section {
  id: SectionType;
  label: string;
  icon: ElementType;
  allowedPlans?: PlanType[];
}

interface SectionGroup {
  title: string;
  sections: Section[];
}

interface SettingOptionsProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export default function SettingOptions({ activeSection, onSectionChange }: SettingOptionsProps) {
  const { data: session } = useSession();
  useDashboardData(session?.user?.id);

  const { traderBasic, traderPro, dropBasic, dropPro, hasAccess } = useSubscriptions();

  const planNames: Record<PlanType, string> = {
    'free-trial': 'الخطة المجانية',
    'multi-basics': 'الباقة الأساسية',
    'multi-pro': 'الباقة الاحترافية',
    'multi-drop': 'خطة الدروب شيبر',
    'multi-trader': 'خطة التاجر',
    'trader-basic': traderBasic?.name || 'Trader Basic',
    'trader-pro': traderPro?.name || 'Trader Pro',
    'drop-basics': dropBasic?.name || 'Drop Basics',
    'drop-pro': dropPro?.name || 'Drop Pro',
    'ramadan-plan': '',
  };

  const sectionGroups: SectionGroup[] = [
    {
      title: 'الإعدادات الأساسية',
      sections: [
        {
          id: 'basic',
          label: 'الإعدادات العامة للمتجر',
          icon: LuUserRoundPen,
        },
        {
          id: 'shipping',
          label: 'إعدادات الشحن والتوصيل',
          icon: LiaShippingFastSolid,
        },
        {
          id: 'social',
          label: 'روابط ووسائل التواصل',
          icon: IoShareSocialOutline,
        },
      ],
    },

    {
      title: 'إدارة المتجر',
      sections: [
        {
          id: 'theme',
          label: 'تخصيص القالب والمظهر',
          icon: MdOutlineStyle,
          allowedPlans: [
            'drop-basics',
            'trader-basic',
            'trader-pro',
            'drop-pro',
            'free-trial',
            'ramadan-plan',
          ],
        },
        {
          id: 'users',
          label: 'إضافة مستخدم لإدارة المتجر',
          icon: FaUsersCog,
          allowedPlans: ['drop-pro', 'trader-pro', 'trader-pro', 'ramadan-plan'],
        },
        {
          id: 'Coupon',
          label: 'كوبونات',
          icon: BiSolidDiscount,
          allowedPlans: [
            'drop-basics',
            'trader-basic',
            'trader-pro',
            'drop-pro',
            'free-trial',
            'ramadan-plan',
          ],
        },
        {
          id: 'create-another',
          label: 'إنشاء متجر إضافي',
          icon: IoStorefrontOutline,
          allowedPlans: ['drop-pro'],
        },
      ],
    },

    {
      title: 'ميزات النمو والاحتراف',
      sections: [
        {
          id: 'pixel',
          label: 'البيكسل والتتبع الإعلاني',
          icon: PiShootingStarThin,
          allowedPlans: ['trader-basic', 'trader-pro', 'drop-pro', 'free-trial', 'ramadan-plan'],
        },
        {
          id: 'c-shipping',
          label: 'الربط مع شركة التوصيل',
          icon: FaShippingFast,
          allowedPlans: ['drop-basics', 'trader-pro', 'drop-pro', 'ramadan-plan'],
        },
      ],
    },
  ];

  const canAccessSection = (allowedPlans?: PlanType[]) => {
    if (!allowedPlans) return true;
    return allowedPlans.some(plan => hasAccess(plan));
  };

  const requiredPlanLabel = (allowedPlans?: PlanType[]) => {
    if (!allowedPlans || allowedPlans.length === 0) return '';
    return `يتطلب ${planNames[allowedPlans[0]]}`;
  };

  return (
    <div className="scrollbar-none flex w-full flex-1 flex-col overflow-y-auto py-4">
      <div dir="rtl" className="w-full max-w-xl">
        <PlanCard />
      </div>

      <div className="mt-6 w-full max-w-xl space-y-6">
        {sectionGroups.map(group => (
          <div key={group.title} className="overflow-hidden rounded-xl border bg-white">
            <div className="bg-gray-100 px-5 py-3 text-sm font-medium text-gray-700">
              {group.title}
            </div>

            {group.sections.map(section => {
              const allowed = canAccessSection(section.allowedPlans);
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  disabled={!allowed}
                  onClick={() => allowed && onSectionChange(section.id)}
                  className={`flex w-full items-center justify-between px-5 py-4 text-sm transition-all ${
                    !allowed
                      ? 'hidden cursor-not-allowed bg-gray-50 text-gray-400'
                      : isActive
                        ? 'bg-gray-50 font-medium text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                  } `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        allowed ? 'bg-[#04BAF6]' : 'bg-gray-300'
                      } `}
                    >
                      <section.icon size={18} className="text-white" />
                    </div>

                    <div className="flex flex-col items-start">
                      <span>{section.label}</span>

                      {!allowed && (
                        <span className="text-[11px] text-orange-500">
                          {requiredPlanLabel(section.allowedPlans)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!allowed && <FaCrown size={14} className="text-orange-400" />}

                    <ChevronLeft
                      size={18}
                      className={`transition-transform ${isActive ? 'translate-x-0.5' : ''} ${
                        allowed ? 'text-gray-400' : 'text-gray-300'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
