'use client';

import CustomInput from '@/app/(page)/Dashboard/_components/InputStyle';
import { RiLinksFill } from 'react-icons/ri';

interface PixelSectionProps {
  facebookPixel: string | null;
  googlePixel: string | null;
  tiktokPixel: string | null;
  onFacebookPixelChange: (value: string) => void;
  onGooglePixelChange: (value: string) => void;
  onTiktokPixelChange: (value: string) => void;
}

export default function PixelSection({
  facebookPixel,
  googlePixel,
  tiktokPixel,
  onFacebookPixelChange,
  onGooglePixelChange,
  onTiktokPixelChange,
}: PixelSectionProps) {
  return (
    <div>
      <CustomInput
        type="text"
        placeholder=" "
        icon={<RiLinksFill className="h-4 w-4" />}
        label="بيكسل الفيسبوك - FaceBoock Pixel"
        value={facebookPixel || ''}
        onChange={e => onFacebookPixelChange(e.target.value)}
      />
      <CustomInput
        type="text"
        placeholder=" "
        icon={<RiLinksFill className="h-4 w-4" />}
        label="بيكسل كوكل - Google Pixel"
        value={googlePixel || ''}
        onChange={e => onGooglePixelChange(e.target.value)}
      />
      <CustomInput
        type="text"
        placeholder="  "
        icon={<RiLinksFill className="h-4 w-4" />}
        label="بيكسل تيك توك - TikTok Pixel"
        value={tiktokPixel || ''}
        onChange={e => onTiktokPixelChange(e.target.value)}
      />

      <div
        role="alert"
        className="mt-5 mb-5 rounded-md border-s-4 border-blue-400 bg-blue-50 p-4 text-xs"
      >
        <div className="flex items-center gap-2 text-blue-400">
          <strong className="text-xs font-medium">تابع زوار متجرك بدقة مع Pixel</strong>
        </div>
        <p className="mt-2 text-xs text-blue-400">
          اعرف من يزور متجرك، المنتجات التي يهتم بها، وحسّن حملاتك الإعلانية على Facebook،
          Instagram، Google وTikTok. كل خطوة يقوم بها زائرك تُسجل بدقة لتزيد مبيعاتك وتحسن استهدافك
        </p>
      </div>
    </div>
  );
}
