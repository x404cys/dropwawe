'use client';

import React, { useState } from 'react';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { TbTruckReturn } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';

import { Check, ChevronDown } from 'lucide-react';
import { ModernInputGroup } from './ModernInputGroup';
import type { Product } from '@/types/Products';

const SHIPPING_OPTIONS = [
  'التوصيل خلال 24 ساعة',
  'التوصيل خلال 2-3 أيام',
  'التوصيل خلال 3-5 أيام',
  'مخصص',
];

const RETURN_OPTIONS = ['لا يوجد استرجاع', 'استرجاع خلال 7 أيام', 'استرجاع خلال 14 يوم', 'مخصص'];

export function ShippingSection({
  newProduct,
  setNewProduct,
  loading,
}: {
  newProduct: Partial<Product>;
  setNewProduct: (product: any) => void;
  loading: boolean;
}) {
  const [openShipping, setOpenShipping] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);

  return (
    <div className="space-y-6">
      {/* SHIPPING */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <LiaShippingFastSolid className="h-4 w-4 text-gray-400" />
          مدة التوصيل
        </label>

        <Popover open={openShipping} onOpenChange={setOpenShipping}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between rounded-xl">
              {newProduct.shippingType || 'اختر مدة التوصيل'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandList>
                <CommandEmpty>لا يوجد خيار</CommandEmpty>

                {SHIPPING_OPTIONS.map(option => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      setNewProduct({ ...newProduct, shippingType: option });
                      setOpenShipping(false);
                    }}
                  >
                    {option}

                    {newProduct.shippingType === option && <Check className="mr-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {newProduct.shippingType === 'مخصص' && (
          <ModernInputGroup
            label=""
            type="text"
            value=""
            onChange={value => setNewProduct({ ...newProduct, shippingType: value })}
            placeholder="اكتب مدة التوصيل"
            disabled={loading}
          />
        )}
      </div>

      {/* RETURN POLICY */}

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <TbTruckReturn className="h-4 w-4 text-gray-400" />
          سياسة الاسترجاع
        </label>

        <Popover open={openReturn} onOpenChange={setOpenReturn}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between rounded-xl">
              {newProduct.hasReturnPolicy || 'اختر سياسة الاسترجاع'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="ابحث..." />

              <CommandList>
                <CommandEmpty>لا يوجد خيار</CommandEmpty>

                {RETURN_OPTIONS.map(option => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      setNewProduct({
                        ...newProduct,
                        hasReturnPolicy: option,
                      });

                      setOpenReturn(false);
                    }}
                  >
                    {option}

                    {newProduct.hasReturnPolicy === option && <Check className="mr-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {newProduct.hasReturnPolicy === 'مخصص' && (
          <ModernInputGroup
            label=""
            type="text"
            value=""
            onChange={value => setNewProduct({ ...newProduct, hasReturnPolicy: value })}
            placeholder="اكتب سياسة الاسترجاع"
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
}
