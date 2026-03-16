// THEME: clean-marketplace - ServicesSection

'use client';

import type { ServicesSectionProps } from '../../../_lib/types';
import { getIconComponent } from '../../../_utils/icons';

export default function CleanMarketplaceServicesSection({
  services,
  colors,
  fonts,
}: ServicesSectionProps) {
  const enabledServices = services.filter(service => service.enabled !== false);

  if (enabledServices.length === 0) return null;

  return (
    <section id="services-section" className="bg-white px-4 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* DESIGN: Service cards act like marketplace assurances such as delivery or support rather than portfolio modules. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enabledServices.map(service => {
            const Icon = getIconComponent(service.icon || 'Sparkles');
            const description = service.desc || service.description || service.worksDesc || '';

            return (
              <article
                key={service.id}
                className="rounded-xl border border-gray-100 bg-white p-4 transition-shadow duration-200 ease-in-out hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50">
                  <Icon className="h-5 w-5" style={{ color: colors.accent }} />
                </div>
                <h3
                  className="mt-4 text-sm font-semibold text-gray-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {service.title}
                </h3>
                {description ? (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
