// THEME: tech-futuristic - ServicesSection

'use client';

import type { ServicesSectionProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { getIconComponent } from '../../../_utils/icons';

export default function TechFuturisticServicesSection({
  services,
  colors,
  fonts,
}: ServicesSectionProps) {
  const { t } = useLanguage();
  const enabledServices = services.filter(service => service.enabled !== false);

  if (enabledServices.length === 0) return null;

  return (
    <section id="services-section" className="border-b border-white/[0.06] bg-[#080808]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="border-b border-white/[0.06] pb-6">
          <p
            className="font-mono text-xs tracking-[0.24em] text-white/30 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {t.nav.services}
          </p>
        </div>

        {/* DESIGN: Service modules are treated like productized capabilities, not marketing feature boxes. */}
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enabledServices.map(service => {
            const Icon = getIconComponent(service.icon || 'Sparkles');
            const description = service.desc || service.description || service.worksDesc || '';
            const worksCount = service.works?.length ?? 0;

            return (
              <article
                key={service.id}
                className="border border-white/[0.06] bg-[#0f0f0f] p-6 transition-all duration-150 ease-out hover:border-white/[0.15] hover:bg-[#141414]"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center border"
                  style={{ borderColor: colors.accent }}
                >
                  <Icon className="h-4 w-4" style={{ color: colors.accent }} />
                </div>

                <h3
                  className="mt-4 font-mono text-sm font-light tracking-tight text-[#f2f2f2]"
                  style={{ fontFamily: fonts.heading }}
                >
                  {service.title}
                </h3>

                {description ? (
                  <p
                    className="mt-2 font-mono text-xs leading-6 text-white/40"
                    style={{ fontFamily: fonts.body }}
                  >
                    {description}
                  </p>
                ) : null}

                <p
                  className="mt-4 font-mono text-xs tracking-[0.2em] text-white/20 uppercase"
                  style={{ fontFamily: fonts.body }}
                >
                  {worksCount} ITEMS
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
