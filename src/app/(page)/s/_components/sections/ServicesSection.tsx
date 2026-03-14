import Image from 'next/image';
import { ExternalLink, PenTool, Shapes } from 'lucide-react';
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

                      const viewMode = work.showTitle ?? 'IMAGE';
                      const WorkIcon = getIconComponent(work.icon ?? '');
                      const hasImage = !!work.image;
                      const hasIcon = !!work.icon?.trim() && viewMode === 'ICON';

                      return (
                        <Wrapper
                          key={work.id}
                          {...(wrapperProps as Record<string, string>)}
                          className="group block"
                        >
                          <div className="border-border bg-card overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                            <div
                              className="relative aspect-[4/3] overflow-hidden"
                              style={{
                                background:
                                  viewMode === 'ICON' || !hasImage
                                    ? `linear-gradient(135deg, ${colors.primary}16, ${colors.accent}12)`
                                    : undefined,
                              }}
                            >
                              {viewMode === 'IMAGE' && hasImage ? (
                                <>
                                  <Image
                                    src={work.image!}
                                    alt={work.title || 'work image'}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                                  />

                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                </>
                              ) : hasIcon ? (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div
                                    className="flex h-20 w-20 items-center justify-center rounded-3xl border backdrop-blur-sm"
                                    style={{
                                      backgroundColor: 'rgba(255,255,255,0.65)',
                                      borderColor: `${colors.primary}25`,
                                    }}
                                  >
                                    <WorkIcon
                                      className="h-10 w-10"
                                      style={{ color: colors.primary }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <div
                                    className="flex h-20 w-20 items-center justify-center rounded-3xl border backdrop-blur-sm"
                                    style={{
                                      backgroundColor: 'rgba(255,255,255,0.55)',
                                      borderColor: `${colors.primary}20`,
                                    }}
                                  >
                                    {viewMode === 'ICON' ? (
                                      <Shapes
                                        className="h-9 w-9"
                                        style={{ color: `${colors.text}55` }}
                                      />
                                    ) : (
                                      <PenTool
                                        className="h-9 w-9"
                                        style={{ color: `${colors.text}55` }}
                                      />
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/45 group-hover:opacity-100">
                                <div className="text-center">
                                  <ExternalLink className="mx-auto mb-1.5 h-5 w-5 text-white" />
                                  <p className="text-[10px] font-bold text-white">
                                    {work.link ? 'فتح الرابط' : 'عرض المشروع'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-foreground truncate text-xs font-bold sm:text-sm">
                                    {work.title || 'بدون عنوان'}
                                  </h4>

                                  {work.category ? (
                                    <p className="text-muted-foreground mt-1 truncate text-[10px] sm:text-xs">
                                      {work.category}
                                    </p>
                                  ) : null}
                                </div>

                                {viewMode === 'ICON' && hasIcon ? (
                                  <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                                    style={{ backgroundColor: `${colors.primary}12` }}
                                  >
                                    <WorkIcon
                                      className="h-4 w-4"
                                      style={{ color: colors.primary }}
                                    />
                                  </div>
                                ) : null}
                              </div>
                            </div>
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
