'use client';
import { useLanguage } from '../../../../context/LanguageContext';

import React, { useState, useEffect, useMemo } from 'react';
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

export function ShippingSection({
  newProduct,
  setNewProduct,
  loading,
}: {
  newProduct: Partial<Product>;
  setNewProduct: (product: any) => void;
  loading: boolean;
}) {
  const { t } = useLanguage();
  
  const SHIPPING_OPTIONS = useMemo(() => [
    t.inventory?.delivery24h || 'التوصيل خلال 24 ساعة',
    t.inventory?.delivery2_3Days || 'التوصيل خلال 2-3 أيام',
    t.inventory?.delivery3_5Days || 'التوصيل خلال 3-5 أيام',
    t.inventory?.custom || 'مخصص',
  ], [t]);

  const RETURN_OPTIONS = useMemo(() => [
    t.inventory?.noReturn || 'لا يوجد استرجاع',
    t.inventory?.return7Days || 'استرجاع خلال 7 أيام',
    t.inventory?.return14Days || 'استرجاع خلال 14 يوم',
    t.inventory?.custom || 'مخصص'
  ], [t]);

  const [openShipping, setOpenShipping] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);

  const [selectedShipping, setSelectedShipping] = useState(
    SHIPPING_OPTIONS.includes(newProduct.shippingType || '') ? newProduct.shippingType : ''
  );
  const [selectedReturn, setSelectedReturn] = useState(
    RETURN_OPTIONS.includes(newProduct.hasReturnPolicy || '') ? newProduct.hasReturnPolicy : ''
  );

  const [customShipping, setCustomShipping] = useState(
    SHIPPING_OPTIONS.includes(newProduct.shippingType || '') ? '' : newProduct.shippingType || ''
  );
  const [customReturn, setCustomReturn] = useState(
    RETURN_OPTIONS.includes(newProduct.hasReturnPolicy || '')
      ? ''
      : newProduct.hasReturnPolicy || ''
  );

  useEffect(() => {
    if (selectedShipping === 'مخصص') {
      setNewProduct({ ...newProduct, shippingType: customShipping });
    }
  }, [customShipping]);

  useEffect(() => {
    if (selectedReturn === 'مخصص') {
      setNewProduct({ ...newProduct, hasReturnPolicy: customReturn });
    }
  }, [customReturn]);

  return (
    <div className="space-y-6">
      {/* SHIPPING */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <LiaShippingFastSolid className="h-4 w-4 text-muted-foreground" />
          {t.inventory?.deliveryTime || 'مدة التوصيل'}
        </label>

        <Popover open={openShipping} onOpenChange={setOpenShipping}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between rounded-xl">
              {selectedShipping || t.inventory?.selectDeliveryTime || 'اختر مدة التوصيل'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandList>
 
                {SHIPPING_OPTIONS.map(option => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      setSelectedShipping(option);
                      if (option !== (t.inventory?.custom || 'مخصص')) {
                        setNewProduct({ ...newProduct, shippingType: option });
                        setCustomShipping('');
                      } else {
                        setCustomShipping('');
                        setNewProduct({ ...newProduct, shippingType: '' });
                      }
                      setOpenShipping(false);
                    }}
                  >
                    {option}
                    {selectedShipping === option && <Check className="mr-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedShipping === (t.inventory?.custom || 'مخصص') && (
          <ModernInputGroup
            label=""
            type="text"
            value={customShipping}
            onChange={value => setCustomShipping(value)}
            placeholder={t.inventory?.enterDeliveryTime || 'اكتب مدة التوصيل'}
            disabled={loading}
          />
        )}
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium">
          <TbTruckReturn className="h-4 w-4 text-muted-foreground" />
          {t.inventory?.returnPolicy || 'سياسة الاسترجاع'}
        </label>

        <Popover open={openReturn} onOpenChange={setOpenReturn}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between rounded-xl">
              {selectedReturn || t.inventory?.selectReturnPolicy || 'اختر سياسة الاسترجاع'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={t.search || 'ابحث...'} />
              <CommandList>
                <CommandEmpty>{'لا يوجد خيار'}</CommandEmpty>

                {RETURN_OPTIONS.map(option => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => {
                      setSelectedReturn(option);
                      if (option !== (t.inventory?.custom || 'مخصص')) {
                        setNewProduct({ ...newProduct, hasReturnPolicy: option });
                        setCustomReturn('');
                      } else {
                        setCustomReturn('');
                        setNewProduct({ ...newProduct, hasReturnPolicy: '' });
                      }
                      setOpenReturn(false);
                    }}
                  >
                    {option}
                    {selectedReturn === option && <Check className="mr-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedReturn === (t.inventory?.custom || 'مخصص') && (
          <ModernInputGroup
            label=""
            type="text"
            value={customReturn}
            onChange={value => setCustomReturn(value)}
            placeholder={t.inventory?.enterReturnPolicy || 'اكتب سياسة الاسترجاع'}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
}
