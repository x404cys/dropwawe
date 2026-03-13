// Purpose: Services section — Server Component.
// 2×4 grid of service cards with icons. Matches Storefront.tsx case "services".

import { ActiveColors, StorefrontService } from '../../_lib/types';
import { getIconComponent } from '../../_utils/icons';

interface ServicesSectionProps {
  services: StorefrontService[];
  colors: ActiveColors;
  headingStyle: React.CSSProperties;
}

export default function ServicesSection({ services, colors, headingStyle }: ServicesSectionProps) {
  return (
    <section
      id="services-section"
      className="py-16 sm:py-20"
      style={{ backgroundColor: `${colors.primary}06` }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span
            className="text-[11px] font-semibold px-3 py-1 rounded-full"
            style={{ color: colors.primary, backgroundColor: `${colors.primary}15` }}
          >
            خدماتنا
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold mt-4"
            style={{ ...headingStyle, color: colors.text }}
          >
            ماذا نقدم لك؟
          </h2>
          <p
            className="text-xs sm:text-sm mt-2 max-w-md mx-auto"
            style={{ color: `${colors.text}88` }}
          >
            حلول شاملة تغطي جميع احتياجاتك
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {services.map((s, i) => {
            const SIcon = getIconComponent(s.icon);
            return (
              <div
                key={`${i}-${s.title}`}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 text-center hover:shadow-md transition-all group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <SIcon className="h-5 w-5" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
