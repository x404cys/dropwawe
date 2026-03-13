// Purpose: Works/Portfolio section — Server Component.
// 2×3 grid with hover overlay. Matches Storefront.tsx case "works".

import { PenTool, ExternalLink } from 'lucide-react';
import { ActiveColors, StorefrontWork } from '../../_lib/types';

interface WorksSectionProps {
  works: StorefrontWork[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function WorksSection({ works, colors, headingStyle }: WorksSectionProps) {
  return (
    <section id="works-section" className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
          >
            معرض الأعمال
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold mt-4"
            style={{ ...headingStyle, color: colors.text }}
          >
            أعمال نفتخر بها
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {works.map((work, i) => {
            const Wrapper = work.link ? 'a' : 'div';
            const wrapperProps = work.link
              ? { href: work.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Wrapper
                key={i}
                {...(wrapperProps as Record<string, string>)}
                className="group cursor-pointer block"
              >
                <div
                  className="aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden border border-border"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.accent}15)`,
                  }}
                >
                  <PenTool className="h-8 w-8 text-muted-foreground/20" />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center">
                      <ExternalLink className="h-5 w-5 text-background mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold text-background">
                        {work.link ? 'فتح الرابط' : 'عرض المشروع'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-2.5 px-1">
                  <h3 className="text-xs font-bold text-foreground">{work.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{work.category}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
