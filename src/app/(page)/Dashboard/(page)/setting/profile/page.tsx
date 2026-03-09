'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Mail,
  Shield,
  LogOut,
  Camera,
  Save,
  Bell,
  HelpCircle,
  ExternalLink,
  Sun,
  Moon,
  MessageCircle,
  FileText,
  Languages,
  Pencil,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage, type Lang } from '../../../context/LanguageContext';
import SettingsPageHeader from '../_components/settings-page-header';
import SettingsSectionCard from '../_components/settings-section-card';
import SettingsSectionHeading from '../_components/settings-section-heading';
import { BsTelephone } from 'react-icons/bs';

const getFAQs = (t: any) => [
  {
    q: t.profile?.faqs?.q1 || 'كيف أضيف منتج جديد؟',
    a: t.profile?.faqs?.a1 || 'من صفحة المخزن اضغط على إضافة منتج وأدخل تفاصيل المنتج.',
  },
  {
    q: t.profile?.faqs?.q2 || 'كيف أتابع الطلبات؟',
    a: t.profile?.faqs?.a2 || 'من قسم الطلبات يمكنك عرض جميع الطلبات وتغيير حالتها.',
  },
  {
    q: t.profile?.faqs?.q3 || 'كيف أغيّر رابط متجري؟',
    a:
      t.profile?.faqs?.a3 ||
      'اذهب إلى الإعدادات › الإعدادات العامة للمتجر وعدّل رابط المتجر (Slug).',
  },
  {
    q: t.profile?.faqs?.q4 || 'كيف أضيف بكسل فيسبوك؟',
    a: t.profile?.faqs?.a4 || 'اذهب إلى الإعدادات › البيكسل والتتبع الإعلاني وأدخل معرّف البكسل.',
  },
];

export default function ProfileSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('account');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name ?? '');
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();

  const [notifSettings, setNotifSettings] = useState({
    orderAlerts: true,
    notifications: true,
    emailUpdates: false,
  });

  const LANG_OPTIONS: { value: Lang; label: string; native: string }[] = [
    { value: 'ar', label: 'العربية', native: 'العربية' },
    { value: 'ku', label: 'کوردی', native: 'کوردی سۆرانی' },
    { value: 'en', label: 'English', native: 'English' },
  ];

  const TABS = [
    { id: 'account', label: t.profile?.title || 'الحساب', icon: User },
    { id: 'settings', label: t.more?.settingsLabel || 'الإعدادات', icon: Sun },
    { id: 'help', label: t.more?.help || 'المساعدة', icon: HelpCircle },
  ];

  const FAQS = getFAQs(t);

  const saveProfile = async () => {
    setEditing(false);
    toast.success(t.profile?.savedDesc || 'تم حفظ التغييرات');
  };
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    window.location.href = 'https://www.matager.store';
  };
  const headerAction =
    activeTab === 'account' ? (
      editing ? (
        <Button
          size="sm"
          onClick={saveProfile}
          className="bg-primary hover:bg-primary/90 h-8 gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          {t.save}
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setEditing(true)}
          className="h-8 gap-1.5 text-xs"
        >
          <Pencil className="h-3.5 w-3.5" />
          {t.edit}
        </Button>
      )
    ) : undefined;

  return (
    <section dir="rtl" className="bg-background min-h-screen pb-28">
      <SettingsPageHeader title={t.nav?.profile || 'الملف الشخصي'} action={headerAction} />

      <div className="mx-auto max-w-xl space-y-5 px-4 pt-4">
        {/* Tab bar */}
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditing(false);
              }}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground hover:border-primary/40'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ ACCOUNT TAB ═══ */}
        {activeTab === 'account' && (
          <div className="space-y-4">
            {/* Avatar + basic info */}
            <SettingsSectionCard>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ''}
                      className="border-border h-16 w-16 rounded-full border object-cover"
                    />
                  ) : (
                    <div className="bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold">
                      {(session?.user?.name ?? 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  {editing && (
                    <button className="bg-muted border-border absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full border">
                      <Camera className="text-muted-foreground h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-foreground truncate text-base font-bold">
                    {session?.user?.name ?? '—'}
                  </h2>
                  <p className="text-muted-foreground truncate text-xs">
                    {session?.user?.email ?? '—'}
                  </p>
                  <span className="text-primary text-[11px] font-medium">
                    {session?.user?.role ?? ''}
                  </span>
                </div>
              </div>
            </SettingsSectionCard>

            {/* Personal info */}
            <SettingsSectionCard className="space-y-4">
              <SettingsSectionHeading icon={User}>
                {t.profile?.accountInfo || 'المعلومات الشخصية'}
              </SettingsSectionHeading>
              <div className="space-y-3">
                <div>
                  <label className="text-muted-foreground mb-1 flex items-center gap-1 text-[11px]">
                    <User className="h-3 w-3" /> {t.profile?.name || 'الاسم'}
                  </label>
                  {editing ? (
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="h-10 text-sm"
                    />
                  ) : (
                    <p className="text-foreground bg-muted rounded-lg px-3 py-2 text-sm">
                      {session?.user?.name ?? '—'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 flex items-center gap-1 text-[11px]">
                    <Mail className="h-3 w-3" /> {t.profile?.email || 'البريد الإلكتروني'}
                  </label>
                  <p className="text-foreground bg-muted rounded-lg px-3 py-2 text-sm" dir="ltr">
                    {session?.user?.email ?? '—'}
                  </p>
                </div>
              </div>
            </SettingsSectionCard>

            {/* Security + logout */}
            <SettingsSectionCard noPadding>
              <div className="border-border border-t" />
              <button
                onClick={() => handleSignOut()}
                className="hover:bg-destructive/5 flex w-full items-center gap-3 px-4 py-3.5 text-right transition-colors"
              >
                <LogOut className="text-destructive h-4 w-4" />
                <p className="text-destructive text-sm font-medium">
                  {t.profile?.logout || 'تسجيل الخروج'}
                </p>
              </button>
            </SettingsSectionCard>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Language Selection */}
            <SettingsSectionCard className="space-y-3">
              <SettingsSectionHeading icon={Languages}>
                {t.profile?.language || 'لغة الواجهة'}
              </SettingsSectionHeading>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LANG_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setLang(option.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                      lang === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-foreground text-sm font-bold">{option.label}</span>
                    <span className="text-muted-foreground text-[10px]">{option.native}</span>
                  </button>
                ))}
              </div>
            </SettingsSectionCard>

            {/* Appearance */}
            <SettingsSectionCard className="space-y-3">
              <SettingsSectionHeading icon={Sun}>
                {t.profile?.appearance || 'المظهر'}
              </SettingsSectionHeading>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: 'light', label: t.profile?.lightMode || 'فاتح', icon: Sun },
                    { value: 'dark', label: t.profile?.darkMode || 'داكن', icon: Moon },
                  ] as const
                ).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                      theme === opt.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <opt.icon className="text-foreground h-5 w-5" />
                    <span className="text-foreground text-sm font-bold">{opt.label}</span>
                  </button>
                ))}
              </div>
            </SettingsSectionCard>

            {/* Notifications */}
            <SettingsSectionCard noPadding>
              <div className="p-4 pb-3">
                <SettingsSectionHeading icon={Bell}>
                  {t.profile?.notificationSettings || 'إعدادات الإشعارات'}
                </SettingsSectionHeading>
              </div>
              {[
                {
                  key: 'orderAlerts' as const,
                  label: t.profile?.orderAlerts || 'تنبيهات الطلبات',
                  desc: t.profile?.orderAlertsDesc || 'إشعار فوري عند ورود طلب جديد',
                },
                {
                  key: 'notifications' as const,
                  label: t.profile?.generalNotif || 'تحديثات المنصة',
                  desc: t.profile?.generalNotifDesc || 'عروض وتحديثات النظام',
                },
                {
                  key: 'emailUpdates' as const,
                  label: t.profile?.emailUpdates || 'تقارير البريد',
                  desc: t.profile?.emailUpdatesDesc || 'تقارير أسبوعية وشهرية',
                },
              ].map((s, idx) => (
                <div key={s.key}>
                  {idx > 0 && <div className="border-border border-t" />}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-foreground text-sm font-medium">{s.label}</p>
                      <p className="text-muted-foreground text-[11px]">{s.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[s.key]}
                      onCheckedChange={v => setNotifSettings({ ...notifSettings, [s.key]: v })}
                    />
                  </div>
                </div>
              ))}
            </SettingsSectionCard>
          </div>
        )}

        {/* ═══ HELP TAB ═══ */}
        {activeTab === 'help' && (
          <div className="space-y-4">
            <SettingsSectionCard className="space-y-2">
              <SettingsSectionHeading>
                {t.profile?.contactUs || 'تواصل معنا'}
              </SettingsSectionHeading>
              <div className="space-y-2 pt-2">
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start gap-3"
                  onClick={() => window.open('https://wa.me/9647718599996', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    {t.profile?.whatsappSupport || 'واتساب — الدعم الفني'}
                  </span>
                  <ExternalLink className="text-muted-foreground mr-auto h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full justify-start gap-3"
                  onClick={() => window.open('tel:+9647718599996')}
                >
                  <BsTelephone className="text-primary h-4 w-4" />
                  <span dir="rtl" className="text-right text-sm">
                    0771-859-9996 — الدعم الفني
                  </span>
                  <ExternalLink className="text-muted-foreground mr-auto h-3 w-3" />
                </Button>
              </div>
            </SettingsSectionCard>

            <SettingsSectionCard className="space-y-3">
              <SettingsSectionHeading icon={HelpCircle}>
                {t.profile?.commonQuestions || 'الأسئلة الشائعة'}
              </SettingsSectionHeading>
              <div className="divide-border divide-y">
                {FAQS.map(faq => (
                  <div key={faq.q} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-foreground text-sm font-medium">{faq.q}</p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </SettingsSectionCard>
          </div>
        )}
      </div>
    </section>
  );
}
