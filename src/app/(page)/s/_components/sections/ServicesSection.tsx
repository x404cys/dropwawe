import Image from 'next/image';
import { ExternalLink, PenTool } from 'lucide-react';
import { ActiveColors, StorefrontService } from '../../_lib/types';
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
  const enabledServices = services.filter(service => service.enabled !== false);

  return (
    <section
      id="services-section"
      className="py-16 sm:py-20"
      style={{ backgroundColor: `${colors.primary}06` }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-semibold"
            style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
          >
            خدماتنا
          </span>
          <h2
            className="mt-4 text-xl font-bold sm:text-2xl"
            style={{ ...headingStyle, color: colors.text }}
          >
            ماذا نقدم لك؟
          </h2>
          <p
            className="mx-auto mt-2 max-w-md text-xs sm:text-sm"
            style={{ color: `${colors.text}88` }}
          >
            حلول شاملة تغطي جميع احتياجاتك
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {enabledServices.map((service, i) => {
            const SIcon = getIconComponent(service.icon);

            return (
              <div
                key={`${service.id}-${i}`}
                className="group border-border bg-card cursor-pointer rounded-2xl border p-4 text-center transition-all hover:shadow-md sm:p-5"
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <SIcon className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-foreground mb-1 text-xs font-bold sm:text-sm">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-[10px] leading-relaxed sm:text-xs">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>

        {showWorksSection && enabledServices.some(service => (service.works ?? []).length > 0) && (
          <div className="mt-16 space-y-14">
            {enabledServices.map(service => {
              const works = (service.works ?? []).filter(Boolean);

              if (works.length === 0) return null;

              return (
                <div key={`works-${service.id}`} className="space-y-6">
                  <div className="text-center">
                    <span
                      className="rounded-full px-3 py-1 text-[11px] font-semibold"
                      style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
                    >
                      {service.title}
                    </span>

                    <h3
                      className="mt-4 text-lg font-bold sm:text-xl"
                      style={{ ...headingStyle, color: colors.text }}
                    >
                      {service.worksTitle || `أعمال ${service.title}`}
                    </h3>

                    {service.worksDesc ? (
                      <p
                        className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm"
                        style={{ color: `${colors.text}88` }}
                      >
                        {service.worksDesc}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                    {works.map(work => {
                      const Wrapper = work.link ? 'a' : 'div';
                      const wrapperProps = work.link
                        ? {
                            href: work.link,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          }
                        : {};

                      return (
                        <Wrapper
                          key={work.id}
                          {...(wrapperProps as Record<string, string>)}
                          className="group block cursor-pointer"
                        >
                          <div
                            className="border-border relative aspect-[4/3] overflow-hidden rounded-2xl border"
                            style={
                              !work.image
                                ? {
                                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}15)`,
                                  }
                                : undefined
                            }
                          >
                            {work.image ? (
                              <Image
                                src={work.image}
                                alt={work.title || 'work image'}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <PenTool className="text-muted-foreground/20 h-8 w-8" />
                              </div>
                            )}

                            <div className="bg-foreground/0 group-hover:bg-foreground/60 absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                              <div className="text-center">
                                <ExternalLink className="text-background mx-auto mb-1.5 h-5 w-5" />
                                <p className="text-background text-[10px] font-bold">
                                  {work.link ? 'فتح الرابط' : 'عرض المشروع'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-2.5 px-1">
                            <h4 className="text-foreground text-xs font-bold">{work.title}</h4>
                            <p className="text-muted-foreground text-[10px]">{work.category}</p>
                          </div>
                        </Wrapper>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
