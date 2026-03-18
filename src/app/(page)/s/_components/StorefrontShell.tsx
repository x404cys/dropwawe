'use client';

import { useLanguage } from '../_context/LanguageContext';
import type { StorefrontShellProps } from '../_lib/types';
import { getTheme } from '../_themes';

export default function StorefrontShell({
  store,
  template,
  products,
  colors,
  fonts,
  sections,
  announcement,
  topBanners,
  centerBanners = [],
  upStoreBanners,
  btwCatBanners,
  enabledCategorySections,
  style,
  className,
}: StorefrontShellProps) {
  const { dir, lang } = useLanguage();
  const theme = getTheme(6);
  const {
    AnnouncementBar,
    BannerCarousel,
    Navbar,
    HeroSection,
    ServicesSection,
    StoreSection,
    TestimonialsSection,

    CtaSection,
    AboutSection,
    Footer,
  } = theme.components;
  const hasAnnouncementBar = Boolean(announcement?.enabled);
  const rootDir = theme.forcedDir ?? dir;
  const contentOffsetClass =
    theme.contentOffsetClass ??
    (hasAnnouncementBar ? 'pt-[6.5rem] lg:pt-[7rem]' : 'pt-16 lg:pt-20');

  return (
    <div dir={rootDir} lang={lang} style={style} className={className}>
      {hasAnnouncementBar && announcement ? <AnnouncementBar config={announcement} /> : null}

      <Navbar
        store={store}
        template={template}
        colors={colors}
        fonts={fonts}
        sections={sections}
        hasAnnouncementBar={hasAnnouncementBar}
      />

      <div className={contentOffsetClass}>
        {topBanners.length > 0 ? <BannerCarousel banners={topBanners} colors={colors} /> : null}

        {sections.hero ? (
          <HeroSection store={store} template={template} colors={colors} fonts={fonts} />
        ) : null}

        {sections.services ? (
          <ServicesSection
            services={template.services}
            colors={colors}
            fonts={fonts}
            showWorksSection={sections.works}
          />
        ) : null}

        {sections.store ? (
          <StoreSection
            products={products}
            template={template}
            colors={colors}
            fonts={fonts}
            enabledCategorySections={enabledCategorySections}
            centerBanners={centerBanners}
            upStoreBanners={upStoreBanners}
            btwCatBanners={btwCatBanners}
          />
        ) : null}

        {sections.testimonials && template.testimonials.length > 0 ? (
          <TestimonialsSection testimonials={template.testimonials} colors={colors} fonts={fonts} />
        ) : null}

        {sections.cta ? (
          <CtaSection template={template} store={store} colors={colors} fonts={fonts} />
        ) : null}

        {sections.about ? (
          <AboutSection template={template} store={store} colors={colors} fonts={fonts} />
        ) : null}

        <Footer
          store={store}
          template={template}
          colors={colors}
          fonts={fonts}
          sections={sections}
        />
      </div>
    </div>
  );
}
