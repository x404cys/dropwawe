'use client';
import { useLanguage } from '../../../context/LanguageContext';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ExternalLink, MessageCircle, Settings, Store } from 'lucide-react';
import type { ElementType } from 'react';

import { LuUserRoundPen } from 'react-icons/lu';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline, IoStorefrontOutline } from 'react-icons/io5';
import { MdOutlineDesignServices } from 'react-icons/md';
import { TfiLink } from 'react-icons/tfi';

import { PiShootingStarThin } from 'react-icons/pi';
import { FaShippingFast, FaUsersCog, FaCrown } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiSolidDiscount } from 'react-icons/bi';

import { PlanType } from '@/types/plans/Plans';
import { useSubscriptions } from '../../../hooks';
import PlanCard from '../../../_components/cards/PlanCard';
import { Button } from '@/components/ui/button';
import { BsTelephone } from 'react-icons/bs';
import { FaLinkSlash } from 'react-icons/fa6';

interface Section {
  label: string;
  desc: string;
  icon: ElementType;
  path: string;
  color?: string;
  allowedPlans?: PlanType[];
  danger?: boolean;
}

interface SectionGroup {
  title: string;
  sections: Section[];
}

export default function SettingOptions() {
  const { t } = useLanguage();
  const router = useRouter();
  const base = '/Dashboard/setting/store';
  const baseToProfile = '/Dashboard/setting/profile';
  const { traderBasic, traderPro, dropBasic, dropPro, hasAccess } = useSubscriptions();

  const planNames: Record<PlanType, string> = {
    'free-trial': t.plans?.free || 'الخطة المجانية',
    'multi-basics': t.home?.basicPlan || 'الخطة الأساسية',
    'multi-pro': t.plans?.pro || 'الباقة الاحترافية',
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
      title: t.store?.generalSettings || 'الإعدادات العامة',
      sections: [
        {
          label: t.store?.generalSettings || 'الإعدادات العامة',
          desc: 'معلومات الحساب , المضهر , واللغة ',
          icon: Settings,
          path: `${baseToProfile}`,
        },
      ],
    },
    {
      title: t.store?.basicSettings || 'الإعدادات الأساسية',
      sections: [
        {
          label: t.store?.generalSettingsStore || 'الإعدادات العامة',
          desc: t.store?.generalSettingsDesc || 'اسم المتجر، الرابط، الوصف',
          icon: Store,
          path: `${base}/basic`,
        },
        {
          label: 'الشحن والتوصيل',
          desc: 'سعر الشحن ورقم التواصل',
          icon: LiaShippingFastSolid,
          path: `${base}/shipping`,
        },
      ],
    },
    {
      title: t.more?.storeManagement || 'إدارة المتجر',
      sections: [
        {
          label: 'تخصيص القالب',
          desc: 'محتوى الهوية، الأقسام، الألوان، والخطوط',
          icon: MdOutlineDesignServices,
          path: `${base}/template`,
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
          label: t.store?.team || 'إضافة مستخدم للمتجر',
          desc: t.store?.teamDesc || 'منح صلاحيات لأعضاء فريقك',
          icon: FaUsersCog,
          path: `${base}/users`,
          allowedPlans: ['drop-pro', 'trader-pro', 'ramadan-plan'],
        },
        {
          label: 'روابط الدفع',
          desc: 'انشاء روابط الدفع مع عملائك',
          icon: TfiLink,
          path: `/Dashboard/links`,
          allowedPlans: ['drop-pro', 'trader-pro', 'ramadan-plan', 'trader-basic'],
        },
        {
          label: t.store?.coupons || 'كوبونات الخصم',
          desc: t.store?.couponsDesc || 'إنشاء وإدارة كوبونات للعملاء',
          icon: BiSolidDiscount,
          path: `${base}/coupon`,
          allowedPlans: ['drop-basics', 'trader-pro', 'drop-pro', 'free-trial', 'ramadan-plan'],
        },
        {
          label: t.more?.stores || 'إنشاء متجر إضافي',
          desc: t.more?.storesDesc || 'أدر أكثر من متجر من حساب واحد',
          icon: IoStorefrontOutline,
          path: `${base}/create-another`,
          allowedPlans: ['drop-pro'],
        },
      ],
    },
    {
      title: t.store?.growthFeatures || 'ميزات النمو',
      sections: [
        {
          label: t.store?.tracking || 'البيكسل والتتبع الإعلاني',
          desc: t.store?.trackingDesc || 'فيسبوك، جوجل، تيك توك، سناب',
          icon: PiShootingStarThin,
          color: 'bg-orange-500/10 text-orange-500',
          path: `${base}/pixel`,
          allowedPlans: ['trader-pro', 'drop-pro', 'free-trial', 'ramadan-plan'],
        },
        {
          label: t.store?.deliveryIntegration || 'الربط مع شركة التوصيل',
          desc: t.store?.deliveryIntegrationDesc || 'توصيل تلقائي عبر شركات الشحن',
          icon: FaShippingFast,
          color: 'bg-sky-500/10 text-sky-500',
          path: `${base}/c-shipping`,
          allowedPlans: ['drop-basics', 'trader-pro', 'drop-pro', 'ramadan-plan'],
        },
      ],
    },
    {
      title: t.store?.dangerZone || 'منطقة الخطر',
      sections: [
        {
          label: t.store?.deleteStore || 'حذف المتجر',
          desc: t.store?.deleteStoreDesc || 'حذف دائم لا يمكن التراجع عنه',
          icon: RiDeleteBin6Line,
          path: `${base}/danger`,
          danger: true,
        },
      ],
    },
  ];

  const canAccess = (allowedPlans?: PlanType[]) =>
    !allowedPlans || allowedPlans.some(p => hasAccess(p));
  const planLabel = (allowedPlans?: PlanType[]) =>
    allowedPlans?.length ? `${t.plans?.requiredTitle || 'يتطلب '} الباقة الاحترافية` : '';

  return (
    <div className="scrollbar-none flex w-full flex-1 flex-col overflow-y-auto py-4">
      <div className="mt-6 w-full max-w-xl space-y-5">
        {sectionGroups.map(group => (
          <div key={group.title}>
            <h2 className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
              {group.title}
            </h2>
            <div className="bg-card border-border divide-border divide-y overflow-hidden rounded-xl border shadow-sm">
              {group.sections.map(section => {
                const allowed = canAccess(section.allowedPlans);
                return (
                  <button
                    key={section.path}
                    disabled={!allowed}
                    onClick={() => allowed && router.push(section.path)}
                    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-right transition-colors ${
                      !allowed ? 'cursor-not-allowed opacity-50' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        section.danger ? 'bg-destructive/20' : (section.color ?? 'bg-muted')
                      }`}
                    >
                      <section.icon
                        size={17}
                        className={section.danger ? 'text-red-700' : undefined}
                      />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-medium ${
                            section.danger ? 'text-red-700' : 'text-foreground'
                          }`}
                        >
                          {section.label}
                        </p>
                        {!allowed && (
                          <span className="flex items-center gap-0.5 text-[10px] text-orange-500">
                            <FaCrown size={9} className="text-orange-400" />
                            {planLabel(section.allowedPlans)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-0.5 text-[11px] ${
                          section.danger ? 'text-red-700/60' : 'text-muted-foreground'
                        }`}
                      >
                        {section.desc}
                      </p>
                    </div>

                    <ChevronLeft
                      size={16}
                      className={`flex-shrink-0 ${
                        section.danger ? 'text-destructive/30' : 'text-muted-foreground/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-2">
          <h2 className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
            {t.profile?.contactUs || 'الدعم والمساعدة'}
          </h2>
          <div className="bg-card border-border divide-border divide-y overflow-hidden rounded-xl border shadow-sm">
            <button
              onClick={() => window.open('https://wa.me/9647718599996', '_blank')}
              className="hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-right transition-colors"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <MessageCircle size={17} className="text-green-500" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-foreground text-sm font-medium">
                  {t.profile?.whatsappSupport || 'واتساب — الدعم الفني'}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  تواصل معنا عبر الواتساب للحصول على مساعدة
                </p>
              </div>
              <ExternalLink size={16} className="text-muted-foreground/40 flex-shrink-0" />
            </button>
            <button
              onClick={() => window.open('tel:+9647718599996')}
              className="hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-right transition-colors"
            >
              <div className="bg-primary/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg">
                <BsTelephone size={17} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p dir="rtl" className="text-foreground text-right text-sm font-medium">
                  0771-859-9996 — الدعم الفني
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">اتصل بنا هاتفياً مباشرة</p>
              </div>
              <ExternalLink size={16} className="text-muted-foreground/40 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
