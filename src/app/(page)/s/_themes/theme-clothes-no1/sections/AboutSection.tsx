// THEME: tech-futuristic - AboutSection

'use client';

import type { AboutSectionProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';

export default function TechFuturisticAboutSection({
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

  if (!aboutText) return null;

  return (
    <section id="about-section" className="border-b border-white/[0.06] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[40%_60%] lg:gap-16">
          <div className="border-b border-white/[0.06] pb-8 lg:border-e lg:border-b-0 lg:pe-10 lg:pb-0">
            <div
              className="font-mono text-[6rem] leading-none font-thin text-white/5 lg:text-[8rem]"
              style={{ fontFamily: fonts.heading }}
            >
              <div>0</div>
              <div>2</div>
            </div>
            <p
              className="mt-6 font-mono text-xs tracking-[0.24em] text-white/30 uppercase"
              style={{ fontFamily: fonts.body }}
            >
              {t.about.badge}
            </p>
          </div>

          <div>
            <h2
              className="font-mono text-3xl font-light tracking-tight text-[#f2f2f2] lg:text-4xl"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name || t.about.heading}
            </h2>
            <div className="mt-6 h-px w-16" style={{ backgroundColor: colors.accent }} />
            <p
              className="mt-6 max-w-3xl font-mono text-sm leading-8 text-white/45"
              style={{ fontFamily: fonts.body }}
            >
              {aboutText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
