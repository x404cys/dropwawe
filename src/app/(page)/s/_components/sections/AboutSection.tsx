// Purpose: About section - Client Component.
// Two-column layout: story + features grid | contact info card.

'use client';

import { Award } from 'lucide-react';
import { ActiveColors, StorefrontStore, StorefrontTemplate } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import {
  buildContactItems,
  getContactHref,
  getContactIcon,
  isExternalContact,
} from '../../_utils/contacts';

interface AboutSectionProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function AboutSection({ template, store, colors, headingStyle }: AboutSectionProps) {
  const { t } = useLanguage();
  // Parse aboutFeatures with fallback matching reference defaults.
  let aboutFeatures: string[] = [];
  try {
    const raw = (template as unknown as Record<string, unknown>).aboutFeatures;
    if (Array.isArray(raw)) aboutFeatures = raw as string[];
  } catch {
    /* ignore */
  }
  aboutFeatures = aboutFeatures.filter(Boolean);
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );

  return (
    <section id="about-section" className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="items-start gap-10 sm:flex">
          {/* Left column */}
          <div className="mb-8 flex-1 sm:mb-0">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
            >
              {t.about.badge}
            </span>
            <h2
              className="mt-4 mb-3 text-xl font-bold sm:text-2xl"
              style={{ ...headingStyle, color: colors.text }}
            >
              {t.about.heading}
            </h2>
            <p
              className="mb-4 text-xs leading-relaxed sm:text-sm"
              style={{ color: `${colors.text}99` }}
            >
              {template.aboutText}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {aboutFeatures.map(f => (
                <div key={f} className="bg-card border-border rounded-xl border p-3 text-center">
                  <Award className="mx-auto mb-1.5 h-4 w-4" style={{ color: colors.primary }} />
                  <p className="text-foreground text-[9px] font-bold sm:text-[10px]">{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - contact card */}
          <div className="flex-1">
            <div className="bg-card border-border rounded-2xl border p-5 sm:p-6">
              <h3 className="text-foreground mb-4 text-sm font-bold" style={headingStyle}>
                {t.about.contactTitle}
              </h3>
              <div className="space-y-3">
                {contactItems.map(item => {
                  const Icon = getContactIcon(item.type);
                  const href = getContactHref(item);
                  const value =
                    item.type === 'custom' && item.label
                      ? `${item.label}: ${item.value}`
                      : item.value;
                  const isExternal = isExternalContact(item.type);
                  const content = (
                    <span className="text-muted-foreground text-xs" dir="ltr">
                      {value}
                    </span>
                  );

                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${colors.primary}15` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color: colors.primary }} />
                      </div>
                      {href ? (
                        <a
                          href={href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
