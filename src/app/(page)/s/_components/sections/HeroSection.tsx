// Purpose: Hero section — Server Component.
// Gradient blobs, badge, split tagline, description, CTA buttons, stats row, scroll arrow.
// Pixel-perfect match to Storefront.tsx case "hero".
// Note: CTA buttons that scroll to sections must be handled separately client-side.
// We use <a> anchors for smooth scroll compat with Server Components.

import { Zap, ArrowDown } from 'lucide-react';
import { ActiveColors, StorefrontTemplate } from '../../_lib/types';

interface HeroSectionProps {
  template: StorefrontTemplate;
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function HeroSection({ template, colors, headingStyle }: HeroSectionProps) {
  const tagline = template.tagline ?? 'أفضل المنتجات بأفضل الأسعار';
  const words = tagline.split(' ');
  const half = Math.ceil(words.length / 2);
  const firstHalf = words.slice(0, half).join(' ');
  const secondHalf = words.slice(half).join(' ');
  const storeDescription =
    ((template as unknown as { storeDescription?: string | null }).storeDescription ?? '').trim();

  return (
    <section id="hero-section" className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${colors.primary}0F, transparent)` }}
      />
      <div
        className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}0A` }}
      />
      <div
        className="absolute bottom-10 left-10 w-56 h-56 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.accent}0A` }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6 border"
            style={{
              backgroundColor: `${colors.primary}15`,
              borderColor: `${colors.primary}30`,
            }}
          >
            <Zap className="h-3 w-3" style={{ color: colors.primary }} />
            <span className="text-[11px] font-semibold" style={{ color: colors.primary }}>
              منتجات مميزة • عروض حصرية
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight"
            style={{ ...headingStyle, color: colors.text }}
          >
            {firstHalf}
            <br />
            <span style={{ color: colors.primary }}>{secondHalf}</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed"
            style={{ color: `${colors.text}99` }}
          >
            {storeDescription}
          </p>

          {/* CTA buttons — anchor-based smooth scroll */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#store-section"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-[0.98] transition-all text-center"
              style={{
                backgroundColor: colors.primary,
                boxShadow: `0 10px 25px -5px ${colors.primary}40`,
              }}
            >
              {template.heroButtonText ?? 'تسوق الآن'}
            </a>
            <a
              href="#works-section"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold bg-card border border-border text-foreground hover:bg-muted transition-colors text-center"
            >
              {template.heroSecondaryButton ?? 'تعرف علينا'}
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {[
              { value: '٥,٠٠٠+', label: 'عميل سعيد' },
              { value: '١٥٠+', label: 'منتج' },
              { value: '٤.٩', label: 'تقييم' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-xl sm:text-2xl font-extrabold"
                  style={{ ...headingStyle, color: colors.text }}
                >
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: `${colors.text}66` }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <ArrowDown className="h-4 w-4 text-muted-foreground animate-bounce" />
      </div>
    </section>
  );
}
