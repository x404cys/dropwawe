// Purpose: CTA section - Client Component.
// Centered card with title, desc, primary button, WhatsApp button.

'use client';

import { MessageCircle } from 'lucide-react';
import { ActiveColors, StorefrontStore, StorefrontTemplate } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import { buildContactItems } from '../../_utils/contacts';

interface CtaSectionProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function CtaSection({ template, store, colors, headingStyle }: CtaSectionProps) {
  const { t } = useLanguage();
  const whatsappItem = buildContactItems(template, store).find(
    (item) => item.type === 'whatsapp' && item.enabled && item.value.trim().length > 0
  );
  const waNumber = whatsappItem?.value.replace(/\s+/g, '') ?? '';

  return (
    <section id="cta-section" className="py-16 sm:py-20" style={{ backgroundColor: `${colors.primary}08` }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-lg mx-auto">
          <h2
            className="text-xl sm:text-2xl font-bold mb-3"
            style={{ ...headingStyle, color: colors.text }}
          >
            {template.ctaTitle}
          </h2>
          <p className="text-xs sm:text-sm mb-6" style={{ color: `${colors.text}88` }}>
            {template.ctaDesc}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#store-section"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg text-center"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 10px 25px -5px ${colors.primary}30`,
              }}
            >
              {template.ctaButton}
            </a>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-card border border-border text-foreground flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" /> {t.cta.whatsapp}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
