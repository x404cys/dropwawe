'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Phone, Search, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '../../../../../context/LanguageContext';

type OrderDetails = {
  id: string;
  fullName: string;
  location: string;
  phone: string;
};

type City = {
  id: string;
  city_name: string;
};

type Region = {
  id: string;
  region_name: string;
};

export default function LocationPage() {
  const { t, dir } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const searchIconPosition = dir === 'rtl' ? 'right-3' : 'left-3';
  const searchInputPadding = dir === 'rtl' ? 'pr-10' : 'pl-10';

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/details/${orderId}`, { credentials: 'include' });
        if (!res.ok) throw new Error();

        const data: OrderDetails = await res.json();
        setOrder(data);
      } catch {
        console.error(t.orders.loadFailed);
      }
    };

    void fetchOrder();
  }, [orderId, t.orders.loadFailed]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoadingCities(true);

      try {
        const res = await fetch('/api/delivery/al-waseet/citys');
        if (!res.ok) throw new Error();

        const data = await res.json();
        setCities(data.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error(t.orders.loadCitiesFailed);
      } finally {
        setLoadingCities(false);
      }
    };

    void fetchCities();
  }, [t.orders.loadCitiesFailed]);

  const handleCitySelect = async (cityId: string) => {
    setSelectedCity(cityId);
    setSelectedRegion('');
    setRegionSearch('');
    setShowDropdown(false);
    setRegions([]);
    setFilteredRegions([]);
    setLoadingRegions(true);

    try {
      const res = await fetch(`/api/delivery/al-waseet/regions?city_id=${cityId}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      const nextRegions: Region[] = data.data ?? [];
      setRegions(nextRegions);
      setFilteredRegions(nextRegions);
    } catch (error) {
      console.error(error);
      toast.error(t.orders.loadRegionsFailed);
    } finally {
      setLoadingRegions(false);
    }
  };

  useEffect(() => {
    if (!regionSearch.trim()) {
      setFilteredRegions(regions);
      return;
    }

    const normalizedSearch = regionSearch.toLowerCase();
    setFilteredRegions(
      regions.filter(region => region.region_name.toLowerCase().includes(normalizedSearch))
    );
  }, [regionSearch, regions]);

  const handleAcceptToDeliverWithWaseet = async () => {
    if (!selectedCity || !selectedRegion) {
      toast.error(t.orders.chooseCityAndRegionFirst);
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        toast.error(errorData?.error || t.orders.unknownError);
        return;
      }

      toast.success(t.orders.deliverySubmittedToAlwaseet);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error(t.orders.deliveryConnectionError);
    }
  };

  return (
    <div dir={dir} className="mx-auto max-w-xl space-y-8 p-6">
      <div className="bg-card rounded-xl border">
        <div className="bg-muted border-b px-6 py-4">
          <h2 className="text-lg font-semibold">{t.orders.customerInfo}</h2>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 text-neutral-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">{t.orders.name}</p>
              <p className="mt-1 font-medium">{order?.fullName}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-neutral-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">{t.orders.phone}</p>
              <p className="mt-1 font-medium" dir="ltr">
                {order?.phone}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-neutral-500" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">{t.orders.deliveryAddress}</p>
              <p className="mt-1 leading-relaxed font-medium">{order?.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">{t.orders.city}</p>

        <Select onValueChange={handleCitySelect}>
          <SelectTrigger className="w-full border bg-neutral-100">
            <SelectValue placeholder={loadingCities ? t.orders.cityLoading : t.orders.selectCity} />
          </SelectTrigger>

          <SelectContent>
            {loadingCities ? (
              <div className="p-3 text-neutral-500">{t.loading}</div>
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
        <p className="text-sm font-medium">{t.orders.region}</p>

        <div className="relative">
          <Search className={`absolute top-3 h-4 w-4 text-neutral-500 ${searchIconPosition}`} />

          <Input
            placeholder={t.orders.searchRegionPlaceholder}
            disabled={!selectedCity || loadingRegions}
            value={regionSearch}
            onChange={event => {
              setRegionSearch(event.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className={`bg-neutral-100 ${searchInputPadding}`}
          />

          {showDropdown && regionSearch && filteredRegions.length > 0 && (
            <div className="bg-card absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border shadow-xl">
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

          {showDropdown && regionSearch && filteredRegions.length === 0 && !loadingRegions && (
            <div className="bg-card absolute z-50 mt-1 w-full p-3 text-sm text-neutral-500">
              {t.noResults}
            </div>
          )}
        </div>

        <Select
          onValueChange={value => {
            setSelectedRegion(value);
            const selected = regions.find(region => region.id === value);
            if (selected) setRegionSearch(selected.region_name);
          }}
          disabled={!selectedCity || loadingRegions}
        >
          <SelectTrigger className="border bg-neutral-100">
            <SelectValue placeholder={t.orders.selectRegion} />
          </SelectTrigger>
          <SelectContent>
            {loadingRegions ? (
              <div className="p-3 text-neutral-500">{t.loading}</div>
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

      <Button
        disabled={!selectedCity || !selectedRegion || loadingRegions}
        onClick={handleAcceptToDeliverWithWaseet}
        className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
      >
        {t.orders.confirmSelection}
      </Button>
    </div>
  );
}
