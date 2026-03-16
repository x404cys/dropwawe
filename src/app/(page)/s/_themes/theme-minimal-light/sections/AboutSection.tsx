// THEME: minimal-light — AboutSection

'use client';

import Image from 'next/image';
import type { AboutSectionProps } from '../../../_lib/types';
import { buildContactItems, getContactHref, isExternalContact } from '../../../_utils/contacts';
import { useLanguage } from '../../../_context/LanguageContext';

export default function MinimalLightAboutSection({
  template,
  store,
  colors,
  fonts,
}: AboutSectionProps) {
  const { t } = useLanguage();
  const aboutText =
    template.aboutText?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';
  const contactItems = buildContactItems(template, store).filter(
    item => item.enabled && item.value.trim().length > 0
  );

  if (!aboutText) return null;

  return (
    <section id="about-section" className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p
              className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              {t.about.badge}
            </p>
            <h2
              className="mt-4 text-4xl font-medium tracking-tight text-stone-900 lg:text-5xl"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name}
            </h2>
          </div>

          <div className="space-y-8 lg:col-span-8">
            <p
              className="max-w-3xl text-base leading-8 text-stone-600"
              style={{ fontFamily: fonts.body }}
            >
              {aboutText}
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              {store.image ? (
                <div className="relative aspect-[4/3] overflow-hidden border border-stone-200 bg-stone-100">
                  <Image
                    src={store.image}
                    alt={store.name || t.about.heading}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null}

              <div className="space-y-4 border border-stone-200 bg-stone-50 p-6">
                <p
                  className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {t.about.contactTitle}
                </p>

                {contactItems.map(item => {
                  const href = getContactHref(item);
                  if (!href) {
                    return (
                      <div
                        key={item.id}
                        className="text-sm text-stone-700"
                        style={{ fontFamily: fonts.body }}
                      >
                        {item.value}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.id}
                      href={href}
                      target={isExternalContact(item.type) ? '_blank' : undefined}
                      rel={isExternalContact(item.type) ? 'noopener noreferrer' : undefined}
                      className="block text-sm text-stone-700 transition-colors duration-200 hover:text-stone-950"
                      style={{
                        fontFamily: fonts.body,
                        color: item.type === 'custom' ? colors.accent : undefined,
                      }}
                    >
                      {item.value}
                    </a>
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
