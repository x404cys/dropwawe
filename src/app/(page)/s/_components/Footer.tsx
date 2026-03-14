'use client';

import { Sparkles } from 'lucide-react';

import { ActiveColors, StorefrontStore, StorefrontTemplate } from '../_lib/types';
import { useLanguage } from '../_context/LanguageContext';
import { buildContactItems, getContactHref, getContactIcon, isExternalContact } from '../_utils/contacts';

interface FooterProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
}

export default function Footer({ store, template, colors }: FooterProps) {
  const { t, locale } = useLanguage();
  const templateLogo = (template as unknown as { logoImage?: string | null }).logoImage ?? null;
  const logoSrc = templateLogo || store.image;
  const contactItems = buildContactItems(template, store).filter(
    (item) => item.enabled && item.value.trim().length > 0
  );
  const year = new Date().getFullYear().toLocaleString(locale);

  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {logoSrc ? (
              <img src={logoSrc} alt={store.name ?? ''} className="w-7 h-7 rounded-lg object-cover" />
            ) : (
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <span className="text-xs font-bold text-foreground">{store.name}</span>
          </div>

          <div className="flex items-center gap-4">
            {contactItems.map((item) => {
              const Icon = getContactIcon(item.type);
              const href = getContactHref(item);
              const isExternal = isExternalContact(item.type);
              if (!href) return null;
              return (
                <a
                  key={item.id}
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <p className="text-[10px] text-muted-foreground">
            {t.footer.poweredBy}{' '}
            <span className="font-bold" style={{ color: colors.primary }}>
              Matager
            </span>{' '}
            • © {year}
          </p>
        </div>
      </div>
    </footer>
  );
}
