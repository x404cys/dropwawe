'use client';

import Image from 'next/image';
import { Package } from 'lucide-react';
import { ActiveColors, StorefrontWork } from '../../_lib/types';
import { useLanguage } from '../../_context/LanguageContext';
import { getIconComponent } from '../../_utils/icons';

interface WorksSectionProps {
  works: StorefrontWork[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function WorksSection({ works, colors, headingStyle }: WorksSectionProps) {
  const { t } = useLanguage();
  const items = works.filter(work => work.title || work.image || work.icon);

  if (items.length === 0) return null;

  return (
    <section id="works-section" className="border-b border-white/5 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
        <div className="mb-16 max-w-2xl">
          <p
            className="text-xs font-light tracking-[0.32em] uppercase opacity-40"
            style={{ color: colors.text }}
          >
            {t.works.badge}
          </p>
          <h2
            // REDESIGN: standalone works section follows the same editorial square-grid system.
            className="mt-6 text-4xl font-thin tracking-tight lg:text-6xl"
            style={{ ...headingStyle, color: colors.text }}
          >
            {t.works.heading}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-3">
          {items.map(work => {
            const WorkIcon = work.icon ? getIconComponent(work.icon) : Package;
            const Wrapper = work.link ? 'a' : 'div';

            return (
              <Wrapper
                key={work.id}
                {...(work.link
                  ? {
                      href: work.link,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }
                  : {})}
                className="group bg-white/[0.03]"
              >
                <div className="relative aspect-square overflow-hidden">
                  {work.displayType !== 'ICON' && work.image ? (
                    <Image
                      src={work.image}
                      alt={work.title || t.works.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-white/[0.02]">
                      <WorkIcon className="h-6 w-6 opacity-40" style={{ color: colors.text }} />
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <p
                    className="text-[10px] font-light tracking-[0.28em] uppercase opacity-45"
                    style={{ color: colors.text }}
                  >
                    {work.category}
                  </p>
                  <p className="text-sm font-light" style={{ color: colors.text }}>
                    {work.title || t.works.untitled}
                  </p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
