'use client';

import { Input } from '@/components/ui/input';
import { Phone, Truck, User } from 'lucide-react';
import { InfoAlert } from '../../_components/info-alert';

interface ShippingSectionProps {
  phone: string;
  shippingPrice: string;
  fieldErrors: { [key: string]: string };
  onPhoneChange: (value: string) => void;
  onShippingPriceChange: (value: string) => void;
}

export default function ShippingSection({
  phone,
  shippingPrice,
  fieldErrors,
  onPhoneChange,
  onShippingPriceChange,
}: ShippingSectionProps) {
  return (
    <div className="flex flex-col space-y-4">
      <span className="flex items-center">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300"></span>

        <span className="shrink-0 px-4 text-gray-900">التوصيل الذاتي</span>

        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300"></span>
      </span>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">رقم الهاتف</label>
        <div className="relative">
          <Input
            value={phone}
            onChange={e => onPhoneChange(e.target.value)}
            placeholder="0770xxxxxxx"
          />
          <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.phone && <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">سعر التوصيل</label>
        <div className="relative">
          <Input
            value={shippingPrice}
            onChange={e => onShippingPriceChange(e.target.value)}
            placeholder="5000 د.ع"
          />
          <Truck className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
        {fieldErrors.shippingPrice && (
          <p className="mt-1 text-xs text-red-500">{fieldErrors.shippingPrice}</p>
        )}
      </div>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-gray-300"></span>

        <span className="shrink-0 px-4 text-gray-900">الربط مع شركة الوسيط</span>

        <span className="h-px flex-1 bg-linear-to-l from-transparent to-gray-300"></span>
      </span>
      <div>
        <User />
        <Input placeholder="ادخل userName الذي انشأته في تطبيق الوسيط" />
      </div>

      <InfoAlert message="سعر التوصيل سيكون لكل المنتجات" />
    </div>
  );
}
