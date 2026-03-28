'use client';

import { useRef, useState } from 'react';
import { Globe, PenTool, Quote, Trash2, Upload, Zap } from 'lucide-react';
import { CgWebsite } from 'react-icons/cg';
import { toast } from 'sonner';
import { useLanguage } from '@/app/(page)/Dashboard/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type {
  ServiceItem,
  TemplateFormState,
  TestimonialItem,
  WorkItem,
} from '@/lib/template/types';
import type { HeroSectionEditorController } from '@/app/(page)/Dashboard/(page)/setting/store/_hooks/useHeroSectionEditor';
import AboutSection from '../sections/AboutSection';
import CtaSection from '../sections/CtaSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import HeroButtonsTable, { type HeroButton } from '../sections/ButtonHeroSection';
import ServiceWithWorksSection from '../sections/WorksSection';
import ContentBlock from '../ui/ContentBlock';

interface BrandTabProps {
  state: TemplateFormState;
  storeName: string;
  storeDescription: string;
  heroEditor: HeroSectionEditorController;
  onStoreNameChange: (value: string) => void;
  onStoreDescriptionChange: (value: string) => void;
  logoImage: string | null;
  onUpdate: (partial: Partial<TemplateFormState>) => void;
  onLogoChange: (dataUrl: string | null) => void;
  onLogoFileChange: (file: File | null) => void;
  onAddService: () => void;
  onUpdateService: (id: string, fields: Partial<Omit<ServiceItem, 'id'>>) => void;
  onRemoveService: (id: string) => void;
  onAddWork: (serviceId: string) => void;
  onUpdateWork: (serviceId: string, workId: string, fields: Partial<Omit<WorkItem, 'id'>>) => void;
  onRemoveWork: (serviceId: string, workId: string) => void;
  onAddTestimonial: () => void;
  onUpdateTestimonial: (id: string, fields: Partial<Omit<TestimonialItem, 'id'>>) => void;
  onRemoveTestimonial: (id: string) => void;
  uploadWorkImage: (serviceId: string, workId: string, file: File) => void;
  onSaveBrandChanges: () => Promise<void>;
  hasUnsavedBrandChanges: boolean;
  isSavingBrandChanges: boolean;
}

type SectionId = 'hero' | 'services' | 'works' | 'testimonials' | 'cta' | 'about' | 'store';

export default function BrandTab({
  state,
  storeName,
  storeDescription,
  heroEditor,
  onStoreNameChange,
  onStoreDescriptionChange,
  logoImage,
  onUpdate,
  onLogoChange,
  onLogoFileChange,
  onAddService,
  onUpdateService,
  onRemoveService,
  onAddWork,
  onUpdateWork,
  onRemoveWork,
  uploadWorkImage,
  onAddTestimonial,
  onUpdateTestimonial,
  onRemoveTestimonial,
}: BrandTabProps) {
  const { t } = useLanguage();
  const tt = t.templateEditor;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);

  const defaultHeroButtons: HeroButton[] = [
    {
      id: 'btn-1',
      label: tt.heroButtons.primary,
      text: '',
      actionType: 'none',
      actionDetail: '',
      order: 0,
    },
    {
      id: 'btn-2',
      label: tt.heroButtons.secondary,
      text: '',
      actionType: 'none',
      actionDetail: '',
      order: 1,
    },
  ];

  const toggleOpen = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleSection = (id: SectionId) =>
    onUpdate({
      sectionsConfig: {
        ...state.sectionsConfig,
        [id]: !state.sectionsConfig[id],
      },
    });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(tt.validation.fileTooLarge2mb);
      return;
    }

    onLogoFileChange(file);

    const reader = new FileReader();
    reader.onloadend = () => onLogoChange(reader.result as string);
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border-border rounded-2xl border p-4">
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />

        <div className="mb-4 flex items-center gap-4">
          {logoImage ? (
            <div className="group relative">
              <img
                src={logoImage}
                alt=""
                className="border-border h-14 w-14 rounded-2xl border object-cover"
              />
              <div className="bg-foreground/50 absolute inset-0 flex items-center justify-center gap-1 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="bg-background/90 flex h-6 w-6 items-center justify-center rounded-lg"
                >
                  <Upload className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogoChange(null);
                    onLogoFileChange(null);
                  }}
                  className="bg-destructive/90 text-destructive-foreground flex h-6 w-6 items-center justify-center rounded-lg"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="bg-muted/50 border-border hover:border-primary/40 flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-dashed transition-all"
            >
              <Upload className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-[8px]">{tt.brand.logo}</span>
            </button>
          )}

          <div className="flex-1 space-y-2">
            <Input
              value={storeName}
              onChange={event => {
                const value = event.target.value;
                onStoreNameChange(value);

                if (!heroEditor.hero.title || heroEditor.hero.title === storeName) {
                  heroEditor.updateHero({ title: value });
                }
              }}
              className="rounded-xl font-light"
              placeholder={tt.brand.storeNamePlaceholder}
            />

            <Input
              value={state.tagline}
              onChange={event => {
                const value = event.target.value;
                onUpdate({ tagline: value });
                heroEditor.updateHero({ overline: value });
              }}
              className="rounded-xl font-light"
              placeholder={tt.brand.taglinePlaceholder}
            />
          </div>
        </div>

        <Textarea
          value={storeDescription}
          onChange={event => {
            const value = event.target.value;
            onStoreDescriptionChange(value);
            onUpdate({ storeDescription: value });
            heroEditor.updateHero({ description: value });
          }}
          rows={2}
          className="resize-none rounded-xl font-light"
          placeholder={tt.brand.descriptionPlaceholder}
        />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground px-1 text-xs font-semibold">
          {tt.brand.sectionsTitle}{' '}
          <span className="text-[10px] font-normal">({tt.brand.sectionsSubtitle})</span>
        </p>

        <ContentBlock
          title={tt.brand.hero}
          icon={<CgWebsite className="h-4 w-4" />}
          enabled={state.sectionsConfig.hero}
          onToggle={() => toggleSection('hero')}
          open={openSections.hero ?? false}
          onOpenToggle={() => toggleOpen('hero')}
        >
          <HeroButtonsTable
            buttons={state.heroButtons?.length ? state.heroButtons : defaultHeroButtons}
            onChange={buttons => onUpdate({ heroButtons: buttons })}
          />
        </ContentBlock>

        <ContentBlock
          title={tt.brand.services}
          icon={<Zap className="h-4 w-4" />}
          enabled={state.sectionsConfig.services}
          onToggle={() => toggleSection('services')}
          open={openSections.services ?? false}
          onOpenToggle={() => toggleOpen('services')}
          count={state.services.length}
        >
          <ServiceWithWorksSection
            services={state.services}
            onAddService={onAddService}
            onUpdateService={onUpdateService}
            onRemoveService={onRemoveService}
            onAddWork={onAddWork}
            onUpdateWork={onUpdateWork}
            onRemoveWork={onRemoveWork}
            onUploadWorkImage={uploadWorkImage}
          />
        </ContentBlock>

        <ContentBlock
          title={tt.brand.testimonials}
          icon={<Quote className="h-4 w-4" />}
          enabled={state.sectionsConfig.testimonials}
          onToggle={() => toggleSection('testimonials')}
          open={openSections.testimonials ?? false}
          onOpenToggle={() => toggleOpen('testimonials')}
          count={state.testimonials.length}
        >
          <TestimonialsSection
            testimonials={state.testimonials}
            onAdd={onAddTestimonial}
            onUpdate={onUpdateTestimonial}
            onRemove={onRemoveTestimonial}
          />
        </ContentBlock>

        <ContentBlock
          title={tt.brand.cta}
          icon={<Zap className="h-4 w-4" />}
          enabled={state.sectionsConfig.cta}
          onToggle={() => toggleSection('cta')}
          open={openSections.cta ?? false}
          onOpenToggle={() => toggleOpen('cta')}
        >
          <CtaSection
            ctaTitle={state.ctaTitle}
            ctaDesc={state.ctaDesc}
            ctaButton={state.ctaButton}
            onChange={onUpdate}
          />
        </ContentBlock>

        <ContentBlock
          title={tt.brand.about}
          icon={<Globe className="h-4 w-4" />}
          enabled={state.sectionsConfig.about}
          onToggle={() => toggleSection('about')}
          open={openSections.about ?? false}
          onOpenToggle={() => toggleOpen('about')}
        >
          <AboutSection
            aboutText={state.aboutText}
            onChange={value => onUpdate({ aboutText: value })}
          />
        </ContentBlock>

        <ContentBlock
          title={tt.brand.storeProducts}
          icon={<PenTool className="h-4 w-4" />}
          enabled={state.sectionsConfig.store}
          onToggle={() => toggleSection('store')}
          open={false}
          onOpenToggle={() => {}}
          noContent
        />
      </div>
    </div>
  );
}
