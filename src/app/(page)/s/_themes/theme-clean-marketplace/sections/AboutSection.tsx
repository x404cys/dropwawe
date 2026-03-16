// THEME: clean-marketplace - AboutSection

'use client';

import Image from 'next/image';
import type { AboutSectionProps } from '../../../_lib/types';

export default function CleanMarketplaceAboutSection({
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

  return (
    <section id="about-section" className="bg-white px-4 py-16 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
        {/* DESIGN: About stays minimal and serviceable so the store still reads like an app, not a brand essay. */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: fonts.heading }}>
            {store.name}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">{aboutText}</p>
        </div>

        <div>
          {store.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
              <Image src={store.image} alt={store.name || ''} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-2xl" style={{ backgroundColor: colors.primary }} />
          )}
        </div>
      </div>
    </section>
  );
}
