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
    .filter(service => service.enabled !== false)
    .sort((a, b) => a.order - b.order);
  const works = flattenWorks(services);

  if (enabledServices.length === 0 && (!showWorksSection || works.length === 0)) return null;

  return (
    <>
      {enabledServices.length > 0 ? (
        <section
          id="services-section"
          className="py-16 sm:py-20"
          style={{ backgroundColor: `${colors.primary}06` }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            {/* DESIGN: The service block mirrors the source storefront with a pill label, centered heading, and compact rounded cards. */}
            <div className="mb-10 text-center">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
              >
                خدماتنا
              </span>
              <h2
                className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl"
                style={{ fontFamily: fonts.heading }}
              >
                ماذا نقدم لك؟
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs text-gray-600 sm:text-sm">
                حلول شاملة تغطي جميع احتياجات متجرك بنفس روح الواجهة المرجعية.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {enabledServices.map(service => {
                const Icon = getIconComponent(service.icon || 'Sparkles');
                const description = service.desc || service.description || service.worksDesc || '';

                return (
                  <article
                    key={service.id}
                    className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-4 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                  >
                    <div
                      className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors"
                      style={{ backgroundColor: `${colors.primary}15` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: colors.primary }} />
                    </div>
                    <h3
                      className="mb-1 text-xs font-bold text-gray-900 sm:text-sm"
                      style={{ fontFamily: fonts.heading }}
                    >
                      {service.title}
                    </h3>
                    {description ? (
                      <p className="text-[10px] leading-relaxed text-gray-500 sm:text-xs">
                        {description}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {showWorksSection && works.length > 0 ? (
        <section id="works-section" className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-10 text-center">
              <span
                className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold"
                style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
              >
                معرض الأعمال
              </span>
              <h2
                className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl"
                style={{ fontFamily: fonts.heading }}
              >
                أعمال نفتخر بها
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {works.map(work => {
                const Icon = work.icon ? getIconComponent(work.icon) : PenTool;
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
                      {work.displayType === 'IMAGE' && work.image ? (
                        <img
                          src={work.image}
                          alt={work.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Icon className="h-8 w-8 text-gray-400/40" />
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
                      <p className="text-[10px] text-gray-500">
                        {work.category || work.serviceTitle}
                      </p>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
