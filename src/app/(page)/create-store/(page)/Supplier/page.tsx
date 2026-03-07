'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import type React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import {
  Store,
  Phone,
  Truck,
  Facebook,
  Instagram,
  Send,
  Check,
  Upload,
  X,
  Link2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentMethod {
  id: string;
  nameAr: string;
  nameEn: string;
  logo: string;
  alt: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'zain-cash',
    nameAr: 'زين كاش',
    nameEn: 'Zain Cash',
    logo: '/zain-cash-seeklogo.png',
    alt: 'Zain Cash',
  },
  {
    id: 'asia-pay',
    nameAr: 'اسيا باي',
    nameEn: 'Asia Pay',
    logo: '/asiapay-seeklogo.png',
    alt: 'Asia Pay',
  },
  {
    id: 'master-card',
    nameAr: 'ماستر كارد',
    nameEn: 'Master Card',
    logo: '/1933703_charge_credit card_debit_mastercard_payment_icon.png',
    alt: 'Master Card',
  },
];

const steps = [
  { id: 'basic', label: 'المعلومات الأساسية' },
  { id: 'shipping', label: 'التوصيل' },
  { id: 'social', label: 'الروابط الاجتماعية' },
  { id: 'payment', label: 'طرق الدفع' },
];
type ServerErrorDetail = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  error: string;
  details?: ServerErrorDetail[];
  field?: string;
};
export default function StoreSetupSupplier() {
  const { t } = useLanguage();
  const { update } = useSession();

  const [storeSlug, setStoreSlug] = useState('');
  const [storeName, setStoreName] = useState('');
  const [shippingPrice, setShippingPrice] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [facebookLink, setFacebook] = useState('');
  const [instaLink, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [activeSection, setActiveSection] = useState<number>(0);
  const router = useRouter();
  const handleSubmit = async () => {
    if (!storeSlug || !storeName || !description || !shippingPrice || !phone) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      setFieldErrors({});
      const formData = new FormData();
      formData.append('name', storeName);
      formData.append('subLink', storeSlug);
      formData.append('description', description);
      formData.append('shippingPrice', shippingPrice);
      formData.append('phone', phone);
      formData.append('facebookLink', facebookLink);
      formData.append('instaLink', instaLink);
      formData.append('telegram', telegram);
      formData.append('shippingType', 'default');
      formData.append('hasReturnPolicy', '__');
      formData.append('active', 'true');
      formData.append('selectedMethods', JSON.stringify(selectedMethods));

      if (imageFile) formData.append('image', imageFile);
      if (headerFile) formData.append('header', headerFile);

      const res = await fetch('/api/supplier/create', {
        method: 'POST',
        body: formData,
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
      await update();
      toast.success('تم الحفظ بنجاح ✨');
      router.back();
      router.replace('/Dashboard');
    } catch (err) {
      toast.error('حدث خطأ في الحفظ');
    } finally {
      setLoading(false);
    }
  };
  const toggleMethod = (methodId: string) => {
    setSelectedMethods(prev => {
      if (prev.includes(methodId)) {
        return prev.filter(id => id !== methodId);
      }
      return [...prev, methodId];
    });
  };

  const handleNext = () => {
    if (activeSection < steps.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const handlePrev = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  const ImageUpload = ({
    id,
    label,
    preview,
    onUpload,
    onRemove,
  }: {
    id: string;
    label: string;
    preview: string | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="group relative">
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
        />
        {preview ? (
          <div className="relative overflow-hidden rounded-xl border-2 border-border">
            <img
              src={preview || '/placeholder.svg'}
              alt="Preview"
              className="h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 rounded-full bg-card/90 p-1.5 shadow-lg transition hover:bg-card"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={id}
            className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-muted transition hover:border-gray-400 hover:bg-muted"
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">اضغط لرفع الصورة</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF</p>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">سجل كمورّد</h1>
          <p className="text-balance text-muted-foreground">
            انضم كمورّد الآن في دقائق، وابدأ بعرض منتجاتك للتجار والمتاجر بسهولة{' '}
          </p>
        </div>

        <div className="mb-8">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-4 sm:gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveSection(index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${index <= activeSection ? 'border-black bg-black text-white' : 'border-gray-300 bg-card text-muted-foreground'} `}
                  >
                    {index < activeSection ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </button>

                  <span className="mt-2 hidden text-[11px] font-medium text-muted-foreground sm:block">
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 w-8 transition-all sm:w-16 ${index < activeSection ? 'bg-black' : 'bg-muted'} `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-lg sm:p-8">
          {Object.keys(fieldErrors).length > 0 && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">يرجى تصحيح الأخطاء التالية:</p>
              <ul className="mt-2 list-inside list-disc text-xs text-red-700">
                {Object.values(fieldErrors).map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="min-h-[400px]">
            {activeSection === 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      رابط المتجر
                    </label>
                    <div className="relative">
                      <Input
                        value={storeSlug}
                        onChange={e => {
                          const value = e.target.value.toLowerCase();
                          if (/^[a-z0-9]*$/.test(value)) {
                            setStoreSlug(value);
                          }
                        }}
                        placeholder="متجري"
                        className={`pr-10 ${fieldErrors.subLink ? 'border-red-500' : ''}`}
                      />
                      <Link2 className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {storeSlug || 'متجري'}.matager.store
                    </p>
                    {fieldErrors.subLink && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.subLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground"> {t.profile.storeName} </label>
                    <div className="relative">
                      <Input
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                        placeholder="متجر الإلكترونيات"
                        className={`pr-10 ${fieldErrors.name ? 'border-red-500' : ''}`}
                      />
                      <Store className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {fieldErrors.name && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground"> {t.profile.storeDesc} </label>
                    <Textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="أضف وصفاً جذاباً لمتجرك..."
                      rows={4}
                      className={fieldErrors.description ? 'border-red-500' : ''}
                    />
                    {fieldErrors.description && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <ImageUpload
                    id="store-logo"
                    label="شعار المتجر"
                    preview={imagePreview}
                    onUpload={file => {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }}
                    onRemove={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  />
                  <ImageUpload
                    id="store-header"
                    label="صورة الغلاف"
                    preview={headerPreview}
                    onUpload={file => {
                      setHeaderFile(file);
                      setHeaderPreview(URL.createObjectURL(file));
                    }}
                    onRemove={() => {
                      setHeaderFile(null);
                      setHeaderPreview(null);
                    }}
                  />
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>ملاحظة:</strong> تغيير رابط المتجر لاحقاً سيؤدي إلى إعادة تعيين
                    إحصائيات الزيارات
                  </p>
                </div>
              </div>
            )}

            {activeSection === 1 && (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground"> {t.profile.phone} </label>
                    <div className="relative">
                      <Input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="07xxxxxxxxx"
                        className={`pr-10 ${fieldErrors.phone ? 'border-red-500' : ''}`}
                      />
                      <Phone className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      سعر التوصيل
                    </label>
                    <div className="relative">
                      <Input
                        value={shippingPrice}
                        onChange={e => setShippingPrice(e.target.value)}
                        placeholder="5000"
                        className={`pr-10 ${fieldErrors.shippingPrice ? 'border-red-500' : ''}`}
                      />
                      <Truck className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">بالدينار العراقي</p>
                    {fieldErrors.shippingPrice && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.shippingPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  أضف روابط حساباتك الاجتماعية لزيادة التواصل مع العملاء
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      فيسبوك (اختياري)
                    </label>
                    <div className="relative">
                      <Input
                        value={facebookLink}
                        onChange={e => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                        className={`pr-10 ${fieldErrors.facebookLink ? 'border-red-500' : ''}`}
                      />
                      <Facebook className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {fieldErrors.facebookLink && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.facebookLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      إنستغرام (اختياري)
                    </label>
                    <div className="relative">
                      <Input
                        value={instaLink}
                        onChange={e => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/yourpage"
                        className={`pr-10 ${fieldErrors.instaLink ? 'border-red-500' : ''}`}
                      />
                      <Instagram className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {fieldErrors.instaLink && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.instaLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      تيليجرام (اختياري)
                    </label>
                    <div className="relative">
                      <Input
                        value={telegram}
                        onChange={e => setTelegram(e.target.value)}
                        placeholder="https://t.me/yourpage"
                        className={`pr-10 ${fieldErrors.telegram ? 'border-red-500' : ''}`}
                      />
                      <Send className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                    {fieldErrors.telegram && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.telegram}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">طرق الدفع المتاحة</h3>
                  <p className="text-sm text-muted-foreground">اختر طرق الدفع التي تدعمها</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => toggleMethod(method.id)}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                        selectedMethods.includes(method.id)
                          ? 'border-black bg-muted'
                          : 'border-border bg-card hover:border-gray-300'
                      }`}
                    >
                      <div className="relative h-12 w-12 shrink-0">
                        <Image
                          src={method.logo || '/placeholder.svg'}
                          alt={method.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-medium text-foreground">{method.nameAr}</p>
                        <p className="text-xs text-muted-foreground">{method.nameEn}</p>
                      </div>
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          selectedMethods.includes(method.id)
                            ? 'border-black bg-black'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedMethods.includes(method.id) && (
                          <Check className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={activeSection === 0}
              className="gap-2 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
              السابق
            </Button>

            {activeSection === steps.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="gap-2 bg-black hover:bg-card"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ المتجر'}
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2 bg-black hover:bg-card">
                التالي
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
