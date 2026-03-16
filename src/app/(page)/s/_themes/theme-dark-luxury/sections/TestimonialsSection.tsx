// THEME: dark-luxury — TestimonialsSection

import BaseTestimonialsSection from '../../../_components/sections/TestimonialsSection';
import type { TestimonialsSectionProps } from '../../../_lib/types';

export default function DarkLuxuryTestimonialsSection({
  testimonials,
  colors,
  fonts,
}: TestimonialsSectionProps) {
  return (
    <BaseTestimonialsSection
      testimonials={testimonials}
      colors={colors}
      headingStyle={{ fontFamily: fonts.heading }}
    />
  );
}
