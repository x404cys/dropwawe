// THEME: modern-structured — AboutSection

'use client';

import Image from 'next/image';
import type { AboutSectionProps } from '../../../_lib/types';
import { buildContactItems } from '../../../_utils/contacts';

export default function ModernStructuredAboutSection({
  template,
  store,
  colors,
  fonts,
}: AboutSectionProps) {
  const aboutText =
    template.aboutText?.trim() ||
    template.storeDescription?.trim() ||
    store.description?.trim() ||
    '';

  if (!aboutText) return null;

  const metrics = [
    { value: template.services.length, label: 'Services' },
    { value: template.testimonials.length, label: 'Reviews' },
    {
      value: buildContactItems(template, store).filter(item => item.enabled).length,
      label: 'Contacts',
    },
  ];

  return (
    <section id="about-section" className="bg-white">
      <div className="mx-auto max-w-6xl border-t border-gray-200 px-6 py-20 lg:px-8">
        {/* DESIGN: About keeps the same two-column ratio and metric row so the section extends the structured system instead of breaking it. */}
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <p
              className="mb-3 text-xs font-medium tracking-widest uppercase"
              style={{ color: colors.accent, fontFamily: fonts.body }}
            >
              About
            </p>
            <h2
              className="mb-5 text-3xl font-semibold tracking-tight text-slate-900"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name}
            </h2>
            <p className="text-base leading-relaxed text-slate-500">{aboutText}</p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {metrics.map(metric => (
                <div key={metric.label} className="rounded-xl border border-gray-200 bg-white p-4">
                  <p
                    className="text-2xl font-semibold text-slate-900"
                    style={{ fontFamily: fonts.heading }}
                  >
                    {metric.value}
                  </p>
                  <p
                    className="mt-1 text-xs tracking-wide text-slate-400 uppercase"
                    style={{ fontFamily: fonts.body }}
                  >
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-slate-100">
            <div className="relative aspect-[4/3]">
              {store.image ? (
                <Image src={store.image} alt={store.name || ''} fill className="object-cover" />
              ) : (
                <div className="h-full w-full" style={{ backgroundColor: colors.primary }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
