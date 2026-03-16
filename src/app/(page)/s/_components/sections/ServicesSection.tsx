'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { ActiveColors, StorefrontService } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import { getIconComponent } from '../../_utils/icons';

interface ServicesSectionProps {
  services: StorefrontService[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
  showWorksSection?: boolean;
}

export default function ServicesSection({
  services,
  colors,
  headingStyle,
  showWorksSection = true,
}: ServicesSectionProps) {
  const { t } = useLanguage();
  const enabledServices = services.filter(service => service.enabled !== false);

  if (enabledServices.length === 0) return null;

  return (
    <section
      id="services-section"
      className="border-b border-white/5 bg-white/[0.02]"
      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p
              className="text-xs font-light tracking-[0.32em] uppercase opacity-40"
              style={{ color: colors.text }}
            >
              {t.nav.services}
            </p>
            <h2
              // REDESIGN: section heading uses thin display typography and more open spacing.
              className="mt-6 text-4xl font-thin tracking-tight lg:text-6xl"
              style={{ ...headingStyle, color: colors.text }}
            >
              {t.nav.services}
            </h2>
          </div>
        </div>

        <div className="space-y-20">
          {enabledServices.map(service => {
            const works = (service.works ?? []).filter(Boolean);

            return (
              <article key={service.id} className="border-t border-white/10 pt-10">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className="lg:col-span-4">
                    <p
                      className="text-[10px] font-light tracking-[0.3em] uppercase opacity-40"
                      style={{ color: colors.text }}
                    >
                      {service.name || service.title}
                    </p>
                    <h3
                      className="mt-4 text-3xl font-light tracking-tight lg:text-4xl"
                      style={{ ...headingStyle, color: colors.text }}
                    >
                      {service.title}
                    </h3>
                    {service.desc || service.description ? (
                      <p
                        className="mt-5 max-w-md text-sm leading-relaxed font-light opacity-70"
                        style={{ color: colors.text }}
                      >
                        {service.desc || service.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="lg:col-span-8">
                    {showWorksSection && works.length > 0 ? (
                      <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-3">
                        {works.map(work => {
                          const WorkIcon = work.icon ? getIconComponent(work.icon) : Package;
                          const hasImage = work.displayType !== 'ICON' && Boolean(work.image);
                          const Wrapper = work.link ? 'a' : 'div';

                          return (
                            <Wrapper
                              key={work.id}
                              {...(work.link
                                ? {
                                    href: work.link,
                                    target: '_blank',
                                    rel: 'noopener noreferrer',
                                  }
                                : {})}
                              className="group bg-white/[0.03]"
                            >
                              <div className="relative aspect-square overflow-hidden">
                                {hasImage && work.image ? (
                                  <Image
                                    // REDESIGN: works are presented as unrounded square visuals with minimal captions.
                                    src={work.image}
                                    alt={work.title || t.services.imageAlt}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center bg-white/[0.02]">
                                    <WorkIcon
                                      className="h-6 w-6 opacity-40"
                                      style={{ color: colors.text }}
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2 p-4">
                                <p
                                  className="text-[10px] font-light tracking-[0.28em] uppercase opacity-45"
                                  style={{ color: colors.text }}
                                >
                                  {work.category || service.title}
                                </p>
                                <p className="text-sm font-light" style={{ color: colors.text }}>
                                  {work.title || t.services.untitled}
                                </p>
                              </div>
                            </Wrapper>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-white/10 bg-white/[0.03] p-8">
                        <p
                          className="text-sm leading-relaxed font-light opacity-70"
                          style={{ color: colors.text }}
                        >
                          {service.worksDesc ||
                            service.description ||
                            service.desc ||
                            service.title}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
