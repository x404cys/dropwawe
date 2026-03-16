// THEME: dark-luxury — ServicesSection

import BaseServicesSection from '../../../_components/sections/ServicesSection';
import type { ServicesSectionProps } from '../../../_lib/types';

export default function DarkLuxuryServicesSection({
  services,
  colors,
  fonts,
  showWorksSection,
}: ServicesSectionProps) {
  return (
    <BaseServicesSection
      services={services}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
      showWorksSection={showWorksSection}
    />
  );
}
