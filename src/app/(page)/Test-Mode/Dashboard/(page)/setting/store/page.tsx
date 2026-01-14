'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import axios from 'axios';
import type { StoreProps } from '@/types/store/StoreType';
import { useDashboardData } from '../../../context/useDashboardData';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import BasicInfoSection from './(page)/basic-info-section/basic-info-section';
import ShippingSection from './(page)/shipping-section/shipping-section';
import SocialLinksSection from './(page)/social-links-section/social-links-section';
import ThemeSection from './(page)/theme-section/theme-section';
import PixelSection from './(page)/pixel-section/pixel-section';
import SettingOptions from './Setting-options';
import { SectionType } from '@/types/setting/Section';
import { CiBookmarkCheck } from 'react-icons/ci';
import { IoMdCheckmark } from 'react-icons/io';
import { MdOutlinePayments } from 'react-icons/md';

type ServerErrorDetail = { field: string; message: string };
type ServerErrorResponse = { error: string; details?: ServerErrorDetail[]; field?: string };

export default function StoreSetupPage() {
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
  const [facebookPixel, setFacebookPixel] = useState<string | null>(null);
  const [googlePixel, setGooglePixel] = useState<string | null>(null);
  const [tiktokPixel, setTiktokPixel] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [activeSection, setActiveSection] = useState<SectionType>('basic');

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(`/api/storev2/info4setting/${session?.user?.id}`);
        const storeData: StoreProps = res.data;

        setStore(storeData);
        setStoreSlug(storeData?.subLink ?? '');
        setStoreName(storeData?.name ?? '');
        setShippingPrice(storeData?.shippingPrice?.toString() ?? '');
        setDescription(storeData?.description ?? '');
        setPhone(storeData?.phone ?? '');
        setFacebook(storeData?.facebookLink ?? '');
        setInstagram(storeData?.instaLink ?? '');
        setTelegram(storeData?.telegram ?? '');
        setFacebookPixel(storeData?.facebookPixel ?? '');
        setGooglePixel(storeData?.googlePixel ?? '');
        setTiktokPixel(storeData?.tiktokPixel ?? '');
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
        facebookPixel,
        googlePixel,
        tiktokPixel,
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
        } else toast.error(data.error || 'حدث خطأ في الحفظ');

        return;
      }

      toast.success('تم الحفظ بنجاح');
      router.back();
    } catch {
      toast.error('حدث خطأ في الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const hasErrors = Object.keys(fieldErrors).length > 0;
  const path =
    session?.user.role === 'SUPPLIER'
      ? '/Dashboard/profit/profit-trader'
      : session?.user.role === 'DROPSHIPPER'
        ? '/Dashboard/profit/profit-dropshiper'
        : '/Dashboard/profit';

  return (
    <div dir="rtl" className="mx-auto max-w-4xl space-y-4">
      {hasErrors && (
        <div className="text-xs text-red-500">لديك أخطاء بالحقول راجع النقاط الحمراء</div>
      )}

      <SettingOptions
        activeSection={activeSection}
        onSectionChange={section => {
          setActiveSection(section);
          setIsSheetOpen(true);
        }}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          dir="rtl"
          side="bottom"
          className="z-50 mx-auto flex max-h-[90vh] min-h-[70vh] max-w-2xl translate-y-[0] flex-col overflow-hidden rounded-2xl border p-2 px-4 shadow-xl md:max-h-[90vh] md:min-h-[90vh]"
        >
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-gray-300" />

          <SheetHeader>
            <SheetTitle className="text-center text-lg font-semibold">إعدادات المتجر</SheetTitle>
          </SheetHeader>

          <div className="mt-4 flex-1 space-y-4 overflow-y-auto px-2">
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

            {activeSection === 'theme' && <ThemeSection />}
            {activeSection === 'withdraw' && (
              <div className="my-12 flex w-full flex-col items-center space-y-11">
                <div>
                  <span className="flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-4 text-xs">
                    لسحب الارياح اذهب صفحة العوائد
                    <MdOutlinePayments />
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => router.push(`${path}`)}
                    className="w-full cursor-pointer rounded-xl border bg-sky-500 bg-conic-270 px-24 py-2 text-white hover:bg-sky-100"
                  >
                    صفحة العوائد
                  </button>
                </div>
              </div>
            )}
            {activeSection === 'pixel' && (
              <PixelSection
                facebookPixel={facebookPixel}
                googlePixel={googlePixel}
                tiktokPixel={tiktokPixel}
                onFacebookPixelChange={setFacebookPixel}
                onGooglePixelChange={setGooglePixel}
                onTiktokPixelChange={setTiktokPixel}
              />
            )}

            <div
              className={`mt-4 flex justify-center ${activeSection === 'withdraw' ? 'hidden' : 'block'}`}
            >
              <Button
                disabled={loading && activeSection === 'withdraw'}
                onClick={handleSubmit}
                className="flex w-full cursor-pointer items-center gap-2 bg-sky-600 px-2 py-5 hover:bg-sky-400"
              >
                <IoMdCheckmark className="h-5 w-5" />
                {loading ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
