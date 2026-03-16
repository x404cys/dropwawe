// THEME: minimal-light — ServicesSection

'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import type { ServicesSectionProps } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { getIconComponent } from '../../../_utils/icons';

export default function MinimalLightServicesSection({
  services,
  colors,
  fonts,
  showWorksSection = true,
}: ServicesSectionProps) {
  const { t } = useLanguage();
  const enabledServices = services.filter(service => service.enabled !== false);

  if (enabledServices.length === 0) return null;

  return (
    <section id="services-section" className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <p
            className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase"
            style={{ fontFamily: fonts.body }}
          >
            {t.nav.services}
          </p>
          <h2
            className="mt-4 text-4xl font-medium tracking-tight text-stone-900 lg:text-5xl"
            style={{ fontFamily: fonts.heading }}
          >
            {t.nav.services}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200">
          {enabledServices.map(service => {
            const works = (service.works ?? []).filter(Boolean);

            return (
              <div key={service.id} className="grid gap-8 py-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h3
                    className="text-2xl font-medium tracking-tight text-stone-900"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {service.title}
                  </h3>
                  {service.desc || service.description ? (
                    <p
                      className="mt-4 text-sm leading-7 text-stone-600"
                      style={{ fontFamily: fonts.body }}
                    >
                      {service.desc || service.description}
                    </p>
                  ) : null}
                </div>

                <div className="lg:col-span-8">
                  {showWorksSection && works.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {works.map(work => {
                        const WorkIcon = work.icon ? getIconComponent(work.icon) : Package;
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
                            className="border border-stone-200 bg-stone-50"
                          >
                            <div className="relative aspect-square overflow-hidden bg-stone-100">
                              {work.displayType !== 'ICON' && work.image ? (
                                <Image
                                  src={work.image}
                                  alt={work.title || t.services.imageAlt}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <WorkIcon className="h-6 w-6 text-stone-400" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <p
                                className="text-xs font-medium tracking-[0.14em] text-stone-500 uppercase"
                                style={{ fontFamily: fonts.body }}
                              >
                                {work.category || service.title}
                              </p>
                              <p
                                className="mt-2 text-sm font-medium text-stone-900"
                                style={{ fontFamily: fonts.heading }}
                              >
                                {work.title || t.services.untitled}
                              </p>
                            </div>
                          </Wrapper>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border border-stone-200 bg-stone-50 p-6">
                      <p
                        className="text-sm leading-7 text-stone-600"
                        style={{ fontFamily: fonts.body }}
                      >
                        {service.worksDesc || service.description || service.desc || service.title}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
