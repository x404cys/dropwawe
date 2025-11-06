'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog } from '@headlessui/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const LeafletLocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
});

export default function LocationSelector({
  onLocationSelected,
}: {
  onLocationSelected: (data: { lat: number; lng: number; address: string }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleMapSelect = (coords: { lat: number; lng: number }) => {
    setSelectedCoords(coords);
  };

  const handleSave = () => {
    if (selectedCoords) {
      onLocationSelected({
        lat: selectedCoords.lat,
        lng: selectedCoords.lng,
        address: manualAddress || 'موقع مختار من الخريطة',
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="flex-col space-y-2">
      <h2 className="text-center text-sm">عنوان التوصيل</h2>
      <div className="flex-col space-y-1 space-x-0.5">
        <Input
          placeholder="مثلا : بغداد - المنصور - 14 رمضان"
          value={manualAddress}
          onChange={e => setManualAddress(e.target.value)}
        />
        <Button type="button" className="w-full" variant="outline" onClick={() => setIsOpen(true)}>
          <MapPin className="me-1 h-4 w-4" /> اختر من الخريطة
        </Button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl space-y-4 rounded bg-white p-4 shadow-lg">
            <Dialog.Title className="text-lg font-bold">اختر الموقع من الخريطة</Dialog.Title>
            <div className="h-[300px] overflow-hidden rounded">
              <LeafletLocationPicker onLocationSelect={handleMapSelect} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSave}>تأكيد الموقع</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
