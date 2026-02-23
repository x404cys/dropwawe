'use client';
import { useState, useEffect, useRef } from 'react';
import { TbCategoryPlus } from 'react-icons/tb';

type Props = {
  categories: string[];
  value: string;
  onChange: (val: string) => void;
  loading: boolean;
};

export default function CategoryDropdown({ categories, value, onChange, loading }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = categories.filter(cat => cat.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="relative w-full" ref={ref}>
      <div className="flex items-center gap-1">
        <TbCategoryPlus className="text-gray-600" />
        <label className="mb-1 block text-sm font-medium text-gray-600">
          التصنيف <span className="text-red-500">*</span>
        </label>
      </div>
      <input
        type="text"
        value={value}
        disabled={loading}
        onChange={e => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={
          filtered.length === 0
            ? 'مثلاً: هودي - نظارات - اكسسوارات'
            : ` المقترحات : ${filtered.slice(0, 3).join(' - ')}`
        }
        className="w-full rounded-2xl border px-3 py-2"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 max-h-48 w-full overflow-auto rounded border bg-white shadow-md">
          {filtered.map((cat, i) => (
            <li
              key={i}
              className="cursor-pointer px-3 py-2 hover:bg-green-100"
              onClick={() => {
                onChange(cat);
                setOpen(false);
              }}
            >
              {cat}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
