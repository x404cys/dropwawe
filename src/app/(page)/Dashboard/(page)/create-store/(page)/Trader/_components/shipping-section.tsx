'use client';

import { Input } from '@/components/ui/input';
import { Phone, Truck } from 'lucide-react';
import { InfoAlert } from './info-alert';

interface ShippingSectionProps {
  phone: string;
  shippingPrice: string;
  fieldErrors: { [key: string]: string };
  onPhoneChange: (value: string) => void;
  onShippingPriceChange: (value: string) => void;
}

export function ShippingSection({
  phone,
  shippingPrice,
  fieldErrors,
  onPhoneChange,
  onShippingPriceChange,
}: ShippingSectionProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
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
      </div>
      <div className="w-full mt-4">
        <InfoAlert message="سعر التوصيل سيكون لكل المنتجات" />
      </div>
    </>
  );
}
