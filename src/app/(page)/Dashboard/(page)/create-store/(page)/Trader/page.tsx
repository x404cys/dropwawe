'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import type { StoreProps } from '@/types/store/StoreType';
import { StepIndicator } from './_components/step-indicator';
import { BasicInfoSection } from './_components/basic-info-section';
import { ShippingSection } from './_components/shipping-section';
import { SocialLinksSection } from './_components/social-links-section';
import { NavigationButtons } from './_components/navigation-buttons';

type ServerErrorDetail = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  error: string;
  details?: ServerErrorDetail[];
  field?: string;
};

export default function StoreSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [store, setStore] = useState<StoreProps>();
  const [storeSlug, setStoreSlug] = useState('');
  const [storeName, setStoreName] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookLink, setFacebook] = useState('');
  const [instaLink, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [activeSection, setActiveSection] = useState<'basic' | 'shipping' | 'social'>('basic');

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchInfo = async () => {
      try {
        const res = await axios.get(`/api/storev2/info4setting/${session?.user?.id}`);
        if (res.data) return router.replace('/Dashboard');
      } catch (err) {
        console.error('Error fetching store info:', err);
      }
    };

    fetchInfo();
  }, [session?.user?.id]);

  const handleSubmit = async () => {
    if (!storeSlug || !storeName || !description || !shippingPrice || !phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});

      const payload = {
        subLink: storeSlug,
        name: storeName,
        description,
        shippingPrice,
        phone,
        facebookLink,
        instaLink,
        telegram,
        shippingType: 'default',
        hasReturnPolicy: '__',
        active: true,
      };

      const res = await fetch('/api/storev2/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: ServerErrorResponse = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errors: { [key: string]: string } = {};
          data.details.forEach(err => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
        } else if (data.field) {
          setFieldErrors({ [data.field]: data.error });
        } else {
          toast.error(data.error || 'حدث خطأ في الحفظ');
        }
        return;
      }
      toast.success('تم الحفظ بنجاح ✨');

      router.replace('/Dashboard');
    } catch (err) {
      toast.error('حدث خطأ في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const steps = ['basic', 'shipping', 'social', 'theme'];
    const currentIndex = steps.indexOf(activeSection);
    if (currentIndex < steps.length - 1) {
      setActiveSection(steps[currentIndex + 1] as 'basic' | 'shipping' | 'social');
    }
  };

  const handlePrevious = () => {
    const steps = ['basic', 'shipping', 'social', 'theme'];
    const currentIndex = steps.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(steps[currentIndex - 1] as 'basic' | 'shipping' | 'social');
    }
  };

  const hasErrors =
    fieldErrors.phone ||
    fieldErrors.shippingPrice ||
    fieldErrors.name ||
    fieldErrors.description ||
    fieldErrors.subLink ||
    fieldErrors.facebookLink ||
    fieldErrors.instaLink ||
    fieldErrors.telegram;

  return (
    <div dir="rtl" className="mx-auto mb-20 max-w-2xl space-y-10 py-10">
      <div className="text-center">
        <p className="text-sm font-medium">
          أنشئ متجرك الآن في دقائق، واحصل على رابط باسم متجرك وشاركه مع زبائنك لزيادة مبيعاتك 😎
        </p>
        <p className="text-xs text-gray-600">بِع أكثر، حتى وأنت نائم 🚀</p>
      </div>

      {hasErrors && (
        <div className="text-xs text-red-500">
          لديك أخطاء في احد الحقول او كلهم راجع التي عليها نقطة حمراء
        </div>
      )}

      <StepIndicator
        activeSection={activeSection}
        fieldErrors={fieldErrors}
        onStepChange={setActiveSection}
      />

      <div className="min-h-70 space-y-8">
        {activeSection === 'basic' && (
          <BasicInfoSection
            storeSlug={storeSlug}
            storeName={storeName}
            description={description}
            fieldErrors={fieldErrors}
            onStoreSlugChange={setStoreSlug}
            onStoreNameChange={setStoreName}
            onDescriptionChange={setDescription}
          />
        )}

        {activeSection === 'shipping' && (
          <ShippingSection
            phone={phone}
            shippingPrice={shippingPrice}
            fieldErrors={fieldErrors}
            onPhoneChange={setPhone}
            onShippingPriceChange={setShippingPrice}
          />
        )}

        {activeSection === 'social' && (
          <SocialLinksSection
            facebookLink={facebookLink}
            instaLink={instaLink}
            telegram={telegram}
            fieldErrors={fieldErrors}
            onFacebookChange={setFacebook}
            onInstagramChange={setInstagram}
            onTelegramChange={setTelegram}
          />
        )}

        {/* {activeSection === 'theme' && <ThemeSection />} */}
      </div>

      <NavigationButtons
        activeSection={activeSection}
        loading={loading}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
