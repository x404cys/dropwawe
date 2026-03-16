// THEME: glassmorphism — ServicesSection

'use client';

import Image from 'next/image';
import type { ServicesSectionProps } from '../../../_lib/types';
import { getIconComponent } from '../../../_utils/icons';

export default function GlassmorphismServicesSection({
  services,
  colors,
  fonts,
  showWorksSection = true,
}: ServicesSectionProps) {
  const enabledServices = [...services]
    .filter(service => service.enabled)
    .sort((a, b) => a.order - b.order);
  const hasWorks = showWorksSection && enabledServices.some(service => service.works.length > 0);

  if (enabledServices.length === 0) return null;

  return (
    <section
      id="services-section"
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.primary}10 0%, transparent 60%), ${colors.bg}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {hasWorks ? <div id="works-section" className="absolute -top-16" /> : null}

        {/* DESIGN: Service cards stay lightweight, but nested works still inherit the same translucent framing so detail doesn't break cohesion. */}
        <div className="grid gap-4 lg:grid-cols-3">
          {enabledServices.map(service => {
            const Icon = getIconComponent(service.icon || 'Sparkles');
            return (
              <article
                key={service.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-200 ease-in-out hover:border-white/[0.14]"
                style={{ boxShadow: `0 0 24px ${colors.accent}15` }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]"
                  style={{
                    borderColor: `${colors.accent}40`,
                    boxShadow: `0 0 12px ${colors.accent}40`,
                  }}
                >
                  <Icon className="h-4 w-4" style={{ color: colors.accent }} />
                </div>
                <h3
                  className="text-base font-medium text-white/85"
                  style={{ fontFamily: fonts.heading }}
                >
                  {service.title}
                </h3>
                {service.desc || service.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-white/45">
                    {service.desc || service.description}
                  </p>
                ) : null}

                {showWorksSection && service.works.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {service.works.slice(0, 4).map(work => {
                      const WorkIcon = work.icon ? getIconComponent(work.icon) : Icon;
                      const Wrapper = work.link ? 'a' : 'div';

                      return (
                        <Wrapper
                          key={work.id}
                          {...(work.link
                            ? { href: work.link, target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]"
                        >
                          {work.displayType === 'IMAGE' && work.image ? (
                            <div className="relative aspect-square">
                              <Image
                                src={work.image}
                                alt={work.title || service.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-square items-center justify-center text-white/60">
                              <WorkIcon className="h-5 w-5" />
                            </div>
                          )}
                        </Wrapper>
                      );
                    })}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
