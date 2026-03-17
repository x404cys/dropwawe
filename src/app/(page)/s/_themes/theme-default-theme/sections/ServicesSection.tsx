// THEME: default-theme - ServicesSection

'use client';

import { ExternalLink, PenTool } from 'lucide-react';
import type { ServicesSectionProps, StorefrontWork } from '../../../_lib/types';
import { getIconComponent } from '../../../_utils/icons';

function flattenWorks(services: ServicesSectionProps['services']) {
  return services
    .filter(service => service.enabled !== false)
    .flatMap(service =>
      service.works.map(work => ({
        ...work,
        serviceTitle: service.title,
      }))
    )
    .sort((a, b) => a.order - b.order) as Array<StorefrontWork & { serviceTitle: string }>;
}
export default function DefaultThemeServicesSection({
  services,
  colors,
  fonts,
  showWorksSection,
}: ServicesSectionProps) {
  const enabledServices = services
    .filter(s => s.enabled !== false)
    .sort((a, b) => a.order - b.order);

  if (enabledServices.length === 0) return null;

  return (
    <>
      {enabledServices.map(service => {
        const works = (service.works ?? []).sort((a, b) => a.order - b.order);
        // const Icon = getIconComponent(service.icon || 'Sparkles');

        return (
          <div key={service.id}>
            <section
              id={`service-${service.id}`}
              className="py-16 sm:py-20"
              style={{ backgroundColor: `${colors.primary}06` }}
            >
              <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <div className="mb-8 flex items-center gap-4">
                  <div>
                    <h2
                      className="text-xl font-bold sm:text-2xl"
                      style={{ color: colors.text, fontFamily: fonts.heading }}
                    >
                      {service.title}
                    </h2>
                    {service.desc && (
                      <p className="mt-1 text-sm" style={{ color: `${colors.text}88` }}>
                        {service.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ── أعمال هذه الخدمة ── */}
            {showWorksSection && works.length > 0 && (
              <section className="py-10 sm:py-14">
                <div className="mx-auto max-w-5xl px-4 sm:px-6">
                  {/* عنوان الأعمال — خاص بكل خدمة */}
                  {(service.worksTitle || service.worksDesc) && (
                    <div className="mb-8 text-center">
                      {service.worksTitle && (
                        <h3
                          className="text-lg font-bold sm:text-xl"
                          style={{ color: colors.text, fontFamily: fonts.heading }}
                        >
                          {service.worksTitle}
                        </h3>
                      )}
                      {service.worksDesc && (
                        <p className="mt-2 text-sm" style={{ color: `${colors.text}88` }}>
                          {service.worksDesc}
                        </p>
                      )}
                    </div>
                  )}

                  {/* grid الأعمال */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {works.map(work => {
                      const Wrapper = work.link ? 'a' : 'div';
                      return (
                        <Wrapper
                          key={work.id}
                          {...(work.link
                            ? { href: work.link, target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="group block cursor-pointer"
                        >
                          <div
                            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200"
                            style={{
                              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}15)`,
                            }}
                          >
                            {work.image ? (
                              <img
                                src={work.image}
                                alt={work.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <PenTool className="h-8 w-8 text-gray-400/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100">
                              <div className="text-center text-white">
                                <ExternalLink className="mx-auto mb-1.5 h-5 w-5" />
                                <p className="text-[10px] font-bold">
                                  {work.link ? 'فتح الرابط' : 'عرض المشروع'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2.5 px-1">
                            <h3 className="text-xs font-bold text-gray-900">{work.title}</h3>
                            <p className="text-[10px] text-gray-500">{work.category}</p>
                          </div>
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </div>
        );
      })}
    </>
  );
}
