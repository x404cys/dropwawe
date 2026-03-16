// THEME: modern-structured — ServicesSection

'use client';

import type { ServicesSectionProps } from '../../../_lib/types';
import { getIconComponent } from '../../../_utils/icons';

export default function ModernStructuredServicesSection({ services, fonts }: ServicesSectionProps) {
  const enabledServices = services.filter(service => service.enabled !== false);

  if (enabledServices.length === 0) return null;

  return (
    <section id="services-section" className="bg-white">
      <div className="mx-auto max-w-6xl border-t border-gray-200 px-6 py-20 lg:px-8">
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">Services</p>
        <h2
          className="mt-3 text-2xl font-semibold tracking-tight text-slate-900"
          style={{ fontFamily: fonts.heading }}
        >
          What the store offers
        </h2>

        {/* DESIGN: Service cards mirror the product card border/radius system so the entire page feels built from one component set. */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {enabledServices.map(service => {
            const Icon = getIconComponent(service.icon || 'Sparkles');
            const description = service.desc || service.description || service.worksDesc || '';

            return (
              <article
                key={service.id}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 ease-in-out hover:border-gray-300 hover:shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
                <h3
                  className="text-base font-semibold text-slate-900"
                  style={{ fontFamily: fonts.heading }}
                >
                  {service.title}
                </h3>
                {description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
                ) : null}
                <span className="mt-4 inline-block rounded-md border border-gray-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-500">
                  {service.works.length} items
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
