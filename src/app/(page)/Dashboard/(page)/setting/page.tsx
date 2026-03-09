'use client';
import { useLanguage } from '../../context/LanguageContext';

import { useRouter } from 'next/navigation';
import { Store, User, Truck, Settings, ChevronLeft, Bell, Shield } from 'lucide-react';
import { useStoreProvider } from '../../context/StoreContext';

export default function SettingsHubPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { currentStore } = useStoreProvider();

  const SETTING_SECTIONS = [
    {
      group: t.store?.title || 'المتجر',
      items: [
        {
          title: t.store?.title || 'إعدادات المتجر',
          desc: t.more?.storesDesc || 'الاسم، الرابط، الشحن، الروابط الاجتماعية والمظهر',
          icon: Store,
          color: 'bg-primary/10 text-primary',
          href: '/Dashboard/setting/store',
        },
        {
          title: t.more?.delivery || 'شركات الشحن',
          desc: t.more?.deliveryDesc || 'إدارة شركات الشحن وأسعارها ومناطق التغطية',
          icon: Truck,
          color: 'bg-violet-500/10 text-violet-500',
          href: '/Dashboard/setting/delivery',
        },
      ],
    },
    {
      group: t.profile?.title || 'الحساب',
      items: [
        {
          title: t.nav?.profile || 'البروفايل',
          desc: t.profile?.accountInfo || 'معلومات حسابك، وكلمة المرور، وتسجيل الخروج',
          icon: User,
          color: 'bg-emerald-500/10 text-emerald-500',
          href: '/Dashboard/setting/profile',
        },
        {
          title: t.profile?.notificationSettings || 'الإشعارات والمظهر',
          desc: t.more?.settingsDesc || 'تفضيلات الإشعارات والوضع الليلي',
          icon: Bell,
          color: 'bg-amber-500/10 text-amber-500',
          href: '/Dashboard/setting/profile?tab=settings',
        },
      ],
    },
    {
      group: t.more?.help || 'الدعم',
      items: [
        {
          title: t.more?.help || 'المساعدة والدعم',
          desc: t.more?.helpDesc || 'الأسئلة الشائعة والتواصل مع فريق الدعم',
          icon: Shield,
          color: 'bg-rose-500/10 text-rose-500',
          href: '/Dashboard/setting/profile?tab=help',
        },
      ],
    },
  ];

  return (
    <section dir="rtl" className="bg-background min-h-screen pb-28">
      <div className="bg-card border-border border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
            <Settings className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-foreground text-base font-bold">
              {t.more?.settingsLabel || 'الإعدادات'}
            </h1>
            {currentStore?.name && (
              <p className="text-muted-foreground text-[11px]">{currentStore.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl space-y-5 px-4 pt-4">
        {SETTING_SECTIONS.map(section => (
          <div key={section.group}>
            <p className="text-muted-foreground mb-2 px-1 text-[11px] font-semibold tracking-wider uppercase">
              {section.group}
            </p>
            <div className="bg-card border-border divide-border divide-y overflow-hidden rounded-xl border shadow-sm">
              {section.items.map(item => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-right transition-colors"
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground text-sm font-semibold">{item.title}</p>
                    <p className="text-muted-foreground mt-0.5 text-[11px] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <ChevronLeft className="text-muted-foreground/40 h-4 w-4 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
