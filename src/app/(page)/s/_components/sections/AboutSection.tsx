'use client';

import Image from 'next/image';
import { ActiveColors, StorefrontStore, StorefrontTemplate } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';

interface AboutSectionProps {
  template: StorefrontTemplate;
  store: StorefrontStore;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function AboutSection({ template, store, colors, headingStyle }: AboutSectionProps) {
  const { t } = useLanguage();
  const aboutText =
    template.aboutText?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';

  if (!aboutText) return null;

  return (
    <section id="about-section" className="border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p
              className="text-xs font-light tracking-[0.32em] uppercase opacity-40"
              style={{ color: colors.text }}
            >
              {t.about.badge}
            </p>

            <h2
              // REDESIGN: about section shifts to a sparse two-column editorial composition.
              className="mt-6 text-4xl font-thin tracking-tight lg:text-6xl"
              style={{ ...headingStyle, color: colors.text }}
            >
              {store.name}
            </h2>
          </div>

          <div className="space-y-8 lg:col-span-8">
            <p
              className="max-w-3xl text-base leading-relaxed font-light opacity-70 lg:text-lg"
              style={{ color: colors.text }}
            >
              {aboutText}
            </p>

            {store.image ? (
              <div className="relative aspect-[16/9] overflow-hidden border border-white/10">
                <Image
                  // REDESIGN: optional store imagery is shown as a full-bleed editorial frame.
                  src={store.image}
                  alt={store.name || t.about.heading}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
