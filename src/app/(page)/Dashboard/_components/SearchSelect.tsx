'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Search } from 'lucide-react';

interface SearchSelectProps {
  label: string;
  fetchUrl: string;
  selected: string | null;
  onSelect: (value: { id: number; name: string }) => void;
}

export function SearchSelect({ label, fetchUrl, selected, onSelect }: SearchSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    fetch(fetchUrl)
      .then(res => res.json())
      .then(d => {
        let cities = d.data?.map((x: any) => ({
          id: x.id,
          name: x.city_name || x.region_name,
        }));

        setData(cities);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full">
        <div className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm hover:bg-gray-50">
          <span className="text-gray-700">{selected ? selected : label}</span>
          <Search size={18} className="text-gray-500" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <h2 className="mb-3 text-lg font-semibold">{label}</h2>

        {!selected && (
          <Input
            placeholder="ابحث..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="mb-3"
          />
        )}

        {loading ? (
          <div className="flex justify-center py-5">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-64 rounded-xl border">
            {data.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item);
                  setOpen(false);
                }}
                className="cursor-pointer border-b px-4 py-3 hover:bg-gray-100"
              >
                {item.name}
              </div>
            ))}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
