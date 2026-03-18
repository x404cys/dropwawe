// THEME: tech-futuristic - ServicesSection

'use client';

import { ExternalLink, PenTool } from 'lucide-react';
import type { ServicesSectionProps, StorefrontWork } from '../../../_lib/types';
import { useLanguage } from '../../../_context/LanguageContext';
import { getIconComponent } from '../../../_utils/icons';

export default function TechFuturisticServicesSection({
  services,
  colors,
  fonts,
  showWorksSection,
}: ServicesSectionProps) {
  const { t } = useLanguage();

  const enabledServices = services
    .filter(s => s.enabled !== false)
    .sort((a, b) => a.order - b.order);

  if (enabledServices.length === 0) return null;

  return (
    <section
      id="services-section"
      className="border-b"
      style={{ background: colors.bg, borderColor: colors.text }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 lg:py-24">
        <div className="mt-8 flex flex-col gap-16">
          {enabledServices.map(service => {
            const works = (service.works ?? []).sort((a, b) => a.order - b.order);
            const description = service.desc || service.description || '';

            return (
              <div key={service.id} id={`service-${service.id}`}>
                <div
                  className="flex items-start gap-4 border-b pb-6"
                  style={{
                    borderColor: colors.text + '0f',
                    background: colors.text + '04',
                    padding: '20px',
                  }}
                >
                  <div>
                    <h2
                      className="font-mono text-sm font-light tracking-tight"
                      style={{ fontFamily: fonts.heading, color: colors.text }}
                    >
                      {service.title}
                    </h2>
                    {description && (
                      <p
                        className="mt-1 font-mono text-xs leading-6"
                        style={{ fontFamily: fonts.body, color: colors.text + '66' }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                </div>

                {showWorksSection && works.length > 0 && (
                  <div className="mt-6">
                    {(service.worksTitle || service.worksDesc) && (
                      <div className="mb-6">
                        {service.worksTitle && (
                          <h3
                            className="font-mono text-xs tracking-[0.2em] uppercase"
                            style={{ fontFamily: fonts.heading, color: colors.text + '8c' }}
                          >
                            {service.worksTitle}
                          </h3>
                        )}
                        {service.worksDesc && (
                          <p
                            className="mt-1 font-mono text-xs leading-6"
                            style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
                          >
                            {service.worksDesc}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
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
                            <div
                              className="relative aspect-[4/3] overflow-hidden"
                              style={{
                                background: colors.text + '08',
                                border: `0.5px solid ${colors.text + '14'}`,
                              }}
                            >
                              {work.image ? (
                                <img
                                  src={work.image}
                                  alt={work.title}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <PenTool
                                    className="h-6 w-6"
                                    style={{ color: colors.text + '26' }}
                                  />
                                </div>
                              )}

                              <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-200 group-hover:opacity-100"
                                style={{ background: colors.bg + 'cc' }}
                              >
                                <div className="text-center">
                                  <ExternalLink
                                    className="mx-auto mb-1.5 h-4 w-4"
                                    style={{ color: colors.accent }}
                                  />
                                  <p
                                    className="font-mono text-[10px] tracking-[0.16em] uppercase"
                                    style={{ fontFamily: fonts.body, color: colors.accent }}
                                  >
                                    {work.link ? 'فتح' : 'عرض'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div
                              className="border-x border-b px-3 py-2"
                              style={{ borderColor: colors.text + '14' }}
                            >
                              <h3
                                className="font-mono text-xs font-light"
                                style={{ fontFamily: fonts.heading, color: colors.text }}
                              >
                                {work.title}
                              </h3>
                              {work.category && (
                                <p
                                  className="mt-0.5 font-mono text-[10px] tracking-[0.16em] uppercase"
                                  style={{ fontFamily: fonts.body, color: colors.text + '4d' }}
                                >
                                  {work.category}
                                </p>
                              )}
                            </div>
                          </Wrapper>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
