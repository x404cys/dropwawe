'use client';
import { useLanguage } from '../../context/LanguageContext';

import { useRouter } from 'next/navigation';
import {
  Store, User, Truck, Settings,
  ChevronLeft, Bell, Shield,
} from 'lucide-react';
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
    <section dir="rtl" className="min-h-screen bg-background pb-28">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">{t.more?.settingsLabel || 'الإعدادات'}</h1>
            {currentStore?.name && (
              <p className="text-[11px] text-muted-foreground">{currentStore.name}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5 max-w-xl mx-auto">
        {SETTING_SECTIONS.map(section => (
          <div key={section.group}>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
              {section.group}
            </p>
            <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border shadow-sm">
              {section.items.map(item => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className="flex w-full items-center gap-3 px-4 py-4 hover:bg-muted/50 transition-colors text-right cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <ChevronLeft className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
