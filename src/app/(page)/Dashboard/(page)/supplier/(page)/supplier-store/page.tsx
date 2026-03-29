'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Link as LinkIcon,
  Store,
  FileText,
  Phone,
  Truck,
  Facebook,
  Instagram,
  Send,
  Save,
  Settings,
  Link,
} from 'lucide-react';
import axios from 'axios';
import { StoreProps } from '@/types/store/StoreType';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { IoShareSocialOutline } from 'react-icons/io5';
import { MdOutlinePayments, MdOutlineStyle, MdPayment } from 'react-icons/md';
import { PiStorefront } from 'react-icons/pi';
import { FaRegWindowRestore } from 'react-icons/fa';
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
  const { t, dir } = useLanguage();
  const pageT = t.dashboardPages.supplierStoreSetup;
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
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [activeSection, setActiveSection] = useState<'basic' | 'shipping' | 'social' | 'payment'>(
    'basic'
  );

  const handleSubmit = async () => {
    if (!storeSlug || !storeName || !description || !shippingPrice || !phone) {
      toast.error(pageT.requiredFieldsError);
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
          toast.error(data.error || pageT.saveError);
        }
        return;
      }
      toast.success(pageT.saveSuccess);
      router.back();
      router.replace('/Dashboard');
    } catch (err) {
      toast.error(pageT.saveError);
    } finally {
      setLoading(false);
    }
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

  const toggleMethod = (methodId: string) => {
    setSelectedMethods(prev => {
      if (prev.includes(methodId)) {
        return prev.filter(id => id !== methodId);
      }

      return [...prev, methodId];
    });
  };

  return (
    <div dir={dir} className="mx-auto mb-20 max-w-2xl space-y-10 py-10">
      <div>
        <h1 className="text-foreground flex items-center gap-2 text-2xl font-bold">
          <div className=" ">
            <Image
              src={'/IMG_3549.PNG'}
              alt="Image"
              width={50}
              height={20}
              className="bg-muted rounded-lg border"
            />
          </div>
          {pageT.title}
        </h1>
        <p className="text-sm font-medium">{pageT.subtitle}</p>
        <p className="text-muted-foreground text-xs">{pageT.caption}</p>
      </div>

      {/* <div className="absolute top-15 left-1.5 -z-50 md:left-25">
        <Image src={'/bg-logo.png'} alt="2" width={150} height={150} />
      </div> */}
      {(fieldErrors.phone ||
        fieldErrors.shippingPrice ||
        fieldErrors.name ||
        fieldErrors.description ||
        fieldErrors.subLink ||
        fieldErrors.facebookLink ||
        fieldErrors.instaLink ||
        fieldErrors.telegram) && <div className="text-xs text-red-500">{pageT.errorsHint}</div>}
      <div className="w-full">
        <div className="w-full">
          <div className="relative z-10 flex justify-around">
            {[
              { id: 'basic', label: pageT.basicStep, icon: <PiStorefront /> },
              { id: 'shipping', label: pageT.shippingStep, icon: <LiaShippingFastSolid /> },
              { id: 'social', label: pageT.socialStep, icon: <IoShareSocialOutline /> },
              { id: 'payment', label: pageT.paymentStep, icon: <MdOutlinePayments /> },
            ].map(step => {
              const hasError =
                (step.id === 'basic' &&
                  (fieldErrors.name || fieldErrors.description || fieldErrors.subLink)) ||
                (step.id === 'shipping' && (fieldErrors.phone || fieldErrors.shippingPrice)) ||
                (step.id === 'social' &&
                  (fieldErrors.facebookLink || fieldErrors.instaLink || fieldErrors.telegram));

              return (
                <button
                  key={step.id}
                  className={`relative flex cursor-pointer flex-col items-center gap-1 ${
                    activeSection === step.id ? 'text-white' : 'text-black'
                  }`}
                  onClick={() =>
                    setActiveSection(step.id as 'basic' | 'shipping' | 'social' | 'payment')
                  }
                >
                  <div
                    className={`relative rounded-full p-2 transition-all duration-300 ${
                      activeSection === step.id ? 'scale-108 bg-black' : 'bg-muted'
                    }`}
                  >
                    {step.icon}
                    {hasError && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-red-500"></span>
                    )}
                  </div>
                  <p className="text-sm">{step.label}</p>
                </button>
              );
            })}
          </div>

          <div className="bg-muted relative mt-1 h-1 rounded-full">
            <div
              className="absolute top-0 right-0 h-1 rounded-full bg-black transition-all duration-300"
              style={{
                width:
                  activeSection === 'basic'
                    ? '25%'
                    : activeSection === 'shipping'
                      ? '50%'
                      : activeSection === 'social'
                        ? '75%'
                        : '100%',
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="min-h-70 space-y-8">
        {activeSection === 'basic' && (
          <>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                {pageT.storeLink}{' '}
                <span className="text-muted-foreground text-xs">{storeSlug}.matager.store</span>
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
                  placeholder="store1.matager.store"
                />

                <Link className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">{t.profile.storeName}</label>
              <div className="relative">
                <Input
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder={t.profile.storeName}
                />
                <Store className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              </div>
              {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                {t.inventory.description}
              </label>
              <div className="relative">
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={pageT.descriptionPlaceholder}
                />
                <FileText className="text-muted-foreground absolute top-3 left-3 h-5 w-5" />
              </div>
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.description}</p>
              )}
            </div>

            <label htmlFor="">
              <span>{pageT.logoLabel}</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="store-logo"
                className="bg-muted hover:bg-muted dark:hover:bg-card relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                    >
                      {pageT.removeImage}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <svg
                      className="text-muted-foreground dark:text-muted-foreground mb-4 h-8 w-8"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-muted-foreground dark:text-muted-foreground mb-2 text-sm">
                      <span className="font-semibold">{pageT.uploadHintPrimary}</span>{' '}
                      {pageT.uploadHintSecondary}
                    </p>
                    <p className="text-muted-foreground dark:text-muted-foreground text-xs">
                      {pageT.uploadFormats}
                    </p>
                  </div>
                )}

                <input
                  id="store-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>

            <label htmlFor="">
              <span>{pageT.headerLabel}</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="store-header"
                className="bg-muted hover:bg-muted dark:hover:bg-card relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {headerPreview ? (
                  <>
                    <img
                      src={headerPreview}
                      alt="Preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        setHeaderFile(null);
                      }}
                      className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
                    >
                      {pageT.removeImage}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <svg
                      className="text-muted-foreground dark:text-muted-foreground mb-4 h-8 w-8"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-muted-foreground dark:text-muted-foreground mb-2 text-sm">
                      <span className="font-semibold">{pageT.uploadHintPrimary}</span>{' '}
                      {pageT.uploadHintSecondary}
                    </p>
                    <p className="text-muted-foreground dark:text-muted-foreground text-xs">
                      {pageT.uploadFormats}
                    </p>
                  </div>
                )}

                <input
                  id="store-header"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setHeaderFile(file);
                      setHeaderPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>

            <div>
              <div
                className="bg-muted text-foreground dark:bg-card flex items-center rounded-lg border border-gray-300 p-4 text-sm dark:border-gray-600 dark:text-gray-300"
                role="alert"
              >
                <svg
                  className="me-3 inline h-4 w-4 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="text-sm font-medium">
                    {t.store?.domainChangeWarning}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {t.store?.domainChangeSubwarning}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeSection === 'shipping' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">{t.profile.phone}</label>
              <div className="relative">
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="0770xxxxxxx"
                />
                <Phone className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              </div>
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">
                {pageT.shippingPriceLabel}
              </label>
              <div className="relative">
                <Input
                  value={shippingPrice}
                  onChange={e => setShippingPrice(e.target.value)}
                  placeholder={pageT.shippingPlaceholder}
                />
                <Truck className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              </div>
              {fieldErrors.shippingPrice && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.shippingPrice}</p>
              )}
            </div>
            <div>
              <div
                className="bg-muted text-foreground dark:bg-card flex items-center rounded-lg border border-gray-300 p-4 text-sm dark:border-gray-600 dark:text-gray-300"
                role="alert"
              >
                <svg
                  className="me-3 inline h-4 w-4 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="text-sm font-medium">{pageT.shippingPriceInfo}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'social' && (
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                label: 'Facebook',
                value: facebookLink,
                setValue: setFacebook,
                icon: Facebook,
                field: 'facebookLink',
                placeholder: pageT.facebookPlaceholder,
              },
              {
                label: 'Instagram',
                value: instaLink,
                setValue: setInstagram,
                icon: Instagram,
                field: 'instaLink',
                placeholder: pageT.instagramPlaceholder,
              },
              {
                label: 'Telegram',
                value: telegram,
                setValue: setTelegram,
                icon: Send,
                field: 'telegram',
                placeholder: pageT.telegramPlaceholder,
              },
            ].map(({ label, value, setValue, icon: Icon, field, placeholder }) => (
              <div key={field} className="space-y-2">
                <label className="text-foreground text-sm font-medium">{label}</label>
                <div className="relative">
                  <Input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={placeholder}
                  />
                  <Icon className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                </div>
                {fieldErrors[field] && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors[field]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'payment' && (
          <div className="flex flex-col justify-center space-y-8">
            <p className="text-foreground">
              {selectedMethods.length > 0 ? selectedMethods.join(' - ') : pageT.noPaymentMethods}
            </p>
            <div>
              <div
                className="bg-muted text-foreground dark:bg-card flex items-center rounded-lg border border-gray-300 p-4 text-sm dark:border-gray-600 dark:text-gray-300"
                role="alert"
              >
                <svg
                  className="me-3 inline h-4 w-4 shrink-0"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="text-sm font-medium">{pageT.paymentHint}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {paymentMethods.map(method => {
                const isSelected = selectedMethods.includes(method.id);

                return (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
                      isSelected
                        ? 'border-foreground/20 bg-muted/50 shadow-sm'
                        : 'border-border bg-card hover:border-foreground/20 hover:bg-muted/30'
                    } `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMethod(method.id)}
                          className="border-muted-foreground/30 text-foreground focus:ring-foreground/20 h-5 w-5 cursor-pointer rounded border-2 transition-colors focus:ring-2"
                        />
                      </div>
                      <span className="text-foreground text-sm font-medium">
                        {method.nameAr} | {method.nameEn}
                      </span>
                    </div>

                    <div className="flex-shrink-0">
                      <Image
                        src={method.logo || '/placeholder.svg'}
                        width={60}
                        height={60}
                        alt={method.alt}
                        className="object-contain"
                      />
                    </div>
                  </label>
                );
              })}
            </div>
            {/* <div role="alert" className="rounded-md border-s-4 border-green-600 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>

                <strong className="font-medium">تخصيص الموقع قريبًا</strong>
              </div>

              <p className="mt-2 text-sm text-green-600">
                قريبًا ستتمكن من تخصيص عرض المنتجات، الألوان، والمزايا الأخرى في نسخة سهل{' '}
                <strong>v2.0.0</strong>
              </p>
            </div> */}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          className="bg-muted rounded-lg px-6 py-2 text-black transition hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            const steps = ['basic', 'shipping', 'social', 'payment'];
            const currentIndex = steps.indexOf(activeSection);
            if (currentIndex > 0)
              setActiveSection(
                steps[currentIndex - 1] as 'basic' | 'shipping' | 'social' | 'payment'
              );
          }}
          disabled={activeSection === 'basic'}
        >
          {pageT.previous}
        </button>

        <button
          className="hover:bg-card rounded-lg bg-black px-6 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            const steps = ['basic', 'shipping', 'social', 'payment'];
            const currentIndex = steps.indexOf(activeSection);
            if (currentIndex < steps.length - 1)
              setActiveSection(
                steps[currentIndex + 1] as 'basic' | 'shipping' | 'social' | 'payment'
              );
          }}
          disabled={activeSection === 'payment'}
        >
          {pageT.next}
        </button>
      </div>
      {activeSection === 'payment' && (
        <div className="flex justify-end">
          <Button
            disabled={loading}
            onClick={handleSubmit}
            className="flex h-12 w-full items-center gap-2 rounded-3xl md:hidden"
          >
            <FaRegWindowRestore className="h-4 w-4" />
            {loading ? pageT.creating : pageT.createStore}
          </Button>
          <div className="hidden justify-end md:flex">
            <Button disabled={loading} onClick={handleSubmit} className="flex items-center gap-2">
              <FaRegWindowRestore className="h-4 w-4" />
              {loading ? pageT.creating : pageT.createStore}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
