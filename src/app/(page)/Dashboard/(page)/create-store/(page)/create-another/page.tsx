'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import type { StoreProps } from '@/types/store/StoreType';

import { PiStorefront } from 'react-icons/pi';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline } from 'react-icons/io5';
import { BasicInfoSection } from '../Trader/_components/basic-info-section';
import { ShippingSection } from '../Trader/_components/shipping-section';
import { SocialLinksSection } from '../Trader/_components/social-links-section';
import { NavigationButtons } from '../Trader/_components/navigation-buttons';

type ServerErrorDetail = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  error: string;
  details?: ServerErrorDetail[];
  field?: string;
};

type StepId = 'basic' | 'shipping' | 'social';

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
  const [activeSection, setActiveSection] = useState<StepId>('basic');
  const [direction, setDirection] = useState(1);

  const steps: { id: StepId; label: string; icon: React.ReactNode }[] = [
    { id: 'basic', label: 'المعلومات الأساسية', icon: <PiStorefront size={24} /> },
    { id: 'shipping', label: 'التوصيل والاتصال', icon: <LiaShippingFastSolid size={24} /> },
    { id: 'social', label: 'الروابط الاجتماعية', icon: <IoShareSocialOutline size={24} /> },
  ];

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchInfo = async () => {
      try {
        const res = await axios.get(`/api/storev2/info4setting/${session?.user?.id}`);
        // if (res.data) return router.replace('/Dashboard');
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

      const res = await fetch('/api/storev2/create/create-another', {
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

      router.replace('/Dashboard/plans');
    } catch (err) {
      toast.error('حدث خطأ في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === activeSection);
    if (currentIndex < steps.length - 1) {
      setDirection(1);
      setActiveSection(steps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setDirection(-1);
      setActiveSection(steps[currentIndex - 1].id);
    }
  };

  const currentStepIndex = steps.findIndex(s => s.id === activeSection);

  const getCardStyle = (index: number) => {
    const diff = index - currentStepIndex;

    if (diff < 0) {
      return {
        opacity: 0,
        scale: 0.8,
        y: -100,
        zIndex: 0,
        display: 'none',
      };
    }

    if (diff === 0) {
      return {
        opacity: 1,
        scale: 1,
        y: 0,
        zIndex: 30,
        display: 'block',
      };
    }

    if (diff === 1) {
      return {
        opacity: 0.6,
        scale: 0.95,
        y: 20,
        zIndex: 20,
        display: 'block',
      };
    }

    if (diff === 2) {
      return {
        opacity: 0.3,
        scale: 0.9,
        y: 40,
        zIndex: 10,
        display: 'block',
      };
    }

    return {
      opacity: 0,
      scale: 0.85,
      y: 60,
      zIndex: 0,
      display: 'none',
    };
  };

  return (
    <div dir="rtl" className="bg-background min-h-screen">
      <div className="mx-auto max-w-3xl py-12">
        <div className="mb-12 space-y-3 text-center">
          <h1 className="text-foreground text-4xl font-semibold tracking-tight text-balance">
            أنشئ متجرك الثاني
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed text-pretty">
            انشاء متجرك الثاني بكل سهولة في خطوات بسيطة
          </p>
        </div>

        <div className="relative mx-auto mb-12 h-[600px] w-full max-w-2xl">
          {steps.map((step, index) => {
            const style = getCardStyle(index);

            return (
              <motion.div
                key={step.id}
                animate={style}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  pointerEvents: index === currentStepIndex ? 'auto' : 'none',
                }}
                className="origin-top"
              >
                <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-lg">
                  <div className="border-border bg-muted/30 border-b px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="text-primary-foreground flex h-14 w-14 items-center justify-center rounded-xl bg-sky-600">
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1 text-sm">
                          الخطوة {index + 1} من {steps.length}
                        </div>
                        <h2 className="text-foreground text-xl font-semibold">{step.label}</h2>
                      </div>
                    </div>
                  </div>

                  <div className="px-2 py-4">
                    <div className="min-h-[320px]">
                      {step.id === 'basic' && (
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

                      {step.id === 'shipping' && (
                        <ShippingSection
                          phone={phone}
                          shippingPrice={shippingPrice}
                          fieldErrors={fieldErrors}
                          onPhoneChange={setPhone}
                          onShippingPriceChange={setShippingPrice}
                        />
                      )}

                      {step.id === 'social' && (
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
                    </div>
                  </div>

                  <div className="border-border bg-muted/30 border-t px-8 py-6">
                    <NavigationButtons
                      activeSection={activeSection}
                      loading={loading}
                      onPrevious={handlePrevious}
                      onNext={handleNext}
                      onSubmit={handleSubmit}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all ${
                index === currentStepIndex
                  ? 'w-8 bg-sky-600'
                  : index < currentStepIndex
                    ? 'bg-primary/50 w-2'
                    : 'bg-muted w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
