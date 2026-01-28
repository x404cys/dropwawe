'use client';

import { useSession } from 'next-auth/react';
import { ChevronLeft, DollarSign } from 'lucide-react';
import type { ElementType } from 'react';

import { LuUserRoundPen } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline, IoStorefrontOutline } from 'react-icons/io5';
import { MdOutlineStyle } from 'react-icons/md';
import { PiShootingStarThin } from 'react-icons/pi';
import { FaCrown, FaUsersCog } from 'react-icons/fa';

import PlanCard from '../../../_components/PlanCard';
import { useSubscriptions } from '../../../context/useSubscription';
import { useDashboardData } from '../../../context/useDashboardData';

import { PlanType } from '@/types/plans/Plans';
import { SectionType } from '@/types/setting/Section';

interface Section {
  id: SectionType;
  label: string;
  icon: ElementType;
}

interface SectionGroup {
  title: string;
  plan?: PlanType;
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
    'trader-basic': traderBasic?.name || 'Trader Basic',
    'trader-pro': traderPro?.name || 'Trader Pro',
    'drop-basics': dropBasic?.name || 'Drop Basics',
    'drop-pro': dropPro?.name || 'Drop Pro',
    'multi-basics': 'الباقة الأساسية',
    'multi-pro': 'الباقة الاحترافية',
    'multi-drop': 'خطة الدروب شيبر',
    'multi-trader': 'خطة التاجر',
    'free-trial': 'الخطة المجانية',
  };

  const sectionGroups: SectionGroup[] = [
    {
      title: 'الإعدادات الأساسية',
      sections: [
        { id: 'basic', label: 'الإعدادات الأساسية', icon: LuUserRoundPen },
        { id: 'shipping', label: 'إعدادات التوصيل', icon: LiaShippingFastSolid },
        {
          id: 'social',
          label: 'الروابط ووسائل التواصل',
          icon: IoShareSocialOutline,
        },
      ],
    },

    {
      title: 'إدارة المتجر',
      plan: 'multi-basics',
      sections: [
        {
          id: 'users',
          label: 'إضافة حساب آخر للمتجر',
          icon: FaUsersCog,
        },
        {
          id: 'create-another',
          label: 'إنشاء متجر آخر',
          icon: IoStorefrontOutline,
        },
        {
          id: 'theme',
          label: 'إعدادات القالب والمظهر',
          icon: MdOutlineStyle,
        },
      ],
    },

    {
      title: 'ميزات احترافية',
      plan: 'multi-pro',
      sections: [
        {
          id: 'pixel',
          label: 'البيكسل والتتبع',
          icon: PiShootingStarThin,
        },
        {
          id: 'withdraw',
          label: 'سحب الأرباح',
          icon: DollarSign,
        },
      ],
    },
  ];

  return (
    <div className="scrollbar-none flex h-screen w-full flex-col items-center overflow-y-scroll py-3">
      <div dir="rtl" className="w-full max-w-xl">
        <PlanCard />
      </div>

      <div className="mt-6 w-full max-w-xl space-y-6">
        {sectionGroups.map(group => {
          const allowedGroup = group.plan ? hasAccess(group.plan) : true;
          const badgeLabel = group.plan ? `متاح ${planNames[group.plan]}` : '';

          return (
            <div key={group.title} className="overflow-hidden rounded-lg border bg-white">
              <div className="flex items-center justify-between bg-gray-100 px-5 py-3 text-sm font-medium text-gray-700">
                <span>{group.title}</span>

                {!allowedGroup && (
                  <div className="flex items-center gap-2 text-xs text-orange-500">
                    <FaCrown size={14} />
                    <span>{badgeLabel}</span>
                  </div>
                )}
              </div>

              {group.sections.map(({ id, label, icon: Icon }) => {
                const isActive = activeSection === id;

                return (
                  <button
                    key={id}
                    disabled={!allowedGroup}
                    onClick={() => allowedGroup && onSectionChange(id)}
                    className={`flex w-full items-center justify-between px-5 py-4 text-sm transition-all ${
                      !allowedGroup
                        ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                        : isActive
                          ? 'bg-gray-50 font-medium text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          allowedGroup ? 'bg-sky-700' : 'bg-gray-300'
                        }`}
                      >
                        <Icon size={18} className="text-white" />
                      </div>

                      <span>{label}</span>
                    </div>

                    <ChevronLeft
                      size={18}
                      className={`transition-transform ${
                        isActive ? 'translate-x-0.5' : ''
                      } ${allowedGroup ? 'text-gray-400' : 'text-gray-300'}`}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
