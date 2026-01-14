'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Product = { name?: string; image?: string };
type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product?: Product;
  size: string;
  color: string;
};
export type OrderDetails = {
  id: string;
  fullName: string;
  location: string;
  phone: string;
  createdAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  items: OrderItem[];
};
interface City {
  id: string;
  city_name: string;
}

interface Region {
  id: string;
  region_name: string;
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

interface Props {
  city: string;
  setCity: SetState<string>;

  region: string;
  setRegion: SetState<string>;

  triggerText?: string;

  setOpenAccept: SetState<boolean>;
}

export default function CityRegionDialog({
  city,
  setCity,
  region,
  setRegion,
  setOpenAccept,
  triggerText = 'اختيار الموقع',
}: Props) {
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const [regionSearch, setRegionSearch] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch('/api/delivery/al-waseet/citys');
        const data = await res.json();
        setCities(data.data);
      } catch (err) {
        console.error(err);
      }
      setLoadingCities(false);
    };

    fetchCities();
  }, []);

  const handleCitySelect = async (cityId: string) => {
    setCity(cityId);
    setRegion('');
    setRegionSearch('');
    setLoadingRegions(true);

    try {
      const res = await fetch(`/api/delivery/al-waseet/regions?city_id=${cityId}`);
      const data = await res.json();
      setRegions(data.data);
      setFilteredRegions(data.data);
    } catch (err) {
      console.error(err);
    }

    setLoadingRegions(false);
  };

  // ---------------- FILTER REGIONS ----------------
  useEffect(() => {
    if (!regionSearch.trim()) {
      setFilteredRegions(regions);
    } else {
      setFilteredRegions(
        regions.filter(item => item.region_name.toLowerCase().includes(regionSearch.toLowerCase()))
      );
    }
  }, [regionSearch, regions]);

  return (
    <Dialog>
      <DialogTrigger
        onClick={() => setOpenAccept(false)}
        className="rounded-md bg-gray-950 px-4 py-2 text-white transition hover:bg-neutral-800"
      >
        {triggerText}
      </DialogTrigger>

      <DialogContent className="max-w-lg space-y-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900">
            اختيار المدينة والمنطقة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700">المدينة</p>

          <Select onValueChange={handleCitySelect}>
            <SelectTrigger className="w-full border-neutral-300 bg-neutral-100">
              <SelectValue placeholder={loadingCities ? 'جاري تحميل المدن...' : 'اختر المدينة'} />
            </SelectTrigger>

            <SelectContent className="border border-neutral-200 bg-white shadow-lg">
              {loadingCities ? (
                <div className="p-3 text-sm text-neutral-500">جاري التحميل...</div>
              ) : (
                cities.map(city => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.city_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-700">المنطقة</p>

          <div className="relative">
            <Search className="absolute top-3 right-3 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="بحث عن المنطقة..."
              disabled={!city}
              value={regionSearch}
              onChange={e => setRegionSearch(e.target.value)}
              className="border-neutral-300 bg-neutral-100 pr-10"
            />
          </div>

          <Select onValueChange={value => setRegion(value)} disabled={!city || loadingRegions}>
            <SelectTrigger className="w-full border-neutral-300 bg-neutral-100">
              <SelectValue
                placeholder={loadingRegions ? 'جاري تحميل المناطق...' : 'اختر المنطقة'}
              />
            </SelectTrigger>

            <SelectContent className="max-h-60 overflow-auto border border-neutral-200 bg-white shadow-lg">
              {loadingRegions ? (
                <div className="p-3 text-sm text-neutral-500">جاري التحميل...</div>
              ) : filteredRegions.length === 0 ? (
                <div className="p-3 text-sm text-neutral-500">لا توجد نتائج</div>
              ) : (
                filteredRegions.map(region => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.region_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
