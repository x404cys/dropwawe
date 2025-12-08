'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import axios from 'axios';
import type { StoreProps } from '@/types/store/StoreType';
import { useDashboardData } from '@/app/(page)/Dashboard/_utils/useDashboardData';

type ServerErrorDetail = {
  field: string;
  message: string;
};

type ServerErrorResponse = {
  error: string;
  details?: ServerErrorDetail[];
  field?: string;
};

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

export default function StoreSetupSupplier() {
  const { data: session } = useSession();
  const { data } = useDashboardData(session?.user?.id);
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
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [activeSection, setActiveSection] = useState<number>(0);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`/api/storev2/info4setting/${session?.user?.id}`);
        const storeData: StoreProps = res.data;

        setStore(storeData);
        setStoreSlug(storeData.subLink ?? '');
        setStoreName(storeData.name ?? '');
        setShippingPrice(storeData.shippingPrice?.toString() ?? '');
        setDescription(storeData.description ?? '');
        setPhone(storeData.phone ?? '');
        setFacebook(storeData.facebookLink ?? '');
        setInstagram(storeData.instaLink ?? '');
        setTelegram(storeData.telegram ?? '');
      } catch (err) {
        console.error('Error fetching store info:', err);
      }
    };

    fetchInfo();
  }, [data?.user?.id]);

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
      <label className="text-sm font-medium text-gray-900">{label}</label>
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
          <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
            <img
              src={preview || '/placeholder.svg'}
              alt="Preview"
              className="h-40 w-full object-cover"
            />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow-lg transition hover:bg-white"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={id}
            className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-400 hover:bg-gray-100"
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">اضغط لرفع الصورة</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">إعداد متجرك</h1>
          <p className="text-balance text-gray-600">
            انضم كمورّد الآن في دقائق، وابدأ بعرض منتجاتك للتجار والمتاجر بسهولة 🚀
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setActiveSection(index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      index <= activeSection
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {index < activeSection ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </button>
                  <span className="mt-2 hidden text-xs font-medium text-gray-600 sm:block">
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 transition-all ${index < activeSection ? 'bg-black' : 'bg-gray-300'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {/* Error Summary */}
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

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Basic Information */}
            {activeSection === 0 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
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
                      <Link2 className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {storeSlug || 'متجري'}.dropwave.cloud
                    </p>
                    {fieldErrors.subLink && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.subLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      اسم المتجر
                    </label>
                    <div className="relative">
                      <Input
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                        placeholder="متجر الإلكترونيات"
                        className={`pr-10 ${fieldErrors.name ? 'border-red-500' : ''}`}
                      />
                      <Store className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.name && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      وصف المتجر
                    </label>
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

            {/* Shipping Information */}
            {activeSection === 1 && (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      رقم الهاتف
                    </label>
                    <div className="relative">
                      <Input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="07xxxxxxxxx"
                        className={`pr-10 ${fieldErrors.phone ? 'border-red-500' : ''}`}
                      />
                      <Phone className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      سعر التوصيل
                    </label>
                    <div className="relative">
                      <Input
                        value={shippingPrice}
                        onChange={e => setShippingPrice(e.target.value)}
                        placeholder="5000"
                        className={`pr-10 ${fieldErrors.shippingPrice ? 'border-red-500' : ''}`}
                      />
                      <Truck className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">بالدينار العراقي</p>
                    {fieldErrors.shippingPrice && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.shippingPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            {activeSection === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600">
                  أضف روابط حساباتك الاجتماعية لزيادة التواصل مع العملاء
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      فيسبوك (اختياري)
                    </label>
                    <div className="relative">
                      <Input
                        value={facebookLink}
                        onChange={e => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                        className={`pr-10 ${fieldErrors.facebookLink ? 'border-red-500' : ''}`}
                      />
                      <Facebook className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.facebookLink && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.facebookLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      إنستغرام (اختياري)
                    </label>
                    <div className="relative">
                      <Input
                        value={instaLink}
                        onChange={e => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/yourpage"
                        className={`pr-10 ${fieldErrors.instaLink ? 'border-red-500' : ''}`}
                      />
                      <Instagram className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.instaLink && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.instaLink}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">
                      تيليجرام (اختياري)
                    </label>
                    <div className="relative">
                      <Input
                        value={telegram}
                        onChange={e => setTelegram(e.target.value)}
                        placeholder="https://t.me/yourpage"
                        className={`pr-10 ${fieldErrors.telegram ? 'border-red-500' : ''}`}
                      />
                      <Send className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.telegram && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.telegram}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeSection === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">طرق الدفع المتاحة</h3>
                  <p className="text-sm text-gray-600">اختر طرق الدفع التي تدعمها</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => toggleMethod(method.id)}
                      className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                        selectedMethods.includes(method.id)
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
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
                        <p className="font-medium text-gray-900">{method.nameAr}</p>
                        <p className="text-xs text-gray-500">{method.nameEn}</p>
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
                className="gap-2 bg-black hover:bg-gray-800"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ المتجر'}
                <Check className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="gap-2 bg-black hover:bg-gray-800">
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
