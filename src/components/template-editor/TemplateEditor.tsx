'use client';
// src/components/template-editor/TemplateEditor.tsx
// Main template editor client component.

import { useEffect, useState } from 'react';
import { Eye, Package, Palette, Phone, RotateCcw, Save, Type } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useTemplateEditor } from '@/hooks/useTemplateEditor';
import type {
  CategoryIconItem,
  ServiceItem,
  TemplateFormState,
  TestimonialItem,
  WorkItem,
} from '@/lib/template/types';
import { useHeroSectionEditor } from '@/app/(page)/Dashboard/(page)/setting/store/_hooks/useHeroSectionEditor';

import BrandTab from './tabs/BrandTab';
import ContactTab from './tabs/ContactTab';
import DesignTab from './tabs/DesignTab';
import StorefrontTab from './tabs/StorefrontTab';
import { createDefaultHero } from './utils/createDefaultHero';

type TabId = 'brand' | 'storefront' | 'design' | 'contact';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'brand', label: 'الهوية', icon: Type },
  { id: 'storefront', label: 'المتجر', icon: Package },
  { id: 'design', label: 'التصميم', icon: Palette },
  { id: 'contact', label: 'التواصل', icon: Phone },
];

interface TemplateEditorProps {
  initialData: TemplateFormState;
  storeId: string;
  storeName: string;
  storeDescription: string;
  storeLogoImage: string | null;
  categories: string[];
  storefrontUrl: string;
}

export default function TemplateEditor({
  initialData,
  storeId,
  storeName,
  storeDescription,
  storeLogoImage,
  categories,
  storefrontUrl,
}: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>('brand');
  const [logoImage, setLogoImage] = useState<string | null>(storeLogoImage);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [storeNameDraft, setStoreNameDraft] = useState(storeName);
  const [storeDescriptionDraft, setStoreDescriptionDraft] = useState(storeDescription);
  const [savedStoreName, setSavedStoreName] = useState(storeName);
  const [savedStoreDescription, setSavedStoreDescription] = useState(storeDescription);
  const [savedLogoImage, setSavedLogoImage] = useState<string | null>(storeLogoImage);
  const [isSavingStoreBasics, setIsSavingStoreBasics] = useState(false);

  const editor = useTemplateEditor({ initialData, storeId });
  const heroEditor = useHeroSectionEditor({
    initialHero:
      editor.formState.heroSection ??
      createDefaultHero(storeNameDraft, storeDescriptionDraft, editor.formState),
    storeId,
  });

  useEffect(() => {
    if (activeTab !== 'storefront') return;
    void editor.ensureCategoryIcons(categories);
  }, [activeTab, categories, editor.ensureCategoryIcons]);

  useEffect(() => {
    setStoreNameDraft(storeName);
    setSavedStoreName(storeName);
  }, [storeName]);

  useEffect(() => {
    setStoreDescriptionDraft(storeDescription);
    setSavedStoreDescription(storeDescription);
  }, [storeDescription]);

  useEffect(() => {
    setLogoImage(storeLogoImage);
    setSavedLogoImage(storeLogoImage);
    setLogoFile(null);
  }, [storeLogoImage]);

  const isStoreDirty =
    storeNameDraft !== savedStoreName ||
    storeDescriptionDraft !== savedStoreDescription ||
    logoImage !== savedLogoImage;

  const uploadStoreLogo = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/storev2/upload-image', {
      method: 'POST',
      body: formData,
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      throw new Error(data.error ?? 'Failed to upload logo');
    }
    return data.url;
  };

  const saveStoreBasics = async (): Promise<boolean> => {
    if (!isStoreDirty) return true;

    const normalizedName = storeNameDraft.trim();
    const normalizedDescription = storeDescriptionDraft.trim();
    if (!normalizedName) {
      toast.error('اسم المتجر مطلوب');
      return false;
    }
    if (!normalizedDescription) {
      toast.error('وصف المتجر مطلوب');
      return false;
    }

    setIsSavingStoreBasics(true);
    try {
      const logoChanged = logoImage !== savedLogoImage;
      let imageToSave: string | null | undefined = undefined;

      if (logoChanged) {
        if (logoFile) {
          imageToSave = await uploadStoreLogo(logoFile);
        } else if (logoImage === null) {
          imageToSave = null;
        } else if (logoImage && !logoImage.startsWith('data:')) {
          imageToSave = logoImage;
        } else {
          toast.error('يرجى إعادة اختيار الشعار');
          return false;
        }
      }

      const res = await fetch('/api/storev2/basic-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          name: normalizedName,
          description: normalizedDescription,
          ...(imageToSave !== undefined ? { image: imageToSave } : {}),
        }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        toast.error(data.error ?? 'فشل حفظ بيانات المتجر');
        return false;
      }

      if (imageToSave !== undefined) {
        setLogoImage(imageToSave);
        setSavedLogoImage(imageToSave);
        setLogoFile(null);
      }

      setStoreNameDraft(normalizedName);
      setStoreDescriptionDraft(normalizedDescription);
      setSavedStoreName(normalizedName);
      setSavedStoreDescription(normalizedDescription);
      return true;
    } catch (err) {
      toast.error((err as Error).message || 'حدث خطأ في حفظ بيانات المتجر');
      return false;
    } finally {
      setIsSavingStoreBasics(false);
    }
  };

  const handleSave = async () => {
    const hadHeroChanges = heroEditor.isDirty;
    const hadTemplateChanges = editor.isDirty;
    const hadStoreChanges = isStoreDirty;

    if (hadHeroChanges) {
      await heroEditor.saveHero();
    }

    if (hadTemplateChanges) {
      await editor.saveAll();
    }

    const storeSaved = await saveStoreBasics();

    if (!hadHeroChanges && !hadTemplateChanges && hadStoreChanges && storeSaved) {
      toast.success(' تم الحفظ بنجاح');
    }
  };

  const hasUnsavedChanges = heroEditor.isDirty || editor.isDirty || isStoreDirty;
  const isSavingChanges = heroEditor.isSaving || editor.isSaving || isSavingStoreBasics;

  const handlePreview = () => {
    window.open(storefrontUrl, '_blank');
  };

  const handleReset = () => {
    if (window.confirm('هل تريد إعادة تعيين جميع الإعدادات للقيم المحفوظة؟')) {
      window.location.reload();
    }
  };

  return (
    <div className="bg-background min-h-screen pb-36" dir="rtl">
      <div className="bg-background/90 sticky top-0 z-20 -mx-4 px-4 pt-1 pb-3 backdrop-blur-xl">
        <div className="bg-muted/50 flex gap-1 rounded-2xl p-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`template-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 space-y-4">
        {activeTab === 'brand' && (
          <BrandTab
            state={editor.formState}
            storeName={storeNameDraft}
            storeDescription={storeDescriptionDraft}
            heroEditor={heroEditor}
            onStoreNameChange={setStoreNameDraft}
            onStoreDescriptionChange={setStoreDescriptionDraft}
            logoImage={logoImage}
            onUpdate={editor.update}
            onLogoChange={setLogoImage}
            onLogoFileChange={setLogoFile}
            onAddService={editor.addService}
            onUpdateService={(id, fields) =>
              editor.updateService(id, fields as Partial<Omit<ServiceItem, 'id'>>)
            }
            uploadWorkImage={(serviceId, workId, file) =>
              editor.uploadWorkImage(serviceId, workId, file)
            }
            onRemoveService={editor.removeService}
            onAddWork={editor.addServiceWork}
            onUpdateWork={(serviceId, workId, fields) =>
              editor.updateServiceWork(serviceId, workId, fields as Partial<Omit<WorkItem, 'id'>>)
            }
            onRemoveWork={editor.removeServiceWork}
            onAddTestimonial={editor.addTestimonial}
            onUpdateTestimonial={(id, fields) =>
              editor.updateTestimonial(id, fields as Partial<Omit<TestimonialItem, 'id'>>)
            }
            onRemoveTestimonial={editor.removeTestimonial}
            onSaveBrandChanges={handleSave}
            hasUnsavedBrandChanges={hasUnsavedChanges}
            isSavingBrandChanges={isSavingChanges}
          />
        )}

        {activeTab === 'storefront' && (
          <StorefrontTab
            state={editor.formState}
            categories={categories}
            onUpdate={editor.update}
            onAddBanner={editor.addBanner}
            onRemoveBanner={editor.removeBanner}
            onUpdatePostionBanner={editor.updatePostionBanner}
            onAddCategorySection={editor.addCategorySection}
            onUpdateCategorySection={editor.updateCategorySection}
            onToggleCategorySection={editor.toggleCategorySection}
            onMoveCategorySection={editor.moveCategorySection}
            onRemoveCategorySection={editor.removeCategorySection}
            onUpdateCategoryIcon={(id, fields) =>
              editor.updateCategoryIcon(id, fields as Partial<Omit<CategoryIconItem, 'id'>>)
            }
          />
        )}

        {activeTab === 'design' && (
          <DesignTab
            state={editor.formState}
            storeName={storeNameDraft}
            onUpdate={editor.update}
            onRemoveCustomFont={editor.removeCustomFont}
            onAddCustomFont={editor.addCustomFont}
          />
        )}

        {activeTab === 'contact' && (
          <ContactTab state={editor.formState} onUpdate={editor.update} />
        )}
      </div>

      <div className="fixed right-0 bottom-20 left-0 z-30 mx-auto px-3 md:bottom-3 md:max-w-lg md:-translate-x-1/4">
        <div className="bg-card/95 border-border shadow-foreground/5 flex gap-1.5 rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl md:gap-2 md:rounded-2xl md:p-2">
          <Button
            onClick={handlePreview}
            variant="outline"
            className="h-9 flex-1 gap-1.5 rounded-lg text-xs font-semibold md:h-11 md:gap-2 md:rounded-xl md:text-sm"
            id="template-preview-btn"
          >
            <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
            معاينة
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSavingChanges || !hasUnsavedChanges}
            className={`h-9 flex-1 gap-1.5 rounded-lg text-xs font-semibold md:h-11 md:gap-2 md:rounded-xl md:text-sm ${
              hasUnsavedChanges ? '' : 'opacity-60'
            }`}
            id="template-save-btn"
          >
            <Save className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {isSavingChanges ? 'جارٍ الحفظ...' : 'حفظ'}
          </Button>

          <Button
            onClick={handleReset}
            variant="ghost"
            className="text-muted-foreground hover:text-destructive h-9 w-9 rounded-lg p-0 md:h-11 md:w-11 md:rounded-xl"
            title="إعادة تعيين"
            id="template-reset-btn"
          >
            <RotateCcw className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
