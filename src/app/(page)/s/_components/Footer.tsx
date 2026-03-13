import { Globe, Instagram, MessageCircle, Sparkles } from 'lucide-react';

import { ActiveColors, StorefrontStore, StorefrontTemplate } from '../_lib/types';

interface FooterProps {
  store: StorefrontStore;
  template: StorefrontTemplate;
  colors: ActiveColors;
}

export default function Footer({ store, template, colors }: FooterProps) {
  const templateLogo = (template as unknown as { logoImage?: string | null }).logoImage ?? null;
  const logoSrc = templateLogo || store.image;
  const contactInstagram =
    (template as unknown as { contactInstagram?: string | null }).contactInstagram ?? store.instaLink;
  const contactPhone =
    (template as unknown as { contactPhone?: string | null }).contactPhone ?? store.phone;

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
            {contactInstagram && (
              <Instagram className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            )}
            {template.contactWebsite && (
              <Globe className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            )}
            {(template.whatsappNumber || contactPhone) && (
              <MessageCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
            )}
          </div>

          <p className="text-[10px] text-muted-foreground">
            مدعوم من{' '}
            <span className="font-bold" style={{ color: colors.primary }}>
              Matager
            </span>{' '}
            • © ٢٠٢٦
          </p>
        </div>
      </div>
    </footer>
  );
}
