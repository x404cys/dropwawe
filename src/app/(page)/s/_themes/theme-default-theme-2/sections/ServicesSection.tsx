'use client';

import { ExternalLink, PenTool } from 'lucide-react';

import type { ServicesSectionProps } from '../../../_lib/types';
import {
  storefrontContainerClass,
  storefrontSectionCompactClass,
  storefrontTitleClass,
} from '../themeSystem';

export default function DefaultThemeServicesSection({
  services,
  fonts,
  showWorksSection,
}: ServicesSectionProps) {
  const enabledServices = services
    .filter(service => service.enabled !== false)
    .sort((a, b) => a.order - b.order);

  if (enabledServices.length === 0) return null;

  return (
    <section id="services-section" className={storefrontSectionCompactClass}>
      <div className={`${storefrontContainerClass} space-y-16`}>
        {enabledServices.map((service, index) => {
          const works = (service.works ?? []).sort((a, b) => a.order - b.order);

          return (
            <div key={service.id} className="space-y-8">
              <div className="max-w-3xl space-y-3">
                {index === 0 ? (
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase"
                    style={{
                      backgroundColor: 'var(--store-primary-faint)',
                      color: 'var(--store-primary)',
                    }}
                  >
                    Services
                  </span>
                ) : null}

                <h2 className={storefrontTitleClass} style={{ fontFamily: fonts.heading }}>
                  {service.title}
                </h2>

                {service.desc ? (
                  <p
                    className="text-sm leading-7 sm:text-base sm:leading-8"
                    style={{ color: 'var(--store-text-muted)' }}
                  >
                    {service.desc}
                  </p>
                ) : null}
              </div>

              {showWorksSection && works.length > 0 ? (
                <div id={index === 0 ? 'works-section' : undefined} className="space-y-6">
                  {(service.worksTitle || service.worksDesc) && (
                    <div className="space-y-2">
                      {service.worksTitle ? (
                        <h3
                          className="text-xl font-bold tracking-[-0.02em] sm:text-2xl"
                          style={{ fontFamily: fonts.heading }}
                        >
                          {service.worksTitle}
                        </h3>
                      ) : null}
                      {service.worksDesc ? (
                        <p
                          className="text-sm leading-7"
                          style={{ color: 'var(--store-text-muted)' }}
                        >
                          {service.worksDesc}
                        </p>
                      ) : null}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {works.map(work => {
                      const Wrapper = work.link ? 'a' : 'div';

                      return (
                        <Wrapper
                          key={work.id}
                          {...(work.link
                            ? { href: work.link, target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="group block"
                        >
                          <div className="space-y-4">
                            <div
                              className="relative aspect-[4/3] overflow-hidden rounded-xl"
                              style={{ backgroundColor: 'var(--store-surface)' }}
                            >
                              {work.image ? (
                                <img
                                  src={work.image}
                                  alt={work.title}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                              ) : (
                                <div
                                  className="flex h-full items-center justify-center"
                                  style={{ color: 'var(--store-text-faint)' }}
                                >
                                  <PenTool className="h-8 w-8" />
                                </div>
                              )}

                              {work.link ? (
                                <div className="absolute inset-x-4 bottom-4 flex justify-end">
                                  <span
                                    className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium"
                                    style={{
                                      backgroundColor: 'rgba(255,255,255,0.88)',
                                      color: 'var(--store-text)',
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    فتح
                                  </span>
                                </div>
                              ) : null}
                            </div>

                            <div className="space-y-1">
                              <h3
                                className="text-base font-bold tracking-[-0.02em]"
                                style={{ fontFamily: fonts.heading }}
                              >
                                {work.title}
                              </h3>
                              {work.category ? (
                                <p className="text-sm" style={{ color: 'var(--store-text-muted)' }}>
                                  {work.category}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
