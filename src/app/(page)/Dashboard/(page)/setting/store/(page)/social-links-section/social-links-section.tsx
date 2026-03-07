'use client';
import { useLanguage } from '../../../../../context/LanguageContext';

import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Send, AlertCircle } from 'lucide-react';

interface SocialLinksSectionProps {
  facebookLink: string;
  instaLink: string;
  telegram: string;
  fieldErrors: { [key: string]: string };
  onFacebookChange: (value: string) => void;
  onInstagramChange: (value: string) => void;
  onTelegramChange: (value: string) => void;
}

const socialConfig = [
  {
    key: 'facebookLink' as const,
    label: 'Facebook',
    icon: Facebook,
    color: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    placeholder: 'https://facebook.com/your-page',
  },
  {
    key: 'instaLink' as const,
    label: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    iconBg: 'bg-pink-500/10',
    placeholder: 'https://instagram.com/your-account',
  },
  {
    key: 'telegram' as const,
    label: 'Telegram',
    icon: Send,
    color: 'text-sky-500',
    iconBg: 'bg-sky-500/10',
    placeholder: 'https://t.me/your-channel',
  },
];

export default function SocialLinksSection({
  facebookLink,
  instaLink,
  telegram,
  fieldErrors,
  onFacebookChange,
  onInstagramChange,
  onTelegramChange,
}: SocialLinksSectionProps) {
  const { t } = useLanguage();

  const values = { facebookLink, instaLink, telegram };
  const handlers = {
    facebookLink: onFacebookChange,
    instaLink: onInstagramChange,
    telegram: onTelegramChange,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-1 border-b border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t.store?.socialLinksDesc || 'أضف روابط حساباتك لتظهر في صفحة متجرك وتعزز ثقة العملاء'}
        </p>
      </div>

      {socialConfig.map(({ key, label, icon: Icon, color, iconBg, placeholder }) => (
        <div key={key} className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium text-foreground">
            <span className={`flex h-6 w-6 items-center justify-center rounded-md ${iconBg}`}>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </span>
            {label}
          </label>
          <Input
            value={values[key]}
            onChange={e => handlers[key](e.target.value)}
            placeholder={placeholder}
            dir="ltr"
            className="h-10 text-sm text-left placeholder:text-muted-foreground/50"
          />
          {fieldErrors[key] && (
            <p className="text-[11px] text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {fieldErrors[key]}
            </p>
          )}
        </div>
      ))}

      {/* Tip */}
      <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 flex-shrink-0 mt-0.5">
          <span className="text-[10px] text-primary font-bold">!</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {t.store?.socialLinks
          ? t.store.socialLinks
          : 'الروابط الاجتماعية تزيد ثقة العملاء وتساعدهم على التواصل معك بشكل مباشر'}
        </p>
      </div>
    </div>
  );
}
