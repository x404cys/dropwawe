'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Search, User } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import { useParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

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

export default function LocationPage() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const [regionSearch, setRegionSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/details/${orderId}`, { credentials: 'include' });
        const data = await res.json();
        setOrder(data);
      } catch {
        console.error('فشل في جلب بيانات الطلب');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

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
    setSelectedCity(cityId);
    setSelectedRegion('');
    setRegionSearch('');
    setShowDropdown(false);

    setLoadingRegions(true);
    setRegions([]);
    setFilteredRegions([]);

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

  useEffect(() => {
    if (!regionSearch.trim()) {
      setFilteredRegions(regions);
      return;
    }

    const list = regions.filter(item =>
      item.region_name.toLowerCase().includes(regionSearch.toLowerCase())
    );

    setFilteredRegions(list);
  }, [regionSearch, regions]);
  const handleAcceptToDeliverWithWaseet = async (orderId: string) => {
    if (!selectedCity || !selectedRegion) {
      toast.error('يرجى اختيار المدينة والمنطقة أولاً');
      return;
    }

    try {
      const res = await fetch(`/api/orders/option/deliver-by-alwaseet/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityId: selectedCity,
          regionId: selectedRegion,
        }),
      });

      if (res.ok) {
        toast.success('تم معالجة الطلب، راجع تطبيق الوسيط');
        router.back();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || 'حدث خطأ غير متوقع');
      }
    } catch (err) {
      console.error(err);
      toast.error('حدث خطأ في الاتصال بالخادم');
    }
  };

  return (
    <div dir="rtl" className="mx-auto max-w-xl space-y-8 p-6">
      <div className="rounded-xl border bg-white">
        <div className="border-b bg-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold">معلومات العميل</h2>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 text-neutral-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">الاسم</p>
              <p className="mt-1 font-medium">{order?.fullName}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-neutral-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">رقم الهاتف</p>
              <p className="mt-1 font-medium" dir="ltr">
                {order?.phone}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-neutral-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">عنوان التوصيل</p>
              <p className="mt-1 leading-relaxed font-medium">{order?.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">المدينة</p>

        <Select onValueChange={handleCitySelect}>
          <SelectTrigger className="w-full border bg-neutral-100">
            <SelectValue placeholder={loadingCities ? 'جارِ تحميل المدن...' : 'اختر المدينة'} />
          </SelectTrigger>

          <SelectContent>
            {loadingCities ? (
              <div className="p-3 text-neutral-500">جارِ التحميل...</div>
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
        <p className="text-sm font-medium">المنطقة</p>

        <div className="relative">
          <Search className="absolute top-3 right-3 h-4 w-4 text-neutral-500" />

          <Input
            placeholder="ابحث عن المنطقة..."
            disabled={!selectedCity}
            value={regionSearch}
            onChange={e => {
              setRegionSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="bg-neutral-100 pr-10"
          />

          {showDropdown && regionSearch && filteredRegions.length > 0 && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-xl">
              {filteredRegions.map(region => (
                <div
                  key={region.id}
                  onClick={() => {
                    setRegionSearch(region.region_name);
                    setSelectedRegion(region.id);
                    setShowDropdown(false);
                  }}
                  className="cursor-pointer p-2 text-sm hover:bg-neutral-100"
                >
                  {region.region_name}
                </div>
              ))}
            </div>
          )}

          {showDropdown && regionSearch && filteredRegions.length === 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white p-3 text-sm text-neutral-500">
              لا توجد نتائج
            </div>
          )}
        </div>

        <Select onValueChange={v => setSelectedRegion(v)} disabled={!selectedCity}>
          <SelectTrigger className="border bg-neutral-100">
            <SelectValue placeholder="اختر المنطقة" />
          </SelectTrigger>
          <SelectContent>
            {filteredRegions.map(region => (
              <SelectItem key={region.id} value={region.id}>
                {region.region_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        disabled={!selectedCity || !selectedRegion}
        onClick={() => handleAcceptToDeliverWithWaseet(orderId)}
        className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
      >
        تأكيد الاختيار
      </Button>
    </div>
  );
}
