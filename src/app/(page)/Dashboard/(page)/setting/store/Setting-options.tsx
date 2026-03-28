'use client';

import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Settings,
  Store,
} from 'lucide-react';
import type { ElementType } from 'react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoStorefrontOutline } from 'react-icons/io5';
import { MdOutlineDesignServices } from 'react-icons/md';
import { TfiLink } from 'react-icons/tfi';
import { PiShootingStarThin } from 'react-icons/pi';
import { FaShippingFast, FaUsersCog, FaCrown } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiSolidDiscount } from 'react-icons/bi';
import { BsTelephone } from 'react-icons/bs';
import { PlanType } from '@/types/plans/Plans';
import { useSubscriptions } from '../../../hooks';
import { useLanguage } from '../../../context/LanguageContext';

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
  const { t, dir } = useLanguage();
  const router = useRouter();
  const base = '/Dashboard/setting/store';
  const baseToProfile = '/Dashboard/setting/profile';
  const { traderBasic, traderPro, dropBasic, dropPro, hasAccess } = useSubscriptions();

  const ArrowIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const textAlignClass = dir === 'rtl' ? 'text-right' : 'text-left';
  const joiner = dir === 'rtl' ? '، ' : ', ';

  const planNames: Record<PlanType, string> = {
    'free-trial': t.plans?.free || 'Free',
    'multi-basics': t.home?.basicPlan || t.plans?.basic || 'Basic',
    'multi-pro': t.plans?.pro || 'Pro',
    'multi-drop': t.storeOptions.planNames.multiDrop,
    'multi-trader': t.storeOptions.planNames.multiTrader,
    'trader-basic': traderBasic?.name || t.storeOptions.planNames.traderBasic,
    'trader-pro': traderPro?.name || t.storeOptions.planNames.traderPro,
    'drop-basics': dropBasic?.name || t.storeOptions.planNames.dropBasics,
    'drop-pro': dropPro?.name || t.storeOptions.planNames.dropPro,
    'ramadan-plan': '',
  };

  const sectionGroups: SectionGroup[] = [
    {
      title: t.store?.generalSettings || 'General Settings',
      sections: [
        {
          label: t.store?.generalSettings || 'General Settings',
          desc: t.storeOptions.profileSettingsDesc,
          icon: Settings,
          path: baseToProfile,
        },
      ],
    },
    {
      title: t.store?.basicSettings || 'Basic Settings',
      sections: [
        {
          label: t.store?.generalSettingsStore || 'Store General Settings',
          desc: t.store?.generalSettingsDesc || 'Store Name, Link, Description',
          icon: Store,
          path: `${base}/basic`,
        },
        {
          label: t.storeOptions.shippingAndDelivery,
          desc: t.storeOptions.shippingAndDeliveryDesc,
          icon: LiaShippingFastSolid,
          path: `${base}/shipping`,
        },
      ],
    },
    {
      title: t.more?.storeManagement || 'Store Management',
      sections: [
        {
          label: t.templateEditor.page.title,
          desc: t.templateEditor.page.subtitle,
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
          label: t.store?.team || 'Team',
          desc: t.store?.teamDesc || 'Add managers and permissions',
          icon: FaUsersCog,
          path: `${base}/users`,
          allowedPlans: ['drop-pro', 'trader-pro', 'ramadan-plan'],
        },
        {
          label: t.storeOptions.paymentLinks,
          desc: t.storeOptions.paymentLinksDesc,
          icon: TfiLink,
          path: '/Dashboard/links',
          allowedPlans: ['drop-pro', 'trader-pro', 'ramadan-plan', 'trader-basic'],
        },
        {
          label: t.store?.coupons || 'Coupons',
          desc: t.store?.couponsDesc || 'Create and manage coupons',
          icon: BiSolidDiscount,
          path: `${base}/coupon`,
          allowedPlans: ['drop-basics', 'trader-pro', 'drop-pro', 'free-trial', 'ramadan-plan'],
        },
        {
          label: t.store?.createAnother || 'Create Another Store',
          desc:
            t.store?.multipleStoresDesc || t.more?.storesDesc || 'Create and manage your stores',
          icon: IoStorefrontOutline,
          path: `${base}/create-another`,
          allowedPlans: ['drop-pro'],
        },
      ],
    },
    {
      title: t.store?.growthFeatures || 'Growth Features',
      sections: [
        {
          label: t.store?.tracking || 'Pixel & Tracking',
          desc: t.store?.trackingDesc || 'Facebook Pixel, Google Analytics',
          icon: PiShootingStarThin,
          color: 'bg-orange-500/10 text-orange-500',
          path: `${base}/pixel`,
          allowedPlans: ['trader-pro', 'drop-pro', 'free-trial', 'ramadan-plan'],
        },
        {
          label: t.store?.deliveryIntegration || 'Delivery Company Integration',
          desc: t.store?.deliveryIntegrationDesc || 'Automatic delivery via shipping companies',
          icon: FaShippingFast,
          color: 'bg-sky-500/10 text-sky-500',
          path: `${base}/c-shipping`,
          allowedPlans: ['drop-basics', 'trader-pro', 'drop-pro', 'ramadan-plan'],
        },
      ],
    },
    {
      title: t.store?.dangerZone || 'Danger Zone',
      sections: [
        {
          label: t.store?.deleteStore || 'Delete Store',
          desc: t.store?.deleteStoreDesc || 'This action cannot be undone',
          icon: RiDeleteBin6Line,
          path: `${base}/danger`,
          danger: true,
        },
      ],
    },
  ];

  const canAccess = (allowedPlans?: PlanType[]) =>
    !allowedPlans || allowedPlans.some(plan => hasAccess(plan));

  const planLabel = (allowedPlans?: PlanType[]) => {
    const names = (allowedPlans ?? [])
      .map(plan => planNames[plan])
      .filter(Boolean)
      .join(joiner);

    return names ? `${t.plans?.requiredTitle || 'Requires'}: ${names}` : '';
  };

  return (
    <div dir={dir} className="scrollbar-none flex w-full flex-1 flex-col overflow-y-auto py-4">
      <div className="mt-6 w-full max-w-xl space-y-5">
        {sectionGroups.map(group => (
          <div key={group.title}>
            <h2
              className={`text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase ${textAlignClass}`}
            >
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
                    className={`flex w-full items-center gap-3 px-4 py-3.5 transition-colors ${textAlignClass} ${
                      !allowed
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-muted/50 cursor-pointer'
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

                    <div className={`min-w-0 flex-1 ${textAlignClass}`}>
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

                    <ArrowIcon
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
          <h2
            className={`text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase ${textAlignClass}`}
          >
            {t.profile?.contactUs || 'Contact Us'}
          </h2>
          <div className="bg-card border-border divide-border divide-y overflow-hidden rounded-xl border shadow-sm">
            <button
              onClick={() => window.open('https://wa.me/9647718599996', '_blank')}
              className={`hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors ${textAlignClass}`}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <MessageCircle size={17} className="text-green-500" />
              </div>
              <div className={`min-w-0 flex-1 ${textAlignClass}`}>
                <p className="text-foreground text-sm font-medium">
                  {t.profile?.whatsappSupport || 'WhatsApp — Support'}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {t.storeOptions.whatsappSupportDesc}
                </p>
              </div>
              <ExternalLink size={16} className="text-muted-foreground/40 flex-shrink-0" />
            </button>

            <button
              onClick={() => window.open('tel:+9647718599996')}
              className={`hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 transition-colors ${textAlignClass}`}
            >
              <div className="bg-primary/10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg">
                <BsTelephone size={17} className="text-primary" />
              </div>
              <div className={`min-w-0 flex-1 ${textAlignClass}`}>
                <p dir="ltr" className="text-foreground text-sm font-medium">
                  {t.storeOptions.phoneSupport}
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {t.storeOptions.phoneSupportDesc}
                </p>
              </div>
              <ExternalLink size={16} className="text-muted-foreground/40 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
