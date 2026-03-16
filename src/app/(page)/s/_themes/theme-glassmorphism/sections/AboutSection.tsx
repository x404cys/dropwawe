// THEME: glassmorphism — AboutSection

'use client';

import type { AboutSectionProps } from '../../../_lib/types';

export default function GlassmorphismAboutSection({
  template,
  store,
  colors,
  fonts,
}: AboutSectionProps) {
  const aboutText = template.aboutText ?? store.description ?? template.storeDescription ?? '';

  if (!aboutText.trim()) return null;

  return (
    <section
      id="about-section"
      className="relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top, ${colors.primary}10 0%, transparent 60%), ${colors.bg}`,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* DESIGN: About uses a restrained 60/40 split so content feels calm and readable inside the heavier glass environment. */}
        <div className="grid items-center gap-10 lg:grid-cols-[60%_40%]">
          <div>
            <p
              className="mb-3 text-xs tracking-widest uppercase"
              style={{ color: colors.accent, fontFamily: fonts.body }}
            >
              من نحن
            </p>
            <h2
              className="mb-5 text-3xl font-light tracking-tight text-white/90"
              style={{ fontFamily: fonts.heading }}
            >
              {store.name}
            </h2>
            <p className="text-base leading-relaxed text-white/55">{aboutText}</p>
          </div>

          <div
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl"
            style={{ boxShadow: `0 0 60px ${colors.primary}20` }}
          >
            {store.image ? (
              <img
                src={store.image}
                alt={store.name ?? ''}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex aspect-[4/3] items-center justify-center text-6xl font-light text-white/35"
                style={{ fontFamily: fonts.heading }}
              >
                {store.name?.slice(0, 1) ?? 'S'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
